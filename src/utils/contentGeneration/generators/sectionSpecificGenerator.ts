
/**
 * Section-Specific Content Generator
 * Handles different types of content sections with specialized logic
 */

import { generateDosageProtocolsTable, generateClinicalInterpretations, generateMonitoringTimeline, generateStructuredSymptomList } from './structuredContentGenerator';
import { generateMedicalReviewerBox, addInlineCitations, hyperlinkStudyMentions } from './eatSignalsGenerator';

export type SectionType = 'physiology' | 'symptoms' | 'testing' | 'interpretation' | 'treatment' | 'monitoring' | 'risk-factors' | 'generic';

/**
 * Determine section type based on heading content
 */
export function determineSectionType(heading: string): SectionType {
  const headingLower = heading.toLowerCase();
  
  if (headingLower.includes('physiology') || headingLower.includes('understanding') || headingLower.includes('function')) {
    return 'physiology';
  }
  if (headingLower.includes('symptoms') || headingLower.includes('signs') || headingLower.includes('recognizing')) {
    return 'symptoms';
  }
  if (headingLower.includes('testing') || headingLower.includes('diagnostic')) {
    return 'testing';
  }
  if (headingLower.includes('interpreting') || headingLower.includes('results') || headingLower.includes('numbers')) {
    return 'interpretation';
  }
  if (headingLower.includes('treatment') || headingLower.includes('protocols') || headingLower.includes('evidence-based')) {
    return 'treatment';
  }
  if (headingLower.includes('monitoring') || headingLower.includes('progress') || headingLower.includes('management')) {
    return 'monitoring';
  }
  if (headingLower.includes('risk') || headingLower.includes('factors') || headingLower.includes('vulnerable')) {
    return 'risk-factors';
  }
  
  return 'generic';
}

/**
 * Generate section content based on specific type
 */
export function generateSectionSpecificContent(
  heading: string,
  primaryKeyword: string,
  semanticKeyword: string,
  serpData: any,
  sectionType: SectionType,
  sectionIndex: number
): string {
  const relevantStat = serpData.keyStatistics?.[sectionIndex] || serpData.keyStatistics?.[0];
  let content = "";
  
  switch (sectionType) {
    case 'physiology':
      content = generatePhysiologyContent(primaryKeyword, semanticKeyword, relevantStat);
      break;
      
    case 'symptoms':
      content = generateSymptomsContent(primaryKeyword, semanticKeyword, relevantStat);
      break;
      
    case 'testing':
      content = generateTestingContent(primaryKeyword, semanticKeyword, relevantStat);
      break;
      
    case 'interpretation':
      content = generateInterpretationContent(primaryKeyword, semanticKeyword, relevantStat);
      break;
      
    case 'treatment':
      content = generateTreatmentContent(primaryKeyword, semanticKeyword, relevantStat);
      break;
      
    case 'monitoring':
      content = generateMonitoringContent(primaryKeyword, semanticKeyword, relevantStat);
      break;
      
    case 'risk-factors':
      content = generateRiskFactorsContent(primaryKeyword, semanticKeyword, relevantStat);
      break;
      
    default:
      content = generateGenericContent(heading, primaryKeyword, semanticKeyword, relevantStat);
      break;
  }
  
  // Apply E-E-A-T enhancements
  content = addInlineCitations(content);
  content = hyperlinkStudyMentions(content);
  
  return content;
}

function generatePhysiologyContent(keyword: string, semanticKeyword: string, stat: string): string {
  let content = `The human body's relationship with ${semanticKeyword} involves complex physiological processes that are essential for optimal health. `;
  
  if (stat) {
    content += `Clinical research demonstrates that ${stat.toLowerCase()}, providing crucial insights for medical understanding.\n\n`;
  }
  
  if (keyword.toLowerCase().includes('vitamin d')) {
    content += `### The Vitamin D System\n\n`;
    content += `**Step 1: Initial Production or Intake**\n`;
    content += `Vitamin D begins as cholecalciferol (D3) from sun exposure or supplements, or ergocalciferol (D2) from certain foods. Approximately 80-90% should come from skin synthesis, with the remainder from dietary sources.\n\n`;
    content += `**Step 2: Liver Conversion**\n`;
    content += `The liver converts vitamin D to 25-hydroxyvitamin D [25(OH)D], the storage form measured in blood tests. This step rarely fails unless there is severe liver disease.\n\n`;
    content += `**Step 3: Kidney Activation**\n`;
    content += `Kidneys convert 25(OH)D to the active hormone 1,25-dihydroxyvitamin D [1,25(OH)2D or calcitriol]. This step is tightly regulated by parathyroid hormone (PTH), calcium levels, and kidney function.\n\n`;
    content += `**Step 4: Cellular Action**\n`;
    content += `Calcitriol binds to vitamin D receptors (VDR) in target tissues, influencing over 200 genes involved in calcium metabolism, immune function, and cellular growth regulation.\n\n`;
  } else {
    content += `### Biological Mechanisms\n\n`;
    content += `Understanding how ${semanticKeyword} affects the body requires examining both direct physiological effects and downstream consequences. The body's response involves multiple organ systems working in coordination.\n\n`;
    content += `### Clinical Significance\n\n`;
    content += `Medical research has identified specific pathways and mechanisms that explain how ${semanticKeyword} influences health outcomes. This understanding forms the foundation for evidence-based treatment approaches.\n\n`;
  }
  
  return content;
}

function generateSymptomsContent(keyword: string, semanticKeyword: string, stat: string): string {
  let content = `Recognizing the signs and symptoms of ${semanticKeyword} requires understanding both obvious manifestations and subtle indicators that are often overlooked. `;
  
  if (stat) {
    content += `Medical studies show that ${stat.toLowerCase()}, emphasizing the importance of comprehensive symptom assessment.\n\n`;
  }
  
  content += generateStructuredSymptomList(keyword, 'symptoms');
  
  return content;
}

function generateTestingContent(keyword: string, semanticKeyword: string, stat: string): string {
  let content = `Accurate diagnostic testing provides the foundation for effective ${semanticKeyword} management. `;
  
  if (stat) {
    content += `Laboratory medicine standards indicate that ${stat.toLowerCase()}, establishing clear testing protocols.\n\n`;
  }
  
  if (keyword.toLowerCase().includes('vitamin d')) {
    content += `### The Gold Standard: 25(OH)D Testing\n\n`;
    content += `**Why 25(OH)D Is Measured**\n`;
    content += `The 25-hydroxyvitamin D test measures stored vitamin D, which has a half-life of 2-3 weeks, providing an accurate picture of vitamin D status over the past 1-2 months.\n\n`;
    content += `**Interpreting Results (ng/mL)**:\n`;
    content += `- **Severe Deficiency**: <10 ng/mL - Risk of rickets/osteomalacia\n`;
    content += `- **Deficiency**: 10-20 ng/mL - Increased disease risk\n`;
    content += `- **Insufficiency**: 20-30 ng/mL - Suboptimal for health\n`;
    content += `- **Adequate**: 30-50 ng/mL - Optimal range for most people\n`;
    content += `- **High**: 50-100 ng/mL - Generally safe with monitoring\n`;
    content += `- **Toxic**: >100 ng/mL - Risk of hypercalcemia\n\n`;
    content += `### When to Test\n\n`;
    content += `**Initial Testing**: Anyone with symptoms, risk factors, or living above 35°N latitude should have baseline testing.\n\n`;
    content += `**Follow-up Testing**: Retest 6-8 weeks after starting supplementation, then every 3-6 months until stable. Annual testing is sufficient for maintenance.\n\n`;
    content += `**Seasonal Considerations**: Test at the end of winter (February-April) for lowest levels and end of summer (August-October) for highest levels.\n\n`;
  } else {
    content += `### Diagnostic Protocols\n\n`;
    content += `Modern diagnostic approaches combine clinical assessment with laboratory testing to provide comprehensive evaluation. This multi-modal approach ensures accurate diagnosis and appropriate treatment planning.\n\n`;
    content += `### Testing Interpretation\n\n`;
    content += `Understanding test results requires considering reference ranges, individual factors, and clinical context. Healthcare providers integrate multiple data points to develop treatment recommendations.\n\n`;
  }
  
  return content;
}

function generateInterpretationContent(keyword: string, semanticKeyword: string, stat: string): string {
  return generateClinicalInterpretations(keyword);
}

function generateTreatmentContent(keyword: string, semanticKeyword: string, stat: string): string {
  let content = `Medical treatment protocols are based on extensive clinical research and established guidelines from organizations like the Endocrine Society and the Institute of Medicine. `;
  
  if (stat) {
    content += `These evidence-based approaches demonstrate that ${stat.toLowerCase()}, validating their effectiveness through clinical trials and real-world outcomes.\n\n`;
  }
  
  content += generateDosageProtocolsTable(keyword);
  
  return content;
}

function generateMonitoringContent(keyword: string, semanticKeyword: string, stat: string): string {
  return generateMonitoringTimeline(keyword);
}

function generateRiskFactorsContent(keyword: string, semanticKeyword: string, stat: string): string {
  let content = `Certain populations and individuals face elevated risks for ${semanticKeyword}, requiring targeted screening and prevention strategies. `;
  
  if (stat) {
    content += `Epidemiological data reveals that ${stat.toLowerCase()}, informing evidence-based prevention protocols.\n\n`;
  }
  
  content += `### High-Risk Populations\n\n`;
  content += `**Geographic Factors**: Individuals living above 35°N latitude (including most of the United States) have insufficient UVB exposure during winter months. This affects approximately 77% of the U.S. population.\n\n`;
  content += `**Age-Related Risk**: Adults over 65 have reduced skin synthesis capacity (75% decrease) and often have limited sun exposure. Additionally, kidney function naturally declines with age, reducing activation efficiency.\n\n`;
  content += `**Skin Pigmentation**: Melanin acts as natural sunscreen, requiring 3-6 times longer sun exposure for equivalent vitamin D synthesis. This particularly affects individuals with darker skin living in northern climates.\n\n`;
  content += `### Medical Risk Factors\n\n`;
  content += `**Gastrointestinal Disorders**: Crohn's disease, celiac disease, and gastric bypass surgery reduce absorption by 50-80%. These conditions require specialized monitoring and higher-dose supplementation.\n\n`;
  content += `**Kidney and Liver Disease**: Chronic kidney disease affects activation, while liver disease impairs initial conversion. Both require medical supervision for supplementation.\n\n`;
  content += `**Medication Interactions**: Corticosteroids, anticonvulsants, and certain cholesterol medications can significantly reduce vitamin D effectiveness.\n\n`;
  
  return content;
}

function generateGenericContent(heading: string, keyword: string, semanticKeyword: string, stat: string): string {
  let content = `This critical aspect of ${semanticKeyword} management requires detailed understanding of both clinical evidence and practical implementation. `;
  
  if (stat) {
    content += `Medical research demonstrates that ${stat.toLowerCase()}, providing clear guidance for clinical practice.\n\n`;
  }
  
  content += `### Evidence-Based Approach\n\n`;
  content += `Current medical guidelines emphasize individualized treatment plans based on patient-specific factors, risk assessment, and response monitoring. This personalized approach optimizes outcomes while minimizing risks.\n\n`;
  content += `### Clinical Implementation\n\n`;
  content += `Successful implementation requires coordination between patients and healthcare providers, with regular monitoring and adjustment based on response patterns and changing circumstances.\n\n`;
  
  return content;
}
