
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
        placeholder="Paste your research data, URLs, or information here..." 
        className="min-h-[150px]" 
        value={researchData}
        onChange={(e) => setResearchData(e.target.value)}
      />
    </div>
  );
};

export default ResearchDataInput;
