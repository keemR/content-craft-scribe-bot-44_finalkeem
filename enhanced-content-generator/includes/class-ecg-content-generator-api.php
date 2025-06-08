
<?php
/**
 * Enhanced Content Generator API Handler with S-tier content generation
 */

class ECG_Content_Generator_API {
    
    public function __construct() {
        add_action('wp_ajax_ecg_generate_content', array($this, 'generate_content'));
        add_action('wp_ajax_ecg_research_topic', array($this, 'research_topic'));
        add_action('wp_ajax_ecg_validate_content', array($this, 'validate_content'));
        add_action('wp_ajax_ecg_save_content', array($this, 'save_content'));
    }
    
    /**
     * Generate enhanced content via AJAX
     */
    public function generate_content() {
        check_ajax_referer('ecg_nonce', 'nonce');
        
        if (!current_user_can('edit_posts')) {
            wp_die(__('You do not have sufficient permissions to access this page.'));
        }
        
        $keywords = sanitize_text_field($_POST['keywords']);
        $research_data = sanitize_textarea_field($_POST['research_data']);
        $article_length = intval($_POST['article_length']);
        $tone = sanitize_text_field($_POST['tone']);
        $include_images = isset($_POST['include_images']) ? true : false;
        $include_faqs = isset($_POST['include_faqs']) ? true : false;
        $seo_level = intval($_POST['seo_level']);
        $target_audience = sanitize_text_field($_POST['target_audience']);
        $content_specificity = intval($_POST['content_specificity']);
        
        // Enhanced content generation
        $generator = new ECG_Content_Generator();
        $content = $generator->generate_enhanced_content(array(
            'keywords' => $keywords,
            'research_data' => $research_data,
            'article_length' => $article_length,
            'tone' => $tone,
            'include_images' => $include_images,
            'include_faqs' => $include_faqs,
            'seo_level' => $seo_level,
            'target_audience' => $target_audience,
            'content_specificity' => $content_specificity
        ));
        
        // Quality validation
        if (get_option('ecg_quality_validation', true)) {
            $validator = new ECG_Quality_Validator();
            $validation = $validator->validate_content($content, $keywords);
        } else {
            $validation = array(
                'word_count' => str_word_count($content),
                'reading_time' => ceil(str_word_count($content) / 200)
            );
        }
        
        // Save to database
        $this->save_generated_content($keywords, $content, $validation);
        
        wp_send_json_success(array(
            'content' => $content,
            'validation' => $validation
        ));
    }
    
    /**
     * Enhanced topic research via AJAX
     */
    public function research_topic() {
        check_ajax_referer('ecg_nonce', 'nonce');
        
        if (!current_user_can('edit_posts')) {
            wp_die(__('You do not have sufficient permissions to access this page.'));
        }
        
        $keywords = sanitize_text_field($_POST['keywords']);
        
        $research_engine = new ECG_Research_Engine();
        $research_data = $research_engine->conduct_comprehensive_research($keywords);
        
        wp_send_json_success(array('research_data' => $research_data));
    }
    
    /**
     * Validate content quality
     */
    public function validate_content() {
        check_ajax_referer('ecg_nonce', 'nonce');
        
        $content = sanitize_textarea_field($_POST['content']);
        $keywords = sanitize_text_field($_POST['keywords']);
        
        $validator = new ECG_Quality_Validator();
        $validation = $validator->validate_content($content, $keywords);
        
        wp_send_json_success(array('validation' => $validation));
    }
    
    /**
     * Save generated content to database
     */
    private function save_generated_content($keywords, $content, $validation) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'ecg_generated_content';
        
        $wpdb->insert(
            $table_name,
            array(
                'keywords' => $keywords,
                'content' => $content,
                'word_count' => $validation['word_count'] ?? 0,
                'seo_score' => $validation['seo_score'] ?? 0,
                'readability_score' => $validation['readability_score'] ?? 0,
                'generation_time' => current_time('mysql')
            ),
            array('%s', '%s', '%d', '%d', '%d', '%s')
        );
    }
}
