
<?php
/**
 * CSV import page.
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap">
    <h1 class="wp-heading-inline">CSV Import</h1>
    
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-xl font-bold mb-4">Import Content Topics from CSV</h2>
        <p class="mb-4">Upload a CSV file containing your content topics and keywords to automatically create a content plan. This is useful if you already have a list of topics you want to write about.</p>
        
        <div class="mb-6">
            <h3 class="text-lg font-bold mb-2">CSV Format Requirements</h3>
            <p class="mb-2">Your CSV file should include the following columns:</p>
            <ul class="list-disc pl-6 mb-4">
                <li><strong>topic</strong> (required) - The content topic or article title</li>
                <li><strong>keywords</strong> (required) - Target keywords separated by commas</li>
                <li><strong>audience</strong> (optional) - Target audience</li>
                <li><strong>notes</strong> (optional) - Additional notes or instructions</li>
            </ul>
            
            <div class="bg-gray-50 p-4 rounded-lg">
                <h4 class="font-bold mb-2">Example CSV</h4>
                <pre class="bg-white p-3 rounded border border-gray-200 text-sm overflow-auto">
topic,keywords,audience,notes
10 Best Protein Sources for Vegetarians,vegetarian protein sources,vegetarians,Include nutritional information
How to Start a Morning Exercise Routine,morning exercise routine,beginners,Focus on quick and easy exercises
Essential Vitamins for Women Over 40,vitamins for women over 40,women over 40,Include food sources for each vitamin</pre>
                <p class="text-xs text-gray-500 mt-2">The first row should contain column headers as shown above.</p>
            </div>
        </div>
        
        <form id="dcg-import-csv-form" enctype="multipart/form-data" class="mt-6">
            <div class="mb-4">
                <label for="dcg-csv-file" class="block font-medium mb-2">Select CSV File <span class="text-red-500">*</span></label>
                <input type="file" id="dcg-csv-file" accept=".csv" required />
            </div>
            
            <button type="submit" class="button button-primary">Import CSV</button>
        </form>
    </div>
    
    <div id="dcg-import-results">
        <!-- Results will be displayed here -->
    </div>
</div>
