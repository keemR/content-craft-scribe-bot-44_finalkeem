
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
"healthy meal prep","meal planning,nutrition,budget meals",busy professionals,high
"home workout routines","fitness,exercise,bodyweight",beginners,medium
"digital marketing tips","social media,content marketing,SEO",small business owners,high
"sustainable living","eco-friendly,green living,zero waste",environmentally conscious,low`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'keyword-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded to your computer.",
    });
  };

  const processCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    
    const requiredHeaders = ['primary_keyword', 'secondary_keywords', 'target_audience', 'priority'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }
    
    const keywords = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;
      
      const values = line.split(',').map(v => v.replace(/"/g, '').trim());
      
      if (values.length >= 4) {
        const primaryKeyword = values[headers.indexOf('primary_keyword')];
        const secondaryKeywords = values[headers.indexOf('secondary_keywords')]
          .split(';')
          .map(k => k.trim())
          .filter(k => k);
        const audience = values[headers.indexOf('target_audience')];
        const priority = values[headers.indexOf('priority')] as 'high' | 'medium' | 'low';
        
        if (primaryKeyword) {
          keywords.push({
            primary: primaryKeyword,
            secondary: secondaryKeywords,
            audience,
            priority: ['high', 'medium', 'low'].includes(priority) ? priority : 'medium'
          });
        }
      }
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

    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const keywords = processCSV(text);
      
      if (keywords.length === 0) {
        throw new Error('No valid keywords found in the CSV file');
      }
      
      onKeywordsImported(keywords);
      setIsOpen(false);
      setFile(null);
      
      toast({
        title: "Keywords Imported Successfully",
        description: `Imported ${keywords.length} keyword sets for bulk content generation.`,
      });
      
    } catch (error) {
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
          Bulk Import Keywords
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
              Your CSV should include: primary_keyword, secondary_keywords (separated by semicolons), target_audience, and priority (high/medium/low).
            </AlertDescription>
          </Alert>
          
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
