
import { ContentGenerationOptions } from './types';
import { generateSEOContent } from './contentGenerator';

/**
 * Simulates an API call with a delay and returns the generated content
 */
export const simulateApiCall = async (options: ContentGenerationOptions): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      // Enhance options with improved defaults for better quality content
      const enhancedOptions = {
        ...options,
        // Ensure we prevent repetition by default for better quality
        preventRepetition: options.preventRepetition !== false,
        // Increase content specificity for more detailed sections
        contentSpecificity: options.contentSpecificity || 85,
        // Include examples by default for more practical content
        includeExamples: options.includeExamples !== false,
        // Include statistics by default for more authoritative content
        includeStatistics: options.includeStatistics !== false,
        // Use case studies by default for more credibility
        useCaseStudies: options.useCaseStudies !== false
      };
      
      const content = generateSEOContent(enhancedOptions);
      resolve(content);
    }, 2000);
  });
};

// Re-export the types for easy access
export type { ContentGenerationOptions } from './types';
