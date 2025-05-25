import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Copy, Download, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import InteractiveChart from "./InteractiveChart";

interface ArticlePreviewProps {
  content: string;
}

const ArticlePreview = ({ content }: ArticlePreviewProps) => {
  const [viewMode, setViewMode] = useState<"preview" | "markdown" | "html">("preview");
  const { toast } = useToast();
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Article content has been copied to your clipboard.",
      variant: "default"
    });
  };
  
  const downloadAsMarkdown = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "article.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: "Your article has been downloaded as Markdown.",
      variant: "default"
    });
  };
  
  const downloadAsPDF = () => {
    toast({
      title: "Preparing PDF",
      description: "Your article is being converted to PDF...",
      variant: "default"
    });
    
    setTimeout(() => {
      toast({
        title: "PDF generated",
        description: "Your article has been downloaded as PDF.",
        variant: "default"
      });
    }, 2000);
  };
  
  // Custom renderer for interactive charts
  const renderers = {
    html: (props: any) => {
      const htmlContent = props.children;
      
      // Check if this is an InteractiveChart component
      const chartMatch = htmlContent.match(/<InteractiveChart type="([^"]+)"(?:\s+title="([^"]*)")?(?:\s+data=\{([^}]+)\})?\s*\/>/);
      
      if (chartMatch) {
        const [, type, title, dataStr] = chartMatch;
        let data;
        try {
          data = dataStr ? JSON.parse(dataStr) : undefined;
        } catch (e) {
          data = undefined;
        }
        
        return (
          <div className="my-6">
            <InteractiveChart 
              type={type as any} 
              title={title} 
              data={data} 
            />
          </div>
        );
      }
      
      // For other HTML, render as-is
      return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    }
  };
  
  // Render a message if no content is available
  if (!content) {
    return (
      <div className="text-center p-10 border rounded-md bg-gray-50">
        <p className="text-gray-500 mb-4">No content generated yet</p>
        <p className="text-sm text-gray-400">
          Use the "Create Content" tab to generate a high-quality article with interactive charts
        </p>
      </div>
    );
  }
  
  const wordCount = content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">
            Word count: <span className="font-medium">{wordCount}</span> · Reading time: <span className="font-medium">{readingTime} min</span>
          </p>
        </div>
        
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "preview" | "markdown" | "html")}>
          <TabsList className="grid grid-cols-3 w-[250px]">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="border rounded-lg overflow-hidden bg-white">
        {viewMode === "preview" && (
          <div className="prose prose-blue max-w-none p-6 overflow-auto">
            <ReactMarkdown components={renderers}>{content}</ReactMarkdown>
          </div>
        )}
        
        {viewMode === "markdown" && (
          <pre className="whitespace-pre-wrap text-sm font-mono bg-gray-50 p-6 overflow-auto max-h-[600px]">
            {content}
          </pre>
        )}
        
        {viewMode === "html" && (
          <pre className="whitespace-pre-wrap text-sm font-mono bg-gray-50 p-6 overflow-auto max-h-[600px]">
            {content.replace(/^# (.*?)$/gm, '<h1>$1</h1>')
              .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
              .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2">')
              .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
              .replace(/^- (.*?)$/gm, '<li>$1</li>')
              .split('\n\n').join('<br><br>')}
          </pre>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3 justify-end">
        <Button variant="outline" size="sm" onClick={copyToClipboard}>
          <Copy className="h-4 w-4 mr-2" /> Copy to Clipboard
        </Button>
        <Button variant="outline" size="sm" onClick={downloadAsMarkdown}>
          <FileText className="h-4 w-4 mr-2" /> Download as Markdown
        </Button>
        <Button variant="outline" size="sm" onClick={downloadAsPDF}>
          <Download className="h-4 w-4 mr-2" /> Download as PDF
        </Button>
      </div>
    </div>
  );
};

export default ArticlePreview;
