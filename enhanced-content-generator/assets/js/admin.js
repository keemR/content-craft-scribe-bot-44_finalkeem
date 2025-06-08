
/**
 * Enhanced Content Generator Admin JavaScript
 */

(function($) {
    'use strict';
    
    class EnhancedContentGenerator {
        constructor() {
            this.currentProgress = 0;
            this.progressInterval = null;
            this.init();
        }
        
        init() {
            this.bindEvents();
            this.initializeSliders();
            this.initializeFormValidation();
        }
        
        bindEvents() {
            $(document).on('click', '#ecg-toggle-advanced', this.toggleAdvancedOptions);
            $(document).on('click', '#ecg-research-btn', this.researchTopic.bind(this));
            $(document).on('submit', '#ecg-content-form', this.generateContent.bind(this));
            $(document).on('click', '.ecg-tab-btn', this.switchTab);
            $(document).on('click', '#ecg-copy-content', this.copyContent);
            $(document).on('click', '#ecg-create-post', this.createPost);
            $(document).on('click', '#ecg-validate-content', this.validateContent.bind(this));
            $(document).on('click', '#ecg-export-content', this.exportContent);
        }
        
        initializeSliders() {
            $('#ecg-length, #ecg-seo-level, #ecg-specificity').on('input', function() {
                const value = $(this).val();
                const suffix = $(this).attr('id') === 'ecg-seo-level' || $(this).attr('id') === 'ecg-specificity' ? '%' : '';
                $(this).next('output').text(value + suffix);
            });
        }
        
        initializeFormValidation() {
            $('#ecg-keywords').on('blur', function() {
                const keywords = $(this).val().trim();
                if (keywords) {
                    $(this).removeClass('error').addClass('valid');
                } else {
                    $(this).removeClass('valid').addClass('error');
                }
            });
        }
        
        toggleAdvancedOptions() {
            const $advanced = $('.ecg-advanced-options');
            const $btn = $(this);
            
            if ($advanced.is(':visible')) {
                $advanced.slideUp(300);
                $btn.text('⚙️ Show Advanced Options');
            } else {
                $advanced.slideDown(300);
                $btn.text('⚙️ Hide Advanced Options');
            }
        }
        
        switchTab() {
            const tab = $(this).data('tab');
            
            $('.ecg-tab-btn').removeClass('active');
            $('.ecg-tab-content').removeClass('active');
            
            $(this).addClass('active');
            $(`.ecg-tab-${tab}`).addClass('active');
        }
        
        researchTopic() {
            const keywords = $('#ecg-keywords').val().trim();
            
            if (!keywords) {
                this.showNotification('Please enter keywords first.', 'error');
                $('#ecg-keywords').focus();
                return;
            }
            
            const $btn = $('#ecg-research-btn');
            this.setButtonLoading($btn, '🔍 Researching...');
            
            $.ajax({
                url: ecgAjax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'ecg_research_topic',
                    keywords: keywords,
                    nonce: ecgAjax.nonce
                },
                success: (response) => {
                    if (response.success) {
                        $('#ecg-research-data').val(response.data.research_data);
                        this.showNotification('Comprehensive research completed successfully!', 'success');
                        this.animateTextareaUpdate('#ecg-research-data');
                    } else {
                        this.showNotification('Research failed. Please try again.', 'error');
                    }
                },
                error: (xhr, status, error) => {
                    console.error('Research Error:', error);
                    this.showNotification('Research failed. Please check your connection and try again.', 'error');
                },
                complete: () => {
                    this.resetButton($btn, '🔍 Research Topic');
                }
            });
        }
        
        generateContent(e) {
            e.preventDefault();
            
            if (!this.validateForm()) {
                return;
            }
            
            const formData = $(e.target).serialize();
            const $btn = $('#ecg-generate-btn');
            
            this.setButtonLoading($btn, '🚀 Generating S-Tier Content...');
            $('.ecg-loading').show();
            $('.ecg-content-preview').hide();
            
            // Start enhanced progress simulation
            this.simulateEnhancedProgress();
            
            $.ajax({
                url: ecgAjax.ajaxurl,
                type: 'POST',
                data: formData + '&action=ecg_generate_content',
                timeout: 60000, // 60 second timeout
                success: (response) => {
                    this.clearProgressInterval();
                    
                    if (response.success) {
                        this.displayEnhancedContent(response.data);
                        this.showNotification('S-tier content generated successfully!', 'success');
                    } else {
                        this.showNotification('Content generation failed: ' + (response.data?.message || 'Unknown error'), 'error');
                    }
                },
                error: (xhr, status, error) => {
                    this.clearProgressInterval();
                    console.error('Generation Error:', {xhr, status, error});
                    
                    let errorMessage = 'Content generation failed. ';
                    if (status === 'timeout') {
                        errorMessage += 'Request timed out. Please try with shorter content or simpler keywords.';
                    } else {
                        errorMessage += 'Please check your connection and try again.';
                    }
                    
                    this.showNotification(errorMessage, 'error');
                },
                complete: () => {
                    this.resetButton($btn, '🚀 Generate S-Tier Article');
                    $('.ecg-loading').hide();
                }
            });
        }
        
        validateForm() {
            const keywords = $('#ecg-keywords').val().trim();
            
            if (!keywords) {
                this.showNotification('Please enter target keywords to generate content.', 'error');
                $('#ecg-keywords').focus().addClass('error');
                return false;
            }
            
            if (keywords.length < 3) {
                this.showNotification('Please enter more descriptive keywords (at least 3 characters).', 'error');
                $('#ecg-keywords').focus().addClass('error');
                return false;
            }
            
            return true;
        }
        
        simulateEnhancedProgress() {
            const steps = [
                { progress: 5, text: "Initializing enhanced AI generation system...", step: 'research' },
                { progress: 15, text: "Conducting comprehensive research and analysis...", step: 'research' },
                { progress: 25, text: "Analyzing competitor content and SERP data...", step: 'research' },
                { progress: 35, text: "Creating optimized content structure...", step: 'structure' },
                { progress: 45, text: "Generating S-tier content with specific protocols...", step: 'generation' },
                { progress: 60, text: "Integrating actionable medical information...", step: 'generation' },
                { progress: 70, text: "Adding proper citations and references...", step: 'citations' },
                { progress: 80, text: "Optimizing E-E-A-T authority signals...", step: 'eeat' },
                { progress: 90, text: "Validating content quality and accuracy...", step: 'validation' },
                { progress: 95, text: "Finalizing S-tier article...", step: 'validation' },
                { progress: 100, text: "Enhanced content generation complete!", step: 'validation' }
            ];
            
            let stepIndex = 0;
            
            this.progressInterval = setInterval(() => {
                if (stepIndex < steps.length) {
                    const step = steps[stepIndex];
                    this.updateProgress(step.progress, step.text, step.step);
                    stepIndex++;
                } else {
                    this.clearProgressInterval();
                }
            }, 1000);
        }
        
        updateProgress(progress, text, currentStep) {
            $('.ecg-progress-fill').css('width', progress + '%');
            $('#ecg-loading-status').text(text);
            
            // Update step indicators
            $('.ecg-step').removeClass('active');
            $(`.ecg-step[data-step="${currentStep}"]`).addClass('active');
        }
        
        clearProgressInterval() {
            if (this.progressInterval) {
                clearInterval(this.progressInterval);
                this.progressInterval = null;
            }
        }
        
        displayEnhancedContent(data) {
            const content = data.content;
            const validation = data.validation || {};
            
            // Convert markdown to HTML for preview
            const htmlContent = this.markdownToHtml(content);
            
            $('#ecg-content-preview-area').html(htmlContent);
            $('#ecg-content-markdown').val(content);
            $('#ecg-content-html').val(htmlContent);
            
            // Update enhanced stats
            this.updateContentStats(validation);
            
            // Display quality indicators
            this.updateQualityIndicators(validation);
            
            // Show analysis tabs
            this.updateSEOAnalysis(validation);
            this.updateEEATAnalysis(validation);
            
            $('.ecg-content-preview').show();
            $('.ecg-content-preview')[0].scrollIntoView({ behavior: 'smooth' });
        }
        
        updateContentStats(validation) {
            $('#ecg-word-count').text((validation.word_count || 0).toLocaleString());
            $('#ecg-reading-time').text((validation.reading_time || 0) + ' min');
            
            const seoScore = validation.seo_score || 0;
            const eeaTScore = validation.eeat_score || 0;
            const readabilityScore = validation.readability_score || 0;
            
            $('#ecg-seo-score').text(seoScore + '%');
            $('#ecg-eeat-score').text(eeaTScore + '%');
            $('#ecg-readability-score').text(readabilityScore + '/100');
            
            // Color code scores
            this.colorCodeScore('#ecg-seo-score', seoScore);
            this.colorCodeScore('#ecg-eeat-score', eeaTScore);
            this.colorCodeScore('#ecg-readability-score', readabilityScore);
        }
        
        colorCodeScore(selector, score) {
            const $element = $(selector);
            $element.removeClass('score-excellent score-good score-fair score-poor');
            
            if (score >= 90) {
                $element.addClass('score-excellent');
            } else if (score >= 75) {
                $element.addClass('score-good');
            } else if (score >= 60) {
                $element.addClass('score-fair');
            } else {
                $element.addClass('score-poor');
            }
        }
        
        updateQualityIndicators(validation) {
            const indicators = [
                { id: 'citations', key: 'has_citations', label: 'Proper Citations' },
                { id: 'author', key: 'has_author_info', label: 'Author Credentials' },
                { id: 'references', key: 'has_references', label: 'Reference Section' },
                { id: 'structure', key: 'heading_count', label: 'Content Structure', threshold: 5 }
            ];
            
            indicators.forEach(indicator => {
                const $indicator = $(`#ecg-${indicator.id}-indicator .ecg-indicator-status`);
                let status = false;
                
                if (indicator.threshold) {
                    status = (validation[indicator.key] || 0) >= indicator.threshold;
                } else {
                    status = validation[indicator.key] || false;
                }
                
                $indicator
                    .removeClass('pass fail')
                    .addClass(status ? 'pass' : 'fail')
                    .text(status ? 'PASS' : 'FAIL');
            });
            
            $('.ecg-quality-indicators').show();
        }
        
        updateSEOAnalysis(validation) {
            let analysis = '<div class="ecg-analysis-grid">';
            
            analysis += `<div class="ecg-analysis-item">
                <h5>📊 Content Metrics</h5>
                <p>Word Count: ${(validation.word_count || 0).toLocaleString()}</p>
                <p>Paragraphs: ${validation.paragraph_count || 0}</p>
                <p>Headings: ${validation.heading_count || 0}</p>
                <p>Keyword Density: ${validation.keyword_density || 0}%</p>
            </div>`;
            
            analysis += `<div class="ecg-analysis-item">
                <h5>🎯 SEO Optimization</h5>
                <p>SEO Score: ${validation.seo_score || 0}%</p>
                <p>Citations: ${validation.has_citations ? 'Present' : 'Missing'}</p>
                <p>Table of Contents: ${validation.has_toc ? 'Present' : 'Missing'}</p>
                <p>FAQ Section: ${validation.has_faq ? 'Present' : 'Missing'}</p>
            </div>`;
            
            analysis += '</div>';
            $('#ecg-seo-details').html(analysis);
        }
        
        updateEEATAnalysis(validation) {
            let analysis = '<div class="ecg-analysis-grid">';
            
            analysis += `<div class="ecg-analysis-item">
                <h5>⭐ Expertise Signals</h5>
                <p>Author Information: ${validation.has_author_info ? 'Present' : 'Missing'}</p>
                <p>Medical Review: ${validation.has_medical_review ? 'Present' : 'Missing'}</p>
                <p>Credentials Listed: ${validation.has_credentials ? 'Present' : 'Missing'}</p>
            </div>`;
            
            analysis += `<div class="ecg-analysis-item">
                <h5>🔗 Authority Signals</h5>
                <p>References Section: ${validation.has_references ? 'Present' : 'Missing'}</p>
                <p>External Links: ${validation.external_links || 0}</p>
                <p>Citation Count: ${validation.citation_count || 0}</p>
                <p>E-E-A-T Score: ${validation.eeat_score || 0}%</p>
            </div>`;
            
            analysis += '</div>';
            $('#ecg-eeat-details').html(analysis);
        }
        
        validateContent() {
            const content = $('#ecg-content-markdown').val();
            const keywords = $('#ecg-keywords').val();
            
            if (!content) {
                this.showNotification('No content to validate. Please generate content first.', 'error');
                return;
            }
            
            const $btn = $('#ecg-validate-content');
            this.setButtonLoading($btn, '✅ Validating...');
            
            $.ajax({
                url: ecgAjax.ajaxurl,
                type: 'POST',
                data: {
                    action: 'ecg_validate_content',
                    content: content,
                    keywords: keywords,
                    nonce: ecgAjax.nonce
                },
                success: (response) => {
                    if (response.success) {
                        this.updateContentStats(response.data.validation);
                        this.updateQualityIndicators(response.data.validation);
                        this.showNotification('Content validation completed!', 'success');
                    } else {
                        this.showNotification('Validation failed. Please try again.', 'error');
                    }
                },
                error: () => {
                    this.showNotification('Validation failed. Please try again.', 'error');
                },
                complete: () => {
                    this.resetButton($btn, '✅ Validate Quality');
                }
            });
        }
        
        copyContent() {
            const content = $('#ecg-content-markdown').val();
            
            if (!content) {
                this.showNotification('No content to copy. Please generate content first.', 'error');
                return;
            }
            
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(content).then(() => {
                    this.showNotification('Content copied to clipboard!', 'success');
                }).catch(() => {
                    this.fallbackCopyText(content);
                });
            } else {
                this.fallbackCopyText(content);
            }
        }
        
        fallbackCopyText(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            
            try {
                document.execCommand('copy');
                this.showNotification('Content copied to clipboard!', 'success');
            } catch (err) {
                this.showNotification('Unable to copy content. Please select and copy manually.', 'error');
            }
            
            document.body.removeChild(textarea);
        }
        
        createPost() {
            const content = $('#ecg-content-markdown').val();
            const keywords = $('#ecg-keywords').val();
            
            if (!content) {
                this.showNotification('No content to create post with. Please generate content first.', 'error');
                return;
            }
            
            // Extract title from content
            const titleMatch = content.match(/^# (.+)/m);
            const title = titleMatch ? titleMatch[1] : keywords.split(',')[0]?.trim() || 'Generated Article';
            
            // Create WordPress post
            const postUrl = new URL(window.location.origin + '/wp-admin/post-new.php');
            postUrl.searchParams.set('post_title', title);
            
            // Store content in session storage for retrieval
            sessionStorage.setItem('ecg_generated_content', content);
            sessionStorage.setItem('ecg_generated_keywords', keywords);
            
            window.open(postUrl.toString(), '_blank');
            
            this.showNotification('Opening WordPress editor with generated content...', 'info');
        }
        
        exportContent() {
            const content = $('#ecg-content-markdown').val();
            const keywords = $('#ecg-keywords').val();
            
            if (!content) {
                this.showNotification('No content to export. Please generate content first.', 'error');
                return;
            }
            
            const titleMatch = content.match(/^# (.+)/m);
            const title = titleMatch ? titleMatch[1] : 'Generated Article';
            const filename = this.slugify(title) + '.md';
            
            const blob = new Blob([content], { type: 'text/markdown' });
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            this.showNotification('Content exported successfully!', 'success');
        }
        
        markdownToHtml(markdown) {
            return markdown
                .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" style="max-width: 100%; height: auto;">')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
                .replace(/^- (.*)$/gm, '<li>$1</li>')
                .replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>')
                .replace(/^\| (.+) \|$/gm, function(match, content) {
                    const cells = content.split(' | ').map(cell => `<td>${cell}</td>`).join('');
                    return `<tr>${cells}</tr>`;
                })
                .replace(/(<tr>.*?<\/tr>)/gs, '<table class="ecg-table">$1</table>')
                .replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/^(.+)$/gm, '<p>$1</p>')
                .replace(/<p><\/p>/g, '')
                .replace(/<p>(<h[1-6]>.*?<\/h[1-6]>)<\/p>/g, '$1')
                .replace(/<p>(<ul>.*?<\/ul>)<\/p>/gs, '$1')
                .replace(/<p>(<ol>.*?<\/ol>)<\/p>/gs, '$1')
                .replace(/<p>(<table.*?<\/table>)<\/p>/gs, '$1')
                .replace(/<p>(<blockquote>.*?<\/blockquote>)<\/p>/gs, '$1');
        }
        
        animateTextareaUpdate(selector) {
            const $textarea = $(selector);
            $textarea.css({
                'border-color': '#28a745',
                'box-shadow': '0 0 0 3px rgba(40, 167, 69, 0.25)'
            });
            
            setTimeout(() => {
                $textarea.css({
                    'border-color': '#e0e0e0',
                    'box-shadow': 'none'
                });
            }, 2000);
        }
        
        setButtonLoading($button, text) {
            $button.prop('disabled', true).html(text);
        }
        
        resetButton($button, text) {
            $button.prop('disabled', false).html(text);
        }
        
        showNotification(message, type = 'info') {
            const iconMap = {
                'success': '✅',
                'error': '❌',
                'warning': '⚠️',
                'info': 'ℹ️'
            };
            
            const notification = $(`
                <div class="notice notice-${type} is-dismissible ecg-notification">
                    <p><span class="ecg-notification-icon">${iconMap[type] || 'ℹ️'}</span> ${message}</p>
                </div>
            `);
            
            $('.ecg-wrap').prepend(notification);
            
            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                notification.fadeOut(300, function() {
                    $(this).remove();
                });
            }, 5000);
            
            // Manual dismiss
            notification.on('click', '.notice-dismiss', function() {
                notification.fadeOut(300, function() {
                    $(this).remove();
                });
            });
        }
        
        slugify(text) {
            return text
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
        }
    }
    
    // Initialize when document is ready
    $(document).ready(function() {
        new EnhancedContentGenerator();
    });
    
})(jQuery);
