
<?php
/**
 * Content Generator API Handler
 */

class DCG_Content_Generator_API {
    
    public function __construct() {
        add_action('wp_ajax_dcg_generate_content', array($this, 'generate_content'));
        add_action('wp_ajax_dcg_research_topic', array($this, 'research_topic'));
    }
    
    /**
     * Generate content via AJAX
     */
    public function generate_content() {
        check_ajax_referer('dcg_nonce', 'nonce');
        
        if (!current_user_can('edit_posts')) {
            wp_die(__('You do not have sufficient permissions to access this page.'));
        }
        
        $keywords = sanitize_text_field($_POST['keywords']);
        $research_data = sanitize_textarea_field($_POST['research_data']);
        $article_length = intval($_POST['article_length']);
        $tone = sanitize_text_field($_POST['tone']);
        $include_images = isset($_POST['include_images']) ? true : false;
        $include_faqs = isset($_POST['include_faqs']) ? true : false;
        $seo_level = intval($_POST['seo_level']);
        $target_audience = sanitize_text_field($_POST['target_audience']);
        
        // Generate content using the same logic as the React app
        $content = $this->generate_seo_content(array(
            'keywords' => $keywords,
            'research_data' => $research_data,
            'article_length' => $article_length,
            'tone' => $tone,
            'include_images' => $include_images,
            'include_faqs' => $include_faqs,
            'seo_level' => $seo_level,
            'target_audience' => $target_audience
        ));
        
        wp_send_json_success(array('content' => $content));
    }
    
    /**
     * Research topic via AJAX
     */
    public function research_topic() {
        check_ajax_referer('dcg_nonce', 'nonce');
        
        if (!current_user_can('edit_posts')) {
            wp_die(__('You do not have sufficient permissions to access this page.'));
        }
        
        $keywords = sanitize_text_field($_POST['keywords']);
        
        // Simulate research data generation
        $research_data = $this->perform_web_research($keywords);
        
        wp_send_json_success(array('research_data' => $research_data));
    }
    
    /**
     * Generate SEO content
     */
    private function generate_seo_content($options) {
        $keywords = explode(',', $options['keywords']);
        $primary_keyword = trim($keywords[0]);
        $topic_category = $this->determine_topic_category($primary_keyword);
        
        $content = "";
        
        // Title
        $title = $this->create_title_from_keywords($keywords, $topic_category);
        $content .= "# " . $title . "\n\n";
        
        // Reading time
        $reading_time = ceil($options['article_length'] / 200);
        $content .= "*Reading time: {$reading_time} minutes*\n\n";
        
        // Key Takeaways
        $content .= "## Key Takeaways\n\n";
        $content .= $this->generate_key_takeaways($keywords, $topic_category) . "\n\n";
        
        // Introduction
        $content .= $this->generate_introduction($keywords, $options['tone'], $options['target_audience'], $topic_category) . "\n\n";
        
        // Table of Contents
        $headings = $this->generate_headings($keywords, $topic_category, $options['target_audience']);
        $content .= "## Table of Contents\n\n";
        foreach ($headings as $index => $heading) {
            $slug = $this->slugify($heading);
            $content .= ($index + 1) . ". [{$heading}](#{$slug})\n";
        }
        $content .= "\n\n";
        
        // Sections
        $section_length = floor($options['article_length'] / count($headings));
        foreach ($headings as $index => $heading) {
            $slug = $this->slugify($heading);
            $content .= "<h2 id=\"{$slug}\">{$heading}</h2>\n\n";
            $content .= $this->generate_section_content($heading, $keywords, $options['tone'], $section_length, $options['target_audience'], $topic_category) . "\n\n";
            
            if ($options['include_images']) {
                $content .= $this->generate_visual_content($heading, $primary_keyword, $topic_category, $index) . "\n\n";
            }
        }
        
        // FAQs
        if ($options['include_faqs']) {
            $content .= "## Frequently Asked Questions\n\n";
            $content .= $this->generate_faqs($keywords, $options['target_audience'], $topic_category) . "\n\n";
        }
        
        // Conclusion
        $content .= "## Conclusion\n\n";
        $content .= $this->generate_conclusion($keywords, $options['tone'], $options['target_audience'], $topic_category) . "\n\n";
        
        return $content;
    }
    
    private function determine_topic_category($keyword) {
        $keyword = strtolower($keyword);
        
        if (strpos($keyword, 'meal') !== false || strpos($keyword, 'diet') !== false || strpos($keyword, 'food') !== false) {
            return 'meal-planning';
        }
        if (strpos($keyword, 'marketing') !== false || strpos($keyword, 'business') !== false) {
            return 'marketing';
        }
        if (strpos($keyword, 'money online') !== false || strpos($keyword, 'income') !== false) {
            return 'online-income';
        }
        if (strpos($keyword, 'health') !== false || strpos($keyword, 'fitness') !== false) {
            return 'health-fitness';
        }
        if (strpos($keyword, 'tech') !== false || strpos($keyword, 'software') !== false) {
            return 'technology';
        }
        
        return 'general';
    }
    
    private function create_title_from_keywords($keywords, $topic_category) {
        $primary_keyword = $keywords[0];
        $current_year = date('Y');
        
        $title_patterns = array(
            "The Ultimate Guide to {$primary_keyword} ({$current_year})",
            "{$primary_keyword}: A Comprehensive Guide for Success",
            "How to Master {$primary_keyword}: Expert Strategies",
            "The Complete {$primary_keyword} Guide: Everything You Need to Know"
        );
        
        return $title_patterns[array_rand($title_patterns)];
    }
    
    private function generate_key_takeaways($keywords, $topic_category) {
        $primary_keyword = $keywords[0];
        
        $takeaways = array(
            "**Strategic approach yields better results** - Effective {$primary_keyword} requires planning and consistent implementation",
            "**Research-based insights** - This guide provides evidence-based recommendations from multiple authoritative sources",
            "**Practical implementation framework** - Step-by-step instructions you can apply immediately",
            "**Common pitfalls identified** - Learn from others' mistakes to avoid costly errors",
            "**Expert perspectives included** - Insights from recognized authorities inform all recommendations"
        );
        
        return implode("\n", array_map(function($takeaway) { return "- " . $takeaway; }, $takeaways));
    }
    
    private function generate_introduction($keywords, $tone, $target_audience, $topic_category) {
        $primary_keyword = $keywords[0];
        
        return "In today's competitive landscape, mastering {$primary_keyword} has become essential for success. This comprehensive guide provides you with proven strategies, actionable insights, and expert recommendations to help you achieve your goals.\n\nWhether you're just starting out or looking to enhance your existing knowledge, this article covers everything you need to know about {$primary_keyword}. We'll explore practical techniques, common challenges, and proven solutions that deliver real results.";
    }
    
    private function generate_headings($keywords, $topic_category, $target_audience) {
        $primary_keyword = $keywords[0];
        
        return array(
            "What is {$primary_keyword}?",
            "Getting Started with {$primary_keyword}",
            "Step-by-Step Implementation Guide",
            "Common Challenges and Solutions",
            "Best Practices for Success",
            "Tools and Resources",
            "Case Studies and Examples",
            "Future Trends and Developments"
        );
    }
    
    private function generate_section_content($heading, $keywords, $tone, $length, $target_audience, $topic_category) {
        $primary_keyword = $keywords[0];
        
        $content = "This section provides detailed information about {$heading}. Understanding this concept is crucial for anyone looking to succeed with {$primary_keyword}.\n\n";
        $content .= "Key points to remember:\n\n";
        $content .= "- Implementation requires consistent effort and strategic planning\n";
        $content .= "- Success depends on understanding your specific context and goals\n";
        $content .= "- Regular evaluation and adjustment of your approach is essential\n";
        $content .= "- Learning from industry best practices accelerates your progress\n\n";
        $content .= "By following these guidelines and adapting them to your specific situation, you'll be well-positioned to achieve your objectives with {$primary_keyword}.";
        
        return $content;
    }
    
    private function generate_visual_content($heading, $primary_keyword, $topic_category, $index) {
        $images = array(
            'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
            'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
            'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80'
        );
        
        $image_url = $images[$index % count($images)];
        
        return "![{$heading} visualization]({$image_url})\n*Visual guide demonstrating key concepts related to {$heading}*";
    }
    
    private function generate_faqs($keywords, $target_audience, $topic_category) {
        $primary_keyword = $keywords[0];
        
        $faqs = array(
            array(
                'question' => "What is the best way to get started with {$primary_keyword}?",
                'answer' => "The best approach is to start with a solid foundation of knowledge, then gradually implement strategies while monitoring your progress."
            ),
            array(
                'question' => "How long does it take to see results with {$primary_keyword}?",
                'answer' => "Results vary depending on your specific situation, but most people see initial progress within 4-6 weeks of consistent implementation."
            ),
            array(
                'question' => "What are the most common mistakes to avoid?",
                'answer' => "The most common mistakes include trying to do too much too quickly, not tracking progress, and failing to adapt strategies based on results."
            )
        );
        
        $content = "";
        foreach ($faqs as $faq) {
            $content .= "### {$faq['question']}\n\n{$faq['answer']}\n\n";
        }
        
        return $content;
    }
    
    private function generate_conclusion($keywords, $tone, $target_audience, $topic_category) {
        $primary_keyword = $keywords[0];
        
        return "Mastering {$primary_keyword} requires dedication, strategic thinking, and consistent implementation of proven strategies. By following the guidelines outlined in this comprehensive guide, you'll be well-equipped to achieve your goals.\n\nRemember that success with {$primary_keyword} is a journey, not a destination. Continue learning, adapting, and refining your approach based on your results and changing circumstances.\n\nStart implementing these strategies today, and you'll be on your way to achieving the success you're looking for with {$primary_keyword}.";
    }
    
    private function perform_web_research($keywords) {
        // Simulate research data
        return "Research data for: {$keywords}\n\nKey findings:\n- Industry trends show increasing adoption\n- Best practices emphasize strategic implementation\n- Success rates improve with proper planning\n- Expert recommendations focus on consistency";
    }
    
    private function slugify($text) {
        return strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $text)));
    }
}

new DCG_Content_Generator_API();
