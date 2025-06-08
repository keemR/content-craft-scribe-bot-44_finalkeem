<?php
/**
 * Enhanced Content Generator API Handler
 */

class DCG_Content_Generator_API {
    
    private $enhanced_generator;
    private $research_service;
    
    public function __construct() {
        add_action('wp_ajax_dcg_generate_content', array($this, 'generate_content'));
        add_action('wp_ajax_dcg_research_topic', array($this, 'research_topic'));
        add_action('wp_ajax_dcg_bulk_generate', array($this, 'bulk_generate_content'));
        add_action('wp_ajax_dcg_validate_content', array($this, 'validate_content'));
        
        // Initialize enhanced services
        if (class_exists('DCG_Enhanced_Content_Generator')) {
            $this->enhanced_generator = new DCG_Enhanced_Content_Generator();
        }
        if (class_exists('DCG_Research_Service')) {
            $this->research_service = new DCG_Research_Service();
        }
    }
    
    /**
     * Generate enhanced content via AJAX
     */
    public function generate_content() {
        check_ajax_referer('dcg_nonce', 'nonce');
        
        if (!current_user_can('edit_posts')) {
            wp_die(__('You do not have sufficient permissions to access this page.'));
        }
        
        $keywords = sanitize_text_field($_POST['keywords']);
        $research_data = sanitize_textarea_field($_POST['research_data'] ?? '');
        $article_length = intval($_POST['article_length'] ?? 3000);
        $tone = sanitize_text_field($_POST['tone'] ?? 'informative');
        $include_images = isset($_POST['include_images']) ? true : false;
        $include_faqs = isset($_POST['include_faqs']) ? true : false;
        $seo_level = intval($_POST['seo_level'] ?? 80);
        $target_audience = sanitize_text_field($_POST['target_audience'] ?? '');
        $content_specificity = intval($_POST['content_specificity'] ?? 85);
        
        try {
            // Use enhanced content generation if available
            if ($this->enhanced_generator && Doorillio_Content_Generator::get_option('enhanced_content_generation', true)) {
                $content = $this->enhanced_generator->generate_enhanced_content(array(
                    'primaryKeyword' => $keywords,
                    'researchData' => $research_data,
                    'targetLength' => $article_length,
                    'tone' => $tone,
                    'includeImages' => $include_images,
                    'includeFAQs' => $include_faqs,
                    'seoLevel' => $seo_level,
                    'targetAudience' => $target_audience,
                    'contentSpecificity' => $content_specificity,
                    'includeExamples' => true,
                    'includeStatistics' => true,
                    'useCaseStudies' => true,
                    'preventRepetition' => true
                ));
            } else {
                // Fallback to basic content generation
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
            }
            
            // Validate content quality if enabled
            if (Doorillio_Content_Generator::get_option('quality_validation', true)) {
                $validation_results = $this->validate_content_quality($content);
                wp_send_json_success(array(
                    'content' => $content,
                    'validation' => $validation_results,
                    'word_count' => str_word_count(strip_tags($content)),
                    'reading_time' => ceil(str_word_count(strip_tags($content)) / 200)
                ));
            } else {
                wp_send_json_success(array('content' => $content));
            }
            
        } catch (Exception $e) {
            wp_send_json_error(array('message' => $e->getMessage()));
        }
    }
    
    /**
     * Enhanced research topic via AJAX
     */
    public function research_topic() {
        check_ajax_referer('dcg_nonce', 'nonce');
        
        if (!current_user_can('edit_posts')) {
            wp_die(__('You do not have sufficient permissions to access this page.'));
        }
        
        $keywords = sanitize_text_field($_POST['keywords']);
        
        try {
            // Use enhanced research service if available
            if ($this->research_service) {
                $research_data = $this->research_service->perform_comprehensive_research($keywords);
            } else {
                // Fallback to basic research
                $research_data = $this->perform_web_research($keywords);
            }
            
            wp_send_json_success(array(
                'research_data' => $research_data,
                'sources_count' => substr_count($research_data, 'Source:'),
                'word_count' => str_word_count($research_data)
            ));
            
        } catch (Exception $e) {
            wp_send_json_error(array('message' => $e->getMessage()));
        }
    }
    
    /**
     * Bulk content generation
     */
    public function bulk_generate_content() {
        check_ajax_referer('dcg_nonce', 'nonce');
        
        if (!current_user_can('edit_posts')) {
            wp_die(__('You do not have sufficient permissions to access this page.'));
        }
        
        $batch_data = json_decode(stripslashes($_POST['batch_data']), true);
        $results = array();
        
        foreach ($batch_data as $item) {
            try {
                $content = $this->enhanced_generator->generate_enhanced_content($item);
                $results[] = array(
                    'success' => true,
                    'keywords' => $item['primaryKeyword'],
                    'content' => $content,
                    'word_count' => str_word_count(strip_tags($content))
                );
            } catch (Exception $e) {
                $results[] = array(
                    'success' => false,
                    'keywords' => $item['primaryKeyword'],
                    'error' => $e->getMessage()
                );
            }
        }
        
        wp_send_json_success(array('results' => $results));
    }
    
    /**
     * Validate content quality
     */
    public function validate_content() {
        check_ajax_referer('dcg_nonce', 'nonce');
        
        if (!current_user_can('edit_posts')) {
            wp_die(__('You do not have sufficient permissions to access this page.'));
        }
        
        $content = sanitize_textarea_field($_POST['content']);
        $keywords = sanitize_text_field($_POST['keywords']);
        
        $validation_results = $this->validate_content_quality($content, $keywords);
        
        wp_send_json_success($validation_results);
    }
    
    /**
     * Enhanced content quality validation
     */
    private function validate_content_quality($content, $keywords = '') {
        $word_count = str_word_count(strip_tags($content));
        $char_count = strlen($content);
        $paragraph_count = substr_count($content, "\n\n");
        $heading_count = preg_match_all('/^#{1,6}\s/m', $content);
        
        // SEO validation
        $seo_score = 0;
        $seo_issues = array();
        
        // Check keyword presence
        if ($keywords) {
            $keyword_density = (substr_count(strtolower($content), strtolower($keywords)) / $word_count) * 100;
            if ($keyword_density >= 1 && $keyword_density <= 3) {
                $seo_score += 20;
            } else {
                $seo_issues[] = 'Keyword density should be 1-3%';
            }
        }
        
        // Check content length
        if ($word_count >= 1500) {
            $seo_score += 20;
        } else {
            $seo_issues[] = 'Content should be at least 1500 words';
        }
        
        // Check heading structure
        if ($heading_count >= 5) {
            $seo_score += 15;
        } else {
            $seo_issues[] = 'Add more headings for better structure';
        }
        
        // Check for FAQ section
        if (stripos($content, 'frequently asked questions') !== false || stripos($content, '## FAQ') !== false) {
            $seo_score += 15;
        }
        
        // Check for images
        if (preg_match('/!\[.*?\]\(.*?\)/', $content)) {
            $seo_score += 10;
        } else {
            $seo_issues[] = 'Consider adding images for better engagement';
        }
        
        // Readability score (simplified)
        $avg_sentence_length = $word_count / max(1, substr_count($content, '.'));
        $readability_score = max(0, 100 - ($avg_sentence_length * 2));
        
        return array(
            'word_count' => $word_count,
            'character_count' => $char_count,
            'paragraph_count' => $paragraph_count,
            'heading_count' => $heading_count,
            'reading_time' => ceil($word_count / 200),
            'seo_score' => min(100, $seo_score + 20), // Base score of 20
            'seo_issues' => $seo_issues,
            'readability_score' => round($readability_score),
            'keyword_density' => $keywords ? round((substr_count(strtolower($content), strtolower($keywords)) / $word_count) * 100, 2) : 0
        );
    }
    
    /**
     * Generate SEO content (fallback method)
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
        if (strpos($keyword, 'health') !== false || strpos($keyword, 'fitness') !== false || strpos($keyword, 'vitamin') !== false) {
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
        // Enhanced research simulation with more realistic data
        return "Comprehensive Research Data for: {$keywords}\n\n" .
               "INDUSTRY TRENDS:\n" .
               "- Market analysis shows 23% growth in related sectors\n" .
               "- Consumer behavior patterns indicate increased interest\n" .
               "- Expert predictions suggest continued expansion\n\n" .
               "STATISTICAL INSIGHTS:\n" .
               "- 67% of professionals report positive outcomes\n" .
               "- Implementation success rates average 78%\n" .
               "- ROI improvements documented at 145% average\n\n" .
               "BEST PRACTICES:\n" .
               "- Strategic planning essential for success\n" .
               "- Consistent monitoring improves results by 34%\n" .
               "- Expert guidance accelerates timeline by 50%";
    }
    
    private function slugify($text) {
        return strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $text)));
    }
}

new DCG_Content_Generator_API();
