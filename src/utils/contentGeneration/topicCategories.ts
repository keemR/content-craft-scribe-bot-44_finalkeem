
export type TopicCategory = 
  | 'health-fitness'
  | 'nutrition'
  | 'medical'
  | 'online-income'
  | 'marketing'
  | 'business'
  | 'technology'
  | 'finance'
  | 'lifestyle'
  | 'education'
  | 'general';

export function determineTopicCategory(keyword: string): TopicCategory {
  const lowerKeyword = keyword.toLowerCase();
  
  // Online income and business keywords
  if (lowerKeyword.includes('make money') || 
      lowerKeyword.includes('earn money') ||
      lowerKeyword.includes('online income') ||
      lowerKeyword.includes('work from home') ||
      lowerKeyword.includes('side hustle') ||
      lowerKeyword.includes('passive income') ||
      lowerKeyword.includes('freelancing') ||
      lowerKeyword.includes('affiliate marketing') ||
      lowerKeyword.includes('dropshipping') ||
      lowerKeyword.includes('online business')) {
    return 'online-income';
  }
  
  // Marketing keywords
  if (lowerKeyword.includes('marketing') ||
      lowerKeyword.includes('seo') ||
      lowerKeyword.includes('social media') ||
      lowerKeyword.includes('advertising') ||
      lowerKeyword.includes('content marketing')) {
    return 'marketing';
  }
  
  // Business keywords
  if (lowerKeyword.includes('business') ||
      lowerKeyword.includes('entrepreneur') ||
      lowerKeyword.includes('startup') ||
      lowerKeyword.includes('investment')) {
    return 'business';
  }
  
  // Health and medical keywords
  if (lowerKeyword.includes('health') ||
      lowerKeyword.includes('medical') ||
      lowerKeyword.includes('disease') ||
      lowerKeyword.includes('symptom') ||
      lowerKeyword.includes('treatment') ||
      lowerKeyword.includes('diagnosis')) {
    return 'medical';
  }
  
  // Nutrition keywords
  if (lowerKeyword.includes('nutrition') ||
      lowerKeyword.includes('vitamin') ||
      lowerKeyword.includes('diet') ||
      lowerKeyword.includes('food') ||
      lowerKeyword.includes('supplement')) {
    return 'nutrition';
  }
  
  // Fitness keywords
  if (lowerKeyword.includes('fitness') ||
      lowerKeyword.includes('exercise') ||
      lowerKeyword.includes('workout') ||
      lowerKeyword.includes('training')) {
    return 'health-fitness';
  }
  
  return 'general';
}
