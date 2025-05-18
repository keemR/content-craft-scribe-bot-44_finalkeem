
<?php
/**
 * Content generation page.
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Get plugin options
$options = get_option('dcg_settings', array());
?>

<div class="wrap">
    <h1 class="wp-heading-inline">Content Generation</h1>
    
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-xl font-bold mb-4">Generate SEO-Optimized Content</h2>
        <p class="mb-4">Create high-quality, SEO-friendly content for your website. Fill in the form below to generate content based on your requirements.</p>
        
        <form id="dcg-generate-content-form" class="mt-6">
            <div class="mb-4">
                <label for="dcg-keywords" class="block font-medium mb-2">Target Keywords <span class="text-red-500">*</span></label>
                <input type="text" id="dcg-keywords" class="regular-text w-full" placeholder="Primary keyword, secondary keyword 1, secondary keyword 2..." required />
                <p class="text-xs text-gray-500 mt-1">Enter your main keyword first, followed by related keywords (separated by commas).</p>
            </div>
            
            <div class="mb-4">
                <label for="dcg-research-data" class="block font-medium mb-2">Research Data (Optional)</label>
                <textarea id="dcg-research-data" class="w-full" rows="5" placeholder="Paste your research data, URLs, statistics, or source information here... Or leave blank for AI to research your topic."></textarea>
                <p class="text-xs text-gray-500 mt-1">Optionally provide your own research data for more personalized content.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                    <label for="dcg-tone" class="block font-medium mb-2">Content Tone</label>
                    <select id="dcg-tone" class="regular-text w-full">
                        <option value="informative" <?php selected(isset($options['default_tone']) ? $options['default_tone'] : 'informative', 'informative'); ?>>Informative</option>
                        <option value="conversational" <?php selected(isset($options['default_tone']) ? $options['default_tone'] : 'informative', 'conversational'); ?>>Conversational</option>
                        <option value="professional" <?php selected(isset($options['default_tone']) ? $options['default_tone'] : 'informative', 'professional'); ?>>Professional</option>
                        <option value="persuasive" <?php selected(isset($options['default_tone']) ? $options['default_tone'] : 'informative', 'persuasive'); ?>>Persuasive</option>
                        <option value="enthusiastic" <?php selected(isset($options['default_tone']) ? $options['default_tone'] : 'informative', 'enthusiastic'); ?>>Enthusiastic</option>
                    </select>
                    <p class="text-xs text-gray-500 mt-1">"Conversational" and "Informative" tones typically perform best for SEO as they sound most natural.</p>
                </div>
                
                <div>
                    <label for="dcg-article-length" class="block font-medium mb-2">Article Length (words)</label>
                    <input type="number" id="dcg-article-length" class="regular-text w-full" value="<?php echo isset($options['default_article_length']) ? esc_attr($options['default_article_length']) : '1500'; ?>" min="1000" max="8000" step="100" />
                    <p class="text-xs text-gray-500 mt-1">
                        <?php 
                        $default_length = isset($options['default_article_length']) ? (int) $options['default_article_length'] : 1500;
                        if ($default_length < 3000) {
                            echo "Short-form content (good for specific topics)";
                        } elseif ($default_length < 5000) {
                            echo "Medium-length content (good balance)";
                        } else {
                            echo "Long-form content (optimal for comprehensive SEO)";
                        }
                        ?>
                    </p>
                </div>
            </div>
            
            <div class="mb-4">
                <label for="dcg-target-audience" class="block font-medium mb-2">Target Audience (Optional)</label>
                <input type="text" id="dcg-target-audience" class="regular-text w-full" placeholder="E.g. Beginners, professionals, Gen Z, senior executives..." />
                <p class="text-xs text-gray-500 mt-1">Specify your target audience to tailor the content to their needs and language.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div class="flex items-center space-x-2">
                    <input type="checkbox" id="dcg-include-images" <?php checked(isset($options['include_images']) ? $options['include_images'] : true); ?> />
                    <label for="dcg-include-images">Include Image Suggestions</label>
                </div>
                
                <div class="flex items-center space-x-2">
                    <input type="checkbox" id="dcg-include-faqs" <?php checked(isset($options['include_faqs']) ? $options['include_faqs'] : true); ?> />
                    <label for="dcg-include-faqs">Include FAQ Section</label>
                </div>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg mb-4">
                <div class="mb-4">
                    <label class="block font-medium mb-2">SEO Optimization Level: <span id="dcg-seo-level-value"><?php echo isset($options['seo_level']) ? esc_attr($options['seo_level']) : '80'; ?>%</span></label>
                    <input type="range" id="dcg-seo-level" min="50" max="100" step="5" value="<?php echo isset($options['seo_level']) ? esc_attr($options['seo_level']) : '80'; ?>" />
                    <p class="text-xs text-gray-500 mt-1">Higher values prioritize search engine ranking factors over natural language flow</p>
                </div>
                
                <div>
                    <label class="block font-medium mb-2">Content Specificity: <span id="dcg-content-specificity-value"><?php echo isset($options['content_specificity']) ? esc_attr($options['content_specificity']) : '70'; ?>%</span></label>
                    <input type="range" id="dcg-content-specificity" min="50" max="100" step="5" value="<?php echo isset($options['content_specificity']) ? esc_attr($options['content_specificity']) : '70'; ?>" />
                    <p class="text-xs text-gray-500 mt-1">Higher values create more detailed, specific content</p>
                </div>
            </div>
            
            <div class="flex items-center space-x-2 mb-6">
                <input type="checkbox" id="dcg-save-as-draft" />
                <label for="dcg-save-as-draft">Save as Draft Post</label>
                <p class="text-xs text-gray-500 ml-2">Automatically create a draft post with the generated content</p>
            </div>
            
            <button type="submit" class="button button-primary">Generate Content</button>
        </form>
    </div>
    
    <div id="dcg-content-results">
        <!-- Results will be displayed here -->
    </div>
</div>
