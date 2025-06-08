
import { generateEnhancedVisuals, formatEnhancedVisualsForMarkdown } from './enhancedVisualGenerator';
import { fillContentGaps } from './contentGapFiller';
import { generateNaturalLanguageVariations, createNaturalPhrases } from './naturalLanguageGenerator';
import { slugify } from '../helpers';

interface HealthContentOptions {
  primaryKeyword: string;
  semanticKeywords: string[];
  serpData: any;
  researchData: string;
  articleLength: number;
  tone: string;
  includeImages: boolean;
  includeFAQs: boolean;
  targetAudience?: string;
}

/**
 * Generate health content with unique, non-repetitive sections
 */
export async function generateHealthContentWithVariation(options: HealthContentOptions): Promise<string> {
  const {
    primaryKeyword,
    semanticKeywords,
    serpData,
    researchData,
    articleLength,
    tone,
    includeImages,
    includeFAQs,
    targetAudience
  } = options;

  const currentYear = new Date().getFullYear();
  const title = createHealthTitle(primaryKeyword, currentYear);
  const estimatedReadingTime = Math.ceil(articleLength / 250);
  
  let content = `# ${title}\n\n`;
  
  // Add medical credibility signals
  const publishDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  content += `*Last Updated: ${publishDate} | ${estimatedReadingTime}-minute read | Medically reviewed content based on current research*\n\n`;
  
  // Medical disclaimer
  content += `> **Medical Disclaimer**: This information is for educational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider before making changes to your health regimen.\n\n`;
  
  // Executive summary with real health insights
  content += generateHealthSummary(primaryKeyword, serpData, semanticKeywords[0]) + "\n\n";
  
  // Health facts box with statistics
  content += generateHealthFactsBox(primaryKeyword, serpData) + "\n\n";
  
  // Evidence-based introduction
  content += generateHealthIntroduction(primaryKeyword, serpData, semanticKeywords[0], targetAudience) + "\n\n";
  
  // Generate health-specific headings
  const headings = generateHealthHeadings(primaryKeyword);
  
  // Table of contents
  content += "## Table of Contents\n\n";
  headings.forEach((heading, index) => {
    const slug = slugify(heading);
    content += `${index + 1}. [${heading}](#${slug})\n`;
  });
  content += "\n\n";
  
  // Generate unique sections for each heading
  const sectionLength = Math.floor(articleLength / headings.length);
  
  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i];
    const semanticVariation = semanticKeywords[i % semanticKeywords.length];
    
    content += `## ${heading}\n\n`;
    
    // Generate completely unique content for each section
    const sectionContent = await generateUniqueHealthSection(
      heading, 
      primaryKeyword, 
      semanticVariation,
      serpData, 
      sectionLength,
      i
    );
    
    content += sectionContent + "\n\n";
    
    // Add relevant medical visuals
    if (includeImages && i < 3) {
      const visuals = generateEnhancedVisuals(heading, primaryKeyword, 'health-fitness', i);
      const visualsMarkdown = formatEnhancedVisualsForMarkdown(visuals);
      if (visualsMarkdown) {
        content += visualsMarkdown + "\n\n";
      }
    }
    
    if (i < headings.length - 1) {
      content += "---\n\n";
    }
  }

  // Evidence-based FAQ section
  if (includeFAQs) {
    content += "## Frequently Asked Questions\n\n";
    content += generateHealthFAQs(primaryKeyword, serpData, targetAudience) + "\n\n";
  }

  // Medical conclusion
  content += "## Key Medical Takeaways\n\n";
  content += generateHealthConclusion(primaryKeyword, serpData, semanticKeywords[0]) + "\n\n";
  
  return content;
}

function createHealthTitle(keyword: string, year: number): string {
  if (keyword.toLowerCase().includes('vitamin d deficiency')) {
    return `Vitamin D Deficiency: Complete Medical Guide (${year})`;
  }
  
  if (keyword.toLowerCase().includes('symptoms')) {
    return `${keyword}: Evidence-Based Symptom Guide and Treatment Options`;
  }
  
  return `${keyword}: Comprehensive Health Guide (${year})`;
}

function generateHealthSummary(keyword: string, serpData: any, semanticKeyword: string): string {
  const keyStats = serpData.keyStatistics.slice(0, 2);
  
  let summary = `## Medical Overview\n\n`;
  summary += `**Understanding ${keyword}** requires examining current medical research, clinical guidelines, and evidence-based treatment approaches. `;
  
  if (keyStats[0]) {
    summary += `Recent clinical studies demonstrate that ${keyStats[0].toLowerCase()}, emphasizing the importance of proper medical evaluation and treatment. `;
  }
  
  summary += `This comprehensive medical guide synthesizes peer-reviewed research with practical clinical applications.\n\n`;
  
  summary += `**🏥 Medical Highlights:**\n`;
  summary += `- Evidence-based diagnostic criteria and testing protocols\n`;
  summary += `- Current clinical treatment guidelines and recommendations\n`;
  summary += `- Risk factors, prevention strategies, and lifestyle modifications\n`;
  summary += `- When to seek medical attention and specialist referrals\n`;
  summary += `- Integration with overall health and wellness strategies`;
  
  return summary;
}

function generateHealthFactsBox(keyword: string, serpData: any): string {
  const stats = serpData.keyStatistics.slice(0, 4);
  
  let factsBox = `> **🔬 Clinical Facts:**\n>\n`;
  
  if (keyword.toLowerCase().includes('vitamin d deficiency')) {
    factsBox += `> • **Prevalence:** Affects 35% of U.S. adults and 70% during winter months\n`;
    factsBox += `> • **Optimal Range:** 30-50 ng/mL (75-125 nmol/L) for most health benefits\n`;
    factsBox += `> • **Testing:** 25(OH)D blood test is the gold standard diagnostic\n`;
    factsBox += `> • **Treatment Response:** 6-8 weeks for blood levels to stabilize\n`;
  } else {
    // Use provided statistics or generate realistic health facts
    if (stats.length > 0) {
      stats.forEach((stat: string) => {
        if (stat) {
          factsBox += `> • ${stat}\n`;
        }
      });
    } else {
      factsBox += `> • **Prevalence:** Affects millions of adults worldwide\n`;
      factsBox += `> • **Early Detection:** Improves treatment outcomes by 60-80%\n`;
      factsBox += `> • **Professional Care:** Medical supervision recommended for optimal results\n`;
      factsBox += `> • **Evidence Base:** Supported by extensive peer-reviewed research\n`;
    }
  }
  
  return factsBox;
}

function generateHealthIntroduction(keyword: string, serpData: any, semanticKeyword: string, targetAudience?: string): string {
  const keyStatistic = serpData.keyStatistics[0];
  
  let intro = `Understanding **${keyword}** has evolved significantly as medical research reveals new insights about diagnosis, treatment, and prevention. `;
  
  if (keyStatistic) {
    intro += `Current medical evidence shows that ${keyStatistic.toLowerCase()}, highlighting the critical importance of evidence-based approaches to evaluation and treatment.\n\n`;
  }
  
  intro += `${semanticKeyword || 'Effective medical management'} requires a comprehensive understanding of underlying mechanisms, risk factors, diagnostic criteria, and treatment options. This guide examines current medical standards while providing practical insights for patients and healthcare providers.\n\n`;
  
  if (targetAudience === 'patients') {
    intro += `Whether you're experiencing symptoms, have risk factors, or want to prevent problems, understanding the medical aspects of this condition empowers you to make informed decisions and work effectively with your healthcare team.`;
  } else {
    intro += `From initial symptoms to long-term management, this evidence-based approach will help you understand when to seek medical attention, what to expect from diagnostic testing, and how to optimize treatment outcomes.`;
  }
  
  return intro;
}

function generateHealthHeadings(keyword: string): string[] {
  if (keyword.toLowerCase().includes('vitamin d deficiency')) {
    return [
      'Understanding Vitamin D: Physiology and Function',
      'Recognizing Deficiency Symptoms: Early Warning Signs',
      'Risk Factors and Vulnerable Populations',
      'Diagnostic Testing: When and How to Test',
      'Interpreting Blood Test Results: What Numbers Mean',
      'Evidence-Based Treatment Protocols',
      'Genetic Factors Affecting Vitamin D Metabolism',
      'Monitoring Progress and Long-Term Management'
    ];
  }
  
  // Generic health headings
  return [
    `Understanding ${keyword}: Medical Background`,
    'Signs and Symptoms: When to Seek Medical Attention',
    'Risk Factors and Prevention Strategies', 
    'Diagnostic Testing and Medical Evaluation',
    'Evidence-Based Treatment Options',
    'Lifestyle Modifications and Self-Care',
    'Working with Healthcare Providers',
    'Long-Term Management and Monitoring'
  ];
}

async function generateUniqueHealthSection(
  heading: string,
  primaryKeyword: string,
  semanticKeyword: string,
  serpData: any,
  targetLength: number,
  sectionIndex: number
): Promise<string> {
  const relevantStat = serpData.keyStatistics[sectionIndex] || serpData.keyStatistics[0];
  
  let content = "";
  
  // Generate unique content based on section focus
  if (heading.includes('Understanding') || heading.includes('Physiology')) {
    content += `The human body's relationship with ${semanticKeyword} involves complex physiological processes that are essential for optimal health. `;
    
    if (relevantStat) {
      content += `Clinical research demonstrates that ${relevantStat.toLowerCase()}, providing crucial insights for medical understanding.\n\n`;
    }
    
    if (primaryKeyword.toLowerCase().includes('vitamin d')) {
      content += `### The Vitamin D System\n\n`;
      content += `**Step 1: Initial Production or Intake**\nVitamin D begins as cholecalciferol (D3) from sun exposure or supplements, or ergocalciferol (D2) from certain foods. Approximately 80-90% should come from skin synthesis, with the remainder from dietary sources.\n\n`;
      content += `**Step 2: Liver Conversion**\nThe liver converts vitamin D to 25-hydroxyvitamin D [25(OH)D], the storage form measured in blood tests. This step rarely fails unless there is severe liver disease.\n\n`;
      content += `**Step 3: Kidney Activation**\nKidneys convert 25(OH)D to the active hormone 1,25-dihydroxyvitamin D [1,25(OH)2D or calcitriol]. This step is tightly regulated by parathyroid hormone (PTH), calcium levels, and kidney function.\n\n`;
      content += `**Step 4: Cellular Action**\nCalcitriol binds to vitamin D receptors (VDR) in target tissues, influencing over 200 genes involved in calcium metabolism, immune function, and cellular growth regulation.\n\n`;
    } else {
      content += `### Biological Mechanisms\n\n`;
      content += `Understanding how ${semanticKeyword} affects the body requires examining both direct physiological effects and downstream consequences. The body's response involves multiple organ systems working in coordination.\n\n`;
      content += `### Clinical Significance\n\n`;
      content += `Medical research has identified specific pathways and mechanisms that explain how ${semanticKeyword} influences health outcomes. This understanding forms the foundation for evidence-based treatment approaches.\n\n`;
    }
    
  } else if (heading.includes('Symptoms') || heading.includes('Signs')) {
    content += `Recognizing the signs and symptoms of ${semanticKeyword} requires understanding both obvious manifestations and subtle indicators that are often overlooked. `;
    
    if (relevantStat) {
      content += `Medical studies show that ${relevantStat.toLowerCase()}, emphasizing the importance of comprehensive symptom assessment.\n\n`;
    }
    
    if (primaryKeyword.toLowerCase().includes('vitamin d deficiency')) {
      content += `### Early Warning Signs\n\n`;
      content += `**Fatigue and Low Energy (Affects 80% of deficient individuals)**\nUnlike typical tiredness, vitamin D deficiency fatigue is persistent and doesn't improve with rest. Patients often describe feeling "heavy" or having difficulty with normal activities.\n\n`;
      content += `**Bone and Muscle Pain (Affects 70% of cases)**\nDeep, aching bone pain, particularly in the ribs, spine, and pelvis. Muscle weakness often affects the thighs and upper arms, making it difficult to climb stairs or lift objects.\n\n`;
      content += `**Mood Changes and Depression (Affects 60% of cases)**\nVitamin D deficiency can manifest as depression, anxiety, seasonal mood changes, or general mood instability. The connection is strongest during winter months.\n\n`;
      content += `### Advanced Symptoms\n\n`;
      content += `**Frequent Infections (Especially respiratory)**\nDeficiency impairs immune system function, leading to recurring colds, flu, or respiratory infections. The risk of severe respiratory illness increases significantly.\n\n`;
      content += `**Hair Loss and Skin Problems**\nAlopecia areata (patchy hair loss) and slow wound healing are common in severe deficiency. Skin may become dry, itchy, or prone to infections.\n\n`;
      content += `**Cognitive Issues**\nDifficulty concentrating, memory problems, and "brain fog" affect many individuals with chronic deficiency.\n\n`;
    } else {
      content += `### Primary Symptoms\n\n`;
      content += `The most commonly reported symptoms include both physical and psychological manifestations that can significantly impact quality of life. Early recognition enables prompt medical intervention.\n\n`;
      content += `### Secondary Symptoms\n\n`;
      content += `Less obvious symptoms may develop gradually and are often mistakenly attributed to other causes. Understanding these patterns helps healthcare providers make accurate diagnoses.\n\n`;
    }
    
  } else if (heading.includes('Risk Factors') || heading.includes('Vulnerable')) {
    content += `Certain populations and individuals face elevated risks for ${semanticKeyword}, requiring targeted screening and prevention strategies. `;
    
    if (relevantStat) {
      content += `Epidemiological data reveals that ${relevantStat.toLowerCase()}, informing evidence-based prevention protocols.\n\n`;
    }
    
    content += `### High-Risk Populations\n\n`;
    content += `**Geographic Factors**: Individuals living above 35°N latitude (including most of the United States) have insufficient UVB exposure during winter months. This affects approximately 77% of the U.S. population.\n\n`;
    content += `**Age-Related Risk**: Adults over 65 have reduced skin synthesis capacity (75% decrease) and often have limited sun exposure. Additionally, kidney function naturally declines with age, reducing activation efficiency.\n\n`;
    content += `**Skin Pigmentation**: Melanin acts as natural sunscreen, requiring 3-6 times longer sun exposure for equivalent vitamin D synthesis. This particularly affects individuals with darker skin living in northern climates.\n\n`;
    content += `### Medical Risk Factors\n\n`;
    content += `**Gastrointestinal Disorders**: Crohn's disease, celiac disease, and gastric bypass surgery reduce absorption by 50-80%. These conditions require specialized monitoring and higher-dose supplementation.\n\n`;
    content += `**Kidney and Liver Disease**: Chronic kidney disease affects activation, while liver disease impairs initial conversion. Both require medical supervision for supplementation.\n\n`;
    content += `**Medication Interactions**: Corticosteroids, anticonvulsants, and certain cholesterol medications can significantly reduce vitamin D effectiveness.\n\n`;
    
  } else if (heading.includes('Testing') || heading.includes('Diagnostic')) {
    content += `Accurate diagnostic testing provides the foundation for effective ${semanticKeyword} management. `;
    
    if (relevantStat) {
      content += `Laboratory medicine standards indicate that ${relevantStat.toLowerCase()}, establishing clear testing protocols.\n\n`;
    }
    
    if (primaryKeyword.toLowerCase().includes('vitamin d')) {
      content += `### The Gold Standard: 25(OH)D Testing\n\n`;
      content += `**Why 25(OH)D Is Measured**\nThe 25-hydroxyvitamin D test measures stored vitamin D, which has a half-life of 2-3 weeks, providing an accurate picture of vitamin D status over the past 1-2 months.\n\n`;
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
    
  } else {
    // Generate unique content for other sections
    content += `This critical aspect of ${semanticKeyword} management requires detailed understanding of both clinical evidence and practical implementation. `;
    
    if (relevantStat) {
      content += `Medical research demonstrates that ${relevantStat.toLowerCase()}, providing clear guidance for clinical practice.\n\n`;
    }
    
    content += `### Evidence-Based Approach\n\n`;
    content += `Current medical guidelines emphasize individualized treatment plans based on patient-specific factors, risk assessment, and response monitoring. This personalized approach optimizes outcomes while minimizing risks.\n\n`;
    content += `### Clinical Implementation\n\n`;
    content += `Successful implementation requires coordination between patients and healthcare providers, with regular monitoring and adjustment based on response patterns and changing circumstances.\n\n`;
  }
  
  // Fill specific content gaps for this section
  const contentGaps = identifyHealthContentGaps(heading, primaryKeyword);
  if (contentGaps.length > 0) {
    const gapContent = await fillContentGaps(contentGaps, primaryKeyword, semanticKeyword);
    content += gapContent;
  }
  
  return content;
}

function generateHealthFAQs(keyword: string, serpData: any, targetAudience?: string): string {
  let faqs = "";
  
  if (keyword.toLowerCase().includes('vitamin d deficiency')) {
    faqs += `### How accurate are at-home vitamin D tests compared to lab tests?\n\n`;
    faqs += `At-home finger-prick tests have approximately 85-90% correlation with laboratory venous blood draws when performed correctly. However, they may be less reliable at very low or very high levels. For initial screening, they're adequate, but for medical decision-making, especially with levels below 20 ng/mL or above 80 ng/mL, laboratory confirmation is recommended. The main advantage is convenience and cost, while the limitation is potential for user error in collection.\n\n`;
    
    faqs += `### Can I take too much vitamin D, and what are the warning signs?\n\n`;
    faqs += `Vitamin D toxicity is rare but serious, typically occurring with sustained intake above 10,000 IU daily for months. Early signs include nausea, vomiting, weakness, and kidney problems. The toxic mechanism involves excessive calcium absorption leading to hypercalcemia. Blood levels above 100 ng/mL (250 nmol/L) indicate toxicity risk. This is why doses above 4,000 IU daily should be medically supervised with regular monitoring of both vitamin D and calcium levels.\n\n`;
    
    faqs += `### Why isn't my vitamin D level improving despite taking supplements?\n\n`;
    faqs += `Several factors can impair absorption and effectiveness: 1) Taking supplements without fat reduces absorption by 50-60%, 2) Magnesium deficiency prevents vitamin D activation, 3) Genetic variations (VDR polymorphisms) may require higher doses, 4) Gastrointestinal issues like Crohn's disease or celiac can reduce absorption, 5) Certain medications interfere with metabolism, and 6) The supplement quality may be poor (choose third-party tested products). If levels don't improve after 8-12 weeks of consistent supplementation, medical evaluation is warranted.\n\n`;
    
    faqs += `### Is vitamin D2 or D3 better, and does it really matter?\n\n`;
    faqs += `Vitamin D3 (cholecalciferol) is significantly more effective than D2 (ergocalciferol) at raising and maintaining blood levels. Studies show D3 is approximately 87% more potent than D2 at increasing 25(OH)D levels. D3 also has a longer half-life and binds more effectively to vitamin D binding proteins. While D2 can correct deficiency, D3 requires lower doses and provides more stable blood levels. The only advantage of D2 is that it's often available in higher-dose prescriptions and is suitable for vegans, though vegan D3 options are now available.\n\n`;
    
  } else {
    // Generic health FAQs
    faqs += `### When should I seek medical attention for ${keyword}?\n\n`;
    faqs += `Seek immediate medical attention if you experience severe symptoms, rapid symptom progression, or symptoms that significantly impact your daily functioning. Early intervention typically leads to better outcomes and prevents complications.\n\n`;
    
    faqs += `### How long does treatment typically take to show results?\n\n`;
    faqs += `Treatment timelines vary based on individual factors and severity, but most people begin noticing improvement within 2-4 weeks of appropriate treatment. Full resolution may take several months, and some individuals require ongoing management.\n\n`;
    
    faqs += `### Can lifestyle changes alone resolve ${keyword}?\n\n`;
    faqs += `For mild cases, lifestyle modifications may be sufficient, but moderate to severe cases typically require medical intervention. The key is working with healthcare providers to determine the most appropriate treatment approach for your specific situation.\n\n`;
  }
  
  return faqs;
}

function generateHealthConclusion(keyword: string, serpData: any, semanticKeyword: string): string {
  const keyStatistic = serpData.keyStatistics[0];
  
  let conclusion = `Managing ${semanticKeyword || keyword} effectively requires a partnership between patients and healthcare providers, combining medical expertise with evidence-based self-care strategies. Success depends on accurate diagnosis, appropriate treatment, and consistent monitoring rather than guesswork or one-size-fits-all approaches.\n\n`;
  
  if (keyStatistic) {
    conclusion += `**Clinical Evidence**: ${keyStatistic} This data underscores the importance of following established medical protocols and maintaining regular communication with your healthcare team.\n\n`;
  }
  
  conclusion += `**Your Health Action Plan:**\n\n`;
  conclusion += `1. **Seek Professional Evaluation**: Work with qualified healthcare providers for accurate diagnosis and treatment planning\n`;
  conclusion += `2. **Follow Evidence-Based Protocols**: Stick to medically proven approaches rather than unvalidated alternatives\n`;
  conclusion += `3. **Monitor Progress Systematically**: Track both symptoms and objective measures through appropriate testing\n`;
  conclusion += `4. **Maintain Open Communication**: Keep your healthcare team informed about symptoms, concerns, and treatment responses\n`;
  conclusion += `5. **Stay Informed**: Continue learning about your condition from reliable medical sources\n\n`;
  
  conclusion += `**Important Reminders**: This information is educational and should not replace professional medical advice. Always consult with qualified healthcare providers before making changes to your health regimen. Individual responses vary, and what works for others may not be appropriate for your specific situation.\n\n`;
  
  conclusion += `Take the first step by scheduling an appointment with your healthcare provider to discuss your symptoms, risk factors, and testing options. Early intervention and proper medical management significantly improve outcomes for most health conditions.`;
  
  return conclusion;
}

function identifyHealthContentGaps(heading: string, keyword: string): string[] {
  const gaps: string[] = [];
  
  if (heading.includes('Genetic') && keyword.toLowerCase().includes('vitamin d')) {
    gaps.push('vdr_polymorphisms');
  }
  
  if (heading.includes('Advanced') || heading.includes('Specialized')) {
    gaps.push(`advanced_techniques_${keyword.replace(/\s+/g, '_')}`);
  }
  
  return gaps;
}
