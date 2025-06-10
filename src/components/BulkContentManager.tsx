import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Pause, SkipForward, Download, Trash2, Clock, CheckCircle, XCircle } from "lucide-react";
import CSVUploadModal from "./CSVUploadModal";
import { generateSEOContent } from "@/utils/contentGeneration";

interface BulkKeyword {
  id: string;
  primary: string;
  secondary: string[];
  audience: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'generating' | 'completed' | 'error';
  content?: string;
  generatedAt?: Date;
  error?: string;
  wordCount?: number;
}

const BulkContentManager = () => {
  const [keywords, setKeywords] = useState<BulkKeyword[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
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
    
    toast({
      title: "Keywords Imported",
      description: `Successfully imported ${newKeywords.length} keyword sets for bulk generation.`,
    });
  };

  const generateContent = async (keyword: BulkKeyword): Promise<string> => {
    try {
      console.log(`Starting content generation for: ${keyword.primary}`);
      
      // Use the actual content generation system with correct property names
      const content = await generateSEOContent({
        targetKeywords: keyword.primary,
        researchData: `Research topic: ${keyword.primary}. Target audience: ${keyword.audience}. Secondary keywords: ${keyword.secondary.join(', ')}`,
        articleLength: 2500,
        tone: 'informative',
        includeImages: true,
        includeFAQs: true,
        seoLevel: 85,
        targetAudience: keyword.audience,
        contentSpecificity: 80,
        includeExamples: true,
        includeStatistics: true,
        useCaseStudies: true
      });

      console.log(`Content generated successfully for: ${keyword.primary}`);
      return content;
    } catch (error) {
      console.error(`Failed to generate content for ${keyword.primary}:`, error);
      throw error;
    }
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

    // Sort by priority: high -> medium -> low
    const sortedKeywords = pendingKeywords.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    setIsGenerating(true);
    setIsPaused(false);
    setCurrentIndex(0);
    setProgress(0);

    for (let i = 0; i < sortedKeywords.length; i++) {
      // Check if generation is paused
      if (isPaused) {
        toast({
          title: "Generation Paused",
          description: "Bulk generation has been paused. Click Start to resume.",
        });
        break;
      }

      const keyword = sortedKeywords[i];
      setCurrentIndex(i + 1);
      setProgress(((i + 1) / sortedKeywords.length) * 100);

      try {
        // Update status to generating
        setKeywords(prev => prev.map(kw => 
          kw.id === keyword.id 
            ? { ...kw, status: 'generating' as const }
            : kw
        ));

        const content = await generateContent(keyword);
        const wordCount = content.split(/\s+/).length;

        // Update with completed content
        setKeywords(prev => prev.map(kw => 
          kw.id === keyword.id 
            ? { 
                ...kw, 
                status: 'completed' as const, 
                content,
                generatedAt: new Date(),
                wordCount
              }
            : kw
        ));

        toast({
          title: "Content Generated",
          description: `Article for "${keyword.primary}" completed (${wordCount} words).`,
        });

        // Small delay between generations to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Generation failed for ${keyword.primary}:`, error);
        
        setKeywords(prev => prev.map(kw => 
          kw.id === keyword.id 
            ? { 
                ...kw, 
                status: 'error' as const,
                error: error instanceof Error ? error.message : 'Unknown error occurred'
              }
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
    setIsPaused(false);
    
    const completedCount = keywords.filter(kw => kw.status === 'completed').length;
    toast({
      title: "Bulk Generation Complete",
      description: `Successfully generated ${completedCount} articles.`,
    });
  };

  const pauseGeneration = () => {
    setIsPaused(true);
    setIsGenerating(false);
  };

  const resumeGeneration = () => {
    if (isPaused) {
      setIsPaused(false);
      startBulkGeneration();
    }
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

    // Create a ZIP-like export by downloading individual files
    completedKeywords.forEach((keyword, index) => {
      if (keyword.content) {
        const blob = new Blob([keyword.content], { type: 'text/markdown' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${keyword.primary.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    });

    toast({
      title: "Export Complete",
      description: `Exported ${completedKeywords.length} articles as Markdown files.`,
    });
  };

  const removeKeyword = (id: string) => {
    setKeywords(prev => prev.filter(kw => kw.id !== id));
    toast({
      title: "Keyword Removed",
      description: "Keyword has been removed from the generation queue.",
    });
  };

  const retryKeyword = (id: string) => {
    setKeywords(prev => prev.map(kw => 
      kw.id === id 
        ? { ...kw, status: 'pending' as const, error: undefined }
        : kw
    ));
    toast({
      title: "Retry Scheduled",
      description: "Keyword has been reset to pending status for retry.",
    });
  };

  const getStatusColor = (status: BulkKeyword['status']) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'generating': return 'default';
      case 'completed': return 'default';
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

  const getStatusIcon = (status: BulkKeyword['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'generating': return <Play className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'error': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Content Generation</CardTitle>
          <CardDescription>
            Import keywords from CSV and generate multiple articles automatically with priority handling
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <CSVUploadModal onKeywordsImported={handleKeywordsImported} />
            
            {!isGenerating && !isPaused && (
              <Button 
                onClick={startBulkGeneration}
                disabled={keywords.filter(kw => kw.status === 'pending').length === 0}
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Bulk Generation
              </Button>
            )}

            {isGenerating && (
              <Button 
                onClick={pauseGeneration}
                variant="outline"
                className="flex-1"
              >
                <Pause className="w-4 h-4 mr-2" />
                Pause Generation
              </Button>
            )}

            {isPaused && (
              <Button 
                onClick={resumeGeneration}
                className="flex-1"
              >
                <Play className="w-4 h-4 mr-2" />
                Resume Generation
              </Button>
            )}
            
            <Button 
              variant="outline"
              onClick={exportResults}
              disabled={keywords.filter(kw => kw.status === 'completed').length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </Button>
          </div>

          {(isGenerating || isPaused) && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress: {currentIndex} / {keywords.filter(kw => kw.status === 'pending').length}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              {isPaused && (
                <p className="text-sm text-muted-foreground">Generation paused. Click Resume to continue.</p>
              )}
            </div>
          )}

          {keywords.length > 0 && (
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {keywords.filter(kw => kw.status === 'pending').length}
                </div>
                <div className="text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {keywords.filter(kw => kw.status === 'generating').length}
                </div>
                <div className="text-muted-foreground">Generating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {keywords.filter(kw => kw.status === 'completed').length}
                </div>
                <div className="text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {keywords.filter(kw => kw.status === 'error').length}
                </div>
                <div className="text-muted-foreground">Errors</div>
              </div>
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
                  <TableHead>Word Count</TableHead>
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
                        <div className="text-xs text-muted-foreground mt-1">
                          +{keyword.secondary.length} secondary keywords
                        </div>
                      )}
                      {keyword.error && (
                        <div className="text-xs text-red-600 mt-1">
                          Error: {keyword.error}
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
                      <div className="flex items-center gap-2">
                        {getStatusIcon(keyword.status)}
                        <Badge variant={getStatusColor(keyword.status)}>
                          {keyword.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {keyword.wordCount ? `${keyword.wordCount.toLocaleString()} words` : '-'}
                    </TableCell>
                    <TableCell>
                      {keyword.generatedAt 
                        ? keyword.generatedAt.toLocaleDateString()
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {keyword.status === 'error' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => retryKeyword(keyword.id)}
                            title="Retry generation"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeKeyword(keyword.id)}
                          disabled={keyword.status === 'generating'}
                          title="Remove from queue"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
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
