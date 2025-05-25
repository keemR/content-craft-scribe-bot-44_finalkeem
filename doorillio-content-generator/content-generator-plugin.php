
<?php
/**
 * Plugin Name: Doorillio Content Generator
 * Plugin URI: https://doorillio.com/content-generator
 * Description: AI-powered SEO content planning and generation system for health, wellness, and lifestyle websites.
 * Version: 1.0.0
 * Author: Doorillio
 * Author URI: https://doorillio.com
 * Text Domain: doorillio-content-generator
 * Domain Path: /languages
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('DCG_VERSION', '1.0.0');
define('DCG_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('DCG_PLUGIN_URL', plugin_dir_url(__FILE__));

// Include required files
require_once DCG_PLUGIN_DIR . 'includes/class-dcg-loader.php';
require_once DCG_PLUGIN_DIR . 'includes/class-dcg-admin.php';
require_once DCG_PLUGIN_DIR . 'includes/class-dcg-website-analyzer.php';
require_once DCG_PLUGIN_DIR . 'includes/class-dcg-content-planner.php';
require_once DCG_PLUGIN_DIR . 'includes/class-dcg-content-generator.php';
require_once DCG_PLUGIN_DIR . 'includes/class-dcg-csv-importer.php';
require_once DCG_PLUGIN_DIR . 'includes/class-dcg-content-generator-api.php';

/**
 * The main plugin class
 */
class Doorillio_Content_Generator {

    /**
     * Plugin instance.
     *
     * @var Doorillio_Content_Generator
     */
    private static $instance;

    /**
     * Plugin loader
     *
     * @var DCG_Loader
     */
    private $loader;

    /**
     * Plugin admin
     *
     * @var DCG_Admin
     */
    private $admin;

    /**
     * Website analyzer
     *
     * @var DCG_Website_Analyzer
     */
    private $analyzer;

    /**
     * Content planner
     *
     * @var DCG_Content_Planner
     */
    private $planner;

    /**
     * Content generator
     *
     * @var DCG_Content_Generator
     */
    private $generator;

    /**
     * CSV Importer
     *
     * @var DCG_CSV_Importer
     */
    private $importer;

    /**
     * Content Generator API
     *
     * @var DCG_Content_Generator_API
     */
    private $api;

    /**
     * Get plugin instance.
     *
     * @return Doorillio_Content_Generator
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor.
     */
    public function __construct() {
        $this->load_dependencies();
        $this->setup_hooks();
    }

    /**
     * Load required dependencies.
     */
    private function load_dependencies() {
        $this->loader = new DCG_Loader();
        $this->admin = new DCG_Admin();
        $this->analyzer = new DCG_Website_Analyzer();
        $this->planner = new DCG_Content_Planner();
        $this->generator = new DCG_Content_Generator();
        $this->importer = new DCG_CSV_Importer();
        $this->api = new DCG_Content_Generator_API();
    }

    /**
     * Set up hooks.
     */
    private function setup_hooks() {
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
        
        add_action('init', array($this, 'init'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        
        $this->loader->run();
    }

    /**
     * Initialize plugin.
     */
    public function init() {
        // Load text domain for translations
        load_plugin_textdomain('doorillio-content-generator', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }

    /**
     * Enqueue admin scripts and styles.
     */
    public function enqueue_admin_scripts($hook) {
        // Only load on our plugin pages
        if (strpos($hook, 'doorillio-content') === false) {
            return;
        }

        // Enqueue styles
        wp_enqueue_style(
            'dcg-admin-css',
            DCG_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            DCG_VERSION
        );

        wp_enqueue_style(
            'dcg-content-generator-css',
            DCG_PLUGIN_URL . 'assets/css/content-generator.css',
            array(),
            DCG_VERSION
        );

        // Enqueue scripts
        wp_enqueue_script(
            'dcg-admin-js',
            DCG_PLUGIN_URL . 'assets/js/admin.js',
            array('jquery'),
            DCG_VERSION,
            true
        );

        wp_enqueue_script(
            'dcg-content-generator-js',
            DCG_PLUGIN_URL . 'assets/js/content-generator.js',
            array('jquery'),
            DCG_VERSION,
            true
        );

        // Localize script with AJAX URL and nonce
        wp_localize_script('dcg-content-generator-js', 'dcg_ajax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('dcg_nonce')
        ));
    }

    /**
     * Plugin activation.
     */
    public function activate() {
        // Create necessary database tables
        $this->create_tables();
        
        // Add plugin options with default values
        $this->set_default_options();
        
        // Clear any existing transients
        $this->clear_transients();
        
        // Flush rewrite rules
        flush_rewrite_rules();
        
        // Set activation flag
        set_transient('dcg_activation_notice', true, 30);
    }

    /**
     * Plugin deactivation.
     */
    public function deactivate() {
        // Clear transients
        $this->clear_transients();
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }

    /**
     * Create custom database tables.
     */
    private function create_tables() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        // Content plans table
        $table_name = $wpdb->prefix . 'dcg_content_plans';
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            title varchar(255) NOT NULL,
            description text NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            updated_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            status varchar(50) DEFAULT 'draft' NOT NULL,
            plan_data longtext NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";
        
        // Content generation queue table
        $table_queue = $wpdb->prefix . 'dcg_content_queue';
        $sql_queue = "CREATE TABLE $table_queue (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            plan_id mediumint(9) NOT NULL,
            title varchar(255) NOT NULL,
            keywords text NOT NULL,
            content_type varchar(100) NOT NULL,
            status varchar(50) DEFAULT 'pending' NOT NULL,
            priority int(11) DEFAULT 10 NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            scheduled_date datetime NULL,
            options longtext NULL,
            generated_content longtext NULL,
            PRIMARY KEY  (id),
            KEY plan_id (plan_id)
        ) $charset_collate;";
        
        // Content analysis table
        $table_analysis = $wpdb->prefix . 'dcg_content_analysis';
        $sql_analysis = "CREATE TABLE $table_analysis (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            post_id bigint(20) NULL,
            analysis_type varchar(100) NOT NULL,
            analysis_data longtext NOT NULL,
            created_at datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id),
            KEY post_id (post_id)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        dbDelta($sql_queue);
        dbDelta($sql_analysis);
    }

    /**
     * Set default plugin options.
     */
    private function set_default_options() {
        $default_options = array(
            'version' => DCG_VERSION,
            'api_key' => '',
            'default_tone' => 'informative',
            'default_article_length' => 3000,
            'include_images' => true,
            'include_faqs' => true,
            'seo_level' => 80,
            'content_specificity' => 85,
            'prevent_repetition' => true,
            'include_examples' => true,
            'include_statistics' => true,
            'use_case_studies' => true,
            'unsplash_api_key' => '',
            'enable_research' => true,
            'auto_save_content' => true
        );
        
        update_option('dcg_settings', $default_options);
    }

    /**
     * Clear transients used by the plugin.
     */
    private function clear_transients() {
        delete_transient('dcg_website_analysis');
        delete_transient('dcg_content_plan');
        delete_transient('dcg_activation_notice');
    }

    /**
     * Get plugin option.
     */
    public static function get_option($key, $default = null) {
        $options = get_option('dcg_settings', array());
        return isset($options[$key]) ? $options[$key] : $default;
    }

    /**
     * Update plugin option.
     */
    public static function update_option($key, $value) {
        $options = get_option('dcg_settings', array());
        $options[$key] = $value;
        update_option('dcg_settings', $options);
    }
}

/**
 * Initialize the plugin.
 */
function doorillio_content_generator() {
    return Doorillio_Content_Generator::get_instance();
}

// Start the plugin
doorillio_content_generator();

// Add activation notice
add_action('admin_notices', function() {
    if (get_transient('dcg_activation_notice')) {
        delete_transient('dcg_activation_notice');
        ?>
        <div class="notice notice-success is-dismissible">
            <p><strong>Doorillio Content Generator</strong> has been activated successfully! 
            <a href="<?php echo admin_url('admin.php?page=doorillio-content-generator'); ?>">Get started</a> by generating your first article.</p>
        </div>
        <?php
    }
});
