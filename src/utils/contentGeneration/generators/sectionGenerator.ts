
export const generateSectionContent = (heading: string, keywords: string[], tone: string, wordCount: number, targetAudience?: string, seoLevel = 80): string => {
  const primaryKeyword = keywords[0] || 'this topic';
  const paragraphCount = Math.floor(Math.random() * 2) + 3; // 3-4 paragraphs for variety
  let content = "";
  
  // Vary paragraph structure based on section topic
  for (let i = 0; i < paragraphCount; i++) {
    // Vary sentence structure and create natural language patterns
    
    // Add occasional first-person perspective for authenticity
    if (i === 0) {
      content += `${heading} is something I've worked with extensively. `;
    }
    
    // Add expert insights with occasional minor grammar errors for authenticity
    if (i === 1) {
      // Intentional small errors that a fluent speaker might make
      const naturalErrors = [
        `One thing thats often overlooked about ${heading.toLowerCase()} is the importance of consistency. `,
        `Their are several approaches to ${primaryKeyword} that work particularly well. `,
        `I've found that people dont always consider the full context when implementing ${primaryKeyword}. `
      ];
      content += naturalErrors[Math.floor(Math.random() * naturalErrors.length)];
    }
    
    // Add industry wisdom and practical advice
    content += `When working with ${primaryKeyword}, timing and resource allocation greatly affect outcomes. `;
    
    // Add occasional question to engage readers
    if (i === 2) {
      content += `Have you considered how ${primaryKeyword} might impact your specific situation? `;
    }
    
    // Add varying paragraph lengths
    if (i % 2 === 0) {
      content += `This approach works because it addresses multiple factors simultaneously while remaining adaptable to changing conditions. I've seen this work even in challenging situations where traditional methods failed.\n\n`;
    } else {
      content += `The key is balancing theory with practical application.\n\n`;
    }
    
    // Add bullet points in some paragraphs for scannable content
    if (i === Math.floor(paragraphCount / 2)) {
      content += "Key factors to consider include:\n\n";
      content += "* Thorough research and planning before implementation\n";
      content += "* Consistent schedule that accommodates your resources\n";
      content += "* Regular assessment of performance metrics\n";
      content += "* Flexibility to adapt as conditions change\n\n";
    }
    
    // Add occasional table for data visualization and featured snippet potential
    if (i === paragraphCount - 1 && heading.includes("Comparison") || heading.includes("Best Practices")) {
      content += "Here's a comparison of different approaches:\n\n";
      content += "| Approach | Advantages | Limitations |\n";
      content += "|----------|------------|-------------|\n";
      content += `| Traditional ${primaryKeyword} | Reliable, Well-documented, Stable | Time-intensive, Less flexible |\n`;
      content += `| Modern ${primaryKeyword} | Efficient, Scalable, Fast results | Steeper learning curve, New challenges |\n`;
      content += `| Hybrid ${primaryKeyword} | Balanced, Adaptable, Best of both | Requires more planning, More complex |\n\n`;
    }
    
    // Add practical anecdote or example for relatability
    if (i === paragraphCount - 1) {
      content += `I once worked with a client who struggled with ${primaryKeyword} until we adjusted their approach to account for their specific context. The results improved dramatically within weeks.\n\n`;
    }
  }
  
  // Add a relevant quote if appropriate for the section
  if (heading.includes("Expert") || heading.includes("Insights")) {
    content += `> "${primaryKeyword} isn't about following strict rules, but understanding principles and applying them intelligently to your situation." - Industry Expert\n\n`;
  }
  
  return content;
};
