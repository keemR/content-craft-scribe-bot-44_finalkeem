
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
    targetAudience = '',
    preventRepetition = true,
    contentSpecificity = 70,
    includeExamples = true,
    includeStatistics = true,
    useCaseStudies = true
  } = options;

  // Parse keywords for better semantic richness
  const keywordsList = targetKeywords.split(',').map(k => k.trim());
  const primaryKeyword = keywordsList[0] || '';
  
  // Identify topic category to customize content structure
  const topicCategory = determineTopicCategory(primaryKeyword);
  
  let content = "";
  
  // Create optimized title without redundancies
  const title = createTitleFromKeywords(keywordsList, topicCategory);
  content += `# ${title}\n\n`;
  
  // Add estimated reading time for better user experience
  const estimatedReadingTime = Math.ceil(articleLength / 200); // 200 words per minute
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
  
  // Generate main content with semantic structure
  headings.forEach((heading, index) => {
    // Create proper heading IDs for anchor links
    content += `<h2 id="${slugify(heading)}">${heading}</h2>\n\n`;
    
    // Generate section with varied paragraph lengths, practical examples, and topic-specific advice
    content += generateSectionContent(
      heading, 
      keywordsList, 
      tone, 
      Math.floor(articleLength / headings.length), 
      targetAudience, 
      seoLevel,
      topicCategory,
      preventRepetition
    ) + "\n\n";
    
    // Add relevant images with proper alt text
    if (includeImages && index % 2 === 0) {
      content += generateTopicSpecificImage(heading, primaryKeyword, topicCategory) + "\n\n";
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
  
  return content;
};

/**
 * Determines the topic category based on keywords to enable content specialization
 */
function determineTopicCategory(primaryKeyword: string): string {
  const keyword = primaryKeyword.toLowerCase();
  
  // Diet, nutrition, and meal planning
  if (keyword.includes('meal') || 
      keyword.includes('diet') || 
      keyword.includes('eat') || 
      keyword.includes('food') || 
      keyword.includes('nutrition') || 
      keyword.includes('recipe')) {
    return 'meal-planning';
  }
  
  // Marketing and business topics
  if (keyword.includes('marketing') || 
      keyword.includes('business') || 
      keyword.includes('seo') || 
      keyword.includes('sales') ||
      keyword.includes('affiliate')) {
    return 'marketing';
  }
  
  // Online income and work topics
  if (keyword.includes('money online') || 
      keyword.includes('freelance') || 
      keyword.includes('income') || 
      keyword.includes('earn') ||
      keyword.includes('dropshipping')) {
    return 'online-income';
  }
  
  // Technology topics
  if (keyword.includes('tech') || 
      keyword.includes('software') || 
      keyword.includes('app') || 
      keyword.includes('developer') ||
      keyword.includes('coding')) {
    return 'technology';
  }
  
  // Health topics
  if (keyword.includes('health') || 
      keyword.includes('fitness') || 
      keyword.includes('exercise') || 
      keyword.includes('wellness')) {
    return 'health-fitness';
  }
  
  // Default category for other topics
  return 'general';
}

/**
 * Generates topic-specific image tags with helpful captions
 */
function generateTopicSpecificImage(heading: string, primaryKeyword: string, topicCategory: string): string {
  // Diet and meal planning images
  if (topicCategory === 'meal-planning') {
    if (heading.includes('Plan')) {
      return `![Weekly meal prep with budget-friendly ingredients](https://example.com/images/meal-prep-budget.jpg)\n*A sample weekly meal prep using affordable, nutrient-dense foods like beans, brown rice, and seasonal vegetables*`;
    }
    if (heading.includes('Budget')) {
      return `![Price comparison of healthy vs processed foods](https://example.com/images/food-price-comparison.jpg)\n*Price comparison chart showing how whole foods can be more economical than processed alternatives when planned properly*`;
    }
    return `![Healthy budget-friendly meal](https://example.com/images/${slugify(heading)}.jpg)\n*${heading} - affordable, nutritious options for families*`;
  }
  
  // Marketing images
  if (topicCategory === 'marketing') {
    return `![${heading} strategy visualization](https://example.com/images/${slugify(heading)}.jpg)\n*Visual representation of effective ${primaryKeyword} tactics*`;
  }
  
  // Online income images
  if (topicCategory === 'online-income') {
    return `![Real results from ${heading}](https://example.com/images/${slugify(heading)}.jpg)\n*Actual earnings example from implementing these ${primaryKeyword} strategies*`;
  }
  
  // Generic image fallback
  return `![${heading}](https://example.com/images/${slugify(heading)}.jpg)\n*Visualization of ${heading} concepts*`;
}

// Enhanced API call simulation with additional parameters
export const simulateApiCall = async (options: ContentGenerationOptions): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Ensure we prevent repetition by default for better quality
      const enhancedOptions = {
        ...options,
        preventRepetition: options.preventRepetition !== false
      };
      
      const content = generateSEOContent(enhancedOptions);
      resolve(content);
    }, 2000);
  });
};

// Re-export types
export type { ContentGenerationOptions } from './types';
