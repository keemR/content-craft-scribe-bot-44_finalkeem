
<div class="wrap">
    <h1><?php _e('CSV Import', 'doorillio-content-generator'); ?></h1>
    
    <div class="dcg-import-section">
        <div class="dcg-card">
            <h2><?php _e('Import Content Topics', 'doorillio-content-generator'); ?></h2>
            <p><?php _e('Upload a CSV file with content topics and keywords to bulk import into your content queue.', 'doorillio-content-generator'); ?></p>
            
            <form id="dcg-csv-import-form" enctype="multipart/form-data">
                <div class="dcg-form-group">
                    <label for="csv_file"><?php _e('CSV File', 'doorillio-content-generator'); ?></label>
                    <input type="file" name="csv_file" id="csv_file" accept=".csv" required>
                    <p class="description">
                        <?php _e('CSV should include columns: title, keywords, content_type, tone, target_audience', 'doorillio-content-generator'); ?>
                    </p>
                </div>
                
                <button type="submit" id="dcg-import-btn" class="button button-primary">
                    <?php _e('Import CSV', 'doorillio-content-generator'); ?>
                </button>
            </form>
        </div>
        
        <div id="import-results" style="display: none;" class="dcg-card">
            <!-- Import results will be populated here -->
        </div>
        
        <div class="dcg-card">
            <h2><?php _e('CSV Format Example', 'doorillio-content-generator'); ?></h2>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th><?php _e('title', 'doorillio-content-generator'); ?></th>
                        <th><?php _e('keywords', 'doorillio-content-generator'); ?></th>
                        <th><?php _e('content_type', 'doorillio-content-generator'); ?></th>
                        <th><?php _e('tone', 'doorillio-content-generator'); ?></th>
                        <th><?php _e('target_audience', 'doorillio-content-generator'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Healthy Meal Planning</td>
                        <td>meal planning, healthy eating, budget meals</td>
                        <td>article</td>
                        <td>informative</td>
                        <td>busy parents</td>
                    </tr>
                    <tr>
                        <td>Home Workout Routines</td>
                        <td>home workouts, fitness, exercise</td>
                        <td>guide</td>
                        <td>motivational</td>
                        <td>fitness beginners</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
