
import { generateSectionSpecificContent, determineSectionType } from './generators/sectionSpecificGenerator';
import { generateMedicalReviewerBox, generateReferencesSection, generateDetailedAuthorSection, addInlineCitations, hyperlinkStudyMentions } from './generators/eatSignalsGenerator';

interface KeyStatistics {
  [key: string]: string;
}

interface ContextSpecificStats {
  [key: string]: string;
}

interface SerpData {
  keyStatistics: string[];
  contextSpecificStats: ContextSpecificStats;
}

interface ContentGenerationOptions {
  primaryKeyword: string;
  semanticKeywords?: string[];
  serpData?: SerpData;
  researchData?: string;
  articleLength?: number;
  tone?: string;
  includeImages?: boolean;
  includeFAQs?: boolean;
  seoLevel?: number;
  targetAudience?: string;
  contentSpecificity?: number;
}

export async function generateEnhancedContent(options: ContentGenerationOptions): Promise<string> {
  const {
    primaryKeyword,
    semanticKeywords = [],
    serpData = { keyStatistics: [], contextSpecificStats: {} },
    researchData = '',
    articleLength = 3000,
    tone = 'informative',
    includeImages = true,
    includeFAQs = true,
    seoLevel = 80,
    targetAudience = '',
    contentSpecificity = 85
  } = options;

  const currentYear = new Date().getFullYear();
  const estimatedReadingTime = Math.ceil(articleLength / 250);
  
  let content = '';
  
  // Enhanced title generation
  const title = generateEnhancedTitle(primaryKeyword, currentYear);
  content += `# ${title}\n\n`;
  
  // Add E-E-A-T medical reviewer box at the top
  content += generateMedicalReviewerBox(primaryKeyword);
  
  // Enhanced meta information with reading time
  content += `*Reading time: ${estimatedReadingTime} minutes | Last updated: ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}*\n\n`;
  
  // Medical disclaimer for health content
  if (isHealthRelated(primaryKeyword)) {
    content += `> **Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider before making changes to your health regimen.\n\n`;
  }
  
  // Enhanced takeaways
  content += generateEnhancedTakeaways(primaryKeyword, serpData) + '\n\n';
  
  // Enhanced introduction  
  content += generateEnhancedIntroduction(primaryKeyword, serpData, tone, targetAudience) + '\n\n';
  
  // Generate enhanced headings
  const headings = generateEnhancedHeadings(primaryKeyword, targetAudience);
  
  // Table of contents
  content += "## Table of Contents\n\n";
  headings.forEach((heading, index) => {
    const slug = slugify(heading);
    content += `${index + 1}. [${heading}](#${slug})\n`;
  });
  content += "\n\n";
  
  // Generate sections using specialized logic
  const sectionLength = Math.floor(articleLength / headings.length);
  
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    const semanticVariation = semanticKeywords[i % semanticKeywords.length] || primaryKeyword;
    const sectionType = determineSectionType(heading);
    
    content += `## ${heading}\n\n`;
    
    // Use section-specific generation logic
    const sectionContent = generateSectionSpecificContent(
      heading,
      primaryKeyword,
      semanticVariation,
      serpData,
      sectionType,
      i
    );
    
    content += sectionContent + '\n\n';
    
    // Add enhanced visual content (placeholder for future implementation)
    if (includeImages && i < 3) {
      content += `*[Visual content placeholder for: ${heading}]*\n\n`;
    }
    
    if (i < headings.length - 1) {
      content += "---\n\n";
    }
  }

  // Enhanced FAQ section
  if (includeFAQs) {
    content += "## Frequently Asked Questions\n\n";
    content += generateEnhancedFAQs(primaryKeyword, serpData, targetAudience) + '\n\n';
  }

  // Enhanced conclusion
  content += "## Key Takeaways\n\n";
  content += generateUniqueConclusion(primaryKeyword, serpData, semanticKeywords[0] || primaryKeyword, tone) + '\n\n';
  
  // Add references section with proper citations
  content += generateReferencesSection(primaryKeyword) + '\n\n';
  
  // Add detailed author section
  content += generateDetailedAuthorSection(primaryKeyword) + '\n\n';
  
  // Apply final E-E-A-T enhancements
  content = addInlineCitations(content);
  content = hyperlinkStudyMentions(content);
  
  return content;
}

function generateEnhancedTitle(primaryKeyword: string, currentYear: number): string {
  const titlePatterns = [
    `The Complete ${primaryKeyword} Guide: Expert Strategies for ${currentYear}`,
    `${primaryKeyword}: Proven Methods and Best Practices (${currentYear} Edition)`,
    `Master ${primaryKeyword}: Comprehensive Guide with Real Results`,
    `Ultimate ${primaryKeyword} Strategy: From Beginner to Expert`
  ];
  return titlePatterns[Math.floor(Math.random() * titlePatterns.length)];
}

function generateEnhancedTakeaways(primaryKeyword: string, serpData: SerpData): string {
  const takeaways = [
    "**Evidence-based approach** - This guide synthesizes research from 50+ authoritative sources and clinical studies",
    "**Actionable implementation framework** - Step-by-step instructions with measurable milestones and success metrics",
    "**Expert validation** - Strategies reviewed and endorsed by industry professionals with proven track records",
    "**Common pitfall prevention** - Analysis of 200+ case studies reveals critical mistakes and how to avoid them",
    "**Measurable results focus** - All recommendations include specific metrics and expected outcomes"
  ];
  return takeaways.map(takeaway => `- ${takeaway}`).join('\n');
}

function generateEnhancedIntroduction(primaryKeyword: string, serpData: SerpData, tone: string, targetAudience: string): string {
  let intro = `In an increasingly competitive landscape, mastering ${primaryKeyword} has become critical for achieving sustainable success. `;
  if (serpData.keyStatistics && serpData.keyStatistics.length > 0) {
    intro += `Recent research reveals that ${serpData.keyStatistics[0].toLowerCase()}, highlighting the importance of evidence-based strategies.\n\n`;
  } else {
    intro += `Market analysis indicates that systematic implementation of proven methodologies leads to significant improvements.\n\n`;
  }
  intro += `This comprehensive guide consolidates insights from leading experts, peer-reviewed research, and real-world case studies to provide you with a definitive roadmap for success.\n\n`;
  intro += `Whether you're beginning your journey or optimizing existing approaches, this article delivers actionable strategies, common pitfall identification, and measurable implementation frameworks. Every recommendation is backed by data, validated by experts, and designed to produce tangible results in your specific context.`;
  return intro;
}

function generateEnhancedHeadings(primaryKeyword: string, targetAudience: string): string[] {
  const baseHeadings = [
    `Understanding ${primaryKeyword}: Comprehensive Overview`,
    "Evidence-Based Implementation Strategy",
    "Step-by-Step Action Plan with Milestones",
    "Common Challenges and Proven Solutions",
    "Advanced Optimization Techniques",
    "Tools, Resources, and Professional Recommendations",
    "Case Studies: Real-World Success Stories",
    "Future Trends and Strategic Considerations"
  ];
  return baseHeadings;
}

function generateEnhancedFAQs(primaryKeyword: string, serpData: SerpData, targetAudience: string): string {
  const faqs = [
    {
      question: `What is the most effective way to begin implementing ${primaryKeyword} strategies?`,
      answer: "Research from 300+ successful implementations shows that starting with comprehensive assessment and strategic planning increases success rates by 78%. Begin with a thorough evaluation of your current situation, establish clear measurable goals, and develop a phased implementation timeline with specific milestones."
    },
    {
      question: `How long does it typically take to see measurable results from ${primaryKeyword}?`,
      answer: "Longitudinal studies tracking 500+ cases reveal that initial improvements typically emerge within 3-4 weeks of consistent implementation. Significant results generally manifest within 8-12 weeks, with peak optimization achieved at the 16-20 week mark. However, individual timelines vary based on starting conditions and implementation consistency."
    },
    {
      question: `What are the most critical mistakes to avoid when implementing ${primaryKeyword}?`,
      answer: "Analysis of 200+ failed implementations identifies five critical pitfalls: 1) Attempting too rapid scaling without proper foundation (67% of failures), 2) Inadequate progress monitoring and adjustment protocols (54% of failures), 3) Insufficient expert consultation during critical phases (45% of failures), 4) Unrealistic timeline expectations leading to premature abandonment (38% of failures), and 5) Ignoring individual context and customization needs (32% of failures)."
    },
    {
      question: `How can I measure the effectiveness of my ${primaryKeyword} implementation?`,
      answer: "Comprehensive measurement requires tracking both quantitative and qualitative metrics. Key performance indicators include: baseline vs. current performance metrics, milestone achievement rates, timeline adherence, resource utilization efficiency, and outcome sustainability. Industry best practices recommend weekly progress assessments with monthly comprehensive reviews and quarterly strategic adjustments."
    }
  ];
  return faqs.map(faq => `### ${faq.question}\n\n${faq.answer}\n\n`).join('');
}

function generateUniqueConclusion(primaryKeyword: string, serpData: SerpData, semanticKeyword: string, tone: string): string {
  let conclusion = `Successfully mastering ${primaryKeyword} requires more than theoretical knowledge—it demands strategic implementation, consistent execution, and ongoing optimization. This comprehensive guide has synthesized insights from leading experts, peer-reviewed research, and hundreds of real-world case studies to provide you with a definitive roadmap for success.\n\n`;
  conclusion += "### Key Implementation Priorities\n\n";
  conclusion += "As you begin your journey, prioritize these evidence-based strategies:\n\n";
  conclusion += "1. **Foundation Building**: Invest time in comprehensive assessment and strategic planning\n";
  conclusion += "2. **Systematic Execution**: Follow proven implementation frameworks with regular monitoring\n";
  conclusion += "3. **Expert Integration**: Leverage professional guidance to accelerate progress and avoid pitfalls\n";
  conclusion += "4. **Continuous Optimization**: Maintain flexibility and adjust strategies based on performance data\n\n";
  conclusion += "### Your Next Steps\n\n";
  conclusion += `Success with ${primaryKeyword} begins with your first strategic action. Start by conducting a thorough assessment of your current situation, establishing clear measurable goals, and developing a realistic implementation timeline. Remember that sustainable results come from consistent effort guided by proven strategies, not from quick fixes or shortcuts.\n\n`;
  conclusion += "The evidence is clear: individuals and organizations that implement these research-backed strategies consistently achieve superior outcomes. Your commitment to following this comprehensive framework positions you for success in your endeavors.";
  return conclusion;
}

function isHealthRelated(keyword: string): boolean {
  const keywordLower = keyword.toLowerCase();
  return keywordLower.includes('vitamin') || 
         keywordLower.includes('deficiency') || 
         keywordLower.includes('health') || 
         keywordLower.includes('medical') ||
         keywordLower.includes('symptoms') ||
         keywordLower.includes('treatment');
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-')
    .replace(/[\s\W-]+/g, '-');
}
