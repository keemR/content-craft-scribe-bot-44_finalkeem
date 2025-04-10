
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
  let headings = [
    `Understanding Nutrition Basics on a Budget`,
    `Best Value Foods: Nutrition Per Dollar`,
    `7-Day Budget Meal Plan Template`,
    `Smart Shopping Strategies That Save Money`,
    `Time-Saving Meal Prep Techniques`,
    `Seasonal Eating Guide`,
    `Family-Friendly Budget Recipes`,
    `Reducing Food Waste and Stretching Ingredients`
  ];
  
  // Customize for specific audiences
  if (targetAudience) {
    if (targetAudience.toLowerCase().includes('famil')) {
      headings[2] = `Family-Friendly Meal Plan for Picky Eaters`;
      headings[6] = `Kid-Approved Budget Meals`;
    } else if (targetAudience.toLowerCase().includes('student') || targetAudience.toLowerCase().includes('college')) {
      headings[2] = `Student Meal Plan: No Kitchen Required`;
      headings[4] = `Dorm Room Meal Prep Hacks`;
    } else if (targetAudience.toLowerCase().includes('senior') || targetAudience.toLowerCase().includes('elder')) {
      headings[2] = `Senior Nutrition: Meals for One or Two`;
      headings[6] = `Easy Meals for Older Adults on Fixed Incomes`;
    }
  }
  
  return headings;
}

function generateMarketingHeadings(primaryKeyword: string, targetAudience?: string): string[] {
  const currentYear = new Date().getFullYear();
  
  return [
    `What is ${primaryKeyword}?`,
    `History and Evolution of ${primaryKeyword}`,
    `Building an Effective ${primaryKeyword} Strategy`,
    `Key Metrics for Measuring Success`,
    `Common Challenges and Solutions`,
    `Essential Tools and Resources`,
    `Case Studies: Success Stories`,
    `Future Trends (${currentYear} and Beyond)`
  ];
}

function generateOnlineIncomeHeadings(primaryKeyword: string, targetAudience?: string): string[] {
  return [
    `Getting Started with ${primaryKeyword}`,
    `Required Skills and Tools`,
    `Step-by-Step Implementation Guide`,
    `Common Challenges and Solutions`,
    `Scaling Your Income: Next Steps`,
    `Financial Management and Taxes`,
    `Real-Life Success Stories`,
    `Avoiding Scams and Pitfalls`
  ];
}

function generateHealthFitnessHeadings(primaryKeyword: string, targetAudience?: string): string[] {
  return [
    `The Science Behind ${primaryKeyword}`,
    `Beginner's Guide to ${primaryKeyword}`,
    `Creating Your Personal Plan`,
    `Overcoming Common Plateaus`,
    `Nutrition to Support Your Goals`,
    `Essential Equipment and Resources`,
    `Tracking Progress Effectively`,
    `Advanced Techniques for Best Results`
  ];
}

function generateTechnologyHeadings(primaryKeyword: string, targetAudience?: string): string[] {
  return [
    `What is ${primaryKeyword}?`,
    `Key Development Milestones`,
    `Implementation Guide`,
    `Optimization Best Practices`,
    `Troubleshooting Common Issues`,
    `Integration with Other Systems`,
    `Security and Compliance`,
    `Future Developments and Updates`
  ];
}

function generateGenericHeadings(primaryKeyword: string, targetAudience?: string, keywords: string[] = []): string[] {
  // Create more specific, semantic-rich headings
  const baseHeadings = [
    `What is ${primaryKeyword}?`,
    `History and Development`,
    `Implementation Guide`,
    `Common Challenges and Solutions`,
    `Best Practices for Success`,
    `Tools and Resources`,
    `Case Studies and Examples`,
    `Future Trends and Developments`
  ];
  
  // If target audience is specified, customize a heading for them
  if (targetAudience) {
    baseHeadings[2] = `${primaryKeyword} Guide for ${targetAudience}`;
  }
  
  // Add occasional related keywords to headings for better semantic SEO
  if (keywords.length > 1) {
    const secondaryKeyword = keywords[1];
    baseHeadings[4] = `${primaryKeyword} and ${secondaryKeyword}: Best Practices`;
  }
  
  return baseHeadings;
}
