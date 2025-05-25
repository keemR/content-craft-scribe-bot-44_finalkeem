
/**
 * Admin JavaScript functionality for Doorillio Content Generator
 */

(function($) {
    'use strict';
    
    class DCGAdmin {
        constructor() {
            this.init();
        }
        
        init() {
            this.bindEvents();
            this.initSliders();
        }
        
        bindEvents() {
            $(document).on('click', '#dcg-analyze-website', this.analyzeWebsite.bind(this));
            $(document).on('click', '#dcg-generate-plan', this.generateContentPlan.bind(this));
            $(document).on('submit', '#dcg-csv-import-form', this.importCSV.bind(this));
            $(document).on('change', 'input[type="range"]', this.updateSliderValue);
        }
        
        initSliders() {
            $('input[type="range"]').each(function() {
                const $slider = $(this);
                const $output = $slider.siblings('span').first();
                const suffix = $slider.attr('id').includes('seo') ? '%' : '';
                $output.text($slider.val() + suffix);
            });
        }
        
        updateSliderValue() {
            const $slider = $(this);
            const $output = $slider.siblings('span').first();
            const suffix = $slider.attr('id').includes('seo') ? '%' : '';
            $output.text($slider.val() + suffix);
        }
        
        analyzeWebsite() {
            const $btn = $(this);
            this.setButtonLoading($btn, 'Analyzing...');
            
            $.ajax({
                url: dcgParams.ajaxurl,
                type: 'POST',
                data: {
                    action: 'dcg_analyze_website',
                    nonce: dcgParams.nonce
                },
                success: (response) => {
                    if (response.success) {
                        this.displayAnalysisResults(response.data);
                        this.showNotice('Website analysis completed successfully!', 'success');
                    } else {
                        this.showNotice('Analysis failed: ' + response.data.message, 'error');
                    }
                },
                error: () => {
                    this.showNotice('Analysis failed. Please try again.', 'error');
                },
                complete: () => {
                    this.resetButton($btn, 'Analyze Website');
                }
            });
        }
        
        generateContentPlan() {
            const analysisId = $('#analysis-id').val();
            
            if (!analysisId) {
                this.showNotice('Please run website analysis first.', 'warning');
                return;
            }
            
            const $btn = $(this);
            this.setButtonLoading($btn, 'Generating Plan...');
            
            $.ajax({
                url: dcgParams.ajaxurl,
                type: 'POST',
                data: {
                    action: 'dcg_generate_content_plan',
                    analysis_id: analysisId,
                    nonce: dcgParams.nonce
                },
                success: (response) => {
                    if (response.success) {
                        this.displayContentPlan(response.data);
                        this.showNotice('Content plan generated successfully!', 'success');
                    } else {
                        this.showNotice('Plan generation failed: ' + response.data.message, 'error');
                    }
                },
                error: () => {
                    this.showNotice('Plan generation failed. Please try again.', 'error');
                },
                complete: () => {
                    this.resetButton($btn, 'Generate Content Plan');
                }
            });
        }
        
        importCSV(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            formData.append('action', 'dcg_import_csv');
            formData.append('nonce', dcgParams.nonce);
            
            const $btn = $('#dcg-import-btn');
            this.setButtonLoading($btn, 'Importing...');
            
            $.ajax({
                url: dcgParams.ajaxurl,
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: (response) => {
                    if (response.success) {
                        this.showNotice('CSV imported successfully!', 'success');
                        this.displayImportResults(response.data);
                    } else {
                        this.showNotice('Import failed: ' + response.data.message, 'error');
                    }
                },
                error: () => {
                    this.showNotice('Import failed. Please try again.', 'error');
                },
                complete: () => {
                    this.resetButton($btn, 'Import CSV');
                }
            });
        }
        
        displayAnalysisResults(data) {
            const $container = $('#analysis-results');
            $container.html(`
                <div class="dcg-results-section">
                    <h3>Analysis Results</h3>
                    <p><strong>Posts Analyzed:</strong> ${data.total_posts}</p>
                    <p><strong>Content Gaps Found:</strong> ${data.gaps ? data.gaps.length : 0}</p>
                    <p><strong>SEO Opportunities:</strong> ${data.opportunities ? data.opportunities.length : 0}</p>
                </div>
            `);
            
            $('#analysis-id').val(data.analysis_id);
            $container.show();
        }
        
        displayContentPlan(data) {
            const $container = $('#content-plan-results');
            let html = '<div class="dcg-results-section"><h3>Generated Content Plan</h3>';
            
            if (data.clusters && data.clusters.length > 0) {
                html += '<div class="dcg-clusters">';
                data.clusters.forEach(cluster => {
                    html += `
                        <div class="dcg-cluster-item">
                            <h4 class="dcg-cluster-pillar">${cluster.pillar}</h4>
                            <div class="dcg-cluster-subtopics">
                    `;
                    
                    cluster.subtopics.forEach(subtopic => {
                        html += `<div class="dcg-cluster-subtopic">${subtopic}</div>`;
                    });
                    
                    html += '</div></div>';
                });
                html += '</div>';
            }
            
            html += '</div>';
            $container.html(html).show();
        }
        
        displayImportResults(data) {
            const $container = $('#import-results');
            $container.html(`
                <div class="dcg-results-section">
                    <h3>Import Results</h3>
                    <p><strong>Total Rows:</strong> ${data.total_rows}</p>
                    <p><strong>Successfully Imported:</strong> ${data.imported}</p>
                    <p><strong>Errors:</strong> ${data.errors}</p>
                </div>
            `);
            $container.show();
        }
        
        setButtonLoading($button, text) {
            $button.prop('disabled', true).text(text);
        }
        
        resetButton($button, text) {
            $button.prop('disabled', false).text(text);
        }
        
        showNotice(message, type = 'info') {
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
        new DCGAdmin();
    });
    
})(jQuery);
