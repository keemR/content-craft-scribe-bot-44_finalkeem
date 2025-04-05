
import { ContentGenerationOptions } from './types';
import { createTitleFromKeywords, slugify } from './helpers';
import { generateKeyTakeaways } from './generators/takeawaysGenerator';
import { generateIntroduction } from './generators/introductionGenerator';
import { generateHeadings } from './generators/headingsGenerator';
import { generateSectionContent } from './generators/sectionGenerator';
import { generateFAQs } from './generators/faqGenerator';
import { generateConclusion } from './generators/conclusionGenerator';

/**
 * Generates high-quality SEO-optimized content based on user inputs
 */
export const generateSEOContent = (options: ContentGenerationOptions): string => {
  const { 
    researchData, 
    targetKeywords, 
    articleLength, 
    tone, 
    includeImages, 
    includeFAQs,
    seoLevel = 80,
    targetAudience = ''
  } = options;

  // Parse keywords for better semantic richness
  const keywordsList = targetKeywords.split(',').map(k => k.trim());
  const primaryKeyword = keywordsList[0] || '';
  
  let content = "";
  
  // Create key takeaways at the top - Featured Snippet optimization
  content += `# ${createTitleFromKeywords(keywordsList)}\n\n`;
  
  // Add estimated reading time for better user experience
  const estimatedReadingTime = Math.ceil(articleLength / 200); // 200 words per minute
  content += `*Reading time: ${estimatedReadingTime} minutes*\n\n`;
  
  // Key Takeaways - optimized for featured snippets
  content += "## Key Takeaways\n\n";
  const takeaways = generateKeyTakeaways(keywordsList);
  content += takeaways + "\n\n";
  
  // Generate introduction with semantic LSI keywords
  content += generateIntroduction(keywordsList, tone, targetAudience) + "\n\n";
  
  // Table of Contents for improved UX and crawlability
  content += "## Table of Contents\n\n";
  const headings = generateHeadings(keywordsList, targetAudience);
  
  // Generate Table of Contents with anchor links
  headings.forEach((heading, index) => {
    content += `${index + 1}. [${heading}](#${slugify(heading)})\n`;
  });
  content += "\n\n";
  
  // Generate main content with semantic structure
  headings.forEach((heading, index) => {
    // Create proper heading IDs for anchor links
    content += `<h2 id="${slugify(heading)}">${heading}</h2>\n\n`;
    
    // Generate section with varying paragraph lengths and natural language
    content += generateSectionContent(heading, keywordsList, tone, Math.floor(articleLength / headings.length), targetAudience, seoLevel) + "\n\n";
    
    // Add schema-ready images with proper alt text
    if (includeImages && index % 2 === 0) {
      content += `![${heading} - ${primaryKeyword}](https://example.com/images/${slugify(heading)}.jpg)\n\n`;
    }
  });
  
  // Add FAQs for better SEO - structured as schema-ready content
  if (includeFAQs) {
    content += "## Frequently Asked Questions\n\n";
    content += generateFAQs(keywordsList, targetAudience) + "\n\n";
  }

  // Add a conclusion with final CTA
  content += "## Conclusion\n\n";
  content += generateConclusion(keywordsList, tone, targetAudience) + "\n\n";
  
  return content;
};

// Enhanced API call simulation with additional parameters
export const simulateApiCall = async (options: ContentGenerationOptions): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const content = generateSEOContent(options);
      resolve(content);
    }, 2000);
  });
};

// Re-export types
export type { ContentGenerationOptions } from './types';
