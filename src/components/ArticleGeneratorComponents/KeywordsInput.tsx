
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
      <p className="text-xs text-gray-500">Separate multiple keywords with commas. First keyword will be used as the primary focus.</p>
    </div>
  );
};

export default KeywordsInput;
