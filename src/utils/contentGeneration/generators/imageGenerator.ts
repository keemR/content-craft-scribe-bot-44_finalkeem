
import { slugify } from '../helpers';

/**
 * Generates topic-specific image tags with helpful captions
 */
export function generateTopicSpecificImage(heading: string, primaryKeyword: string, topicCategory: string): string {
  // Diet and meal planning images
  if (topicCategory === 'meal-planning') {
    if (heading.includes('Plan')) {
      return `![Weekly meal prep with budget-friendly ingredients](https://example.com/images/meal-prep-budget.jpg)\n*A sample weekly meal prep using affordable, nutrient-dense foods like beans, brown rice, and seasonal vegetables*`;
    }
    if (heading.includes('Budget')) {
      return `![Price comparison of healthy vs processed foods](https://example.com/images/food-price-comparison.jpg)\n*Price comparison chart showing how whole foods can be more economical than processed alternatives when planned properly*`;
    }
    return `![Healthy budget-friendly meal](https://example.com/images/${slugify(heading)}.jpg)\n*${heading} - affordable, nutritious options for families*`;
  }
  
  // Marketing images
  if (topicCategory === 'marketing') {
    return `![${heading} strategy visualization](https://example.com/images/${slugify(heading)}.jpg)\n*Visual representation of effective ${primaryKeyword} tactics*`;
  }
  
  // Online income images
  if (topicCategory === 'online-income') {
    return `![Real results from ${heading}](https://example.com/images/${slugify(heading)}.jpg)\n*Actual earnings example from implementing these ${primaryKeyword} strategies*`;
  }
  
  // Generic image fallback
  return `![${heading}](https://example.com/images/${slugify(heading)}.jpg)\n*Visualization of ${heading} concepts*`;
}
