
/**
 * Generate semantic keyword variations to prevent stuffing
 * Limited to 5 variations max to avoid over-optimization
 */
export function generateSemanticKeywords(primaryKeyword: string): string[] {
  const baseKeywords = primaryKeyword.toLowerCase().split(' ');
  const semanticVariations: string[] = [];
  
  // Create natural variations based on keyword type
  if (primaryKeyword.toLowerCase().includes('make money') || primaryKeyword.toLowerCase().includes('online income')) {
    semanticVariations.push(
      'online earning opportunities',
      'digital income streams',
      'remote work options',
      'internet-based revenue',
      'online business ventures'
    );
  } else if (primaryKeyword.toLowerCase().includes('business')) {
    semanticVariations.push(
      'entrepreneurial ventures',
      'business opportunities',
      'commercial strategies',
      'enterprise solutions',
      'startup approaches'
    );
  } else if (primaryKeyword.toLowerCase().includes('health') || primaryKeyword.toLowerCase().includes('fitness')) {
    semanticVariations.push(
      'wellness strategies',
      'health optimization',
      'fitness approaches',
      'wellbeing methods',
      'healthy lifestyle'
    );
  } else if (primaryKeyword.toLowerCase().includes('technology') || primaryKeyword.toLowerCase().includes('tech')) {
    semanticVariations.push(
      'technological solutions',
      'digital innovations',
      'tech developments',
      'technological advances',
      'digital transformation'
    );
  } else {
    // Generic semantic variations
    semanticVariations.push(
      `${primaryKeyword} strategies`,
      `${primaryKeyword} solutions`,
      `${primaryKeyword} approaches`,
      `${primaryKeyword} methods`,
      `${primaryKeyword} techniques`
    );
  }
  
  return semanticVariations.slice(0, 5); // Limit to 5 to prevent over-optimization
}
