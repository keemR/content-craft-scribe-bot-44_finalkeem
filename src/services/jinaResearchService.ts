
interface JinaReaderResponse {
  code: number;
  status: number;
  data: {
    title: string;
    description: string;
    url: string;
    content: string;
    usage: {
      tokens: number;
    };
  };
}

interface JinaSearchResponse {
  code: number;
  status: number;
  data: Array<{
    title: string;
    url: string;
    content: string;
    description: string;
  }>;
}

interface JinaGroundingResponse {
  code: number;
  status: number;
  data: {
    factual: boolean;
    score: number;
    references: Array<{
      url: string;
      title: string;
      snippet: string;
    }>;
  };
}

interface JinaResearchData {
  extractedContent: Array<{
    title: string;
    content: string;
    url: string;
    description: string;
  }>;
  semanticResults: Array<{
    title: string;
    url: string;
    content: string;
    description: string;
  }>;
  factualValidation: {
    score: number;
    isFactual: boolean;
    references: Array<{
      url: string;
      title: string;
      snippet: string;
    }>;
  };
  contentGaps: string[];
  structuredInsights: string[];
}

/**
 * Jina AI Research Service for enhanced content research
 */
export class JinaResearchService {
  private baseUrl = 'https://r.jina.ai';
  private searchUrl = 'https://s.jina.ai';
  private groundingUrl = 'https://g.jina.ai';

  constructor(private apiKey?: string) {}

  /**
   * Perform comprehensive research using Jina AI
   */
  async performComprehensiveResearch(keyword: string, urls: string[] = []): Promise<JinaResearchData> {
    if (!this.apiKey) {
      return this.getFallbackData(keyword);
    }

    try {
      console.log(`🔍 Starting Jina AI research for: "${keyword}"`);

      const [extractedContent, semanticResults, factualValidation] = await Promise.allSettled([
        this.extractContentFromUrls(urls.slice(0, 5)), // Limit to first 5 URLs
        this.performSemanticSearch(keyword),
        this.validateFactualContent(keyword)
      ]);

      const researchData: JinaResearchData = {
        extractedContent: extractedContent.status === 'fulfilled' ? extractedContent.value : [],
        semanticResults: semanticResults.status === 'fulfilled' ? semanticResults.value : [],
        factualValidation: factualValidation.status === 'fulfilled' ? factualValidation.value : {
          score: 0,
          isFactual: false,
          references: []
        },
        contentGaps: [],
        structuredInsights: []
      };

      // Analyze content gaps and generate insights
      researchData.contentGaps = this.analyzeContentGaps(researchData, keyword);
      researchData.structuredInsights = this.generateStructuredInsights(researchData, keyword);

      console.log(`✅ Jina AI research completed for: "${keyword}"`);
      return researchData;

    } catch (error) {
      console.error('Jina AI research failed:', error);
      return this.getFallbackData(keyword);
    }
  }

  /**
   * Extract clean content from URLs using Jina Reader
   */
  private async extractContentFromUrls(urls: string[]): Promise<Array<{
    title: string;
    content: string;
    url: string;
    description: string;
  }>> {
    const results = [];

    for (const url of urls) {
      try {
        const response = await fetch(`${this.baseUrl}/${encodeURIComponent(url)}`, {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'X-Return-Format': 'text'
          }
        });

        if (response.ok) {
          const data: JinaReaderResponse = await response.json();
          
          if (data.code === 200 && data.data) {
            results.push({
              title: data.data.title || 'Extracted Content',
              content: data.data.content || '',
              url: data.data.url || url,
              description: data.data.description || ''
            });
          }
        }
      } catch (error) {
        console.error(`Failed to extract content from ${url}:`, error);
      }
    }

    return results;
  }

  /**
   * Perform semantic search using Jina Search
   */
  private async performSemanticSearch(keyword: string): Promise<Array<{
    title: string;
    url: string;
    content: string;
    description: string;
  }>> {
    try {
      const searchQuery = `${keyword} comprehensive guide research latest 2024`;
      const response = await fetch(`${this.searchUrl}/${encodeURIComponent(searchQuery)}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Return-Format': 'text'
        }
      });

      if (response.ok) {
        const data: JinaSearchResponse = await response.json();
        
        if (data.code === 200 && data.data) {
          return data.data.slice(0, 10).map(item => ({
            title: item.title || 'Search Result',
            url: item.url || '',
            content: item.content || '',
            description: item.description || ''
          }));
        }
      }
    } catch (error) {
      console.error('Semantic search failed:', error);
    }

    return [];
  }

  /**
   * Validate factual content using Jina Grounding
   */
  private async validateFactualContent(keyword: string): Promise<{
    score: number;
    isFactual: boolean;
    references: Array<{
      url: string;
      title: string;
      snippet: string;
    }>;
  }> {
    try {
      const factStatement = `${keyword} is beneficial for health and has scientific evidence supporting its use`;
      const response = await fetch(`${this.groundingUrl}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          statement: factStatement,
          sources: 'web'
        })
      });

      if (response.ok) {
        const data: JinaGroundingResponse = await response.json();
        
        if (data.code === 200 && data.data) {
          return {
            score: data.data.score || 0,
            isFactual: data.data.factual || false,
            references: data.data.references || []
          };
        }
      }
    } catch (error) {
      console.error('Factual validation failed:', error);
    }

    return {
      score: 0,
      isFactual: false,
      references: []
    };
  }

  /**
   * Analyze content gaps based on extracted content
   */
  private analyzeContentGaps(researchData: JinaResearchData, keyword: string): string[] {
    const gaps = [];
    
    if (keyword.toLowerCase().includes('vitamin d')) {
      gaps.push(
        'Detailed bioavailability studies and absorption mechanisms',
        'Genetic factors affecting vitamin D metabolism (CYP24A1, VDR polymorphisms)',
        'Interaction protocols with other nutrients and medications',
        'Population-specific deficiency patterns and treatment protocols',
        'Cost-effectiveness analysis of different testing and treatment approaches'
      );
    } else if (keyword.toLowerCase().includes('zinc')) {
      gaps.push(
        'Bioavailability comparison between different zinc forms',
        'Interaction timing with other minerals and phytates',
        'Age-specific absorption rates and requirements',
        'Food preparation effects on zinc content and absorption'
      );
    } else {
      gaps.push(
        'Evidence-based implementation frameworks',
        'Measurable outcome tracking systems',
        'Individual variation factors and personalization',
        'Long-term sustainability and maintenance protocols',
        'Cost-benefit analysis with alternative approaches'
      );
    }

    // Analyze extracted content for actual gaps
    const contentLength = researchData.extractedContent.reduce((total, item) => 
      total + item.content.length, 0
    );

    if (contentLength < 5000) {
      gaps.push('Comprehensive implementation details and step-by-step guidance');
    }

    if (researchData.semanticResults.length < 3) {
      gaps.push('Diverse expert perspectives and alternative approaches');
    }

    return gaps;
  }

  /**
   * Generate structured insights from research data
   */
  private generateStructuredInsights(researchData: JinaResearchData, keyword: string): string[] {
    const insights = [];

    // Content quality insights
    if (researchData.extractedContent.length > 0) {
      const avgContentLength = researchData.extractedContent.reduce((sum, item) => 
        sum + item.content.length, 0) / researchData.extractedContent.length;
      
      insights.push(`Average competitor content length: ${Math.round(avgContentLength)} characters`);
    }

    // Factual validation insights
    if (researchData.factualValidation.score > 0.7) {
      insights.push(`High factual accuracy score: ${Math.round(researchData.factualValidation.score * 100)}%`);
    } else if (researchData.factualValidation.score > 0.5) {
      insights.push(`Moderate factual validation - recommend additional expert sources`);
    }

    // Semantic search insights
    if (researchData.semanticResults.length > 5) {
      insights.push(`Rich semantic context available - ${researchData.semanticResults.length} related topics found`);
    }

    // Authority insights
    const authorityDomains = researchData.extractedContent
      .map(item => new URL(item.url).hostname)
      .filter(domain => 
        domain.includes('mayo') || 
        domain.includes('harvard') || 
        domain.includes('nih') ||
        domain.includes('webmd') ||
        domain.includes('healthline')
      );

    if (authorityDomains.length > 0) {
      insights.push(`Authority sources identified: ${authorityDomains.join(', ')}`);
    }

    return insights;
  }

  /**
   * Fallback data when API is not available
   */
  private getFallbackData(keyword: string): JinaResearchData {
    return {
      extractedContent: [],
      semanticResults: [],
      factualValidation: {
        score: 0,
        isFactual: false,
        references: []
      },
      contentGaps: [
        'Enhanced content extraction not available - API key required',
        'Semantic search capabilities disabled',
        'Fact verification features unavailable'
      ],
      structuredInsights: [
        `Basic research mode active for: ${keyword}`,
        'Connect Jina AI for enhanced research capabilities'
      ]
    };
  }
}

export const createJinaResearchService = (apiKey?: string) => {
  return new JinaResearchService(apiKey);
};
