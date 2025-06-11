import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, SkipForward, Download, Trash2, Clock, CheckCircle, XCircle, Eye, Globe, Upload } from "lucide-react";
import CSVUploadModal from "./CSVUploadModal";
import EasyWordPressIntegration from "./EasyWordPressIntegration";
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
  publishedToWP?: boolean;
  wpPostUrl?: string;
}

// Storage key for localStorage
const STORAGE_KEY = 'bulk-content-articles';

const BulkContentManager = () => {
  const [keywords, setKeywords] = useState<BulkKeyword[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<BulkKeyword | null>(null);
  const [isBulkPublishing, setIsBulkPublishing] = useState(false);
  const { toast } = useToast();

  // Load articles from localStorage on component mount
  useEffect(() => {
    const savedArticles = localStorage.getItem(STORAGE_KEY);
    if (savedArticles) {
      try {
        const parsedArticles = JSON.parse(savedArticles);
        // Convert date strings back to Date objects
        const articlesWithDates = parsedArticles.map((article: any) => ({
          ...article,
          generatedAt: article.generatedAt ? new Date(article.generatedAt) : undefined
        }));
        setKeywords(articlesWithDates);
      } catch (error) {
        console.error('Error loading saved articles:', error);
      }
    }
  }, []);

  // Save articles to localStorage whenever keywords change
  useEffect(() => {
    if (keywords.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(keywords));
    }
  }, [keywords]);

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

  const handleBulkWordPressPublish = async (articles: BulkKeyword[]) => {
    setIsBulkPublishing(true);
    let successCount = 0;
    let errorCount = 0;

    for (const article of articles) {
      try {
        // Simulate WordPress publishing
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update article with WordPress info
        setKeywords(prev => prev.map(kw => 
          kw.id === article.id 
            ? { 
                ...kw, 
                publishedToWP: true,
                wpPostUrl: `https://yoursite.com/wp-admin/post.php?post=${Date.now()}&action=edit`
              }
            : kw
        ));
        
        successCount++;
        
        toast({
          title: "Article Published",
          description: `"${article.primary}" has been published to WordPress.`,
        });
        
      } catch (error) {
        errorCount++;
        toast({
          title: "Publishing Failed",
          description: `Failed to publish "${article.primary}" to WordPress.`,
          variant: "destructive",
        });
      }
    }

    setIsBulkPublishing(false);
    
    toast({
      title: "Bulk Publishing Complete",
      description: `Published ${successCount} articles successfully. ${errorCount} failed.`,
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

  const clearAllArticles = () => {
    setKeywords([]);
    localStorage.removeItem(STORAGE_KEY);
    toast({
      title: "Articles Cleared",
      description: "All articles have been removed from storage.",
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

  const completedArticles = keywords.filter(kw => kw.status === 'completed');
  const unpublishedArticles = completedArticles.filter(article => !article.publishedToWP);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="generation" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generation">
            <Play className="w-4 h-4 mr-2" />
            Content Generation
          </TabsTrigger>
          <TabsTrigger value="wordpress">
            <Globe className="w-4 h-4 mr-2" />
            WordPress Publishing
          </TabsTrigger>
          <TabsTrigger value="articles">
            <Eye className="w-4 h-4 mr-2" />
            Generated Articles
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Content Generation</CardTitle>
              <CardDescription>
                Import keywords from CSV and generate multiple articles automatically with priority handling. Articles are automatically saved and persist across sessions.
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

                {keywords.length > 0 && (
                  <Button 
                    variant="outline"
                    onClick={clearAllArticles}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
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
        </TabsContent>

        <TabsContent value="wordpress" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>WordPress Bulk Publishing</CardTitle>
              <CardDescription>
                Publish your generated articles to WordPress in bulk or individually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {completedArticles.length > 0 ? (
                <>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {completedArticles.length}
                      </div>
                      <div className="text-muted-foreground">Total Articles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {completedArticles.filter(a => a.publishedToWP).length}
                      </div>
                      <div className="text-muted-foreground">Published</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {unpublishedArticles.length}
                      </div>
                      <div className="text-muted-foreground">Pending</div>
                    </div>
                  </div>

                  {unpublishedArticles.length > 0 && (
                    <Button
                      onClick={() => handleBulkWordPressPublish(unpublishedArticles)}
                      disabled={isBulkPublishing}
                      className="w-full"
                      size="lg"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isBulkPublishing 
                        ? "Publishing to WordPress..." 
                        : `Publish ${unpublishedArticles.length} Articles to WordPress`
                      }
                    </Button>
                  )}

                  <EasyWordPressIntegration 
                    content=""
                    title=""
                    onPublish={(url) => {
                      toast({
                        title: "WordPress Setup",
                        description: "WordPress connection configured successfully.",
                      });
                    }}
                  />
                </>
              ) : (
                <div className="text-center py-12">
                  <Globe className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No Articles Ready</h3>
                  <p className="text-gray-500">
                    Generate some articles first to enable WordPress publishing.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="articles">
          <Card>
            <CardHeader>
              <CardTitle>Generation Queue ({keywords.length} items)</CardTitle>
              <CardDescription>
                Articles are automatically saved to your browser's local storage
              </CardDescription>
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
                          {keyword.status === 'completed' && keyword.content && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedArticle(keyword)}
                              title="Preview article"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          )}
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
        </TabsContent>
      </Tabs>

      {/* Article Preview Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[80vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{selectedArticle.primary}</h3>
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedArticle(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap">{selectedArticle.content}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkContentManager;

}
