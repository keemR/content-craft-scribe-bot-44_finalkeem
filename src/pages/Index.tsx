
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import ArticleGenerator from "@/components/ArticleGenerator";
import ArticlePreview from "@/components/ArticlePreview";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const { toast } = useToast();
  
  const handleContentGenerated = (content: string) => {
    setGeneratedContent(content);
    toast({
      title: "Content generated successfully!",
      description: "Your high-quality article is ready for review.",
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            ContentCraft<span className="text-blue-600">Scribe</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your research into SEO-optimized, engaging articles that outrank the competition
          </p>
        </div>

        <Tabs defaultValue="generator" className="max-w-5xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="generator">Create Content</TabsTrigger>
            <TabsTrigger value="preview">Preview Article</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generator">
            <Card>
              <CardHeader>
                <CardTitle>Article Generator</CardTitle>
                <CardDescription>
                  Enter your research data, keywords, and preferences to generate a high-quality article
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ArticleGenerator 
                  onContentGenerated={handleContentGenerated}
                  setIsGenerating={setIsGenerating}
                  isGenerating={isGenerating}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Article Preview</CardTitle>
                <CardDescription>
                  Review and edit your generated article
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ArticlePreview content={generatedContent} />
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline">
                  Download as PDF
                </Button>
                <Button variant="outline">
                  Download as Markdown
                </Button>
                <Button>
                  Copy to Clipboard
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
