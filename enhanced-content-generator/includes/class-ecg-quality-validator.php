
<?php
/**
 * Content Quality Validator for S-tier content assessment
 */

class ECG_Quality_Validator {
    
    /**
     * Validate content quality and generate metrics
     */
    public function validate_content($content, $keywords) {
        $validation = array();
        
        // Basic metrics
        $validation['word_count'] = str_word_count($content);
        $validation['reading_time'] = ceil($validation['word_count'] / 200);
        $validation['paragraph_count'] = substr_count($content, "\n\n");
        $validation['heading_count'] = substr_count($content, "##");
        
        // SEO metrics
        $validation['seo_score'] = $this->calculate_seo_score($content, $keywords);
        $validation['keyword_density'] = $this->calculate_keyword_density($content, $keywords);
        
        // Readability metrics
        $validation['readability_score'] = $this->calculate_readability_score($content);
        
        // E-E-A-T signals
        $validation['eeat_score'] = $this->calculate_eeat_score($content);
        
        // Content quality indicators
        $validation['has_citations'] = $this->has_proper_citations($content);
        $validation['has_author_info'] = $this->has_author_information($content);
        $validation['has_references'] = $this->has_references_section($content);
        
        return $validation;
    }
    
    private function calculate_seo_score($content, $keywords) {
        $score = 0;
        $primary_keyword = explode(',', $keywords)[0];
        
        // Title optimization
        if (stripos($content, $primary_keyword) !== false) {
            $score += 20;
        }
        
        // Heading optimization
        if (substr_count(strtolower($content), strtolower($primary_keyword)) >= 3) {
            $score += 15;
        }
        
        // Content length
        $word_count = str_word_count($content);
        if ($word_count >= 2000) {
            $score += 20;
        }
        
        // Internal structure
        if (strpos($content, "## Table of Contents") !== false) {
            $score += 10;
        }
        
        // FAQ section
        if (strpos($content, "## Frequently Asked Questions") !== false) {
            $score += 10;
        }
        
        // References
        if (strpos($content, "## References") !== false) {
            $score += 15;
        }
        
        // Citations
        if (preg_match('/¹|²|³|⁴|⁵/', $content)) {
            $score += 10;
        }
        
        return min($score, 100);
    }
    
    private function calculate_keyword_density($content, $keywords) {
        $primary_keyword = explode(',', $keywords)[0];
        $word_count = str_word_count($content);
        $keyword_count = substr_count(strtolower($content), strtolower($primary_keyword));
        
        return round(($keyword_count / $word_count) * 100, 2);
    }
    
    private function calculate_readability_score($content) {
        // Simplified readability calculation
        $sentences = preg_split('/[.!?]+/', $content);
        $words = str_word_count($content);
        $syllables = $this->count_syllables($content);
        
        // Flesch Reading Ease approximation
        $score = 206.835 - (1.015 * ($words / count($sentences))) - (84.6 * ($syllables / $words));
        
        return max(0, min(100, round($score)));
    }
    
    private function count_syllables($text) {
        // Simplified syllable counting
        $words = explode(' ', strtolower($text));
        $syllables = 0;
        
        foreach ($words as $word) {
            $syllables += max(1, preg_match_all('/[aeiouy]+/', $word));
        }
        
        return $syllables;
    }
    
    private function calculate_eeat_score($content) {
        $score = 0;
        
        // Expert credentials
        if (strpos($content, 'Medically Reviewed by') !== false || strpos($content, 'Expert Reviewed by') !== false) {
            $score += 25;
        }
        
        // Author information
        if (strpos($content, '## About the') !== false) {
            $score += 20;
        }
        
        // Citations and references
        if (strpos($content, '## References') !== false) {
            $score += 25;
        }
        
        // Medical license or credentials
        if (strpos($content, 'License:') !== false || strpos($content, 'Board Certification:') !== false) {
            $score += 15;
        }
        
        // Publication date
        if (strpos($content, 'Last Updated:') !== false) {
            $score += 15;
        }
        
        return min($score, 100);
    }
    
    private function has_proper_citations($content) {
        return preg_match('/¹|²|³|⁴|⁵|⁶|⁷|⁸|⁹/', $content) > 0;
    }
    
    private function has_author_information($content) {
        return strpos($content, '## About the') !== false;
    }
    
    private function has_references_section($content) {
        return strpos($content, '## References') !== false;
    }
}
