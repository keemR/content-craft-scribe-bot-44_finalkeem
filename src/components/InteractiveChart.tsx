
import BudgetComparisonChart from './charts/BudgetComparisonChart';
import ProgressTimelineChart from './charts/ProgressTimelineChart';
import IncomePotentialChart from './charts/IncomePotentialChart';
import ProcessStepsChart from './charts/ProcessStepsChart';

interface InteractiveChartProps {
  type: 'budget-comparison' | 'progress-timeline' | 'income-potential' | 'process-steps';
  title?: string;
  data?: any;
}

const InteractiveChart = ({ type, title, data }: InteractiveChartProps) => {
  switch (type) {
    case 'budget-comparison':
      return <BudgetComparisonChart data={data} />;
    case 'progress-timeline':
      return <ProgressTimelineChart data={data} title={title} />;
    case 'income-potential':
      return <IncomePotentialChart data={data} />;
    case 'process-steps':
      return <ProcessStepsChart title={title} />;
    default:
      return <ProgressTimelineChart data={data} title={title} />;
  }
};

export default InteractiveChart;
