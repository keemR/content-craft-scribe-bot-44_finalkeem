
import { ContentGenerationOptions } from './types';
import { generateEnhancedSEOContent } from './enhancedContentGenerator';

/**
 * Enhanced content generator with human-focused SEO optimization
 * Now uses comprehensive research and quality validation
 */
export const generateSEOContent = async (options: ContentGenerationOptions): Promise<string> => {
  console.log('🚀 Using enhanced content generation system');
  
  // Use the new enhanced generator
  return await generateEnhancedSEOContent(options);
};
