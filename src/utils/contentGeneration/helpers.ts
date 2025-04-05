
// Helper function to create slugs for anchor links
export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Remove consecutive hyphens
    .trim();                   // Trim leading/trailing spaces
};

// Add randomization to sentences and paragraph structures for uniqueness
export const getRandomVariation = (baseText: string): string => {
  const variations = [
    baseText,
    `Actually, ${baseText.toLowerCase()}`,
    `I've found that ${baseText.toLowerCase()}`,
    `Based on my experience, ${baseText.toLowerCase()}`,
    `Many experts agree that ${baseText.toLowerCase()}`
  ];
  return variations[Math.floor(Math.random() * variations.length)];
};

// Helper function to create title from keywords
export const createTitleFromKeywords = (keywords: string[]): string => {
  if (!keywords.length) return 'Comprehensive Guide';
  
  // Make title more compelling and clickable
  const primaryKeyword = keywords[0];
  
  // Title patterns that work well for SEO
  const titlePatterns = [
    `The Ultimate Guide to ${primaryKeyword} (${new Date().getFullYear()})`,
    `${primaryKeyword}: Everything You Need to Know`,
    `How to Master ${primaryKeyword}: Expert Tips`,
    `${primaryKeyword} 101: A Complete Guide`,
    `${primaryKeyword}: A Comprehensive Guide for All Levels`
  ];
  
  // Randomly select a pattern for uniqueness
  return titlePatterns[Math.floor(Math.random() * titlePatterns.length)];
};
