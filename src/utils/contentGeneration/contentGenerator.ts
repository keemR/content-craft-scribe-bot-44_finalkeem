
import React from 'react';
import { ContentGenerationOptions } from './types';
import { createTitleFromKeywords, slugify } from './helpers';
import { generateKeyTakeaways } from './generators/takeawaysGenerator';
import { generateIntroduction } from './generators/introductionGenerator';
import { generateHeadings } from './generators/headingsGenerator';
import { generateSectionContent } from './generators/sectionGenerator';
import { generateFAQs } from './generators/faqGenerator';
import { generateConclusion } from './generators/conclusionGenerator';
import { determineTopicCategory } from './topicCategories';
import { generateCompetitiveContent } from './generators/competitiveContentGenerator';
import { researchSERPs } from '../../services/serpResearchService';

/**
 * Enhanced content generator using real SERP research data
 */
export const generateSEOContent = async (options: ContentGenerationOptions): Promise<string> => {
  const { 
    researchData, 
    targetKeywords, 
    articleLength, 
    tone, 
    includeImages, 
    includeFAQs,
    seoLevel = 80,
    targetAudience = '',
    preventRepetition = true,
    contentSpecificity = 70,
    includeExamples = true,
    includeStatistics = true,
    useCaseStudies = true
  } = options;

  const numericArticleLength = typeof articleLength === 'string' 
    ? parseInt(articleLength, 10) 
    : articleLength;

  const keywordsList = targetKeywords.split(',').map(k => k.trim());
  const primaryKeyword = keywordsList[0] || '';
  
  console.log('🚀 Starting enhanced SEO content generation with SERP research:', { 
    primaryKeyword, 
    includeImages, 
    seoLevel,
    hasResearchData: !!researchData
  });
  
  // Research SERPs for real data
  const serpData = await researchSERPs(primaryKeyword);
  
  // Combine user research with SERP data
  const enhancedResearchData = researchData 
    ? `${researchData}\n\nSERP RESEARCH DATA:\n${serpData.authorityContent}`
    : serpData.authorityContent;
  
  const topicCategory = determineTopicCategory(primaryKeyword);
  
  let content = "";
  
  // Create SEO-optimized title
  const currentYear = new Date().getFullYear();
  const title = createSEOTitle(primaryKeyword, serpData, currentYear);
  content += `# ${title}\n\n`;
  
  // Add meta information
  const estimatedReadingTime = Math.ceil(numericArticleLength / 200);
  const publishDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  content += `*Published: ${publishDate} | Reading time: ${estimatedReadingTime} minutes | Evidence-based content*\n\n`;
  
  // Featured snippet optimized summary
  content += "## Quick Answer (Featured Snippet)\n\n";
  content += generateFeaturedSnippet(primaryKeyword, serpData) + "\n\n";
  
  // Research-backed key takeaways
  content += "## Key Takeaways\n\n";
  content += generateResearchTakeaways(primaryKeyword, serpData) + "\n\n";
  
  // Authority introduction with real data
  content += generateAuthorityIntroduction(primaryKeyword, serpData, enhancedResearchData) + "\n\n";
  
  // Generate headings based on SERP analysis
  const headings = generateSERPOptimizedHeadings(primaryKeyword, serpData, topicCategory);
  
  // Table of contents
  content += "## Table of Contents\n\n";
  headings.forEach((heading, index) => {
    const slug = slugify(heading);
    content += `${index + 1}. [${heading}](#${slug})\n`;
  });
  content += "\n\n";
  
  // Generate sections with real SERP data
  const sectionLength = Math.floor(numericArticleLength / headings.length);
  
  headings.forEach((heading, index) => {
    const slug = slugify(heading);
    content += `<h2 id="${slug}">${heading}</h2>\n\n`;
    
    content += generateDataDrivenSection(
      heading, 
      primaryKeyword, 
      serpData, 
      enhancedResearchData,
      sectionLength,
      index
    ) + "\n\n";
    
    // Add images for better SEO
    if (includeImages && index < 4) {
      content += generateSEOImage(heading, primaryKeyword, index) + "\n\n";
    }
    
    if (index < headings.length - 1) {
      content += "---\n\n";
    }
  });

  // Enhanced FAQ section based on SERP data
  if (includeFAQs) {
    content += "## Frequently Asked Questions\n\n";
    content += generateSERPBasedFAQs(primaryKeyword, serpData) + "\n\n";
  }

  // Evidence-based conclusion
  content += "## Conclusion\n\n";
  content += generateEvidenceBasedConclusion(primaryKeyword, serpData, enhancedResearchData) + "\n\n";
  
  // Add schema markup
  const finalWordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  content += generateSchemaMarkup(title, primaryKeyword, finalWordCount) + "\n\n";
  
  console.log(`✅ Enhanced content generation completed: ${content.length} characters, ${finalWordCount} words, SERP data integrated`);
  
  return content;
};

/**
 * Create SEO-optimized title using SERP insights
 */
function createSEOTitle(keyword: string, serpData: any, year: number): string {
  const topResult = serpData.topResults[0];
  if (topResult && topResult.title) {
    return `${keyword}: Complete ${year} Guide - ${topResult.title.split(':')[0] || 'Expert Analysis'}`;
  }
  
  if (keyword.toLowerCase().includes('symptom')) {
    return `${keyword}: ${year} Complete Guide - Early Warning Signs & Expert Analysis`;
  }
  
  if (keyword.toLowerCase().includes('deficiency')) {
    return `${keyword}: ${year} Evidence-Based Guide - Symptoms, Testing & Treatment`;
  }
  
  return `${keyword}: Complete ${year} Guide - Expert Insights & Proven Strategies`;
}

/**
 * Generate featured snippet optimized content
 */
function generateFeaturedSnippet(keyword: string, serpData: any): string {
  const topResult = serpData.topResults[0];
  const stats = serpData.keyStatistics[0];
  
  let snippet = `**${keyword}** are important health indicators that require proper attention. `;
  
  if (topResult && topResult.snippet) {
    snippet += `${topResult.snippet.substring(0, 200)}... `;
  }
  
  if (stats) {
    snippet += `Research shows that ${stats.toLowerCase()}. `;
  }
  
  snippet += `This evidence-based guide provides comprehensive information, expert insights, and actionable recommendations.`;
  
  return snippet;
}

/**
 * Generate research-backed takeaways
 */
function generateResearchTakeaways(keyword: string, serpData: any): string {
  let takeaways = "";
  
  // Add statistics-based takeaways
  if (serpData.keyStatistics.length > 0) {
    takeaways += "**Evidence-Based Key Points:**\n\n";
    serpData.keyStatistics.slice(0, 5).forEach((stat: string) => {
      takeaways += `- **${stat}** - Critical for understanding ${keyword}\n`;
    });
    takeaways += "\n";
  }
  
  // Add authority-based takeaways
  if (serpData.topResults.length > 0) {
    takeaways += "**Authority Insights:**\n\n";
    serpData.topResults.slice(0, 3).forEach((result: any) => {
      takeaways += `- **${result.title}**: ${result.snippet.substring(0, 100)}...\n`;
    });
  }
  
  return takeaways;
}

/**
 * Generate authority introduction with real data
 */
function generateAuthorityIntroduction(keyword: string, serpData: any, researchData: string): string {
  const topResult = serpData.topResults[0];
  const stats = serpData.keyStatistics;
  
  let intro = `Understanding **${keyword}** is crucial for maintaining optimal health and well-being. `;
  
  if (stats.length > 0) {
    intro += `Current research reveals that ${stats[0].toLowerCase()}, highlighting the importance of early recognition and proper management.\n\n`;
  }
  
  if (topResult && topResult.snippet) {
    intro += `According to leading health authorities, ${topResult.snippet.substring(0, 300)}...\n\n`;
  }
  
  intro += `This comprehensive, evidence-based guide synthesizes the latest research findings, expert recommendations, and proven strategies to help you understand and address ${keyword} effectively.`;
  
  return intro;
}

/**
 * Generate SERP-optimized headings
 */
function generateSERPOptimizedHeadings(keyword: string, serpData: any, topicCategory: string): string[] {
  const baseHeadings = [
    `Understanding ${keyword}: The Complete Overview`,
    `Early Recognition: Key Signs to Watch For`,
    `Causes and Risk Factors`,
    `Diagnosis and Testing Methods`,
    `Treatment and Management Options`,
    `Prevention Strategies`,
    `When to Seek Medical Help`,
    `Expert Recommendations and Best Practices`
  ];
  
  // Customize based on related questions from SERP
  if (serpData.relatedQuestions.length > 0) {
    const questionHeadings = serpData.relatedQuestions.slice(0, 3).map((q: string) => 
      q.replace(/^(What|How|When|Why|Where)\s+/i, '').replace(/\?$/, '')
    );
    return [...baseHeadings.slice(0, 5), ...questionHeadings, ...baseHeadings.slice(5)];
  }
  
  return baseHeadings;
}

/**
 * Generate data-driven section content
 */
function generateDataDrivenSection(
  heading: string, 
  keyword: string, 
  serpData: any, 
  researchData: string,
  targetLength: number,
  index: number
): string {
  let content = "";
  
  // Use relevant SERP result for this section
  const relevantResult = serpData.topResults[index] || serpData.topResults[0];
  const relevantStat = serpData.keyStatistics[index] || serpData.keyStatistics[0];
  
  // Section introduction with data
  if (relevantResult) {
    content += `${relevantResult.snippet}\n\n`;
  }
  
  // Add statistical evidence
  if (relevantStat) {
    content += `**Research Evidence**: ${relevantStat}\n\n`;
  }
  
  // Add comprehensive content based on heading
  if (heading.toLowerCase().includes('understanding') || heading.toLowerCase().includes('overview')) {
    content += generateOverviewContent(keyword, serpData);
  } else if (heading.toLowerCase().includes('signs') || heading.toLowerCase().includes('symptoms')) {
    content += generateSymptomsContent(keyword, serpData);
  } else if (heading.toLowerCase().includes('causes') || heading.toLowerCase().includes('risk')) {
    content += generateCausesContent(keyword, serpData);
  } else if (heading.toLowerCase().includes('diagnosis') || heading.toLowerCase().includes('testing')) {
    content += generateDiagnosisContent(keyword, serpData);
  } else if (heading.toLowerCase().includes('treatment') || heading.toLowerCase().includes('management')) {
    content += generateTreatmentContent(keyword, serpData);
  } else {
    content += generateGeneralContent(heading, keyword, serpData);
  }
  
  return content;
}

/**
 * Generate specific content types based on section
 */
function generateOverviewContent(keyword: string, serpData: any): string {
  return `${keyword} represent a complex health topic that requires comprehensive understanding. Based on current medical research and expert analysis, here are the fundamental aspects you need to know:

**Key Characteristics:**
- Multiple factors contribute to ${keyword}
- Early detection significantly improves outcomes
- Evidence-based approaches yield the best results
- Professional medical guidance is essential

**Current Research Insights:**
${serpData.keyStatistics.slice(0, 3).map((stat: string) => `- ${stat}`).join('\n')}

Understanding these foundational elements helps you make informed decisions about your health and seek appropriate care when needed.`;
}

function generateSymptomsContent(keyword: string, serpData: any): string {
  return `Recognizing the early signs is crucial for timely intervention and optimal outcomes. Here's what you need to watch for:

**Primary Indicators:**
1. **Fatigue and Low Energy** - Often the first noticeable sign
2. **Physical Discomfort** - Various manifestations depending on severity
3. **Changes in Normal Function** - Subtle alterations in daily activities
4. **Mood and Cognitive Changes** - Impact on mental well-being
5. **Sleep Pattern Disruptions** - Quality and duration affected

**Warning Signs Requiring Immediate Attention:**
- Severe or persistent symptoms
- Rapid progression of existing signs
- Multiple symptoms occurring together
- Interference with daily activities

${serpData.keyStatistics[0] ? `**Important Statistic**: ${serpData.keyStatistics[0]}` : ''}

Remember that symptoms can vary significantly between individuals, and professional evaluation is always recommended for accurate assessment.`;
}

function generateCausesContent(keyword: string, serpData: any): string {
  return `Understanding the underlying causes helps in both prevention and treatment. Research has identified several key contributing factors:

**Primary Causes:**
1. **Nutritional Factors** - Inadequate intake or absorption
2. **Lifestyle Elements** - Daily habits and environmental exposure
3. **Genetic Predisposition** - Individual risk factors
4. **Medical Conditions** - Underlying health issues
5. **Age-Related Changes** - Natural physiological shifts

**Risk Factors to Consider:**
- Geographic location and climate
- Dietary restrictions or preferences
- Certain medications or treatments
- Chronic health conditions
- Age and gender factors

${serpData.keyStatistics[1] ? `**Research Finding**: ${serpData.keyStatistics[1]}` : ''}

Identifying your personal risk factors enables targeted prevention strategies and more effective management approaches.`;
}

function generateDiagnosisContent(keyword: string, serpData: any): string {
  return `Accurate diagnosis is essential for effective treatment. Here's what the diagnostic process typically involves:

**Diagnostic Methods:**
1. **Medical History Review** - Comprehensive health assessment
2. **Physical Examination** - Clinical evaluation of symptoms
3. **Laboratory Testing** - Blood tests and biomarker analysis
4. **Imaging Studies** - When additional visualization is needed
5. **Specialist Consultation** - Expert evaluation for complex cases

**What to Expect:**
- Initial screening and assessment
- Targeted testing based on symptoms
- Results interpretation and explanation
- Treatment planning and recommendations

**Preparing for Your Appointment:**
- Document symptoms and timeline
- List current medications and supplements
- Prepare questions for your healthcare provider
- Bring previous test results if available

${serpData.keyStatistics[2] ? `**Clinical Data**: ${serpData.keyStatistics[2]}` : ''}

Early and accurate diagnosis significantly improves treatment outcomes and long-term health management.`;
}

function generateTreatmentContent(keyword: string, serpData: any): string {
  return `Effective treatment requires a comprehensive, individualized approach based on severity and underlying causes:

**Treatment Approaches:**
1. **Lifestyle Modifications** - Foundational changes for long-term success
2. **Nutritional Interventions** - Targeted dietary adjustments
3. **Supplementation** - When dietary sources are insufficient
4. **Medical Therapy** - Professional treatment protocols
5. **Monitoring and Follow-up** - Ongoing assessment and adjustment

**Evidence-Based Strategies:**
- Gradual implementation for better compliance
- Regular monitoring of progress
- Adjustment based on individual response
- Integration with overall health management

**Treatment Timeline:**
- Initial improvements: 2-4 weeks
- Significant changes: 6-12 weeks  
- Full optimization: 3-6 months
- Long-term maintenance: Ongoing

${serpData.keyStatistics[3] ? `**Treatment Success Rate**: ${serpData.keyStatistics[3]}` : ''}

Working closely with healthcare professionals ensures the most effective and safe treatment approach for your specific situation.`;
}

function generateGeneralContent(heading: string, keyword: string, serpData: any): string {
  return `This aspect of ${keyword} requires careful consideration and evidence-based understanding:

**Key Points:**
- Professional guidance is essential
- Individual factors significantly influence outcomes
- Evidence-based approaches yield better results
- Regular monitoring and adjustment are important

**Research-Backed Recommendations:**
${serpData.keyStatistics.slice(0, 2).map((stat: string) => `- ${stat}`).join('\n')}

**Practical Applications:**
Understanding ${heading.toLowerCase()} helps you make informed decisions and work effectively with healthcare professionals to achieve optimal outcomes.

**Expert Insights:**
Current research emphasizes the importance of individualized approaches and comprehensive management strategies for addressing ${keyword} effectively.`;
}

/**
 * Generate SERP-based FAQs
 */
function generateSERPBasedFAQs(keyword: string, serpData: any): string {
  let faqs = "";
  
  // Use related questions from SERP data
  if (serpData.relatedQuestions.length > 0) {
    serpData.relatedQuestions.slice(0, 8).forEach((question: string, index: number) => {
      faqs += `### ${question}\n\n`;
      
      // Generate answer using SERP data
      const relevantStat = serpData.keyStatistics[index] || serpData.keyStatistics[0];
      const relevantResult = serpData.topResults[index] || serpData.topResults[0];
      
      let answer = `Based on current research and expert analysis, `;
      if (relevantResult && relevantResult.snippet) {
        answer += `${relevantResult.snippet.substring(0, 200)}... `;
      }
      
      if (relevantStat) {
        answer += `Research shows that ${relevantStat.toLowerCase()}. `;
      }
      
      answer += `For personalized guidance, consult with a qualified healthcare professional.\n\n`;
      faqs += answer;
    });
  }
  
  return faqs;
}

/**
 * Generate evidence-based conclusion
 */
function generateEvidenceBasedConclusion(keyword: string, serpData: any, researchData: string): string {
  const topStat = serpData.keyStatistics[0];
  
  return `Understanding ${keyword} is essential for maintaining optimal health and well-being. This comprehensive guide has provided you with evidence-based information, expert insights, and practical strategies for recognition, management, and prevention.

**Key Takeaways:**
- Early recognition significantly improves outcomes
- Evidence-based approaches are most effective
- Professional guidance is essential for optimal results
- Individual factors require personalized strategies

${topStat ? `**Remember**: ${topStat}` : ''}

**Next Steps:**
1. Assess your personal risk factors
2. Monitor for early warning signs
3. Consult healthcare professionals when needed
4. Implement evidence-based prevention strategies
5. Stay informed about latest research developments

This information is for educational purposes only and should not replace professional medical advice. Always consult with qualified healthcare providers for personalized guidance and treatment recommendations.

*Sources: Based on current medical research, expert analysis, and authoritative health information.*`;
}

/**
 * Generate SEO-optimized images
 */
function generateSEOImage(heading: string, keyword: string, index: number): string {
  const images = [
    'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    'https://images.unsplash.com/photo-1582719471137-c3967ffaaf0e?w=800&q=80',
    'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&q=80',
    'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80'
  ];
  
  const imageUrl = images[index % images.length];
  const altText = `${keyword} - ${heading} - Expert medical guidance and analysis`;
  
  return `### 📸 Visual Guide: ${heading}\n\n![${altText}](${imageUrl})\n\n*Figure ${index + 1}: Expert analysis and visual guide for ${heading.toLowerCase()} - Evidence-based medical information*`;
}

/**
 * Generate schema markup for SEO
 */
function generateSchemaMarkup(title: string, keyword: string, wordCount: number): string {
  const currentDate = new Date().toISOString();
  const readingTime = Math.ceil(wordCount / 200);
  
  return `<!-- Schema Markup for Enhanced SEO -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  "headline": "${title}",
  "description": "Evidence-based guide to ${keyword} with expert insights and research-backed recommendations",
  "author": {
    "@type": "Organization",
    "name": "Medical Expert Team"
  },
  "datePublished": "${currentDate}",
  "dateModified": "${currentDate}",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "${typeof window !== 'undefined' ? window.location.href : ''}"
  },
  "wordCount": ${wordCount},
  "timeRequired": "PT${readingTime}M",
  "about": {
    "@type": "MedicalCondition",
    "name": "${keyword}"
  },
  "audience": {
    "@type": "PatientsAudience"
  },
  "keywords": "${keyword}, health, medical, symptoms, treatment, diagnosis"
}
</script>`;
}
