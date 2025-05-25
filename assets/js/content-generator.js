
/**
 * Content Generator JavaScript
 */

(function($) {
    'use strict';
    
    class ContentGenerator {
        constructor() {
            this.init();
        }
        
        init() {
            this.bindEvents();
            this.initializeSliders();
        }
        
        bindEvents() {
            $(document).on('click', '#dcg-toggle-advanced', this.toggleAdvancedOptions);
            $(document).on('click', '#dcg-research-btn', this.researchTopic.bind(this));
            $(document).on('submit', '#dcg-content-form', this.generateContent.bind(this));
            $(document).on('click', '.dcg-tab-btn', this.switchTab);
            $(document).on('click', '#dcg-copy-content', this.copyContent);
            $(document).on('click', '#dcg-create-post', this.createPost);
        }
        
        initializeSliders() {
            $('#dcg-length, #dcg-seo-level').on('input', function() {
                const value = $(this).val();
                const suffix = $(this).attr('id') === 'dcg-seo-level' ? '%' : '';
                $(this).next('output').text(value + suffix);
            });
        }
        
        toggleAdvancedOptions() {
            const $advanced = $('.dcg-advanced-options');
            const $btn = $(this);
            
            if ($advanced.is(':visible')) {
                $advanced.slideUp();
                $btn.text('Show Advanced Options');
            } else {
                $advanced.slideDown();
                $btn.text('Hide Advanced Options');
            }
        }
        
        switchTab() {
            const tab = $(this).data('tab');
            
            $('.dcg-tab-btn').removeClass('active');
            $('.dcg-tab-content').removeClass('active');
            
            $(this).addClass('active');
            $(`.dcg-tab-${tab}`).addClass('active');
        }
        
        researchTopic() {
            const keywords = $('#dcg-keywords').val().trim();
            
            if (!keywords) {
                this.showMessage('Please enter keywords first.', 'error');
                return;
            }
            
            const $btn = $('#dcg-research-btn');
            this.setButtonLoading($btn, 'Researching...');
            
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: {
                    action: 'dcg_research_topic',
                    keywords: keywords,
                    nonce: $('#dcg_nonce').val()
                },
                success: (response) => {
                    if (response.success) {
                        $('#dcg-research-data').val(response.data.research_data);
                        this.showMessage('Research completed successfully!', 'success');
                    } else {
                        this.showMessage('Research failed. Please try again.', 'error');
                    }
                },
                error: () => {
                    this.showMessage('Research failed. Please try again.', 'error');
                },
                complete: () => {
                    this.resetButton($btn, 'Research Topic');
                }
            });
        }
        
        generateContent(e) {
            e.preventDefault();
            
            const formData = $(e.target).serialize();
            const $btn = $('#dcg-generate-btn');
            
            this.setButtonLoading($btn, 'Generating...');
            $('.dcg-loading').show();
            
            $.ajax({
                url: ajaxurl,
                type: 'POST',
                data: formData + '&action=dcg_generate_content',
                success: (response) => {
                    if (response.success) {
                        this.displayGeneratedContent(response.data.content);
                        this.showMessage('Content generated successfully!', 'success');
                    } else {
                        this.showMessage('Content generation failed. Please try again.', 'error');
                    }
                },
                error: () => {
                    this.showMessage('Content generation failed. Please try again.', 'error');
                },
                complete: () => {
                    this.resetButton($btn, 'Generate Article');
                    $('.dcg-loading').hide();
                }
            });
        }
        
        displayGeneratedContent(content) {
            const htmlContent = this.markdownToHtml(content);
            
            $('#dcg-content-preview-area').html(htmlContent);
            $('#dcg-content-markdown').val(content);
            $('#dcg-content-html').val(htmlContent);
            
            this.updateContentStats(content);
            
            $('.dcg-content-preview').show();
            $('.dcg-content-preview')[0].scrollIntoView({ behavior: 'smooth' });
        }
        
        updateContentStats(content) {
            const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
            const readingTime = Math.ceil(wordCount / 200);
            
            $('#dcg-word-count').text(`Word count: ${wordCount.toLocaleString()}`);
            $('#dcg-reading-time').text(`Reading time: ${readingTime} min`);
        }
        
        markdownToHtml(markdown) {
            return markdown
                .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2">')
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
                .replace(/^- (.*)$/gm, '<li>$1</li>')
                .replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>')
                .replace(/\n\n/g, '</p><p>')
                .replace(/^(.+)$/gm, '<p>$1</p>')
                .replace(/<p><\/p>/g, '')
                .replace(/<p>(<h[1-6]>.*?<\/h[1-6]>)<\/p>/g, '$1')
                .replace(/<p>(<ul>.*?<\/ul>)<\/p>/gs, '$1')
                .replace(/<p>(<ol>.*?<\/ol>)<\/p>/gs, '$1');
        }
        
        copyContent() {
            const content = $('#dcg-content-markdown').val();
            
            if (navigator.clipboard) {
                navigator.clipboard.writeText(content).then(() => {
                    this.showMessage('Content copied to clipboard!', 'success');
                });
            } else {
                // Fallback for older browsers
                const textarea = document.createElement('textarea');
                textarea.value = content;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                this.showMessage('Content copied to clipboard!', 'success');
            }
        }
        
        createPost() {
            const content = $('#dcg-content-markdown').val();
            const keywords = $('#dcg-keywords').val();
            const title = keywords.split(',')[0].trim();
            
            // Create a form to submit to WordPress
            const form = $('<form>', {
                action: 'post-new.php',
                method: 'GET',
                target: '_blank'
            });
            
            form.append($('<input>', {
                type: 'hidden',
                name: 'post_title',
                value: title
            }));
            
            form.append($('<input>', {
                type: 'hidden',
                name: 'content',
                value: content
            }));
            
            form.appendTo('body').submit().remove();
        }
        
        setButtonLoading($button, text) {
            $button.prop('disabled', true).text(text);
        }
        
        resetButton($button, text) {
            $button.prop('disabled', false).text(text);
        }
        
        showMessage(message, type = 'info') {
            // Create notification
            const notification = $(`
                <div class="notice notice-${type} is-dismissible">
                    <p>${message}</p>
                </div>
            `);
            
            $('.wrap').prepend(notification);
            
            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                notification.fadeOut();
            }, 5000);
        }
    }
    
    // Initialize when document is ready
    $(document).ready(function() {
        new ContentGenerator();
    });
    
})(jQuery);
