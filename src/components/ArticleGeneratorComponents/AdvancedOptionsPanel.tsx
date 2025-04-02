
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface AdvancedOptionsPanelProps {
  seoLevel: number;
  setSeoLevel: (value: number) => void;
  targetAudience: string;
  setTargetAudience: (value: string) => void;
}

const AdvancedOptionsPanel = ({
  seoLevel,
  setSeoLevel,
  targetAudience,
  setTargetAudience
}: AdvancedOptionsPanelProps) => {
  return (
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
  );
};

export default AdvancedOptionsPanel;
