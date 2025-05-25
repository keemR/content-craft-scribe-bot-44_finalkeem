
<?php
/**
 * Content Generator page.
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap">
    <h1 class="wp-heading-inline">Content Generator</h1>
    
    <div class="dcg-content-generator">
        <div class="dcg-generator-form">
            <form id="dcg-content-form" class="dcg-form">
                <?php wp_nonce_field('dcg_nonce', 'dcg_nonce'); ?>
                
                <div class="dcg-form-section">
                    <h3>Content Settings</h3>
                    
                    <div class="dcg-form-group">
                        <label for="dcg-keywords">Target Keywords *</label>
                        <input type="text" id="dcg-keywords" name="keywords" required 
                               placeholder="Primary keyword, secondary keyword 1, secondary keyword 2...">
                        <p class="description">Enter your main keyword first, followed by related keywords (separated by commas).</p>
                    </div>
                    
                    <div class="dcg-form-group">
                        <label for="dcg-research-data">Research Data (Optional)</label>
                        <textarea id="dcg-research-data" name="research_data" rows="8" 
                                  placeholder="Paste your research data, URLs, statistics, or source information here..."></textarea>
                        <p class="description">Optionally provide your own research data. If left empty, AI will research your keywords.</p>
                    </div>
                    
                    <div class="dcg-form-row">
                        <div class="dcg-form-group">
                            <label for="dcg-tone">Article Tone</label>
                            <select id="dcg-tone" name="tone">
                                <option value="informative">Informative</option>
                                <option value="conversational">Conversational</option>
                                <option value="professional">Professional</option>
                                <option value="persuasive">Persuasive</option>
                                <option value="enthusiastic">Enthusiastic</option>
                            </select>
                        </div>
                        
                        <div class="dcg-form-group">
                            <label for="dcg-length">Article Length (words)</label>
                            <input type="range" id="dcg-length" name="article_length" min="1500" max="8000" step="500" value="3000">
                            <output for="dcg-length">3000</output>
                        </div>
                    </div>
                    
                    <div class="dcg-form-row">
                        <div class="dcg-form-group">
                            <label>
                                <input type="checkbox" id="dcg-images" name="include_images" checked>
                                Include Image Suggestions
                            </label>
                        </div>
                        
                        <div class="dcg-form-group">
                            <label>
                                <input type="checkbox" id="dcg-faqs" name="include_faqs" checked>
                                Include FAQ Section
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="dcg-form-section dcg-advanced-options" style="display: none;">
                    <h3>Advanced Options</h3>
                    
                    <div class="dcg-form-group">
                        <label for="dcg-seo-level">SEO Optimization Level</label>
                        <input type="range" id="dcg-seo-level" name="seo_level" min="50" max="100" step="5" value="80">
                        <output for="dcg-seo-level">80%</output>
                        <p class="description">Higher values prioritize search engine ranking factors.</p>
                    </div>
                    
                    <div class="dcg-form-group">
                        <label for="dcg-audience">Target Audience</label>
                        <input type="text" id="dcg-audience" name="target_audience" 
                               placeholder="E.g. Beginners, professionals, Gen Z, senior executives...">
                    </div>
                </div>
                
                <div class="dcg-form-actions">
                    <button type="button" id="dcg-toggle-advanced" class="button">Show Advanced Options</button>
                    <button type="button" id="dcg-research-btn" class="button">Research Topic</button>
                    <button type="submit" id="dcg-generate-btn" class="button button-primary">Generate Article</button>
                </div>
            </form>
        </div>
        
        <div class="dcg-content-preview" style="display: none;">
            <div class="dcg-preview-header">
                <h3>Generated Content</h3>
                <div class="dcg-preview-actions">
                    <button type="button" id="dcg-copy-content" class="button">Copy to Clipboard</button>
                    <button type="button" id="dcg-create-post" class="button button-primary">Create Post</button>
                </div>
            </div>
            
            <div class="dcg-content-stats">
                <span id="dcg-word-count">Word count: 0</span>
                <span id="dcg-reading-time">Reading time: 0 min</span>
            </div>
            
            <div class="dcg-preview-tabs">
                <button type="button" class="dcg-tab-btn active" data-tab="preview">Preview</button>
                <button type="button" class="dcg-tab-btn" data-tab="markdown">Markdown</button>
                <button type="button" class="dcg-tab-btn" data-tab="html">HTML</button>
            </div>
            
            <div class="dcg-tab-content dcg-tab-preview active">
                <div id="dcg-content-preview-area" class="dcg-content-area"></div>
            </div>
            
            <div class="dcg-tab-content dcg-tab-markdown">
                <textarea id="dcg-content-markdown" class="dcg-content-textarea" readonly></textarea>
            </div>
            
            <div class="dcg-tab-content dcg-tab-html">
                <textarea id="dcg-content-html" class="dcg-content-textarea" readonly></textarea>
            </div>
        </div>
        
        <div class="dcg-loading" style="display: none;">
            <div class="dcg-loading-spinner"></div>
            <p>Generating your high-quality article...</p>
        </div>
    </div>
</div>

<script type="text/javascript">
jQuery(document).ready(function($) {
    // Initialize range sliders
    $('#dcg-length').on('input', function() {
        $(this).next('output').text($(this).val());
    });
    
    $('#dcg-seo-level').on('input', function() {
        $(this).next('output').text($(this).val() + '%');
    });
    
    // Toggle advanced options
    $('#dcg-toggle-advanced').on('click', function() {
        const $advanced = $('.dcg-advanced-options');
        const $btn = $(this);
        
        if ($advanced.is(':visible')) {
            $advanced.slideUp();
            $btn.text('Show Advanced Options');
        } else {
            $advanced.slideDown();
            $btn.text('Hide Advanced Options');
        }
    });
    
    // Tab switching
    $('.dcg-tab-btn').on('click', function() {
        const tab = $(this).data('tab');
        
        $('.dcg-tab-btn').removeClass('active');
        $('.dcg-tab-content').removeClass('active');
        
        $(this).addClass('active');
        $(`.dcg-tab-${tab}`).addClass('active');
    });
    
    // Research topic
    $('#dcg-research-btn').on('click', function() {
        const keywords = $('#dcg-keywords').val();
        
        if (!keywords) {
            alert('Please enter keywords first.');
            return;
        }
        
        const $btn = $(this);
        $btn.prop('disabled', true).text('Researching...');
        
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'dcg_research_topic',
                keywords: keywords,
                nonce: $('#dcg_nonce').val()
            },
            success: function(response) {
                if (response.success) {
                    $('#dcg-research-data').val(response.data.research_data);
                } else {
                    alert('Research failed. Please try again.');
                }
            },
            error: function() {
                alert('Research failed. Please try again.');
            },
            complete: function() {
                $btn.prop('disabled', false).text('Research Topic');
            }
        });
    });
    
    // Generate content
    $('#dcg-content-form').on('submit', function(e) {
        e.preventDefault();
        
        const formData = $(this).serialize();
        const $btn = $('#dcg-generate-btn');
        
        $btn.prop('disabled', true).text('Generating...');
        $('.dcg-loading').show();
        
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: formData + '&action=dcg_generate_content',
            success: function(response) {
                if (response.success) {
                    displayGeneratedContent(response.data.content);
                } else {
                    alert('Content generation failed. Please try again.');
                }
            },
            error: function() {
                alert('Content generation failed. Please try again.');
            },
            complete: function() {
                $btn.prop('disabled', false).text('Generate Article');
                $('.dcg-loading').hide();
            }
        });
    });
    
    function displayGeneratedContent(content) {
        // Convert markdown to HTML for preview
        const htmlContent = markdownToHtml(content);
        
        $('#dcg-content-preview-area').html(htmlContent);
        $('#dcg-content-markdown').val(content);
        $('#dcg-content-html').val(htmlContent);
        
        // Update stats
        const wordCount = content.split(/\s+/).length;
        const readingTime = Math.ceil(wordCount / 200);
        
        $('#dcg-word-count').text(`Word count: ${wordCount}`);
        $('#dcg-reading-time').text(`Reading time: ${readingTime} min`);
        
        $('.dcg-content-preview').show();
        $('.dcg-content-preview')[0].scrollIntoView({ behavior: 'smooth' });
    }
    
    function markdownToHtml(markdown) {
        return markdown
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" style="max-width: 100%; height: auto;">')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(.*)$/gm, '<p>$1</p>')
            .replace(/<p><\/p>/g, '')
            .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/g, '$1')
            .replace(/<p>(<ul>.*<\/ul>)<\/p>/gs, '$1');
    }
    
    // Copy to clipboard
    $('#dcg-copy-content').on('click', function() {
        const content = $('#dcg-content-markdown').val();
        navigator.clipboard.writeText(content).then(function() {
            alert('Content copied to clipboard!');
        });
    });
    
    // Create post
    $('#dcg-create-post').on('click', function() {
        const content = $('#dcg-content-markdown').val();
        const keywords = $('#dcg-keywords').val();
        const title = keywords.split(',')[0].trim();
        
        // Open WordPress post editor with content
        const url = `post-new.php?post_title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`;
        window.open(url, '_blank');
    });
});
</script>
