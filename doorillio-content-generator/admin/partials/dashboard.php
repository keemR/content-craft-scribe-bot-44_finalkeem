
<div class="wrap">
    <h1><?php _e('Content Generator Dashboard', 'doorillio-content-generator'); ?></h1>
    
    <div class="dcg-dashboard">
        <div class="dcg-card">
            <h2><?php _e('Quick Actions', 'doorillio-content-generator'); ?></h2>
            <p><?php _e('Get started with content generation:', 'doorillio-content-generator'); ?></p>
            
            <div class="dcg-actions">
                <a href="<?php echo admin_url('admin.php?page=dcg-content-generation'); ?>" class="button button-primary">
                    <?php _e('Generate Content', 'doorillio-content-generator'); ?>
                </a>
                <a href="<?php echo admin_url('admin.php?page=dcg-website-analysis'); ?>" class="button">
                    <?php _e('Analyze Website', 'doorillio-content-generator'); ?>
                </a>
                <a href="<?php echo admin_url('admin.php?page=dcg-content-planning'); ?>" class="button">
                    <?php _e('Content Planning', 'doorillio-content-generator'); ?>
                </a>
            </div>
        </div>
        
        <div class="dcg-card">
            <h2><?php _e('Recent Activity', 'doorillio-content-generator'); ?></h2>
            <p><?php _e('Your latest content generation activity will appear here.', 'doorillio-content-generator'); ?></p>
        </div>
        
        <div class="dcg-card">
            <h2><?php _e('Statistics', 'doorillio-content-generator'); ?></h2>
            <div class="dcg-stats">
                <div class="dcg-stat">
                    <strong>0</strong>
                    <span><?php _e('Articles Generated', 'doorillio-content-generator'); ?></span>
                </div>
                <div class="dcg-stat">
                    <strong>0</strong>
                    <span><?php _e('Words Written', 'doorillio-content-generator'); ?></span>
                </div>
                <div class="dcg-stat">
                    <strong>0</strong>
                    <span><?php _e('Content Plans Created', 'doorillio-content-generator'); ?></span>
                </div>
            </div>
        </div>
    </div>
</div>
