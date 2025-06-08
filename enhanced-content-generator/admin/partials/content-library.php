
<?php
/**
 * Content Library Page
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

global $wpdb;
$table_name = $wpdb->prefix . 'ecg_generated_content';
$generated_content = $wpdb->get_results("SELECT * FROM $table_name ORDER BY generation_time DESC LIMIT 20");
?>

<div class="wrap">
    <h1><?php _e('Content Library', 'enhanced-content-generator'); ?></h1>
    <p><?php _e('View and manage your generated content.', 'enhanced-content-generator'); ?></p>
    
    <div class="tablenav top">
        <div class="alignleft actions">
            <select name="action" id="bulk-action-selector-top">
                <option value="-1"><?php _e('Bulk Actions', 'enhanced-content-generator'); ?></option>
                <option value="delete"><?php _e('Delete', 'enhanced-content-generator'); ?></option>
                <option value="export"><?php _e('Export', 'enhanced-content-generator'); ?></option>
            </select>
            <input type="submit" id="doaction" class="button action" value="<?php _e('Apply', 'enhanced-content-generator'); ?>">
        </div>
    </div>
    
    <table class="wp-list-table widefat fixed striped">
        <thead>
            <tr>
                <td class="manage-column column-cb check-column">
                    <input id="cb-select-all-1" type="checkbox">
                </td>
                <th class="manage-column"><?php _e('Keywords', 'enhanced-content-generator'); ?></th>
                <th class="manage-column"><?php _e('Word Count', 'enhanced-content-generator'); ?></th>
                <th class="manage-column"><?php _e('SEO Score', 'enhanced-content-generator'); ?></th>
                <th class="manage-column"><?php _e('Generated', 'enhanced-content-generator'); ?></th>
                <th class="manage-column"><?php _e('Actions', 'enhanced-content-generator'); ?></th>
            </tr>
        </thead>
        <tbody>
            <?php if (empty($generated_content)): ?>
            <tr>
                <td colspan="6">
                    <?php _e('No content generated yet. Start by creating your first article!', 'enhanced-content-generator'); ?>
                </td>
            </tr>
            <?php else: ?>
            <?php foreach ($generated_content as $content): ?>
            <tr>
                <th class="check-column">
                    <input type="checkbox" name="content[]" value="<?php echo esc_attr($content->id); ?>">
                </th>
                <td>
                    <strong><?php echo esc_html($content->keywords); ?></strong>
                </td>
                <td><?php echo number_format($content->word_count); ?></td>
                <td>
                    <span class="seo-score seo-score-<?php echo $content->seo_score >= 80 ? 'good' : ($content->seo_score >= 60 ? 'fair' : 'poor'); ?>">
                        <?php echo esc_html($content->seo_score); ?>%
                    </span>
                </td>
                <td><?php echo date('M j, Y g:i A', strtotime($content->generation_time)); ?></td>
                <td>
                    <a href="#" class="button button-small view-content" data-id="<?php echo esc_attr($content->id); ?>">
                        <?php _e('View', 'enhanced-content-generator'); ?>
                    </a>
                    <a href="#" class="button button-small edit-content" data-id="<?php echo esc_attr($content->id); ?>">
                        <?php _e('Edit', 'enhanced-content-generator'); ?>
                    </a>
                    <a href="#" class="button button-small delete-content" data-id="<?php echo esc_attr($content->id); ?>">
                        <?php _e('Delete', 'enhanced-content-generator'); ?>
                    </a>
                </td>
            </tr>
            <?php endforeach; ?>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<style>
.seo-score {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;
}

.seo-score-good {
    background: #d4edda;
    color: #155724;
}

.seo-score-fair {
    background: #fff3cd;
    color: #856404;
}

.seo-score-poor {
    background: #f8d7da;
    color: #721c24;
}
</style>
