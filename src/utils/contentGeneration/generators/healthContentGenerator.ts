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
    
    content += generateHealthSectionContent(
      heading, 
      primaryKeyword, 
      serpData, 
      semanticKeywords[index % semanticKeywords.length] || semanticKeywords[0],
      sectionLength,
      index,
      topicCategory
    ) + "\n\n";
    
    // Add relevant visuals
    if (includeImages && index < 3) {
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
    content += generateHealthFAQs(primaryKeyword, serpData, topicCategory) + "\n\n";
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
    stats.forEach((stat: string, index: number) => {
      if (stat && index < 4) {
        factsBox += `> • ${stat}\n`;
      }
    });
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

function generateHealthSectionContent(
  heading: string,
  keyword: string,
  serpData: any,
  semanticKeyword: string,
  targetLength: number,
  index: number,
  topicCategory: string
): string {
  // Use specific content for known health topics
  if (keyword.toLowerCase().includes('vitamin d')) {
    return generateVitaminDContent(heading, semanticKeyword, serpData, index);
  }
  
  if (keyword.toLowerCase().includes('zinc')) {
    return generateZincContent(heading, semanticKeyword, serpData, index);
  }
  
  // Generic health content
  const relevantStat = serpData.keyStatistics[index] || serpData.keyStatistics[0];
  
  let content = "";
  
  if (relevantStat) {
    content += `Research indicates that ${relevantStat.toLowerCase()}. This finding highlights the importance of understanding ${heading.toLowerCase()} in the context of ${semanticKeyword}.\n\n`;
  }
  
  content += `### Key Considerations\n\n`;
  content += `**Evidence-Based Approach**: Current medical research supports specific strategies for ${heading.toLowerCase()}. Healthcare professionals recommend following established protocols that have been validated through clinical studies.\n\n`;
  
  content += `**Individual Assessment**: Personal health circumstances significantly influence ${semanticKeyword} outcomes. Factors such as age, existing health conditions, lifestyle, and genetic predisposition all play important roles.\n\n`;
  
  content += `**Professional Guidance**: Medical consultation enhances success rates and ensures safety. Healthcare providers can offer personalized recommendations based on your specific health profile.\n\n`;
  
  content += `**Monitoring Progress**: Regular assessment helps track improvements and allows for timely adjustments to treatment or prevention strategies.\n\n`;
  
  content += `Understanding these fundamentals helps you make informed decisions about ${semanticKeyword} and work effectively with healthcare professionals to achieve optimal outcomes.`;
  
  return content;
}

function generateVitaminDContent(heading: string, keyword: string, serpData: any, index: number): string {
  if (heading.toLowerCase().includes('warning signs') || heading.toLowerCase().includes('symptoms')) {
    return `Vitamin D deficiency often develops gradually, with symptoms that can be easily overlooked or attributed to other causes. Recognizing these warning signs early can prevent serious complications.

### Primary Warning Signs

**Persistent Fatigue and Weakness**
One of the earliest and most common signs, affecting up to 89% of people with deficiency. Unlike normal tiredness, this fatigue doesn't improve with rest and can significantly impact daily activities.

**Bone and Back Pain**
Vitamin D regulates calcium absorption, so deficiency often manifests as:
- Deep, aching bone pain
- Lower back discomfort
- Joint stiffness, especially in the morning
- Increased fracture risk

**Muscle Weakness and Pain**
Particularly noticeable in the:
- Proximal muscles (thighs, shoulders)
- Difficulty climbing stairs or rising from chairs
- General muscle aches without clear cause

**Frequent Infections**
Vitamin D plays a crucial role in immune function. Deficient individuals often experience:
- More frequent colds and flu
- Slower recovery from infections
- Increased susceptibility to respiratory infections`;
  }
  
  // Add more specific vitamin D content based on heading
  return `Understanding ${heading.toLowerCase()} is crucial for managing vitamin D deficiency effectively. This information helps you make informed decisions about testing, treatment, and long-term health optimization.`;
}

function generateZincContent(heading: string, keyword: string, serpData: any, index: number): string {
  if (heading.toLowerCase().includes('zinc-rich foods') || heading.toLowerCase().includes('top')) {
    return `Zinc content varies dramatically between food sources, with animal products generally providing the highest concentrations and best bioavailability.

### Animal-Based Zinc Sources

**Oysters** lead all food sources, providing an exceptional 74mg of zinc per 100g serving—more than six times the daily requirement. Just six medium oysters supply your entire weekly zinc needs.

**Red Meat** offers excellent zinc density:
- Beef chuck roast: 12.3mg per 100g
- Lamb shoulder: 9.9mg per 100g  
- Pork shoulder: 5.1mg per 100g

### Plant-Based Zinc Sources

**Seeds and Nuts:**
- Pumpkin seeds: 10.3mg per 100g
- Sesame seeds: 10.2mg per 100g
- Cashews: 5.6mg per 100g
- Almonds: 3.1mg per 100g

**Legumes** (cooked):
- Chickpeas: 1.5mg per 100g
- Lentils: 1.3mg per 100g
- Black beans: 1.2mg per 100g`;
  }
  
  return `This section provides essential information about ${heading.toLowerCase()} as it relates to ${keyword}. Understanding these concepts helps optimize your nutritional strategy and support immune health effectively.`;
}

function generateHealthFAQs(keyword: string, serpData: any, topicCategory: string): string {
  let faqs = "";
  
  if (keyword.toLowerCase().includes('vitamin d')) {
    faqs += `### What vitamin D blood level should I aim for?\n\n`;
    faqs += `Most experts recommend 40-60 ng/mL (100-150 nmol/L) for optimal health, though medical guidelines consider 30+ ng/mL sufficient. Levels below 20 ng/mL indicate deficiency requiring treatment.\n\n`;
    
    faqs += `### How much vitamin D should I supplement?\n\n`;
    faqs += `For deficiency, 2000-4000 IU daily is typically needed. For maintenance, 1000-2000 IU works for most people. Higher doses may require medical supervision.\n\n`;
  } else if (keyword.toLowerCase().includes('zinc')) {
    faqs += `### How much zinc do I need daily?\n\n`;
    faqs += `Adult men need 11mg of zinc daily, while adult women need 8mg. Pregnant women require 11mg, and breastfeeding women need 12mg. The upper safe limit is 40mg daily.\n\n`;
    
    faqs += `### Which foods have the highest zinc content?\n\n`;
    faqs += `Oysters contain the most zinc at 74mg per 100g, followed by beef (12.3mg), pumpkin seeds (10.3mg), and cashews (5.6mg). Animal sources generally provide better absorption.\n\n`;
  } else {
    // Generic health FAQs
    faqs += `### What should I know about ${keyword}?\n\n`;
    faqs += `Understanding ${keyword} requires considering individual health factors, current research, and professional medical guidance. Each person's situation is unique.\n\n`;
    
    faqs += `### When should I seek professional help?\n\n`;
    faqs += `Consult healthcare providers when symptoms persist, worsen, or interfere with daily activities. Early professional intervention often leads to better outcomes.\n\n`;
  }
  
  return faqs;
}

function generateHealthConclusion(keyword: string, serpData: any, semanticKeyword: string): string {
  const keyStatistic = serpData.keyStatistics[0];
  
  let conclusion = `Understanding ${semanticKeyword || keyword} empowers you to make informed health decisions. The evidence clearly demonstrates the importance of addressing health concerns proactively rather than reactively.\n\n`;
  
  if (keyStatistic) {
    conclusion += `**Remember the key finding**: ${keyStatistic} This statistic underscores why staying informed and taking appropriate action matters for long-term health.\n\n`;
  }
  
  conclusion += `**Essential Health Action Steps:**\n\n`;
  conclusion += `1. **Stay Informed**: Continue learning about evidence-based health approaches\n`;
  conclusion += `2. **Assess Your Health**: Identify personal risk factors and current health status\n`;
  conclusion += `3. **Develop a Health Plan**: Create actionable steps based on your specific needs\n`;
  conclusion += `4. **Seek Professional Guidance**: Consult healthcare providers when appropriate\n`;
  conclusion += `5. **Monitor Progress**: Track health improvements and adjust strategies as needed\n\n`;
  
  conclusion += `**Final Thoughts**: The information in this guide represents current medical understanding and expert recommendations. Individual responses may vary, and personal health circumstances should always be considered.\n\n`;
  
  conclusion += `Stay informed, stay proactive, and remember that small, consistent health actions often yield the most significant long-term benefits.\n\n`;
  
  conclusion += `*This information is for educational purposes only and should not replace professional medical advice. Always consult qualified healthcare providers for personalized guidance.*`;
  
  return conclusion;
}
