
import { slugify } from '../helpers';

export interface VisualContent {
  type: 'image' | 'infographic' | 'chart' | 'diagram' | 'illustration';
  url: string;
  altText: string;
  caption: string;
  placement: 'inline' | 'featured' | 'sidebar';
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
  const slug = slugify(heading);
  
  // Always include a main image for the section
  visuals.push(generateMainSectionImage(heading, primaryKeyword, topicCategory, slug, sectionIndex));
  
  // Add infographics for specific section types
  if (shouldIncludeInfographic(heading, topicCategory)) {
    visuals.push(generateInfographic(heading, primaryKeyword, topicCategory, slug, sectionIndex));
  }
  
  // Add charts/diagrams for data-heavy sections
  if (shouldIncludeChart(heading, topicCategory)) {
    visuals.push(generateChart(heading, primaryKeyword, topicCategory, slug, sectionIndex));
  }
  
  // Add process diagrams for how-to sections
  if (shouldIncludeDiagram(heading)) {
    visuals.push(generateDiagram(heading, primaryKeyword, slug, sectionIndex));
  }
  
  return visuals;
}

function generateMainSectionImage(
  heading: string, 
  primaryKeyword: string, 
  topicCategory: string, 
  slug: string,
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
      },
      {
        url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
        description: 'Meal planning calendar with healthy recipes',
        caption: 'Organized meal planning for the week ahead'
      },
      {
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
        description: 'Fresh ingredients laid out for healthy cooking',
        caption: 'Quality ingredients for nutritious meal preparation'
      }
    ];
    
    const selected = mealPlanningImages[sectionIndex % mealPlanningImages.length];
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
      },
      {
        url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
        description: 'Fitness progress tracking and goal setting',
        caption: 'Measuring progress and achieving fitness milestones'
      },
      {
        url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80',
        description: 'Yoga and mindfulness practice for wellness',
        caption: 'Mind-body connection in fitness and health'
      },
      {
        url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
        description: 'Healthy nutrition and fitness lifestyle',
        caption: 'Balanced approach to health and nutrition'
      }
    ];
    
    const selected = fitnessImages[sectionIndex % fitnessImages.length];
    imageUrl = selected.url;
    imageDescription = selected.description;
    caption = selected.caption;
    
  } else if (topicCategory === 'marketing') {
    const marketingImages = [
      {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
        description: 'Professional marketing strategy visualization and planning',
        caption: `Strategic approach to ${primaryKeyword} implementation`
      },
      {
        url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80',
        description: 'Social media marketing dashboard and analytics',
        caption: `Social media strategy implementation for ${primaryKeyword}`
      },
      {
        url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
        description: 'Business meeting and marketing collaboration',
        caption: 'Collaborative marketing strategy development'
      },
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        description: 'Digital marketing tools and analytics dashboard',
        caption: 'Data-driven marketing insights and optimization'
      },
      {
        url: 'https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&q=80',
        description: 'Content creation and marketing planning workspace',
        caption: 'Professional content marketing workflow and planning'
      },
      {
        url: 'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&q=80',
        description: 'Marketing campaign analysis and performance metrics',
        caption: 'Measuring marketing effectiveness and ROI'
      },
      {
        url: 'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=800&q=80',
        description: 'Digital marketing strategy brainstorming session',
        caption: 'Creative marketing strategy development'
      },
      {
        url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
        description: 'Online advertising and digital campaigns',
        caption: 'Digital advertising campaign optimization'
      }
    ];
    
    const selected = marketingImages[sectionIndex % marketingImages.length];
    imageUrl = selected.url;
    imageDescription = selected.description;
    caption = selected.caption;
    
  } else if (topicCategory === 'online-income') {
    const onlineIncomeImages = [
      {
        url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
        description: 'Clean workspace setup for online business and remote work',
        caption: `Professional freelance setup for successful ${primaryKeyword} implementation`
      },
      {
        url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
        description: 'Entrepreneur working on laptop with business planning materials',
        caption: `Building a successful online business with ${primaryKeyword}`
      },
      {
        url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80',
        description: 'Person working remotely showing passive income streams',
        caption: `Creating passive income through ${primaryKeyword} strategies`
      },
      {
        url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80',
        description: 'Online business growth and digital entrepreneurship',
        caption: 'Scaling online income through strategic planning'
      },
      {
        url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
        description: 'Financial planning and online income tracking',
        caption: 'Managing and growing online revenue streams'
      },
      {
        url: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=800&q=80',
        description: 'Digital nomad lifestyle and location independence',
        caption: 'Achieving financial freedom through online income'
      },
      {
        url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
        description: 'E-commerce and online selling platforms',
        caption: 'Building successful online sales channels'
      },
      {
        url: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
        description: 'Digital workspace for online business management',
        caption: 'Professional online business operations'
      }
    ];
    
    const selected = onlineIncomeImages[sectionIndex % onlineIncomeImages.length];
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
      },
      {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
        description: 'Business planning and strategy development',
        caption: 'Comprehensive approach to achieving success'
      },
      {
        url: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
        description: 'Team collaboration and project planning',
        caption: 'Collaborative approach to problem solving'
      },
      {
        url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
        description: 'Innovation and creative problem solving',
        caption: 'Creative solutions and strategic thinking'
      }
    ];
    
    const selected = genericImages[sectionIndex % genericImages.length];
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

function generateInfographic(
  heading: string, 
  primaryKeyword: string, 
  topicCategory: string, 
  slug: string,
  sectionIndex: number
): VisualContent {
  let url = '';
  let description = '';
  let caption = '';
  
  if (topicCategory === 'meal-planning') {
    const infographicImages = [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80',
      'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=800&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80'
    ];
    url = infographicImages[sectionIndex % infographicImages.length];
    description = `Infographic showing key statistics and tips for ${heading.toLowerCase()}`;
    caption = `Key facts and actionable tips for ${heading.toLowerCase()} - save money while eating healthy`;
  } else if (topicCategory === 'health-fitness') {
    const infographicImages = [
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80'
    ];
    url = infographicImages[sectionIndex % infographicImages.length];
    description = `Health infographic with statistics and benefits of ${heading.toLowerCase()}`;
    caption = `Research-backed benefits and implementation guide for ${heading.toLowerCase()}`;
  } else if (topicCategory === 'marketing') {
    const infographicImages = [
      'https://images.unsplash.com/photo-1590479773265-7464e5d48118?w=800&q=80',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      'https://images.unsplash.com/photo-1594377157609-5c996118ac7f?w=800&q=80'
    ];
    url = infographicImages[sectionIndex % infographicImages.length];
    description = `Marketing strategy infographic showing ${primaryKeyword} process flow`;
    caption = `Step-by-step guide to implementing ${primaryKeyword} strategies effectively`;
  } else if (topicCategory === 'online-income') {
    const infographicImages = [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80'
    ];
    url = infographicImages[sectionIndex % infographicImages.length];
    description = `Income strategy infographic showing potential earnings and methods for ${primaryKeyword}`;
    caption = `Realistic earning potential and proven methods for ${primaryKeyword}`;
  } else {
    const infographicImages = [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
      'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&q=80'
    ];
    url = infographicImages[sectionIndex % infographicImages.length];
    description = `Comprehensive infographic about ${heading.toLowerCase()}`;
    caption = `Essential information and actionable insights about ${heading.toLowerCase()}`;
  }
  
  return {
    type: 'infographic',
    url,
    altText: description,
    caption,
    placement: 'featured'
  };
}

function generateChart(
  heading: string, 
  primaryKeyword: string, 
  topicCategory: string, 
  slug: string,
  sectionIndex: number
): VisualContent {
  let url = '';
  let description = '';
  let caption = '';
  
  if (topicCategory === 'meal-planning') {
    const chartImages = [
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80',
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&q=80',
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80'
    ];
    url = chartImages[sectionIndex % chartImages.length];
    description = `Cost comparison chart showing price differences for ${heading.toLowerCase()}`;
    caption = `Cost analysis comparing different approaches to ${heading.toLowerCase()}`;
  } else if (topicCategory === 'health-fitness') {
    const chartImages = [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80'
    ];
    url = chartImages[sectionIndex % chartImages.length];
    description = `Progress tracking chart showing ${primaryKeyword} improvement over time`;
    caption = `Typical progress timeline for ${primaryKeyword} implementation`;
  } else if (topicCategory === 'marketing') {
    const chartImages = [
      'https://images.unsplash.com/photo-1594377157609-5c996118ac7f?w=800&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80'
    ];
    url = chartImages[sectionIndex % chartImages.length];
    description = `Performance metrics chart for ${primaryKeyword} campaigns`;
    caption = `Key performance indicators and benchmarks for ${primaryKeyword}`;
  } else if (topicCategory === 'online-income') {
    const chartImages = [
      'https://images.unsplash.com/photo-1554224154-26032fced8bd?w=800&q=80',
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80',
      'https://images.unsplash.com/photo-1594377157609-5c996118ac7f?w=800&q=80',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80'
    ];
    url = chartImages[sectionIndex % chartImages.length];
    description = `Earnings potential chart showing income progression with ${primaryKeyword}`;
    caption = `Income growth timeline and earning potential with ${primaryKeyword}`;
  } else {
    const chartImages = [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&q=80',
      'https://images.unsplash.com/photo-1594377157609-5c996118ac7f?w=800&q=80',
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80'
    ];
    url = chartImages[sectionIndex % chartImages.length];
    description = `Data visualization chart for ${heading.toLowerCase()}`;
    caption = `Key metrics and data insights for ${heading.toLowerCase()}`;
  }
  
  return {
    type: 'chart',
    url,
    altText: description,
    caption,
    placement: 'inline'
  };
}

function generateDiagram(heading: string, primaryKeyword: string, slug: string, sectionIndex: number): VisualContent {
  const diagramImages = [
    'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&q=80',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80'
  ];
  
  return {
    type: 'diagram',
    url: diagramImages[sectionIndex % diagramImages.length],
    altText: `Step-by-step process diagram for ${heading.toLowerCase()}`,
    caption: `Clear visual guide to implementing ${heading.toLowerCase()} successfully`,
    placement: 'inline'
  };
}

function shouldIncludeInfographic(heading: string, topicCategory: string): boolean {
  const infoKeywords = ['guide', 'tips', 'benefits', 'comparison', 'overview', 'basics', 'introduction'];
  return infoKeywords.some(keyword => heading.toLowerCase().includes(keyword)) ||
         topicCategory === 'meal-planning' || 
         topicCategory === 'health-fitness'; // Always include infographics for these categories
}

function shouldIncludeChart(heading: string, topicCategory: string): boolean {
  const chartKeywords = ['cost', 'budget', 'comparison', 'analysis', 'results', 'metrics', 'tracking', 'statistics', 'data'];
  return chartKeywords.some(keyword => heading.toLowerCase().includes(keyword));
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
    let markdown = `![${visual.altText}](${visual.url})\n`;
    markdown += `*${visual.caption}*`;
    
    if (visual.type === 'infographic') {
      markdown += '\n\n> 💡 **Pro Tip:** Save this infographic for quick reference or share it with others who might benefit from this information.';
    } else if (visual.type === 'chart') {
      markdown += '\n\n> 📊 **Data Insight:** Use this chart to track your progress and compare different approaches.';
    } else if (visual.type === 'diagram') {
      markdown += '\n\n> 🔄 **Process Guide:** Follow this step-by-step visual guide for best results.';
    }
    
    return markdown;
  }).join('\n\n');
}
