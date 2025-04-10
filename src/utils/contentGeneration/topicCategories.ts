
/**
 * Determines the topic category based on keywords to enable content specialization
 */
export function determineTopicCategory(primaryKeyword: string): string {
  const keyword = primaryKeyword.toLowerCase();
  
  // Diet, nutrition, and meal planning
  if (keyword.includes('meal') || 
      keyword.includes('diet') || 
      keyword.includes('eat') || 
      keyword.includes('food') || 
      keyword.includes('nutrition') || 
      keyword.includes('recipe') ||
      keyword.includes('grocery') ||
      keyword.includes('cooking') ||
      keyword.includes('budget meal')) {
    return 'meal-planning';
  }
  
  // Marketing and business topics
  if (keyword.includes('marketing') || 
      keyword.includes('business') || 
      keyword.includes('seo') || 
      keyword.includes('sales') ||
      keyword.includes('affiliate') ||
      keyword.includes('ecommerce') ||
      keyword.includes('brand') ||
      keyword.includes('advertising')) {
    return 'marketing';
  }
  
  // Online income and work topics
  if (keyword.includes('money online') || 
      keyword.includes('freelance') || 
      keyword.includes('income') || 
      keyword.includes('earn') ||
      keyword.includes('dropshipping') ||
      keyword.includes('passive income') ||
      keyword.includes('side hustle') ||
      keyword.includes('work from home')) {
    return 'online-income';
  }
  
  // Technology topics
  if (keyword.includes('tech') || 
      keyword.includes('software') || 
      keyword.includes('app') || 
      keyword.includes('developer') ||
      keyword.includes('coding') ||
      keyword.includes('program') ||
      keyword.includes('digital') ||
      keyword.includes('ai') ||
      keyword.includes('artificial intelligence')) {
    return 'technology';
  }
  
  // Health topics
  if (keyword.includes('health') || 
      keyword.includes('fitness') || 
      keyword.includes('exercise') || 
      keyword.includes('wellness') ||
      keyword.includes('workout') ||
      keyword.includes('diet') ||
      keyword.includes('nutrition') ||
      keyword.includes('weight loss')) {
    return 'health-fitness';
  }
  
  // Default category for other topics
  return 'general';
}
