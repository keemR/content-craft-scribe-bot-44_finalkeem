
<div class="wrap">
    <h1><?php _e('Content Generation', 'doorillio-content-generator'); ?></h1>
    
    <div class="dcg-content-generator">
        <form id="dcg-content-form" class="dcg-generator-form">
            <?php wp_nonce_field('dcg_nonce', 'dcg_nonce'); ?>
            
            <div class="dcg-form-section">
                <h3><?php _e('Content Requirements', 'doorillio-content-generator'); ?></h3>
                
                <div class="dcg-form-group">
                    <label for="dcg-keywords"><?php _e('Target Keywords', 'doorillio-content-generator'); ?></label>
                    <input type="text" id="dcg-keywords" name="keywords" required 
                           placeholder="<?php _e('Enter keywords separated by commas', 'doorillio-content-generator'); ?>">
                    <p class="description"><?php _e('Primary keyword should be first', 'doorillio-content-generator'); ?></p>
                </div>
                
                <div class="dcg-form-group">
                    <label for="dcg-research-data"><?php _e('Research Data', 'doorillio-content-generator'); ?></label>
                    <textarea id="dcg-research-data" name="research_data" rows="4" 
                              placeholder="<?php _e('Add any research notes or specific information to include', 'doorillio-content-generator'); ?>"></textarea>
                    <button type="button" id="dcg-research-btn" class="button">
                        <?php _e('Research Topic', 'doorillio-content-generator'); ?>
                    </button>
                </div>
            </div>
            
            <div class="dcg-form-section">
                <h3><?php _e('Content Settings', 'doorillio-content-generator'); ?></h3>
                
                <div class="dcg-form-row">
                    <div class="dcg-form-group">
                        <label for="dcg-length"><?php _e('Article Length', 'doorillio-content-generator'); ?></label>
                        <input type="range" id="dcg-length" name="article_length" min="800" max="5000" step="200" value="2000">
                        <output>2000</output>
                        <p class="description"><?php _e('Target word count', 'doorillio-content-generator'); ?></p>
                    </div>
                    
                    <div class="dcg-form-group">
                        <label for="dcg-tone"><?php _e('Writing Tone', 'doorillio-content-generator'); ?></label>
                        <select id="dcg-tone" name="tone">
                            <option value="informative"><?php _e('Informative', 'doorillio-content-generator'); ?></option>
                            <option value="conversational"><?php _e('Conversational', 'doorillio-content-generator'); ?></option>
                            <option value="professional"><?php _e('Professional', 'doorillio-content-generator'); ?></option>
                            <option value="persuasive"><?php _e('Persuasive', 'doorillio-content-generator'); ?></option>
                            <option value="enthusiastic"><?php _e('Enthusiastic', 'doorillio-content-generator'); ?></option>
                        </select>
                    </div>
                </div>
                
                <div class="dcg-form-row">
                    <div class="dcg-form-group">
                        <label for="dcg-target-audience"><?php _e('Target Audience', 'doorillio-content-generator'); ?></label>
                        <input type="text" id="dcg-target-audience" name="target_audience" 
                               placeholder="<?php _e('e.g., busy parents, fitness beginners', 'doorillio-content-generator'); ?>">
                    </div>
                    
                    <div class="dcg-form-group">
                        <label for="dcg-seo-level"><?php _e('SEO Level', 'doorillio-content-generator'); ?></label>
                        <input type="range" id="dcg-seo-level" name="seo_level" min="50" max="100" step="5" value="80">
                        <output>80%</output>
                        <p class="description"><?php _e('Higher values prioritize SEO over natural flow', 'doorillio-content-generator'); ?></p>
                    </div>
                </div>
            </div>
            
            <div class="dcg-form-section dcg-advanced-options" style="display: none;">
                <h3><?php _e('Advanced Options', 'doorillio-content-generator'); ?></h3>
                
                <div class="dcg-form-group">
                    <label>
                        <input type="checkbox" name="include_images" checked>
                        <?php _e('Include image suggestions', 'doorillio-content-generator'); ?>
                    </label>
                </div>
                
                <div class="dcg-form-group">
                    <label>
                        <input type="checkbox" name="include_faqs" checked>
                        <?php _e('Include FAQ section', 'doorillio-content-generator'); ?>
                    </label>
                </div>
            </div>
            
            <div class="dcg-form-actions">
                <button type="button" id="dcg-toggle-advanced" class="button">
                    <?php _e('Show Advanced Options', 'doorillio-content-generator'); ?>
                </button>
                <button type="submit" id="dcg-generate-btn" class="button button-primary">
                    <?php _e('Generate Article', 'doorillio-content-generator'); ?>
                </button>
            </div>
        </form>
        
        <div class="dcg-loading" style="display: none;">
            <div class="dcg-loading-spinner"></div>
            <p><?php _e('Generating your content...', 'doorillio-content-generator'); ?></p>
        </div>
        
        <div class="dcg-content-preview" style="display: none;">
            <div class="dcg-preview-header">
                <h3><?php _e('Generated Content', 'doorillio-content-generator'); ?></h3>
                <div class="dcg-preview-actions">
                    <button id="dcg-copy-content" class="button">
                        <?php _e('Copy Content', 'doorillio-content-generator'); ?>
                    </button>
                    <button id="dcg-create-post" class="button button-primary">
                        <?php _e('Create WordPress Post', 'doorillio-content-generator'); ?>
                    </button>
                </div>
            </div>
            
            <div class="dcg-content-stats">
                <span id="dcg-word-count"></span>
                <span id="dcg-reading-time"></span>
            </div>
            
            <div class="dcg-preview-tabs">
                <button class="dcg-tab-btn active" data-tab="preview"><?php _e('Preview', 'doorillio-content-generator'); ?></button>
                <button class="dcg-tab-btn" data-tab="markdown"><?php _e('Markdown', 'doorillio-content-generator'); ?></button>
                <button class="dcg-tab-btn" data-tab="html"><?php _e('HTML', 'doorillio-content-generator'); ?></button>
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
    </div>
</div>
