
<?php
/**
 * Content planner class for creating content plans.
 */
class DCG_Content_Planner {
    
    /**
     * Constructor.
     */
    public function __construct() {
        // Constructor code here
    }
    
    /**
     * Generate a content plan based on website analysis.
     * 
     * @param int $analysis_id Analysis ID.
     * @return array|WP_Error Content plan or error.
     */
    public function generate_content_plan($analysis_id) {
        global $wpdb;
        
        // Get analysis data
        $table_name = $wpdb->prefix . 'dcg_content_analysis';
        
        $analysis = $wpdb->get_row($wpdb->prepare(
            "SELECT * FROM $table_name WHERE id = %d",
            $analysis_id
        ));
        
        if (!$analysis) {
            return new WP_Error('invalid_analysis', __('Analysis not found.', 'doorillio-content-generator'));
        }
        
        $analysis_data = json_decode($analysis->analysis_data, true);
        
        if (!$analysis_data) {
            return new WP_Error('invalid_analysis_data', __('Invalid analysis data.', 'doorillio-content-generator'));
        }
        
        try {
            // Generate content clusters
            $content_clusters = $this->generate_content_clusters($analysis_data);
            
            // Generate content calendar
            $content_calendar = $this->generate_content_calendar($content_clusters);
            
            // Generate pillar content suggestions
            $pillar_content = $this->generate_pillar_content_suggestions($analysis_data);
            
            $plan_data = array(
                'content_clusters' => $content_clusters,
                'content_calendar' => $content_calendar,
                'pillar_content' => $pillar_content,
                'analysis_id' => $analysis_id,
                'timestamp' => current_time('mysql')
            );
            
            // Store content plan in database
            $plan_id = $this->save_content_plan($plan_data);
            
            if (!$plan_id) {
                return new WP_Error('plan_save_failed', __('Failed to save content plan.', 'doorillio-content-generator'));
            }
            
            $plan_data['plan_id'] = $plan_id;
            
            // Cache the results for faster access
            set_transient('dcg_content_plan', $plan_data, DAY_IN_SECONDS);
            
            return $plan_data;
        } catch (Exception $e) {
            return new WP_Error('plan_generation_failed', $e->getMessage());
        }
    }
    
    /**
     * Generate content clusters based on analysis data.
     * 
     * @param array $analysis_data Analysis data.
     * @return array Content clusters.
     */
    private function generate_content_clusters($analysis_data) {
        $clusters = array();
        
        // Get content gaps from analysis
        $content_gaps = isset($analysis_data['content_gaps']) ? $analysis_data['content_gaps'] : array();
        
        // Topic gaps represent potential clusters
        $topic_gaps = isset($content_gaps['topic_gaps']) ? $content_gaps['topic_gaps'] : array();
        
        // Group by parent topic
        $grouped_topics = array();
        
        foreach ($topic_gaps as $topic) {
            $parent = isset($topic['parent']) ? $topic['parent'] : $topic['topic'];
            
            if (!isset($grouped_topics[$parent])) {
                $grouped_topics[$parent] = array();
            }
            
            $grouped_topics[$parent][] = $topic;
        }
        
        // Create clusters
        foreach ($grouped_topics as $parent => $topics) {
            $pillar = $parent;
            $subtopics = array();
            
            foreach ($topics as $topic) {
                if (isset($topic['level']) && $topic['level'] === 'sub') {
                    $subtopics[] = array(
                        'topic' => $topic['topic'],
                        'priority' => isset($topic['priority']) ? $topic['priority'] : 'medium'
                    );
                } elseif (isset($topic['level']) && $topic['level'] === 'main') {
                    // This is a main topic description
                    $pillar = $topic['topic'];
                }
            }
            
            // Only add clusters with subtopics
            if (!empty($subtopics)) {
                $clusters[] = array(
                    'pillar' => $pillar,
                    'subtopics' => $subtopics
                );
            }
        }
        
        // If we don't have enough clusters from content gaps,
        // let's generate some based on categories
        if (count($clusters) < 3) {
            $categories = isset($analysis_data['categories']) ? $analysis_data['categories'] : array();
            
            // Take top categories
            $top_categories = array_slice($categories, 0, 5);
            
            foreach ($top_categories as $category) {
                $exists = false;
                
                // Check if this category is already covered in existing clusters
                foreach ($clusters as $cluster) {
                    if (stripos($cluster['pillar'], $category['name']) !== false || 
                        stripos($category['name'], $cluster['pillar']) !== false) {
                        $exists = true;
                        break;
                    }
                }
                
                if (!$exists) {
                    $clusters[] = array(
                        'pillar' => $category['name'],
                        'subtopics' => $this->generate_subtopics_for_category($category['name'])
                    );
                }
            }
        }
        
        // Add keyword suggestions to clusters
        $keyword_opportunities = isset($analysis_data['keyword_opportunities']) ? $analysis_data['keyword_opportunities'] : array();
        
        foreach ($clusters as &$cluster) {
            $cluster['keywords'] = $this->match_keywords_to_cluster($cluster['pillar'], $keyword_opportunities);
        }
        
        return $clusters;
    }
    
    /**
     * Generate subtopics for a category.
     * 
     * @param string $category Category name.
     * @return array Subtopics.
     */
    private function generate_subtopics_for_category($category) {
        $subtopics = array();
        
        // Map category to potential subtopics
        $category_lower = strtolower($category);
        
        // Nutrition related
        if (stripos($category_lower, 'nutrition') !== false || stripos($category_lower, 'food') !== false || 
            stripos($category_lower, 'diet') !== false || stripos($category_lower, 'eating') !== false) {
            $subtopics = array(
                array('topic' => 'Macronutrient Balance', 'priority' => 'high'),
                array('topic' => 'Meal Planning for ' . $category, 'priority' => 'high'),
                array('topic' => 'Supplementation Guide', 'priority' => 'medium'),
                array('topic' => 'Nutrient Timing', 'priority' => 'medium'),
                array('topic' => $category . ' for Weight Management', 'priority' => 'high'),
                array('topic' => 'Nutrition Myths and Facts', 'priority' => 'medium')
            );
        } 
        // Fitness related
        elseif (stripos($category_lower, 'fitness') !== false || stripos($category_lower, 'workout') !== false || 
               stripos($category_lower, 'exercise') !== false || stripos($category_lower, 'training') !== false) {
            $subtopics = array(
                array('topic' => $category . ' for Beginners', 'priority' => 'high'),
                array('topic' => 'Advanced ' . $category . ' Techniques', 'priority' => 'medium'),
                array('topic' => $category . ' Equipment Guide', 'priority' => 'medium'),
                array('topic' => 'Recovery Strategies for ' . $category, 'priority' => 'high'),
                array('topic' => $category . ' Program Design', 'priority' => 'high'),
                array('topic' => 'Common ' . $category . ' Mistakes', 'priority' => 'medium')
            );
        }
        // Mental health related
        elseif (stripos($category_lower, 'mental') !== false || stripos($category_lower, 'stress') !== false || 
               stripos($category_lower, 'anxiety') !== false || stripos($category_lower, 'wellness') !== false) {
            $subtopics = array(
                array('topic' => 'Daily ' . $category . ' Practices', 'priority' => 'high'),
                array('topic' => $category . ' and Physical Health Connection', 'priority' => 'high'),
                array('topic' => 'Professional Help for ' . $category . ' Issues', 'priority' => 'medium'),
                array('topic' => $category . ' for Different Age Groups', 'priority' => 'medium'),
                array('topic' => 'Technology and ' . $category, 'priority' => 'medium'),
                array('topic' => $category . ' in the Workplace', 'priority' => 'high')
            );
        }
        // Lifestyle related
        elseif (stripos($category_lower, 'lifestyle') !== false || stripos($category_lower, 'living') !== false || 
               stripos($category_lower, 'productivity') !== false || stripos($category_lower, 'habit') !== false) {
            $subtopics = array(
                array('topic' => 'Building ' . $category . ' Habits', 'priority' => 'high'),
                array('topic' => $category . ' Transformations', 'priority' => 'high'),
                array('topic' => 'Minimalist ' . $category, 'priority' => 'medium'),
                array('topic' => 'Technology for ' . $category . ' Improvement', 'priority' => 'medium'),
                array('topic' => $category . ' Design Principles', 'priority' => 'medium'),
                array('topic' => 'Measuring ' . $category . ' Progress', 'priority' => 'high')
            );
        }
        // Default/general
        else {
            $subtopics = array(
                array('topic' => 'Getting Started with ' . $category, 'priority' => 'high'),
                array('topic' => 'Advanced ' . $category . ' Strategies', 'priority' => 'medium'),
                array('topic' => $category . ' Best Practices', 'priority' => 'high'),
                array('topic' => 'Common ' . $category . ' Mistakes', 'priority' => 'medium'),
                array('topic' => $category . ' Tools and Resources', 'priority' => 'medium'),
                array('topic' => 'Future Trends in ' . $category, 'priority' => 'low')
            );
        }
        
        return $subtopics;
    }
    
    /**
     * Match keywords to a cluster.
     * 
     * @param string $cluster_topic Cluster topic.
     * @param array $keyword_opportunities Keyword opportunities.
     * @return array Matched keywords.
     */
    private function match_keywords_to_cluster($cluster_topic, $keyword_opportunities) {
        $matched_keywords = array();
        
        foreach ($keyword_opportunities as $opportunity) {
            $category = $opportunity['category'];
            
            if (stripos($category, $cluster_topic) !== false || stripos($cluster_topic, $category) !== false) {
                $matched_keywords = array_merge($matched_keywords, $opportunity['keywords']);
                break;
            }
        }
        
        // If no direct match, find partial matches
        if (empty($matched_keywords)) {
            foreach ($keyword_opportunities as $opportunity) {
                foreach ($opportunity['keywords'] as $keyword) {
                    if (stripos($keyword['keyword'], $cluster_topic) !== false || stripos($cluster_topic, $keyword['keyword']) !== false) {
                        $matched_keywords[] = $keyword;
                    }
                }
            }
        }
        
        // If still no matches, use the first set of keywords available
        if (empty($matched_keywords) && !empty($keyword_opportunities)) {
            $matched_keywords = $keyword_opportunities[0]['keywords'];
        }
        
        return $matched_keywords;
    }
    
    /**
     * Generate a content calendar based on content clusters.
     * 
     * @param array $clusters Content clusters.
     * @return array Content calendar.
     */
    private function generate_content_calendar($clusters) {
        $calendar = array();
        
        // Current date
        $current_date = current_time('Y-m-d');
        
        // Number of weeks to plan
        $weeks = 12;
        
        // Number of articles per week (start with 2, can be adjusted)
        $articles_per_week = 2;
        
        // Flatten all subtopics from all clusters
        $all_subtopics = array();
        
        foreach ($clusters as $cluster) {
            $pillar = $cluster['pillar'];
            
            foreach ($cluster['subtopics'] as $subtopic) {
                $all_subtopics[] = array(
                    'topic' => $subtopic['topic'],
                    'pillar' => $pillar,
                    'priority' => $subtopic['priority']
                );
            }
        }
        
        // Sort by priority (high > medium > low)
        usort($all_subtopics, function($a, $b) {
            $priority_values = array(
                'high' => 3,
                'medium' => 2,
                'low' => 1
            );
            
            $a_priority = isset($priority_values[$a['priority']]) ? $priority_values[$a['priority']] : 0;
            $b_priority = isset($priority_values[$b['priority']]) ? $priority_values[$b['priority']] : 0;
            
            return $b_priority - $a_priority;
        });
        
        // Add pillar content first (one per month)
        $pillar_dates = array();
        $month_count = ceil($weeks / 4);
        
        for ($i = 0; $i < $month_count; $i++) {
            $month_offset = $i * 28; // Approximately 4 weeks
            $date = date('Y-m-d', strtotime("$current_date + $month_offset days"));
            
            // Target the first week of each month
            $pillar_date = date('Y-m-d', strtotime("$date + " . rand(0, 5) . " days"));
            $pillar_dates[] = $pillar_date;
            
            if (isset($clusters[$i])) {
                $calendar[] = array(
                    'date' => $pillar_date,
                    'topic' => $clusters[$i]['pillar'],
                    'type' => 'pillar',
                    'cluster' => $clusters[$i]['pillar'],
                    'description' => 'Comprehensive guide about ' . $clusters[$i]['pillar']
                );
            }
        }
        
        // Plan cluster content
        $planned_count = count($calendar);
        $total_needed = $weeks * $articles_per_week;
        $remaining = $total_needed - $planned_count;
        
        // If we need more articles than available subtopics, repeat some
        if ($remaining > count($all_subtopics)) {
            $all_subtopics = array_merge($all_subtopics, $all_subtopics);
        }
        
        // Take only the number of subtopics needed
        $selected_subtopics = array_slice($all_subtopics, 0, $remaining);
        
        // Distribute subtopics across weeks, avoiding pillar content dates
        $current_week = 0;
        
        foreach ($selected_subtopics as $subtopic) {
            // Increment week counter
            $current_week++;
            
            // Wrap back to first week if needed
            if ($current_week > $weeks) {
                $current_week = 1;
            }
            
            // Calculate date for this article
            $days_offset = ($current_week - 1) * 7 + rand(0, 6);
            $date = date('Y-m-d', strtotime("$current_date + $days_offset days"));
            
            // Check if this date already has pillar content
            $has_pillar = false;
            foreach ($pillar_dates as $pillar_date) {
                if ($date === $pillar_date) {
                    $has_pillar = true;
                    break;
                }
            }
            
            // If date has pillar content, move to next day
            if ($has_pillar) {
                $date = date('Y-m-d', strtotime("$date + 1 days"));
            }
            
            $calendar[] = array(
                'date' => $date,
                'topic' => $subtopic['topic'],
                'type' => 'cluster',
                'cluster' => $subtopic['pillar'],
                'description' => 'Detailed article about ' . $subtopic['topic']
            );
        }
        
        // Sort calendar by date
        usort($calendar, function($a, $b) {
            return strtotime($a['date']) - strtotime($b['date']);
        });
        
        return $calendar;
    }
    
    /**
     * Generate pillar content suggestions based on analysis data.
     * 
     * @param array $analysis_data Analysis data.
     * @return array Pillar content suggestions.
     */
    private function generate_pillar_content_suggestions($analysis_data) {
        $suggestions = array();
        
        // Get categories
        $categories = isset($analysis_data['categories']) ? $analysis_data['categories'] : array();
        
        // Get content gaps
        $content_gaps = isset($analysis_data['content_gaps']) ? $analysis_data['content_gaps'] : array();
        $topic_gaps = isset($content_gaps['topic_gaps']) ? $content_gaps['topic_gaps'] : array();
        
        // Find main topic gaps
        $main_topics = array();
        
        foreach ($topic_gaps as $topic) {
            if (isset($topic['level']) && $topic['level'] === 'main') {
                $main_topics[] = $topic['topic'];
            }
        }
        
        // If we don't have enough main topics, use top categories
        if (count($main_topics) < 5 && !empty($categories)) {
            foreach ($categories as $category) {
                if (!in_array($category['name'], $main_topics)) {
                    $main_topics[] = $category['name'];
                    
                    if (count($main_topics) >= 5) {
                        break;
                    }
                }
            }
        }
        
        // For each main topic, create a pillar content suggestion
        foreach ($main_topics as $topic) {
            $article_title = $this->generate_pillar_article_title($topic);
            
            $suggestions[] = array(
                'topic' => $topic,
                'title' => $article_title,
                'description' => $this->generate_pillar_content_description($topic),
                'word_count' => rand(1800, 3500),
                'sections' => $this->generate_pillar_content_sections($topic)
            );
        }
        
        return $suggestions;
    }
    
    /**
     * Generate a title for a pillar article.
     * 
     * @param string $topic Topic.
     * @return string Article title.
     */
    private function generate_pillar_article_title($topic) {
        $current_year = date('Y');
        
        $templates = array(
            'The Ultimate Guide to %s (%d)',
            'Complete %s Guide: Everything You Need to Know',
            '%s Mastery: A Comprehensive Resource',
            'Understanding %s: The Complete Guide for %d',
            'The Definitive %s Handbook: From Beginner to Expert',
            'Mastering %s: Essential Techniques and Best Practices'
        );
        
        $template = $templates[array_rand($templates)];
        
        if (strpos($template, '%d') !== false) {
            return sprintf($template, $topic, $current_year);
        } else {
            return sprintf($template, $topic);
        }
    }
    
    /**
     * Generate a description for pillar content.
     * 
     * @param string $topic Topic.
     * @return string Content description.
     */
    private function generate_pillar_content_description($topic) {
        $templates = array(
            'A comprehensive guide to %s covering all essential aspects from beginner to advanced levels. This in-depth resource provides practical advice, expert insights, and actionable steps.',
            'Explore the world of %s with this definitive guide. Learn fundamental principles, advanced techniques, and how to overcome common challenges to achieve your goals.',
            'This authoritative resource on %s combines scientific research with practical applications to help readers understand and implement effective strategies.',
            'A complete framework for understanding and mastering %s, developed with input from industry experts and backed by current research.'
        );
        
        $template = $templates[array_rand($templates)];
        
        return sprintf($template, $topic);
    }
    
    /**
     * Generate sections for pillar content.
     * 
     * @param string $topic Topic.
     * @return array Content sections.
     */
    private function generate_pillar_content_sections($topic) {
        $generic_sections = array(
            array('title' => 'Introduction to ' . $topic, 'type' => 'introduction'),
            array('title' => 'What is ' . $topic . '?', 'type' => 'definition'),
            array('title' => 'The History of ' . $topic, 'type' => 'background'),
            array('title' => 'Why ' . $topic . ' Matters', 'type' => 'importance'),
            array('title' => 'Key Principles of ' . $topic, 'type' => 'principles'),
            array('title' => 'Common ' . $topic . ' Misconceptions', 'type' => 'misconceptions'),
            array('title' => 'Getting Started with ' . $topic, 'type' => 'getting-started'),
            array('title' => 'Best Practices for ' . $topic, 'type' => 'best-practices'),
            array('title' => 'Advanced ' . $topic . ' Strategies', 'type' => 'advanced'),
            array('title' => 'Tools and Resources for ' . $topic, 'type' => 'resources'),
            array('title' => $topic . ' Case Studies', 'type' => 'case-studies'),
            array('title' => 'Future Trends in ' . $topic, 'type' => 'trends'),
            array('title' => $topic . ' FAQ', 'type' => 'faq'),
            array('title' => 'Conclusion', 'type' => 'conclusion')
        );
        
        // Customize sections based on topic keywords
        $topic_lower = strtolower($topic);
        
        // Nutrition related
        if (stripos($topic_lower, 'nutrition') !== false || stripos($topic_lower, 'food') !== false || 
            stripos($topic_lower, 'diet') !== false || stripos($topic_lower, 'eating') !== false) {
            return array(
                array('title' => 'Introduction to ' . $topic, 'type' => 'introduction'),
                array('title' => 'The Science Behind ' . $topic, 'type' => 'background'),
                array('title' => 'Essential Nutrients and Their Functions', 'type' => 'principles'),
                array('title' => 'Creating a Balanced ' . $topic . ' Plan', 'type' => 'getting-started'),
                array('title' => 'Meal Planning and Preparation', 'type' => 'best-practices'),
                array('title' => $topic . ' for Different Life Stages', 'type' => 'variations'),
                array('title' => 'Managing Health Conditions Through ' . $topic, 'type' => 'applications'),
                array('title' => 'Supplements and ' . $topic, 'type' => 'supplements'),
                array('title' => 'Common ' . $topic . ' Myths Debunked', 'type' => 'misconceptions'),
                array('title' => 'Sustainable ' . $topic . ' Practices', 'type' => 'sustainability'),
                array('title' => $topic . ' Success Stories', 'type' => 'case-studies'),
                array('title' => 'Tools and Resources for ' . $topic, 'type' => 'resources'),
                array('title' => 'Frequently Asked Questions', 'type' => 'faq'),
                array('title' => 'Conclusion and Next Steps', 'type' => 'conclusion')
            );
        } 
        // Fitness related
        elseif (stripos($topic_lower, 'fitness') !== false || stripos($topic_lower, 'workout') !== false || 
               stripos($topic_lower, 'exercise') !== false || stripos($topic_lower, 'training') !== false) {
            return array(
                array('title' => 'Introduction to ' . $topic, 'type' => 'introduction'),
                array('title' => 'The Science of ' . $topic, 'type' => 'background'),
                array('title' => 'Assessing Your Current ' . $topic . ' Level', 'type' => 'assessment'),
                array('title' => 'Setting Effective ' . $topic . ' Goals', 'type' => 'goals'),
                array('title' => 'Creating Your ' . $topic . ' Plan', 'type' => 'planning'),
                array('title' => 'Essential ' . $topic . ' Techniques', 'type' => 'techniques'),
                array('title' => 'Equipment and Gear for ' . $topic, 'type' => 'equipment'),
                array('title' => 'Nutrition to Support Your ' . $topic, 'type' => 'nutrition'),
                array('title' => 'Recovery and Injury Prevention', 'type' => 'recovery'),
                array('title' => 'Tracking Progress and Overcoming Plateaus', 'type' => 'progress'),
                array('title' => 'Advanced ' . $topic . ' Strategies', 'type' => 'advanced'),
                array('title' => $topic . ' for Special Populations', 'type' => 'variations'),
                array('title' => 'Frequently Asked Questions', 'type' => 'faq'),
                array('title' => 'Conclusion and Maintaining Motivation', 'type' => 'conclusion')
            );
        }
        // Mental health related
        elseif (stripos($topic_lower, 'mental') !== false || stripos($topic_lower, 'stress') !== false || 
               stripos($topic_lower, 'anxiety') !== false || stripos($topic_lower, 'wellness') !== false) {
            return array(
                array('title' => 'Introduction to ' . $topic, 'type' => 'introduction'),
                array('title' => 'Understanding ' . $topic . ': Definitions and Importance', 'type' => 'background'),
                array('title' => 'The Science Behind ' . $topic, 'type' => 'science'),
                array('title' => 'Recognizing Signs and Symptoms', 'type' => 'assessment'),
                array('title' => 'Daily Practices for ' . $topic, 'type' => 'practices'),
                array('title' => 'Building Resilience and Coping Skills', 'type' => 'skills'),
                array('title' => 'Environmental Factors Affecting ' . $topic, 'type' => 'environment'),
                array('title' => $topic . ' in Different Life Stages', 'type' => 'life-stages'),
                array('title' => 'The Connection Between Physical and ' . $topic, 'type' => 'connection'),
                array('title' => 'When to Seek Professional Help', 'type' => 'professional-help'),
                array('title' => 'Tools and Resources for ' . $topic, 'type' => 'resources'),
                array('title' => 'Supporting Others with Their ' . $topic, 'type' => 'support'),
                array('title' => 'Frequently Asked Questions', 'type' => 'faq'),
                array('title' => 'Conclusion and Ongoing ' . $topic . ' Maintenance', 'type' => 'conclusion')
            );
        }
        // Lifestyle related
        elseif (stripos($topic_lower, 'lifestyle') !== false || stripos($topic_lower, 'living') !== false || 
               stripos($topic_lower, 'productivity') !== false || stripos($topic_lower, 'habit') !== false) {
            return array(
                array('title' => 'Introduction to ' . $topic, 'type' => 'introduction'),
                array('title' => 'The Philosophy Behind ' . $topic, 'type' => 'philosophy'),
                array('title' => 'Assessing Your Current ' . $topic, 'type' => 'assessment'),
                array('title' => 'Creating Your Ideal ' . $topic . ' Vision', 'type' => 'vision'),
                array('title' => 'The Psychology of ' . $topic . ' Change', 'type' => 'psychology'),
                array('title' => 'Building Sustainable ' . $topic . ' Habits', 'type' => 'habits'),
                array('title' => 'Designing Your Environment for ' . $topic, 'type' => 'environment'),
                array('title' => 'Technology and Tools for ' . $topic, 'type' => 'tools'),
                array('title' => 'Overcoming Common ' . $topic . ' Challenges', 'type' => 'challenges'),
                array('title' => 'Balancing Different Areas of ' . $topic, 'type' => 'balance'),
                array('title' => $topic . ' Success Stories and Case Studies', 'type' => 'case-studies'),
                array('title' => 'Measuring Progress and Making Adjustments', 'type' => 'progress'),
                array('title' => 'Frequently Asked Questions', 'type' => 'faq'),
                array('title' => 'Conclusion: Sustaining Your Ideal ' . $topic, 'type' => 'conclusion')
            );
        }
        
        // Default to generic sections
        return $generic_sections;
    }
    
    /**
     * Save content plan.
     * 
     * @param array $plan_data Plan data.
     * @return int|false Plan ID or false on failure.
     */
    private function save_content_plan($plan_data) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'dcg_content_plans';
        
        $inserted = $wpdb->insert(
            $table_name,
            array(
                'title' => 'Content Plan - ' . date('Y-m-d'),
                'description' => 'Automatically generated content plan based on website analysis',
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql'),
                'status' => 'draft',
                'plan_data' => json_encode($plan_data)
            ),
            array(
                '%s',
                '%s',
                '%s',
                '%s',
                '%s',
                '%s'
            )
        );
        
        if ($inserted) {
            return $wpdb->insert_id;
        }
        
        return false;
    }
}
