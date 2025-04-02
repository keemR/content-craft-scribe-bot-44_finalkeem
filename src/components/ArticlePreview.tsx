
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

interface ArticlePreviewProps {
  content: string;
}

const ArticlePreview = ({ content }: ArticlePreviewProps) => {
  const [isHtmlView, setIsHtmlView] = useState(false);
  
  if (!content) {
    return (
      <div className="text-center p-10 border rounded-md bg-gray-50">
        <p className="text-gray-500 mb-4">No content generated yet</p>
        <p className="text-sm text-gray-400">
          Use the "Create Content" tab to generate an article
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-2">
        <div className="space-x-2">
          <Button 
            variant={isHtmlView ? "outline" : "default"}
            size="sm"
            onClick={() => setIsHtmlView(false)}
          >
            Preview
          </Button>
          <Button 
            variant={isHtmlView ? "default" : "outline"}
            size="sm"
            onClick={() => setIsHtmlView(true)}
          >
            Markdown
          </Button>
        </div>
      </div>
      
      {isHtmlView ? (
        <div className="border rounded-md p-4 bg-gray-50">
          <pre className="whitespace-pre-wrap text-sm font-mono">{content}</pre>
        </div>
      ) : (
        <div className="border rounded-md p-6 bg-white prose prose-blue max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default ArticlePreview;
