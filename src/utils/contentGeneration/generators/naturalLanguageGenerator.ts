
/**
 * Natural Language Generator - Eliminates keyword stuffing by creating 
 * semantic variations and natural phrase alternatives
 */

export function generateNaturalLanguageVariations(primaryKeyword: string): string[] {
  const keyword = primaryKeyword.toLowerCase();
  const variations: string[] = [];
  
  // Create semantic variations based on keyword analysis
  if (keyword.includes('vitamin d deficiency')) {
    variations.push(
      'low vitamin D levels',
      'vitamin D insufficiency',
      'inadequate vitamin D status',
      'vitamin D shortfall',
      'suboptimal vitamin D levels'
    );
  } else if (keyword.includes('make money online')) {
    variations.push(
      'online income generation',
      'digital revenue streams',
      'internet-based earnings',
      'remote income opportunities',
      'online financial success'
    );
  } else if (keyword.includes('weight loss')) {
    variations.push(
      'fat reduction strategies',
      'sustainable weight management',
      'healthy weight achievement',
      'body composition improvement',
      'metabolic optimization'
    );
  } else if (keyword.includes('programming')) {
    variations.push(
      'software development',
      'coding practices',
      'application development',
      'software engineering',
      'programming methodologies'
    );
  } else if (keyword.includes('marketing')) {
    variations.push(
      'promotional strategies',
      'customer acquisition',
      'brand development',
      'audience engagement',
      'market penetration'
    );
  } else {
    // Generic semantic variations
    const words = keyword.split(' ');
    const mainTopic = words[0];
    
    variations.push(
      `${mainTopic} strategies`,
      `${mainTopic} implementation`,
      `${mainTopic} optimization`,
      `${mainTopic} best practices`,
      `effective ${mainTopic} approaches`
    );
  }
  
  return variations.slice(0, 5); // Limit to prevent over-optimization
}

/**
 * Create natural phrase alternatives instead of exact keyword repetition
 */
export function createNaturalPhrases(keyword: string, context: string): string {
  const keywordLower = keyword.toLowerCase();
  
  // Context-specific natural alternatives
  if (context === 'introduction') {
    if (keywordLower.includes('vitamin d deficiency')) {
      return 'insufficient vitamin D levels';
    } else if (keywordLower.includes('make money online')) {
      return 'generating income through digital channels';
    } else {
      return `effective ${keyword.toLowerCase()} strategies`;
    }
  }
  
  if (context === 'conclusion') {
    if (keywordLower.includes('vitamin d deficiency')) {
      return 'maintaining optimal vitamin D status';
    } else if (keywordLower.includes('make money online')) {
      return 'building sustainable online revenue';
    } else {
      return `successful ${keyword.toLowerCase()} implementation`;
    }
  }
  
  if (context === 'section_header') {
    return `understanding ${keyword.toLowerCase()}`;
  }
  
  // Default natural variation
  return keyword.toLowerCase();
}

/**
 * Convert rigid keyword insertion to natural language flow
 */
export function naturalizeContent(content: string, primaryKeyword: string): string {
  const variations = generateNaturalLanguageVariations(primaryKeyword);
  let naturalizedContent = content;
  
  // Replace rigid keyword repetitions with natural variations
  const keywordRegex = new RegExp(escapeRegex(primaryKeyword), 'gi');
  let replacementIndex = 0;
  
  naturalizedContent = naturalizedContent.replace(keywordRegex, (match) => {
    // Don't replace in headings or first occurrence
    if (replacementIndex === 0) {
      replacementIndex++;
      return match;
    }
    
    const variation = variations[replacementIndex % variations.length];
    replacementIndex++;
    return variation || match;
  });
  
  return naturalizedContent;
}

/**
 * Escape special regex characters
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Generate contextually appropriate keyword usage
 */
export function generateContextualKeywordUsage(
  keyword: string, 
  sectionType: 'intro' | 'body' | 'conclusion',
  sentencePosition: 'start' | 'middle' | 'end'
): string {
  const keywordLower = keyword.toLowerCase();
  
  if (sectionType === 'intro') {
    if (sentencePosition === 'start') {
      return `Understanding ${keywordLower}`;
    } else if (sentencePosition === 'middle') {
      return `the principles of ${keywordLower}`;
    } else {
      return `successful ${keywordLower} implementation`;
    }
  }
  
  if (sectionType === 'body') {
    const variations = [
      `effective ${keywordLower} approaches`,
      `${keywordLower} best practices`,
      `optimizing ${keywordLower} outcomes`,
      `evidence-based ${keywordLower} strategies`
    ];
    return variations[Math.floor(Math.random() * variations.length)];
  }
  
  if (sectionType === 'conclusion') {
    return `mastering ${keywordLower}`;
  }
  
  return keywordLower;
}
