
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
 * Calculates optimal keyword density for SEO
 */
const calculateOptimalKeywordDensity = (content: string, keyword: string): number => {
  const words = content.toLowerCase().split(/\s+/).length;
  const keywordCount = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length;
  return (keywordCount / words) * 100;
};

/**
 * Generates semantic keyword variations for better SEO
 */
const generateSemanticKeywords = (primaryKeyword: string): string[] => {
  const base = primaryKeyword.toLowerCase();
  const semanticVariations = [
    `${base} guide`,
    `${base} tips`,
    `${base} benefits`,
    `${base} strategies`,
    `${base} techniques`,
    `${base} methods`,
    `${base} solutions`,
    `${base} advice`,
    `${base} recommendations`,
    `${base} best practices`,
    `how to ${base}`,
    `${base} for beginners`,
    `${base} explained`,
    `${base} tutorial`
  ];
  return semanticVariations;
};

/**
 * Creates SEO-optimized meta description
 */
const generateMetaDescription = (primaryKeyword: string, researchData: string): string => {
  const currentYear = new Date().getFullYear();
  
  // Extract a key statistic or finding if available
  let keyFinding = '';
  if (researchData) {
    const percentageMatch = researchData.match(/\d+(?:\.\d+)?%[^.]*?(?:\.|;|,)/);
    if (percentageMatch) {
      keyFinding = ` ${percentageMatch[0]}`;
    }
  }
  
  return `Discover the ultimate ${primaryKeyword} guide for ${currentYear}.${keyFinding} Expert-backed strategies, actionable tips, and proven methods. Read our comprehensive guide now!`;
};

/**
 * Generates schema markup data for better SERP features
 */
const generateSchemaMarkup = (title: string, primaryKeyword: string, wordCount: number): string => {
  const currentDate = new Date().toISOString();
  const readingTime = Math.ceil(wordCount / 200);
  
  return `<!-- Schema Markup for SEO -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${title}",
  "description": "Comprehensive guide to ${primaryKeyword} with expert insights and actionable strategies",
  "author": {
    "@type": "Organization",
    "name": "Expert Content Team"
  },
  "datePublished": "${currentDate}",
  "dateModified": "${currentDate}",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "${typeof window !== 'undefined' ? window.location.href : ''}"
  },
  "wordCount": ${wordCount},
  "timeRequired": "PT${readingTime}M",
  "articleSection": ["${primaryKeyword}", "Guide", "Tutorial"],
  "keywords": "${primaryKeyword}, guide, tips, strategies, best practices"
}
</script>`;
};

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
  const numberMatches = researchData.match(/\d+(?:,\d+)*\s+(?:people|adults|patients|cases|studies|users|customers)[^.]*?(?:\.|;|,)/gi) || [];
  numberMatches.forEach(stat => {
    if (stat.length > 15) statistics.push(stat.trim());
  });
  
  return statistics.slice(0, 10);
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
  
  while ((match = quotePattern.exec(researchData)) !== null && quotes.length < 5) {
    quotes.push(`"${match[1].trim()}" - ${match[2].trim()}`);
  }
  
  // Look for statements by experts without quotes
  const expertPattern = /(?:Dr\.|Professor|Expert|Researcher)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)[^.]*?(?:says?|states?|explains?|notes?|reports?)[^.]*?\.([^.]*\.)/gi;
  let expertMatch;
  
  while ((expertMatch = expertPattern.exec(researchData)) !== null && quotes.length < 5) {
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
  
  return findings.slice(0, 8);
};

/**
 * Generates SEO-optimized featured snippet content
 */
const generateFeaturedSnippetContent = (primaryKeyword: string, researchData: string): string => {
  const statistics = extractResearchStatistics(researchData);
  const findings = extractResearchFindings(researchData);
  
  let snippetContent = `**${primaryKeyword}** is a crucial topic that requires understanding and proper implementation. `;
  
  if (findings.length > 0) {
    snippetContent += `${findings[0]} `;
  }
  
  if (statistics.length > 0) {
    snippetContent += `Research shows that ${statistics[0].toLowerCase()} `;
  }
  
  snippetContent += `This comprehensive guide provides step-by-step instructions, expert insights, and proven strategies to help you achieve optimal results.`;
  
  return snippetContent;
};

/**
 * Generates research-enhanced content for a specific section with SEO optimization
 */
const generateSEOOptimizedSectionContent = (
  researchData: string,
  heading: string,
  keywordsList: string[],
  tone: string,
  targetLength: number,
  semanticKeywords: string[]
): string => {
  if (!researchData || researchData.trim().length < 20) {
    return generateSectionContent(heading, keywordsList, tone, targetLength, '', 'general');
  }
  
  console.log(`🔬 Generating SEO-optimized content for: "${heading}"`);
  
  const statistics = extractResearchStatistics(researchData);
  const quotes = extractResearchQuotes(researchData);
  const findings = extractResearchFindings(researchData);
  const primaryKeyword = keywordsList[0] || '';
  
  let content = '';
  
  // SEO-optimized opening with primary keyword in first 100 words
  if (findings.length > 0) {
    content += `Understanding **${primaryKeyword}** is essential for achieving optimal results. ${findings[0]} Our research-based analysis reveals the most effective ${semanticKeywords[0] || 'strategies'} for implementation.\n\n`;
  } else {
    content += `**${primaryKeyword}** represents a critical area for improvement and growth. Expert analysis and current research provide valuable insights into the most effective ${semanticKeywords[1] || 'approaches'} available today.\n\n`;
  }
  
  // Featured snippet optimization - direct answer format
  content += `### Quick Answer\n\n`;
  content += generateFeaturedSnippetContent(primaryKeyword, researchData) + '\n\n';
  
  // Data-driven evidence section
  if (statistics.length > 0) {
    content += `### Research-Backed Evidence\n\n`;
    content += `Current data supports the effectiveness of ${primaryKeyword} ${semanticKeywords[2] || 'methods'}:\n\n`;
    statistics.slice(0, 4).forEach(stat => {
      content += `- **${stat}**\n`;
    });
    content += '\n';
  }
  
  // Expert insights with E-A-T signals
  if (quotes.length > 0) {
    content += `### Expert Analysis\n\n`;
    content += `Leading authorities in ${primaryKeyword} ${semanticKeywords[3] || 'research'} emphasize:\n\n`;
    content += `> ${quotes[0]}\n\n`;
    content += `This expert perspective aligns with our comprehensive analysis of ${semanticKeywords[4] || 'best practices'} in the field.\n\n`;
  }
  
  // Step-by-step implementation (targets featured snippets)
  content += `### Step-by-Step Implementation\n\n`;
  content += `Follow these evidence-based steps for ${primaryKeyword} success:\n\n`;
  content += `1. **Assessment Phase**: Evaluate your current situation and establish baseline metrics\n`;
  content += `2. **Planning Phase**: Develop a strategic approach using proven ${semanticKeywords[5] || 'techniques'}\n`;
  content += `3. **Implementation Phase**: Execute your plan with consistent monitoring\n`;
  content += `4. **Optimization Phase**: Refine your approach based on results and feedback\n`;
  content += `5. **Maintenance Phase**: Sustain long-term success through continuous improvement\n\n`;
  
  // Additional research insights
  if (findings.length > 1) {
    content += `### Additional Research Insights\n\n`;
    findings.slice(1, 3).forEach(finding => {
      content += `${finding} This finding supports the importance of ${semanticKeywords[6] || 'strategic planning'} in ${primaryKeyword} implementation.\n\n`;
    });
  }
  
  // Practical tips section (targets "how to" queries)
  content += `### Practical ${primaryKeyword} Tips\n\n`;
  content += `Based on extensive research and expert recommendations:\n\n`;
  content += `- **Start with fundamentals**: Master the basic ${semanticKeywords[7] || 'principles'} before advancing\n`;
  content += `- **Use data-driven decisions**: Monitor key metrics to guide your ${semanticKeywords[8] || 'strategy'}\n`;
  content += `- **Seek expert guidance**: Consult with professionals for complex ${primaryKeyword} challenges\n`;
  content += `- **Stay updated**: Follow industry ${semanticKeywords[9] || 'trends'} and research developments\n`;
  content += `- **Practice consistency**: Regular application yields better long-term results\n\n`;
  
  // Additional statistics for authority
  if (statistics.length > 4) {
    content += `### Supporting Data\n\n`;
    content += `Additional research confirms the effectiveness of these ${primaryKeyword} ${semanticKeywords[10] || 'approaches'}:\n\n`;
    statistics.slice(4, 7).forEach(stat => {
      content += `- ${stat}\n`;
    });
    content += '\n';
  }
  
  console.log(`✅ Generated ${content.length} characters of SEO-optimized content for "${heading}"`);
  
  return content;
};

/**
 * Generates high-quality SEO-optimized content based on user inputs
 * Now properly uses research data when provided with advanced SEO optimization
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
  
  // Generate semantic keyword variations for better SEO
  const semanticKeywords = generateSemanticKeywords(primaryKeyword);
  
  // Identify topic category to customize content structure
  const topicCategory = determineTopicCategory(primaryKeyword);
  
  // Check if we have substantial research data
  const hasResearchData = researchData && researchData.trim().length > 50;
  
  console.log('SEO Content generation started:', { 
    primaryKeyword, 
    topicCategory, 
    includeImages, 
    hasResearchData,
    researchDataLength: researchData?.length || 0,
    seoLevel
  });
  
  if (hasResearchData) {
    console.log('✅ Using provided research data to enhance content quality and SEO rankings');
  } else {
    console.log('ℹ️ No research data provided, using standard SEO-optimized content generation');
  }
  
  // Use competitive content generation for better quality
  if (seoLevel >= 80 && numericArticleLength >= 3000) {
    try {
      return generateCompetitiveContent({
        ...options,
        topicCategory
      });
    } catch (error) {
      console.error('Error generating competitive content, falling back to SEO-optimized generation:', error);
    }
  }
  
  let content = "";
  
  // Create SEO-optimized title with current year
  const currentYear = new Date().getFullYear();
  const title = `${primaryKeyword}: The Complete Guide (${currentYear}) - Expert Strategies & Proven Results`;
  content += `# ${title}\n\n`;
  
  // Add meta description for SEO
  const metaDescription = generateMetaDescription(primaryKeyword, researchData || '');
  content += `<!-- SEO Meta Description: ${metaDescription} -->\n\n`;
  
  // Add estimated reading time and publish date
  const estimatedReadingTime = Math.ceil(numericArticleLength / 200);
  const publishDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  content += `*Published: ${publishDate} | Reading time: ${estimatedReadingTime} minutes | Last updated: ${publishDate}*\n\n`;
  
  // Add breadcrumb navigation for SEO
  content += `**Navigation:** [Home](/) → [${topicCategory.charAt(0).toUpperCase() + topicCategory.slice(1)}](/${topicCategory}) → ${primaryKeyword}\n\n`;
  
  // Featured snippet optimized summary
  content += "## TL;DR (Quick Summary)\n\n";
  if (hasResearchData) {
    content += generateFeaturedSnippetContent(primaryKeyword, researchData) + "\n\n";
  } else {
    content += `**${primaryKeyword}** is essential for success in ${currentYear}. This comprehensive guide covers proven strategies, expert insights, and actionable steps. Key benefits include improved results, reduced errors, and faster implementation. Follow our step-by-step approach for optimal outcomes.\n\n`;
  }
  
  // Add research overview if we have research data
  if (hasResearchData) {
    console.log('📊 Adding comprehensive research overview section');
    const researchStats = extractResearchStatistics(researchData);
    const researchQuotes = extractResearchQuotes(researchData);
    const researchFindings = extractResearchFindings(researchData);
    
    if (researchStats.length > 0 || researchQuotes.length > 0 || researchFindings.length > 0) {
      content += "## 📊 Research Overview & Key Statistics\n\n";
      content += `This comprehensive ${primaryKeyword} guide is based on extensive research analysis and expert insights:\n\n`;
      
      if (researchStats.length > 0) {
        content += "### Key Research Statistics\n\n";
        researchStats.slice(0, 5).forEach(stat => {
          content += `- **${stat}**\n`;
        });
        content += "\n";
      }
      
      if (researchFindings.length > 0) {
        content += "### Major Research Findings\n\n";
        researchFindings.slice(0, 3).forEach(finding => {
          content += `${finding}\n\n`;
        });
      }
      
      if (researchQuotes.length > 0) {
        content += "### Expert Perspectives\n\n";
        content += `> ${researchQuotes[0]}\n\n`;
        content += `This expert analysis reinforces the importance of evidence-based ${semanticKeywords[0]} in achieving optimal results.\n\n`;
      }
      
      content += "---\n\n";
    }
  }
  
  // Key Takeaways - enhanced with research data and semantic keywords
  content += "## 🎯 Key Takeaways\n\n";
  if (hasResearchData) {
    console.log('🎯 Enhancing takeaways with research findings and semantic SEO');
    const findings = extractResearchFindings(researchData);
    if (findings.length > 0) {
      content += "**Evidence-Based Key Points:**\n\n";
      findings.slice(0, 5).forEach((finding, index) => {
        const cleanFinding = finding.replace(/^[^a-zA-Z]*/, '').trim();
        const semanticKeyword = semanticKeywords[index] || 'strategies';
        content += `- **${cleanFinding}** - Essential for ${semanticKeyword}\n`;
      });
      content += "\n";
    }
  }
  
  // Add standard SEO-optimized takeaways
  const takeaways = generateKeyTakeaways(keywordsList, topicCategory);
  content += takeaways + "\n\n";
  
  // Generate introduction enhanced with research data and semantic keywords
  if (hasResearchData) {
    const quotes = extractResearchQuotes(researchData);
    if (quotes.length > 0) {
      content += `> ${quotes[0]}\n\n`;
    }
  }
  content += generateIntroduction(keywordsList, tone, targetAudience, topicCategory) + "\n\n";
  
  // SEO-optimized Table of Contents with anchor links
  content += "## 📋 Table of Contents\n\n";
  const headings = generateHeadings(keywordsList, topicCategory, targetAudience);
  
  headings.forEach((heading, index) => {
    const slug = slugify(heading);
    content += `${index + 1}. [${heading}](#${slug})\n`;
  });
  content += "\n\n";
  
  // Calculate section length for optimal content distribution
  const sectionLength = Math.floor(numericArticleLength / headings.length);
  
  // Generate sections with enhanced research data integration and semantic SEO
  headings.forEach((heading, index) => {
    const slug = slugify(heading);
    content += `<h2 id="${slug}">${heading}</h2>\n\n`;
    
    // Generate section content with research data and semantic keywords if available
    if (hasResearchData) {
      content += generateSEOOptimizedSectionContent(
        researchData, 
        heading, 
        keywordsList, 
        tone, 
        sectionLength,
        semanticKeywords
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
    
    // Add SEO-optimized images when enabled
    if (includeImages) {
      console.log(`🖼️ Adding SEO-optimized visual for section ${index + 1}: "${heading}"`);
      
      let imageUrl = '';
      let imageDescription = '';
      let altText = '';
      
      if (primaryKeyword.toLowerCase().includes('vitamin d')) {
        const vitaminDImages = [
          { 
            url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80', 
            desc: 'Person experiencing vitamin D deficiency symptoms showing fatigue',
            alt: 'Vitamin D deficiency symptoms fatigue weakness'
          },
          { 
            url: 'https://images.unsplash.com/photo-1582719471137-c3967ffaaf0e?w=800&q=80', 
            desc: 'Healthcare professional conducting vitamin D blood test analysis',
            alt: 'Vitamin D blood test medical analysis healthcare'
          },
          { 
            url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&q=80', 
            desc: 'Vitamin D rich foods including salmon eggs and fortified products',
            alt: 'Vitamin D rich foods salmon eggs fortified dairy'
          },
          { 
            url: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80', 
            desc: 'Vitamin D3 supplements dosing information and recommendations',
            alt: 'Vitamin D3 supplements dosage recommendations health'
          }
        ];
        const imageData = vitaminDImages[index % vitaminDImages.length];
        imageUrl = imageData.url;
        imageDescription = imageData.desc;
        altText = imageData.alt;
      } else if (primaryKeyword.toLowerCase().includes('zinc')) {
        const zincImages = [
          { 
            url: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80', 
            desc: 'Zinc-rich foods for immune system support and health',
            alt: 'Zinc rich foods immune system support nutrition'
          },
          { 
            url: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&q=80', 
            desc: 'Healthy zinc-containing foods and supplement options',
            alt: 'Zinc foods supplements nutrition health benefits'
          },
          { 
            url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80', 
            desc: 'Nutritional sources of zinc for optimal health benefits',
            alt: 'Zinc nutritional sources optimal health benefits'
          },
          { 
            url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80', 
            desc: 'Zinc supplementation and immune support recommendations',
            alt: 'Zinc supplements immune support health recommendations'
          }
        ];
        const imageData = zincImages[index % zincImages.length];
        imageUrl = imageData.url;
        imageDescription = imageData.desc;
        altText = imageData.alt;
      } else {
        const genericImages = [
          {
            url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
            desc: `Professional guidance and strategies for ${heading.toLowerCase()}`,
            alt: `${primaryKeyword} professional guidance strategies`
          },
          {
            url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
            desc: `Data analysis and research insights for ${heading.toLowerCase()}`,
            alt: `${primaryKeyword} data analysis research insights`
          },
          {
            url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
            desc: `Implementation framework and best practices for ${heading.toLowerCase()}`,
            alt: `${primaryKeyword} implementation framework best practices`
          },
          {
            url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
            desc: `Expert recommendations and proven methods for ${heading.toLowerCase()}`,
            alt: `${primaryKeyword} expert recommendations proven methods`
          }
        ];
        const imageData = genericImages[index % genericImages.length];
        imageUrl = imageData.url;
        imageDescription = imageData.desc;
        altText = imageData.alt;
      }
      
      content += `### 📸 Visual Guide: ${heading}\n\n`;
      content += `![${altText}](${imageUrl})\n\n`;
      content += `*Figure ${index + 1}: ${imageDescription} - Research-backed visual guide for ${heading.toLowerCase()} implementation*\n\n`;
      
      console.log(`✅ Added SEO-optimized image for "${heading}": ${imageUrl}`);
    }
    
    if (index < headings.length - 1) {
      content += "---\n\n";
    }
  });

  // Add comprehensive FAQ section optimized for featured snippets
  if (includeFAQs) {
    content += "## ❓ Frequently Asked Questions (FAQ)\n\n";
    content += generateFAQs(keywordsList, targetAudience, topicCategory) + "\n\n";
    
    // Add additional research-based FAQs if we have data
    if (hasResearchData) {
      const statistics = extractResearchStatistics(researchData);
      if (statistics.length > 0) {
        content += `### ${primaryKeyword} Statistics & Data\n\n`;
        content += `**Q: What does current research say about ${primaryKeyword}?**\n\n`;
        content += `A: Recent studies provide compelling evidence:\n\n`;
        statistics.slice(0, 3).forEach(stat => {
          content += `- ${stat}\n`;
        });
        content += `\nThese statistics demonstrate the significant impact and importance of proper ${primaryKeyword} implementation.\n\n`;
      }
    }
  }

  // Add conclusion with call-to-action and semantic keywords
  content += "## 🎯 Conclusion\n\n";
  content += generateConclusion(keywordsList, tone, targetAudience, topicCategory) + "\n\n";
  
  // Add related topics for internal linking (SEO benefit)
  content += "### Related Topics\n\n";
  content += `Explore these related ${primaryKeyword} topics:\n\n`;
  semanticKeywords.slice(0, 5).forEach(keyword => {
    content += `- [${keyword.charAt(0).toUpperCase() + keyword.slice(1)}](#)\n`;
  });
  content += "\n";
  
  // Add author bio for E-A-T signals
  content += "### About the Author\n\n";
  content += `This comprehensive ${primaryKeyword} guide was researched and written by our expert content team with extensive experience in the field. Our content is regularly reviewed and updated to ensure accuracy and relevance.\n\n`;
  
  // Add last updated timestamp for freshness signals
  content += `*Last updated: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}*\n\n`;
  
  // Calculate final word count for schema markup
  const finalWordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  
  // Add schema markup for rich snippets
  content += generateSchemaMarkup(title, primaryKeyword, finalWordCount) + "\n\n";
  
  console.log('✅ SEO-optimized content generation completed');
  console.log(`📊 Final SEO stats: ${content.length} characters, ${finalWordCount} words, ${(content.match(/### 📸 Visual Guide/g) || []).length} visuals, research data: ${hasResearchData ? 'YES' : 'NO'}, semantic keywords: ${semanticKeywords.length}`);
  
  return content;
};
