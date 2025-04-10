
import { useState } from "react";
import { Loader2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { performWebResearch } from "@/services/researchService";

interface ResearchHandlerProps {
  targetKeywords: string;
  isGenerating: boolean;
  handleGenerateContent: () => void;
  onResearchComplete?: (data: string) => void;
}

const ResearchHandler = ({ 
  targetKeywords, 
  isGenerating, 
  handleGenerateContent,
  onResearchComplete
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

  const handleResearch = async () => {
    if (!validateKeywords()) return;
    
    const researchData = await performWebResearch(
      targetKeywords, 
      setIsResearching,
      (props) => toast(props)
    );
    
    if (researchData && onResearchComplete) {
      onResearchComplete(researchData);
    }
  };

  return (
    <div className="flex justify-end space-x-4">
      {onResearchComplete && (
        <Button 
          variant="outline"
          onClick={handleResearch} 
          disabled={isGenerating || isResearching || !targetKeywords.trim()}
          className="w-full md:w-auto"
        >
          {isResearching && <Search className="mr-2 h-4 w-4 animate-spin" />}
          {isResearching ? "Researching Topic..." : "Research Topic"}
        </Button>
      )}
      
      <Button 
        onClick={handleGenerateContent} 
        disabled={isGenerating || isResearching || !targetKeywords.trim()}
        className="w-full md:w-auto"
      >
        {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isGenerating ? 
          "Generating High-Quality Article..." : 
          "Generate Unique SEO-Optimized Article"
        }
      </Button>
    </div>
  );
};

export default ResearchHandler;
