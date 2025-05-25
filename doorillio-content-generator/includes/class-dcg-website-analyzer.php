
<?php
/**
 * Website Analyzer Class
 */
class DCG_Website_Analyzer {
    
    public function __construct() {
        // Constructor logic if needed
    }
    
    /**
     * Analyze the website for content opportunities
     */
    public function analyze_website() {
        // Get all published posts
        $posts = get_posts(array(
            'post_type' => array('post', 'page'),
            'post_status' => 'publish',
            'numberposts' => -1
        ));
        
        $analysis_data = array(
            'total_posts' => count($posts),
            'content_gaps' => $this->identify_content_gaps($posts),
            'seo_opportunities' => $this->identify_seo_opportunities($posts),
            'keyword_analysis' => $this->analyze_keywords($posts),
            'analysis_id' => time() // Simple ID for demo
        );
        
        // Store analysis results
        $this->store_analysis($analysis_data);
        
        return $analysis_data;
    }
    
    /**
     * Analyze individual post content
     */
    public function analyze_post_content($post_id) {
        $post = get_post($post_id);
        
        if (!$post) {
            return false;
        }
        
        $analysis = array(
            'word_count' => str_word_count(strip_tags($post->post_content)),
            'reading_time' => ceil(str_word_count(strip_tags($post->post_content)) / 200),
            'seo_score' => $this->calculate_seo_score($post),
            'readability_score' => $this->calculate_readability_score($post)
        );
        
        // Store post analysis
        update_post_meta($post_id, '_dcg_content_analysis', $analysis);
        
        return $analysis;
    }
    
    private function identify_content_gaps($posts) {
        // Analyze existing content to find gaps
        $topics = array();
        
        foreach ($posts as $post) {
            $content = $post->post_title . ' ' . $post->post_content;
            
            // Simple keyword extraction (in real implementation, use more sophisticated methods)
            $words = str_word_count(strtolower($content), 1);
            $topics = array_merge($topics, $words);
        }
        
        // Identify gaps based on missing topics
        $suggested_topics = array(
            'meal planning',
            'budget recipes',
            'healthy eating',
            'fitness routines',
            'weight loss',
            'nutrition tips'
        );
        
        $gaps = array();
        foreach ($suggested_topics as $topic) {
            if (!in_array($topic, $topics)) {
                $gaps[] = $topic;
            }
        }
        
        return $gaps;
    }
    
    private function identify_seo_opportunities($posts) {
        $opportunities = array();
        
        foreach ($posts as $post) {
            $seo_score = $this->calculate_seo_score($post);
            
            if ($seo_score < 70) {
                $opportunities[] = array(
                    'post_id' => $post->ID,
                    'title' => $post->post_title,
                    'score' => $seo_score,
                    'issues' => $this->identify_seo_issues($post)
                );
            }
        }
        
        return $opportunities;
    }
    
    private function analyze_keywords($posts) {
        $keyword_data = array();
        
        foreach ($posts as $post) {
            $content = strtolower($post->post_title . ' ' . $post->post_content);
            $words = str_word_count($content, 1);
            
            foreach ($words as $word) {
                if (strlen($word) > 3) {
                    if (!isset($keyword_data[$word])) {
                        $keyword_data[$word] = 0;
                    }
                    $keyword_data[$word]++;
                }
            }
        }
        
        // Sort by frequency
        arsort($keyword_data);
        
        // Return top 20 keywords
        return array_slice($keyword_data, 0, 20, true);
    }
    
    private function calculate_seo_score($post) {
        $score = 0;
        
        // Title length check
        $title_length = strlen($post->post_title);
        if ($title_length >= 30 && $title_length <= 60) {
            $score += 20;
        }
        
        // Content length check
        $content_length = str_word_count(strip_tags($post->post_content));
        if ($content_length >= 300) {
            $score += 20;
        }
        
        // Meta description check
        $meta_desc = get_post_meta($post->ID, '_yoast_wpseo_metadesc', true);
        if (!empty($meta_desc)) {
            $score += 15;
        }
        
        // Heading tags check
        if (preg_match('/<h[1-6]/', $post->post_content)) {
            $score += 15;
        }
        
        // Images check
        if (preg_match('/<img/', $post->post_content)) {
            $score += 10;
        }
        
        // Internal links check
        if (preg_match('/<a.*href.*' . home_url() . '/', $post->post_content)) {
            $score += 10;
        }
        
        // Featured image check
        if (has_post_thumbnail($post->ID)) {
            $score += 10;
        }
        
        return $score;
    }
    
    private function calculate_readability_score($post) {
        $content = strip_tags($post->post_content);
        $sentences = preg_split('/[.!?]+/', $content);
        $words = str_word_count($content);
        $syllables = $this->count_syllables($content);
        
        // Flesch Reading Ease Score
        $score = 206.835 - (1.015 * ($words / count($sentences))) - (84.6 * ($syllables / $words));
        
        return max(0, min(100, $score));
    }
    
    private function count_syllables($text) {
        $text = strtolower($text);
        $syllables = 0;
        $words = str_word_count($text, 1);
        
        foreach ($words as $word) {
            $syllables += max(1, preg_match_all('/[aeiouy]+/', $word));
        }
        
        return $syllables;
    }
    
    private function identify_seo_issues($post) {
        $issues = array();
        
        if (strlen($post->post_title) < 30) {
            $issues[] = 'Title too short';
        }
        
        if (str_word_count(strip_tags($post->post_content)) < 300) {
            $issues[] = 'Content too short';
        }
        
        if (!has_post_thumbnail($post->ID)) {
            $issues[] = 'Missing featured image';
        }
        
        if (!preg_match('/<h[1-6]/', $post->post_content)) {
            $issues[] = 'Missing heading tags';
        }
        
        return $issues;
    }
    
    private function store_analysis($data) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'dcg_content_analysis';
        
        $wpdb->insert(
            $table_name,
            array(
                'analysis_type' => 'website_analysis',
                'analysis_data' => json_encode($data),
                'created_at' => current_time('mysql')
            )
        );
        
        return $wpdb->insert_id;
    }
}
