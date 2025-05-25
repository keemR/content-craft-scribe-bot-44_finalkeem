
<?php
/**
 * Content Generator Class
 */
class DCG_Content_Generator {
    
    public function __construct() {
        // Constructor logic if needed
    }
    
    /**
     * Generate content based on options
     */
    public function generate_content($options) {
        $default_options = array(
            'keywords' => '',
            'article_length' => 1500,
            'tone' => 'informative',
            'include_images' => true,
            'include_faqs' => true,
            'seo_level' => 80,
            'target_audience' => 'general'
        );
        
        $options = wp_parse_args($options, $default_options);
        
        // Generate content using the API class
        $api = new DCG_Content_Generator_API();
        $content = $api->generate_seo_content($options);
        
        return array(
            'content' => $content,
            'word_count' => str_word_count($content),
            'reading_time' => ceil(str_word_count($content) / 200)
        );
    }
    
    /**
     * Create WordPress post from generated content
     */
    public function create_post_from_content($content, $title, $options = array()) {
        $post_data = array(
            'post_title' => $title,
            'post_content' => $content,
            'post_status' => 'draft',
            'post_type' => 'post'
        );
        
        if (isset($options['post_status'])) {
            $post_data['post_status'] = $options['post_status'];
        }
        
        $post_id = wp_insert_post($post_data);
        
        if (is_wp_error($post_id)) {
            return $post_id;
        }
        
        // Add meta data
        update_post_meta($post_id, '_dcg_generated', true);
        update_post_meta($post_id, '_dcg_generation_date', current_time('mysql'));
        
        if (isset($options['keywords'])) {
            update_post_meta($post_id, '_dcg_keywords', $options['keywords']);
        }
        
        return $post_id;
    }
}
