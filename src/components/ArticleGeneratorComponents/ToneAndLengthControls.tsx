
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface ToneAndLengthControlsProps {
  tone: string;
  setTone: (value: string) => void;
  articleLength: number;
  setArticleLength: (value: number) => void;
}

const ToneAndLengthControls = ({ 
  tone, 
  setTone, 
  articleLength, 
  setArticleLength 
}: ToneAndLengthControlsProps) => {
  return (
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
  );
};

export default ToneAndLengthControls;
