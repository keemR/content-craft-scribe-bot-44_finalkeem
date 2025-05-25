
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface BudgetComparisonChartProps {
  data?: Array<{
    category: string;
    traditional: number;
    optimized: number;
  }>;
}

const BudgetComparisonChart = ({ data }: BudgetComparisonChartProps) => {
  const defaultData = [
    { category: 'Groceries', traditional: 150, optimized: 95 },
    { category: 'Restaurants', traditional: 120, optimized: 60 },
    { category: 'Snacks', traditional: 80, optimized: 35 },
    { category: 'Beverages', traditional: 60, optimized: 25 },
    { category: 'Organic', traditional: 200, optimized: 140 },
  ];

  const chartData = data || defaultData;

  const chartConfig = {
    traditional: {
      label: "Traditional Approach",
      color: "#ef4444",
    },
    optimized: {
      label: "Optimized Approach", 
      color: "#22c55e",
    },
  };

  return (
    <div className="w-full bg-white p-4 rounded-lg border shadow-sm">
      <h3 className="text-lg font-semibold mb-4 text-center">Weekly Budget Comparison</h3>
      <ChartContainer config={chartConfig} className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="traditional" fill="var(--color-traditional)" name="Traditional" />
            <Bar dataKey="optimized" fill="var(--color-optimized)" name="Optimized" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      <p className="text-sm text-gray-600 mt-2 text-center">
        💡 Save up to 40% on weekly food expenses with strategic meal planning
      </p>
    </div>
  );
};

export default BudgetComparisonChart;
