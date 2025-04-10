
import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

interface ResearchHandlerProps {
  targetKeywords: string;
  isGenerating: boolean;
  handleGenerateContent: () => void;
}

const ResearchHandler = ({ 
  targetKeywords, 
  isGenerating, 
  handleGenerateContent 
}: ResearchHandlerProps) => {
  const [isResearching, setIsResearching] = useState(false);
  const { toast } = useToast();

  const validateKeywords = (): boolean => {
    if (!targetKeywords.trim()) {
      toast({
        title: "Keywords Required",
        description: "Please enter at least one keyword to guide the content generation.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return (
    <div className="flex justify-end">
      <Button 
        onClick={handleGenerateContent} 
        disabled={isGenerating || isResearching || !targetKeywords.trim()}
        className="w-full md:w-auto"
      >
        {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isResearching && <Search className="mr-2 h-4 w-4 animate-spin" />}
        {isGenerating ? 
          "Generating High-Quality Article..." : 
          isResearching ? 
            "Researching Topic..." : 
            "Generate Unique SEO-Optimized Article"
        }
      </Button>
    </div>
  );
};

export default ResearchHandler;
