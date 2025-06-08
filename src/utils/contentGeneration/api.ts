
import { ContentGenerationOptions } from './types';
import { generateSEOContent } from './contentGenerator';
import { ContentConfiguration } from './contentConfiguration';

/**
 * Simulates an API call with a delay and returns the generated content
 */
export const simulateApiCall = async (options: ContentGenerationOptions): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(async () => {
      // Use the configuration manager to enhance options
      const config = new ContentConfiguration(options);
      const enhancedOptions = config.getOptions();
      
      const content = await generateSEOContent(enhancedOptions);
      resolve(content);
    }, 2000);
  });
};

// Re-export the types for easy access
export type { ContentGenerationOptions } from './types';
