
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

// Track used images to prevent duplicates
const usedImages = new Set<string>();

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
  
  // Always include a main image for the section (ensuring no duplicates)
  visuals.push(generateMainSectionImage(heading, primaryKeyword, topicCategory, sectionIndex));
  
  // Add infographics for information-heavy sections
  if (shouldIncludeInfographic(heading, topicCategory)) {
    visuals.push(generateInfographic(heading, primaryKeyword, topicCategory, sectionIndex));
  }
  
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
      chartTitle = 'Weekly Food Budget: Smart vs Traditional Shopping';
      chartData = [
        { category: 'Proteins', traditional: 180, optimized: 120 },
        { category: 'Vegetables', traditional: 90, optimized: 65 },
        { category: 'Grains', traditional: 45, optimized: 35 },
        { category: 'Dairy', traditional: 75, optimized: 55 },
        { category: 'Snacks', traditional: 60, optimized: 25 },
      ];
    } else if (heading.toLowerCase().includes('plan') || heading.toLowerCase().includes('prep')) {
      chartType = 'progress-timeline';
      chartTitle = 'Meal Planning Implementation Timeline';
      chartData = [
        { week: 'Week 1', progress: 30, target: 35 },
        { week: 'Week 2', progress: 55, target: 60 },
        { week: 'Week 3', progress: 75, target: 80 },
        { week: 'Week 4', progress: 90, target: 95 },
      ];
    } else {
      chartType = 'process-steps';
      chartTitle = `${heading} - Step by Step Guide`;
    }
  } else if (topicCategory === 'online-income') {
    if (heading.toLowerCase().includes('income') || heading.toLowerCase().includes('earning')) {
      chartType = 'income-potential';
      chartTitle = 'Monthly Income Growth Potential';
      chartData = [
        { month: 'Month 1', beginner: 150, intermediate: 400, advanced: 800 },
        { month: 'Month 3', beginner: 400, intermediate: 900, advanced: 2200 },
        { month: 'Month 6', beginner: 750, intermediate: 1800, advanced: 4500 },
        { month: 'Month 12', beginner: 1200, intermediate: 3500, advanced: 8500 },
      ];
    } else if (heading.toLowerCase().includes('step') || heading.toLowerCase().includes('guide')) {
      chartType = 'process-steps';
      chartTitle = `${heading} - Implementation Roadmap`;
    } else {
      chartType = 'progress-timeline';
      chartTitle = 'Business Development Timeline';
      chartData = [
        { week: 'Month 1', progress: 25, target: 30 },
        { week: 'Month 3', progress: 60, target: 65 },
        { week: 'Month 6', progress: 85, target: 90 },
        { week: 'Month 12', progress: 95, target: 100 },
      ];
    }
  } else if (topicCategory === 'health-fitness') {
    if (heading.toLowerCase().includes('progress') || heading.toLowerCase().includes('result')) {
      chartType = 'progress-timeline';
      chartTitle = 'Fitness Progress Tracking Over Time';
      chartData = [
        { week: 'Week 2', progress: 15, target: 20 },
        { week: 'Week 6', progress: 45, target: 50 },
        { week: 'Week 10', progress: 70, target: 75 },
        { week: 'Week 16', progress: 90, target: 95 },
      ];
    } else {
      chartType = 'process-steps';
      chartTitle = `${heading} - Training Protocol`;
    }
  } else if (heading.toLowerCase().includes('step') || heading.toLowerCase().includes('process')) {
    chartType = 'process-steps';
    chartTitle = `${heading} - Complete Implementation Guide`;
  }

  return {
    type: 'interactive-chart',
    altText: `Interactive ${chartType} chart showing ${heading.toLowerCase()} data and insights`,
    caption: `Interactive visualization demonstrating key metrics and progress for ${heading.toLowerCase()}`,
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
        caption: 'Organized weekly meal prep showing portion-controlled, nutritious meals for the entire week'
      },
      {
        url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
        description: 'Smart grocery shopping with fresh produce and healthy foods in shopping cart',
        caption: 'Strategic grocery shopping focusing on nutrient-dense, budget-friendly whole foods'
      },
      {
        url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
        description: 'Healthy meal preparation in progress with fresh ingredients on kitchen counter',
        caption: 'Preparing nutritious meals using simple, affordable ingredients and efficient cooking methods'
      },
      {
        url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
        description: 'Balanced meal components showcasing proper nutrition ratios',
        caption: 'Visual guide to balanced nutrition with proper protein, vegetable, and grain proportions'
      },
      {
        url: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80',
        description: 'Fresh seasonal vegetables and herbs arranged for meal planning',
        caption: 'Seasonal produce selection for maximum nutrition and cost-effectiveness'
      },
      {
        url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
        description: 'Colorful, nutrient-rich salad with diverse vegetables and proteins',
        caption: 'Example of a balanced, budget-friendly meal packed with essential nutrients'
      },
      {
        url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
        description: 'Family meal planning session with calendar and grocery list',
        caption: 'Family-friendly meal planning process including scheduling and budget considerations'
      },
      {
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
        description: 'Healthy meal ingredients spread out for batch cooking preparation',
        caption: 'Batch cooking setup showing efficient meal preparation for multiple days'
      }
    ];
    
    // Use a unique image for each section
    const imageIndex = sectionIndex % mealPlanningImages.length;
    const selected = mealPlanningImages[imageIndex];
    
    // Ensure no duplicates by checking used images
    let finalIndex = imageIndex;
    while (usedImages.has(selected.url) && usedImages.size < mealPlanningImages.length) {
      finalIndex = (finalIndex + 1) % mealPlanningImages.length;
    }
    
    const finalSelected = mealPlanningImages[finalIndex];
    usedImages.add(finalSelected.url);
    
    imageUrl = finalSelected.url;
    imageDescription = finalSelected.description;
    caption = finalSelected.caption;
    
  } else if (topicCategory === 'health-fitness') {
    const fitnessImages = [
      {
        url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
        description: 'Person demonstrating proper exercise form with focus on technique',
        caption: 'Proper exercise technique demonstration emphasizing form over intensity'
      },
      {
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
        description: 'Essential home fitness equipment arranged in organized space',
        caption: 'Home gym setup with essential equipment for effective workouts'
      },
      {
        url: 'https://images.unsplash.com/photo-1506629905607-24be3db9b316?w=800&q=80',
        description: 'Active lifestyle concept with outdoor fitness activity',
        caption: 'Incorporating physical activity into daily lifestyle for long-term health'
      },
      {
        url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
        description: 'Group fitness class showing community support and motivation',
        caption: 'Community-based fitness approach for motivation and accountability'
      },
      {
        url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
        description: 'Individual focused workout session with proper equipment',
        caption: 'Focused training session demonstrating consistent effort and dedication'
      },
      {
        url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=800&q=80',
        description: 'Fitness tracking and progress monitoring setup',
        caption: 'Progress tracking tools and methods for measuring fitness improvements'
      }
    ];
    
    const imageIndex = sectionIndex % fitnessImages.length;
    const selected = fitnessImages[imageIndex];
    
    let finalIndex = imageIndex;
    while (usedImages.has(selected.url) && usedImages.size < fitnessImages.length) {
      finalIndex = (finalIndex + 1) % fitnessImages.length;
    }
    
    const finalSelected = fitnessImages[finalIndex];
    usedImages.add(finalSelected.url);
    
    imageUrl = finalSelected.url;
    imageDescription = finalSelected.description;
    caption = finalSelected.caption;
    
  } else if (topicCategory === 'online-income') {
    const onlineIncomeImages = [
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        description: 'Professional home office setup for online business operations',
        caption: 'Optimized workspace setup for productive online income generation'
      },
      {
        url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
        description: 'Digital marketing analytics dashboard showing growth metrics',
        caption: 'Data-driven approach to online business growth and optimization'
      },
      {
        url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80',
        description: 'Person working on laptop with multiple income streams visualization',
        caption: 'Diversified online income strategy implementation and management'
      },
      {
        url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80',
        description: 'Professional video content creation setup for online business',
        caption: 'Content creation setup for building online presence and authority'
      }
    ];
    
    const imageIndex = sectionIndex % onlineIncomeImages.length;
    const selected = onlineIncomeImages[imageIndex];
    
    let finalIndex = imageIndex;
    while (usedImages.has(selected.url) && usedImages.size < onlineIncomeImages.length) {
      finalIndex = (finalIndex + 1) % onlineIncomeImages.length;
    }
    
    const finalSelected = onlineIncomeImages[finalIndex];
    usedImages.add(finalSelected.url);
    
    imageUrl = finalSelected.url;
    imageDescription = finalSelected.description;
    caption = finalSelected.caption;
    
  } else {
    // Default fallback images for other categories
    const genericImages = [
      {
        url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        description: `Professional workspace demonstrating ${heading.toLowerCase()} implementation`,
        caption: `Strategic approach to ${heading.toLowerCase()} with professional tools and methods`
      },
      {
        url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
        description: 'Organized planning and strategy development workspace',
        caption: 'Systematic planning approach for successful implementation and results'
      }
    ];
    
    const imageIndex = sectionIndex % genericImages.length;
    const selected = genericImages[imageIndex];
    
    let finalIndex = imageIndex;
    while (usedImages.has(selected.url) && usedImages.size < genericImages.length) {
      finalIndex = (finalIndex + 1) % genericImages.length;
    }
    
    const finalSelected = genericImages[finalIndex];
    usedImages.add(finalSelected.url);
    
    imageUrl = finalSelected.url;
    imageDescription = finalSelected.description;
    caption = finalSelected.caption;
  }
  
  return {
    type: 'image',
    url: imageUrl,
    altText: imageDescription,
    caption,
    placement: 'inline'
  };
}

function generateInfographic(heading: string, primaryKeyword: string, topicCategory: string, sectionIndex: number): VisualContent {
  let chartType: 'budget-comparison' | 'progress-timeline' | 'income-potential' | 'process-steps' = 'process-steps';
  let chartTitle = `${heading} - Key Insights`;
  let chartData = null;

  if (topicCategory === 'meal-planning') {
    if (heading.toLowerCase().includes('nutrition') || heading.toLowerCase().includes('health')) {
      chartType = 'budget-comparison';
      chartTitle = 'Nutritional Value vs Cost Analysis';
      chartData = [
        { category: 'Leafy Greens', traditional: 25, optimized: 45 },
        { category: 'Whole Grains', traditional: 35, optimized: 55 },
        { category: 'Lean Proteins', traditional: 40, optimized: 65 },
        { category: 'Seasonal Fruits', traditional: 30, optimized: 50 },
      ];
    } else {
      chartType = 'process-steps';
      chartTitle = `${heading} - Implementation Steps`;
    }
  } else if (topicCategory === 'online-income') {
    chartType = 'income-potential';
    chartTitle = 'Skill Level vs Income Potential';
    chartData = [
      { month: 'Beginner', beginner: 300, intermediate: 800, advanced: 2000 },
      { month: 'Intermediate', beginner: 600, intermediate: 1500, advanced: 4000 },
      { month: 'Advanced', beginner: 1000, intermediate: 2500, advanced: 6500 },
    ];
  } else {
    chartType = 'process-steps';
    chartTitle = `${heading} - Key Components`;
  }

  return {
    type: 'interactive-chart',
    altText: `Infographic chart showing key insights about ${heading.toLowerCase()}`,
    caption: `Comprehensive data visualization highlighting important aspects of ${heading.toLowerCase()}`,
    placement: 'featured',
    chartType,
    chartData,
    chartTitle
  };
}

function generateProcessDiagram(heading: string, primaryKeyword: string, sectionIndex: number): VisualContent {
  return {
    type: 'interactive-chart',
    altText: `Step-by-step process diagram for implementing ${heading.toLowerCase()}`,
    caption: `Visual workflow guide showing the complete process for ${heading.toLowerCase()} implementation`,
    placement: 'inline',
    chartType: 'process-steps',
    chartTitle: `${heading} - Complete Process Flow`
  };
}

function shouldIncludeInteractiveChart(heading: string, topicCategory: string): boolean {
  const chartKeywords = ['budget', 'cost', 'comparison', 'progress', 'timeline', 'income', 'earning', 'analysis', 'metrics'];
  return chartKeywords.some(keyword => heading.toLowerCase().includes(keyword)) ||
         topicCategory === 'meal-planning' || 
         topicCategory === 'online-income' ||
         topicCategory === 'health-fitness';
}

function shouldIncludeInfographic(heading: string, topicCategory: string): boolean {
  const infoKeywords = ['guide', 'tips', 'benefits', 'overview', 'basics', 'fundamentals', 'key', 'essential'];
  return infoKeywords.some(keyword => heading.toLowerCase().includes(keyword));
}

function shouldIncludeDiagram(heading: string): boolean {
  const diagramKeywords = ['how to', 'process', 'steps', 'implementation', 'method', 'approach', 'strategy'];
  return diagramKeywords.some(keyword => heading.toLowerCase().includes(keyword));
}

/**
 * Formats visual content for markdown output
 */
export function formatVisualContentForMarkdown(visuals: VisualContent[]): string {
  return visuals.map(visual => {
    if (visual.type === 'interactive-chart') {
      return `<InteractiveChart type="${visual.chartType}" title="${visual.chartTitle}" data={${JSON.stringify(visual.chartData)}} />

*${visual.caption}*

> 📊 **Interactive Visualization:** This chart provides real-time insights and can be customized for your specific analysis needs.`;
    } else {
      let markdown = `![${visual.altText}](${visual.url})
*${visual.caption}*`;
      
      if (visual.type === 'infographic') {
        markdown += '\n\n> 💡 **Pro Tip:** This visual summary captures the key points for quick reference and easy sharing.';
      }
      
      return markdown;
    }
  }).join('\n\n');
}

// Reset used images when generating new content
export function resetUsedImages(): void {
  usedImages.clear();
}
