
// This file serves as the main entry point for the content generation module
// It exports all the necessary functions and types for external use

import { simulateApiCall } from './api';
import { generateSEOContent } from './contentGenerator';
import { determineTopicCategory } from './topicCategories';
import { ContentGenerationOptions } from './types';

// Export the main functions
export {
  simulateApiCall,
  generateSEOContent,
  determineTopicCategory
};

// Re-export types
export type { ContentGenerationOptions } from './types';
