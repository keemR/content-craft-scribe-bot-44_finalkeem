
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface KeywordsInputProps {
  targetKeywords: string;
  setTargetKeywords: (value: string) => void;
}

const KeywordsInput = ({ targetKeywords, setTargetKeywords }: KeywordsInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="keywords" className="flex items-center">
        Target Keywords <span className="ml-1 text-red-500">*</span>
      </Label>
      <Input
        id="keywords"
        placeholder="Primary keyword, secondary keyword 1, secondary keyword 2..."
        value={targetKeywords}
        onChange={(e) => setTargetKeywords(e.target.value)}
        required
      />
      <p className="text-xs text-gray-500">
        Enter your main keyword first, followed by related keywords (separated by commas). 
        This will guide both AI research and content creation for better SEO performance.
      </p>
    </div>
  );
};

export default KeywordsInput;
