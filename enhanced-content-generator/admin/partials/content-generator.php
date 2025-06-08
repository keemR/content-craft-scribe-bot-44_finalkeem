
<?php
/**
 * Enhanced Content Generator admin page with S-tier features
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap ecg-wrap">
    <div class="ecg-header">
        <h1 class="wp-heading-inline">
            <span class="ecg-logo">🚀</span>
            Enhanced Content Generator Pro v2.0
        </h1>
        <p class="ecg-subtitle">AI-powered S-tier content generation with advanced research, E-E-A-T signals, and clinical-grade accuracy</p>
    </div>
    
    <div class="ecg-content-generator">
        <div class="ecg-generator-form">
            <form id="ecg-content-form" class="ecg-form">
                <?php wp_nonce_field('ecg_nonce', 'ecg_nonce'); ?>
                
                <div class="ecg-form-section">
                    <h3>📝 Content Requirements</h3>
                    
                    <div class="ecg-form-group">
                        <label for="ecg-keywords">Target Keywords *</label>
                        <input type="text" id="ecg-keywords" name="keywords" required 
                               placeholder="Primary keyword, secondary keyword 1, secondary keyword 2...">
                        <p class="description">
                            <strong>💡 Pro Tip:</strong> Enter your main keyword first, followed by related keywords. 
                            Our enhanced AI will automatically research and generate S-tier content with proper citations and E-E-A-T signals.
                        </p>
                    </div>
                    
                    <div class="ecg-form-group">
                        <label for="ecg-research-data">Research Data (Optional)</label>
                        <textarea id="ecg-research-data" name="research_data" rows="8" 
                                  placeholder="Paste research data, statistics, or source information... Or leave blank for comprehensive AI research with citations."></textarea>
                        <p class="description">
                            <strong>🔍 Enhanced Research:</strong> Our AI conducts comprehensive research including expert insights, 
                            clinical studies, statistical analysis, and proper citation formatting for maximum authority.
                        </p>
                    </div>
                    
                    <div class="ecg-form-row">
                        <div class="ecg-form-group">
                            <label for="ecg-tone">Article Tone</label>
                            <select id="ecg-tone" name="tone">
                                <option value="informative">📚 Informative & Authoritative</option>
                                <option value="conversational">💬 Conversational & Accessible</option>
                                <option value="professional">👔 Professional & Clinical</option>
                                <option value="persuasive">🎯 Persuasive & Action-Oriented</option>
                                <option value="enthusiastic">⚡ Enthusiastic & Engaging</option>
                            </select>
                        </div>
                        
                        <div class="ecg-form-group">
                            <label for="ecg-length">Article Length (words)</label>
                            <input type="range" id="ecg-length" name="article_length" min="2000" max="8000" step="500" value="3000">
                            <output for="ecg-length">3000</output>
                            <p class="description">Longer articles (3000+ words) tend to rank higher</p>
                        </div>
                    </div>
                    
                    <div class="ecg-form-row">
                        <div class="ecg-form-group">
                            <label>
                                <input type="checkbox" id="ecg-images" name="include_images" checked>
                                🖼️ Include Professional Image Suggestions
                            </label>
                        </div>
                        
                        <div class="ecg-form-group">
                            <label>
                                <input type="checkbox" id="ecg-faqs" name="include_faqs" checked>
                                ❓ Include Expert-Level FAQ Section
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="ecg-form-section ecg-advanced-options" style="display: none;">
                    <h3>⚙️ Advanced S-Tier Options</h3>
                    
                    <div class="ecg-form-group">
                        <label for="ecg-seo-level">SEO Optimization Level</label>
                        <input type="range" id="ecg-seo-level" name="seo_level" min="70" max="100" step="5" value="85">
                        <output for="ecg-seo-level">85%</output>
                        <p class="description">Higher values create more aggressive SEO optimization with semantic keywords and structured data.</p>
                    </div>
                    
                    <div class="ecg-form-group">
                        <label for="ecg-audience">Target Audience</label>
                        <input type="text" id="ecg-audience" name="target_audience" 
                               placeholder="Healthcare professionals, patients, general public, specialists...">
                        <p class="description">Specify your target audience for personalized E-E-A-T signals and content approach.</p>
                    </div>
                    
                    <div class="ecg-form-group">
                        <label for="ecg-specificity">Content Specificity Level</label>
                        <input type="range" id="ecg-specificity" name="content_specificity" min="70" max="100" step="5" value="90">
                        <output for="ecg-specificity">90%</output>
                        <p class="description">Higher values create more detailed, actionable content with specific protocols and dosages.</p>
                    </div>
                    
                    <div class="ecg-form-row">
                        <div class="ecg-form-group">
                            <label>
                                <input type="checkbox" name="enhanced_generation" checked>
                                🚀 S-Tier Content Generation
                            </label>
                            <p class="description">Uses advanced AI for clinical-grade accuracy</p>
                        </div>
                        
                        <div class="ecg-form-group">
                            <label>
                                <input type="checkbox" name="eeat_optimization" checked>
                                ✅ Maximum E-E-A-T Optimization
                            </label>
                            <p class="description">Includes proper citations, author credentials, and authority signals</p>
                        </div>
                    </div>
                </div>
                
                <div class="ecg-form-actions">
                    <button type="button" id="ecg-toggle-advanced" class="button">
                        ⚙️ Show Advanced Options
                    </button>
                    <button type="button" id="ecg-research-btn" class="button">
                        🔍 Research Topic
                    </button>
                    <button type="submit" id="ecg-generate-btn" class="button button-primary button-hero">
                        🚀 Generate S-Tier Article
                    </button>
                </div>
            </form>
        </div>
        
        <div class="ecg-content-preview" style="display: none;">
            <div class="ecg-preview-header">
                <h3>📄 Generated S-Tier Content</h3>
                <div class="ecg-preview-actions">
                    <button type="button" id="ecg-validate-content" class="button">
                        ✅ Validate Quality
                    </button>
                    <button type="button" id="ecg-copy-content" class="button">
                        📋 Copy to Clipboard
                    </button>
                    <button type="button" id="ecg-create-post" class="button button-primary">
                        📝 Create WordPress Post
                    </button>
                    <button type="button" id="ecg-export-content" class="button">
                        💾 Export Content
                    </button>
                </div>
            </div>
            
            <div class="ecg-content-stats">
                <div class="ecg-stat-item ecg-stat-primary">
                    <span class="ecg-stat-label">Word Count:</span>
                    <span id="ecg-word-count">0</span>
                </div>
                <div class="ecg-stat-item ecg-stat-primary">
                    <span class="ecg-stat-label">Reading Time:</span>
                    <span id="ecg-reading-time">0 min</span>
                </div>
                <div class="ecg-stat-item ecg-stat-seo">
                    <span class="ecg-stat-label">SEO Score:</span>
                    <span id="ecg-seo-score">--</span>
                </div>
                <div class="ecg-stat-item ecg-stat-quality">
                    <span class="ecg-stat-label">E-E-A-T Score:</span>
                    <span id="ecg-eeat-score">--</span>
                </div>
                <div class="ecg-stat-item ecg-stat-readability">
                    <span class="ecg-stat-label">Readability:</span>
                    <span id="ecg-readability-score">--</span>
                </div>
            </div>
            
            <div class="ecg-quality-indicators" style="display: none;">
                <h4>📊 S-Tier Quality Analysis</h4>
                <div id="ecg-quality-details" class="ecg-quality-grid">
                    <div class="ecg-indicator" id="ecg-citations-indicator">
                        <span class="ecg-indicator-icon">📚</span>
                        <span class="ecg-indicator-label">Proper Citations</span>
                        <span class="ecg-indicator-status">--</span>
                    </div>
                    <div class="ecg-indicator" id="ecg-author-indicator">
                        <span class="ecg-indicator-icon">👨‍⚕️</span>
                        <span class="ecg-indicator-label">Author Credentials</span>
                        <span class="ecg-indicator-status">--</span>
                    </div>
                    <div class="ecg-indicator" id="ecg-references-indicator">
                        <span class="ecg-indicator-icon">🔗</span>
                        <span class="ecg-indicator-label">Reference Section</span>
                        <span class="ecg-indicator-status">--</span>
                    </div>
                    <div class="ecg-indicator" id="ecg-structure-indicator">
                        <span class="ecg-indicator-icon">📋</span>
                        <span class="ecg-indicator-label">Content Structure</span>
                        <span class="ecg-indicator-status">--</span>
                    </div>
                </div>
            </div>
            
            <div class="ecg-preview-tabs">
                <button type="button" class="ecg-tab-btn active" data-tab="preview">👁️ Preview</button>
                <button type="button" class="ecg-tab-btn" data-tab="markdown">📝 Markdown</button>
                <button type="button" class="ecg-tab-btn" data-tab="html">🌐 HTML</button>
                <button type="button" class="ecg-tab-btn" data-tab="seo">🎯 SEO Analysis</button>
                <button type="button" class="ecg-tab-btn" data-tab="eeat">⭐ E-E-A-T Analysis</button>
            </div>
            
            <div class="ecg-tab-content ecg-tab-preview active">
                <div id="ecg-content-preview-area" class="ecg-content-area"></div>
            </div>
            
            <div class="ecg-tab-content ecg-tab-markdown">
                <textarea id="ecg-content-markdown" class="ecg-content-textarea" readonly></textarea>
            </div>
            
            <div class="ecg-tab-content ecg-tab-html">
                <textarea id="ecg-content-html" class="ecg-content-textarea" readonly></textarea>
            </div>
            
            <div class="ecg-tab-content ecg-tab-seo">
                <div id="ecg-seo-analysis" class="ecg-analysis-panel">
                    <h4>🎯 Advanced SEO Performance Analysis</h4>
                    <div id="ecg-seo-details"></div>
                </div>
            </div>
            
            <div class="ecg-tab-content ecg-tab-eeat">
                <div id="ecg-eeat-analysis" class="ecg-analysis-panel">
                    <h4>⭐ E-E-A-T Authority Signals Analysis</h4>
                    <div id="ecg-eeat-details"></div>
                </div>
            </div>
        </div>
        
        <div class="ecg-loading" style="display: none;">
            <div class="ecg-loading-spinner"></div>
            <div class="ecg-loading-text">
                <h3>🚀 Generating S-Tier Content...</h3>
                <p id="ecg-loading-status">Initializing enhanced AI content generation system...</p>
                <div class="ecg-progress-bar">
                    <div class="ecg-progress-fill" style="width: 0%"></div>
                </div>
                <div class="ecg-loading-steps">
                    <div class="ecg-step" data-step="research">🔍 Comprehensive Research</div>
                    <div class="ecg-step" data-step="structure">📋 Content Structure</div>
                    <div class="ecg-step" data-step="generation">✍️ S-Tier Generation</div>
                    <div class="ecg-step" data-step="citations">📚 Citation Integration</div>
                    <div class="ecg-step" data-step="eeat">⭐ E-E-A-T Optimization</div>
                    <div class="ecg-step" data-step="validation">✅ Quality Validation</div>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
.ecg-wrap {
    margin: 20px 0;
}

.ecg-header {
    margin-bottom: 30px;
    padding: 30px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.ecg-logo {
    font-size: 1.4em;
    margin-right: 12px;
}

.ecg-subtitle {
    margin: 15px 0 0 0;
    opacity: 0.95;
    font-size: 16px;
    font-weight: 300;
}

.ecg-form-section {
    background: #fff;
    padding: 25px;
    margin-bottom: 20px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.ecg-form-section h3 {
    margin-top: 0;
    color: #333;
    font-size: 18px;
    border-bottom: 2px solid #667eea;
    padding-bottom: 10px;
}

.ecg-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 25px;
    margin-bottom: 20px;
}

.ecg-form-group {
    margin-bottom: 20px;
}

.ecg-form-group label {
    display: block;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
}

.ecg-form-group input[type="text"],
.ecg-form-group input[type="number"],
.ecg-form-group textarea,
.ecg-form-group select {
    width: 100%;
    padding: 12px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.3s ease;
}

.ecg-form-group input:focus,
.ecg-form-group textarea:focus,
.ecg-form-group select:focus {
    border-color: #667eea;
    outline: none;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.ecg-form-group input[type="range"] {
    width: 100%;
    margin: 10px 0;
}

.ecg-form-group output {
    display: inline-block;
    background: #667eea;
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: bold;
    margin-left: 10px;
}

.ecg-form-group .description {
    margin-top: 8px;
    font-size: 13px;
    color: #666;
    line-height: 1.4;
}

.ecg-form-actions {
    display: flex;
    gap: 15px;
    justify-content: flex-start;
    align-items: center;
    padding: 25px;
    background: #f8f9fa;
    border-radius: 8px;
    margin-top: 20px;
}

.button-hero {
    padding: 15px 30px !important;
    font-size: 16px !important;
    font-weight: 600 !important;
}

.ecg-content-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 15px;
    margin: 20px 0;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
}

.ecg-stat-item {
    text-align: center;
    padding: 15px;
    background: white;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
}

.ecg-stat-label {
    display: block;
    font-weight: 600;
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.ecg-stat-item span:last-child {
    font-size: 24px;
    font-weight: bold;
    color: #333;
}

.ecg-stat-seo span:last-child {
    color: #28a745;
}

.ecg-stat-quality span:last-child {
    color: #6f42c1;
}

.ecg-stat-readability span:last-child {
    color: #fd7e14;
}

.ecg-loading {
    text-align: center;
    padding: 50px;
    background: white;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
}

.ecg-loading-spinner {
    width: 60px;
    height: 60px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 30px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.ecg-progress-bar {
    width: 100%;
    height: 8px;
    background: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    margin: 20px 0;
}

.ecg-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea, #764ba2);
    transition: width 0.5s ease;
}

.ecg-loading-steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    margin-top: 30px;
}

.ecg-step {
    padding: 10px;
    background: #f8f9fa;
    border-radius: 6px;
    font-size: 12px;
    color: #666;
    transition: all 0.3s ease;
}

.ecg-step.active {
    background: #667eea;
    color: white;
    transform: scale(1.05);
}

.ecg-quality-indicators {
    margin: 20px 0;
    padding: 20px;
    background: #f0f8ff;
    border-left: 4px solid #667eea;
    border-radius: 0 8px 8px 0;
}

.ecg-quality-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-top: 15px;
}

.ecg-indicator {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px;
    background: white;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
}

.ecg-indicator-icon {
    font-size: 18px;
}

.ecg-indicator-label {
    flex-grow: 1;
    font-weight: 500;
    color: #333;
}

.ecg-indicator-status {
    font-weight: bold;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    text-transform: uppercase;
}

.ecg-indicator-status.pass {
    background: #d4edda;
    color: #155724;
}

.ecg-indicator-status.fail {
    background: #f8d7da;
    color: #721c24;
}

.ecg-preview-tabs {
    display: flex;
    background: #f8f9fa;
    border-radius: 8px 8px 0 0;
    border: 1px solid #e0e0e0;
    border-bottom: none;
    overflow: hidden;
}

.ecg-tab-btn {
    flex: 1;
    padding: 15px 20px;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 500;
    color: #666;
    transition: all 0.3s ease;
}

.ecg-tab-btn:hover {
    background: #e9ecef;
    color: #333;
}

.ecg-tab-btn.active {
    background: #667eea;
    color: white;
}

.ecg-tab-content {
    display: none;
    padding: 25px;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 0 0 8px 8px;
    min-height: 400px;
}

.ecg-tab-content.active {
    display: block;
}

.ecg-content-textarea {
    width: 100%;
    height: 500px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
    border: 1px solid #e0e0e0;
    padding: 15px;
    border-radius: 6px;
    resize: vertical;
}

.ecg-analysis-panel {
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
}

.ecg-analysis-panel h4 {
    margin-top: 0;
    color: #333;
    border-bottom: 2px solid #667eea;
    padding-bottom: 10px;
}

@media (max-width: 768px) {
    .ecg-form-row {
        grid-template-columns: 1fr;
    }
    
    .ecg-form-actions {
        flex-direction: column;
        align-items: stretch;
    }
    
    .ecg-form-actions .button {
        margin-bottom: 10px;
    }
    
    .ecg-content-stats {
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    }
    
    .ecg-loading-steps {
        grid-template-columns: 1fr;
    }
}
</style>
