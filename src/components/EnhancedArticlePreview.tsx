
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import SEOMetricsPanel from "./SEOMetricsPanel";
import WordPressIntegration from "./WordPressIntegration";
import { Copy, Download, Eye, Code, BarChart3, WordPress } from "lucide-react";

interface EnhancedArticlePreviewProps {
  content: string;
  title?: string;
  keywords?: string;
}

const EnhancedArticlePreview = ({ content, title = "", keywords = "" }: EnhancedArticlePreviewProps) => {
  const [activeTab, setActiveTab] = useState("preview");
  const { toast } = useToast();

  // Calculate SEO metrics from content
  const calculateSEOMetrics = () => {
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    const readingTime = Math.ceil(wordCount / 200);
    const keywordList = keywords.split(',').map(k => k.trim()).filter(k => k);
    const primaryKeyword = keywordList[0] || '';
    
    // Simulate real SEO analysis
    const keywordDensity = primaryKeyword 
      ? Math.min(100, (content.toLowerCase().split(primaryKeyword.toLowerCase()).length - 1) / wordCount * 100 * 10)
      : 0;
    
    const readabilityScore = Math.max(60, Math.min(95, 80 + Math.random() * 15));
    const seoOptimization = Math.max(70, Math.min(95, 75 + Math.random() * 20));
    const contentQuality = Math.max(75, Math.min(98, 80 + Math.random() * 18));
    const engagementPotential = Math.max(65, Math.min(90, 70 + Math.random() * 20));
    
    const overallScore = Math.round(
      (keywordDensity * 0.2 + readabilityScore * 0.2 + seoOptimization * 0.25 + 
       contentQuality * 0.2 + engagementPotential * 0.15)
    );

    return {
      overallScore,
      keywordDensity: Math.round(keywordDensity),
      readabilityScore: Math.round(readabilityScore),
      seoOptimization: Math.round(seoOptimization),
      contentQuality: Math.round(contentQuality),
      engagementPotential: Math.round(engagementPotential),
      wordCount,
      readingTime,
      targetAudience: "General Audience",
      primaryKeyword,
      keywordVariations: keywordList
    };
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Content Copied",
      description: "Article content has been copied to clipboard.",
    });
  };

  const downloadAsMarkdown = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'article'}.md`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Markdown file is being downloaded.",
    });
  };

  const convertToHTML = (markdown: string) => {
    // Simple markdown to HTML conversion for demonstration
    return markdown
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.*)$/gm, '<p>$1</p>')
      .replace(/<p><\/p>/g, '')
      .replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/g, '$1')
      .replace(/<p>(<ul>.*<\/ul>)<\/p>/gs, '$1');
  };

  const seoMetrics = calculateSEOMetrics();

  if (!content) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-gray-500">Generate content to see the preview</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <div className="flex gap-2">
          <Badge variant="outline">
            {seoMetrics.wordCount} words
          </Badge>
          <Badge variant="outline">
            {seoMetrics.readingTime} min read
          </Badge>
          <Badge variant={seoMetrics.overallScore >= 80 ? "default" : "secondary"}>
            SEO Score: {seoMetrics.overallScore}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={downloadAsMarkdown}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="preview" className="flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            SEO Analysis
          </TabsTrigger>
          <TabsTrigger value="wordpress" className="flex items-center">
            <WordPress className="w-4 h-4 mr-2" />
            WordPress
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center">
            <Code className="w-4 h-4 mr-2" />
            Source
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Article Preview</CardTitle>
              <CardDescription>
                Preview how your article will appear to readers
              </CardDescription>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-4">
          <SEOMetricsPanel metrics={seoMetrics} />
        </TabsContent>

        <TabsContent value="wordpress" className="space-y-4">
          <WordPressIntegration 
            content={content} 
            title={title}
            onPublish={(url) => {
              toast({
                title: "Published to WordPress",
                description: "Your article has been successfully published.",
              });
            }}
          />
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Markdown Source</CardTitle>
              <CardDescription>
                Raw markdown content that you can copy or edit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full h-96 p-4 border rounded-lg font-mono text-sm"
                value={content}
                readOnly
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedArticlePreview;
