
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
import { generateEnhancedVisuals, formatEnhancedVisualsForMarkdown } from './generators/enhancedVisualGenerator';
import { fetchRealTimeData } from './generators/realTimeDataService';

/**
 * Extracts statistics and data points from research data
 */
const extractResearchStatistics = (researchData: string): string[] => {
  if (!researchData || researchData.trim().length < 20) return [];
  
  const statistics: string[] = [];
  
  // Extract percentages with context
  const percentageMatches = researchData.match(/\d+(?:\.\d+)?%[^.]*?(?:\.|;|,)/g) || [];
  percentageMatches.forEach(stat => {
    if (stat.length > 10) statistics.push(stat.trim());
  });
  
  // Extract dollar amounts with context
  const dollarMatches = researchData.match(/\$[\d,]+(?:\.\d+)?(?:[BM]|billion|million)?[^.]*?(?:\.|;|,)/gi) || [];
  dollarMatches.forEach(stat => {
    if (stat.length > 10) statistics.push(stat.trim());
  });
  
  // Extract numerical facts with context
  const numberMatches = researchData.match(/\d+(?:,\d+)*\s+(?:people|adults|patients|cases|studies)[^.]*?(?:\.|;|,)/gi) || [];
  numberMatches.forEach(stat => {
    if (stat.length > 15) statistics.push(stat.trim());
  });
  
  return statistics.slice(0, 8);
};

/**
 * Extracts expert quotes from research data
 */
const extractResearchQuotes = (researchData: string): string[] => {
  if (!researchData || researchData.trim().length < 20) return [];
  
  const quotes: string[] = [];
  
  // Look for quoted text with attribution
  const quotePattern = /"([^"]{30,300})"[\s\S]*?(?:said|stated|according to|notes|explains?|reports?)[\s\S]*?([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi;
  let match;
  
  while ((match = quotePattern.exec(researchData)) !== null && quotes.length < 4) {
    quotes.push(`"${match[1].trim()}" - ${match[2].trim()}`);
  }
  
  // Look for statements by experts without quotes
  const expertPattern = /(?:Dr\.|Professor|Expert|Researcher)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)[^.]*?(?:says?|states?|explains?|notes?|reports?)[^.]*?\.([^.]*\.)/gi;
  let expertMatch;
  
  while ((expertMatch = expertPattern.exec(researchData)) !== null && quotes.length < 4) {
    quotes.push(`"${expertMatch[2].trim()}" - ${expertMatch[1].trim()}`);
  }
  
  return quotes;
};

/**
 * Extracts key research findings and studies
 */
const extractResearchFindings = (researchData: string): string[] => {
  if (!researchData || researchData.trim().length < 20) return [];
  
  const findings: string[] = [];
  
  // Look for study mentions with findings
  const studyPattern = /(?:study|research|trial|analysis|survey|investigation)[^.]*?(?:found|showed|revealed|demonstrated|concluded|reported|discovered)[^.]*?\./gi;
  const matches = researchData.match(studyPattern) || [];
  
  matches.forEach(finding => {
    const cleanFinding = finding.trim();
    if (cleanFinding.length > 40 && cleanFinding.length < 400) {
      findings.push(cleanFinding);
    }
  });
  
  // Look for key findings or results
  const findingPattern = /(?:key finding|main result|important discovery|significant result)[^.]*?\./gi;
  const findingMatches = researchData.match(findingPattern) || [];
  
  findingMatches.forEach(finding => {
    const cleanFinding = finding.trim();
    if (cleanFinding.length > 30 && cleanFinding.length < 400) {
      findings.push(cleanFinding);
    }
  });
  
  return findings.slice(0, 6);
};

/**
 * Generates research-enhanced content for a specific section
 */
const generateResearchEnhancedSectionContent = (
  researchData: string,
  heading: string,
  keywordsList: string[],
  tone: string,
  targetLength: number
): string => {
  if (!researchData || researchData.trim().length < 20) {
    return generateSectionContent(heading, keywordsList, tone, targetLength, '', 'general');
  }
  
  console.log(`🔬 Generating research-enhanced content for: "${heading}"`);
  
  const statistics = extractResearchStatistics(researchData);
  const quotes = extractResearchQuotes(researchData);
  const findings = extractResearchFindings(researchData);
  
  let content = '';
  
  // Start with research-based opening
  if (findings.length > 0) {
    content += `Recent research provides valuable insights into ${heading.toLowerCase()}. ${findings[0]}\n\n`;
  } else {
    content += `Understanding ${heading.toLowerCase()} is crucial for achieving optimal results. Current research and expert analysis reveal important considerations for implementation.\n\n`;
  }
  
  // Add relevant statistics if available
  if (statistics.length > 0) {
    content += `**Research Data & Statistics:**\n\n`;
    statistics.slice(0, 3).forEach(stat => {
      content += `- ${stat}\n`;
    });
    content += '\n';
  }
  
  // Add expert insights if available
  if (quotes.length > 0) {
    content += `**Expert Perspective:**\n\n`;
    content += `${quotes[0]}\n\n`;
  }
  
  // Add additional research findings
  if (findings.length > 1) {
    content += `**Key Research Insights:**\n\n`;
    findings.slice(1, 3).forEach(finding => {
      content += `${finding}\n\n`;
    });
  }
  
  // Add practical application section
  content += `**Practical Application:**\n\n`;
  content += `Based on the research evidence, implementing effective ${heading.toLowerCase()} strategies requires:\n\n`;
  content += `- Following evidence-based protocols and guidelines\n`;
  content += `- Considering individual circumstances and risk factors\n`;
  content += `- Regular monitoring and adjustment of approaches\n`;
  content += `- Staying informed about latest research developments\n\n`;
  
  // Add relevant additional statistics
  if (statistics.length > 3) {
    content += `**Additional Research Data:**\n\n`;
    statistics.slice(3, 6).forEach(stat => {
      content += `- ${stat}\n`;
    });
    content += '\n';
  }
  
  console.log(`✅ Generated ${content.length} characters of research-enhanced content for "${heading}"`);
  
  return content;
};

/**
 * Generates high-quality SEO-optimized content based on user inputs
 * Now properly uses research data when provided
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

  // Ensure articleLength is a number
  const numericArticleLength = typeof articleLength === 'string' 
    ? parseInt(articleLength, 10) 
    : articleLength;

  // Parse keywords for better semantic richness
  const keywordsList = targetKeywords.split(',').map(k => k.trim());
  const primaryKeyword = keywordsList[0] || '';
  
  // Identify topic category to customize content structure
  const topicCategory = determineTopicCategory(primaryKeyword);
  
  // Check if we have substantial research data
  const hasResearchData = researchData && researchData.trim().length > 50;
  
  console.log('Content generation started:', { 
    primaryKeyword, 
    topicCategory, 
    includeImages, 
    hasResearchData,
    researchDataLength: researchData?.length || 0
  });
  
  if (hasResearchData) {
    console.log('✅ Using provided research data to enhance content quality');
  } else {
    console.log('ℹ️ No research data provided, using standard content generation');
  }
  
  // Use competitive content generation for better quality
  if (seoLevel >= 80 && numericArticleLength >= 3000) {
    try {
      return generateCompetitiveContent({
        ...options,
        topicCategory
      });
    } catch (error) {
      console.error('Error generating competitive content, falling back to standard generation:', error);
    }
  }
  
  let content = "";
  
  // Create optimized title
  const title = createTitleFromKeywords(keywordsList, topicCategory);
  content += `# ${title}\n\n`;
  
  // Add estimated reading time
  const estimatedReadingTime = Math.ceil(numericArticleLength / 200);
  content += `*Reading time: ${estimatedReadingTime} minutes*\n\n`;
  
  // Add research overview if we have research data
  if (hasResearchData) {
    console.log('📊 Adding research overview section');
    const researchStats = extractResearchStatistics(researchData);
    const researchQuotes = extractResearchQuotes(researchData);
    
    if (researchStats.length > 0 || researchQuotes.length > 0) {
      content += "## Research Overview\n\n";
      content += "This comprehensive guide is based on the latest research and expert analysis:\n\n";
      
      if (researchStats.length > 0) {
        content += "**Key Statistics:**\n\n";
        researchStats.slice(0, 4).forEach(stat => {
          content += `- ${stat}\n`;
        });
        content += "\n";
      }
      
      if (researchQuotes.length > 0) {
        content += "**Expert Insight:**\n\n";
        content += `${researchQuotes[0]}\n\n`;
      }
      
      content += "---\n\n";
    }
  }
  
  // Key Takeaways - enhanced with research data
  content += "## Key Takeaways\n\n";
  if (hasResearchData) {
    console.log('🎯 Enhancing takeaways with research findings');
    const findings = extractResearchFindings(researchData);
    if (findings.length > 0) {
      content += "**Research-Based Key Points:**\n\n";
      findings.slice(0, 4).forEach(finding => {
        const cleanFinding = finding.replace(/^[^a-zA-Z]*/, '').trim();
        content += `- ${cleanFinding}\n`;
      });
      content += "\n";
    }
  }
  
  // Add standard takeaways
  const takeaways = generateKeyTakeaways(keywordsList, topicCategory);
  content += takeaways + "\n\n";
  
  // Generate introduction enhanced with research data
  if (hasResearchData) {
    const quotes = extractResearchQuotes(researchData);
    if (quotes.length > 0) {
      content += `> ${quotes[0]}\n\n`;
    }
  }
  content += generateIntroduction(keywordsList, tone, targetAudience, topicCategory) + "\n\n";
  
  // Table of Contents
  content += "## Table of Contents\n\n";
  const headings = generateHeadings(keywordsList, topicCategory, targetAudience);
  
  headings.forEach((heading, index) => {
    content += `${index + 1}. [${heading}](#${slugify(heading)})\n`;
  });
  content += "\n\n";
  
  // Calculate section length
  const sectionLength = Math.floor(numericArticleLength / headings.length);
  
  // Generate sections with research data integration
  headings.forEach((heading, index) => {
    content += `<h2 id="${slugify(heading)}">${heading}</h2>\n\n`;
    
    // Generate section content with research data if available
    if (hasResearchData) {
      content += generateResearchEnhancedSectionContent(
        researchData, 
        heading, 
        keywordsList, 
        tone, 
        sectionLength
      ) + "\n\n";
    } else {
      content += generateSectionContent(
        heading, 
        keywordsList, 
        tone, 
        sectionLength, 
        targetAudience, 
        topicCategory
      ) + "\n\n";
    }
    
    // Add images when enabled
    if (includeImages) {
      console.log(`🖼️ Adding visual for section ${index + 1}: "${heading}"`);
      
      let imageUrl = '';
      let imageDescription = '';
      
      if (primaryKeyword.toLowerCase().includes('vitamin d')) {
        const vitaminDImages = [
          { url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80', desc: 'Person experiencing vitamin D deficiency symptoms' },
          { url: 'https://images.unsplash.com/photo-1582719471137-c3967ffaaf0e?w=800&q=80', desc: 'Healthcare professional conducting vitamin D blood test' },
          { url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&q=80', desc: 'Vitamin D rich foods including salmon and eggs' },
          { url: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80', desc: 'Vitamin D3 supplements and dosing information' }
        ];
        const imageData = vitaminDImages[index % vitaminDImages.length];
        imageUrl = imageData.url;
        imageDescription = imageData.desc;
      } else if (primaryKeyword.toLowerCase().includes('zinc')) {
        const zincImages = [
          { url: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80', desc: 'Zinc-rich foods for immune system support' },
          { url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&q=80', desc: 'Healthy zinc-containing foods and supplements' },
          { url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80', desc: 'Nutritional sources of zinc for optimal health' },
          { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', desc: 'Zinc supplementation and immune support' }
        ];
        const imageData = zincImages[index % zincImages.length];
        imageUrl = imageData.url;
        imageDescription = imageData.desc;
      } else {
        const genericImages = [
          'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
          'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
          'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80'
        ];
        imageUrl = genericImages[index % genericImages.length];
        imageDescription = `Professional illustration for ${heading.toLowerCase()}`;
      }
      
      content += `### 📸 Visual Guide\n\n`;
      content += `![${imageDescription}](${imageUrl})\n\n`;
      content += `*${imageDescription} - Evidence-based guidance for ${heading.toLowerCase()}*\n\n`;
      
      console.log(`✅ Added image for "${heading}": ${imageUrl}`);
    }
    
    if (index < headings.length - 1) {
      content += "---\n\n";
    }
  });

  // Add FAQs
  if (includeFAQs) {
    content += "## Frequently Asked Questions\n\n";
    content += generateFAQs(keywordsList, targetAudience, topicCategory) + "\n\n";
  }

  // Add conclusion
  content += "## Conclusion\n\n";
  content += generateConclusion(keywordsList, tone, targetAudience, topicCategory) + "\n\n";
  
  console.log('✅ Content generation completed');
  console.log(`📊 Final stats: ${content.length} characters, ${(content.match(/### 📸 Visual Guide/g) || []).length} visuals, research data: ${hasResearchData ? 'YES' : 'NO'}`);
  
  return content;
};
