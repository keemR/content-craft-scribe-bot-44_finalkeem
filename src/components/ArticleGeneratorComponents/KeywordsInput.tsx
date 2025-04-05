
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface KeywordsInputProps {
  targetKeywords: string;
  setTargetKeywords: (value: string) => void;
}

const KeywordsInput = ({ targetKeywords, setTargetKeywords }: KeywordsInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="keywords">Target Keywords</Label>
      <Input
        id="keywords"
        placeholder="Primary keyword, secondary keyword 1, secondary keyword 2..."
        value={targetKeywords}
        onChange={(e) => setTargetKeywords(e.target.value)}
      />
      <p className="text-xs text-gray-500">
        Enter your main keyword first, followed by related keywords (separated by commas). 
        Include long-tail variations for better SEO performance.
      </p>
    </div>
  );
};

export default KeywordsInput;
