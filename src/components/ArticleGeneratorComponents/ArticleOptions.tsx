
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ArticleOptionsProps {
  advancedOptions: boolean;
  setAdvancedOptions: (value: boolean) => void;
  includeImages: boolean;
  setIncludeImages: (value: boolean) => void;
  includeFAQs: boolean;
  setIncludeFAQs: (value: boolean) => void;
}

const ArticleOptions = ({
  advancedOptions,
  setAdvancedOptions,
  includeImages,
  setIncludeImages,
  includeFAQs,
  setIncludeFAQs
}: ArticleOptionsProps) => {
  return (
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
    </div>
  );
};

export default ArticleOptions;
