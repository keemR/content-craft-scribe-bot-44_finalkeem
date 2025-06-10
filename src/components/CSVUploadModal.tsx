
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CSVUploadModalProps {
  onKeywordsImported: (keywords: Array<{
    primary: string;
    secondary: string[];
    audience: string;
    priority: 'high' | 'medium' | 'low';
  }>) => void;
}

const CSVUploadModal = ({ onKeywordsImported }: CSVUploadModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const csvContent = `primary_keyword,secondary_keywords,target_audience,priority
"healthy meal prep","meal planning;nutrition;budget meals",busy professionals,high
"home workout routines","fitness;exercise;bodyweight",beginners,medium
"digital marketing tips","social media;content marketing;SEO",small business owners,high
"sustainable living","eco-friendly;green living;zero waste",environmentally conscious,low
"vitamin d deficiency symptoms","vitamin deficiency;health symptoms;nutritional health",health-conscious individuals,high
"online business ideas","entrepreneurship;passive income;side hustle",aspiring entrepreneurs,medium`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk-keywords-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded to your computer.",
    });
  };

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const processCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row');
    }
    
    const headers = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim().toLowerCase());
    
    const requiredHeaders = ['primary_keyword', 'secondary_keywords', 'target_audience', 'priority'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }
    
    const keywords = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      try {
        const values = parseCSVLine(line).map(v => v.replace(/"/g, '').trim());
        
        if (values.length >= 4) {
          const primaryKeyword = values[headers.indexOf('primary_keyword')];
          const secondaryKeywordsRaw = values[headers.indexOf('secondary_keywords')];
          const audience = values[headers.indexOf('target_audience')];
          const priorityRaw = values[headers.indexOf('priority')];
          
          if (!primaryKeyword) {
            console.warn(`Skipping row ${i + 1}: missing primary keyword`);
            continue;
          }
          
          const secondaryKeywords = secondaryKeywordsRaw
            ? secondaryKeywordsRaw.split(';').map(k => k.trim()).filter(k => k)
            : [];
          
          const priority = ['high', 'medium', 'low'].includes(priorityRaw) 
            ? priorityRaw as 'high' | 'medium' | 'low'
            : 'medium';
          
          keywords.push({
            primary: primaryKeyword,
            secondary: secondaryKeywords,
            audience: audience || 'general audience',
            priority
          });
        }
      } catch (error) {
        console.warn(`Error parsing row ${i + 1}:`, error);
        continue;
      }
    }
    
    if (keywords.length === 0) {
      throw new Error('No valid keywords found in the CSV file. Please check the format.');
    }
    
    return keywords;
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a CSV file (.csv extension).",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const text = await file.text();
      
      if (!text.trim()) {
        throw new Error('CSV file is empty');
      }
      
      const keywords = processCSV(text);
      
      console.log('Parsed keywords:', keywords);
      
      onKeywordsImported(keywords);
      setIsOpen(false);
      setFile(null);
      
      toast({
        title: "Keywords Imported Successfully",
        description: `Imported ${keywords.length} keyword sets for bulk content generation.`,
      });
      
    } catch (error) {
      console.error('CSV processing error:', error);
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Failed to process CSV file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Upload className="w-4 h-4 mr-2" />
          Import Keywords from CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Bulk Import Keywords from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing your target keywords for bulk content generation.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your CSV should include: <strong>primary_keyword</strong>, <strong>secondary_keywords</strong> (separated by semicolons), 
              <strong>target_audience</strong>, and <strong>priority</strong> (high/medium/low).
            </AlertDescription>
          </Alert>
          
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Example CSV Format:</h4>
            <pre className="text-xs bg-background p-3 rounded border overflow-auto">
{`primary_keyword,secondary_keywords,target_audience,priority
"healthy meal prep","meal planning;nutrition;budget meals",busy professionals,high
"home workout routines","fitness;exercise;bodyweight",beginners,medium`}
            </pre>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="csv-file">Select CSV File</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-1"
              />
              {file && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={downloadTemplate}
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
              
              <Button
                onClick={handleFileUpload}
                disabled={!file || isProcessing}
                className="flex-1"
              >
                <FileText className="w-4 h-4 mr-2" />
                {isProcessing ? "Processing..." : "Import Keywords"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CSVUploadModal;
