
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Pause, SkipForward, Download, Trash2 } from "lucide-react";
import CSVUploadModal from "./CSVUploadModal";

interface BulkKeyword {
  id: string;
  primary: string;
  secondary: string[];
  audience: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'generating' | 'completed' | 'error';
  content?: string;
  generatedAt?: Date;
}

const BulkContentManager = () => {
  const [keywords, setKeywords] = useState<BulkKeyword[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleKeywordsImported = (importedKeywords: Array<{
    primary: string;
    secondary: string[];
    audience: string;
    priority: 'high' | 'medium' | 'low';
  }>) => {
    const newKeywords: BulkKeyword[] = importedKeywords.map((kw, index) => ({
      id: `bulk-${Date.now()}-${index}`,
      ...kw,
      status: 'pending'
    }));
    
    setKeywords(prev => [...prev, ...newKeywords]);
  };

  const generateContent = async (keyword: BulkKeyword): Promise<string> => {
    // Simulate content generation API call
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
    
    return `# ${keyword.primary.charAt(0).toUpperCase() + keyword.primary.slice(1)}\n\n## Introduction\n\nThis is a comprehensive article about ${keyword.primary}...\n\n## Key Points\n\n- Important aspect 1\n- Important aspect 2\n- Important aspect 3\n\n## Conclusion\n\nIn conclusion, ${keyword.primary} is essential for ${keyword.audience}...`;
  };

  const startBulkGeneration = async () => {
    const pendingKeywords = keywords.filter(kw => kw.status === 'pending');
    
    if (pendingKeywords.length === 0) {
      toast({
        title: "No Pending Keywords",
        description: "All keywords have already been processed.",
      });
      return;
    }

    setIsGenerating(true);
    setCurrentIndex(0);
    setProgress(0);

    for (let i = 0; i < pendingKeywords.length; i++) {
      const keyword = pendingKeywords[i];
      setCurrentIndex(i + 1);
      setProgress(((i + 1) / pendingKeywords.length) * 100);

      try {
        // Update status to generating
        setKeywords(prev => prev.map(kw => 
          kw.id === keyword.id 
            ? { ...kw, status: 'generating' as const }
            : kw
        ));

        const content = await generateContent(keyword);

        // Update with completed content
        setKeywords(prev => prev.map(kw => 
          kw.id === keyword.id 
            ? { 
                ...kw, 
                status: 'completed' as const, 
                content,
                generatedAt: new Date()
              }
            : kw
        ));

        toast({
          title: "Content Generated",
          description: `Article for "${keyword.primary}" has been completed.`,
        });

      } catch (error) {
        setKeywords(prev => prev.map(kw => 
          kw.id === keyword.id 
            ? { ...kw, status: 'error' as const }
            : kw
        ));

        toast({
          title: "Generation Error",
          description: `Failed to generate content for "${keyword.primary}".`,
          variant: "destructive",
        });
      }
    }

    setIsGenerating(false);
    toast({
      title: "Bulk Generation Complete",
      description: `Generated content for ${pendingKeywords.length} keywords.`,
    });
  };

  const exportResults = () => {
    const completedKeywords = keywords.filter(kw => kw.status === 'completed');
    
    if (completedKeywords.length === 0) {
      toast({
        title: "No Content to Export",
        description: "Generate some content first before exporting.",
        variant: "destructive",
      });
      return;
    }

    // Create and download ZIP file (simulated)
    toast({
      title: "Export Started",
      description: `Exporting ${completedKeywords.length} articles as individual files.`,
    });
  };

  const removeKeyword = (id: string) => {
    setKeywords(prev => prev.filter(kw => kw.id !== id));
  };

  const getStatusColor = (status: BulkKeyword['status']) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'generating': return 'default';
      case 'completed': return 'default'; // Changed from 'success' to 'default'
      case 'error': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: BulkKeyword['priority']) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Content Generation</CardTitle>
          <CardDescription>
            Import keywords from CSV and generate multiple articles automatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <CSVUploadModal onKeywordsImported={handleKeywordsImported} />
            
            <Button 
              onClick={startBulkGeneration}
              disabled={isGenerating || keywords.length === 0}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              {isGenerating ? "Generating..." : "Start Bulk Generation"}
            </Button>
            
            <Button 
              variant="outline"
              onClick={exportResults}
              disabled={keywords.filter(kw => kw.status === 'completed').length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress: {currentIndex} / {keywords.filter(kw => kw.status === 'pending').length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {keywords.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generation Queue ({keywords.length} items)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Primary Keyword</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Generated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {keywords.map((keyword) => (
                  <TableRow key={keyword.id}>
                    <TableCell className="font-medium">
                      {keyword.primary}
                      {keyword.secondary.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          +{keyword.secondary.length} secondary keywords
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{keyword.audience}</TableCell>
                    <TableCell>
                      <Badge variant={getPriorityColor(keyword.priority)}>
                        {keyword.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(keyword.status)}>
                        {keyword.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {keyword.generatedAt 
                        ? keyword.generatedAt.toLocaleDateString()
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeKeyword(keyword.id)}
                        disabled={keyword.status === 'generating'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkContentManager;
