
import { ContentGenerationOptions } from './types';
import { determineTopicCategory } from './topicCategories';
import { generateHeadings } from './generators/headingsGenerator';
import { createTitleFromKeywords } from './helpers';
import { generateIntroduction } from './generators/introductionGenerator';
import { generateSectionContent } from './generators/sectionGenerator';
import { generateConclusion } from './generators/conclusionGenerator';
import { generateFAQs } from './generators/faqGenerator';
import { generateEnhancedVisuals } from './generators/enhancedVisualGenerator';
import { performEnhancedResearch } from '../../services/enhancedResearchService';
import { expandContent } from './generators/contentExpansion';
import { generateSemanticKeywords } from './generators/semanticKeywords';

/**
 * Enhanced content generator with comprehensive research and quality validation
 */
export async function generateEnhancedSEOContent(options: ContentGenerationOptions): Promise<string> {
  console.log('🎯 Starting enhanced content generation with research');
  
  try {
    // Parse keywords
    const keywords = options.targetKeywords.split(',').map(k => k.trim());
    const primaryKeyword = keywords[0];
    
    // Determine topic category
    const topicCategory = determineTopicCategory(primaryKeyword);
    console.log(`📂 Topic category determined: ${topicCategory}`);
    
    // Perform enhanced research
    const researchData = await performEnhancedResearch(primaryKeyword);
    console.log('📊 Enhanced research completed');
    
    // Generate semantic variations
    const semanticKeywords = generateSemanticKeywords(primaryKeyword);
    
    // Generate content structure
    const title = createTitleFromKeywords(keywords, topicCategory);
    const headings = generateHeadings(keywords, topicCategory, options.targetAudience);
    
    console.log('🏗️ Generating content sections');
    
    // Generate main content sections
    let content = `# ${title}\n\n`;
    
    // Add introduction
    content += generateIntroduction(primaryKeyword, topicCategory, researchData, options);
    content += '\n\n';
    
    // Add table of contents
    content += generateTableOfContents(headings);
    content += '\n\n';
    
    // Generate section content with enhanced visuals
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i];
      console.log(`✍️ Generating section: ${heading}`);
      
      content += `## ${heading}\n\n`;
      
      // Generate section content
      const sectionContent = generateSectionContent(
        heading,
        primaryKeyword,
        topicCategory,
        researchData,
        options,
        i
      );
      content += sectionContent;
      
      // Add enhanced visuals
      if (options.includeImages) {
        const visuals = generateEnhancedVisuals(heading, primaryKeyword, topicCategory, i, researchData);
        visuals.forEach(visual => {
          content += `\n\n${visual.content}\n`;
        });
      }
      
      content += '\n\n';
    }
    
    // Add FAQ section
    if (options.includeFAQs) {
      content += generateFAQs(primaryKeyword, topicCategory, researchData);
      content += '\n\n';
    }
    
    // Add conclusion
    content += generateConclusion(primaryKeyword, topicCategory, researchData, options);
    
    // Expand content if needed
    const expandedContent = await expandContent(
      content,
      options,
      options.articleLength,
      topicCategory
    );
    
    // Quality validation
    const validatedContent = validateContentQuality(expandedContent, options, semanticKeywords);
    
    console.log('✅ Enhanced content generation completed');
    return validatedContent;
    
  } catch (error) {
    console.error('❌ Enhanced content generation failed:', error);
    // Fallback to basic content generation
    return generateFallbackContent(options);
  }
}

/**
 * Generate table of contents
 */
function generateTableOfContents(headings: string[]): string {
  let toc = '## Table of Contents\n\n';
  
  headings.forEach((heading, index) => {
    const anchor = heading.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    toc += `${index + 1}. [${heading}](#${anchor})\n`;
  });
  
  return toc;
}

/**
 * Validate and enhance content quality
 */
function validateContentQuality(
  content: string, 
  options: ContentGenerationOptions,
  semanticKeywords: string[]
): string {
  let validatedContent = content;
  
  // Check keyword density (should be 1-2%)
  const wordCount = content.split(/\s+/).length;
  const keywordCount = (content.match(new RegExp(options.targetKeywords.split(',')[0], 'gi')) || []).length;
  const density = (keywordCount / wordCount) * 100;
  
  console.log(`📊 Content metrics - Words: ${wordCount}, Keyword density: ${density.toFixed(2)}%`);
  
  // Add semantic keywords naturally if density is too low
  if (density < 0.5 && semanticKeywords.length > 0) {
    const randomSemantic = semanticKeywords[Math.floor(Math.random() * semanticKeywords.length)];
    validatedContent += `\n\n*Related topics: ${randomSemantic}*`;
  }
  
  // Ensure minimum content length
  if (wordCount < options.articleLength * 0.8) {
    console.log('📏 Content too short, adding supplementary sections');
    validatedContent += generateSupplementaryContent(options.targetKeywords.split(',')[0]);
  }
  
  return validatedContent;
}

/**
 * Generate supplementary content for short articles
 */
function generateSupplementaryContent(primaryKeyword: string): string {
  return `

## Additional Resources and Further Reading

Understanding ${primaryKeyword} is an ongoing journey that benefits from continuous learning and staying updated with the latest developments. Here are valuable resources to deepen your knowledge:

### Professional Organizations and Associations
Leading professional organizations provide authoritative guidelines, research updates, and certification programs related to ${primaryKeyword}. These resources offer credible information from industry experts.

### Recommended Reading and Research
Academic journals, peer-reviewed studies, and evidence-based publications provide the foundation for understanding ${primaryKeyword}. Regular review of current literature ensures knowledge remains current and accurate.

### Online Communities and Support Networks
Engaging with communities of practitioners and enthusiasts provides practical insights, real-world experiences, and ongoing support for implementing ${primaryKeyword} strategies.
`;
}

/**
 * Fallback content generation for error cases
 */
function generateFallbackContent(options: ContentGenerationOptions): string {
  const keywords = options.targetKeywords.split(',').map(k => k.trim());
  const primaryKeyword = keywords[0];
  
  return `# ${primaryKeyword}: A Comprehensive Guide

## Introduction

${primaryKeyword} is an important topic that deserves careful consideration and understanding. This guide provides essential information to help you make informed decisions.

## Understanding ${primaryKeyword}

The fundamentals of ${primaryKeyword} involve several key concepts that are essential for success. Understanding these basics provides the foundation for more advanced applications.

## Getting Started

Beginning your journey with ${primaryKeyword} requires careful planning and realistic expectations. Start with the basics and gradually build your knowledge and skills.

## Best Practices

Successful implementation of ${primaryKeyword} strategies requires following proven best practices and avoiding common mistakes.

## Conclusion

${primaryKeyword} represents an important area for continued learning and development. With the right approach and consistent effort, you can achieve your goals in this area.

*This content was generated as a fallback. For more comprehensive information, please try again with more specific research data.*
`;
}
