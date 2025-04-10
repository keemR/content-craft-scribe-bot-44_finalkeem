
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
      keyword.includes('recipe')) {
    return 'meal-planning';
  }
  
  // Marketing and business topics
  if (keyword.includes('marketing') || 
      keyword.includes('business') || 
      keyword.includes('seo') || 
      keyword.includes('sales') ||
      keyword.includes('affiliate')) {
    return 'marketing';
  }
  
  // Online income and work topics
  if (keyword.includes('money online') || 
      keyword.includes('freelance') || 
      keyword.includes('income') || 
      keyword.includes('earn') ||
      keyword.includes('dropshipping')) {
    return 'online-income';
  }
  
  // Technology topics
  if (keyword.includes('tech') || 
      keyword.includes('software') || 
      keyword.includes('app') || 
      keyword.includes('developer') ||
      keyword.includes('coding')) {
    return 'technology';
  }
  
  // Health topics
  if (keyword.includes('health') || 
      keyword.includes('fitness') || 
      keyword.includes('exercise') || 
      keyword.includes('wellness')) {
    return 'health-fitness';
  }
  
  // Default category for other topics
  return 'general';
}
