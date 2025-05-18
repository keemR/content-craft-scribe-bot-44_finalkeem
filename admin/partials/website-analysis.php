
<?php
/**
 * Website analysis page.
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap">
    <h1 class="wp-heading-inline">Website Analysis</h1>
    
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-xl font-bold mb-4">Content Analysis Tool</h2>
        <p class="mb-4">Analyze your website to identify content gaps, topic opportunities, and keyword potential. This analysis forms the foundation for your content planning strategy.</p>
        
        <button id="dcg-analyze-website" class="button button-primary">Analyze Website</button>
    </div>
    
    <div id="dcg-analysis-results">
        <!-- Results will be displayed here -->
    </div>
    
    <div id="dcg-plan-results">
        <!-- Plan results will be displayed here -->
    </div>
</div>
