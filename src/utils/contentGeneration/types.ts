
export interface ContentGenerationOptions {
  researchData: string;
  targetKeywords: string;
  articleLength: number;
  tone: string;
  includeImages: boolean;
  includeFAQs: boolean;
  seoLevel?: number;
  targetAudience?: string;
  
  // Added fields for better quality
  contentSpecificity?: number; // 1-100 scale for how specific vs. general content should be
  includeExamples?: boolean; // Whether to include specific examples
  includeStatistics?: boolean; // Whether to include relevant statistics
  useCaseStudies?: boolean; // Whether to include detailed case studies
  preventRepetition?: boolean; // Flag to specifically prevent phrase repetition
}

// Types for content structures
export interface HistoricalMilestone {
  year: string;
  event: string;
}

export interface ImplementationStep {
  title: string;
  description: string;
}

export interface CommonMistake {
  title: string;
  description: string;
}

export interface Challenge {
  title: string;
  description: string;
  solution: string;
}

export interface BestPractice {
  title: string;
  description: string;
  example?: string;
}

export interface ToolCategory {
  name: string;
  description: string;
  tools: Tool[];
}

export interface Tool {
  name: string;
  url?: string;
  description: string;
  pricing?: string;
}

export interface CaseStudy {
  title: string;
  background: string;
  challenge: string;
  strategy: string;
  results: string;
  takeaway: string;
}

export interface FutureTrend {
  title: string;
  description: string;
  impact: string;
}

export interface ComparisonPoint {
  aspect: string;
  primary: string;
  secondary: string;
}

export interface KeyPoint {
  title: string;
  description: string;
}

// New types for meal planning content
export interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string;
  prepTime: string;
  cost: string;
  servings: number;
  nutritionInfo?: string;
}

export interface MealPlan {
  day: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks: string[];
  estimatedCost: string;
}

export interface BudgetTip {
  title: string;
  description: string;
  estimatedSavings: string;
}

export interface NutritionGuide {
  category: string;
  recommendations: string[];
  budgetOptions: string[];
}

export interface GroceryItem {
  name: string;
  category: string;
  averagePrice: string;
  budgetAlternatives?: string[];
  nutritionalValue: string;
}

export interface SeasonalProduce {
  season: string;
  fruits: string[];
  vegetables: string[];
  savingTips: string;
}
