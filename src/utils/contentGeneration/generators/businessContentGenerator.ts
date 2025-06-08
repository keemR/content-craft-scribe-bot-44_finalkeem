
import { generateEnhancedVisuals, formatEnhancedVisualsForMarkdown } from './enhancedVisualGenerator';
import { fillContentGaps } from './contentGapFiller';
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
  targetAudience?: string;
}

export async function generateBusinessContentWithVariation(options: BusinessContentOptions): Promise<string> {
  const {
    primaryKeyword,
    semanticKeywords,
    serpData,
    researchData,
    articleLength,
    tone,
    includeImages,
    includeFAQs,
    targetAudience
  } = options;

  const currentYear = new Date().getFullYear();
  const title = createBusinessTitle(primaryKeyword, currentYear);
  const estimatedReadingTime = Math.ceil(articleLength / 250);
  
  let content = `# ${title}\n\n`;
  
  // Add business credibility signals
  const publishDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  content += `*Last Updated: ${publishDate} | ${estimatedReadingTime}-minute read | Strategic business analysis and actionable insights*\n\n`;
  
  // Business overview with ROI focus
  content += generateBusinessSummary(primaryKeyword, serpData, semanticKeywords[0]) + "\n\n";
  
  // Business metrics box
  content += generateBusinessMetricsBox(primaryKeyword, serpData) + "\n\n";
  
  // Strategic introduction
  content += generateBusinessIntroduction(primaryKeyword, serpData, semanticKeywords[0], targetAudience) + "\n\n";
  
  // Generate business-focused headings
  const headings = generateBusinessHeadings(primaryKeyword);
  
  // Table of contents
  content += "## Table of Contents\n\n";
  headings.forEach((heading, index) => {
    const slug = slugify(heading);
    content += `${index + 1}. [${heading}](#${slug})\n`;
  });
  content += "\n\n";
  
  // Generate unique sections
  const sectionLength = Math.floor(articleLength / headings.length);
  
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    const semanticVariation = semanticKeywords[i % semanticKeywords.length];
    
    content += `## ${heading}\n\n`;
    
    content += await generateUniqueBusinessSection(
      heading, 
      primaryKeyword, 
      semanticVariation,
      serpData, 
      sectionLength,
      i
    ) + "\n\n";
    
    // Add relevant business visuals
    if (includeImages && i < 3) {
      const visuals = generateEnhancedVisuals(heading, primaryKeyword, 'business', i);
      const visualsMarkdown = formatEnhancedVisualsForMarkdown(visuals);
      if (visualsMarkdown) {
        content += visualsMarkdown + "\n\n";
      }
    }
    
    if (i < headings.length - 1) {
      content += "---\n\n";
    }
  }

  // Business FAQ section
  if (includeFAQs) {
    content += "## Frequently Asked Questions\n\n";
    content += generateBusinessFAQs(primaryKeyword, serpData, targetAudience) + "\n\n";
  }

  // Business conclusion
  content += "## Strategic Takeaways\n\n";
  content += generateBusinessConclusion(primaryKeyword, serpData, semanticKeywords[0]) + "\n\n";
  
  return content;
}

function createBusinessTitle(keyword: string, year: number): string {
  if (keyword.toLowerCase().includes('make money online')) {
    return `Make Money Online: Complete Business Strategy Guide (${year})`;
  }
  
  if (keyword.toLowerCase().includes('marketing')) {
    return `${keyword}: Strategic Marketing Implementation Guide (${year})`;
  }
  
  return `${keyword}: Business Success Framework (${year})`;
}

function generateBusinessSummary(keyword: string, serpData: any, semanticKeyword: string): string {
  const keyStats = serpData.keyStatistics.slice(0, 2);
  
  let summary = `## Executive Summary\n\n`;
  summary += `**Mastering ${keyword}** requires strategic thinking, systematic execution, and data-driven decision making. `;
  
  if (keyStats[0]) {
    summary += `Market analysis shows that ${keyStats[0].toLowerCase()}, highlighting the competitive advantage of professional approaches. `;
  }
  
  summary += `This comprehensive business guide combines industry insights with proven implementation frameworks.\n\n`;
  
  summary += `**💼 Business Highlights:**\n`;
  summary += `- ROI-focused strategies with measurable outcomes\n`;
  summary += `- Risk assessment and mitigation frameworks\n`;
  summary += `- Scalable implementation methodologies\n`;
  summary += `- Competitive analysis and market positioning\n`;
  summary += `- Performance metrics and optimization strategies`;
  
  return summary;
}

function generateBusinessMetricsBox(keyword: string, serpData: any): string {
  const stats = serpData.keyStatistics.slice(0, 4);
  
  let metricsBox = `> **📈 Business Metrics:**\n>\n`;
  
  if (keyword.toLowerCase().includes('make money online')) {
    metricsBox += `> • **Success Rate:** 15-20% achieve sustainable income within 12 months\n`;
    metricsBox += `> • **Average Timeline:** 6-12 months to reach $1,000+ monthly\n`;
    metricsBox += `> • **Investment Required:** $200-2,000 initial setup costs\n`;
    metricsBox += `> • **Failure Rate:** 60% quit within first 6 months\n`;
  } else if (keyword.toLowerCase().includes('marketing')) {
    metricsBox += `> • **ROI Range:** 300-500% for well-executed campaigns\n`;
    metricsBox += `> • **Budget Allocation:** 7-12% of revenue for most businesses\n`;
    metricsBox += `> • **Success Timeline:** 3-6 months for meaningful results\n`;
    metricsBox += `> • **Conversion Rates:** 2-5% average across industries\n`;
  } else {
    stats.forEach((stat: string) => {
      if (stat) {
        metricsBox += `> • ${stat}\n`;
      }
    });
  }
  
  return metricsBox;
}

function generateBusinessIntroduction(keyword: string, serpData: any, semanticKeyword: string, targetAudience?: string): string {
  const keyStatistic = serpData.keyStatistics[0];
  
  let intro = `In today's competitive business landscape, success with **${keyword}** demands more than basic knowledge—it requires strategic thinking, systematic execution, and continuous optimization. `;
  
  if (keyStatistic) {
    intro += `Market research reveals that ${keyStatistic.toLowerCase()}, emphasizing the critical importance of professional approaches over amateur attempts.\n\n`;
  }
  
  intro += `${semanticKeyword || 'Effective business strategy'} combines market intelligence, competitive analysis, and proven implementation frameworks. This guide examines real-world applications, common pitfalls, and strategies that consistently deliver measurable results.\n\n`;
  
  if (targetAudience === 'small business') {
    intro += `Whether you're launching a new venture or scaling existing operations, understanding these business principles will help you make informed decisions, allocate resources effectively, and achieve sustainable growth.`;
  } else {
    intro += `From initial planning through full implementation, this strategic approach will help you navigate market complexities, minimize risks, and maximize return on investment.`;
  }
  
  return intro;
}

function generateBusinessHeadings(keyword: string): string[] {
  if (keyword.toLowerCase().includes('make money online')) {
    return [
      'Business Model Analysis: Choosing the Right Online Revenue Stream',
      'Market Research and Niche Validation',
      'Setting Up Professional Systems and Infrastructure',
      'Customer Acquisition and Lead Generation',
      'Revenue Optimization and Scaling Strategies',
      'Risk Management and Financial Planning',
      'Legal Considerations and Business Protection',
      'Long-Term Growth and Exit Strategies'
    ];
  }
  
  if (keyword.toLowerCase().includes('marketing')) {
    return [
      'Strategic Marketing Framework and Planning',
      'Target Audience Analysis and Segmentation',
      'Channel Selection and Media Planning',
      'Content Strategy and Message Development',
      'Campaign Implementation and Management',
      'Performance Measurement and Analytics',
      'Budget Allocation and ROI Optimization',
      'Advanced Tactics and Future Trends'
    ];
  }
  
  // Generic business headings
  return [
    `${keyword} Business Strategy and Planning`,
    'Market Analysis and Competitive Intelligence',
    'Implementation Framework and Timeline',
    'Resource Allocation and Budget Planning',
    'Performance Metrics and KPI Tracking',
    'Risk Assessment and Mitigation',
    'Scaling Strategies and Growth Planning',
    'Optimization and Continuous Improvement'
  ];
}

async function generateUniqueBusinessSection(
  heading: string,
  primaryKeyword: string,
  semanticKeyword: string,
  serpData: any,
  targetLength: number,
  sectionIndex: number
): Promise<string> {
  const relevantStat = serpData.keyStatistics[sectionIndex] || serpData.keyStatistics[0];
  
  let content = "";
  
  if (heading.includes('Business Model') || heading.includes('Revenue Stream')) {
    content += `Selecting the right business model forms the foundation of any successful ${semanticKeyword} venture. `;
    
    if (relevantStat) {
      content += `Industry analysis shows that ${relevantStat.toLowerCase()}, providing clear guidance for model selection.\n\n`;
    }
    
    content += `### Revenue Model Comparison\n\n`;
    content += `**Service-Based Models (Consulting, Freelancing, Coaching)**\n`;
    content += `- **Time to Revenue**: 2-8 weeks\n`;
    content += `- **Startup Costs**: $200-1,000\n`;
    content += `- **Scaling Potential**: Limited by time\n`;
    content += `- **Success Rate**: 45-60% achieve sustainable income\n`;
    content += `- **Best For**: Individuals with existing expertise\n\n`;
    
    content += `**Product-Based Models (Digital Products, Software, Courses)**\n`;
    content += `- **Time to Revenue**: 3-6 months\n`;
    content += `- **Startup Costs**: $1,000-5,000\n`;
    content += `- **Scaling Potential**: High (passive income potential)\n`;
    content += `- **Success Rate**: 20-35% achieve profitability\n`;
    content += `- **Best For**: Those willing to invest time upfront\n\n`;
    
    content += `**Affiliate/Partnership Models**\n`;
    content += `- **Time to Revenue**: 6-12 months\n`;
    content += `- **Startup Costs**: $500-2,000\n`;
    content += `- **Scaling Potential**: Medium (dependent on partners)\n`;
    content += `- **Success Rate**: 15-25% achieve significant income\n`;
    content += `- **Best For**: Strong marketing and relationship skills\n\n`;
    
  } else if (heading.includes('Market Research') || heading.includes('Validation')) {
    content += `Thorough market research prevents costly mistakes and identifies genuine opportunities in ${semanticKeyword}. `;
    
    if (relevantStat) {
      content += `Market intelligence indicates that ${relevantStat.toLowerCase()}, emphasizing validation importance.\n\n`;
    }
    
    content += `### The Validation Framework\n\n`;
    content += `**Step 1: Problem Identification (Week 1)**\n`;
    content += `Use surveys, interviews, and social listening to identify genuine pain points. Target 50+ potential customers for meaningful data. Look for problems people actively seek solutions for and are willing to pay to solve.\n\n`;
    content += `**Step 2: Solution Testing (Week 2-3)**\n`;
    content += `Create minimum viable product (MVP) or landing page to test interest. Measure engagement metrics: email signups, pre-orders, or detailed inquiry rates. A 5%+ conversion rate typically indicates genuine market interest.\n\n`;
    content += `**Step 3: Financial Validation (Week 4)**\n`;
    content += `Test pricing sensitivity and calculate unit economics. Ensure customer acquisition cost (CAC) is less than 1/3 of customer lifetime value (CLV). If numbers don't work at small scale, they won't work at large scale.\n\n`;
    content += `**Step 4: Competitive Analysis (Ongoing)**\n`;
    content += `Analyze direct and indirect competitors for market size, pricing strategies, and positioning gaps. Use tools like SEMrush, Ahrefs, or manual research to understand competitive landscape.\n\n`;
    
  } else if (heading.includes('Customer Acquisition') || heading.includes('Lead Generation')) {
    content += `Sustainable customer acquisition requires systematic approaches that balance cost-effectiveness with scalability in ${semanticKeyword}. `;
    
    if (relevantStat) {
      content += `Customer acquisition data shows that ${relevantStat.toLowerCase()}, informing acquisition strategy development.\n\n`;
    }
    
    content += `### Acquisition Channel Analysis\n\n`;
    content += `**Organic Search (SEO)**\n`;
    content += `- **Timeline**: 6-12 months for meaningful traffic\n`;
    content += `- **Cost**: $500-2,000 monthly for tools and content\n`;
    content += `- **Customer Quality**: High (intent-based traffic)\n`;
    content += `- **Scalability**: Excellent once established\n`;
    content += `- **Best For**: Long-term sustainable growth\n\n`;
    
    content += `**Paid Advertising (PPC, Social)**\n`;
    content += `- **Timeline**: Immediate traffic, 30-90 days for optimization\n`;
    content += `- **Cost**: $1,000-10,000+ monthly ad spend\n`;
    content += `- **Customer Quality**: Variable (depends on targeting)\n`;
    content += `- **Scalability**: High with sufficient budget\n`;
    content += `- **Best For**: Businesses with proven unit economics\n\n`;
    
    content += `**Content Marketing**\n`;
    content += `- **Timeline**: 3-6 months for audience building\n`;
    content += `- **Cost**: $1,000-3,000 monthly for quality content\n`;
    content += `- **Customer Quality**: High (engaged audience)\n`;
    content += `- **Scalability**: Medium (content-dependent)\n`;
    content += `- **Best For**: Authority building and trust development\n\n`;
    
  } else if (heading.includes('Performance') || heading.includes('Analytics')) {
    content += `Effective performance measurement enables data-driven optimization and strategic decision-making in ${semanticKeyword}. `;
    
    if (relevantStat) {
      content += `Performance analytics demonstrate that ${relevantStat.toLowerCase()}, highlighting measurement importance.\n\n`;
    }
    
    content += `### Essential Business Metrics\n\n`;
    content += `**Revenue Metrics**\n`;
    content += `- **Monthly Recurring Revenue (MRR)**: Predictable income streams\n`;
    content += `- **Average Order Value (AOV)**: Revenue per transaction\n`;
    content += `- **Customer Lifetime Value (CLV)**: Total customer worth\n`;
    content += `- **Revenue Growth Rate**: Month-over-month expansion\n\n`;
    
    content += `**Customer Metrics**\n`;
    content += `- **Customer Acquisition Cost (CAC)**: Cost to acquire one customer\n`;
    content += `- **Customer Retention Rate**: Percentage of repeat customers\n`;
    content += `- **Churn Rate**: Percentage of customers lost per period\n`;
    content += `- **Net Promoter Score (NPS)**: Customer satisfaction indicator\n\n`;
    
    content += `**Operational Metrics**\n`;
    content += `- **Conversion Rate**: Visitors to customers percentage\n`;
    content += `- **Lead-to-Customer Rate**: Lead qualification efficiency\n`;
    content += `- **Return on Ad Spend (ROAS)**: Advertising effectiveness\n`;
    content += `- **Profit Margin**: Profitability after all expenses\n\n`;
    
  } else {
    // Generate unique content for other business sections
    content += `This strategic component of ${semanticKeyword} requires systematic analysis and implementation to achieve optimal business results. `;
    
    if (relevantStat) {
      content += `Business intelligence shows that ${relevantStat.toLowerCase()}, providing strategic guidance for implementation.\n\n`;
    }
    
    content += `### Strategic Framework\n\n`;
    content += `**Analysis Phase**: Comprehensive assessment of current position, market conditions, and competitive landscape provides the foundation for strategic decision-making.\n\n`;
    content += `**Planning Phase**: Development of detailed implementation roadmap with clear objectives, resource requirements, and success metrics.\n\n`;
    content += `**Execution Phase**: Systematic implementation with regular monitoring, adjustment, and optimization based on performance data.\n\n`;
    content += `**Optimization Phase**: Continuous improvement through data analysis, testing, and strategic refinement to maximize results.\n\n`;
  }
  
  // Fill business-specific content gaps
  const contentGaps = identifyBusinessContentGaps(heading, primaryKeyword);
  if (contentGaps.length > 0) {
    const gapContent = await fillContentGaps(contentGaps, primaryKeyword, semanticKeyword);
    content += gapContent;
  }
  
  return content;
}

function generateBusinessFAQs(keyword: string, serpData: any, targetAudience?: string): string {
  let faqs = "";
  
  if (keyword.toLowerCase().includes('make money online')) {
    faqs += `### How much money do I need to start an online business successfully?\n\n`;
    faqs += `Most successful online businesses start with $500-2,000 in initial investment, though this varies by model. Service-based businesses (consulting, freelancing) typically require less ($200-500), while product-based businesses need more ($1,000-3,000). The key is starting lean and reinvesting profits rather than borrowing large amounts. Focus your initial budget on: domain and hosting ($100-200), basic tools and software ($200-500), initial marketing ($300-800), and emergency fund for unexpected expenses ($200-500). Avoid expensive "business opportunities" that promise instant success.\n\n`;
    
    faqs += `### What's the realistic timeline to replace a full-time income online?\n\n`;
    faqs += `Most successful online entrepreneurs take 12-24 months to replace a full-time income, with part-time income (25-50% replacement) typically achievable in 6-12 months. However, this assumes 20+ hours weekly commitment and following proven strategies. The timeline varies by: chosen business model (services are faster than products), existing skills and experience, available time investment, market conditions, and quality of execution. About 20% of people achieve meaningful income within 6 months, while 60% either quit or fail to generate significant revenue. Success requires treating it as a real business, not a hobby.\n\n`;
    
    faqs += `### Should I quit my job to focus on my online business full-time?\n\n`;
    faqs += `Only quit your job after your online income consistently exceeds 75% of your current salary for at least 3-6 months. The transition should be strategic: start part-time while employed, build emergency fund (6+ months expenses), achieve consistent monthly revenue, have systems that can run with reduced time investment, and ensure growth trajectory supports your financial needs. Many successful entrepreneurs maintain employment until their online business generates 100-150% of their current income. The financial and psychological pressure of going full-time too early often leads to poor decision-making and business failure.\n\n`;
    
    faqs += `### What are the biggest mistakes that cause online businesses to fail?\n\n`;
    faqs += `The top failure factors are: 1) No market validation - building products nobody wants (40% of failures), 2) Insufficient marketing - great products with no customers (35%), 3) Running out of money - poor financial planning (25%), 4) Wrong pricing strategy - undercharging or overpricing (20%), 5) Inconsistent effort - treating it as a hobby rather than business (30%). Additional factors include: choosing overly competitive markets, focusing on perfectionism over progress, ignoring customer feedback, and lack of business systems. Success requires systematic approach, adequate funding, consistent effort, and willingness to adapt based on market feedback.\n\n`;
    
  } else if (keyword.toLowerCase().includes('marketing')) {
    faqs += `### What's the minimum marketing budget needed to see meaningful results?\n\n`;
    faqs += `For small businesses, allocate 7-12% of gross revenue to marketing, with a minimum of $1,000-2,000 monthly for meaningful digital marketing campaigns. However, budget effectiveness matters more than size. A $1,000 monthly budget focused on one or two channels typically outperforms $5,000 spread across many channels. Start with organic content marketing (requires time more than money) to build foundation, then add paid advertising once you understand your customer acquisition costs and lifetime value. Most successful campaigns need 3-6 months of consistent investment to show significant ROI.\n\n`;
    
    faqs += `### How do I measure marketing ROI and know what's working?\n\n`;
    faqs += `Track these key metrics: Customer Acquisition Cost (CAC) - total marketing spend divided by new customers acquired, Customer Lifetime Value (CLV) - average revenue per customer over their relationship, Return on Ad Spend (ROAS) - revenue generated per dollar spent on advertising, and Attribution tracking - which channels drive conversions. Use tools like Google Analytics, Facebook Pixel, and CRM systems for accurate tracking. Set up conversion tracking from the start, as retroactive analysis is often impossible. The golden rule: CLV should be at least 3x higher than CAC for sustainable growth.\n\n`;
    
  } else {
    // Generic business FAQs
    faqs += `### How long does it typically take to see results from ${keyword}?\n\n`;
    faqs += `Most businesses begin seeing initial results within 30-90 days of consistent implementation, with significant results typically emerging within 6-12 months. The timeline depends on market conditions, competition level, resource investment, and execution quality. Early indicators of success often appear before revenue increases.\n\n`;
    
    faqs += `### What's the most cost-effective way to implement ${keyword} strategies?\n\n`;
    faqs += `Start with proven fundamentals rather than advanced tactics, focus resources on high-impact activities, and reinvest profits for gradual scaling. Most successful implementations follow the 80/20 rule - 80% of results come from 20% of activities. Identify and focus on those critical few activities first.\n\n`;
  }
  
  return faqs;
}

function generateBusinessConclusion(keyword: string, serpData: any, semanticKeyword: string): string {
  const keyStatistic = serpData.keyStatistics[0];
  
  let conclusion = `Success with ${semanticKeyword || keyword} requires combining strategic thinking with disciplined execution, market intelligence with customer focus, and careful planning with adaptive implementation. The businesses that thrive understand that sustainable growth comes from systematic approaches rather than quick fixes or shortcuts.\n\n`;
  
  if (keyStatistic) {
    conclusion += `**Market Reality**: ${keyStatistic} This data emphasizes the importance of professional approaches, adequate preparation, and realistic expectations for business success.\n\n`;
  }
  
  conclusion += `**Your Business Action Plan:**\n\n`;
  conclusion += `1. **Validate First**: Ensure market demand exists before significant investment\n`;
  conclusion += `2. **Start Systematically**: Follow proven frameworks rather than improvising\n`;
  conclusion += `3. **Monitor Performance**: Track key metrics and adjust based on data\n`;
  conclusion += `4. **Scale Strategically**: Grow sustainably while maintaining profitability\n`;
  conclusion += `5. **Stay Adaptable**: Respond to market changes while maintaining core strategy\n\n`;
  
  conclusion += `**Success Principles**: The most successful businesses balance ambition with realism, innovation with proven practices, and growth with sustainability. They understand that building a profitable business takes time, effort, and strategic thinking.\n\n`;
  
  conclusion += `Remember that business success is a marathon, not a sprint. Focus on building solid foundations, serving customers exceptionally well, and continuously improving your approach based on real market feedback and performance data.`;
  
  return conclusion;
}

function identifyBusinessContentGaps(heading: string, keyword: string): string[] {
  const gaps: string[] = [];
  
  if (heading.includes('Advanced') || heading.includes('Optimization')) {
    gaps.push(`advanced_techniques_${keyword.replace(/\s+/g, '_')}`);
  }
  
  if (heading.includes('Case Studies') || heading.includes('Examples')) {
    gaps.push(`real_world_examples_${keyword.replace(/\s+/g, '_')}`);
  }
  
  return gaps;
}
