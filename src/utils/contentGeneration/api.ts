
import { ContentGenerationOptions } from './types';
import { generateSEOContent } from './contentGenerator';

/**
 * Simulates an API call with a delay and returns the generated content
 */
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

// Re-export the types for easy access
export type { ContentGenerationOptions } from './types';
