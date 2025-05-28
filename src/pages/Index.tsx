
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import ArticleGenerator from "@/components/ArticleGenerator";
import EnhancedArticlePreview from "@/components/EnhancedArticlePreview";
import BulkContentManager from "@/components/BulkContentManager";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FileText, Zap, Users } from "lucide-react";

const Index = () => {
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [generatedTitle, setGeneratedTitle] = useState<string>("");
  const [usedKeywords, setUsedKeywords] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { toast } = useToast();
  
  const handleContentGenerated = (content: string, keywords?: string, title?: string) => {
    setGeneratedContent(content);
    setUsedKeywords(keywords || "");
    setGeneratedTitle(title || "");
    toast({
      title: "Content generated successfully!",
      description: "Your high-quality, SEO-optimized article is ready for review and publishing.",
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            ContentCraft<span className="text-blue-600">Scribe</span> Pro
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The ultimate AI-powered content generation platform with WordPress integration, 
            advanced SEO analytics, and bulk production capabilities
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Smart Content Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                AI-powered research and writing with advanced SEO optimization and readability analysis
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>WordPress Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Direct publishing to WordPress with automatic SEO optimization and featured image suggestions
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Bulk Production</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Upload CSV files with keywords and generate multiple articles automatically with priority scheduling
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="generator" className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="generator">Single Article</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Generation</TabsTrigger>
            <TabsTrigger value="preview">Preview & Publish</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator">
            <Card>
              <CardHeader>
                <CardTitle>AI Article Generator</CardTitle>
                <CardDescription>
                  Create high-quality, SEO-optimized articles with advanced research and content analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ArticleGenerator 
                  onContentGenerated={(content, keywords, title) => 
                    handleContentGenerated(content, keywords, title)
                  }
                  setIsGenerating={setIsGenerating}
                  isGenerating={isGenerating}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="bulk">
            <BulkContentManager />
          </TabsContent>
          
          <TabsContent value="preview">
            <EnhancedArticlePreview 
              content={generatedContent}
              title={generatedTitle}
              keywords={usedKeywords}
            />
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
