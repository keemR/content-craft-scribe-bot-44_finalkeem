
import { ContentGenerationOptions } from './types';

/**
 * Content generation configuration and validation
 */
export class ContentConfiguration {
  private options: ContentGenerationOptions;

  constructor(options: ContentGenerationOptions) {
    this.options = this.validateAndEnhanceOptions(options);
  }

  /**
   * Validate and enhance options with improved defaults
   */
  private validateAndEnhanceOptions(options: ContentGenerationOptions): ContentGenerationOptions {
    return {
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
      useCaseStudies: options.useCaseStudies !== false,
      // Set default SEO level if not provided
      seoLevel: options.seoLevel || 8,
      // Set default target audience if not provided
      targetAudience: options.targetAudience || 'general',
    };
  }

  /**
   * Get the validated options
   */
  getOptions(): ContentGenerationOptions {
    return this.options;
  }

  /**
   * Get keywords as array
   */
  getKeywordsArray(): string[] {
    return this.options.targetKeywords.split(',').map(k => k.trim());
  }

  /**
   * Get primary keyword
   */
  getPrimaryKeyword(): string {
    return this.getKeywordsArray()[0];
  }

  /**
   * Check if option is enabled
   */
  isOptionEnabled(option: keyof ContentGenerationOptions): boolean {
    return Boolean(this.options[option]);
  }
}
