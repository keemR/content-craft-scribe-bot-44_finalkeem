
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { simulateApiCall } from "@/utils/contentGenerationUtils";

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
        includeFAQs
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
      <div className="space-y-2">
        <Label htmlFor="researchData">Research Data</Label>
        <Textarea 
          id="researchData" 
          placeholder="Paste your research data, URLs, or information here..." 
          className="min-h-[150px]" 
          value={researchData}
          onChange={(e) => setResearchData(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="keywords">Target Keywords</Label>
        <Input
          id="keywords"
          placeholder="Primary keyword, secondary keyword 1, secondary keyword 2..."
          value={targetKeywords}
          onChange={(e) => setTargetKeywords(e.target.value)}
        />
        <p className="text-xs text-gray-500">Separate multiple keywords with commas. First keyword will be used as the primary focus.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="tone">Article Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger id="tone">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="informative">Informative</SelectItem>
              <SelectItem value="conversational">Conversational</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="persuasive">Persuasive</SelectItem>
              <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Article Length (words): {articleLength}</Label>
          <Slider
            defaultValue={[3000]}
            max={8000}
            step={500}
            min={1500}
            onValueChange={(value) => setArticleLength(value[0])}
          />
          <p className="text-xs text-gray-500">
            {articleLength < 3000 ? "Short-form content" : 
             articleLength < 5000 ? "Medium-length content" : 
             "Long-form content (best for SEO)"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-medium">Article Options</div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setAdvancedOptions(!advancedOptions)}
          >
            {advancedOptions ? "Hide Advanced Options" : "Show Advanced Options"}
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includeImages" 
                  checked={includeImages}
                  onCheckedChange={setIncludeImages}
                />
                <Label htmlFor="includeImages">Include Image Suggestions</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includeFAQs" 
                  checked={includeFAQs}
                  onCheckedChange={setIncludeFAQs}
                />
                <Label htmlFor="includeFAQs">Include FAQ Section</Label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {advancedOptions && (
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <Label>SEO Optimization Level: {seoLevel}%</Label>
                  <Slider
                    defaultValue={[80]}
                    max={100}
                    step={5}
                    min={50}
                    onValueChange={(value) => setSeoLevel(value[0])}
                    className="mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Higher values prioritize search engine ranking factors over natural language flow
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience</Label>
                  <Input
                    id="targetAudience"
                    placeholder="E.g. Beginners, professionals, Gen Z, senior executives..."
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={generateContent} 
          disabled={isGenerating || !researchData.trim()}
          className="w-full md:w-auto"
        >
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isGenerating ? "Generating High-Quality Article..." : "Generate Article"}
        </Button>
      </div>
    </div>
  );
};

export default ArticleGenerator;
