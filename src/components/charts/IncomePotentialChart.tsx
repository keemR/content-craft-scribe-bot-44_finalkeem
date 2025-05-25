
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface IncomePotentialChartProps {
  data?: Array<{
    month: string;
    beginner: number;
    intermediate: number;
    advanced: number;
  }>;
}

const IncomePotentialChart = ({ data }: IncomePotentialChartProps) => {
  const defaultData = [
    { month: 'Month 1', beginner: 200, intermediate: 500, advanced: 1200 },
    { month: 'Month 2', beginner: 350, intermediate: 800, advanced: 2000 },
    { month: 'Month 3', beginner: 500, intermediate: 1200, advanced: 3200 },
    { month: 'Month 4', beginner: 650, intermediate: 1600, advanced: 4500 },
    { month: 'Month 5', beginner: 800, intermediate: 2000, advanced: 6000 },
    { month: 'Month 6', beginner: 950, intermediate: 2500, advanced: 7800 },
  ];

  const chartData = data || defaultData;

  const chartConfig = {
    beginner: {
      label: "Beginner Level",
      color: "#fbbf24",
    },
    intermediate: {
      label: "Intermediate Level",
      color: "#3b82f6",
    },
    advanced: {
      label: "Advanced Level",
      color: "#10b981",
    },
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-center">Monthly Income Potential</h3>
      <ChartContainer config={chartConfig} className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area 
              type="monotone" 
              dataKey="beginner" 
              stackId="1" 
              stroke="var(--color-beginner)" 
              fill="var(--color-beginner)" 
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="intermediate" 
              stackId="2" 
              stroke="var(--color-intermediate)" 
              fill="var(--color-intermediate)" 
              fillOpacity={0.6}
            />
            <Area 
              type="monotone" 
              dataKey="advanced" 
              stackId="3" 
              stroke="var(--color-advanced)" 
              fill="var(--color-advanced)" 
              fillOpacity={0.6}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
      <p className="text-sm text-gray-600 mt-2 text-center">
        💰 Realistic earning progression based on skill level and time investment
      </p>
    </div>
  );
};

export default IncomePotentialChart;
