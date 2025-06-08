
<?php
/**
 * Analytics Page
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

global $wpdb;
$table_name = $wpdb->prefix . 'ecg_generated_content';

// Get analytics data
$total_content = $wpdb->get_var("SELECT COUNT(*) FROM $table_name");
$total_words = $wpdb->get_var("SELECT SUM(word_count) FROM $table_name");
$avg_seo_score = $wpdb->get_var("SELECT AVG(seo_score) FROM $table_name");
$recent_content = $wpdb->get_var("SELECT COUNT(*) FROM $table_name WHERE generation_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)");
?>

<div class="wrap">
    <h1><?php _e('Content Analytics', 'enhanced-content-generator'); ?></h1>
    
    <div class="ecg-analytics-dashboard">
        <div class="ecg-analytics-cards">
            <div class="ecg-analytics-card">
                <div class="ecg-card-icon">📄</div>
                <div class="ecg-card-content">
                    <h3><?php echo number_format($total_content); ?></h3>
                    <p><?php _e('Total Articles Generated', 'enhanced-content-generator'); ?></p>
                </div>
            </div>
            
            <div class="ecg-analytics-card">
                <div class="ecg-card-icon">📝</div>
                <div class="ecg-card-content">
                    <h3><?php echo number_format($total_words); ?></h3>
                    <p><?php _e('Total Words Generated', 'enhanced-content-generator'); ?></p>
                </div>
            </div>
            
            <div class="ecg-analytics-card">
                <div class="ecg-card-icon">🎯</div>
                <div class="ecg-card-content">
                    <h3><?php echo round($avg_seo_score, 1); ?>%</h3>
                    <p><?php _e('Average SEO Score', 'enhanced-content-generator'); ?></p>
                </div>
            </div>
            
            <div class="ecg-analytics-card">
                <div class="ecg-card-icon">📈</div>
                <div class="ecg-card-content">
                    <h3><?php echo number_format($recent_content); ?></h3>
                    <p><?php _e('Articles This Month', 'enhanced-content-generator'); ?></p>
                </div>
            </div>
        </div>
        
        <div class="ecg-analytics-charts">
            <div class="ecg-chart-container">
                <h3><?php _e('Content Generation Trends', 'enhanced-content-generator'); ?></h3>
                <canvas id="ecg-generation-chart"></canvas>
            </div>
            
            <div class="ecg-chart-container">
                <h3><?php _e('SEO Score Distribution', 'enhanced-content-generator'); ?></h3>
                <canvas id="ecg-seo-chart"></canvas>
            </div>
        </div>
    </div>
</div>

<style>
.ecg-analytics-dashboard {
    margin-top: 20px;
}

.ecg-analytics-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.ecg-analytics-card {
    background: white;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 20px;
}

.ecg-card-icon {
    font-size: 48px;
    opacity: 0.8;
}

.ecg-card-content h3 {
    margin: 0 0 5px 0;
    font-size: 32px;
    font-weight: bold;
    color: #333;
}

.ecg-card-content p {
    margin: 0;
    color: #666;
    font-size: 14px;
}

.ecg-analytics-charts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
}

.ecg-chart-container {
    background: white;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.ecg-chart-container h3 {
    margin-top: 0;
    margin-bottom: 20px;
    color: #333;
}

@media (max-width: 768px) {
    .ecg-analytics-charts {
        grid-template-columns: 1fr;
    }
}
</style>
