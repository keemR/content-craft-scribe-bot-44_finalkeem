
import { Card, CardContent } from "@/components/ui/card";

interface Step {
  number: number;
  title: string;
  description: string;
  duration?: string;
}

interface ProcessStepsChartProps {
  steps?: Step[];
  title?: string;
}

const ProcessStepsChart = ({ steps, title = "Step-by-Step Process" }: ProcessStepsChartProps) => {
  const defaultSteps = [
    { number: 1, title: "Planning", description: "Research and create your strategy", duration: "1-2 days" },
    { number: 2, title: "Setup", description: "Prepare tools and resources", duration: "2-3 days" },
    { number: 3, title: "Implementation", description: "Execute your plan systematically", duration: "1-2 weeks" },
    { number: 4, title: "Testing", description: "Monitor and adjust approach", duration: "1 week" },
    { number: 5, title: "Optimization", description: "Refine and improve results", duration: "Ongoing" },
  ];

  const processSteps = steps || defaultSteps;

  return (
    <div className="w-full bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-6 text-center">{title}</h3>
      <div className="space-y-4">
        {processSteps.map((step, index) => (
          <div key={step.number} className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {step.number}
              </div>
              {index < processSteps.length - 1 && (
                <div className="w-0.5 h-12 bg-gray-300 ml-4 mt-2"></div>
              )}
            </div>
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{step.title}</h4>
                  {step.duration && (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                      {step.duration}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800 text-center">
          🔄 Follow this systematic approach for optimal results
        </p>
      </div>
    </div>
  );
};

export default ProcessStepsChart;
