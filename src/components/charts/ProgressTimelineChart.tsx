
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ProgressTimelineChartProps {
  data?: Array<{
    week: string;
    progress: number;
    target: number;
  }>;
  title?: string;
  metric?: string;
}

const ProgressTimelineChart = ({ data, title = "Progress Over Time", metric = "Progress" }: ProgressTimelineChartProps) => {
  const defaultData = [
    { week: 'Week 1', progress: 15, target: 20 },
    { week: 'Week 2', progress: 32, target: 40 },
    { week: 'Week 3', progress: 48, target: 60 },
    { week: 'Week 4', progress: 65, target: 80 },
    { week: 'Week 5', progress: 78, target: 100 },
    { week: 'Week 6', progress: 88, target: 120 },
    { week: 'Week 7', progress: 95, target: 140 },
    { week: 'Week 8', progress: 112, target: 160 },
  ];

  const chartData = data || defaultData;

  const chartConfig = {
    progress: {
      label: "Actual Progress",
      color: "#3b82f6",
    },
    target: {
      label: "Target Goal",
      color: "#10b981",
    },
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      <ChartContainer config={chartConfig} className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="progress" 
              stroke="var(--color-progress)" 
              strokeWidth={3}
              dot={{ fill: "var(--color-progress)", r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="target" 
              stroke="var(--color-target)" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "var(--color-target)", r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
      <p className="text-sm text-gray-600 mt-2 text-center">
        📊 Track your progress and stay motivated with clear milestones
      </p>
    </div>
  );
};

export default ProgressTimelineChart;
