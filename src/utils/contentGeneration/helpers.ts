
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
export const createTitleFromKeywords = (keywords: string[], topicCategory: string = 'general'): string => {
  if (!keywords.length) return 'Comprehensive Guide';
  
  // Make title more compelling and clickable
  const primaryKeyword = keywords[0];
  const currentYear = new Date().getFullYear();
  
  // Create topic-specific titles
  if (topicCategory === 'meal-planning') {
    const mealPlanningTitles = [
      `Eating Healthy on a Budget: A Complete Family Guide (${currentYear})`,
      `The Budget-Friendly Meal Plan: Nutrition Without Breaking the Bank`,
      `Affordable Nutrition: How to Feed Your Family Well for Less`,
      `Smart Grocery Shopping: The Complete Guide to Healthy Eating on a Budget`,
      `Family Meal Planning on a Budget: The Ultimate Guide`
    ];
    return mealPlanningTitles[Math.floor(Math.random() * mealPlanningTitles.length)];
  }
  
  if (topicCategory === 'online-income') {
    const onlineIncomeTitles = [
      `${primaryKeyword}: A Realistic Guide to Building Income Online`,
      `How to Successfully Start ${primaryKeyword} in ${currentYear}`,
      `The Truth About ${primaryKeyword}: What Actually Works`,
      `${primaryKeyword}: From Side Hustle to Sustainable Income`,
      `Building ${primaryKeyword}: Practical Strategies That Work`
    ];
    return onlineIncomeTitles[Math.floor(Math.random() * onlineIncomeTitles.length)];
  }
  
  if (topicCategory === 'marketing') {
    const marketingTitles = [
      `${primaryKeyword} Strategy Guide: Driving Results in ${currentYear}`,
      `Mastering ${primaryKeyword}: A Data-Driven Approach`,
      `The Complete ${primaryKeyword} Playbook for Growth`,
      `${primaryKeyword} Excellence: Strategies That Deliver Measurable Results`,
      `Building Effective ${primaryKeyword} Systems: A Comprehensive Guide`
    ];
    return marketingTitles[Math.floor(Math.random() * marketingTitles.length)];
  }
  
  if (topicCategory === 'health-fitness') {
    const healthFitnessTitles = [
      `${primaryKeyword}: Science-Based Approaches for Real Results`,
      `The Complete Guide to ${primaryKeyword}: From Beginner to Advanced`,
      `Sustainable ${primaryKeyword}: Building Lifelong Habits`,
      `${primaryKeyword} Fundamentals: A Practical Approach to Better Health`,
      `Mastering ${primaryKeyword}: Evidence-Based Strategies for Success`
    ];
    return healthFitnessTitles[Math.floor(Math.random() * healthFitnessTitles.length)];
  }
  
  if (topicCategory === 'technology') {
    const technologyTitles = [
      `Implementing ${primaryKeyword}: A Comprehensive Guide for Success`,
      `${primaryKeyword} Deployment: Strategic Approaches for Maximum Value`,
      `The Complete ${primaryKeyword} Handbook: From Evaluation to Optimization`,
      `Mastering ${primaryKeyword}: Best Practices for ${currentYear}`,
      `${primaryKeyword} Integration Guide: Seamless Implementation Strategies`
    ];
    return technologyTitles[Math.floor(Math.random() * technologyTitles.length)];
  }
  
  // Generic title patterns that work well for SEO
  const titlePatterns = [
    `The Ultimate Guide to ${primaryKeyword} (${currentYear})`,
    `${primaryKeyword}: A Comprehensive Guide for Success`,
    `How to Master ${primaryKeyword}: Expert Strategies`,
    `The Complete ${primaryKeyword} Guide: Everything You Need to Know`,
    `${primaryKeyword}: Essential Techniques and Best Practices`
  ];
  
  // Randomly select a pattern for uniqueness
  return titlePatterns[Math.floor(Math.random() * titlePatterns.length)];
};
