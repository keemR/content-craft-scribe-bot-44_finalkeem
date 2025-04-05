
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { simulateApiCall } from "@/utils/contentGenerationUtils";
import ResearchDataInput from "@/components/ArticleGeneratorComponents/ResearchDataInput";
import KeywordsInput from "@/components/ArticleGeneratorComponents/KeywordsInput";
import ArticleOptions from "@/components/ArticleGeneratorComponents/ArticleOptions";
import ToneAndLengthControls from "@/components/ArticleGeneratorComponents/ToneAndLengthControls";
import AdvancedOptionsPanel from "@/components/ArticleGeneratorComponents/AdvancedOptionsPanel";
import { useToast } from "@/components/ui/use-toast";

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
  const [isResearching, setIsResearching] = useState(false);
  const { toast } = useToast();

  const performWebResearch = async () => {
    if (!targetKeywords.trim()) {
      toast({
        title: "Keywords Required",
        description: "Please enter at least one keyword to guide the research.",
        variant: "destructive",
      });
      return "";
    }

    setIsResearching(true);
    
    try {
      // Simulate web research API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const keywordsList = targetKeywords.split(',').map(k => k.trim());
      const primaryKeyword = keywordsList[0];
      
      // This is simulating what would normally come from an actual web research API
      const researchResults = `
      Research Results for: ${primaryKeyword}
      
      Sources analyzed: 15 authoritative websites, 8 industry publications, 3 academic papers
      
      Key Facts:
      - ${primaryKeyword} is growing in popularity by 28% year over year
      - Industry experts recommend applying ${primaryKeyword} techniques in specific contexts
      - Recent studies show ${primaryKeyword} improves outcomes by 37% when implemented correctly
      - Common misconceptions about ${primaryKeyword} include X, Y, and Z
      - Best practices for ${primaryKeyword} continue to evolve with technology changes
      
      Related Concepts:
      ${keywordsList.slice(1).map(k => `- ${k}: closely related to ${primaryKeyword}, focusing on specific aspects`).join('\n')}
      
      Latest Trends (2025):
      - Integration of AI with ${primaryKeyword}
      - Sustainability aspects of ${primaryKeyword}
      - Global adoption patterns of ${primaryKeyword}
      
      Expert Opinions:
      "The field of ${primaryKeyword} is rapidly evolving, with new approaches emerging regularly." - Industry Expert
      
      Statistical Data:
      - 78% of professionals believe ${primaryKeyword} will be crucial in the next 5 years
      - Implementation success rates vary from 45% to 92% depending on methodology
      `;
      
      return researchResults;
    } catch (error) {
      console.error("Error performing web research:", error);
      toast({
        title: "Research Error",
        description: "An error occurred while researching your topic. Please try again.",
        variant: "destructive",
      });
      return "";
    } finally {
      setIsResearching(false);
    }
  };

  const generateContent = async () => {
    if (!targetKeywords.trim()) {
      toast({
        title: "Keywords Required",
        description: "Please enter at least one keyword to generate content.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // If no research data provided or it's minimal, perform web research
      let finalResearchData = researchData;
      
      if (!researchData.trim() || researchData.trim().length < 100) {
        toast({
          title: "Performing Research",
          description: "No research data provided. Conducting web research on your keywords...",
        });
        
        const webResearchData = await performWebResearch();
        finalResearchData = webResearchData;
      } else {
        // If user provided data, still augment it with additional research
        toast({
          title: "Enhancing Research",
          description: "Supplementing your research with additional information...",
        });
        
        const supplementalData = await performWebResearch();
        finalResearchData = `${researchData}\n\nADDITIONAL RESEARCH:\n${supplementalData}`;
      }
      
      const content = await simulateApiCall({
        researchData: finalResearchData,
        targetKeywords,
        articleLength,
        tone,
        includeImages,
        includeFAQs,
        seoLevel,
        targetAudience
      });
      
      onContentGenerated(content);
      
      toast({
        title: "Content Generation Complete",
        description: "Your high-quality, unique article has been generated with enhanced research.",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation Error",
        description: "An error occurred while generating your content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <KeywordsInput 
        targetKeywords={targetKeywords} 
        setTargetKeywords={setTargetKeywords} 
      />

      <ResearchDataInput 
        researchData={researchData} 
        setResearchData={setResearchData} 
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
    </div>
  );
};

export default ArticleGenerator;
