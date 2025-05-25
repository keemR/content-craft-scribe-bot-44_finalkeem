
<div class="wrap">
    <h1><?php _e('Website Analysis', 'doorillio-content-generator'); ?></h1>
    
    <div class="dcg-analysis-section">
        <div class="dcg-card">
            <h2><?php _e('Analyze Your Website', 'doorillio-content-generator'); ?></h2>
            <p><?php _e('Get insights into your current content and discover opportunities for improvement.', 'doorillio-content-generator'); ?></p>
            
            <button id="dcg-analyze-website" class="button button-primary">
                <?php _e('Start Analysis', 'doorillio-content-generator'); ?>
            </button>
        </div>
        
        <div id="analysis-results" style="display: none;" class="dcg-card">
            <!-- Analysis results will be populated here -->
        </div>
        
        <input type="hidden" id="analysis-id" value="">
        
        <div class="dcg-card">
            <h2><?php _e('Generate Content Plan', 'doorillio-content-generator'); ?></h2>
            <p><?php _e('Create a strategic content plan based on your analysis results.', 'doorillio-content-generator'); ?></p>
            
            <button id="dcg-generate-plan" class="button">
                <?php _e('Generate Content Plan', 'doorillio-content-generator'); ?>
            </button>
        </div>
        
        <div id="content-plan-results" style="display: none;" class="dcg-card">
            <!-- Content plan results will be populated here -->
        </div>
    </div>
</div>
