
import { ContentGenerationOptions } from './types';
import { generateEnhancedSEOContent } from './enhancedContentGenerator';

/**
 * Main content orchestrator that coordinates content generation
 */
export const orchestrateContentGeneration = async (options: ContentGenerationOptions): Promise<string> => {
  console.log('🎬 Starting content generation orchestration');
  
  try {
    // Use the enhanced generator as the primary engine
    const content = await generateEnhancedSEOContent(options);
    console.log('✅ Content generation orchestration completed successfully');
    return content;
  } catch (error) {
    console.error('❌ Content generation orchestration failed:', error);
    throw new Error(`Content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
