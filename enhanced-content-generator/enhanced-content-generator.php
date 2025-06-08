
<?php
/**
 * Plugin Name: Enhanced Content Generator Pro
 * Plugin URI: https://enhanced-content-generator.com
 * Description: AI-powered content generation with advanced research, SEO optimization, and S-tier quality output. Generate professional, authoritative content with proper E-E-A-T signals.
 * Version: 2.0.0
 * Author: Enhanced Content Team
 * License: GPL v2 or later
 * Text Domain: enhanced-content-generator
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('ECG_VERSION', '2.0.0');
define('ECG_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('ECG_PLUGIN_URL', plugin_dir_url(__FILE__));
define('ECG_PLUGIN_FILE', __FILE__);

/**
 * Main plugin class
 */
class Enhanced_Content_Generator {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
    }
    
    public function init() {
        // Load dependencies
        $this->load_dependencies();
        
        // Initialize components
        if (is_admin()) {
            new ECG_Admin();
        }
        
        new ECG_Content_Generator_API();
        new ECG_Settings();
        
        // Load textdomain
        load_plugin_textdomain('enhanced-content-generator', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
    
    private function load_dependencies() {
        require_once ECG_PLUGIN_DIR . 'includes/class-ecg-admin.php';
        require_once ECG_PLUGIN_DIR . 'includes/class-ecg-content-generator.php';
        require_once ECG_PLUGIN_DIR . 'includes/class-ecg-content-generator-api.php';
        require_once ECG_PLUGIN_DIR . 'includes/class-ecg-settings.php';
        require_once ECG_PLUGIN_DIR . 'includes/class-ecg-research-engine.php';
        require_once ECG_PLUGIN_DIR . 'includes/class-ecg-quality-validator.php';
    }
    
    public function activate() {
        // Create necessary database tables
        $this->create_tables();
        
        // Set default options
        $this->set_default_options();
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }
    
    public function deactivate() {
        // Clean up scheduled events
        wp_clear_scheduled_hook('ecg_cleanup_temp_files');
    }
    
    private function create_tables() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'ecg_generated_content';
        
        $charset_collate = $wpdb->get_charset_collate();
        
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            keywords text NOT NULL,
            content longtext NOT NULL,
            word_count int(11) DEFAULT 0,
            seo_score int(3) DEFAULT 0,
            readability_score int(3) DEFAULT 0,
            generation_time datetime DEFAULT CURRENT_TIMESTAMP,
            post_id int(11) DEFAULT NULL,
            status varchar(20) DEFAULT 'draft',
            PRIMARY KEY (id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
    
    private function set_default_options() {
        $defaults = array(
            'ecg_api_enabled' => true,
            'ecg_research_enabled' => true,
            'ecg_quality_validation' => true,
            'ecg_default_tone' => 'informative',
            'ecg_default_length' => 3000,
            'ecg_seo_level' => 80,
            'ecg_content_specificity' => 85
        );
        
        foreach ($defaults as $option => $value) {
            add_option($option, $value);
        }
    }
}

// Initialize the plugin
new Enhanced_Content_Generator();
