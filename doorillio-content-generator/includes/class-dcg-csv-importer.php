
<?php
/**
 * CSV Importer Class
 */
class DCG_CSV_Importer {
    
    public function __construct() {
        // Constructor logic if needed
    }
    
    /**
     * Import content plans from CSV file
     */
    public function import_csv($file) {
        if (!isset($file['tmp_name']) || empty($file['tmp_name'])) {
            return new WP_Error('no_file', 'No file uploaded');
        }
        
        // Validate file type
        $file_type = wp_check_filetype($file['name']);
        if ($file_type['ext'] !== 'csv') {
            return new WP_Error('invalid_file_type', 'Please upload a CSV file');
        }
        
        // Read CSV file
        $csv_data = $this->read_csv_file($file['tmp_name']);
        
        if (empty($csv_data)) {
            return new WP_Error('empty_file', 'CSV file is empty or invalid');
        }
        
        // Process CSV data
        $results = $this->process_csv_data($csv_data);
        
        return $results;
    }
    
    private function read_csv_file($file_path) {
        $csv_data = array();
        
        if (($handle = fopen($file_path, 'r')) !== FALSE) {
            $headers = fgetcsv($handle); // Get headers
            
            while (($data = fgetcsv($handle)) !== FALSE) {
                if (count($data) === count($headers)) {
                    $csv_data[] = array_combine($headers, $data);
                }
            }
            
            fclose($handle);
        }
        
        return $csv_data;
    }
    
    private function process_csv_data($csv_data) {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'dcg_content_queue';
        $imported = 0;
        $errors = 0;
        
        foreach ($csv_data as $row) {
            // Validate required fields
            if (empty($row['title']) || empty($row['keywords'])) {
                $errors++;
                continue;
            }
            
            // Insert into queue
            $result = $wpdb->insert(
                $table_name,
                array(
                    'plan_id' => 0, // Default plan
                    'title' => sanitize_text_field($row['title']),
                    'keywords' => sanitize_text_field($row['keywords']),
                    'content_type' => isset($row['content_type']) ? sanitize_text_field($row['content_type']) : 'article',
                    'status' => 'pending',
                    'priority' => isset($row['priority']) ? intval($row['priority']) : 10,
                    'created_at' => current_time('mysql'),
                    'options' => json_encode(array(
                        'tone' => isset($row['tone']) ? sanitize_text_field($row['tone']) : 'informative',
                        'target_audience' => isset($row['target_audience']) ? sanitize_text_field($row['target_audience']) : 'general'
                    ))
                )
            );
            
            if ($result !== false) {
                $imported++;
            } else {
                $errors++;
            }
        }
        
        return array(
            'total_rows' => count($csv_data),
            'imported' => $imported,
            'errors' => $errors
        );
    }
    
    /**
     * Export content queue to CSV
     */
    public function export_queue_to_csv() {
        global $wpdb;
        
        $table_name = $wpdb->prefix . 'dcg_content_queue';
        $results = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC");
        
        if (empty($results)) {
            return new WP_Error('no_data', 'No content queue data to export');
        }
        
        // Generate CSV content
        $csv_content = "Title,Keywords,Content Type,Status,Priority,Created At\n";
        
        foreach ($results as $row) {
            $csv_content .= sprintf(
                '"%s","%s","%s","%s",%d,"%s"' . "\n",
                $row->title,
                $row->keywords,
                $row->content_type,
                $row->status,
                $row->priority,
                $row->created_at
            );
        }
        
        return $csv_content;
    }
}
