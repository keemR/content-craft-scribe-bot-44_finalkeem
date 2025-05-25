
<?php
/**
 * Content Planner Class
 */
class DCG_Content_Planner {
    
    public function __construct() {
        // Constructor logic if needed
    }
    
    /**
     * Generate content plan based on analysis
     */
    public function generate_content_plan($analysis_id) {
        // Get analysis data
        $analysis_data = $this->get_analysis_data($analysis_id);
        
        if (!$analysis_data) {
            return new WP_Error('invalid_analysis', 'Analysis data not found');
        }
        
        // Generate content clusters
        $clusters = $this->generate_content_clusters($analysis_data);
        
        // Create content calendar
        $calendar = $this->create_content_calendar($clusters);
        
        $plan_data = array(
            'clusters' => $clusters,
            'calendar' => $calendar,
            'priority_topics' => $this->identify_priority_topics($analysis_data),
            'estimated_timeline' => $this->calculate_timeline($clusters)
        );
        
        // Store content plan
        $plan_id = $this->store_content_plan($plan_data);
        
        return array_merge($plan_data, array('plan_id' => $plan_id));
    }
    
    private function get_analysis_data($analysis_id) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'dcg_content_analysis';
        
        $result = $wpdb->get_row(
            $wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $analysis_id)
        );
        
        if ($result) {
            return json_decode($result->analysis_data, true);
        }
        
        return false;
    }
    
    private function generate_content_clusters($analysis_data) {
        $clusters = array();
        
        // Health & Wellness cluster
        $clusters[] = array(
            'pillar' => 'Healthy Eating on a Budget',
            'subtopics' => array(
                'Weekly meal planning strategies',
                'Budget-friendly nutritious recipes',
                'Smart grocery shopping tips',
                'Meal prep techniques',
                'Seasonal eating for savings'
            ),
            'priority' => 'high',
            'estimated_articles' => 8
        );
        
        // Fitness cluster
        $clusters[] = array(
            'pillar' => 'Home Fitness Solutions',
            'subtopics' => array(
                'No-equipment workout routines',
                'Creating a home gym on a budget',
                'Family fitness activities',
                'Quick 15-minute workouts',
                'Fitness tracking and motivation'
            ),
            'priority' => 'medium',
            'estimated_articles' => 6
        );
        
        // Lifestyle cluster
        $clusters[] = array(
            'pillar' => 'Sustainable Lifestyle Changes',
            'subtopics' => array(
                'Building healthy habits',
                'Work-life balance tips',
                'Stress management techniques',
                'Sleep optimization',
                'Mindful living practices'
            ),
            'priority' => 'medium',
            'estimated_articles' => 7
        );
        
        return $clusters;
    }
    
    private function create_content_calendar($clusters) {
        $calendar = array();
        $start_date = new DateTime();
        
        foreach ($clusters as $cluster) {
            foreach ($cluster['subtopics'] as $index => $subtopic) {
                $publish_date = clone $start_date;
                $publish_date->add(new DateInterval('P' . ($index * 7) . 'D')); // Weekly intervals
                
                $calendar[] = array(
                    'date' => $publish_date->format('Y-m-d'),
                    'title' => $subtopic,
                    'cluster' => $cluster['pillar'],
                    'priority' => $cluster['priority'],
                    'status' => 'planned'
                );
            }
        }
        
        return $calendar;
    }
    
    private function identify_priority_topics($analysis_data) {
        $priority_topics = array();
        
        // Based on content gaps
        if (isset($analysis_data['content_gaps'])) {
            foreach ($analysis_data['content_gaps'] as $gap) {
                $priority_topics[] = array(
                    'topic' => $gap,
                    'reason' => 'Content gap identified',
                    'priority' => 'high'
                );
            }
        }
        
        // Based on SEO opportunities
        if (isset($analysis_data['seo_opportunities'])) {
            foreach ($analysis_data['seo_opportunities'] as $opportunity) {
                $priority_topics[] = array(
                    'topic' => 'Update: ' . $opportunity['title'],
                    'reason' => 'SEO improvement needed',
                    'priority' => 'medium'
                );
            }
        }
        
        return $priority_topics;
    }
    
    private function calculate_timeline($clusters) {
        $total_articles = 0;
        
        foreach ($clusters as $cluster) {
            $total_articles += $cluster['estimated_articles'];
        }
        
        // Assuming 1 article per week
        $weeks = $total_articles;
        $months = ceil($weeks / 4);
        
        return array(
            'total_articles' => $total_articles,
            'estimated_weeks' => $weeks,
            'estimated_months' => $months,
            'completion_date' => date('Y-m-d', strtotime("+{$weeks} weeks"))
        );
    }
    
    private function store_content_plan($plan_data) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'dcg_content_plans';
        
        $wpdb->insert(
            $table_name,
            array(
                'title' => 'Content Plan - ' . date('Y-m-d H:i:s'),
                'description' => 'Generated content plan based on website analysis',
                'plan_data' => json_encode($plan_data),
                'status' => 'active',
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql')
            )
        );
        
        return $wpdb->insert_id;
    }
}
