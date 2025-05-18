<?php
/**
 * The admin-specific functionality of the plugin.
 */
class DCG_Admin {

    /**
     * Initialize the class.
     */
    public function __construct() {
        // Add settings page fields
        add_action('admin_init', array($this, 'register_settings'));
    }

    /**
     * Register settings fields.
     */
    public function register_settings() {
        register_setting('dcg_settings_group', 'dcg_settings', array($this, 'sanitize_settings'));
        
        // General Settings
        add_settings_section(
            'dcg_general_settings',
            __('General Settings', 'doorillio-content-generator'),
            array($this, 'general_settings_callback'),
            'dcg-settings'
        );
        
        add_settings_field(
            'dcg_api_key',
            __('API Key', 'doorillio-content-generator'),
            array($this, 'api_key_callback'),
            'dcg-settings',
            'dcg_general_settings'
        );
        
        // Content Settings
        add_settings_section(
            'dcg_content_settings',
            __('Content Generation Settings', 'doorillio-content-generator'),
            array($this, 'content_settings_callback'),
            'dcg-settings'
        );
        
        add_settings_field(
            'dcg_default_tone',
            __('Default Tone', 'doorillio-content-generator'),
            array($this, 'default_tone_callback'),
            'dcg-settings',
            'dcg_content_settings'
        );
        
        add_settings_field(
            'dcg_default_article_length',
            __('Default Article Length', 'doorillio-content-generator'),
            array($this, 'default_article_length_callback'),
            'dcg-settings',
            'dcg_content_settings'
        );
        
        add_settings_field(
            'dcg_include_images',
            __('Include Images', 'doorillio-content-generator'),
            array($this, 'include_images_callback'),
            'dcg-settings',
            'dcg_content_settings'
        );
        
        add_settings_field(
            'dcg_include_faqs',
            __('Include FAQs', 'doorillio-content-generator'),
            array($this, 'include_faqs_callback'),
            'dcg-settings',
            'dcg_content_settings'
        );
        
        // Advanced Settings
        add_settings_section(
            'dcg_advanced_settings',
            __('Advanced Settings', 'doorillio-content-generator'),
            array($this, 'advanced_settings_callback'),
            'dcg-settings'
        );
        
        add_settings_field(
            'dcg_seo_level',
            __('SEO Optimization Level', 'doorillio-content-generator'),
            array($this, 'seo_level_callback'),
            'dcg-settings',
            'dcg_advanced_settings'
        );
        
        add_settings_field(
            'dcg_content_specificity',
            __('Content Specificity', 'doorillio-content-generator'),
            array($this, 'content_specificity_callback'),
            'dcg-settings',
            'dcg_advanced_settings'
        );
        
        add_settings_field(
            'dcg_prevent_repetition',
            __('Prevent Repetition', 'doorillio-content-generator'),
            array($this, 'prevent_repetition_callback'),
            'dcg-settings',
            'dcg_advanced_settings'
        );
        
        add_settings_field(
            'dcg_include_examples',
            __('Include Examples', 'doorillio-content-generator'),
            array($this, 'include_examples_callback'),
            'dcg-settings',
            'dcg_advanced_settings'
        );
        
        add_settings_field(
            'dcg_include_statistics',
            __('Include Statistics', 'doorillio-content-generator'),
            array($this, 'include_statistics_callback'),
            'dcg-settings',
            'dcg_advanced_settings'
        );
        
        add_settings_field(
            'dcg_use_case_studies',
            __('Use Case Studies', 'doorillio-content-generator'),
            array($this, 'use_case_studies_callback'),
            'dcg-settings',
            'dcg_advanced_settings'
        );
    }
    
    /**
     * Sanitize settings.
     */
    public function sanitize_settings($input) {
        $sanitized = array();
        
        // General Settings
        $sanitized['api_key'] = sanitize_text_field($input['api_key']);
        
        // Content Settings
        $sanitized['default_tone'] = sanitize_text_field($input['default_tone']);
        $sanitized['default_article_length'] = intval($input['default_article_length']);
        $sanitized['include_images'] = isset($input['include_images']) ? (bool) $input['include_images'] : false;
        $sanitized['include_faqs'] = isset($input['include_faqs']) ? (bool) $input['include_faqs'] : false;
        
        // Advanced Settings
        $sanitized['seo_level'] = intval($input['seo_level']);
        $sanitized['content_specificity'] = intval($input['content_specificity']);
        $sanitized['preventRepetition'] = isset($input['preventRepetition']) ? (bool) $input['preventRepetition'] : true;
        $sanitized['includeExamples'] = isset($input['includeExamples']) ? (bool) $input['includeExamples'] : true;
        $sanitized['includeStatistics'] = isset($input['includeStatistics']) ? (bool) $input['includeStatistics'] : true;
        $sanitized['useCaseStudies'] = isset($input['useCaseStudies']) ? (bool) $input['useCaseStudies'] : true;
        
        // Keep version
        $sanitized['version'] = DCG_VERSION;
        
        return $sanitized;
    }
    
    /**
     * General settings section callback.
     */
    public function general_settings_callback() {
        echo '<p>' . __('Configure general plugin settings.', 'doorillio-content-generator') . '</p>';
    }
    
    /**
     * API key field callback.
     */
    public function api_key_callback() {
        $options = get_option('dcg_settings');
        $api_key = isset($options['api_key']) ? $options['api_key'] : '';
        
        echo '<input type="text" id="dcg_api_key" name="dcg_settings[api_key]" value="' . esc_attr($api_key) . '" class="regular-text" />';
        echo '<p class="description">' . __('Enter your API key for content generation services.', 'doorillio-content-generator') . '</p>';
    }
    
    /**
     * Content settings section callback.
     */
    public function content_settings_callback() {
        echo '<p>' . __('Configure default content generation settings.', 'doorillio-content-generator') . '</p>';
    }
    
    /**
     * Default tone field callback.
     */
    public function default_tone_callback() {
        $options = get_option('dcg_settings');
        $default_tone = isset($options['default_tone']) ? $options['default_tone'] : 'informative';
        
        $tones = array(
            'informative' => __('Informative', 'doorillio-content-generator'),
            'conversational' => __('Conversational', 'doorillio-content-generator'),
            'professional' => __('Professional', 'doorillio-content-generator'),
            'persuasive' => __('Persuasive', 'doorillio-content-generator'),
            'enthusiastic' => __('Enthusiastic', 'doorillio-content-generator')
        );
        
        echo '<select id="dcg_default_tone" name="dcg_settings[default_tone]">';
        foreach ($tones as $value => $label) {
            echo '<option value="' . esc_attr($value) . '" ' . selected($default_tone, $value, false) . '>' . esc_html($label) . '</option>';
        }
        echo '</select>';
        echo '<p class="description">' . __('Select the default tone for generated content.', 'doorillio-content-generator') . '</p>';
    }
    
    /**
     * Default article length field callback.
     */
    public function default_article_length_callback() {
        $options = get_option('dcg_settings');
        $default_article_length = isset($options['default_article_length']) ? $options['default_article_length'] : 1500;
        
        echo '<input type="number" id="dcg_default_article_length" name="dcg_settings[default_article_length]" value="' . esc_attr($default_article_length) . '" class="small-text" min="500" max="8000" step="100" />';
        echo '<p class="description">' . __('Default word count for generated articles.', 'doorillio-content-generator') . '</p>';
    }
    
    /**
     * Include images field callback.
     */
    public function include_images_callback() {
        $options = get_option('dcg_settings');
        $include_images = isset($options['include_images']) ? $options['include_images'] : true;
        
        echo '<input type="checkbox" id="dcg_include_images" name="dcg_settings[include_images]" ' . checked($include_images, true, false) . ' />';
        echo '<label for="dcg_include_images">' . __('Include image suggestions in generated content', 'doorillio-content-generator') . '</label>';
    }
    
    /**
     * Include FAQs field callback.
     */
    public function include_faqs_callback() {
        $options = get_option('dcg_settings');
        $include_faqs = isset($options['include_faqs']) ? $options['include_faqs'] : true;
        
        echo '<input type="checkbox" id="dcg_include_faqs" name="dcg_settings[include_faqs]" ' . checked($include_faqs, true, false) . ' />';
        echo '<label for="dcg_include_faqs">' . __('Include FAQ sections in generated content', 'doorillio-content-generator') . '</label>';
    }
    
    /**
     * Advanced settings section callback.
     */
    public function advanced_settings_callback() {
        echo '<p>' . __('Configure advanced generation settings.', 'doorillio-content-generator') . '</p>';
    }
    
    /**
     * SEO level field callback.
     */
    public function seo_level_callback() {
        $options = get_option('dcg_settings');
        $seo_level = isset($options['seo_level']) ? $options['seo_level'] : 80;
        
        echo '<input type="range" id="dcg_seo_level" name="dcg_settings[seo_level]" min="50" max="100" step="5" value="' . esc_attr($seo_level) . '" />';
        echo '<span id="dcg_seo_level_value">' . esc_html($seo_level) . '%</span>';
        echo '<p class="description">' . __('Higher values prioritize search engine ranking factors over natural language flow.', 'doorillio-content-generator') . '</p>';
    }
    
    /**
     * Content specificity field callback.
     */
    public function content_specificity_callback() {
        $options = get_option('dcg_settings');
        $content_specificity = isset($options['content_specificity']) ? $options['content_specificity'] : 70;
        
        echo '<input type="range" id="dcg_content_specificity" name="dcg_settings[content_specificity]" min="50" max="100" step="5" value="' . esc_attr($content_specificity) . '" />';
        echo '<span id="dcg_content_specificity_value">' . esc_html($content_specificity) . '%</span>';
        echo '<p class="description">' . __('Higher values create more detailed, specific content.', 'doorillio-content-generator') . '</p>';
    }
    
    /**
     * Prevent repetition field callback.
     */
    public function prevent_repetition_callback() {
        $options = get_option('dcg_settings');
        $prevent_repetition = isset($options['preventRepetition']) ? $options['preventRepetition'] : true;
        
        echo '<input type="checkbox" id="dcg_prevent_repetition" name="dcg_settings[preventRepetition]" ' . checked($prevent_repetition, true, false) . ' />';
        echo '<label for="dcg_prevent_repetition">' . __('Prevent content repetition', 'doorillio-content-generator') . '</label>';
    }
    
    /**
     * Include examples field callback.
     */
    public function include_examples_callback() {
        $options = get_option('dcg_settings');
        $include_examples = isset($options['includeExamples']) ? $options['includeExamples'] : true;
        
        echo '<input type="checkbox" id="dcg_include_examples" name="dcg_settings[includeExamples]" ' . checked($include_examples, true, false) . ' />';
        echo '<label for="dcg_include_examples">' . __('Include examples in generated content', 'doorillio-content-generator') . '</label>';
    }
    
    /**
     * Include statistics field callback.
     */
    public function include_statistics_callback() {
        $options = get_option('dcg_settings');
        $include_statistics = isset($options['includeStatistics']) ? $options['includeStatistics'] : true;
        
        echo '<input type="checkbox" id="dcg_include_statistics" name="dcg_settings[includeStatistics]" ' . checked($include_statistics, true, false) . ' />';
        echo '<label for="dcg_include_statistics">' . __('Include statistics and data points', 'doorillio-content-generator') . '</label>';
    }
    
    /**
     * Use case studies field callback.
     */
    public function use_case_studies_callback() {
        $options = get_option('dcg_settings');
        $use_case_studies = isset($options['useCaseStudies']) ? $options['useCaseStudies'] : true;
        
        echo '<input type="checkbox" id="dcg_use_case_studies" name="dcg_settings[useCaseStudies]" ' . checked($use_case_studies, true, false) . ' />';
        echo '<label for="dcg_use_case_studies">' . __('Include case studies where applicable', 'doorillio-content-generator') . '</label>';
    }
}
