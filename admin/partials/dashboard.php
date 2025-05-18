
<?php
/**
 * Dashboard main page.
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap">
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 class="text-3xl font-bold mb-4 text-green-700">Doorillio Content Generator</h1>
        <p class="mb-4">Welcome to the Doorillio Content Generator plugin for WordPress. This powerful tool helps you plan, create, and optimize content for your website.</p>
        <p>Use the menu on the left to navigate through different sections of the plugin.</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-4 text-blue-700">Quick Start</h2>
            <ol class="list-decimal pl-6 mb-4">
                <li class="mb-2">Start by analyzing your website to discover content gaps and opportunities</li>
                <li class="mb-2">Create a content plan based on the analysis</li>
                <li class="mb-2">Generate high-quality, SEO-optimized content</li>
                <li class="mb-2">Publish and monitor performance</li>
            </ol>
            <a href="<?php echo admin_url('admin.php?page=dcg-website-analysis'); ?>" class="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">Start Website Analysis</a>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h2 class="text-xl font-bold mb-4 text-purple-700">Import Content Plan</h2>
            <p class="mb-4">Already have a content plan? Import it using CSV and start generating content immediately.</p>
            <p class="mb-4">Your CSV should include columns for topic, keywords, and optionally audience and notes.</p>
            <a href="<?php echo admin_url('admin.php?page=dcg-csv-import'); ?>" class="inline-block px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">Import CSV</a>
        </div>
    </div>
    
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 class="text-xl font-bold mb-4">Recent Activity</h2>
        <?php
        global $wpdb;
        
        $recent_plans = $wpdb->get_results(
            "SELECT id, title, created_at, status FROM {$wpdb->prefix}dcg_content_plans ORDER BY created_at DESC LIMIT 5"
        );
        
        $recent_content = $wpdb->get_results(
            "SELECT id, title, created_at, status FROM {$wpdb->prefix}dcg_content_queue ORDER BY created_at DESC LIMIT 5"
        );
        ?>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <h3 class="font-bold mb-2">Recent Content Plans</h3>
                <?php if ($recent_plans): ?>
                    <ul class="divide-y divide-gray-200">
                        <?php foreach ($recent_plans as $plan): ?>
                            <li class="py-2">
                                <span class="font-medium"><?php echo esc_html($plan->title); ?></span>
                                <div class="text-sm text-gray-600">
                                    <span><?php echo date('M j, Y', strtotime($plan->created_at)); ?></span>
                                    <span class="ml-2 px-2 py-1 text-xs rounded <?php echo $plan->status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'; ?>">
                                        <?php echo ucfirst($plan->status); ?>
                                    </span>
                                </div>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php else: ?>
                    <p class="text-gray-500">No content plans found.</p>
                <?php endif; ?>
            </div>
            
            <div>
                <h3 class="font-bold mb-2">Recent Generated Content</h3>
                <?php if ($recent_content): ?>
                    <ul class="divide-y divide-gray-200">
                        <?php foreach ($recent_content as $content): ?>
                            <li class="py-2">
                                <span class="font-medium"><?php echo esc_html($content->title); ?></span>
                                <div class="text-sm text-gray-600">
                                    <span><?php echo date('M j, Y', strtotime($content->created_at)); ?></span>
                                    <span class="ml-2 px-2 py-1 text-xs rounded <?php echo $content->status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ($content->status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'); ?>">
                                        <?php echo ucfirst($content->status); ?>
                                    </span>
                                </div>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php else: ?>
                    <p class="text-gray-500">No generated content found.</p>
                <?php endif; ?>
            </div>
        </div>
    </div>
    
    <div class="bg-gray-50 p-6 rounded-lg shadow-sm">
        <h2 class="text-xl font-bold mb-4">Plugin Documentation</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 bg-white rounded shadow-sm">
                <h3 class="font-bold mb-2">Website Analysis</h3>
                <p class="mb-2 text-sm">Analyze your website to identify content gaps and opportunities based on your existing content structure.</p>
                <a href="#" class="text-sm text-blue-600 hover:underline">Learn More</a>
            </div>
            
            <div class="p-4 bg-white rounded shadow-sm">
                <h3 class="font-bold mb-2">Content Planning</h3>
                <p class="mb-2 text-sm">Create strategic content plans using topic clusters to establish topical authority in your niche.</p>
                <a href="#" class="text-sm text-blue-600 hover:underline">Learn More</a>
            </div>
            
            <div class="p-4 bg-white rounded shadow-sm">
                <h3 class="font-bold mb-2">Content Generation</h3>
                <p class="mb-2 text-sm">Generate high-quality, SEO-optimized content based on your content plan and specific requirements.</p>
                <a href="#" class="text-sm text-blue-600 hover:underline">Learn More</a>
            </div>
        </div>
    </div>
</div>
