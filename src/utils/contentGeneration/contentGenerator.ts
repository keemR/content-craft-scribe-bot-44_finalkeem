
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
    hasResearchData: !!researchData
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
  
  // Use topic-specific generators for better content quality
  let content = "";
  
  switch (topicCategory) {
    case 'online-income':
      content = await generateOnlineIncomeContent({
        primaryKeyword,
        semanticKeywords,
        serpData,
        researchData: enhancedResearchData,
        articleLength: numericArticleLength,
        tone,
        includeImages,
        includeFAQs
      });
      break;
      
    case 'health-fitness':
    case 'nutrition':
    case 'medical':
      content = await generateHealthContent({
        primaryKeyword,
        semanticKeywords,
        serpData,
        researchData: enhancedResearchData,
        articleLength: numericArticleLength,
        tone,
        includeImages,
        includeFAQs,
        topicCategory
      });
      break;
      
    case 'business':
    case 'marketing':
      content = await generateBusinessContent({
        primaryKeyword,
        semanticKeywords,
        serpData,
        researchData: enhancedResearchData,
        articleLength: numericArticleLength,
        tone,
        includeImages,
        includeFAQs
      });
      break;
      
    case 'technology':
      content = await generateTechnologyContent({
        primaryKeyword,
        semanticKeywords,
        serpData,
        researchData: enhancedResearchData,
        articleLength: numericArticleLength,
        tone,
        includeImages,
        includeFAQs
      });
      break;
      
    default:
      content = await generateGenericContent({
        primaryKeyword,
        semanticKeywords,
        serpData,
        researchData: enhancedResearchData,
        articleLength: numericArticleLength,
        tone,
        includeImages,
        includeFAQs,
        topicCategory
      });
      break;
  }
  
  console.log(`✅ Content generation completed: ${content.length} characters`);
  
  return content;
};

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
