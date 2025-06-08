
import { generateEnhancedVisuals, formatEnhancedVisualsForMarkdown } from './enhancedVisualGenerator';
import { slugify } from '../helpers';

interface TechnologyContentOptions {
  primaryKeyword: string;
  semanticKeywords: string[];
  serpData: any;
  researchData: string;
  articleLength: number;
  tone: string;
  includeImages: boolean;
  includeFAQs: boolean;
}

export async function generateTechnologyContent(options: TechnologyContentOptions): Promise<string> {
  const {
    primaryKeyword,
    semanticKeywords,
    serpData,
    researchData,
    articleLength,
    tone,
    includeImages,
    includeFAQs
  } = options;

  const currentYear = new Date().getFullYear();
  const title = createTechnologyTitle(primaryKeyword, currentYear);
  const estimatedReadingTime = Math.ceil(articleLength / 250);
  
  let content = `# ${title}\n\n`;
  
  // Add credibility signals
  const publishDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  content += `*Last Updated: ${publishDate} | ${estimatedReadingTime}-minute read | Technical analysis and insights*\n\n`;
  
  // Technology summary
  content += generateTechnologySummary(primaryKeyword, serpData, semanticKeywords[0]) + "\n\n";
  
  // Tech facts
  content += generateTechnologyQuickFacts(primaryKeyword, serpData) + "\n\n";
  
  // Technology introduction
  content += generateTechnologyIntroduction(primaryKeyword, serpData, semanticKeywords[0]) + "\n\n";
  
  // Generate technology-focused headings
  const headings = generateTechnologyHeadings(primaryKeyword);
  
  // Table of contents
  content += "## Table of Contents\n\n";
  headings.forEach((heading, index) => {
    const slug = slugify(heading);
    content += `${index + 1}. [${heading}](#${slug})\n`;
  });
  content += "\n\n";
  
  // Generate sections
  const sectionLength = Math.floor(articleLength / headings.length);
  
  headings.forEach((heading, index) => {
    content += `## ${heading}\n\n`;
    
    content += generateTechnologySectionContent(
      heading, 
      primaryKeyword, 
      serpData, 
      semanticKeywords[index % semanticKeywords.length] || semanticKeywords[0],
      sectionLength,
      index
    ) + "\n\n";
    
    // Add relevant visuals
    if (includeImages && index < 3) {
      const visuals = generateEnhancedVisuals(heading, primaryKeyword, 'technology', index);
      const visualsMarkdown = formatEnhancedVisualsForMarkdown(visuals);
      if (visualsMarkdown) {
        content += visualsMarkdown + "\n\n";
      }
    }
    
    if (index < headings.length - 1) {
      content += "---\n\n";
    }
  });

  // Technology FAQ section
  if (includeFAQs) {
    content += "## Frequently Asked Questions\n\n";
    content += generateTechnologyFAQs(primaryKeyword, serpData) + "\n\n";
  }

  // Technology conclusion
  content += "## Technical Summary\n\n";
  content += generateTechnologyConclusion(primaryKeyword, serpData, semanticKeywords[0]) + "\n\n";
  
  return content;
}

function createTechnologyTitle(keyword: string, year: number): string {
  if (keyword.toLowerCase().includes('ai') || keyword.toLowerCase().includes('artificial intelligence')) {
    return `${keyword}: Complete AI Technology Guide (${year})`;
  }
  
  if (keyword.toLowerCase().includes('programming') || keyword.toLowerCase().includes('coding')) {
    return `${keyword}: Developer's Complete Guide (${year})`;
  }
  
  if (keyword.toLowerCase().includes('software')) {
    return `${keyword}: Software Development Guide (${year})`;
  }
  
  return `${keyword}: Technology Implementation Guide (${year})`;
}

function generateTechnologySummary(keyword: string, serpData: any, semanticKeyword: string): string {
  const keyStats = serpData.keyStatistics.slice(0, 2);
  
  let summary = `## Technical Overview\n\n`;
  summary += `**Understanding ${keyword}** requires technical knowledge and practical implementation experience. `;
  
  if (keyStats[0]) {
    summary += `Current industry research shows ${keyStats[0].toLowerCase()}. `;
  }
  
  summary += `This comprehensive guide covers technical concepts, implementation strategies, and best practices.\n\n`;
  
  summary += `**🔧 Technical Highlights:**\n`;
  summary += `- Evidence-based technical approaches\n`;
  summary += `- Industry-standard implementations\n`;
  summary += `- Performance optimization techniques\n`;
  summary += `- Security and reliability considerations\n`;
  summary += `- Future technology trends and developments`;
  
  return summary;
}

function generateTechnologyQuickFacts(keyword: string, serpData: any): string {
  const stats = serpData.keyStatistics.slice(0, 4);
  
  let factsBox = `> **⚡ Tech Facts:**\n>\n`;
  
  if (keyword.toLowerCase().includes('ai')) {
    factsBox += `> • **Market Growth:** 37.3% CAGR through 2030\n`;
    factsBox += `> • **Investment:** $93.5B in AI startups (2021)\n`;
    factsBox += `> • **Job Impact:** 97M new AI jobs by 2025\n`;
    factsBox += `> • **Adoption Rate:** 35% of companies use AI\n`;
  } else if (keyword.toLowerCase().includes('programming')) {
    factsBox += `> • **Developer Growth:** 22% job growth projected\n`;
    factsBox += `> • **Languages:** 700+ programming languages exist\n`;
    factsBox += `> • **Remote Work:** 86% of developers work remotely\n`;
    factsBox += `> • **Salary Range:** $70K-$200K+ average globally\n`;
  } else {
    stats.forEach((stat: string, index: number) => {
      if (stat && index < 4) {
        factsBox += `> • ${stat}\n`;
      }
    });
  }
  
  return factsBox;
}

function generateTechnologyIntroduction(keyword: string, serpData: any, semanticKeyword: string): string {
  const keyStatistic = serpData.keyStatistics[0];
  
  let intro = `In today's rapidly evolving technology landscape, understanding **${keyword}** is crucial for technical professionals and organizations. `;
  
  if (keyStatistic) {
    intro += `Recent industry analysis reveals that ${keyStatistic.toLowerCase()}, making technical expertise essential for competitive advantage.\n\n`;
  }
  
  intro += `${semanticKeyword || 'Technology implementation'} requires systematic approaches that combine theoretical understanding with practical application. This comprehensive guide examines current technologies, implementation methodologies, and industry best practices.\n\n`;
  
  intro += `Whether you're a developer, system architect, or technology decision-maker, understanding these concepts will help you make informed technical choices and implement solutions that meet performance, security, and scalability requirements.`;
  
  return intro;
}

function generateTechnologyHeadings(keyword: string): string[] {
  if (keyword.toLowerCase().includes('ai') || keyword.toLowerCase().includes('artificial intelligence')) {
    return [
      'Understanding AI Fundamentals and Core Concepts',
      'Machine Learning Algorithms and Techniques',
      'AI Implementation Strategies and Frameworks',
      'Data Requirements and Preprocessing',
      'Model Training and Optimization',
      'Deployment and Production Considerations',
      'Ethical AI and Responsible Development',
      'Future AI Trends and Developments'
    ];
  }
  
  if (keyword.toLowerCase().includes('programming') || keyword.toLowerCase().includes('coding')) {
    return [
      'Programming Fundamentals and Best Practices',
      'Language Selection and Technology Stack',
      'Development Environment and Tools',
      'Code Quality and Testing Strategies',
      'Version Control and Collaboration',
      'Performance Optimization Techniques',
      'Security and Vulnerability Management',
      'Career Development and Continuous Learning'
    ];
  }
  
  // Generic technology headings
  return [
    `${keyword} Technical Fundamentals`,
    'System Architecture and Design Patterns',
    'Implementation Planning and Strategy',
    'Development Tools and Frameworks',
    'Testing and Quality Assurance',
    'Performance and Scalability Optimization',
    'Security and Compliance Considerations',
    'Maintenance and Future Upgrades'
  ];
}

function generateTechnologySectionContent(
  heading: string,
  keyword: string,
  serpData: any,
  semanticKeyword: string,
  targetLength: number,
  index: number
): string {
  const relevantStat = serpData.keyStatistics[index] || serpData.keyStatistics[0];
  
  let content = "";
  
  if (relevantStat) {
    content += `Industry research indicates that ${relevantStat.toLowerCase()}. This finding highlights the technical importance of ${heading.toLowerCase()} in ${semanticKeyword} development.\n\n`;
  }
  
  content += `### Technical Framework\n\n`;
  content += `**Standards-Based Approach**: Modern ${heading.toLowerCase()} implementations follow industry standards and established best practices. This ensures compatibility, maintainability, and long-term sustainability.\n\n`;
  
  content += `**Systematic Development**: Effective ${semanticKeyword} requires structured development processes with clear requirements, design specifications, and testing protocols.\n\n`;
  
  content += `**Performance Considerations**: Technical implementations must balance functionality with performance, considering factors such as scalability, responsiveness, and resource utilization.\n\n`;
  
  content += `**Security Integration**: Modern technology solutions incorporate security principles from the design phase, ensuring robust protection against potential vulnerabilities.\n\n`;
  
  content += `### Implementation Best Practices\n\n`;
  content += `1. **Requirements Analysis**: Thoroughly understand functional and non-functional requirements\n`;
  content += `2. **Architecture Design**: Create scalable and maintainable system architecture\n`;
  content += `3. **Development Standards**: Follow coding standards and documentation practices\n`;
  content += `4. **Testing Strategy**: Implement comprehensive testing at all levels\n`;
  content += `5. **Deployment Planning**: Plan for reliable and repeatable deployment processes\n\n`;
  
  content += `These proven technical approaches ensure successful implementation of ${semanticKeyword} solutions that meet performance, security, and maintainability requirements.`;
  
  return content;
}

function generateTechnologyFAQs(keyword: string, serpData: any): string {
  let faqs = "";
  
  if (keyword.toLowerCase().includes('ai')) {
    faqs += `### What programming languages are best for AI development?\n\n`;
    faqs += `Python is the most popular choice for AI development due to extensive libraries (TensorFlow, PyTorch, scikit-learn). R is excellent for statistical analysis, while JavaScript enables AI in web applications.\n\n`;
    
    faqs += `### How much data do I need for machine learning projects?\n\n`;
    faqs += `Data requirements vary significantly by problem complexity. Simple projects may need hundreds of examples, while complex deep learning models often require thousands to millions of training samples.\n\n`;
  } else if (keyword.toLowerCase().includes('programming')) {
    faqs += `### Which programming language should beginners learn first?\n\n`;
    faqs += `Python is often recommended for beginners due to its readable syntax and versatility. JavaScript is also excellent for web development, while Java provides strong foundation in object-oriented programming.\n\n`;
    
    faqs += `### How long does it take to become proficient in programming?\n\n`;
    faqs += `Basic proficiency typically takes 6-12 months of consistent practice. Professional-level skills usually require 2-3 years, though this varies based on dedication, prior experience, and learning approach.\n\n`;
  } else {
    faqs += `### What are the key considerations for ${keyword} implementation?\n\n`;
    faqs += `Key considerations include requirements analysis, technology selection, scalability planning, security requirements, and maintenance strategies. Proper planning prevents most implementation issues.\n\n`;
    
    faqs += `### How do I stay updated with ${keyword} developments?\n\n`;
    faqs += `Follow industry publications, attend conferences, participate in professional communities, take online courses, and engage with open-source projects in your technology area.\n\n`;
  }
  
  return faqs;
}

function generateTechnologyConclusion(keyword: string, serpData: any, semanticKeyword: string): string {
  const keyStatistic = serpData.keyStatistics[0];
  
  let conclusion = `Mastering ${semanticKeyword || keyword} requires continuous learning, practical application, and staying current with industry developments. Success in technology depends on combining theoretical knowledge with hands-on experience.\n\n`;
  
  if (keyStatistic) {
    conclusion += `**Industry Insight**: ${keyStatistic} This trend emphasizes the importance of developing relevant technical skills and staying adaptable to technological change.\n\n`;
  }
  
  conclusion += `**Technical Action Plan:**\n\n`;
  conclusion += `1. **Build Foundation**: Master fundamental concepts and principles\n`;
  conclusion += `2. **Gain Practical Experience**: Work on real projects and challenges\n`;
  conclusion += `3. **Stay Current**: Follow industry trends and emerging technologies\n`;
  conclusion += `4. **Practice Continuously**: Regular coding and problem-solving practice\n`;
  conclusion += `5. **Network and Learn**: Engage with the technical community\n\n`;
  
  conclusion += `**Success Principles**: The most successful technologists combine deep technical knowledge with practical problem-solving skills, continuous learning mindset, and effective collaboration abilities.\n\n`;
  
  conclusion += `Remember that technology evolves rapidly, making adaptability and continuous learning essential for long-term success in any technical field.`;
  
  return conclusion;
}
