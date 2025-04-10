
import { slugify } from '../helpers';

export const generateHeadings = (keywords: string[], topicCategory: string = 'general', targetAudience?: string): string[] => {
  const primaryKeyword = keywords[0] || 'This Topic';
  
  // Topic-specific headings based on content category
  if (topicCategory === 'meal-planning') {
    return generateMealPlanningHeadings(primaryKeyword, targetAudience);
  } else if (topicCategory === 'marketing') {
    return generateMarketingHeadings(primaryKeyword, targetAudience);
  } else if (topicCategory === 'online-income') {
    return generateOnlineIncomeHeadings(primaryKeyword, targetAudience);
  } else if (topicCategory === 'health-fitness') {
    return generateHealthFitnessHeadings(primaryKeyword, targetAudience);
  } else if (topicCategory === 'technology') {
    return generateTechnologyHeadings(primaryKeyword, targetAudience);
  }
  
  // Generic headings for other topics
  return generateGenericHeadings(primaryKeyword, targetAudience, keywords);
};

function generateMealPlanningHeadings(primaryKeyword: string, targetAudience?: string): string[] {
  const currentYear = new Date().getFullYear();
  
  let headings = [
    `Understanding ${primaryKeyword}: Balancing Nutrition and Cost`,
    `Budget-Friendly Nutrition: Essential Foods That Deliver Maximum Value`,
    `Weekly Meal Plan: 7 Days of Affordable, Nutritious Family Meals`,
    `Smart Shopping Strategies: Where and How to Buy Healthy Foods for Less`,
    `Meal Prep Techniques to Save Time and Money`,
    `Seasonal Eating: Using Nature's Calendar to Reduce Food Costs`,
    `Family-Friendly Recipe Ideas That Won't Break the Bank`,
    `Stretching Your Food Dollar: Creative Ways to Reduce Waste and Extend Ingredients`
  ];
  
  // Customize for specific audiences
  if (targetAudience) {
    if (targetAudience.includes('famil')) {
      headings[2] = `Family-Friendly Meal Plan: Keeping Children Healthy on a Limited Budget`;
      headings[6] = `Kid-Approved Recipes: Affordable Meals Children Will Actually Eat`;
    } else if (targetAudience.includes('student') || targetAudience.includes('college')) {
      headings[2] = `Student Meal Plan: Dorm-Friendly Nutrition on a Tight Budget`;
      headings[4] = `No-Kitchen Meal Prep: Healthy Eating with Limited Cooking Facilities`;
    } else if (targetAudience.includes('senior') || targetAudience.includes('elder')) {
      headings[2] = `Senior Nutrition: Balanced Meals for Older Adults on Fixed Incomes`;
      headings[6] = `Cooking for One or Two: Preventing Waste While Maintaining Variety`;
    }
  }
  
  return headings;
}

function generateMarketingHeadings(primaryKeyword: string, targetAudience?: string): string[] {
  const currentYear = new Date().getFullYear();
  
  return [
    `What is ${primaryKeyword}? Core Concepts and Strategic Overview`,
    `The Evolution of ${primaryKeyword}: From Past Approaches to Current Best Practices`,
    `Building an Effective ${primaryKeyword} Strategy: Key Components for Success`,
    `Measuring ${primaryKeyword} Success: Essential Metrics and Analytics`,
    `Common ${primaryKeyword} Challenges and Their Solutions`,
    `Tools and Resources for Optimizing Your ${primaryKeyword} Efforts`,
    `Case Studies: Successful ${primaryKeyword} Implementations and Their Results`,
    `${primaryKeyword} Trends for ${currentYear} and Beyond: What's Next?`
  ];
}

function generateOnlineIncomeHeadings(primaryKeyword: string, targetAudience?: string): string[] {
  return [
    `${primaryKeyword}: Understanding the Opportunities and Reality`,
    `Getting Started with ${primaryKeyword}: Essential First Steps`,
    `Required Skills and Tools for Success with ${primaryKeyword}`,
    `Common Challenges in ${primaryKeyword} and How to Overcome Them`,
    `Scaling Your ${primaryKeyword}: Moving from Side Hustle to Full-Time Income`,
    `Financial Management for ${primaryKeyword}: Taxes, Expenses, and Profit Tracking`,
    `Real-Life Success Stories: Case Studies in ${primaryKeyword}`,
    `Avoiding Scams and Identifying Legitimate ${primaryKeyword} Opportunities`
  ];
}

function generateHealthFitnessHeadings(primaryKeyword: string, targetAudience?: string): string[] {
  return [
    `${primaryKeyword}: Understanding the Science and Benefits`,
    `Getting Started with ${primaryKeyword}: A Beginner's Guide`,
    `Creating Your Personalized ${primaryKeyword} Plan`,
    `Overcoming Common ${primaryKeyword} Obstacles and Plateaus`,
    `Nutrition Strategies to Complement Your ${primaryKeyword} Routine`,
    `Tools, Equipment, and Resources for ${primaryKeyword}`,
    `Tracking Progress and Staying Motivated with ${primaryKeyword}`,
    `Advanced ${primaryKeyword} Techniques for Next-Level Results`
  ];
}

function generateTechnologyHeadings(primaryKeyword: string, targetAudience?: string): string[] {
  const currentYear = new Date().getFullYear();
  
  return [
    `Understanding ${primaryKeyword}: Core Technology and Applications`,
    `The Evolution of ${primaryKeyword}: Key Developments and Milestones`,
    `Implementing ${primaryKeyword}: Setup and Configuration Guide`,
    `Best Practices for ${primaryKeyword} Optimization and Performance`,
    `Addressing Common ${primaryKeyword} Challenges and Issues`,
    `Integration Options: Connecting ${primaryKeyword} with Other Systems`,
    `${primaryKeyword} Security and Compliance Considerations`,
    `Future Directions in ${primaryKeyword}: Upcoming Features and Innovations`
  ];
}

function generateGenericHeadings(primaryKeyword: string, targetAudience?: string, keywords: string[] = []): string[] {
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
}
