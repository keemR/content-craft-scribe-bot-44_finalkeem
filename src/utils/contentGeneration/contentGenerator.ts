
import React from 'react';
import { ContentGenerationOptions } from './types';
import { createTitleFromKeywords, slugify } from './helpers';
import { determineTopicCategory } from './topicCategories';
import { generateOnlineIncomeContent } from './generators/onlineIncomeGenerator';
import { generateHealthContent } from './generators/healthContentGenerator';
import { generateBusinessContent } from './generators/businessContentGenerator';
import { generateTechnologyContent } from './generators/technologyContentGenerator';
import { generateGenericContent } from './generators/genericContentGenerator';
import { researchSERPs } from '../../services/serpResearchService';
import { generateEnhancedVisuals, formatEnhancedVisualsForMarkdown } from './generators/enhancedVisualGenerator';

/**
 * Enhanced content generator with human-focused SEO optimization
 * Fixes keyword stuffing, improves content quality, and ensures uniqueness
 */
export const generateSEOContent = async (options: ContentGenerationOptions): Promise<string> => {
  const { 
    researchData, 
    targetKeywords, 
    articleLength, 
    tone, 
    includeImages, 
    includeFAQs,
    seoLevel = 80,
    targetAudience = '',
    contentSpecificity = 70,
    includeExamples = true,
    includeStatistics = true,
    useCaseStudies = true
  } = options;

  const numericArticleLength = typeof articleLength === 'string' 
    ? parseInt(articleLength, 10) 
    : articleLength;

  const keywordsList = targetKeywords.split(',').map(k => k.trim());
  const primaryKeyword = keywordsList[0] || '';
  
  console.log('🚀 Starting enhanced content generation:', { 
    primaryKeyword, 
    includeImages, 
    seoLevel,
    hasResearchData: !!researchData,
    targetLength: numericArticleLength
  });
  
  // Research SERPs for real data
  const serpData = await researchSERPs(primaryKeyword);
  
  // Create semantic keyword variations to prevent stuffing (max 5 variations)
  const semanticKeywords = generateSemanticKeywords(primaryKeyword).slice(0, 5);
  
  // Combine user research with SERP data
  const enhancedResearchData = researchData 
    ? `${researchData}\n\nSERP RESEARCH DATA:\n${serpData.authorityContent}`
    : serpData.authorityContent;
  
  const topicCategory = determineTopicCategory(primaryKeyword);
  
  // Enhanced content generation options
  const enhancedOptions = {
    primaryKeyword,
    semanticKeywords,
    serpData,
    researchData: enhancedResearchData,
    articleLength: numericArticleLength,
    tone,
    includeImages,
    includeFAQs,
    topicCategory,
    targetAudience,
    contentSpecificity,
    includeExamples,
    includeStatistics,
    useCaseStudies
  };
  
  // Use topic-specific generators for better content quality
  let content = "";
  
  switch (topicCategory) {
    case 'online-income':
      content = await generateOnlineIncomeContent(enhancedOptions);
      break;
      
    case 'health-fitness':
    case 'nutrition':
    case 'medical':
      content = await generateHealthContent(enhancedOptions);
      break;
      
    case 'business':
    case 'marketing':
      content = await generateBusinessContent(enhancedOptions);
      break;
      
    case 'technology':
      content = await generateTechnologyContent(enhancedOptions);
      break;
      
    default:
      content = await generateGenericContent(enhancedOptions);
      break;
  }
  
  // Ensure minimum length is met
  if (content.length < numericArticleLength * 4) { // Assuming ~4 chars per word
    console.log('Content too short, expanding...');
    content = await expandContent(content, enhancedOptions, numericArticleLength, topicCategory);
  }
  
  console.log(`✅ Content generation completed: ${content.length} characters (target: ${numericArticleLength * 4})`);
  
  return content;
};

/**
 * Expand content if it's too short
 */
async function expandContent(
  existingContent: string, 
  options: any, 
  targetLength: number,
  topicCategory: string
): Promise<string> {
  const currentLength = existingContent.length;
  const targetChars = targetLength * 4; // ~4 chars per word
  
  if (currentLength >= targetChars) {
    return existingContent;
  }
  
  // Add more detailed sections
  const expansionSections = generateExpansionSections(options.primaryKeyword, topicCategory);
  
  let expandedContent = existingContent;
  
  // Insert expansion sections before the conclusion
  const conclusionIndex = expandedContent.lastIndexOf('## Key');
  if (conclusionIndex > -1) {
    const beforeConclusion = expandedContent.substring(0, conclusionIndex);
    const conclusion = expandedContent.substring(conclusionIndex);
    
    expandedContent = beforeConclusion + expansionSections + '\n\n' + conclusion;
  } else {
    expandedContent += '\n\n' + expansionSections;
  }
  
  return expandedContent;
}

/**
 * Generate additional sections for content expansion
 */
function generateExpansionSections(keyword: string, topicCategory: string): string {
  let sections = '';
  
  if (topicCategory === 'health-fitness' || topicCategory === 'nutrition') {
    sections += `## Expert Recommendations and Clinical Studies\n\n`;
    sections += `Leading nutritionists and medical professionals emphasize the importance of ${keyword.toLowerCase()} in maintaining optimal health. Recent clinical studies have provided valuable insights into the most effective approaches.\n\n`;
    
    sections += `### Research-Backed Findings\n\n`;
    sections += `Multiple peer-reviewed studies have demonstrated significant health benefits when following evidence-based recommendations for ${keyword.toLowerCase()}. These findings consistently show improved outcomes across diverse populations.\n\n`;
    
    sections += `### Professional Guidelines\n\n`;
    sections += `Healthcare organizations worldwide have established comprehensive guidelines based on decades of research. These recommendations provide clear, actionable steps for implementation.\n\n`;
    
    sections += `## Common Misconceptions and Facts\n\n`;
    sections += `Despite widespread information availability, several misconceptions persist about ${keyword.toLowerCase()}. Understanding the difference between evidence-based facts and popular myths is crucial for making informed decisions.\n\n`;
    
    sections += `### Myth vs. Reality\n\n`;
    sections += `Many commonly held beliefs lack scientific support, while proven strategies often receive insufficient attention. This section clarifies the most important distinctions.\n\n`;
    
    sections += `## Implementation Timeline and Expected Results\n\n`;
    sections += `Setting realistic expectations is essential for long-term success with ${keyword.toLowerCase()}. Research indicates specific timelines for various outcomes.\n\n`;
    
    sections += `### Short-term Expectations (1-4 weeks)\n\n`;
    sections += `Initial changes typically become noticeable within the first month of consistent implementation. These early indicators help track progress and maintain motivation.\n\n`;
    
    sections += `### Medium-term Progress (1-3 months)\n\n`;
    sections += `More substantial improvements generally emerge during the second and third months. This period often represents the most significant transformation phase.\n\n`;
    
    sections += `### Long-term Benefits (3+ months)\n\n`;
    sections += `Sustained implementation leads to lasting improvements that compound over time. Long-term adherence creates the foundation for permanent positive changes.\n\n`;
    
  } else if (topicCategory === 'business' || topicCategory === 'marketing') {
    sections += `## Advanced Strategies and Best Practices\n\n`;
    sections += `Experienced professionals have developed sophisticated approaches to ${keyword.toLowerCase()} that consistently deliver superior results. These advanced strategies build upon fundamental principles.\n\n`;
    
    sections += `### Industry Leaders' Approaches\n\n`;
    sections += `Top performers in the field consistently implement specific strategies that set them apart from average practitioners. Understanding these differences provides valuable competitive advantages.\n\n`;
    
    sections += `## Cost-Benefit Analysis and ROI Considerations\n\n`;
    sections += `Every business decision requires careful evaluation of potential returns versus required investments. ${keyword} implementation involves specific cost considerations and measurable benefits.\n\n`;
    
    sections += `### Investment Requirements\n\n`;
    sections += `Understanding the full scope of required resources helps ensure adequate preparation and realistic budgeting for successful implementation.\n\n`;
    
    sections += `### Measuring Success and Performance Metrics\n\n`;
    sections += `Effective measurement requires establishing clear benchmarks and tracking relevant key performance indicators throughout the implementation process.\n\n`;
    
  } else {
    sections += `## Advanced Considerations and Expert Insights\n\n`;
    sections += `Beyond the fundamental concepts, ${keyword.toLowerCase()} involves nuanced considerations that experienced practitioners understand. These insights can significantly impact success rates.\n\n`;
    
    sections += `### Professional Perspectives\n\n`;
    sections += `Industry experts consistently emphasize specific factors that newcomers often overlook. Understanding these professional insights accelerates learning and improves outcomes.\n\n`;
    
    sections += `## Real-World Applications and Case Studies\n\n`;
    sections += `Practical implementation of ${keyword.toLowerCase()} varies significantly across different situations and contexts. Examining real-world examples provides valuable learning opportunities.\n\n`;
    
    sections += `### Success Stories and Lessons Learned\n\n`;
    sections += `Analyzing successful implementations reveals common patterns and strategies that contribute to positive outcomes. These insights help others avoid common pitfalls.\n\n`;
    
    sections += `## Future Trends and Developments\n\n`;
    sections += `The landscape surrounding ${keyword.toLowerCase()} continues evolving as new research emerges and technologies advance. Staying informed about trends helps maintain competitive advantages.\n\n`;
    
    sections += `### Emerging Opportunities\n\n`;
    sections += `Forward-thinking individuals and organizations are already positioning themselves to capitalize on emerging trends and opportunities in this space.\n\n`;
  }
  
  return sections;
}

/**
 * Generate semantic keyword variations to prevent stuffing
 * Limited to 5 variations max to avoid over-optimization
 */
function generateSemanticKeywords(primaryKeyword: string): string[] {
  const baseKeywords = primaryKeyword.toLowerCase().split(' ');
  const semanticVariations: string[] = [];
  
  // Create natural variations based on keyword type
  if (primaryKeyword.toLowerCase().includes('make money') || primaryKeyword.toLowerCase().includes('online income')) {
    semanticVariations.push(
      'online earning opportunities',
      'digital income streams',
      'remote work options',
      'internet-based revenue',
      'online business ventures'
    );
  } else if (primaryKeyword.toLowerCase().includes('business')) {
    semanticVariations.push(
      'entrepreneurial ventures',
      'business opportunities',
      'commercial strategies',
      'enterprise solutions',
      'startup approaches'
    );
  } else if (primaryKeyword.toLowerCase().includes('health') || primaryKeyword.toLowerCase().includes('fitness')) {
    semanticVariations.push(
      'wellness strategies',
      'health optimization',
      'fitness approaches',
      'wellbeing methods',
      'healthy lifestyle'
    );
  } else if (primaryKeyword.toLowerCase().includes('technology') || primaryKeyword.toLowerCase().includes('tech')) {
    semanticVariations.push(
      'technological solutions',
      'digital innovations',
      'tech developments',
      'technological advances',
      'digital transformation'
    );
  } else {
    // Generic semantic variations
    semanticVariations.push(
      `${primaryKeyword} strategies`,
      `${primaryKeyword} solutions`,
      `${primaryKeyword} approaches`,
      `${primaryKeyword} methods`,
      `${primaryKeyword} techniques`
    );
  }
  
  return semanticVariations.slice(0, 5); // Limit to 5 to prevent over-optimization
}
