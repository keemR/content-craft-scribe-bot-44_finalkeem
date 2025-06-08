
import { generateEnhancedVisuals, formatEnhancedVisualsForMarkdown } from './enhancedVisualGenerator';
import { slugify } from '../helpers';

interface GenericContentOptions {
  primaryKeyword: string;
  semanticKeywords: string[];
  serpData: any;
  researchData: string;
  articleLength: number;
  tone: string;
  includeImages: boolean;
  includeFAQs: boolean;
  topicCategory: string;
}

export async function generateGenericContent(options: GenericContentOptions): Promise<string> {
  const {
    primaryKeyword,
    semanticKeywords,
    serpData,
    researchData,
    articleLength,
    tone,
    includeImages,
    includeFAQs,
    topicCategory
  } = options;

  const currentYear = new Date().getFullYear();
  const title = createGenericTitle(primaryKeyword, currentYear);
  const estimatedReadingTime = Math.ceil(articleLength / 250);
  
  let content = `# ${title}\n\n`;
  
  // Add credibility signals
  const publishDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  content += `*Last Updated: ${publishDate} | ${estimatedReadingTime}-minute read | Expert analysis and insights*\n\n`;
  
  // Generic summary
  content += generateGenericSummary(primaryKeyword, serpData, semanticKeywords[0]) + "\n\n";
  
  // Quick facts
  content += generateGenericQuickFacts(primaryKeyword, serpData) + "\n\n";
  
  // Introduction
  content += generateGenericIntroduction(primaryKeyword, serpData, semanticKeywords[0]) + "\n\n";
  
  // Generate topic-appropriate headings
  const headings = generateGenericHeadings(primaryKeyword, topicCategory);
  
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
    
    content += generateGenericSectionContent(
      heading, 
      primaryKeyword, 
      serpData, 
      semanticKeywords[index % semanticKeywords.length] || semanticKeywords[0],
      sectionLength,
      index,
      topicCategory
    ) + "\n\n";
    
    // Add relevant visuals
    if (includeImages && index < 3) {
      const visuals = generateEnhancedVisuals(heading, primaryKeyword, topicCategory, index);
      const visualsMarkdown = formatEnhancedVisualsForMarkdown(visuals);
      if (visualsMarkdown) {
        content += visualsMarkdown + "\n\n";
      }
    }
    
    if (index < headings.length - 1) {
      content += "---\n\n";
    }
  });

  // FAQ section
  if (includeFAQs) {
    content += "## Frequently Asked Questions\n\n";
    content += generateGenericFAQs(primaryKeyword, serpData, topicCategory) + "\n\n";
  }

  // Conclusion
  content += "## Key Insights\n\n";
  content += generateGenericConclusion(primaryKeyword, serpData, semanticKeywords[0]) + "\n\n";
  
  return content;
}

function createGenericTitle(keyword: string, year: number): string {
  if (keyword.toLowerCase().includes('guide')) {
    return `${keyword}: Complete Expert Guide (${year})`;
  }
  
  if (keyword.toLowerCase().includes('tips') || keyword.toLowerCase().includes('advice')) {
    return `${keyword}: Expert Tips and Strategies (${year})`;
  }
  
  if (keyword.toLowerCase().includes('best') || keyword.toLowerCase().includes('top')) {
    return `${keyword}: Comprehensive Analysis (${year})`;
  }
  
  return `${keyword}: Expert Guide with Proven Strategies (${year})`;
}

function generateGenericSummary(keyword: string, serpData: any, semanticKeyword: string): string {
  const keyStats = serpData.keyStatistics.slice(0, 2);
  
  let summary = `## Quick Answer\n\n`;
  summary += `**Understanding ${keyword}** requires evidence-based knowledge and strategic thinking. `;
  
  if (keyStats[0]) {
    summary += `Current research shows ${keyStats[0].toLowerCase()}. `;
  }
  
  summary += `This comprehensive guide provides practical insights and actionable strategies.\n\n`;
  
  summary += `**🎯 Key Points:**\n`;
  summary += `- Evidence-based approach essential for success\n`;
  summary += `- Strategic planning improves outcomes significantly\n`;
  summary += `- Professional guidance enhances implementation\n`;
  summary += `- Continuous optimization drives better results\n`;
  summary += `- Long-term perspective ensures sustainability`;
  
  return summary;
}

function generateGenericQuickFacts(keyword: string, serpData: any): string {
  const stats = serpData.keyStatistics.slice(0, 4);
  
  let factsBox = `> **💡 Quick Facts:**\n>\n`;
  
  if (stats.length > 0) {
    stats.forEach((stat: string, index: number) => {
      if (stat && index < 4) {
        factsBox += `> • ${stat}\n`;
      }
    });
  } else {
    factsBox += `> • Evidence-based approaches improve success rates\n`;
    factsBox += `> • Strategic planning reduces implementation risks\n`;
    factsBox += `> • Professional guidance accelerates results\n`;
    factsBox += `> • Continuous learning enhances expertise\n`;
  }
  
  return factsBox;
}

function generateGenericIntroduction(keyword: string, serpData: any, semanticKeyword: string): string {
  const keyStatistic = serpData.keyStatistics[0];
  
  let intro = `Understanding **${keyword}** is increasingly important in today's complex environment. `;
  
  if (keyStatistic) {
    intro += `Recent analysis reveals that ${keyStatistic.toLowerCase()}, making comprehensive knowledge essential for informed decision-making.\n\n`;
  }
  
  intro += `${semanticKeyword || 'This topic'} requires a systematic approach that combines theoretical understanding with practical application. This comprehensive guide examines current research, expert recommendations, and proven strategies that successful practitioners use to achieve their objectives.\n\n`;
  
  intro += `Whether you're new to this subject or looking to enhance your existing knowledge, understanding these principles will help you make informed decisions and implement effective strategies that deliver measurable results.`;
  
  return intro;
}

function generateGenericHeadings(keyword: string, topicCategory: string): string[] {
  // Customize headings based on topic category
  switch (topicCategory) {
    case 'finance':
      return [
        `Understanding ${keyword} Fundamentals`,
        'Financial Planning and Strategy',
        'Risk Assessment and Management',
        'Investment Considerations',
        'Tax Implications and Optimization',
        'Professional Financial Guidance',
        'Implementation Timeline',
        'Monitoring and Adjustment Strategies'
      ];
      
    case 'education':
      return [
        `${keyword} Learning Fundamentals`,
        'Educational Approaches and Methods',
        'Skill Development Strategies',
        'Resource Requirements and Tools',
        'Progress Tracking and Assessment',
        'Common Challenges and Solutions',
        'Advanced Techniques and Concepts',
        'Continuing Education and Growth'
      ];
      
    case 'lifestyle':
      return [
        `Understanding ${keyword} Basics`,
        'Getting Started: First Steps',
        'Essential Tools and Resources',
        'Daily Implementation Strategies',
        'Overcoming Common Obstacles',
        'Advanced Tips and Techniques',
        'Measuring Progress and Success',
        'Long-term Sustainability'
      ];
      
    default:
      return [
        `Understanding ${keyword}`,
        'Key Principles and Concepts',
        'Getting Started: Essential Steps',
        'Strategic Planning and Preparation',
        'Implementation Best Practices',
        'Common Challenges and Solutions',
        'Advanced Strategies and Techniques',
        'Measuring Success and Optimization'
      ];
  }
}

function generateGenericSectionContent(
  heading: string,
  keyword: string,
  serpData: any,
  semanticKeyword: string,
  targetLength: number,
  index: number,
  topicCategory: string
): string {
  const relevantStat = serpData.keyStatistics[index] || serpData.keyStatistics[0];
  
  let content = "";
  
  if (relevantStat) {
    content += `Research indicates that ${relevantStat.toLowerCase()}. This finding highlights the importance of understanding ${heading.toLowerCase()} in the context of ${semanticKeyword}.\n\n`;
  }
  
  content += `### Strategic Framework\n\n`;
  content += `**Evidence-Based Approach**: Successful implementation of ${heading.toLowerCase()} relies on proven methodologies and established best practices. This systematic approach reduces risk and improves success rates.\n\n`;
  
  content += `**Individual Assessment**: Personal circumstances significantly influence ${semanticKeyword} outcomes. Factors such as current situation, available resources, and specific objectives all play important roles in strategy development.\n\n`;
  
  content += `**Professional Guidance**: Expert consultation enhances success rates and helps avoid common pitfalls. Professionals bring experience, specialized knowledge, and objective perspective to the planning process.\n\n`;
  
  content += `**Continuous Optimization**: Regular assessment and adjustment ensure strategies remain effective and aligned with changing circumstances and objectives.\n\n`;
  
  content += `### Implementation Strategies\n\n`;
  content += `1. **Comprehensive Planning**: Develop detailed strategies with clear objectives and timelines\n`;
  content += `2. **Resource Allocation**: Ensure adequate resources are available for successful implementation\n`;
  content += `3. **Progress Monitoring**: Track key metrics and milestones to measure success\n`;
  content += `4. **Adaptive Management**: Adjust strategies based on results and changing circumstances\n`;
  content += `5. **Knowledge Building**: Continuously learn and improve understanding of best practices\n\n`;
  
  content += `Understanding these fundamentals helps you make informed decisions about ${semanticKeyword} and develop effective strategies tailored to your specific needs and circumstances.`;
  
  return content;
}

function generateGenericFAQs(keyword: string, serpData: any, topicCategory: string): string {
  let faqs = "";
  
  // Generate topic-appropriate FAQs
  faqs += `### How do I get started with ${keyword}?\n\n`;
  faqs += `Begin with thorough research and understanding of fundamental concepts. Identify your specific objectives, assess available resources, and develop a strategic plan with clear milestones and timelines.\n\n`;
  
  faqs += `### What are the most important factors for success?\n\n`;
  faqs += `Success typically depends on proper planning, adequate resources, consistent implementation, and willingness to adapt strategies based on results. Professional guidance often accelerates progress.\n\n`;
  
  faqs += `### How long does it typically take to see results?\n\n`;
  faqs += `Timeline varies significantly based on complexity, resources, and individual circumstances. Most people see initial progress within weeks to months, with significant results typically emerging over longer periods.\n\n`;
  
  faqs += `### What are common mistakes to avoid?\n\n`;
  faqs += `Common mistakes include insufficient planning, unrealistic expectations, inadequate resource allocation, and failure to monitor progress. Proper preparation and realistic goal-setting prevent most issues.\n\n`;
  
  faqs += `### When should I seek professional help?\n\n`;
  faqs += `Consider professional consultation when dealing with complex situations, significant investments, legal implications, or when progress stalls despite consistent effort. Expert guidance often provides valuable perspective and solutions.\n\n`;
  
  return faqs;
}

function generateGenericConclusion(keyword: string, serpData: any, semanticKeyword: string): string {
  const keyStatistic = serpData.keyStatistics[0];
  
  let conclusion = `Understanding ${semanticKeyword || keyword} empowers you to make informed decisions and implement effective strategies. Success requires combining knowledge with systematic action and continuous improvement.\n\n`;
  
  if (keyStatistic) {
    conclusion += `**Key Insight**: ${keyStatistic} This finding emphasizes the importance of staying informed and taking strategic action based on current research and best practices.\n\n`;
  }
  
  conclusion += `**Action Plan for Success:**\n\n`;
  conclusion += `1. **Educate Yourself**: Continue learning about evidence-based approaches and best practices\n`;
  conclusion += `2. **Assess Your Situation**: Identify personal circumstances, resources, and objectives\n`;
  conclusion += `3. **Develop Strategy**: Create comprehensive plan with clear goals and timelines\n`;
  conclusion += `4. **Implement Systematically**: Execute strategies with regular monitoring and adjustment\n`;
  conclusion += `5. **Seek Guidance**: Consult professionals when appropriate for specialized expertise\n\n`;
  
  conclusion += `**Final Thoughts**: Success in any endeavor requires patience, persistence, and adaptability. The information in this guide represents current understanding and proven approaches, but individual results may vary based on specific circumstances.\n\n`;
  
  conclusion += `Stay committed to continuous learning and improvement, and remember that small, consistent actions often yield the most significant long-term results.`;
  
  return conclusion;
}
