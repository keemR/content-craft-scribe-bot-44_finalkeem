
<?php
/**
 * The loader class that's responsible for maintaining and registering all hooks.
 */
class DCG_Loader {

    /**
     * The array of actions registered with WordPress.
     *
     * @var array
     */
    protected $actions;

    /**
     * The array of filters registered with WordPress.
     *
     * @var array
     */
    protected $filters;

    /**
     * Initialize the collections used to maintain the actions and filters.
     */
    public function __construct() {
        $this->actions = array();
        $this->filters = array();
        
        // Initialize admin hooks
        $this->add_action('admin_menu', $this, 'register_admin_menu');
        $this->add_action('admin_enqueue_scripts', $this, 'enqueue_admin_scripts');
        
        // Initialize AJAX handlers
        $this->add_action('wp_ajax_dcg_analyze_website', $this, 'handle_analyze_website_ajax');
        $this->add_action('wp_ajax_dcg_generate_content_plan', $this, 'handle_generate_plan_ajax');
        $this->add_action('wp_ajax_dcg_generate_content', $this, 'handle_generate_content_ajax');
        $this->add_action('wp_ajax_dcg_import_csv', $this, 'handle_import_csv_ajax');
        
        // Initialize post save hook to analyze content
        $this->add_action('save_post', $this, 'analyze_post_content', 10, 3);
    }

    /**
     * Add a new action to the collection to be registered with WordPress.
     *
     * @param string $hook          The name of the WordPress action.
     * @param object $component     A reference to the instance of the object.
     * @param string $callback      The name of the function to execute.
     * @param int    $priority      Optional. The priority at which the function is executed. Default 10.
     * @param int    $accepted_args Optional. The number of arguments the function accepts. Default 1.
     */
    public function add_action($hook, $component, $callback, $priority = 10, $accepted_args = 1) {
        $this->actions = $this->add($this->actions, $hook, $component, $callback, $priority, $accepted_args);
    }

    /**
     * Add a new filter to the collection to be registered with WordPress.
     *
     * @param string $hook          The name of the WordPress filter.
     * @param object $component     A reference to the instance of the object.
     * @param string $callback      The name of the function to execute.
     * @param int    $priority      Optional. The priority at which the function is executed. Default 10.
     * @param int    $accepted_args Optional. The number of arguments the function accepts. Default 1.
     */
    public function add_filter($hook, $component, $callback, $priority = 10, $accepted_args = 1) {
        $this->filters = $this->add($this->filters, $hook, $component, $callback, $priority, $accepted_args);
    }

    /**
     * A utility function that is used to register the actions and hooks into a single
     * collection.
     *
     * @param array  $hooks         The collection of hooks (actions or filters).
     * @param string $hook          The name of the WordPress action or filter.
     * @param object $component     A reference to the instance of the object.
     * @param string $callback      The name of the function to execute.
     * @param int    $priority      The priority at which the function is executed.
     * @param int    $accepted_args The number of arguments the function accepts.
     *
     * @return array The collection of hooks.
     */
    private function add($hooks, $hook, $component, $callback, $priority, $accepted_args) {
        $hooks[] = array(
            'hook'          => $hook,
            'component'     => $component,
            'callback'      => $callback,
            'priority'      => $priority,
            'accepted_args' => $accepted_args
        );

        return $hooks;
    }

    /**
     * Register the filters and actions with WordPress.
     */
    public function run() {
        if (!empty($this->filters)) {
            foreach ($this->filters as $hook) {
                add_filter($hook['hook'], array($hook['component'], $hook['callback']), $hook['priority'], $hook['accepted_args']);
            }
        }

        if (!empty($this->actions)) {
            foreach ($this->actions as $hook) {
                add_action($hook['hook'], array($hook['component'], $hook['callback']), $hook['priority'], $hook['accepted_args']);
            }
        }
    }
    
    /**
     * Register the admin menu.
     */
    public function register_admin_menu() {
        add_menu_page(
            __('Content Generator', 'doorillio-content-generator'),
            __('Content Generator', 'doorillio-content-generator'),
            'manage_options',
            'doorillio-content-generator',
            array($this, 'render_main_page'),
            'dashicons-editor-paste-text',
            30
        );
        
        add_submenu_page(
            'doorillio-content-generator',
            __('Dashboard', 'doorillio-content-generator'),
            __('Dashboard', 'doorillio-content-generator'),
            'manage_options',
            'doorillio-content-generator',
            array($this, 'render_main_page')
        );
        
        add_submenu_page(
            'doorillio-content-generator',
            __('Website Analysis', 'doorillio-content-generator'),
            __('Website Analysis', 'doorillio-content-generator'),
            'manage_options',
            'dcg-website-analysis',
            array($this, 'render_website_analysis_page')
        );
        
        add_submenu_page(
            'doorillio-content-generator',
            __('Content Planning', 'doorillio-content-generator'),
            __('Content Planning', 'doorillio-content-generator'),
            'manage_options',
            'dcg-content-planning',
            array($this, 'render_content_planning_page')
        );
        
        add_submenu_page(
            'doorillio-content-generator',
            __('Content Generation', 'doorillio-content-generator'),
            __('Content Generation', 'doorillio-content-generator'),
            'manage_options',
            'dcg-content-generation',
            array($this, 'render_content_generation_page')
        );
        
        add_submenu_page(
            'doorillio-content-generator',
            __('CSV Import', 'doorillio-content-generator'),
            __('CSV Import', 'doorillio-content-generator'),
            'manage_options',
            'dcg-csv-import',
            array($this, 'render_csv_import_page')
        );
        
        add_submenu_page(
            'doorillio-content-generator',
            __('Settings', 'doorillio-content-generator'),
            __('Settings', 'doorillio-content-generator'),
            'manage_options',
            'dcg-settings',
            array($this, 'render_settings_page')
        );
    }
    
    /**
     * Enqueue admin scripts and styles.
     */
    public function enqueue_admin_scripts($hook) {
        // Only load on plugin pages
        if (strpos($hook, 'doorillio-content-generator') === false && 
            strpos($hook, 'dcg-') === false) {
            return;
        }
        
        // Enqueue Tailwind CSS
        wp_enqueue_style(
            'dcg-tailwind',
            'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
            array(),
            DCG_VERSION
        );
        
        // Enqueue Font Awesome
        wp_enqueue_style(
            'dcg-fontawesome',
            'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.0.0/css/all.min.css',
            array(),
            DCG_VERSION
        );
        
        // Enqueue plugin CSS
        wp_enqueue_style(
            'dcg-admin-styles',
            DCG_PLUGIN_URL . 'assets/css/admin.css',
            array('dcg-tailwind', 'dcg-fontawesome'),
            DCG_VERSION
        );
        
        // Enqueue plugin JavaScript
        wp_enqueue_script(
            'dcg-admin-script',
            DCG_PLUGIN_URL . 'assets/js/admin.js',
            array('jquery'),
            DCG_VERSION,
            true
        );
        
        // Pass variables to script
        wp_localize_script(
            'dcg-admin-script',
            'dcgParams',
            array(
                'ajaxurl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('dcg-nonce')
            )
        );
    }
    
    /**
     * Render the main admin page.
     */
    public function render_main_page() {
        include_once DCG_PLUGIN_DIR . 'admin/partials/dashboard.php';
    }
    
    /**
     * Render the website analysis page.
     */
    public function render_website_analysis_page() {
        include_once DCG_PLUGIN_DIR . 'admin/partials/website-analysis.php';
    }
    
    /**
     * Render the content planning page.
     */
    public function render_content_planning_page() {
        include_once DCG_PLUGIN_DIR . 'admin/partials/content-planning.php';
    }
    
    /**
     * Render the content generation page.
     */
    public function render_content_generation_page() {
        include_once DCG_PLUGIN_DIR . 'admin/partials/content-generation.php';
    }
    
    /**
     * Render the CSV import page.
     */
    public function render_csv_import_page() {
        include_once DCG_PLUGIN_DIR . 'admin/partials/csv-import.php';
    }
    
    /**
     * Render the settings page.
     */
    public function render_settings_page() {
        include_once DCG_PLUGIN_DIR . 'admin/partials/settings.php';
    }
    
    /**
     * Handle website analysis AJAX request.
     */
    public function handle_analyze_website_ajax() {
        // Check nonce for security
        check_ajax_referer('dcg-nonce', 'nonce');
        
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => 'Insufficient permissions'));
            return;
        }
        
        global $doorillio_content_generator;
        $result = $doorillio_content_generator->analyzer->analyze_website();
        
        if (is_wp_error($result)) {
            wp_send_json_error(array('message' => $result->get_error_message()));
        } else {
            wp_send_json_success($result);
        }
        
        wp_die();
    }
    
    /**
     * Handle content plan generation AJAX request.
     */
    public function handle_generate_plan_ajax() {
        // Check nonce for security
        check_ajax_referer('dcg-nonce', 'nonce');
        
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => 'Insufficient permissions'));
            return;
        }
        
        $analysis_id = isset($_POST['analysis_id']) ? intval($_POST['analysis_id']) : 0;
        
        if (!$analysis_id) {
            wp_send_json_error(array('message' => 'Invalid analysis ID'));
            return;
        }
        
        global $doorillio_content_generator;
        $result = $doorillio_content_generator->planner->generate_content_plan($analysis_id);
        
        if (is_wp_error($result)) {
            wp_send_json_error(array('message' => $result->get_error_message()));
        } else {
            wp_send_json_success($result);
        }
        
        wp_die();
    }
    
    /**
     * Handle content generation AJAX request.
     */
    public function handle_generate_content_ajax() {
        // Check nonce for security
        check_ajax_referer('dcg-nonce', 'nonce');
        
        // Check user capabilities
        if (!current_user_can('edit_posts')) {
            wp_send_json_error(array('message' => 'Insufficient permissions'));
            return;
        }
        
        // Get content options from request
        $options = isset($_POST['options']) ? $_POST['options'] : array();
        
        if (empty($options)) {
            wp_send_json_error(array('message' => 'Invalid content options'));
            return;
        }
        
        global $doorillio_content_generator;
        $result = $doorillio_content_generator->generator->generate_content($options);
        
        if (is_wp_error($result)) {
            wp_send_json_error(array('message' => $result->get_error_message()));
        } else {
            wp_send_json_success($result);
        }
        
        wp_die();
    }
    
    /**
     * Handle CSV import AJAX request.
     */
    public function handle_import_csv_ajax() {
        // Check nonce for security
        check_ajax_referer('dcg-nonce', 'nonce');
        
        // Check user capabilities
        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => 'Insufficient permissions'));
            return;
        }
        
        if (!isset($_FILES['csv_file'])) {
            wp_send_json_error(array('message' => 'No file uploaded'));
            return;
        }
        
        global $doorillio_content_generator;
        $result = $doorillio_content_generator->importer->import_csv($_FILES['csv_file']);
        
        if (is_wp_error($result)) {
            wp_send_json_error(array('message' => $result->get_error_message()));
        } else {
            wp_send_json_success($result);
        }
        
        wp_die();
    }
    
    /**
     * Analyze post content when saving.
     */
    public function analyze_post_content($post_id, $post, $update) {
        // Skip auto-saves
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        
        // Check if this is a revision
        if (wp_is_post_revision($post_id)) {
            return;
        }
        
        // Check post type (only analyze posts and pages by default)
        $post_types = apply_filters('dcg_analyzed_post_types', array('post', 'page'));
        if (!in_array($post->post_type, $post_types)) {
            return;
        }
        
        global $doorillio_content_generator;
        $doorillio_content_generator->analyzer->analyze_post_content($post_id);
    }
}
