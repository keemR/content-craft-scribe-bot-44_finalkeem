
import { slugify } from '../helpers';

export const generateHeadings = (keywords: string[], targetAudience?: string): string[] => {
  const primaryKeyword = keywords[0] || 'This Topic';
  
  // Create more specific, semantic-rich headings
  const baseHeadings = [
    `What is ${primaryKeyword}? Definition and Key Concepts`,
    `The Evolution of ${primaryKeyword} (History and Development)`,
    `Essential Components for Successful ${primaryKeyword} Implementation`,
    `Common Challenges with ${primaryKeyword} and Their Solutions`,
    `${primaryKeyword} Best Practices for ${new Date().getFullYear()}`,
    `Tools and Resources to Optimize Your ${primaryKeyword} Strategy`,
    `Real-World Case Studies: ${primaryKeyword} Success Stories`,
    `Future Trends in ${primaryKeyword} to Watch For`
  ];
  
  // If target audience is specified, customize a heading for them
  if (targetAudience) {
    baseHeadings[2] = `How ${targetAudience} Can Benefit from ${primaryKeyword}`;
  }
  
  // Add occasional related keywords to headings for better semantic SEO
  if (keywords.length > 1) {
    const secondaryKeyword = keywords[1];
    baseHeadings[4] = `Combining ${primaryKeyword} with ${secondaryKeyword}: Synergy Benefits`;
  }
  
  return baseHeadings;
};
