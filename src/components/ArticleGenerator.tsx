
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { simulateApiCall } from "@/utils/contentGenerationUtils";
import ResearchDataInput from "@/components/ArticleGeneratorComponents/ResearchDataInput";
import KeywordsInput from "@/components/ArticleGeneratorComponents/KeywordsInput";
import ArticleOptions from "@/components/ArticleGeneratorComponents/ArticleOptions";
import ToneAndLengthControls from "@/components/ArticleGeneratorComponents/ToneAndLengthControls";
import AdvancedOptionsPanel from "@/components/ArticleGeneratorComponents/AdvancedOptionsPanel";

interface ArticleGeneratorProps {
  onContentGenerated: (content: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  isGenerating: boolean;
}

const ArticleGenerator = ({ onContentGenerated, setIsGenerating, isGenerating }: ArticleGeneratorProps) => {
  const [researchData, setResearchData] = useState("");
  const [targetKeywords, setTargetKeywords] = useState("");
  const [articleLength, setArticleLength] = useState(3000);
  const [tone, setTone] = useState("informative");
  const [includeImages, setIncludeImages] = useState(true);
  const [includeFAQs, setIncludeFAQs] = useState(true);
  const [advancedOptions, setAdvancedOptions] = useState(false);
  const [seoLevel, setSeoLevel] = useState(80);
  const [targetAudience, setTargetAudience] = useState("");

  const generateContent = async () => {
    if (!researchData.trim()) {
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const content = await simulateApiCall({
        researchData,
        targetKeywords,
        articleLength,
        tone,
        includeImages,
        includeFAQs,
        seoLevel,
        targetAudience
      });
      
      onContentGenerated(content);
    } catch (error) {
      console.error("Error generating content:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <ResearchDataInput 
        researchData={researchData} 
        setResearchData={setResearchData} 
      />

      <KeywordsInput 
        targetKeywords={targetKeywords} 
        setTargetKeywords={setTargetKeywords} 
      />

      <ToneAndLengthControls
        tone={tone}
        setTone={setTone}
        articleLength={articleLength}
        setArticleLength={setArticleLength}
      />

      <ArticleOptions 
        advancedOptions={advancedOptions}
        setAdvancedOptions={setAdvancedOptions}
        includeImages={includeImages}
        setIncludeImages={setIncludeImages}
        includeFAQs={includeFAQs}
        setIncludeFAQs={setIncludeFAQs}
      />
      
      {advancedOptions && (
        <AdvancedOptionsPanel 
          seoLevel={seoLevel}
          setSeoLevel={setSeoLevel}
          targetAudience={targetAudience}
          setTargetAudience={setTargetAudience}
        />
      )}

      <div className="flex justify-end">
        <Button 
          onClick={generateContent} 
          disabled={isGenerating || !researchData.trim()}
          className="w-full md:w-auto"
        >
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isGenerating ? "Generating High-Quality Article..." : "Generate Unique SEO-Optimized Article"}
        </Button>
      </div>
    </div>
  );
};

export default ArticleGenerator;
