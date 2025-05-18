
<?php
/**
 * CSV importer class for importing keywords and topics.
 */
class DCG_CSV_Importer {
    
    /**
     * Constructor.
     */
    public function __construct() {
        // Constructor code here
    }
    
    /**
     * Import CSV file.
     * 
     * @param array $file Uploaded file.
     * @return array|WP_Error Import results or error.
     */
    public function import_csv($file) {
        // Check file
        if (!isset($file['tmp_name']) || empty($file['tmp_name'])) {
            return new WP_Error('invalid_file', __('Invalid file.', 'doorillio-content-generator'));
        }
        
        // Check file type
        $file_ext = pathinfo($file['name'], PATHINFO_EXTENSION);
        if (strtolower($file_ext) !== 'csv') {
            return new WP_Error('invalid_file_type', __('File must be a CSV.', 'doorillio-content-generator'));
        }
        
        // Open the file
        $handle = fopen($file['tmp_name'], 'r');
        
        if (!$handle) {
            return new WP_Error('file_read_error', __('Unable to read file.', 'doorillio-content-generator'));
        }
        
        // Read the header row
        $header = fgetcsv($handle);
        
        if (!$header) {
            fclose($handle);
            return new WP_Error('invalid_csv', __('Invalid CSV format.', 'doorillio-content-generator'));
        }
        
        // Expected columns
        $expected_columns = array('topic', 'keywords', 'audience', 'notes');
        
        // Normalize header (lowercase, trim)
        $header = array_map(function($item) {
            return strtolower(trim($item));
        }, $header);
        
        // Validate required columns
        $has_topic = in_array('topic', $header);
        $has_keywords = in_array('keywords', $header);
        
        if (!$has_topic || !$has_keywords) {
            fclose($handle);
            return new WP_Error('missing_columns', __('CSV must include at least "topic" and "keywords" columns.', 'doorillio-content-generator'));
        }
        
        // Get column indexes
        $topic_index = array_search('topic', $header);
        $keywords_index = array_search('keywords', $header);
        $audience_index = array_search('audience', $header);
        $notes_index = array_search('notes', $header);
        
        // Read data
        $topics = array();
        $row_count = 0;
        
        while (($row = fgetcsv($handle)) !== false) {
            $row_count++;
            
            // Check if row has enough columns
            if (count($row) <= $topic_index || count($row) <= $keywords_index) {
                continue; // Skip row
            }
            
            $topic = trim($row[$topic_index]);
            $keywords = trim($row[$keywords_index]);
            
            // Skip empty rows
            if (empty($topic) || empty($keywords)) {
                continue;
            }
            
            $audience = ($audience_index !== false && isset($row[$audience_index])) ? trim($row[$audience_index]) : '';
            $notes = ($notes_index !== false && isset($row[$notes_index])) ? trim($row[$notes_index]) : '';
            
            $topics[] = array(
                'topic' => $topic,
                'keywords' => $keywords,
                'audience' => $audience,
                'notes' => $notes
            );
        }
        
        fclose($handle);
        
        // Check if we have any valid topics
        if (empty($topics)) {
            return new WP_Error('no_valid_data', __('No valid data found in CSV.', 'doorillio-content-generator'));
        }
        
        // Save topics to database
        $saved_count = $this->save_topics($topics);
        
        // Create content plan with imported topics
        $plan_id = $this->create_content_plan_from_import($topics);
        
        return array(
            'topics_count' => count($topics),
            'saved_count' => $saved_count,
            'plan_id' => $plan_id
        );
    }
    
    /**
     * Save imported topics to database.
     * 
     * @param array $topics Topics.
     * @return int Number of saved topics.
     */
    private function save_topics($topics) {
        global $wpdb;
        
        $table_queue = $wpdb->prefix . 'dcg_content_queue';
        $saved_count = 0;
        
        foreach ($topics as $topic) {
            $inserted = $wpdb->insert(
                $table_queue,
                array(
                    'plan_id' => 0, // No specific plan yet
                    'title' => $topic['topic'],
                    'keywords' => $topic['keywords'],
                    'content_type' => 'article',
                    'status' => 'pending',
                    'priority' => 10,
                    'created_at' => current_time('mysql'),
                    'scheduled_date' => null,
                    'options' => json_encode(array(
                        'targetKeywords' => $topic['keywords'],
                        'targetAudience' => $topic['audience'],
                        'notes' => $topic['notes']
                    ))
                ),
                array(
                    '%d',
                    '%s',
                    '%s',
                    '%s',
                    '%s',
                    '%d',
                    '%s',
                    '%s',
                    '%s'
                )
            );
            
            if ($inserted) {
                $saved_count++;
            }
        }
        
        return $saved_count;
    }
    
    /**
     * Create content plan from imported topics.
     * 
     * @param array $topics Topics.
     * @return int|false Plan ID or false on failure.
     */
    private function create_content_plan_from_import($topics) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'dcg_content_plans';
        
        // Group topics by common keywords
        $clusters = $this->cluster_topics($topics);
        
        // Create content calendar (simple sequential scheduling)
        $calendar = $this->create_calendar_from_topics($topics);
        
        $plan_data = array(
            'import_topics' => $topics,
            'content_clusters' => $clusters,
            'content_calendar' => $calendar,
            'timestamp' => current_time('mysql')
        );
        
        $inserted = $wpdb->insert(
            $table_name,
            array(
                'title' => 'Imported Content Plan - ' . date('Y-m-d'),
                'description' => 'Content plan created from CSV import',
                'created_at' => current_time('mysql'),
                'updated_at' => current_time('mysql'),
                'status' => 'draft',
                'plan_data' => json_encode($plan_data)
            ),
            array(
                '%s',
                '%s',
                '%s',
                '%s',
                '%s',
                '%s'
            )
        );
        
        if ($inserted) {
            $plan_id = $wpdb->insert_id;
            
            // Update queue items with this plan ID
            $wpdb->update(
                $wpdb->prefix . 'dcg_content_queue',
                array('plan_id' => $plan_id),
                array('plan_id' => 0)
            );
            
            return $plan_id;
        }
        
        return false;
    }
    
    /**
     * Cluster topics based on keyword similarity.
     * 
     * @param array $topics Topics.
     * @return array Clustered topics.
     */
    private function cluster_topics($topics) {
        // Extract keywords from all topics
        $all_keywords = array();
        foreach ($topics as $topic) {
            $keywords = explode(',', $topic['keywords']);
            $keywords = array_map('trim', $keywords);
            $keywords = array_map('strtolower', $keywords);
            
            foreach ($keywords as $keyword) {
                if (!empty($keyword)) {
                    if (!isset($all_keywords[$keyword])) {
                        $all_keywords[$keyword] = 0;
                    }
                    $all_keywords[$keyword]++;
                }
            }
        }
        
        // Sort keywords by frequency
        arsort($all_keywords);
        
        // Take top keywords as potential cluster pillars
        $potential_pillars = array_slice(array_keys($all_keywords), 0, 5);
        
        $clusters = array();
        
        // Create clusters around potential pillars
        foreach ($potential_pillars as $pillar) {
            $cluster_topics = array();
            
            foreach ($topics as $topic) {
                $keywords = explode(',', $topic['keywords']);
                $keywords = array_map('trim', $keywords);
                $keywords = array_map('strtolower', $keywords);
                
                if (in_array($pillar, $keywords)) {
                    $cluster_topics[] = array(
                        'topic' => $topic['topic'],
                        'priority' => 'medium'
                    );
                }
            }
            
            // Only add clusters with at least 2 topics
            if (count($cluster_topics) >= 2) {
                $clusters[] = array(
                    'pillar' => ucfirst($pillar),
                    'subtopics' => $cluster_topics
                );
            }
        }
        
        // If we have topics that don't fit into any cluster, create a "miscellaneous" cluster
        $clustered_topics = array();
        foreach ($clusters as $cluster) {
            foreach ($cluster['subtopics'] as $subtopic) {
                $clustered_topics[] = $subtopic['topic'];
            }
        }
        
        $unclustered_topics = array();
        foreach ($topics as $topic) {
            if (!in_array($topic['topic'], $clustered_topics)) {
                $unclustered_topics[] = array(
                    'topic' => $topic['topic'],
                    'priority' => 'low'
                );
            }
        }
        
        if (!empty($unclustered_topics)) {
            $clusters[] = array(
                'pillar' => 'Other Topics',
                'subtopics' => $unclustered_topics
            );
        }
        
        return $clusters;
    }
    
    /**
     * Create a content calendar from topics.
     * 
     * @param array $topics Topics.
     * @return array Calendar entries.
     */
    private function create_calendar_from_topics($topics) {
        $calendar = array();
        
        // Schedule one article per week
        $current_date = current_time('Y-m-d');
        $days_offset = 0;
        
        foreach ($topics as $topic) {
            // Schedule for the next day (starting from current date)
            $date = date('Y-m-d', strtotime("$current_date + $days_offset days"));
            
            $calendar[] = array(
                'date' => $date,
                'topic' => $topic['topic'],
                'type' => 'article',
                'description' => 'Article about ' . $topic['topic']
            );
            
            // Next article 7 days later
            $days_offset += 7;
        }
        
        return $calendar;
    }
}
