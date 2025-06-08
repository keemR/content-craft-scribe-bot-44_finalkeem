
import { ContentGenerationOptions } from './types';
import { orchestrateContentGeneration } from './contentOrchestrator';

/**
 * Main content generator entry point
 * Simplified to focus on the primary generation flow
 */
export const generateSEOContent = async (options: ContentGenerationOptions): Promise<string> => {
  console.log('🚀 Starting SEO content generation');
  
  // Delegate to the content orchestrator
  return await orchestrateContentGeneration(options);
};
