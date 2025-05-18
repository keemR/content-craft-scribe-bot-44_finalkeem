
<?php
/**
 * Website analyzer class for content planning.
 */
class DCG_Website_Analyzer {
    
    /**
     * Constructor.
     */
    public function __construct() {
        // Constructor code here
    }
    
    /**
     * Analyze the entire website structure.
     * 
     * @return array|WP_Error Analysis results or error.
     */
    public function analyze_website() {
        try {
            $results = array(
                'categories' => $this->analyze_categories(),
                'tags' => $this->analyze_tags(),
                'post_types' => $this->analyze_post_types(),
                'content_stats' => $this->get_content_statistics(),
                'content_gaps' => $this->identify_content_gaps(),
                'keyword_opportunities' => $this->identify_keyword_opportunities(),
                'timestamp' => current_time('mysql')
            );
            
            // Store analysis in database
            $analysis_id = $this->save_analysis_results($results);
            
            if (!$analysis_id) {
                return new WP_Error('analysis_save_failed', __('Failed to save analysis results.', 'doorillio-content-generator'));
            }
            
            $results['analysis_id'] = $analysis_id;
            
            // Cache the results for faster access
            set_transient('dcg_website_analysis', $results, DAY_IN_SECONDS);
            
            return $results;
        } catch (Exception $e) {
            return new WP_Error('analysis_failed', $e->getMessage());
        }
    }
    
    /**
     * Analyze categories.
     * 
     * @return array Category analysis.
     */
    private function analyze_categories() {
        $categories = get_categories(array(
            'hide_empty' => false
        ));
        
        $result = array();
        
        foreach ($categories as $category) {
            $post_count = $category->count;
            
            $result[] = array(
                'id' => $category->term_id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'post_count' => $post_count,
                'parent' => $category->parent,
                'depth' => $this->get_term_depth($category->term_id, 'category')
            );
        }
        
        // Sort categories by post count (descending)
        usort($result, function($a, $b) {
            return $b['post_count'] - $a['post_count'];
        });
        
        return $result;
    }
    
    /**
     * Analyze tags.
     * 
     * @return array Tag analysis.
     */
    private function analyze_tags() {
        $tags = get_tags(array(
            'hide_empty' => false
        ));
        
        $result = array();
        
        foreach ($tags as $tag) {
            $result[] = array(
                'id' => $tag->term_id,
                'name' => $tag->name,
                'slug' => $tag->slug,
                'description' => $tag->description,
                'post_count' => $tag->count
            );
        }
        
        // Sort tags by post count (descending)
        usort($result, function($a, $b) {
            return $b['post_count'] - $a['post_count'];
        });
        
        return $result;
    }
    
    /**
     * Analyze post types.
     * 
     * @return array Post type analysis.
     */
    private function analyze_post_types() {
        $post_types = get_post_types(array(
            'public' => true
        ), 'objects');
        
        $result = array();
        
        foreach ($post_types as $post_type) {
            // Skip attachments
            if ($post_type->name === 'attachment') {
                continue;
            }
            
            $count = wp_count_posts($post_type->name);
            
            $result[] = array(
                'name' => $post_type->name,
                'label' => $post_type->label,
                'description' => $post_type->description,
                'published_count' => isset($count->publish) ? $count->publish : 0,
                'draft_count' => isset($count->draft) ? $count->draft : 0,
                'supports_categories' => is_object_in_taxonomy($post_type->name, 'category'),
                'supports_tags' => is_object_in_taxonomy($post_type->name, 'post_tag')
            );
        }
        
        return $result;
    }
    
    /**
     * Get content statistics.
     * 
     * @return array Content statistics.
     */
    private function get_content_statistics() {
        global $wpdb;
        
        $stats = array();
        
        // Average word count for published posts
        $posts = get_posts(array(
            'post_type' => 'post',
            'post_status' => 'publish',
            'posts_per_page' => 100,
            'orderby' => 'date',
            'order' => 'DESC'
        ));
        
        $total_words = 0;
        $post_count = count($posts);
        
        foreach ($posts as $post) {
            $content = strip_shortcodes(wp_strip_all_tags($post->post_content));
            $word_count = str_word_count($content);
            $total_words += $word_count;
        }
        
        $stats['average_word_count'] = $post_count > 0 ? round($total_words / $post_count) : 0;
        
        // Publishing frequency
        $past_month_count = wp_count_posts('post');
        $month_ago = date('Y-m-d', strtotime('-30 days'));
        
        $recent_posts = $wpdb->get_var($wpdb->prepare(
            "SELECT COUNT(*) FROM {$wpdb->posts} 
            WHERE post_type = 'post' 
            AND post_status = 'publish' 
            AND post_date >= %s",
            $month_ago
        ));
        
        $stats['posts_last_30_days'] = $recent_posts;
        $stats['avg_posts_per_week'] = round($recent_posts / 4.3, 1); // 30 days ÷ 7 days ≈ 4.3 weeks
        
        // Content age statistics
        $content_age = $wpdb->get_results(
            "SELECT 
                TIMESTAMPDIFF(MONTH, post_date, NOW()) as months_old,
                COUNT(*) as count
            FROM {$wpdb->posts}
            WHERE post_type = 'post'
            AND post_status = 'publish'
            GROUP BY TIMESTAMPDIFF(MONTH, post_date, NOW()) DIV 6
            ORDER BY months_old ASC"
        );
        
        $stats['content_age'] = array();
        
        foreach ($content_age as $age_group) {
            $months = $age_group->months_old;
            $count = $age_group->count;
            
            if ($months <= 6) {
                $key = '0-6 months';
            } elseif ($months <= 12) {
                $key = '7-12 months';
            } elseif ($months <= 24) {
                $key = '1-2 years';
            } else {
                $key = 'over 2 years';
            }
            
            if (!isset($stats['content_age'][$key])) {
                $stats['content_age'][$key] = 0;
            }
            
            $stats['content_age'][$key] += $count;
        }
        
        return $stats;
    }
    
    /**
     * Identify content gaps.
     * 
     * @return array Content gaps.
     */
    private function identify_content_gaps() {
        $gaps = array();
        
        // Get top-level categories with few or no posts
        $categories = get_categories(array(
            'hide_empty' => false,
            'parent' => 0
        ));
        
        $gaps['empty_categories'] = array();
        
        foreach ($categories as $category) {
            if ($category->count < 5) {
                $gaps['empty_categories'][] = array(
                    'id' => $category->term_id,
                    'name' => $category->name,
                    'post_count' => $category->count,
                    'priority' => ($category->count === 0) ? 'high' : 'medium'
                );
            }
        }
        
        // Identify topics from existing content structure
        $topics = $this->extract_topics_from_content();
        $covered_topics = array_keys($topics);
        
        // For demo purposes, let's predetermine some common health/wellness subtopics
        // This would ideally come from an API or comprehensive database
        $health_wellness_topics = array(
            'nutrition' => array(
                'meal planning',
                'dietary supplements',
                'macronutrients',
                'micronutrients',
                'special diets'
            ),
            'fitness' => array(
                'strength training',
                'cardio workouts',
                'flexibility',
                'sports specific',
                'recovery techniques'
            ),
            'mental health' => array(
                'stress management',
                'meditation',
                'sleep optimization',
                'anxiety',
                'depression'
            ),
            'lifestyle' => array(
                'work-life balance',
                'productivity',
                'relationship health',
                'environmental wellness',
                'financial wellness'
            )
        );
        
        $gaps['topic_gaps'] = array();
        
        foreach ($health_wellness_topics as $main_topic => $subtopics) {
            $main_topic_covered = false;
            foreach ($covered_topics as $covered_topic) {
                if (stripos($covered_topic, $main_topic) !== false) {
                    $main_topic_covered = true;
                    break;
                }
            }
            
            if (!$main_topic_covered) {
                $gaps['topic_gaps'][] = array(
                    'topic' => $main_topic,
                    'level' => 'main',
                    'priority' => 'high',
                    'recommendation' => sprintf(
                        __('Create pillar content for "%s"', 'doorillio-content-generator'),
                        $main_topic
                    )
                );
            }
            
            foreach ($subtopics as $subtopic) {
                $subtopic_covered = false;
                foreach ($covered_topics as $covered_topic) {
                    if (stripos($covered_topic, $subtopic) !== false) {
                        $subtopic_covered = true;
                        break;
                    }
                }
                
                if (!$subtopic_covered) {
                    $gaps['topic_gaps'][] = array(
                        'topic' => $subtopic,
                        'parent' => $main_topic,
                        'level' => 'sub',
                        'priority' => $main_topic_covered ? 'medium' : 'low',
                        'recommendation' => sprintf(
                            __('Create cluster content for "%s" under "%s"', 'doorillio-content-generator'),
                            $subtopic,
                            $main_topic
                        )
                    );
                }
            }
        }
        
        return $gaps;
    }
    
    /**
     * Extract topics from existing content.
     * 
     * @return array Topics.
     */
    private function extract_topics_from_content() {
        $topics = array();
        
        // Get posts and pages
        $posts = get_posts(array(
            'post_type' => array('post', 'page'),
            'post_status' => 'publish',
            'numberposts' => -1
        ));
        
        foreach ($posts as $post) {
            // Extract topics from title
            $title = strtolower($post->post_title);
            $title_words = explode(' ', $title);
            
            // Simple topic extraction based on title
            $potential_topics = array();
            if (count($title_words) >= 3) {
                // Extract 2-3 word phrases
                for ($i = 0; $i < count($title_words) - 1; $i++) {
                    $two_word = $title_words[$i] . ' ' . $title_words[$i + 1];
                    $potential_topics[] = $two_word;
                    
                    if (isset($title_words[$i + 2])) {
                        $three_word = $two_word . ' ' . $title_words[$i + 2];
                        $potential_topics[] = $three_word;
                    }
                }
            }
            
            // Extract from categories and tags
            $categories = wp_get_post_categories($post->ID, array('fields' => 'names'));
            $tags = wp_get_post_tags($post->ID, array('fields' => 'names'));
            
            $terms = array_merge($categories, $tags);
            
            foreach ($terms as $term) {
                $term_lower = strtolower($term);
                if (!isset($topics[$term_lower])) {
                    $topics[$term_lower] = 0;
                }
                $topics[$term_lower]++;
            }
            
            // Add potential topics from title
            foreach ($potential_topics as $topic) {
                // Filter out common stop words and short topics
                $stop_words = array('the', 'and', 'for', 'with', 'that', 'this', 'are', 'from', 'not', 'but');
                $words = explode(' ', $topic);
                $valid = true;
                
                foreach ($words as $word) {
                    if (in_array($word, $stop_words) || strlen($word) <= 2) {
                        $valid = false;
                        break;
                    }
                }
                
                if ($valid) {
                    if (!isset($topics[$topic])) {
                        $topics[$topic] = 0;
                    }
                    $topics[$topic]++;
                }
            }
        }
        
        // Sort topics by frequency
        arsort($topics);
        
        return $topics;
    }
    
    /**
     * Identify keyword opportunities.
     * 
     * @return array Keyword opportunities.
     */
    private function identify_keyword_opportunities() {
        // This would normally use external APIs for keyword research
        // For demo purposes, we'll generate example opportunities
        
        $opportunities = array();
        
        // Get top categories
        $categories = get_categories(array(
            'orderby' => 'count',
            'order' => 'DESC',
            'number' => 5,
            'hide_empty' => true
        ));
        
        foreach ($categories as $category) {
            $cat_name = strtolower($category->name);
            
            // Generate example long-tail keywords based on category
            $keywords = $this->generate_sample_keywords_for_category($cat_name);
            
            if (!empty($keywords)) {
                $opportunities[] = array(
                    'category' => $category->name,
                    'keywords' => $keywords
                );
            }
        }
        
        return $opportunities;
    }
    
    /**
     * Generate sample keywords for a category.
     * 
     * @param string $category Category name.
     * @return array Sample keywords.
     */
    private function generate_sample_keywords_for_category($category) {
        $keywords = array();
        
        // Sample keyword patterns by niche
        $health_wellness_patterns = array(
            'best %s tips',
            'how to improve %s naturally',
            '%s benefits',
            '%s for beginners',
            'best %s techniques',
            '%s exercises',
            'how to start %s',
            '%s mistakes to avoid',
            '%s meal plan',
            '%s workout plan'
        );
        
        $nutrition_patterns = array(
            'best foods for %s',
            '%s diet plan',
            '%s recipes',
            'foods to avoid for %s',
            '%s supplements',
            '%s nutritional requirements',
            'meal prep for %s',
            '%s superfood benefits',
            'how to eat for %s',
            '%s nutrition guide'
        );
        
        $fitness_patterns = array(
            '%s workout routine',
            'best exercises for %s',
            '%s training plan',
            'how to improve %s performance',
            '%s recovery tips',
            'equipment for %s',
            '%s workout for beginners',
            'advanced %s techniques',
            '%s for weight loss',
            '%s injury prevention'
        );
        
        $mental_health_patterns = array(
            '%s meditation techniques',
            'how to reduce %s',
            '%s management tips',
            'natural remedies for %s',
            '%s exercises',
            'signs of %s problems',
            'how to improve %s health',
            '%s therapy options',
            'coping with %s',
            '%s self-care techniques'
        );
        
        $lifestyle_patterns = array(
            '%s daily routine',
            'how to balance %s',
            '%s habits for success',
            'improving %s quality',
            '%s organization tips',
            'minimalist %s guide',
            '%s productivity hacks',
            'sustainable %s practices',
            '%s on a budget',
            '%s for busy professionals'
        );
        
        // Map category to related terms
        $related_terms = array();
        
        // Nutrition related
        if (stripos($category, 'nutrition') !== false || stripos($category, 'food') !== false || 
            stripos($category, 'diet') !== false || stripos($category, 'eating') !== false) {
            $related_terms = array('nutrition', 'diet', 'healthy eating', 'meal planning', 'macros', 'protein intake');
            $patterns = $nutrition_patterns;
        } 
        // Fitness related
        elseif (stripos($category, 'fitness') !== false || stripos($category, 'workout') !== false || 
               stripos($category, 'exercise') !== false || stripos($category, 'training') !== false) {
            $related_terms = array('strength training', 'cardio', 'muscle building', 'weight loss', 'flexibility', 'endurance');
            $patterns = $fitness_patterns;
        }
        // Mental health related
        elseif (stripos($category, 'mental') !== false || stripos($category, 'stress') !== false || 
               stripos($category, 'anxiety') !== false || stripos($category, 'wellness') !== false) {
            $related_terms = array('stress', 'anxiety', 'mental focus', 'sleep quality', 'mindfulness', 'relaxation');
            $patterns = $mental_health_patterns;
        }
        // Lifestyle related
        elseif (stripos($category, 'lifestyle') !== false || stripos($category, 'living') !== false || 
               stripos($category, 'productivity') !== false || stripos($category, 'habit') !== false) {
            $related_terms = array('productivity', 'habits', 'morning routine', 'work-life balance', 'minimalism', 'self-improvement');
            $patterns = $lifestyle_patterns;
        }
        // Default/general
        else {
            $related_terms = array($category, 'health', 'wellness', 'lifestyle', 'improvement');
            $patterns = $health_wellness_patterns;
        }
        
        // Generate keywords using patterns
        foreach ($related_terms as $term) {
            // Get 3 random patterns for this term
            $selected_patterns = array_rand(array_flip($patterns), min(3, count($patterns)));
            
            if (!is_array($selected_patterns)) {
                $selected_patterns = array($selected_patterns);
            }
            
            foreach ($selected_patterns as $pattern) {
                $keyword = sprintf($pattern, $term);
                
                $keywords[] = array(
                    'keyword' => $keyword,
                    'search_volume' => rand(100, 9900), // Mock data
                    'competition' => rand(1, 100) / 100, // Mock data
                    'difficulty' => rand(1, 100)  // Mock data
                );
            }
        }
        
        return $keywords;
    }
    
    /**
     * Get term depth.
     * 
     * @param int $term_id Term ID.
     * @param string $taxonomy Taxonomy.
     * @return int Term depth.
     */
    private function get_term_depth($term_id, $taxonomy) {
        $depth = 0;
        $term = get_term($term_id, $taxonomy);
        
        if (is_wp_error($term)) {
            return $depth;
        }
        
        while ($term->parent != 0) {
            $depth++;
            $term = get_term($term->parent, $taxonomy);
            
            if (is_wp_error($term)) {
                break;
            }
        }
        
        return $depth;
    }
    
    /**
     * Save analysis results.
     * 
     * @param array $results Analysis results.
     * @return int|false Analysis ID or false on failure.
     */
    private function save_analysis_results($results) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'dcg_content_analysis';
        
        $inserted = $wpdb->insert(
            $table_name,
            array(
                'post_id' => null, // Site-wide analysis, not post-specific
                'analysis_type' => 'website',
                'analysis_data' => json_encode($results),
                'created_at' => current_time('mysql')
            ),
            array(
                '%d',
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
    
    /**
     * Analyze post content.
     * 
     * @param int $post_id Post ID.
     * @return array|WP_Error Analysis results or error.
     */
    public function analyze_post_content($post_id) {
        $post = get_post($post_id);
        
        if (!$post) {
            return new WP_Error('invalid_post', __('Invalid post.', 'doorillio-content-generator'));
        }
        
        $content = $post->post_content;
        $title = $post->post_title;
        
        // Basic content analysis
        $word_count = str_word_count(strip_tags($content));
        $sentence_count = preg_match_all('/[.!?](\s|$)/', strip_tags($content), $matches);
        $paragraph_count = substr_count($content, '</p>') + substr_count($content, "\n\n");
        $heading_count = preg_match_all('/<h[1-6][^>]*>(.*?)<\/h[1-6]>/i', $content, $matches);
        $image_count = substr_count($content, '<img');
        $link_count = substr_count($content, '<a');
        
        // SEO analysis
        $keywords = $this->extract_keywords_from_content($post);
        
        $results = array(
            'content_stats' => array(
                'word_count' => $word_count,
                'sentence_count' => $sentence_count,
                'paragraph_count' => $paragraph_count,
                'heading_count' => $heading_count,
                'image_count' => $image_count,
                'link_count' => $link_count,
                'avg_sentence_length' => $sentence_count > 0 ? round($word_count / $sentence_count, 1) : 0,
                'avg_paragraph_length' => $paragraph_count > 0 ? round($word_count / $paragraph_count, 1) : 0
            ),
            'seo_analysis' => array(
                'keywords' => $keywords,
                'has_meta_description' => !empty(get_post_meta($post_id, '_yoast_wpseo_metadesc', true)) || !empty(get_post_meta($post_id, '_aioseop_description', true)),
                'title_length' => strlen($title),
                'has_internal_links' => $link_count > 0,
                'has_images' => $image_count > 0,
                'has_alt_tags' => $this->check_alt_tags($content)
            ),
            'timestamp' => current_time('mysql')
        );
        
        // Save analysis results
        $this->save_post_analysis_results($post_id, $results);
        
        return $results;
    }
    
    /**
     * Extract keywords from content.
     * 
     * @param WP_Post $post Post object.
     * @return array Extracted keywords.
     */
    private function extract_keywords_from_content($post) {
        $content = strip_tags($post->post_content);
        $title = $post->post_title;
        
        // Get post categories and tags
        $categories = wp_get_post_categories($post->ID, array('fields' => 'names'));
        $tags = wp_get_post_tags($post->ID, array('fields' => 'names'));
        
        // Combine all text for analysis
        $text = $title . ' ' . implode(' ', $categories) . ' ' . implode(' ', $tags) . ' ' . $content;
        $text = strtolower($text);
        
        // Remove common stop words
        $stop_words = array('the', 'and', 'a', 'to', 'of', 'in', 'is', 'that', 'it', 'was', 'for', 'on', 'are', 'as', 'with', 'they', 'be', 'at', 'this', 'have', 'from', 'or', 'had', 'by', 'not', 'but', 'what', 'all', 'were', 'when', 'we', 'there', 'can', 'an', 'your', 'which', 'their', 'said', 'if', 'will', 'each', 'about', 'how', 'up', 'out', 'them', 'then', 'she', 'many', 'some', 'would', 'other', 'into', 'has', 'more', 'her', 'two', 'like', 'him', 'see', 'time', 'could', 'no', 'make', 'than', 'first', 'been', 'its', 'who', 'now', 'people', 'my', 'made', 'over', 'did', 'down', 'only', 'way', 'find', 'use', 'may', 'very', 'any', 'new', 'also');
        
        $words = preg_split('/\s+/', $text);
        $word_count = array();
        
        foreach ($words as $word) {
            $word = preg_replace('/[^a-z]/', '', $word);
            
            if (strlen($word) <= 3 || in_array($word, $stop_words)) {
                continue;
            }
            
            if (!isset($word_count[$word])) {
                $word_count[$word] = 0;
            }
            
            $word_count[$word]++;
        }
        
        // Extract 2-3 word phrases
        $phrases = array();
        $words_array = preg_split('/\s+/', $text);
        
        for ($i = 0; $i < count($words_array) - 1; $i++) {
            $word1 = preg_replace('/[^a-z]/', '', $words_array[$i]);
            $word2 = preg_replace('/[^a-z]/', '', $words_array[$i + 1]);
            
            if (strlen($word1) <= 3 || strlen($word2) <= 3 || 
                in_array($word1, $stop_words) || in_array($word2, $stop_words)) {
                continue;
            }
            
            $two_word = $word1 . ' ' . $word2;
            
            if (!isset($phrases[$two_word])) {
                $phrases[$two_word] = 0;
            }
            
            $phrases[$two_word]++;
            
            if (isset($words_array[$i + 2])) {
                $word3 = preg_replace('/[^a-z]/', '', $words_array[$i + 2]);
                
                if (strlen($word3) <= 3 || in_array($word3, $stop_words)) {
                    continue;
                }
                
                $three_word = $two_word . ' ' . $word3;
                
                if (!isset($phrases[$three_word])) {
                    $phrases[$three_word] = 0;
                }
                
                $phrases[$three_word]++;
            }
        }
        
        // Sort by frequency
        arsort($word_count);
        arsort($phrases);
        
        // Get top keywords and phrases
        $top_words = array_slice($word_count, 0, 10);
        $top_phrases = array_slice($phrases, 0, 10);
        
        $keywords = array();
        
        foreach ($top_words as $word => $count) {
            $keywords[] = array(
                'keyword' => $word,
                'count' => $count,
                'type' => 'word'
            );
        }
        
        foreach ($top_phrases as $phrase => $count) {
            $keywords[] = array(
                'keyword' => $phrase,
                'count' => $count,
                'type' => 'phrase'
            );
        }
        
        return $keywords;
    }
    
    /**
     * Check if content has alt tags for images.
     * 
     * @param string $content Post content.
     * @return bool True if all images have alt tags, false otherwise.
     */
    private function check_alt_tags($content) {
        preg_match_all('/<img [^>]+>/i', $content, $matches);
        
        if (empty($matches[0])) {
            return true; // No images
        }
        
        $images = $matches[0];
        $all_have_alt = true;
        
        foreach ($images as $image) {
            if (!preg_match('/alt=(["\'])(.*?)\1/i', $image)) {
                $all_have_alt = false;
                break;
            }
        }
        
        return $all_have_alt;
    }
    
    /**
     * Save post analysis results.
     * 
     * @param int $post_id Post ID.
     * @param array $results Analysis results.
     * @return int|false Analysis ID or false on failure.
     */
    private function save_post_analysis_results($post_id, $results) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'dcg_content_analysis';
        
        $inserted = $wpdb->insert(
            $table_name,
            array(
                'post_id' => $post_id,
                'analysis_type' => 'post',
                'analysis_data' => json_encode($results),
                'created_at' => current_time('mysql')
            ),
            array(
                '%d',
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
