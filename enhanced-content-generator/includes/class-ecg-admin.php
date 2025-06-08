
<?php
/**
 * Admin functionality for Enhanced Content Generator
 */

class ECG_Admin {
    
    public function __construct() {
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        add_action('admin_init', array($this, 'register_settings'));
    }
    
    public function add_admin_menu() {
        add_menu_page(
            __('Enhanced Content Generator', 'enhanced-content-generator'),
            __('Content Generator', 'enhanced-content-generator'),
            'edit_posts',
            'enhanced-content-generator',
            array($this, 'admin_page'),
            'dashicons-edit-large',
            30
        );
        
        add_submenu_page(
            'enhanced-content-generator',
            __('Generate Content', 'enhanced-content-generator'),
            __('Generate Content', 'enhanced-content-generator'),
            'edit_posts',
            'enhanced-content-generator',
            array($this, 'admin_page')
        );
        
        add_submenu_page(
            'enhanced-content-generator',
            __('Content Library', 'enhanced-content-generator'),
            __('Content Library', 'enhanced-content-generator'),
            'edit_posts',
            'ecg-content-library',
            array($this, 'content_library_page')
        );
        
        add_submenu_page(
            'enhanced-content-generator',
            __('Settings', 'enhanced-content-generator'),
            __('Settings', 'enhanced-content-generator'),
            'manage_options',
            'ecg-settings',
            array($this, 'settings_page')
        );
        
        add_submenu_page(
            'enhanced-content-generator',
            __('Analytics', 'enhanced-content-generator'),
            __('Analytics', 'enhanced-content-generator'),
            'edit_posts',
            'ecg-analytics',
            array($this, 'analytics_page')
        );
    }
    
    public function enqueue_admin_scripts($hook) {
        if (strpos($hook, 'enhanced-content-generator') === false && strpos($hook, 'ecg-') === false) {
            return;
        }
        
        wp_enqueue_script(
            'ecg-admin-script',
            ECG_PLUGIN_URL . 'assets/js/admin.js',
            array('jquery'),
            ECG_VERSION,
            true
        );
        
        wp_enqueue_style(
            'ecg-admin-style',
            ECG_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            ECG_VERSION
        );
        
        wp_localize_script('ecg-admin-script', 'ecgAjax', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('ecg_nonce'),
            'strings' => array(
                'generating' => __('Generating enhanced content...', 'enhanced-content-generator'),
                'researching' => __('Conducting comprehensive research...', 'enhanced-content-generator'),
                'validating' => __('Validating content quality...', 'enhanced-content-generator'),
                'success' => __('Content generated successfully!', 'enhanced-content-generator'),
                'error' => __('An error occurred. Please try again.', 'enhanced-content-generator')
            )
        ));
    }
    
    public function register_settings() {
        register_setting('ecg_settings_group', 'ecg_api_enabled');
        register_setting('ecg_settings_group', 'ecg_research_enabled');
        register_setting('ecg_settings_group', 'ecg_quality_validation');
        register_setting('ecg_settings_group', 'ecg_default_tone');
        register_setting('ecg_settings_group', 'ecg_default_length');
        register_setting('ecg_settings_group', 'ecg_seo_level');
        register_setting('ecg_settings_group', 'ecg_content_specificity');
    }
    
    public function admin_page() {
        include ECG_PLUGIN_DIR . 'admin/partials/content-generator.php';
    }
    
    public function content_library_page() {
        include ECG_PLUGIN_DIR . 'admin/partials/content-library.php';
    }
    
    public function settings_page() {
        include ECG_PLUGIN_DIR . 'admin/partials/settings.php';
    }
    
    public function analytics_page() {
        include ECG_PLUGIN_DIR . 'admin/partials/analytics.php';
    }
}
