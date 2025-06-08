
/**
 * Content Template System - Generates appropriate content templates based on topic category
 */

export interface ContentTemplate {
  toneProfile: string;
  languageStyle: string;
  structureType: string;
  userFocusArea: string;
}

export function determineContentTemplate(primaryKeyword: string, targetAudience?: string): ContentTemplate {
  const keyword = primaryKeyword.toLowerCase();
  
  // Medical/Health Content Template
  if (isHealthRelated(keyword)) {
    return {
      toneProfile: 'empathetic-medical',
      languageStyle: 'clear-direct-reassuring',
      structureType: 'symptom-diagnosis-treatment',
      userFocusArea: 'health-concerns'
    };
  }
  
  // Business/Marketing Template
  if (keyword.includes('marketing') || keyword.includes('business') || keyword.includes('strategy')) {
    return {
      toneProfile: 'professional-strategic',
      languageStyle: 'data-driven-analytical',
      structureType: 'framework-implementation',
      userFocusArea: 'business-goals'
    };
  }
  
  // Technology Template
  if (keyword.includes('software') || keyword.includes('tech') || keyword.includes('programming')) {
    return {
      toneProfile: 'technical-helpful',
      languageStyle: 'precise-instructional',
      structureType: 'concept-implementation-optimization',
      userFocusArea: 'technical-learning'
    };
  }
  
  // Default informational template
  return {
    toneProfile: 'informative-helpful',
    languageStyle: 'clear-accessible',
    structureType: 'explanation-guidance',
    userFocusArea: 'knowledge-acquisition'
  };
}

export function isHealthRelated(keyword: string): boolean {
  const healthKeywords = [
    'vitamin', 'deficiency', 'symptoms', 'health', 'medical', 'disease', 
    'treatment', 'diagnosis', 'pain', 'depression', 'fatigue', 'infection',
    'nutrition', 'supplement', 'diet', 'wellness', 'fitness'
  ];
  
  return healthKeywords.some(healthWord => keyword.includes(healthWord));
}

export function generateNaturalLanguageVariations(primaryKeyword: string, template: ContentTemplate): string[] {
  const keyword = primaryKeyword.toLowerCase();
  
  if (template.toneProfile === 'empathetic-medical') {
    // Medical content uses natural, patient-friendly language
    if (keyword.includes('vitamin d deficiency symptoms')) {
      return [
        'signs of low vitamin D',
        'symptoms of this condition',
        'vitamin D insufficiency indicators',
        'low vitamin D levels',
        'this nutritional deficiency'
      ];
    }
    
    if (keyword.includes('symptoms')) {
      return [
        'signs and symptoms',
        'warning signs',
        'health indicators',
        'manifestations of this condition'
      ];
    }
  }
  
  // Generic natural variations
  const words = keyword.split(' ');
  const mainTopic = words[0];
  
  return [
    `understanding ${keyword}`,
    `dealing with ${keyword}`,
    `managing ${mainTopic} issues`,
    `addressing ${mainTopic} concerns`
  ];
}
