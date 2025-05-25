
<div class="wrap">
    <h1><?php _e('Content Generator Settings', 'doorillio-content-generator'); ?></h1>
    
    <form method="post" action="options.php">
        <?php
        settings_fields('dcg_settings_group');
        do_settings_sections('dcg-settings');
        submit_button();
        ?>
    </form>
</div>
