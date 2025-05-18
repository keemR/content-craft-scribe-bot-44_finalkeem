
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
    }

    /**
     * Set up hooks.
     */
    private function setup_hooks() {
        register_activation_hook(__FILE__, array($this, 'activate'));
        register_deactivation_hook(__FILE__, array($this, 'deactivate'));
        
        $this->loader->run();
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
            'default_article_length' => 1500,
            'include_images' => true,
            'include_faqs' => true,
            'seo_level' => 80,
            'content_specificity' => 70,
            'preventRepetition' => true,
            'includeExamples' => true,
            'includeStatistics' => true,
            'useCaseStudies' => true
        );
        
        update_option('dcg_settings', $default_options);
    }

    /**
     * Clear transients used by the plugin.
     */
    private function clear_transients() {
        delete_transient('dcg_website_analysis');
        delete_transient('dcg_content_plan');
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
