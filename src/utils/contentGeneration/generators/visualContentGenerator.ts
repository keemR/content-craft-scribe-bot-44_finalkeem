import { slugify } from '../helpers';

export interface VisualContent {
  type: 'image' | 'infographic' | 'chart' | 'diagram' | 'illustration' | 'interactive-chart';
  url?: string;
  altText: string;
  caption: string;
  placement: 'inline' | 'featured' | 'sidebar';
  chartType?: 'budget-comparison' | 'progress-timeline' | 'income-potential' | 'process-steps';
  chartData?: any;
  chartTitle?: string;
}

/**
 * Generates comprehensive visual content suggestions for article sections
 */
export function generateVisualContent(
  heading: string, 
  primaryKeyword: string, 
  topicCategory: string,
  sectionIndex: number
): VisualContent[] {
  const visuals: VisualContent[] = [];
  
  // Add interactive charts first for relevant sections
  if (shouldIncludeInteractiveChart(heading, topicCategory)) {
    visuals.push(generateInteractiveChart(heading, primaryKeyword, topicCategory, sectionIndex));
  }
  
  // Always include a main image for the section
  visuals.push(generateMainSectionImage(heading, primaryKeyword, topicCategory, sectionIndex));
  
  // Add process diagrams for how-to sections
  if (shouldIncludeDiagram(heading)) {
    visuals.push(generateProcessDiagram(heading, primaryKeyword, sectionIndex));
  }
  
  return visuals;
}

function generateInteractiveChart(
  heading: string,
  primaryKeyword: string,
  topicCategory: string,
  sectionIndex: number
): VisualContent {
  let chartType: 'budget-comparison' | 'progress-timeline' | 'income-potential' | 'process-steps' = 'progress-timeline';
  let chartTitle = heading;
  let chartData = null;

  if (topicCategory === 'meal-planning') {
    if (heading.toLowerCase().includes('budget') || heading.toLowerCase().includes('cost')) {
      chartType = 'budget-comparison';
      chartTitle = 'Budget Comparison: Traditional vs Smart Planning';
      chartData = [
        { category: 'Groceries', traditional: 150, optimized: 95 },
        { category: 'Restaurants', traditional: 120, optimized: 60 },
        { category: 'Prepared Foods', traditional: 80, optimized: 35 },
        { category: 'Organic Items', traditional: 200, optimized: 140 },
      ];
    } else {
      chartType = 'progress-timeline';
      chartTitle = 'Meal Planning Progress Timeline';
      chartData = [
        { week: 'Week 1', progress: 25, target: 30 },
        { week: 'Week 2', progress: 45, target: 50 },
        { week: 'Week 3', progress: 65, target: 70 },
        { week: 'Week 4', progress: 85, target: 90 },
      ];
    }
  } else if (topicCategory === 'online-income') {
    chartType = 'income-potential';
    chartTitle = 'Income Potential by Experience Level';
    chartData = [
      { month: 'Month 1', beginner: 200, intermediate: 500, advanced: 1200 },
      { month: 'Month 2', beginner: 350, intermediate: 800, advanced: 2000 },
      { month: 'Month 3', beginner: 500, intermediate: 1200, advanced: 3200 },
      { month: 'Month 6', beginner: 950, intermediate: 2500, advanced: 7800 },
    ];
  } else if (heading.toLowerCase().includes('step') || heading.toLowerCase().includes('process')) {
    chartType = 'process-steps';
    chartTitle = `${heading} - Complete Guide`;
  } else if (topicCategory === 'health-fitness') {
    chartType = 'progress-timeline';
    chartTitle = 'Fitness Progress Tracking';
    chartData = [
      { week: 'Week 1', progress: 20, target: 25 },
      { week: 'Week 4', progress: 50, target: 55 },
      { week: 'Week 8', progress: 80, target: 85 },
      { week: 'Week 12', progress: 95, target: 100 },
    ];
  }

  return {
    type: 'interactive-chart',
    altText: `Interactive ${chartType} chart for ${heading.toLowerCase()}`,
    caption: `Interactive data visualization showing ${heading.toLowerCase()} insights`,
    placement: 'featured',
    chartType,
    chartData,
    chartTitle
  };
}

function generateMainSectionImage(
  heading: string,
  primaryKeyword: string,
  topicCategory: string,
  sectionIndex: number
): VisualContent {
  let imageUrl = '';
  let imageDescription = '';
  let caption = '';
  
  if (topicCategory === 'meal-planning') {
    const mealPlanningImages = [
      {
        url: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80',
        description: 'Weekly meal prep containers with colorful, budget-friendly ingredients organized by day',
        caption: 'A sample weekly meal prep showing affordable, nutritious foods organized for easy portion control'
      },
      {
        url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
        description: 'Grocery cart with fresh produce and healthy foods, price tags visible',
        caption: 'Smart grocery shopping with budget-friendly healthy foods'
      },
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        description: 'Delicious, colorful healthy meal being prepared in a clean kitchen',
        caption: `Preparing nutritious ${primaryKeyword} with simple, affordable ingredients`
      },
      {
        url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
        description: 'Healthy meal components and ingredients arranged aesthetically',
        caption: `Visual guide to ${heading.toLowerCase()} for better nutrition`
      },
      {
        url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80',
        description: 'Fresh vegetables and healthy ingredients on kitchen counter',
        caption: 'Nutritious ingredients for budget-conscious meal planning'
      },
      {
        url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
        description: 'Healthy salad with fresh vegetables and proteins',
        caption: 'Balanced nutrition with affordable, wholesome ingredients'
      }
    ];
    
    const imageIndex = (sectionIndex * 3 + 1) % mealPlanningImages.length;
    const selected = mealPlanningImages[imageIndex];
    imageUrl = selected.url;
    imageDescription = selected.description;
    caption = selected.caption;
    
  } else if (topicCategory === 'health-fitness') {
    const fitnessImages = [
      {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
        description: 'Person demonstrating proper exercise form in a clean, motivating environment',
        caption: `Proper technique demonstration for ${heading.toLowerCase()}`
      },
      {
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        description: 'Essential fitness equipment arranged aesthetically',
        caption: `Recommended equipment for ${primaryKeyword} training`
      },
      {
        url: 'https://images.unsplash.com/photo-1506629905607-24be3db9b316?w=800&q=80',
        description: 'Fitness and wellness lifestyle concept',
        caption: `Visual representation of ${heading.toLowerCase()} principles`
      },
      {
        url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        description: 'Active lifestyle and fitness motivation',
        caption: 'Inspiring fitness and health transformation journey'
      },
      {
        url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
        description: 'Group fitness and community wellness',
        caption: 'Building healthy habits through community and consistency'
      }
    ];
    
    const imageIndex = (sectionIndex * 2 + 1) % fitnessImages.length;
    const selected = fitnessImages[imageIndex];
    imageUrl = selected.url;
    imageDescription = selected.description;
    caption = selected.caption;
    
  } else {
    // Default fallback images for other categories
    const genericImages = [
      {
        url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        description: `Professional illustration of ${heading.toLowerCase()} concepts`,
        caption: `Visual representation of ${heading.toLowerCase()}`
      },
      {
        url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
        description: 'Professional workspace and planning environment',
        caption: 'Strategic approach to implementation and planning'
      }
    ];
    
    const imageIndex = sectionIndex % genericImages.length;
    const selected = genericImages[imageIndex];
    imageUrl = selected.url;
    imageDescription = selected.description;
    caption = selected.caption;
  }
  
  return {
    type: 'image',
    url: imageUrl,
    altText: imageDescription,
    caption,
    placement: 'inline'
  };
}

function generateProcessDiagram(heading: string, primaryKeyword: string, sectionIndex: number): VisualContent {
  return {
    type: 'interactive-chart',
    altText: `Step-by-step process diagram for ${heading.toLowerCase()}`,
    caption: `Clear visual guide to implementing ${heading.toLowerCase()} successfully`,
    placement: 'inline',
    chartType: 'process-steps',
    chartTitle: `${heading} - Step by Step`
  };
}

function shouldIncludeInteractiveChart(heading: string, topicCategory: string): boolean {
  const chartKeywords = ['budget', 'cost', 'comparison', 'progress', 'timeline', 'income', 'earning', 'steps', 'process', 'guide'];
  return chartKeywords.some(keyword => heading.toLowerCase().includes(keyword)) ||
         topicCategory === 'meal-planning' || 
         topicCategory === 'online-income' ||
         topicCategory === 'health-fitness';
}

function shouldIncludeDiagram(heading: string): boolean {
  const diagramKeywords = ['how to', 'process', 'steps', 'implementation', 'guide', 'strategy', 'method', 'approach'];
  return diagramKeywords.some(keyword => heading.toLowerCase().includes(keyword));
}

/**
 * Formats visual content for markdown output
 */
export function formatVisualContentForMarkdown(visuals: VisualContent[]): string {
  return visuals.map(visual => {
    if (visual.type === 'interactive-chart') {
      // Return a placeholder that will be replaced by actual chart components
      return `<InteractiveChart type="${visual.chartType}" title="${visual.chartTitle}" data={${JSON.stringify(visual.chartData)}} />
*${visual.caption}*

> 📊 **Interactive Chart:** This chart provides real-time data insights and can be customized for your specific needs.`;
    } else {
      let markdown = `![${visual.altText}](${visual.url})\n`;
      markdown += `*${visual.caption}*`;
      
      if (visual.type === 'infographic') {
        markdown += '\n\n> 💡 **Pro Tip:** Save this infographic for quick reference or share it with others who might benefit from this information.';
      }
      
      return markdown;
    }
  }).join('\n\n');
}
