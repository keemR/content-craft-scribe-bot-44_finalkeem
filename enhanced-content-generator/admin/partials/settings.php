
<?php
/**
 * Enhanced Content Generator Settings Page
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap">
    <h1><?php _e('Enhanced Content Generator Settings', 'enhanced-content-generator'); ?></h1>
    
    <form method="post" action="options.php">
        <?php
        settings_fields('ecg_settings_group');
        do_settings_sections('ecg-settings');
        submit_button();
        ?>
    </form>
</div>
