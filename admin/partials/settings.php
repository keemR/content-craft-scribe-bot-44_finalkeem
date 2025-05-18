
<?php
/**
 * Settings page.
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap">
    <h1 class="wp-heading-inline">Content Generator Settings</h1>
    
    <form method="post" action="options.php" class="mt-6">
        <?php
        settings_fields('dcg_settings_group');
        do_settings_sections('dcg-settings');
        submit_button();
        ?>
    </form>
</div>
