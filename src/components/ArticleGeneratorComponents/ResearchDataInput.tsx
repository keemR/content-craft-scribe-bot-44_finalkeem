
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ResearchDataInputProps {
  researchData: string;
  setResearchData: (value: string) => void;
}

const ResearchDataInput = ({ researchData, setResearchData }: ResearchDataInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="researchData">Research Data</Label>
      <Textarea 
        id="researchData" 
        placeholder="Paste your research data, URLs, statistics, or source information here... The more detailed the input, the more unique the output." 
        className="min-h-[150px]" 
        value={researchData}
        onChange={(e) => setResearchData(e.target.value)}
      />
      <p className="text-xs text-gray-500">
        For the highest quality content, include specific data points, statistics, quotes, and expert opinions. 
        This ensures your article will be factually accurate and unique.
      </p>
    </div>
  );
};

export default ResearchDataInput;
