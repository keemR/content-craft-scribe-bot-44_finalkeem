
/**
 * Doorillio Content Generator Admin Scripts
 */
jQuery(document).ready(function($) {
    // Range sliders with value display
    $('#dcg_seo_level').on('input', function() {
        $('#dcg_seo_level_value').text($(this).val() + '%');
    });

    $('#dcg_content_specificity').on('input', function() {
        $('#dcg_content_specificity_value').text($(this).val() + '%');
    });

    // Website analysis
    $('#dcg-analyze-website').on('click', function(e) {
        e.preventDefault();
        
        var $button = $(this);
        var $results = $('#dcg-analysis-results');
        
        // Show loading state
        $button.prop('disabled', true).html('<span class="dcg-loading"></span> Analyzing...');
        $results.html('<div class="dcg-notice">Analysis in progress... This may take a minute.</div>');
        
        // Ajax request
        $.ajax({
            url: dcgParams.ajaxurl,
            type: 'POST',
            data: {
                action: 'dcg_analyze_website',
                nonce: dcgParams.nonce
            },
            success: function(response) {
                $button.prop('disabled', false).text('Analyze Website');
                
                if (response.success) {
                    displayAnalysisResults(response.data);
                } else {
                    $results.html('<div class="dcg-notice dcg-notice-error">' + response.data.message + '</div>');
                }
            },
            error: function() {
                $button.prop('disabled', false).text('Analyze Website');
                $results.html('<div class="dcg-notice dcg-notice-error">An error occurred during analysis. Please try again.</div>');
            }
        });
    });

    // Generate content plan
    $('#dcg-generate-plan').on('click', function(e) {
        e.preventDefault();
        
        var $button = $(this);
        var $results = $('#dcg-plan-results');
        var analysisId = $button.data('analysis-id');
        
        if (!analysisId) {
            $results.html('<div class="dcg-notice dcg-notice-error">No analysis selected. Please run website analysis first.</div>');
            return;
        }
        
        // Show loading state
        $button.prop('disabled', true).html('<span class="dcg-loading"></span> Generating...');
        $results.html('<div class="dcg-notice">Generating content plan... This may take a minute.</div>');
        
        // Ajax request
        $.ajax({
            url: dcgParams.ajaxurl,
            type: 'POST',
            data: {
                action: 'dcg_generate_content_plan',
                nonce: dcgParams.nonce,
                analysis_id: analysisId
            },
            success: function(response) {
                $button.prop('disabled', false).text('Generate Content Plan');
                
                if (response.success) {
                    displayContentPlan(response.data);
                } else {
                    $results.html('<div class="dcg-notice dcg-notice-error">' + response.data.message + '</div>');
                }
            },
            error: function() {
                $button.prop('disabled', false).text('Generate Content Plan');
                $results.html('<div class="dcg-notice dcg-notice-error">An error occurred while generating the content plan. Please try again.</div>');
            }
        });
    });

    // Generate content
    $('#dcg-generate-content-form').on('submit', function(e) {
        e.preventDefault();
        
        var $form = $(this);
        var $button = $form.find('button[type="submit"]');
        var $results = $('#dcg-content-results');
        
        // Validate inputs
        var keywords = $form.find('#dcg-keywords').val();
        
        if (!keywords) {
            $results.html('<div class="dcg-notice dcg-notice-error">Please enter target keywords.</div>');
            return;
        }
        
        // Get form data
        var formData = {
            targetKeywords: keywords,
            researchData: $form.find('#dcg-research-data').val(),
            articleLength: $form.find('#dcg-article-length').val(),
            tone: $form.find('#dcg-tone').val(),
            includeImages: $form.find('#dcg-include-images').prop('checked'),
            includeFAQs: $form.find('#dcg-include-faqs').prop('checked'),
            targetAudience: $form.find('#dcg-target-audience').val(),
            seoLevel: $form.find('#dcg-seo-level').val(),
            contentSpecificity: $form.find('#dcg-content-specificity').val(),
            save_as_draft: $form.find('#dcg-save-as-draft').prop('checked')
        };
        
        // Show loading state
        $button.prop('disabled', true).html('<span class="dcg-loading"></span> Generating...');
        $results.html('<div class="dcg-notice">Generating content... This may take a few minutes.</div>');
        
        // Ajax request
        $.ajax({
            url: dcgParams.ajaxurl,
            type: 'POST',
            data: {
                action: 'dcg_generate_content',
                nonce: dcgParams.nonce,
                options: formData
            },
            success: function(response) {
                $button.prop('disabled', false).text('Generate Content');
                
                if (response.success) {
                    displayGeneratedContent(response.data);
                } else {
                    $results.html('<div class="dcg-notice dcg-notice-error">' + response.data.message + '</div>');
                }
            },
            error: function() {
                $button.prop('disabled', false).text('Generate Content');
                $results.html('<div class="dcg-notice dcg-notice-error">An error occurred while generating content. Please try again.</div>');
            }
        });
    });

    // Import CSV
    $('#dcg-import-csv-form').on('submit', function(e) {
        e.preventDefault();
        
        var $form = $(this);
        var $button = $form.find('button[type="submit"]');
        var $results = $('#dcg-import-results');
        
        // Validate file
        var file = $form.find('#dcg-csv-file')[0].files[0];
        
        if (!file) {
            $results.html('<div class="dcg-notice dcg-notice-error">Please select a CSV file.</div>');
            return;
        }
        
        // Show loading state
        $button.prop('disabled', true).html('<span class="dcg-loading"></span> Importing...');
        $results.html('<div class="dcg-notice">Importing CSV... Please wait.</div>');
        
        // Create FormData
        var formData = new FormData();
        formData.append('action', 'dcg_import_csv');
        formData.append('nonce', dcgParams.nonce);
        formData.append('csv_file', file);
        
        // Ajax request
        $.ajax({
            url: dcgParams.ajaxurl,
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                $button.prop('disabled', false).text('Import CSV');
                
                if (response.success) {
                    displayImportResults(response.data);
                } else {
                    $results.html('<div class="dcg-notice dcg-notice-error">' + response.data.message + '</div>');
                }
            },
            error: function() {
                $button.prop('disabled', false).text('Import CSV');
                $results.html('<div class="dcg-notice dcg-notice-error">An error occurred while importing the CSV. Please try again.</div>');
            }
        });
    });

    /**
     * Display analysis results.
     */
    function displayAnalysisResults(data) {
        var $results = $('#dcg-analysis-results');
        
        var html = '<div class="dcg-notice dcg-notice-info">Website analysis completed successfully!</div>';
        
        // Categories
        html += '<div class="dcg-results-section">';
        html += '<div class="dcg-results-title">Categories Analysis</div>';
        html += '<p>' + data.categories.length + ' categories found</p>';
        
        html += '<table class="widefat dcg-responsive-table">';
        html += '<thead><tr><th>Category</th><th>Posts</th><th>Depth</th></tr></thead>';
        html += '<tbody>';
        
        $.each(data.categories.slice(0, 10), function(index, category) {
            html += '<tr>';
            html += '<td>' + category.name + '</td>';
            html += '<td>' + category.post_count + '</td>';
            html += '<td>' + category.depth + '</td>';
            html += '</tr>';
        });
        
        if (data.categories.length > 10) {
            html += '<tr><td colspan="3">And ' + (data.categories.length - 10) + ' more categories...</td></tr>';
        }
        
        html += '</tbody></table>';
        html += '</div>';
        
        // Content statistics
        html += '<div class="dcg-results-section">';
        html += '<div class="dcg-results-title">Content Statistics</div>';
        
        html += '<p><strong>Average Word Count:</strong> ' + data.content_stats.average_word_count + ' words</p>';
        html += '<p><strong>Posts in Last 30 Days:</strong> ' + data.content_stats.posts_last_30_days + '</p>';
        html += '<p><strong>Average Posts Per Week:</strong> ' + data.content_stats.avg_posts_per_week + '</p>';
        
        html += '<div class="dcg-results-title mt-4">Content Age</div>';
        html += '<ul>';
        
        $.each(data.content_stats.content_age, function(age, count) {
            html += '<li><strong>' + age + ':</strong> ' + count + ' posts</li>';
        });
        
        html += '</ul>';
        html += '</div>';
        
        // Content gaps
        html += '<div class="dcg-results-section">';
        html += '<div class="dcg-results-title">Content Gaps</div>';
        
        if (data.content_gaps.topic_gaps && data.content_gaps.topic_gaps.length > 0) {
            html += '<p>' + data.content_gaps.topic_gaps.length + ' topic gaps identified</p>';
            
            html += '<div class="dcg-results-title mt-4">High Priority Gaps</div>';
            html += '<ul>';
            
            var highPriorityGaps = data.content_gaps.topic_gaps.filter(function(gap) {
                return gap.priority === 'high';
            });
            
            if (highPriorityGaps.length > 0) {
                $.each(highPriorityGaps, function(index, gap) {
                    html += '<li><span class="dcg-priority-high">●</span> ' + gap.topic + ' - ' + gap.recommendation + '</li>';
                });
            } else {
                html += '<li>No high priority gaps found</li>';
            }
            
            html += '</ul>';
        } else {
            html += '<p>No significant content gaps identified.</p>';
        }
        
        html += '</div>';
        
        // Keyword opportunities
        html += '<div class="dcg-results-section">';
        html += '<div class="dcg-results-title">Keyword Opportunities</div>';
        
        if (data.keyword_opportunities && data.keyword_opportunities.length > 0) {
            $.each(data.keyword_opportunities, function(index, opportunity) {
                html += '<div class="mb-4">';
                html += '<h4 class="font-bold">' + opportunity.category + '</h4>';
                html += '<div class="flex flex-wrap">';
                
                $.each(opportunity.keywords.slice(0, 6), function(i, keyword) {
                    html += '<span class="dcg-keyword-tag">' + keyword.keyword + '</span>';
                });
                
                html += '</div>';
                html += '</div>';
            });
        } else {
            html += '<p>No keyword opportunities identified.</p>';
        }
        
        html += '</div>';
        
        // Next steps
        html += '<div class="mt-4">';
        html += '<button id="dcg-generate-plan" class="button button-primary" data-analysis-id="' + data.analysis_id + '">Generate Content Plan</button>';
        html += '</div>';
        
        $results.html(html);
    }

    /**
     * Display content plan.
     */
    function displayContentPlan(data) {
        var $results = $('#dcg-plan-results');
        
        var html = '<div class="dcg-notice dcg-notice-info">Content plan generated successfully!</div>';
        
        // Content clusters
        html += '<div class="dcg-results-section">';
        html += '<div class="dcg-results-title">Content Clusters</div>';
        
        if (data.content_clusters && data.content_clusters.length > 0) {
            $.each(data.content_clusters, function(index, cluster) {
                html += '<div class="dcg-cluster-item">';
                html += '<div class="dcg-cluster-pillar">' + cluster.pillar + '</div>';
                
                if (cluster.subtopics && cluster.subtopics.length > 0) {
                    html += '<ul>';
                    
                    $.each(cluster.subtopics, function(i, subtopic) {
                        var priorityClass = '';
                        
                        if (subtopic.priority === 'high') {
                            priorityClass = 'dcg-priority-high';
                        } else if (subtopic.priority === 'medium') {
                            priorityClass = 'dcg-priority-medium';
                        } else {
                            priorityClass = 'dcg-priority-low';
                        }
                        
                        html += '<li class="dcg-cluster-subtopic"><span class="' + priorityClass + '">●</span> ' + subtopic.topic + '</li>';
                    });
                    
                    html += '</ul>';
                }
                
                if (cluster.keywords && cluster.keywords.length > 0) {
                    html += '<div class="mt-3 mb-2"><strong>Suggested Keywords:</strong></div>';
                    html += '<div class="flex flex-wrap">';
                    
                    $.each(cluster.keywords.slice(0, 5), function(i, keyword) {
                        html += '<span class="dcg-keyword-tag">' + keyword.keyword + '</span>';
                    });
                    
                    html += '</div>';
                }
                
                html += '</div>';
            });
        } else {
            html += '<p>No content clusters generated.</p>';
        }
        
        html += '</div>';
        
        // Content calendar
        html += '<div class="dcg-results-section">';
        html += '<div class="dcg-results-title">Content Calendar</div>';
        
        if (data.content_calendar && data.content_calendar.length > 0) {
            html += '<table class="dcg-calendar dcg-responsive-table">';
            html += '<thead><tr><th>Date</th><th>Topic</th><th>Type</th></tr></thead>';
            html += '<tbody>';
            
            $.each(data.content_calendar, function(index, item) {
                var rowClass = '';
                
                if (item.type === 'pillar') {
                    rowClass = 'dcg-pillar';
                } else if (item.type === 'cluster') {
                    rowClass = 'dcg-cluster';
                }
                
                html += '<tr class="' + rowClass + '">';
                html += '<td>' + item.date + '</td>';
                html += '<td>' + item.topic + '</td>';
                html += '<td>' + item.type + '</td>';
                html += '</tr>';
            });
            
            html += '</tbody></table>';
        } else {
            html += '<p>No content calendar generated.</p>';
        }
        
        html += '</div>';
        
        // Pillar content suggestions
        if (data.pillar_content && data.pillar_content.length > 0) {
            html += '<div class="dcg-results-section">';
            html += '<div class="dcg-results-title">Pillar Content Suggestions</div>';
            
            $.each(data.pillar_content, function(index, pillar) {
                html += '<div class="dcg-cluster-item">';
                html += '<div class="dcg-cluster-pillar">' + pillar.title + '</div>';
                html += '<p>' + pillar.description + '</p>';
                
                html += '<div class="mt-3"><strong>Suggested Sections:</strong></div>';
                html += '<ul>';
                
                $.each(pillar.sections.slice(0, 5), function(i, section) {
                    html += '<li>' + section.title + '</li>';
                });
                
                if (pillar.sections.length > 5) {
                    html += '<li>And ' + (pillar.sections.length - 5) + ' more sections...</li>';
                }
                
                html += '</ul>';
                html += '</div>';
            });
            
            html += '</div>';
        }
        
        // Next steps
        html += '<div class="mt-4">';
        html += '<a href="' + dcgParams.ajaxurl.replace('admin-ajax.php', 'admin.php?page=dcg-content-generation') + '" class="button button-primary">Generate Content</a>';
        html += '</div>';
        
        $results.html(html);
    }

    /**
     * Display generated content.
     */
    function displayGeneratedContent(data) {
        var $results = $('#dcg-content-results');
        
        var html = '<div class="dcg-notice dcg-notice-info">Content generated successfully!</div>';
        
        html += '<div class="dcg-results-section">';
        html += '<div class="dcg-results-title">Generated Content</div>';
        
        html += '<p><strong>Word Count:</strong> ' + data.word_count + '</p>';
        
        if (data.post_id) {
            html += '<p><strong>Saved as Draft:</strong> <a href="' + dcgParams.ajaxurl.replace('admin-ajax.php', 'post.php?post=' + data.post_id + '&action=edit') + '" target="_blank">Edit Post</a></p>';
        }
        
        html += '<div class="mt-4 p-4 bg-white border border-gray-200 rounded overflow-auto max-h-96">';
        html += '<div id="dcg-content-preview">' + data.content + '</div>';
        html += '</div>';
        
        html += '<div class="mt-4">';
        html += '<button id="dcg-copy-content" class="button button-secondary" data-content="' + encodeURIComponent(data.content) + '">Copy Content</button>';
        
        if (!data.post_id) {
            html += ' <button id="dcg-save-as-draft" class="button button-secondary" data-content="' + encodeURIComponent(data.content) + '">Save as Draft</button>';
        }
        
        html += '</div>';
        
        html += '</div>';
        
        $results.html(html);
        
        // Initialize copy button
        $('#dcg-copy-content').on('click', function() {
            var content = decodeURIComponent($(this).data('content'));
            
            // Create temp textarea
            var $temp = $('<textarea>');
            $('body').append($temp);
            $temp.val(content).select();
            document.execCommand('copy');
            $temp.remove();
            
            $(this).text('Copied!');
            
            setTimeout(function() {
                $('#dcg-copy-content').text('Copy Content');
            }, 2000);
        });
    }

    /**
     * Display import results.
     */
    function displayImportResults(data) {
        var $results = $('#dcg-import-results');
        
        var html = '<div class="dcg-notice dcg-notice-info">CSV imported successfully!</div>';
        
        html += '<div class="dcg-results-section">';
        html += '<div class="dcg-results-title">Import Results</div>';
        
        html += '<p><strong>Topics Found:</strong> ' + data.topics_count + '</p>';
        html += '<p><strong>Topics Saved:</strong> ' + data.saved_count + '</p>';
        
        if (data.plan_id) {
            html += '<p><strong>Content Plan Created:</strong> Yes (ID: ' + data.plan_id + ')</p>';
        }
        
        html += '<div class="mt-4">';
        html += '<a href="' + dcgParams.ajaxurl.replace('admin-ajax.php', 'admin.php?page=dcg-content-planning') + '" class="button button-primary">View Content Plans</a>';
        html += ' <a href="' + dcgParams.ajaxurl.replace('admin-ajax.php', 'admin.php?page=dcg-content-generation') + '" class="button button-secondary">Generate Content</a>';
        html += '</div>';
        
        html += '</div>';
        
        $results.html(html);
    }
});
