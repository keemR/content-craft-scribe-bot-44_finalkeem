
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ResearchDataInputProps {
  researchData: string;
  setResearchData: (value: string) => void;
}

const ResearchDataInput = ({ researchData, setResearchData }: ResearchDataInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="researchData">Research Data (Optional)</Label>
      <Textarea 
        id="researchData" 
        placeholder="Paste your research data, URLs, statistics, or source information here... Or leave blank for AI to research your topic." 
        className="min-h-[150px]" 
        value={researchData}
        onChange={(e) => setResearchData(e.target.value)}
      />
      <p className="text-xs text-gray-500">
        Optionally provide your own research data for more personalized content.
        If left empty, our AI will automatically research your keywords to generate unique content.
      </p>
    </div>
  );
};

export default ResearchDataInput;
