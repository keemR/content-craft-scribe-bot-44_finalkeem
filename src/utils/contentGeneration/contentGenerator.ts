
import React from 'react';
import { ContentGenerationOptions } from './types';
import { createTitleFromKeywords, slugify } from './helpers';
import { generateKeyTakeaways } from './generators/takeawaysGenerator';
import { generateIntroduction } from './generators/introductionGenerator';
import { generateHeadings } from './generators/headingsGenerator';
import { generateSectionContent } from './generators/sectionGenerator';
import { generateFAQs } from './generators/faqGenerator';
import { generateConclusion } from './generators/conclusionGenerator';
import { determineTopicCategory } from './topicCategories';
import { generateCompetitiveContent } from './generators/competitiveContentGenerator';
import { generateEnhancedVisuals, formatEnhancedVisualsForMarkdown } from './generators/enhancedVisualGenerator';
import { fetchRealTimeData } from './generators/realTimeDataService';

/**
 * Generates high-quality SEO-optimized content based on user inputs
 * Now uses competitive content generation for better quality
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
    preventRepetition = true,
    contentSpecificity = 70,
    includeExamples = true,
    includeStatistics = true,
    useCaseStudies = true
  } = options;

  // Ensure articleLength is a number
  const numericArticleLength = typeof articleLength === 'string' 
    ? parseInt(articleLength, 10) 
    : articleLength;

  // Parse keywords for better semantic richness
  const keywordsList = targetKeywords.split(',').map(k => k.trim());
  const primaryKeyword = keywordsList[0] || '';
  
  // Identify topic category to customize content structure
  const topicCategory = determineTopicCategory(primaryKeyword);
  
  console.log('Content generation started:', { primaryKeyword, topicCategory, includeImages });
  
  // Use competitive content generation for better quality
  if (seoLevel >= 80 && numericArticleLength >= 3000) {
    try {
      return generateCompetitiveContent({
        ...options,
        topicCategory
      });
    } catch (error) {
      console.error('Error generating competitive content, falling back to standard generation:', error);
    }
  }
  
  let content = "";
  
  // Create optimized title without redundancies
  const title = createTitleFromKeywords(keywordsList, topicCategory);
  content += `# ${title}\n\n`;
  
  // Add estimated reading time for better user experience
  const estimatedReadingTime = Math.ceil(numericArticleLength / 200); // 200 words per minute
  content += `*Reading time: ${estimatedReadingTime} minutes*\n\n`;
  
  // Key Takeaways - optimized for featured snippets with specific, valuable insights
  content += "## Key Takeaways\n\n";
  const takeaways = generateKeyTakeaways(keywordsList, topicCategory);
  content += takeaways + "\n\n";
  
  // Generate introduction with topic-specific information
  content += generateIntroduction(keywordsList, tone, targetAudience, topicCategory) + "\n\n";
  
  // Table of Contents for improved UX and crawlability
  content += "## Table of Contents\n\n";
  const headings = generateHeadings(keywordsList, topicCategory, targetAudience);
  
  // Generate Table of Contents with anchor links
  headings.forEach((heading, index) => {
    content += `${index + 1}. [${heading}](#${slugify(heading)})\n`;
  });
  content += "\n\n";
  
  // Calculate the section length as a number based on article length and number of headings
  const sectionLength = Math.floor(numericArticleLength / headings.length);
  
  headings.forEach((heading, index) => {
    // Create proper heading IDs for anchor links
    content += `<h2 id="${slugify(heading)}">${heading}</h2>\n\n`;
    
    // Generate section content with proper argument types
    content += generateSectionContent(
      heading, 
      keywordsList, 
      tone, 
      sectionLength, 
      targetAudience, 
      topicCategory
    ) + "\n\n";
    
    // FORCE visual generation for EVERY section when images are enabled
    if (includeImages) {
      console.log('Generating visuals for section:', heading, 'index:', index);
      
      const visuals = generateEnhancedVisuals(heading, primaryKeyword, topicCategory, index);
      console.log('Generated visuals count:', visuals.length, 'for heading:', heading);
      
      if (visuals && visuals.length > 0) {
        const visualMarkdown = formatEnhancedVisualsForMarkdown(visuals);
        console.log('Formatted visual markdown length:', visualMarkdown.length);
        
        if (visualMarkdown && visualMarkdown.trim()) {
          content += "### 📸 Visual Content\n\n";
          content += visualMarkdown + "\n\n";
        } else {
          // Fallback visual if formatting fails
          content += "### 📸 Visual Content\n\n";
          content += `![${heading} - Professional Guide](https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80)\n\n`;
          content += `*Professional illustration for ${heading.toLowerCase()}*\n\n`;
        }
      } else {
        // Force a fallback visual if no visuals are generated
        console.log('No visuals generated, adding fallback for:', heading);
        content += "### 📸 Visual Content\n\n";
        content += `![${heading} - Expert Guide](https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80)\n\n`;
        content += `*Expert guidance on ${heading.toLowerCase()}*\n\n`;
      }
    }
    
    // Add separator between sections
    if (index < headings.length - 1) {
      content += "---\n\n";
    }
  });

  // Add relevant FAQs specific to the topic
  if (includeFAQs) {
    content += "## Frequently Asked Questions\n\n";
    content += generateFAQs(keywordsList, targetAudience, topicCategory) + "\n\n";
  }

  // Add a conclusion with final CTA relevant to the topic
  content += "## Conclusion\n\n";
  content += generateConclusion(keywordsList, tone, targetAudience, topicCategory) + "\n\n";
  
  console.log('Content generation completed with', content.length, 'characters');
  console.log('Visual sections included:', (content.match(/### 📸 Visual Content/g) || []).length);
  
  return content;
};
