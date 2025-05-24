
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
  visuals.push(generateMainSectionImage(heading, primaryKeyword, topicCategory, slug));
  
  // Add infographics for specific section types
  if (shouldIncludeInfographic(heading, topicCategory)) {
    visuals.push(generateInfographic(heading, primaryKeyword, topicCategory, slug));
  }
  
  // Add charts/diagrams for data-heavy sections
  if (shouldIncludeChart(heading, topicCategory)) {
    visuals.push(generateChart(heading, primaryKeyword, topicCategory, slug));
  }
  
  // Add process diagrams for how-to sections
  if (shouldIncludeDiagram(heading)) {
    visuals.push(generateDiagram(heading, primaryKeyword, slug));
  }
  
  return visuals;
}

function generateMainSectionImage(
  heading: string, 
  primaryKeyword: string, 
  topicCategory: string, 
  slug: string
): VisualContent {
  let imageDescription = '';
  let caption = '';
  
  if (topicCategory === 'meal-planning') {
    if (heading.toLowerCase().includes('plan')) {
      imageDescription = 'Weekly meal prep containers with colorful, budget-friendly ingredients organized by day';
      caption = 'A sample weekly meal prep showing affordable, nutritious foods organized for easy portion control';
    } else if (heading.toLowerCase().includes('budget') || heading.toLowerCase().includes('shopping')) {
      imageDescription = 'Grocery cart with fresh produce and healthy foods, price tags visible';
      caption = 'Smart grocery shopping with budget-friendly healthy foods';
    } else if (heading.toLowerCase().includes('recipe')) {
      imageDescription = 'Delicious, colorful healthy meal being prepared in a clean kitchen';
      caption = `Preparing nutritious ${primaryKeyword} with simple, affordable ingredients`;
    } else {
      imageDescription = `Healthy meal components related to ${heading.toLowerCase()}`;
      caption = `Visual guide to ${heading.toLowerCase()} for better nutrition`;
    }
  } else if (topicCategory === 'health-fitness') {
    if (heading.toLowerCase().includes('exercise') || heading.toLowerCase().includes('workout')) {
      imageDescription = 'Person demonstrating proper exercise form in a clean, motivating environment';
      caption = `Proper technique demonstration for ${heading.toLowerCase()}`;
    } else if (heading.toLowerCase().includes('equipment')) {
      imageDescription = 'Essential fitness equipment arranged aesthetically';
      caption = `Recommended equipment for ${primaryKeyword} training`;
    } else {
      imageDescription = `Health and fitness concept related to ${heading.toLowerCase()}`;
      caption = `Visual representation of ${heading.toLowerCase()} principles`;
    }
  } else if (topicCategory === 'marketing') {
    imageDescription = `Professional marketing strategy visualization showing ${heading.toLowerCase()} concepts`;
    caption = `Strategic approach to ${primaryKeyword} implementation`;
  } else if (topicCategory === 'online-income') {
    imageDescription = `Clean workspace setup showing ${primaryKeyword} workflow and tools`;
    caption = `Professional setup for successful ${primaryKeyword} implementation`;
  } else {
    imageDescription = `Professional illustration of ${heading.toLowerCase()} concepts`;
    caption = `Visual representation of ${heading.toLowerCase()}`;
  }
  
  return {
    type: 'image',
    url: `https://images.unsplash.com/${slug}-main.jpg`,
    altText: imageDescription,
    caption,
    placement: 'inline'
  };
}

function generateInfographic(
  heading: string, 
  primaryKeyword: string, 
  topicCategory: string, 
  slug: string
): VisualContent {
  let description = '';
  let caption = '';
  
  if (topicCategory === 'meal-planning') {
    description = `Infographic showing key statistics and tips for ${heading.toLowerCase()}`;
    caption = `Key facts and actionable tips for ${heading.toLowerCase()} - save money while eating healthy`;
  } else if (topicCategory === 'health-fitness') {
    description = `Health infographic with statistics and benefits of ${heading.toLowerCase()}`;
    caption = `Research-backed benefits and implementation guide for ${heading.toLowerCase()}`;
  } else if (topicCategory === 'marketing') {
    description = `Marketing strategy infographic showing ${primaryKeyword} process flow`;
    caption = `Step-by-step guide to implementing ${primaryKeyword} strategies effectively`;
  } else if (topicCategory === 'online-income') {
    description = `Income strategy infographic showing potential earnings and methods for ${primaryKeyword}`;
    caption = `Realistic earning potential and proven methods for ${primaryKeyword}`;
  } else {
    description = `Comprehensive infographic about ${heading.toLowerCase()}`;
    caption = `Essential information and actionable insights about ${heading.toLowerCase()}`;
  }
  
  return {
    type: 'infographic',
    url: `https://infographics.example.com/${slug}-infographic.jpg`,
    altText: description,
    caption,
    placement: 'featured'
  };
}

function generateChart(
  heading: string, 
  primaryKeyword: string, 
  topicCategory: string, 
  slug: string
): VisualContent {
  let description = '';
  let caption = '';
  
  if (topicCategory === 'meal-planning') {
    description = `Cost comparison chart showing price differences for ${heading.toLowerCase()}`;
    caption = `Cost analysis comparing different approaches to ${heading.toLowerCase()}`;
  } else if (topicCategory === 'health-fitness') {
    description = `Progress tracking chart showing ${primaryKeyword} improvement over time`;
    caption = `Typical progress timeline for ${primaryKeyword} implementation`;
  } else if (topicCategory === 'marketing') {
    description = `Performance metrics chart for ${primaryKeyword} campaigns`;
    caption = `Key performance indicators and benchmarks for ${primaryKeyword}`;
  } else if (topicCategory === 'online-income') {
    description = `Earnings potential chart showing income progression with ${primaryKeyword}`;
    caption = `Income growth timeline and earning potential with ${primaryKeyword}`;
  } else {
    description = `Data visualization chart for ${heading.toLowerCase()}`;
    caption = `Key metrics and data insights for ${heading.toLowerCase()}`;
  }
  
  return {
    type: 'chart',
    url: `https://charts.example.com/${slug}-chart.png`,
    altText: description,
    caption,
    placement: 'inline'
  };
}

function generateDiagram(heading: string, primaryKeyword: string, slug: string): VisualContent {
  return {
    type: 'diagram',
    url: `https://diagrams.example.com/${slug}-process.jpg`,
    altText: `Step-by-step process diagram for ${heading.toLowerCase()}`,
    caption: `Clear visual guide to implementing ${heading.toLowerCase()} successfully`,
    placement: 'inline'
  };
}

function shouldIncludeInfographic(heading: string, topicCategory: string): boolean {
  const infoKeywords = ['guide', 'tips', 'benefits', 'comparison', 'overview', 'basics'];
  return infoKeywords.some(keyword => heading.toLowerCase().includes(keyword)) ||
         topicCategory === 'meal-planning'; // Always include infographics for meal planning
}

function shouldIncludeChart(heading: string, topicCategory: string): boolean {
  const chartKeywords = ['cost', 'budget', 'comparison', 'analysis', 'results', 'metrics', 'tracking'];
  return chartKeywords.some(keyword => heading.toLowerCase().includes(keyword));
}

function shouldIncludeDiagram(heading: string): boolean {
  const diagramKeywords = ['how to', 'process', 'steps', 'implementation', 'guide', 'strategy'];
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
    }
    
    return markdown;
  }).join('\n\n');
}
