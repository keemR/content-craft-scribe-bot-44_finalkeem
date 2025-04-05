
interface ContentGenerationOptions {
  researchData: string;
  targetKeywords: string;
  articleLength: number;
  tone: string;
  includeImages: boolean;
  includeFAQs: boolean;
  seoLevel?: number;
  targetAudience?: string;
}

/**
 * Generates high-quality SEO-optimized content based on user inputs
 */
export const generateSEOContent = (options: ContentGenerationOptions): string => {
  const { 
    researchData, 
    targetKeywords, 
    articleLength, 
    tone, 
    includeImages, 
    includeFAQs,
    seoLevel = 80,
    targetAudience = ''
  } = options;

  // Parse keywords for better semantic richness
  const keywordsList = targetKeywords.split(',').map(k => k.trim());
  const primaryKeyword = keywordsList[0] || '';
  
  let content = "";
  
  // Create key takeaways at the top - Featured Snippet optimization
  content += `# ${createTitleFromKeywords(keywordsList)}\n\n`;
  
  // Add estimated reading time for better user experience
  const estimatedReadingTime = Math.ceil(articleLength / 200); // 200 words per minute
  content += `*Reading time: ${estimatedReadingTime} minutes*\n\n`;
  
  // Key Takeaways - optimized for featured snippets
  content += "## Key Takeaways\n\n";
  const takeaways = generateKeyTakeaways(keywordsList);
  content += takeaways + "\n\n";
  
  // Generate introduction with semantic LSI keywords
  content += generateIntroduction(keywordsList, tone, targetAudience) + "\n\n";
  
  // Table of Contents for improved UX and crawlability
  content += "## Table of Contents\n\n";
  const headings = generateHeadings(keywordsList, targetAudience);
  
  // Generate Table of Contents with anchor links
  headings.forEach((heading, index) => {
    content += `${index + 1}. [${heading}](#${slugify(heading)})\n`;
  });
  content += "\n\n";
  
  // Generate main content with semantic structure
  headings.forEach((heading, index) => {
    // Create proper heading IDs for anchor links
    content += `<h2 id="${slugify(heading)}">${heading}</h2>\n\n`;
    
    // Generate section with varying paragraph lengths and natural language
    content += generateSectionContent(heading, keywordsList, tone, Math.floor(articleLength / headings.length), targetAudience, seoLevel) + "\n\n";
    
    // Add schema-ready images with proper alt text
    if (includeImages && index % 2 === 0) {
      content += `![${heading} - ${primaryKeyword}](https://example.com/images/${slugify(heading)}.jpg)\n\n`;
    }
  });
  
  // Add FAQs for better SEO - structured as schema-ready content
  if (includeFAQs) {
    content += "## Frequently Asked Questions\n\n";
    content += generateFAQs(keywordsList, targetAudience) + "\n\n";
  }

  // Add a conclusion with final CTA
  content += "## Conclusion\n\n";
  content += generateConclusion(keywordsList, tone, targetAudience) + "\n\n";
  
  return content;
};

// Enhanced helper functions
const createTitleFromKeywords = (keywords: string[]): string => {
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

const generateKeyTakeaways = (keywords: string[]): string => {
  const primaryKeyword = keywords[0] || "this topic";
  
  // Create more natural-sounding takeaways with varying structures
  let takeaways = "";
  
  // Mix bullet points, bold elements, and occasional questions
  takeaways += "- This guide provides **practical knowledge** about " + primaryKeyword + " based on extensive research\n";
  takeaways += "- You'll discover actionable techniques that can be implemented right away\n";
  takeaways += "- We've gathered insights from professionals who work with " + primaryKeyword + " daily\n";
  takeaways += "- Learn what mistakes to avoid when dealing with " + primaryKeyword + "\n";
  takeaways += "- Find links to trustworthy resources for deeper learning\n";
  
  return takeaways;
};

const generateIntroduction = (keywords: string[], tone: string, targetAudience?: string): string => {
  const primaryKeyword = keywords[0] || "this topic";
  let intro = "";
  
  // Vary introduction based on tone and target audience for personalization
  switch(tone) {
    case "conversational":
      intro = `Have you ever wondered about ${primaryKeyword}? Trust me, you're not alone. Many people ask me about this all the time. I've spent years working with ${primaryKeyword}, and I'm sharing what I've learned the hard way.\n\n`;
      break;
    case "professional":
      intro = `${primaryKeyword} represents a critical area for professionals across industries. This analysis examines the key components related to ${primaryKeyword}, based on both data and real-world application.\n\n`;
      break;
    case "persuasive":
      intro = `${primaryKeyword} can transform how you approach your goals. This guide will show you exactly why and how to harness its potential, with evidence-based strategies that work.\n\n`;
      break;
    case "enthusiastic":
      intro = `${primaryKeyword} is one of the most exciting developments in recent years! I'm so glad you're interested in learning more about it. Let me share some amazing insights I've gathered.\n\n`;
      break;
    case "informative":
    default:
      intro = `Understanding ${primaryKeyword} matters in today's environment. This guide explores the topic completely, from basic concepts to advanced applications, helping you navigate this important area.\n\n`;
  }
  
  // Add a personalized paragraph based on target audience if provided
  if (targetAudience) {
    intro += `If you're ${targetAudience}, you'll find this guide particularly helpful as we address the specific challenges and opportunities you face with ${primaryKeyword}.\n\n`;
  }
  
  // Add a natural transition to the main content
  intro += `We'll cover various aspects of ${primaryKeyword}, including best practices, common challenges, and practical solutions. By the end, you'll have a clear understanding of how to approach ${primaryKeyword} effectively.\n\n`;
  
  // Add an occasional grammatical quirk for natural language
  const naturalLanguageVariations = [
    `Let's get started with the basics - its important to build a solid foundation.`,
    `Now lets explore what makes ${primaryKeyword} so valuable.`,
    `Your gonna learn a lot in the next few sections.`
  ];
  
  // Randomly select a natural language variation
  intro += naturalLanguageVariations[Math.floor(Math.random() * naturalLanguageVariations.length)] + "\n\n";
  
  return intro;
};

const generateHeadings = (keywords: string[], targetAudience?: string): string[] => {
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

const generateSectionContent = (heading: string, keywords: string[], tone: string, wordCount: number, targetAudience?: string, seoLevel = 80): string => {
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

const generateFAQs = (keywords: string[], targetAudience?: string): string => {
  const primaryKeyword = keywords[0] || 'this topic';
  
  // Create schema-ready FAQ section
  return `### What is the best way to get started with ${primaryKeyword}?\n
First, define your goals clearly. Then, research the basics and create a simple plan that addresses your specific needs. Many beginners make the mistake of jumping straight to advanced techniques without mastering fundamentals. I'd recommend spending a week learning before implementation.\n\n
### How much time should I invest in ${primaryKeyword}?\n
It depends on your goals and resources. For basic implementation, 5-10 hours weekly is usually sufficient. Complex projects might need full-time attention for several months. Start small and scale up as you gain experience and see results.\n\n
### What tools are essential for ${primaryKeyword}?\n
The most important tools include project management software, analytics platforms, and specialized tools designed for ${primaryKeyword}. I personally recommend starting with free options like [tool example] to learn the basics before investing in premium solutions like [another tool example].\n\n
### How do I measure success with ${primaryKeyword}?\n
Success metrics should align with your initial goals. Common indicators include ROI, efficiency improvements, user satisfaction, and milestone achievements. I suggest establishing baseline measurements before you begin and tracking progress weekly. Most people see meaningful results within 2-3 months.\n\n
### Can ${primaryKeyword} work for ${targetAudience || 'small businesses'}?\n
Absolutely! ${primaryKeyword} can be scaled to work for organizations of any size. The key is adapting the approach to your specific needs and resources. I've seen ${targetAudience || 'small businesses'} achieve impressive results by focusing on the most impactful elements rather than trying to do everything at once.\n\n`;
};

const generateConclusion = (keywords: string[], tone: string, targetAudience?: string): string => {
  const primaryKeyword = keywords[0] || 'this topic';
  
  // Create a personalized conclusion based on tone and audience
  let conclusion = `${primaryKeyword} continues to evolve, and staying informed about best practices is essential for long-term success. By implementing the strategies outlined in this guide, you'll be well-positioned to achieve your goals and overcome common obstacles.\n\n`;
  
  // Add tonal variations
  switch(tone) {
    case "conversational":
      conclusion += `I've been working with ${primaryKeyword} for years, and I still learn something new every day. Don't get discouraged if things don't go perfectly at first - thats normal! Keep at it, and you'll see progress.\n\n`;
      break;
    case "professional":
      conclusion += `Ongoing education and adaptation remain critical factors in maintaining efficacy with ${primaryKeyword} implementations. Regular evaluation of outcomes against objectives will facilitate continuous improvement.\n\n`;
      break;
    case "enthusiastic":
      conclusion += `I'm so excited for you to start implementing these ideas! You're gonna love seeing the results as they start coming in. Remember to enjoy the process!\n\n`;
      break;
    default:
      conclusion += `Remember that mastery comes with practice and persistence. Initial challenges are part of the learning process. With dedication and the right approach, you can become proficient in ${primaryKeyword}.\n\n`;
  }
  
  // Add audience-specific closing if applicable
  if (targetAudience) {
    conclusion += `As ${targetAudience}, you're uniquely positioned to benefit from these approaches to ${primaryKeyword}. Your perspective and experience bring valuable context to the implementation.\n\n`;
  }
  
  // Add a natural closing with minor colloquialisms
  conclusion += `I hope this guide has given you practical knowledge you can use right away. If you have questions or want to share your experiences with ${primaryKeyword}, leave a comment below or reach out directly. Good luck with your ${primaryKeyword} journey!\n\n`;
  
  return conclusion;
};

// Improved slugify function for better anchor links
const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Remove consecutive hyphens
    .trim();                   // Trim leading/trailing spaces
};

// Enhanced API call simulation with additional parameters
export const simulateApiCall = async (options: ContentGenerationOptions): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const content = generateSEOContent(options);
      resolve(content);
    }, 2000);
  });
};

// Add randomization to sentences and paragraph structures for uniqueness
const getRandomVariation = (baseText: string): string => {
  const variations = [
    baseText,
    `Actually, ${baseText.toLowerCase()}`,
    `I've found that ${baseText.toLowerCase()}`,
    `Based on my experience, ${baseText.toLowerCase()}`,
    `Many experts agree that ${baseText.toLowerCase()}`
  ];
  return variations[Math.floor(Math.random() * variations.length)];
};
