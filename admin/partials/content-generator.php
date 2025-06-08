<?php
/**
 * Enhanced Content Generator page with advanced features.
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap">
    <div class="dcg-header">
        <h1 class="wp-heading-inline">
            <span class="dcg-logo">🚀</span>
            Enhanced Content Generator v2.0
        </h1>
        <p class="dcg-subtitle">AI-powered content generation with advanced research and SEO optimization</p>
    </div>
    
    <div class="dcg-content-generator">
        <div class="dcg-generator-form">
            <form id="dcg-content-form" class="dcg-form">
                <?php wp_nonce_field('dcg_nonce', 'dcg_nonce'); ?>
                
                <div class="dcg-form-section">
                    <h3>📝 Content Settings</h3>
                    
                    <div class="dcg-form-group">
                        <label for="dcg-keywords">Target Keywords *</label>
                        <input type="text" id="dcg-keywords" name="keywords" required 
                               placeholder="Primary keyword, secondary keyword 1, secondary keyword 2...">
                        <p class="description">
                            <strong>💡 Pro Tip:</strong> Enter your main keyword first, followed by related keywords (separated by commas). 
                            Our AI will research your topic automatically if no research data is provided.
                        </p>
                    </div>
                    
                    <div class="dcg-form-group">
                        <label for="dcg-research-data">Research Data (Optional)</label>
                        <textarea id="dcg-research-data" name="research_data" rows="8" 
                                  placeholder="Paste your research data, URLs, statistics, or source information here... Or leave blank for AI to research your keywords automatically."></textarea>
                        <p class="description">
                            <strong>🔍 Enhanced Research:</strong> If left empty, our AI will conduct comprehensive web research 
                            including market analysis, expert opinions, and statistical insights.
                        </p>
                    </div>
                    
                    <div class="dcg-form-row">
                        <div class="dcg-form-group">
                            <label for="dcg-tone">Article Tone</label>
                            <select id="dcg-tone" name="tone">
                                <option value="informative">📚 Informative</option>
                                <option value="conversational">💬 Conversational</option>
                                <option value="professional">👔 Professional</option>
                                <option value="persuasive">🎯 Persuasive</option>
                                <option value="enthusiastic">⚡ Enthusiastic</option>
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
                                🖼️ Include Enhanced Image Suggestions
                            </label>
                        </div>
                        
                        <div class="dcg-form-group">
                            <label>
                                <input type="checkbox" id="dcg-faqs" name="include_faqs" checked>
                                ❓ Include Comprehensive FAQ Section
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="dcg-form-section dcg-advanced-options" style="display: none;">
                    <h3>⚙️ Advanced Options</h3>
                    
                    <div class="dcg-form-group">
                        <label for="dcg-seo-level">SEO Optimization Level</label>
                        <input type="range" id="dcg-seo-level" name="seo_level" min="50" max="100" step="5" value="80">
                        <output for="dcg-seo-level">80%</output>
                        <p class="description">Higher values prioritize search engine ranking factors and semantic optimization.</p>
                    </div>
                    
                    <div class="dcg-form-group">
                        <label for="dcg-audience">Target Audience</label>
                        <input type="text" id="dcg-audience" name="target_audience" 
                               placeholder="E.g. Beginners, professionals, Gen Z, senior executives, healthcare providers...">
                        <p class="description">Specify your target audience for personalized content approach.</p>
                    </div>
                    
                    <div class="dcg-form-group">
                        <label for="dcg-specificity">Content Specificity Level</label>
                        <input type="range" id="dcg-specificity" name="content_specificity" min="60" max="100" step="5" value="85">
                        <output for="dcg-specificity">85%</output>
                        <p class="description">Higher values create more detailed, technical content with specific examples.</p>
                    </div>
                    
                    <div class="dcg-form-row">
                        <div class="dcg-form-group">
                            <label>
                                <input type="checkbox" name="enhanced_generation" checked>
                                🚀 Use Enhanced AI Generation
                            </label>
                        </div>
                        
                        <div class="dcg-form-group">
                            <label>
                                <input type="checkbox" name="quality_validation" checked>
                                ✅ Enable Quality Validation
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="dcg-form-actions">
                    <button type="button" id="dcg-toggle-advanced" class="button">
                        ⚙️ Show Advanced Options
                    </button>
                    <button type="button" id="dcg-research-btn" class="button">
                        🔍 Research Topic
                    </button>
                    <button type="submit" id="dcg-generate-btn" class="button button-primary">
                        🚀 Generate Enhanced Article
                    </button>
                </div>
            </form>
        </div>
        
        <div class="dcg-content-preview" style="display: none;">
            <div class="dcg-preview-header">
                <h3>📄 Generated Content</h3>
                <div class="dcg-preview-actions">
                    <button type="button" id="dcg-validate-content" class="button">
                        ✅ Validate Quality
                    </button>
                    <button type="button" id="dcg-copy-content" class="button">
                        📋 Copy to Clipboard
                    </button>
                    <button type="button" id="dcg-create-post" class="button button-primary">
                        📝 Create WordPress Post
                    </button>
                </div>
            </div>
            
            <div class="dcg-content-stats">
                <div class="dcg-stat-item">
                    <span class="dcg-stat-label">Word Count:</span>
                    <span id="dcg-word-count">0</span>
                </div>
                <div class="dcg-stat-item">
                    <span class="dcg-stat-label">Reading Time:</span>
                    <span id="dcg-reading-time">0 min</span>
                </div>
                <div class="dcg-stat-item">
                    <span class="dcg-stat-label">SEO Score:</span>
                    <span id="dcg-seo-score">--</span>
                </div>
                <div class="dcg-stat-item">
                    <span class="dcg-stat-label">Readability:</span>
                    <span id="dcg-readability-score">--</span>
                </div>
            </div>
            
            <div class="dcg-quality-metrics" style="display: none;">
                <h4>📊 Content Quality Analysis</h4>
                <div id="dcg-quality-details"></div>
            </div>
            
            <div class="dcg-preview-tabs">
                <button type="button" class="dcg-tab-btn active" data-tab="preview">👁️ Preview</button>
                <button type="button" class="dcg-tab-btn" data-tab="markdown">📝 Markdown</button>
                <button type="button" class="dcg-tab-btn" data-tab="html">🌐 HTML</button>
                <button type="button" class="dcg-tab-btn" data-tab="seo">🎯 SEO Analysis</button>
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
            
            <div class="dcg-tab-content dcg-tab-seo">
                <div id="dcg-seo-analysis" class="dcg-seo-analysis">
                    <h4>🎯 SEO Performance Analysis</h4>
                    <div id="dcg-seo-details"></div>
                </div>
            </div>
        </div>
        
        <div class="dcg-loading" style="display: none;">
            <div class="dcg-loading-spinner"></div>
            <div class="dcg-loading-text">
                <h3>🚀 Generating Your Enhanced Article...</h3>
                <p id="dcg-loading-status">Initializing AI content generation system...</p>
                <div class="dcg-progress-bar">
                    <div class="dcg-progress-fill" style="width: 0%"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.dcg-header {
    margin-bottom: 20px;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
}

.dcg-logo {
    font-size: 1.2em;
    margin-right: 10px;
}

.dcg-subtitle {
    margin: 10px 0 0 0;
    opacity: 0.9;
    font-size: 14px;
}

.dcg-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.dcg-content-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin: 15px 0;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 5px;
}

.dcg-stat-item {
    text-align: center;
}

.dcg-stat-label {
    display: block;
    font-weight: bold;
    font-size: 12px;
    color: #666;
    margin-bottom: 5px;
}

.dcg-loading-text h3 {
    margin: 10px 0;
    color: #333;
}

.dcg-progress-bar {
    width: 100%;
    height: 6px;
    background: #e0e0e0;
    border-radius: 3px;
    overflow: hidden;
    margin-top: 10px;
}

.dcg-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea, #764ba2);
    transition: width 0.3s ease;
}

.dcg-quality-metrics {
    margin: 15px 0;
    padding: 15px;
    background: #f0f8ff;
    border-left: 4px solid #007cba;
    border-radius: 0 5px 5px 0;
}

.dcg-seo-analysis {
    padding: 20px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
}
</style>

<script type="text/javascript">
jQuery(document).ready(function($) {
    let currentProgress = 0;
    let progressInterval;
    
    // Initialize range sliders with enhanced feedback
    $('#dcg-length, #dcg-seo-level, #dcg-specificity').on('input', function() {
        const value = $(this).val();
        const output = $(this).next('output');
        
        if ($(this).attr('id') === 'dcg-seo-level' || $(this).attr('id') === 'dcg-specificity') {
            output.text(value + '%');
        } else {
            output.text(value);
        }
    });
    
    // Enhanced progress simulation
    function simulateProgress() {
        const steps = [
            { progress: 10, text: "Analyzing keywords and topic category..." },
            { progress: 25, text: "Conducting comprehensive research..." },
            { progress: 40, text: "Generating content structure..." },
            { progress: 55, text: "Creating enhanced sections..." },
            { progress: 70, text: "Optimizing for SEO performance..." },
            { progress: 85, text: "Validating content quality..." },
            { progress: 95, text: "Finalizing enhanced article..." },
            { progress: 100, text: "Content generation complete!" }
        ];
        
        let stepIndex = 0;
        
        progressInterval = setInterval(() => {
            if (stepIndex < steps.length) {
                const step = steps[stepIndex];
                $('.dcg-progress-fill').css('width', step.progress + '%');
                $('#dcg-loading-status').text(step.text);
                stepIndex++;
            } else {
                clearInterval(progressInterval);
            }
        }, 800);
    }
    
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
    
    // Enhanced content generation
    $('#dcg-content-form').on('submit', function(e) {
        e.preventDefault();
        
        const formData = $(this).serialize();
        const $btn = $('#dcg-generate-btn');
        
        $btn.prop('disabled', true).html('🚀 Generating Enhanced Content...');
        $('.dcg-loading').show();
        $('.dcg-content-preview').hide();
        
        // Start progress simulation
        simulateProgress();
        
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: formData + '&action=dcg_generate_content',
            success: function(response) {
                clearInterval(progressInterval);
                
                if (response.success) {
                    displayEnhancedContent(response.data);
                } else {
                    alert('Content generation failed: ' + (response.data.message || 'Unknown error'));
                }
            },
            error: function(xhr, status, error) {
                clearInterval(progressInterval);
                console.error('AJAX Error:', error);
                alert('Content generation failed. Please try again.');
            },
            complete: function() {
                $btn.prop('disabled', false).html('🚀 Generate Enhanced Article');
                $('.dcg-loading').hide();
            }
        });
    });
    
    // Enhanced content display
    function displayEnhancedContent(data) {
        const content = data.content;
        const validation = data.validation || {};
        
        // Convert markdown to HTML for preview
        const htmlContent = markdownToHtml(content);
        
        $('#dcg-content-preview-area').html(htmlContent);
        $('#dcg-content-markdown').val(content);
        $('#dcg-content-html').val(htmlContent);
        
        // Update enhanced stats
        $('#dcg-word-count').text(validation.word_count || data.word_count || 0);
        $('#dcg-reading-time').text((validation.reading_time || data.reading_time || 0) + ' min');
        $('#dcg-seo-score').text((validation.seo_score || '--') + (validation.seo_score ? '%' : ''));
        $('#dcg-readability-score').text((validation.readability_score || '--') + (validation.readability_score ? '/100' : ''));
        
        // Display quality metrics if available
        if (validation && Object.keys(validation).length > 0) {
            displayQualityMetrics(validation);
        }
        
        $('.dcg-content-preview').show();
        $('.dcg-content-preview')[0].scrollIntoView({ behavior: 'smooth' });
    }
    
    // Display quality metrics
    function displayQualityMetrics(validation) {
        let html = '<div class="dcg-quality-grid">';
        
        html += '<div class="dcg-quality-item">';
        html += '<h5>📊 Content Structure</h5>';
        html += '<p>Paragraphs: ' + (validation.paragraph_count || 0) + '</p>';
        html += '<p>Headings: ' + (validation.heading_count || 0) + '</p>';
        html += '</div>';
        
        html += '<div class="dcg-quality-item">';
        html += '<h5>🎯 SEO Performance</h5>';
        html += '<p>SEO Score: ' + (validation.seo_score || 0) + '%</p>';
        html += '<p>Keyword Density: ' + (validation.keyword_density || 0) + '%</p>';
        html += '</div>';
        
        if (validation.seo_issues && validation.seo_issues.length > 0) {
            html += '<div class="dcg-quality-item">';
            html += '<h5>⚠️ SEO Recommendations</h5>';
            validation.seo_issues.forEach(issue => {
                html += '<p>• ' + issue + '</p>';
            });
            html += '</div>';
        }
        
        html += '</div>';
        
        $('#dcg-quality-details').html(html);
        $('.dcg-quality-metrics').show();
    }
    
    // Content validation
    $('#dcg-validate-content').on('click', function() {
        const content = $('#dcg-content-markdown').val();
        const keywords = $('#dcg-keywords').val();
        
        if (!content) {
            alert('No content to validate.');
            return;
        }
        
        const $btn = $(this);
        $btn.prop('disabled', true).text('Validating...');
        
        $.ajax({
            url: ajaxurl,
            type: 'POST',
            data: {
                action: 'dcg_validate_content',
                content: content,
                keywords: keywords,
                nonce: $('#dcg_nonce').val()
            },
            success: function(response) {
                if (response.success) {
                    displayQualityMetrics(response.data);
                    // Update stats
                    $('#dcg-seo-score').text(response.data.seo_score + '%');
                    $('#dcg-readability-score').text(response.data.readability_score + '/100');
                } else {
                    alert('Validation failed.');
                }
            },
            complete: function() {
                $btn.prop('disabled', false).text('✅ Validate Quality');
            }
        });
    });
    
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
    
    // Convert markdown to HTML for preview
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
});
</script>
