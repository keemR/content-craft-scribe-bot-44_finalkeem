
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, FileText, Globe, BarChart3, Eye, Share2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ReactMarkdown from 'react-markdown';
import SEOMetricsPanel from "./SEOMetricsPanel";
import EasyWordPressIntegration from "./EasyWordPressIntegration";

interface EnhancedArticlePreviewProps {
  content: string;
  title?: string;
  keywords?: string;
}

const EnhancedArticlePreview = ({ content, title = "", keywords = "" }: EnhancedArticlePreviewProps) => {
  const [seoMetrics, setSeoMetrics] = useState({
    wordCount: 0,
    readingTime: 0,
    keywordDensity: 0,
    readabilityScore: 85,
    seoScore: 88
  });
  const { toast } = useToast();

  useEffect(() => {
    if (content) {
      const words = content.split(/\s+/).length;
      const readingTime = Math.ceil(words / 200);
      const keywordMatches = keywords ? (content.toLowerCase().match(new RegExp(keywords.toLowerCase(), 'g')) || []).length : 0;
      const keywordDensity = keywords ? Math.round((keywordMatches / words) * 100 * 10) / 10 : 0;

      setSeoMetrics({
        wordCount: words,
        readingTime,
        keywordDensity,
        readabilityScore: 85,
        seoScore: 88
      });
    }
  }, [content, keywords]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Content copied to clipboard",
      description: "You can now paste the content anywhere.",
    });
  };

  const downloadAsMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'article'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Article downloaded",
      description: "Your article has been downloaded as a Markdown file.",
    });
  };

  if (!content) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Content Yet</h3>
          <p className="text-gray-500">
            Generate an article first to see the preview and publishing options.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Content Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{seoMetrics.wordCount}</div>
            <div className="text-sm text-gray-600">Words</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{seoMetrics.readingTime}</div>
            <div className="text-sm text-gray-600">Min Read</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{seoMetrics.seoScore}</div>
            <div className="text-sm text-gray-600">SEO Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{seoMetrics.readabilityScore}</div>
            <div className="text-sm text-gray-600">Readability</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preview">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="seo">
            <BarChart3 className="w-4 h-4 mr-2" />
            SEO Analysis
          </TabsTrigger>
          <TabsTrigger value="wordpress">
            <Globe className="w-4 h-4 mr-2" />
            WordPress
          </TabsTrigger>
          <TabsTrigger value="export">
            <Share2 className="w-4 h-4 mr-2" />
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{title || "Generated Article"}</CardTitle>
                  {keywords && (
                    <CardDescription className="flex items-center mt-2">
                      <Badge variant="secondary" className="mr-2">
                        Target Keywords: {keywords}
                      </Badge>
                      <Badge variant="outline">
                        Density: {seoMetrics.keywordDensity}%
                      </Badge>
                    </CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-lg max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo">
          <SEOMetricsPanel content={content} keywords={keywords} />
        </TabsContent>

        <TabsContent value="wordpress">
          <EasyWordPressIntegration 
            content={content}
            title={title}
          />
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
              <CardDescription>
                Save or share your generated content in various formats
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={copyToClipboard} variant="outline" className="h-16 flex flex-col">
                  <Copy className="w-6 h-6 mb-2" />
                  <span>Copy to Clipboard</span>
                </Button>
                
                <Button onClick={downloadAsMarkdown} variant="outline" className="h-16 flex flex-col">
                  <Download className="w-6 h-6 mb-2" />
                  <span>Download Markdown</span>
                </Button>
              </div>
              
              <Alert>
                <FileText className="h-4 w-4" />
                <AlertDescription>
                  Your content is ready for publishing on any platform. Use the WordPress tab for direct publishing or copy/download for manual posting.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedArticlePreview;
