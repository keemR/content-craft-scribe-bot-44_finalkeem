import { generateEnhancedVisuals, formatEnhancedVisualsForMarkdown } from './enhancedVisualGenerator';
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
  topicCategory: string;
  targetAudience?: string;
  contentSpecificity?: number;
  includeExamples?: boolean;
  includeStatistics?: boolean;
  useCaseStudies?: boolean;
}

export async function generateHealthContent(options: HealthContentOptions): Promise<string> {
  const {
    primaryKeyword,
    semanticKeywords,
    serpData,
    researchData,
    articleLength,
    tone,
    includeImages,
    includeFAQs,
    topicCategory
  } = options;

  const currentYear = new Date().getFullYear();
  const title = createHealthTitle(primaryKeyword, currentYear);
  const estimatedReadingTime = Math.ceil(articleLength / 250);
  
  let content = `# ${title}\n\n`;
  
  // Add credibility signals
  const publishDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  content += `*Last Updated: ${publishDate} | ${estimatedReadingTime}-minute read | Evidence-based health content*\n\n`;
  
  // Featured snippet optimized summary
  content += generateHealthSummary(primaryKeyword, serpData, semanticKeywords[0]) + "\n\n";
  
  // Quick facts box
  content += generateHealthQuickFacts(primaryKeyword, serpData) + "\n\n";
  
  // Evidence-based introduction
  content += generateHealthIntroduction(primaryKeyword, serpData, semanticKeywords[0]) + "\n\n";
  
  // Generate health-focused headings
  const headings = generateHealthHeadings(primaryKeyword, topicCategory);
  
  // Table of contents
  content += "## Table of Contents\n\n";
  headings.forEach((heading, index) => {
    const slug = slugify(heading);
    content += `${index + 1}. [${heading}](#${slug})\n`;
  });
  content += "\n\n";
  
  // Generate sections with health-specific content
  const sectionLength = Math.floor(articleLength / headings.length);
  
  headings.forEach((heading, index) => {
    content += `## ${heading}\n\n`;
    
    content += generateDetailedHealthSectionContent(
      heading, 
      primaryKeyword, 
      serpData, 
      semanticKeywords[index % semanticKeywords.length] || semanticKeywords[0],
      sectionLength,
      index,
      topicCategory
    ) + "\n\n";
    
    // Add relevant visuals with proper context
    if (includeImages && index < 4) {
      const visuals = generateEnhancedVisuals(heading, primaryKeyword, topicCategory, index);
      const visualsMarkdown = formatEnhancedVisualsForMarkdown(visuals);
      if (visualsMarkdown) {
        content += visualsMarkdown + "\n\n";
      }
    }
    
    if (index < headings.length - 1) {
      content += "---\n\n";
    }
  });

  // Health-specific FAQ section
  if (includeFAQs) {
    content += "## Frequently Asked Questions\n\n";
    content += generateComprehensiveHealthFAQs(primaryKeyword, serpData, topicCategory) + "\n\n";
  }

  // Expert-backed conclusion
  content += "## Key Takeaways\n\n";
  content += generateHealthConclusion(primaryKeyword, serpData, semanticKeywords[0]) + "\n\n";
  
  return content;
}

function createHealthTitle(keyword: string, year: number): string {
  if (keyword.toLowerCase().includes('vitamin d') && keyword.toLowerCase().includes('deficiency')) {
    return `Vitamin D Deficiency: 12 Warning Signs You Shouldn't Ignore (${year})`;
  }
  
  if (keyword.toLowerCase().includes('foods') && keyword.toLowerCase().includes('zinc')) {
    return `20 Best Zinc-Rich Foods to Boost Your Immune System (${year} Guide)`;
  }
  
  if (keyword.toLowerCase().includes('symptoms')) {
    return `${keyword}: Complete Recognition Guide with Expert Analysis (${year})`;
  }
  
  if (keyword.toLowerCase().includes('diet') || keyword.toLowerCase().includes('nutrition')) {
    return `${keyword}: Evidence-Based Nutrition Guide (${year})`;
  }
  
  // Generic health title
  return `${keyword}: Complete Health Guide with Expert Insights (${year})`;
}

function generateHealthSummary(keyword: string, serpData: any, semanticKeyword: string): string {
  const keyStats = serpData.keyStatistics.slice(0, 2);
  
  let summary = `## Quick Answer\n\n`;
  
  if (keyword.toLowerCase().includes('vitamin d') && keyword.toLowerCase().includes('deficiency')) {
    summary += `**Vitamin D deficiency affects over 1 billion people worldwide.** `;
    
    if (keyStats[0]) {
      summary += `${keyStats[0]}. `;
    }
    
    summary += `Key warning signs include fatigue, bone pain, muscle weakness, and frequent infections.\n\n`;
    
    summary += `**🚨 Warning Signs:**\n`;
    summary += `- Persistent fatigue and weakness\n`;
    summary += `- Bone and back pain\n`;
    summary += `- Frequent infections\n`;
    summary += `- Slow wound healing\n`;
    summary += `- Hair loss and mood changes`;
    
  } else if (keyword.toLowerCase().includes('foods') && keyword.toLowerCase().includes('zinc')) {
    summary += `**The best zinc-rich foods include oysters (74mg per 100g), beef, pumpkin seeds, and cashews.** `;
    
    if (keyStats[0]) {
      summary += `Research shows ${keyStats[0].toLowerCase()}. `;
    }
    
    summary += `Adults need 8-11mg daily for optimal immune function.\n\n`;
    
    summary += `**📊 Top 5 Zinc Sources:**\n`;
    summary += `- Oysters: 74mg per 100g\n`;
    summary += `- Beef (chuck roast): 12.3mg per 100g\n`;
    summary += `- Pumpkin seeds: 10.3mg per 100g\n`;
    summary += `- Cashews: 5.6mg per 100g\n`;
    summary += `- Chickpeas: 1.5mg per 100g`;
    
  } else {
    summary += `**Understanding ${keyword}** requires evidence-based knowledge and practical application. `;
    
    if (keyStats[0]) {
      summary += `Current research indicates ${keyStats[0].toLowerCase()}.`;
    }
    
    summary += `\n\n**Key Points:**\n`;
    summary += `- Evidence-based approach essential\n`;
    summary += `- Individual factors matter\n`;
    summary += `- Professional guidance recommended\n`;
    summary += `- Early intervention improves outcomes`;
  }
  
  return summary;
}

function generateHealthQuickFacts(keyword: string, serpData: any): string {
  let factsBox = `> **💡 Quick Facts:**\n>\n`;
  
  if (keyword.toLowerCase().includes('vitamin d')) {
    factsBox += `> • **Optimal Level:** 40-60 ng/mL (100-150 nmol/L)\n`;
    factsBox += `> • **Global Deficiency:** Over 1 billion people\n`;
    factsBox += `> • **Sun Exposure:** 10-30 minutes daily\n`;
    factsBox += `> • **Supplement Dose:** 1000-4000 IU daily\n`;
  } else if (keyword.toLowerCase().includes('zinc')) {
    factsBox += `> • **Daily Need:** 8-11mg for adults\n`;
    factsBox += `> • **Best Source:** Oysters (74mg per serving)\n`;
    factsBox += `> • **Absorption:** Enhanced with protein\n`;
    factsBox += `> • **Deficiency Risk:** 17% of global population\n`;
  } else {
    const stats = serpData.keyStatistics.slice(0, 4);
    if (stats.length > 0) {
      stats.forEach((stat: string, index: number) => {
        if (stat && index < 4) {
          factsBox += `> • ${stat}\n`;
        }
      });
    } else {
      factsBox += `> • Evidence-based approaches improve outcomes\n`;
      factsBox += `> • Individual assessment essential\n`;
      factsBox += `> • Professional guidance recommended\n`;
      factsBox += `> • Early intervention most effective\n`;
    }
  }
  
  return factsBox;
}

function generateHealthIntroduction(keyword: string, serpData: any, semanticKeyword: string): string {
  const keyStatistic = serpData.keyStatistics[0];
  
  let intro = `Understanding **${keyword}** is crucial for optimal health and well-being. `;
  
  if (keyStatistic) {
    intro += `Recent research reveals that ${keyStatistic.toLowerCase()}, making this knowledge essential for healthcare decisions.\n\n`;
  }
  
  if (keyword.toLowerCase().includes('vitamin d')) {
    intro += `${semanticKeyword || 'Vitamin D deficiency'} has reached pandemic proportions, affecting over one billion people worldwide. Often called the "sunshine vitamin," vitamin D plays crucial roles in bone health, immune function, and mood regulation.\n\n`;
    
    intro += `Modern lifestyle factors—including increased indoor time, sunscreen use, and geographic location—have contributed to widespread deficiency. Recognizing the warning signs early can prevent serious health complications and improve quality of life significantly.`;
    
  } else if (keyword.toLowerCase().includes('zinc')) {
    intro += `${semanticKeyword || 'Zinc-rich foods'} play a vital role in immune function, wound healing, and protein synthesis. The human body cannot store zinc, making daily intake through food sources essential.\n\n`;
    
    intro += `According to the National Institutes of Health, zinc deficiency affects approximately 17% of the global population, with symptoms ranging from impaired immune function to delayed wound healing. By incorporating the right foods into your diet, you can easily meet your daily requirements.`;
    
  } else {
    intro += `This evidence-based guide examines current research, expert recommendations, and practical strategies to help you understand and effectively address ${semanticKeyword || keyword.toLowerCase()}.\n\n`;
    
    intro += `Healthcare professionals emphasize the importance of evidence-based approaches when dealing with health-related topics, ensuring both safety and effectiveness in treatment decisions.`;
  }
  
  return intro;
}

function generateHealthHeadings(keyword: string, topicCategory: string): string[] {
  if (keyword.toLowerCase().includes('vitamin d') && keyword.toLowerCase().includes('deficiency')) {
    return [
      'Understanding Vitamin D and Its Functions',
      '12 Warning Signs of Vitamin D Deficiency',
      'Who\'s Most at Risk for Deficiency',
      'Testing: How to Check Your Vitamin D Level',
      'Natural Ways to Boost Vitamin D',
      'Supplement Guidelines and Dosing',
      'Foods Rich in Vitamin D',
      'How Long Does Recovery Take?'
    ];
  }
  
  if (keyword.toLowerCase().includes('foods') && keyword.toLowerCase().includes('zinc')) {
    return [
      'Why Zinc Matters for Your Health',
      'Top 20 Zinc-Rich Foods (With Exact Amounts)',
      'Daily Zinc Requirements by Age and Gender',
      'How to Maximize Zinc Absorption',
      'Plant-Based Zinc Sources for Vegetarians',
      'Signs You May Need More Zinc',
      'Zinc Supplements: When and How Much',
      'Foods That Block Zinc Absorption'
    ];
  }
  
  // Generic health headings
  return [
    `Understanding ${keyword}`,
    'Signs and Symptoms to Watch For',
    'Causes and Risk Factors',
    'Diagnosis and Assessment Methods',
    'Treatment and Management Options',
    'Prevention Strategies',
    'Lifestyle Modifications',
    'When to Seek Professional Help'
  ];
}

function generateDetailedHealthSectionContent(
  heading: string,
  keyword: string,
  serpData: any,
  semanticKeyword: string,
  targetLength: number,
  index: number,
  topicCategory: string
): string {
  // Use specific content for known health topics
  if (keyword.toLowerCase().includes('zinc') && keyword.toLowerCase().includes('foods')) {
    return generateDetailedZincContent(heading, semanticKeyword, serpData, index);
  }
  
  if (keyword.toLowerCase().includes('vitamin d')) {
    return generateDetailedVitaminDContent(heading, semanticKeyword, serpData, index);
  }
  
  // Generic health content with more detail
  const relevantStat = serpData.keyStatistics[index] || serpData.keyStatistics[0];
  const minWords = Math.max(200, targetLength / 5); // Ensure substantial content
  
  let content = "";
  
  if (relevantStat) {
    content += `Current research demonstrates that ${relevantStat.toLowerCase()}. This significant finding underlies the importance of understanding ${heading.toLowerCase()} within the broader context of ${semanticKeyword}.\n\n`;
  }
  
  content += `### Clinical Evidence and Research\n\n`;
  content += `Medical literature consistently supports specific approaches to ${heading.toLowerCase()}. Peer-reviewed studies have identified key factors that significantly influence outcomes, providing healthcare professionals with evidence-based guidelines.\n\n`;
  
  content += `Multiple clinical trials have examined the relationship between ${semanticKeyword} and overall health outcomes. These studies consistently demonstrate measurable improvements when evidence-based protocols are followed systematically.\n\n`;
  
  content += `### Individual Assessment Factors\n\n`;
  content += `Personal health circumstances play a crucial role in determining the most appropriate approach to ${heading.toLowerCase()}. Healthcare providers consider multiple variables when developing personalized recommendations.\n\n`;
  
  content += `Age, existing health conditions, lifestyle factors, and genetic predisposition all influence how individuals respond to different interventions. This complexity underscores the importance of professional medical guidance.\n\n`;
  
  content += `### Implementation Strategies\n\n`;
  content += `Successful implementation of ${heading.toLowerCase()} strategies requires systematic planning and consistent execution. Research indicates that structured approaches yield significantly better results than informal methods.\n\n`;
  
  content += `**Step-by-Step Implementation:**\n\n`;
  content += `1. **Initial Assessment**: Comprehensive evaluation of current health status and risk factors\n`;
  content += `2. **Goal Setting**: Establishment of realistic, measurable objectives with clear timelines\n`;
  content += `3. **Resource Planning**: Identification and allocation of necessary resources for success\n`;
  content += `4. **Action Implementation**: Systematic execution of evidence-based strategies\n`;
  content += `5. **Progress Monitoring**: Regular assessment and adjustment based on results\n\n`;
  
  content += `### Professional Guidance Benefits\n\n`;
  content += `Healthcare professionals bring specialized knowledge, clinical experience, and objective perspective to ${heading.toLowerCase()}. Their expertise significantly improves success rates while minimizing potential risks.\n\n`;
  
  content += `Professional consultation becomes especially important when dealing with complex health situations, existing medical conditions, or when progress plateaus despite consistent effort.\n\n`;
  
  return content;
}

function generateDetailedZincContent(heading: string, keyword: string, serpData: any, index: number): string {
  const headingLower = heading.toLowerCase();
  
  if (headingLower.includes('top 20') || headingLower.includes('zinc-rich foods')) {
    return `Zinc content varies dramatically between food sources, with animal products generally providing the highest concentrations and best bioavailability. Understanding these differences helps optimize dietary planning for adequate zinc intake.

### Animal-Based Zinc Powerhouses

**Oysters** dominate as the ultimate zinc source, providing an exceptional 74mg per 100g serving—more than six times the daily adult requirement. Just six medium oysters supply your entire weekly zinc needs, making them incredibly efficient for addressing deficiency.

**Red Meat Excellence:**
- **Beef chuck roast**: 12.3mg per 100g (112% daily value)
- **Lamb shoulder**: 9.9mg per 100g (90% daily value)  
- **Pork shoulder**: 5.1mg per 100g (46% daily value)
- **Ground beef (85% lean)**: 4.8mg per 100g (44% daily value)

**Poultry and Seafood Options:**
- **Crab meat**: 7.6mg per 100g (69% daily value)
- **Lobster**: 4.1mg per 100g (37% daily value)
- **Chicken thigh (dark meat)**: 2.9mg per 100g (26% daily value)

### Plant-Based Zinc Champions

**Seeds and Nuts (per 100g):**
- **Pumpkin seeds**: 10.3mg (94% daily value)
- **Sesame seeds**: 10.2mg (93% daily value)
- **Hemp seeds**: 9.9mg (90% daily value)
- **Cashews**: 5.6mg (51% daily value)
- **Pine nuts**: 4.3mg (39% daily value)
- **Almonds**: 3.1mg (28% daily value)

**Legumes and Grains (cooked, per 100g):**
- **White beans**: 1.9mg (17% daily value)
- **Chickpeas**: 1.5mg (14% daily value)
- **Lentils**: 1.3mg (12% daily value)
- **Quinoa**: 1.1mg (10% daily value)
- **Black beans**: 1.2mg (11% daily value)

### Bioavailability Considerations

Animal sources provide superior zinc absorption rates (20-40%) compared to plant sources (10-15%) due to the absence of phytates and presence of enhancing factors like amino acids.`;
  }
  
  if (headingLower.includes('absorption') || headingLower.includes('maximize')) {
    return `Zinc absorption efficiency varies significantly based on dietary factors, timing, and individual circumstances. Understanding these variables helps maximize the benefits of zinc-rich foods.

### Absorption Enhancement Strategies

**Protein Partnership**: Consuming zinc-rich foods alongside high-quality proteins significantly improves absorption. Amino acids, particularly histidine and methionine, create chelation complexes that facilitate zinc uptake.

**Optimal Timing**: Taking zinc supplements or eating zinc-rich foods on an empty stomach maximizes absorption, though this may cause nausea in sensitive individuals. With food reduces absorption by 20-30% but improves tolerance.

**Synergistic Nutrients**: Certain nutrients work together to enhance zinc utilization:
- **Vitamin A**: Supports zinc transport and utilization
- **Vitamin E**: Protects zinc from oxidation
- **B-complex vitamins**: Support zinc metabolism

### Absorption Inhibitors to Avoid

**Phytates and Fiber**: Found in whole grains, legumes, and nuts, these compounds bind zinc and reduce absorption by up to 50%. Soaking, sprouting, or fermenting these foods reduces phytate content.

**Calcium and Iron**: High doses of these minerals compete with zinc for absorption. Separate zinc intake from calcium supplements and iron-rich meals by at least 2 hours.

**Coffee and Tea**: Tannins in these beverages can reduce zinc absorption by 20-30% when consumed with zinc-rich meals.`;
  }
  
  if (headingLower.includes('daily') || headingLower.includes('requirements')) {
    return `Zinc requirements vary significantly based on age, gender, pregnancy status, and individual health circumstances. Understanding these differences ensures appropriate intake levels.

### Age-Specific Requirements

**Infants and Children:**
- 0-6 months: 2mg daily
- 7-12 months: 3mg daily  
- 1-3 years: 3mg daily
- 4-8 years: 5mg daily
- 9-13 years: 8mg daily

**Adolescents and Adults:**
- Males 14+ years: 11mg daily
- Females 14-18 years: 9mg daily
- Adult women: 8mg daily
- Pregnancy: 11mg daily
- Breastfeeding: 12mg daily

### Special Population Considerations

**Older Adults**: May require 20-30% more zinc due to decreased absorption efficiency and increased needs for immune function maintenance.

**Athletes**: Intense training increases zinc losses through sweat and may require 12-15mg daily for optimal performance and recovery.

**Vegetarians**: Plant-based diets may require 50% higher intake due to lower bioavailability from plant sources.`;
  }
  
  return `Understanding ${heading.toLowerCase()} provides essential insights for optimizing zinc intake and supporting overall health. This comprehensive approach ensures adequate zinc status while avoiding potential complications from deficiency or excess.`;
}

function generateDetailedVitaminDContent(heading: string, keyword: string, serpData: any, index: number): string {
  const headingLower = heading.toLowerCase();
  
  if (headingLower.includes('warning signs') || headingLower.includes('symptoms')) {
    return `Vitamin D deficiency often develops gradually, with symptoms that can be easily overlooked or attributed to other causes. Recognizing these warning signs early can prevent serious complications and accelerate recovery.

### Primary Physical Symptoms

**Persistent Fatigue and Weakness**
Affecting up to 89% of deficient individuals, this overwhelming tiredness doesn't improve with rest. Patients describe feeling "bone-deep exhaustion" that interferes with daily activities and work performance.

**Bone and Joint Pain**
Vitamin D regulates calcium absorption, making deficiency a primary cause of:
- Deep, aching bone pain (especially in weight-bearing bones)
- Lower back discomfort and stiffness
- Joint pain that worsens with activity
- Increased fracture risk (300% higher in severe deficiency)

**Muscle Weakness and Cramping**
Particularly noticeable in:
- Proximal muscles (thighs, shoulders, upper arms)
- Difficulty climbing stairs or rising from chairs
- Muscle cramps, especially at night
- Reduced grip strength and balance problems

### Immune System Indicators

**Frequent Infections**
Vitamin D deficiency compromises immune function, leading to:
- More frequent colds and respiratory infections
- Slower recovery from illness
- Increased susceptibility to autoimmune conditions
- Poor wound healing and tissue repair

### Neurological and Mood Symptoms

**Depression and Mood Changes**
- Seasonal affective disorder symptoms
- Persistent low mood and irritability
- Cognitive difficulties and "brain fog"
- Sleep disturbances and insomnia

**Hair Loss and Skin Issues**
- Diffuse hair thinning or patchy hair loss
- Slow wound healing
- Increased skin sensitivity
- Premature aging signs`;
  }
  
  if (headingLower.includes('testing') || headingLower.includes('check')) {
    return `Accurate vitamin D testing requires understanding the right tests, optimal timing, and proper interpretation of results. The 25-hydroxyvitamin D [25(OH)D] test is the gold standard for assessment.

### The Definitive Test: 25(OH)D

**Why This Test Matters**: The 25(OH)D test measures your body's storage form of vitamin D, providing the most accurate picture of your vitamin D status over the past 2-3 months.

**Normal vs. Optimal Levels:**
- **Deficient**: Below 20 ng/mL (50 nmol/L)
- **Insufficient**: 20-29 ng/mL (50-74 nmol/L)  
- **Sufficient**: 30-39 ng/mL (75-99 nmol/L)
- **Optimal**: 40-60 ng/mL (100-150 nmol/L)
- **Potentially Toxic**: Above 100 ng/mL (250 nmol/L)

### Testing Logistics and Timing

**When to Test**: 
- Initial testing can occur any time
- Follow-up testing should occur 8-12 weeks after starting supplementation
- Annual testing recommended for maintenance

**Factors Affecting Results**:
- Recent sun exposure (test after 3+ days without significant sun)
- Supplement timing (consistent supplementation for 6+ weeks before testing)
- Seasonal variations (levels typically 10-15% higher in late summer)

### At-Home vs. Laboratory Testing

**Laboratory Testing**: Most accurate but requires healthcare provider order and lab visit. Typical cost: $50-150.

**At-Home Testing Kits**: Convenient and increasingly accurate. Finger-prick blood spot tests provide reliable results comparable to laboratory testing. Cost: $30-80.`;
  }
  
  return `Understanding ${heading.toLowerCase()} is essential for effectively managing vitamin D status and preventing deficiency-related health complications. This evidence-based approach ensures optimal vitamin D levels for long-term health.`;
}

function generateComprehensiveHealthFAQs(keyword: string, serpData: any, topicCategory: string): string {
  let faqs = "";
  
  if (keyword.toLowerCase().includes('vitamin d')) {
    faqs += `### What vitamin D blood level should I aim for?\n\n`;
    faqs += `Most functional medicine practitioners recommend 40-60 ng/mL (100-150 nmol/L) for optimal health, though conventional medicine considers 30+ ng/mL sufficient. Levels below 20 ng/mL indicate deficiency requiring immediate treatment. The optimal range supports immune function, bone health, and mood regulation most effectively.\n\n`;
    
    faqs += `### How much vitamin D should I supplement daily?\n\n`;
    faqs += `For deficiency correction, most adults need 2000-4000 IU daily, though some may require 5000-8000 IU under medical supervision. For maintenance, 1000-2000 IU typically maintains optimal levels. Always test your levels before and after supplementation to ensure proper dosing.\n\n`;
    
    faqs += `### Can I get enough vitamin D from sun exposure alone?\n\n`;
    faqs += `Sun exposure can provide adequate vitamin D, but factors like latitude, season, skin color, age, and sunscreen use significantly affect production. Generally, 10-30 minutes of midday sun exposure on 40% of skin several times weekly can maintain levels, but supplementation is often more reliable and consistent.\n\n`;
    
    faqs += `### What's the difference between vitamin D2 and D3?\n\n`;
    faqs += `Vitamin D3 (cholecalciferol) is significantly more effective than D2 (ergocalciferol) at raising and maintaining blood levels. D3 is the natural form produced by your skin and found in animal foods. Always choose D3 supplements for optimal results.\n\n`;
    
  } else if (keyword.toLowerCase().includes('zinc')) {
    faqs += `### How much zinc do I need daily?\n\n`;
    faqs += `Adult men need 11mg of zinc daily, while adult women need 8mg. Pregnant women require 11mg, and breastfeeding women need 12mg. The upper safe limit is 40mg daily. Vegetarians may need 50% more due to lower absorption from plant sources.\n\n`;
    
    faqs += `### Which foods have the highest zinc content?\n\n`;
    faqs += `Oysters contain the most zinc at 74mg per 100g, followed by beef chuck roast (12.3mg), pumpkin seeds (10.3mg), and cashews (5.6mg). Animal sources generally provide 2-3 times better absorption than plant sources due to bioavailability differences.\n\n`;
    
    faqs += `### Can you take too much zinc?\n\n`;
    faqs += `Yes, chronic zinc intake above 40mg daily can cause copper deficiency, immune system suppression, and gastrointestinal issues. Acute overdose (150mg+) causes nausea, vomiting, and metallic taste. Always stay within recommended dosages unless medically supervised.\n\n`;
    
    faqs += `### How do I know if I'm zinc deficient?\n\n`;
    faqs += `Common signs include frequent infections, slow wound healing, hair loss, poor appetite, altered taste/smell, and white spots on fingernails. However, zinc deficiency can be subtle. Plasma zinc testing (normal: 70-120 mcg/dL) provides the most accurate assessment.\n\n`;
    
  } else {
    // Generic comprehensive health FAQs
    faqs += `### What should I know about ${keyword}?\n\n`;
    faqs += `Understanding ${keyword} requires considering individual health factors, current research, and professional medical guidance. Evidence-based approaches consistently provide the best outcomes while minimizing risks. Each person's situation requires personalized evaluation.\n\n`;
    
    faqs += `### When should I seek professional help?\n\n`;
    faqs += `Consult healthcare providers when symptoms persist despite self-care efforts, worsen over time, or significantly interfere with daily activities. Professional intervention becomes especially important for complex health situations or when multiple symptoms occur together.\n\n`;
    
    faqs += `### How long does it typically take to see improvements?\n\n`;
    faqs += `Timeline varies significantly based on the specific condition, severity, individual response, and consistency of implementation. Most people notice initial improvements within 2-4 weeks, with substantial progress typically emerging over 2-3 months of consistent effort.\n\n`;
  }
  
  return faqs;
}

function generateHealthConclusion(keyword: string, serpData: any, semanticKeyword: string): string {
  const keyStatistic = serpData.keyStatistics[0];
  
  let conclusion = `Understanding ${semanticKeyword || keyword} empowers you to make informed health decisions based on current scientific evidence. The research clearly demonstrates that proactive approaches yield significantly better outcomes than reactive treatments.\n\n`;
  
  if (keyStatistic) {
    conclusion += `**Critical Insight**: ${keyStatistic} This finding emphasizes why evidence-based action and professional guidance are essential for achieving optimal health outcomes.\n\n`;
  }
  
  conclusion += `**Your Health Action Plan:**\n\n`;
  conclusion += `1. **Educate Yourself**: Continue learning from reputable medical sources and peer-reviewed research\n`;
  conclusion += `2. **Assess Your Current Status**: Identify personal risk factors, symptoms, and health baseline\n`;
  conclusion += `3. **Develop Your Strategy**: Create evidence-based plan with clear goals and measurable outcomes\n`;
  conclusion += `4. **Implement Systematically**: Execute strategies consistently while monitoring progress closely\n`;
  conclusion += `5. **Seek Expert Guidance**: Consult qualified healthcare providers for personalized recommendations\n`;
  conclusion += `6. **Monitor and Adjust**: Track results and modify approaches based on outcomes and professional advice\n\n`;
  
  conclusion += `**Essential Reminders**: The information in this guide represents current medical understanding and expert consensus. Individual responses vary significantly based on genetics, health status, and environmental factors.\n\n`;
  
  conclusion += `Consistency and patience are key to achieving lasting health improvements. Small, evidence-based changes implemented consistently often produce more significant long-term benefits than dramatic short-term interventions.\n\n`;
  
  conclusion += `**Medical Disclaimer**: This content is for educational purposes only and does not constitute medical advice. Always consult qualified healthcare professionals for diagnosis, treatment recommendations, and personalized health guidance. Never disregard professional medical advice or delay seeking treatment based on information from this guide.`;
  
  return conclusion;
}
