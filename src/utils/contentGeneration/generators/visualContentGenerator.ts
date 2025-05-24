
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
  let imageUrl = '';
  let imageDescription = '';
  let caption = '';
  
  if (topicCategory === 'meal-planning') {
    if (heading.toLowerCase().includes('plan')) {
      imageUrl = 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80';
      imageDescription = 'Weekly meal prep containers with colorful, budget-friendly ingredients organized by day';
      caption = 'A sample weekly meal prep showing affordable, nutritious foods organized for easy portion control';
    } else if (heading.toLowerCase().includes('budget') || heading.toLowerCase().includes('shopping')) {
      imageUrl = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80';
      imageDescription = 'Grocery cart with fresh produce and healthy foods, price tags visible';
      caption = 'Smart grocery shopping with budget-friendly healthy foods';
    } else if (heading.toLowerCase().includes('recipe')) {
      imageUrl = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80';
      imageDescription = 'Delicious, colorful healthy meal being prepared in a clean kitchen';
      caption = `Preparing nutritious ${primaryKeyword} with simple, affordable ingredients`;
    } else {
      imageUrl = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80';
      imageDescription = `Healthy meal components related to ${heading.toLowerCase()}`;
      caption = `Visual guide to ${heading.toLowerCase()} for better nutrition`;
    }
  } else if (topicCategory === 'health-fitness') {
    if (heading.toLowerCase().includes('exercise') || heading.toLowerCase().includes('workout')) {
      imageUrl = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80';
      imageDescription = 'Person demonstrating proper exercise form in a clean, motivating environment';
      caption = `Proper technique demonstration for ${heading.toLowerCase()}`;
    } else if (heading.toLowerCase().includes('equipment')) {
      imageUrl = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80';
      imageDescription = 'Essential fitness equipment arranged aesthetically';
      caption = `Recommended equipment for ${primaryKeyword} training`;
    } else {
      imageUrl = 'https://images.unsplash.com/photo-1506629905607-24be3db9b316?w=800&q=80';
      imageDescription = `Health and fitness concept related to ${heading.toLowerCase()}`;
      caption = `Visual representation of ${heading.toLowerCase()} principles`;
    }
  } else if (topicCategory === 'marketing') {
    if (heading.toLowerCase().includes('strategy')) {
      imageUrl = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80';
      imageDescription = `Professional marketing strategy visualization showing ${heading.toLowerCase()} concepts`;
      caption = `Strategic approach to ${primaryKeyword} implementation`;
    } else if (heading.toLowerCase().includes('social')) {
      imageUrl = 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&q=80';
      imageDescription = `Social media marketing dashboard and analytics`;
      caption = `Social media strategy implementation for ${primaryKeyword}`;
    } else {
      imageUrl = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80';
      imageDescription = `Professional marketing strategy visualization showing ${heading.toLowerCase()} concepts`;
      caption = `Strategic approach to ${primaryKeyword} implementation`;
    }
  } else if (topicCategory === 'online-income') {
    if (heading.toLowerCase().includes('freelance')) {
      imageUrl = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80';
      imageDescription = `Clean workspace setup showing ${primaryKeyword} workflow and tools`;
      caption = `Professional freelance setup for successful ${primaryKeyword} implementation`;
    } else if (heading.toLowerCase().includes('business') || heading.toLowerCase().includes('startup')) {
      imageUrl = 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80';
      imageDescription = `Entrepreneur working on laptop with business planning materials`;
      caption = `Building a successful online business with ${primaryKeyword}`;
    } else if (heading.toLowerCase().includes('passive')) {
      imageUrl = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80';
      imageDescription = `Person working remotely on laptop showing passive income streams`;
      caption = `Creating passive income through ${primaryKeyword} strategies`;
    } else {
      imageUrl = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80';
      imageDescription = `Clean workspace setup showing ${primaryKeyword} workflow and tools`;
      caption = `Professional setup for successful ${primaryKeyword} implementation`;
    }
  } else {
    // Default fallback images for other categories
    imageUrl = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80';
    imageDescription = `Professional illustration of ${heading.toLowerCase()} concepts`;
    caption = `Visual representation of ${heading.toLowerCase()}`;
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
  slug: string
): VisualContent {
  let url = '';
  let description = '';
  let caption = '';
  
  if (topicCategory === 'meal-planning') {
    url = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80';
    description = `Infographic showing key statistics and tips for ${heading.toLowerCase()}`;
    caption = `Key facts and actionable tips for ${heading.toLowerCase()} - save money while eating healthy`;
  } else if (topicCategory === 'health-fitness') {
    url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80';
    description = `Health infographic with statistics and benefits of ${heading.toLowerCase()}`;
    caption = `Research-backed benefits and implementation guide for ${heading.toLowerCase()}`;
  } else if (topicCategory === 'marketing') {
    url = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80';
    description = `Marketing strategy infographic showing ${primaryKeyword} process flow`;
    caption = `Step-by-step guide to implementing ${primaryKeyword} strategies effectively`;
  } else if (topicCategory === 'online-income') {
    url = 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80';
    description = `Income strategy infographic showing potential earnings and methods for ${primaryKeyword}`;
    caption = `Realistic earning potential and proven methods for ${primaryKeyword}`;
  } else {
    url = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80';
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
  slug: string
): VisualContent {
  let url = '';
  let description = '';
  let caption = '';
  
  if (topicCategory === 'meal-planning') {
    url = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80';
    description = `Cost comparison chart showing price differences for ${heading.toLowerCase()}`;
    caption = `Cost analysis comparing different approaches to ${heading.toLowerCase()}`;
  } else if (topicCategory === 'health-fitness') {
    url = 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=80';
    description = `Progress tracking chart showing ${primaryKeyword} improvement over time`;
    caption = `Typical progress timeline for ${primaryKeyword} implementation`;
  } else if (topicCategory === 'marketing') {
    url = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80';
    description = `Performance metrics chart for ${primaryKeyword} campaigns`;
    caption = `Key performance indicators and benchmarks for ${primaryKeyword}`;
  } else if (topicCategory === 'online-income') {
    url = 'https://images.unsplash.com/photo-1554224154-26032fced8bd?w=800&q=80';
    description = `Earnings potential chart showing income progression with ${primaryKeyword}`;
    caption = `Income growth timeline and earning potential with ${primaryKeyword}`;
  } else {
    url = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80';
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

function generateDiagram(heading: string, primaryKeyword: string, slug: string): VisualContent {
  return {
    type: 'diagram',
    url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80',
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
