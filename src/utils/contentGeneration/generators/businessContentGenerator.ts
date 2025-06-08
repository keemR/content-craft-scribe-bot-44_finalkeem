
import { generateEnhancedVisuals, formatEnhancedVisualsForMarkdown } from './enhancedVisualGenerator';
import { slugify } from '../helpers';

interface BusinessContentOptions {
  primaryKeyword: string;
  semanticKeywords: string[];
  serpData: any;
  researchData: string;
  articleLength: number;
  tone: string;
  includeImages: boolean;
  includeFAQs: boolean;
}

export async function generateBusinessContent(options: BusinessContentOptions): Promise<string> {
  const {
    primaryKeyword,
    semanticKeywords,
    serpData,
    researchData,
    articleLength,
    tone,
    includeImages,
    includeFAQs
  } = options;

  const currentYear = new Date().getFullYear();
  const title = createBusinessTitle(primaryKeyword, currentYear);
  const estimatedReadingTime = Math.ceil(articleLength / 250);
  
  let content = `# ${title}\n\n`;
  
  // Add credibility signals
  const publishDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  content += `*Last Updated: ${publishDate} | ${estimatedReadingTime}-minute read | Expert business analysis*\n\n`;
  
  // Business summary
  content += generateBusinessSummary(primaryKeyword, serpData, semanticKeywords[0]) + "\n\n";
  
  // Business facts
  content += generateBusinessQuickFacts(primaryKeyword, serpData) + "\n\n";
  
  // Business introduction
  content += generateBusinessIntroduction(primaryKeyword, serpData, semanticKeywords[0]) + "\n\n";
  
  // Generate business-focused headings
  const headings = generateBusinessHeadings(primaryKeyword);
  
  // Table of contents
  content += "## Table of Contents\n\n";
  headings.forEach((heading, index) => {
    const slug = slugify(heading);
    content += `${index + 1}. [${heading}](#${slug})\n`;
  });
  content += "\n\n";
  
  // Generate sections
  const sectionLength = Math.floor(articleLength / headings.length);
  
  headings.forEach((heading, index) => {
    content += `## ${heading}\n\n`;
    
    content += generateBusinessSectionContent(
      heading, 
      primaryKeyword, 
      serpData, 
      semanticKeywords[index % semanticKeywords.length] || semanticKeywords[0],
      sectionLength,
      index
    ) + "\n\n";
    
    // Add relevant visuals
    if (includeImages && index < 3) {
      const visuals = generateEnhancedVisuals(heading, primaryKeyword, 'business', index);
      const visualsMarkdown = formatEnhancedVisualsForMarkdown(visuals);
      if (visualsMarkdown) {
        content += visualsMarkdown + "\n\n";
      }
    }
    
    if (index < headings.length - 1) {
      content += "---\n\n";
    }
  });

  // Business FAQ section
  if (includeFAQs) {
    content += "## Frequently Asked Questions\n\n";
    content += generateBusinessFAQs(primaryKeyword, serpData) + "\n\n";
  }

  // Business conclusion
  content += "## Key Business Takeaways\n\n";
  content += generateBusinessConclusion(primaryKeyword, serpData, semanticKeywords[0]) + "\n\n";
  
  return content;
}

function createBusinessTitle(keyword: string, year: number): string {
  if (keyword.toLowerCase().includes('marketing')) {
    return `${keyword}: Complete Marketing Strategy Guide (${year})`;
  }
  
  if (keyword.toLowerCase().includes('startup')) {
    return `${keyword}: Entrepreneur's Startup Guide (${year})`;
  }
  
  if (keyword.toLowerCase().includes('business')) {
    return `${keyword}: Strategic Business Guide (${year})`;
  }
  
  return `${keyword}: Professional Business Strategy (${year})`;
}

function generateBusinessSummary(keyword: string, serpData: any, semanticKeyword: string): string {
  const keyStats = serpData.keyStatistics.slice(0, 2);
  
  let summary = `## Executive Summary\n\n`;
  summary += `**Understanding ${keyword}** requires strategic business thinking and practical implementation. `;
  
  if (keyStats[0]) {
    summary += `Current market research shows ${keyStats[0].toLowerCase()}. `;
  }
  
  summary += `This comprehensive guide provides actionable strategies and proven methodologies.\n\n`;
  
  summary += `**🎯 Key Business Points:**\n`;
  summary += `- Strategic planning essential for success\n`;
  summary += `- Market research drives informed decisions\n`;
  summary += `- Implementation requires systematic approach\n`;
  summary += `- Continuous optimization improves results\n`;
  summary += `- Professional guidance accelerates growth`;
  
  return summary;
}

function generateBusinessQuickFacts(keyword: string, serpData: any): string {
  const stats = serpData.keyStatistics.slice(0, 4);
  
  let factsBox = `> **💼 Business Facts:**\n>\n`;
  
  if (keyword.toLowerCase().includes('marketing')) {
    factsBox += `> • **ROI Average:** 4:1 for email marketing\n`;
    factsBox += `> • **Content Marketing:** 3x more leads than traditional\n`;
    factsBox += `> • **Digital Spending:** 54% of marketing budgets\n`;
    factsBox += `> • **Customer Acquisition:** Content costs 62% less\n`;
  } else if (keyword.toLowerCase().includes('startup')) {
    factsBox += `> • **Success Rate:** 10% of startups succeed long-term\n`;
    factsBox += `> • **Funding:** 77% use personal savings initially\n`;
    factsBox += `> • **Time to Profitability:** 2-3 years average\n`;
    factsBox += `> • **Market Research:** Critical for 70% of successes\n`;
  } else {
    stats.forEach((stat: string, index: number) => {
      if (stat && index < 4) {
        factsBox += `> • ${stat}\n`;
      }
    });
  }
  
  return factsBox;
}

function generateBusinessIntroduction(keyword: string, serpData: any, semanticKeyword: string): string {
  const keyStatistic = serpData.keyStatistics[0];
  
  let intro = `In today's competitive business landscape, understanding **${keyword}** is essential for sustainable success. `;
  
  if (keyStatistic) {
    intro += `Recent market analysis reveals that ${keyStatistic.toLowerCase()}, making strategic knowledge crucial for business growth.\n\n`;
  }
  
  intro += `${semanticKeyword || 'Business strategy'} requires a systematic approach that combines market research, strategic planning, and effective execution. This comprehensive guide examines proven methodologies, industry best practices, and actionable strategies that successful businesses use to achieve their objectives.\n\n`;
  
  intro += `Whether you're an entrepreneur, business owner, or strategic planner, understanding these principles will help you make informed decisions and implement effective strategies that drive measurable results.`;
  
  return intro;
}

function generateBusinessHeadings(keyword: string): string[] {
  if (keyword.toLowerCase().includes('marketing')) {
    return [
      'Understanding Modern Marketing Fundamentals',
      'Market Research and Audience Analysis',
      'Strategic Marketing Planning',
      'Digital Marketing Channels and Tactics',
      'Content Marketing and Brand Building',
      'Measuring ROI and Performance Metrics',
      'Budget Allocation and Resource Management',
      'Future Marketing Trends and Opportunities'
    ];
  }
  
  if (keyword.toLowerCase().includes('startup')) {
    return [
      'Startup Fundamentals and Business Planning',
      'Market Validation and Customer Research',
      'Business Model Development',
      'Funding Options and Financial Planning',
      'Team Building and Organizational Structure',
      'Product Development and MVP Strategy',
      'Marketing and Customer Acquisition',
      'Scaling and Growth Strategies'
    ];
  }
  
  // Generic business headings
  return [
    `Understanding ${keyword} Fundamentals`,
    'Strategic Planning and Goal Setting',
    'Market Analysis and Competitive Research',
    'Implementation Strategies and Tactics',
    'Resource Management and Budgeting',
    'Performance Measurement and Analytics',
    'Risk Management and Mitigation',
    'Growth and Scaling Opportunities'
  ];
}

function generateBusinessSectionContent(
  heading: string,
  keyword: string,
  serpData: any,
  semanticKeyword: string,
  targetLength: number,
  index: number
): string {
  const relevantStat = serpData.keyStatistics[index] || serpData.keyStatistics[0];
  
  let content = "";
  
  if (relevantStat) {
    content += `Market research indicates that ${relevantStat.toLowerCase()}. This finding highlights the strategic importance of ${heading.toLowerCase()} in ${semanticKeyword} development.\n\n`;
  }
  
  content += `### Strategic Framework\n\n`;
  content += `**Market-Driven Approach**: Successful businesses base their ${heading.toLowerCase()} strategies on comprehensive market research and customer insights. This data-driven approach reduces risk and improves success rates.\n\n`;
  
  content += `**Systematic Implementation**: Effective ${semanticKeyword} requires structured implementation with clear milestones, measurable objectives, and regular performance reviews.\n\n`;
  
  content += `**Competitive Advantage**: Understanding industry dynamics and competitive landscape helps identify opportunities for differentiation and market positioning.\n\n`;
  
  content += `**Resource Optimization**: Strategic resource allocation ensures maximum return on investment while maintaining operational efficiency and growth potential.\n\n`;
  
  content += `### Best Practices\n\n`;
  content += `1. **Comprehensive Planning**: Develop detailed strategies with clear timelines and deliverables\n`;
  content += `2. **Regular Assessment**: Monitor performance metrics and adjust strategies based on results\n`;
  content += `3. **Stakeholder Alignment**: Ensure all team members understand objectives and their roles\n`;
  content += `4. **Continuous Learning**: Stay updated on industry trends and emerging best practices\n\n`;
  
  content += `These proven approaches help businesses successfully implement ${semanticKeyword} strategies that drive sustainable growth and competitive advantage.`;
  
  return content;
}

function generateBusinessFAQs(keyword: string, serpData: any): string {
  let faqs = "";
  
  if (keyword.toLowerCase().includes('marketing')) {
    faqs += `### What's the most effective marketing strategy for small businesses?\n\n`;
    faqs += `Content marketing and email marketing typically provide the highest ROI for small businesses, with email marketing averaging a 4:1 return on investment. Focus on building relationships with your audience through valuable content.\n\n`;
    
    faqs += `### How much should I budget for marketing?\n\n`;
    faqs += `Most businesses allocate 7-8% of revenue to marketing, with new businesses often investing 12-20% to establish market presence. The exact percentage depends on industry, competition, and growth objectives.\n\n`;
  } else if (keyword.toLowerCase().includes('startup')) {
    faqs += `### What's the most important factor for startup success?\n\n`;
    faqs += `Market validation is crucial - 42% of startups fail because there's no market need for their product. Validate your business idea through customer research before significant investment.\n\n`;
    
    faqs += `### How long does it take for a startup to become profitable?\n\n`;
    faqs += `Most successful startups achieve profitability within 2-3 years, though this varies significantly by industry. Technology startups often take longer but may scale faster once profitable.\n\n`;
  } else {
    faqs += `### How do I get started with ${keyword}?\n\n`;
    faqs += `Begin with thorough research and strategic planning. Understand your market, define clear objectives, and develop a systematic implementation plan with measurable milestones.\n\n`;
    
    faqs += `### What are common mistakes to avoid?\n\n`;
    faqs += `The most common mistakes include insufficient market research, unclear objectives, inadequate resource planning, and lack of performance measurement. Proper planning prevents most issues.\n\n`;
  }
  
  return faqs;
}

function generateBusinessConclusion(keyword: string, serpData: any, semanticKeyword: string): string {
  const keyStatistic = serpData.keyStatistics[0];
  
  let conclusion = `Mastering ${semanticKeyword || keyword} requires strategic thinking, systematic implementation, and continuous optimization. Success in today's business environment demands evidence-based decision-making and adaptability.\n\n`;
  
  if (keyStatistic) {
    conclusion += `**Key Market Insight**: ${keyStatistic} This data emphasizes the importance of staying informed and implementing proven strategies for competitive advantage.\n\n`;
  }
  
  conclusion += `**Strategic Action Plan:**\n\n`;
  conclusion += `1. **Conduct Market Research**: Understand your industry, competitors, and customer needs\n`;
  conclusion += `2. **Develop Strategic Plan**: Create detailed implementation roadmap with clear objectives\n`;
  conclusion += `3. **Allocate Resources**: Ensure adequate budget and personnel for successful execution\n`;
  conclusion += `4. **Implement Systematically**: Execute strategies with regular monitoring and adjustment\n`;
  conclusion += `5. **Measure and Optimize**: Track performance metrics and continuously improve approaches\n\n`;
  
  conclusion += `**Success Principles**: The most successful businesses combine strategic planning with agile execution, always staying responsive to market changes while maintaining focus on core objectives.\n\n`;
  
  conclusion += `Remember that business success is built on consistent execution of proven strategies, continuous learning, and adaptation to changing market conditions.`;
  
  return conclusion;
}
