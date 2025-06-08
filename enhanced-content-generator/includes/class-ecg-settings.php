
<?php
/**
 * Settings management for Enhanced Content Generator
 */

class ECG_Settings {
    
    public function __construct() {
        add_action('admin_init', array($this, 'register_settings'));
    }
    
    public function register_settings() {
        // API Settings
        add_settings_section(
            'ecg_api_settings',
            __('API Configuration', 'enhanced-content-generator'),
            array($this, 'api_settings_callback'),
            'ecg-settings'
        );
        
        add_settings_field(
            'ecg_api_enabled',
            __('Enable Enhanced Generation', 'enhanced-content-generator'),
            array($this, 'api_enabled_callback'),
            'ecg-settings',
            'ecg_api_settings'
        );
        
        // Content Settings
        add_settings_section(
            'ecg_content_settings',
            __('Content Generation Settings', 'enhanced-content-generator'),
            array($this, 'content_settings_callback'),
            'ecg-settings'
        );
        
        add_settings_field(
            'ecg_default_tone',
            __('Default Tone', 'enhanced-content-generator'),
            array($this, 'default_tone_callback'),
            'ecg-settings',
            'ecg_content_settings'
        );
        
        add_settings_field(
            'ecg_default_length',
            __('Default Article Length', 'enhanced-content-generator'),
            array($this, 'default_length_callback'),
            'ecg-settings',
            'ecg_content_settings'
        );
        
        add_settings_field(
            'ecg_seo_level',
            __('Default SEO Level', 'enhanced-content-generator'),
            array($this, 'seo_level_callback'),
            'ecg-settings',
            'ecg_content_settings'
        );
        
        // Quality Settings
        add_settings_section(
            'ecg_quality_settings',
            __('Quality & Validation Settings', 'enhanced-content-generator'),
            array($this, 'quality_settings_callback'),
            'ecg-settings'
        );
        
        add_settings_field(
            'ecg_quality_validation',
            __('Enable Quality Validation', 'enhanced-content-generator'),
            array($this, 'quality_validation_callback'),
            'ecg-settings',
            'ecg_quality_settings'
        );
        
        add_settings_field(
            'ecg_research_enabled',
            __('Enable Auto Research', 'enhanced-content-generator'),
            array($this, 'research_enabled_callback'),
            'ecg-settings',
            'ecg_quality_settings'
        );
    }
    
    // Callback functions for settings fields
    public function api_settings_callback() {
        echo '<p>' . __('Configure API settings for enhanced content generation.', 'enhanced-content-generator') . '</p>';
    }
    
    public function content_settings_callback() {
        echo '<p>' . __('Set default values for content generation parameters.', 'enhanced-content-generator') . '</p>';
    }
    
    public function quality_settings_callback() {
        echo '<p>' . __('Configure quality validation and research features.', 'enhanced-content-generator') . '</p>';
    }
    
    public function api_enabled_callback() {
        $value = get_option('ecg_api_enabled', true);
        echo '<input type="checkbox" name="ecg_api_enabled" value="1" ' . checked(1, $value, false) . ' />';
        echo '<p class="description">' . __('Enable enhanced AI-powered content generation.', 'enhanced-content-generator') . '</p>';
    }
    
    public function default_tone_callback() {
        $value = get_option('ecg_default_tone', 'informative');
        $tones = array(
            'informative' => __('Informative', 'enhanced-content-generator'),
            'conversational' => __('Conversational', 'enhanced-content-generator'),
            'professional' => __('Professional', 'enhanced-content-generator'),
            'persuasive' => __('Persuasive', 'enhanced-content-generator'),
            'enthusiastic' => __('Enthusiastic', 'enhanced-content-generator')
        );
        
        echo '<select name="ecg_default_tone">';
        foreach ($tones as $key => $label) {
            echo '<option value="' . $key . '" ' . selected($value, $key, false) . '>' . $label . '</option>';
        }
        echo '</select>';
    }
    
    public function default_length_callback() {
        $value = get_option('ecg_default_length', 3000);
        echo '<input type="number" name="ecg_default_length" value="' . $value . '" min="1500" max="8000" step="500" />';
        echo '<p class="description">' . __('Default word count for generated articles.', 'enhanced-content-generator') . '</p>';
    }
    
    public function seo_level_callback() {
        $value = get_option('ecg_seo_level', 80);
        echo '<input type="range" name="ecg_seo_level" value="' . $value . '" min="50" max="100" step="5" />';
        echo '<output>' . $value . '%</output>';
        echo '<p class="description">' . __('Default SEO optimization level.', 'enhanced-content-generator') . '</p>';
    }
    
    public function quality_validation_callback() {
        $value = get_option('ecg_quality_validation', true);
        echo '<input type="checkbox" name="ecg_quality_validation" value="1" ' . checked(1, $value, false) . ' />';
        echo '<p class="description">' . __('Automatically validate content quality and generate metrics.', 'enhanced-content-generator') . '</p>';
    }
    
    public function research_enabled_callback() {
        $value = get_option('ecg_research_enabled', true);
        echo '<input type="checkbox" name="ecg_research_enabled" value="1" ' . checked(1, $value, false) . ' />';
        echo '<p class="description">' . __('Automatically conduct research when no research data is provided.', 'enhanced-content-generator') . '</p>';
    }
}
