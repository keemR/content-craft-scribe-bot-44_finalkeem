
import { researchSERPs } from './serpResearchService';
import { performEnhancedResearch } from './enhancedResearchService';

export const performWebResearch = async (
  keywords: string,
  setIsResearching: (isResearching: boolean) => void,
  toast: (props: any) => void,
  jinaApiKey?: string
): Promise<string> => {
  setIsResearching(true);
  
  try {
    console.log(`🔍 Starting comprehensive web research for: "${keywords}"`);
    
    toast({
      title: "Research in Progress",
      description: jinaApiKey ? 
        "Using enhanced Jina AI research capabilities..." : 
        "Analyzing SERPs and gathering authoritative data...",
    });
    
    // Use enhanced research with Jina AI if API key is provided
    let researchData = `COMPREHENSIVE RESEARCH DATA FOR: ${keywords}\n\n`;
    
    if (jinaApiKey) {
      console.log('🤖 Using enhanced research with Jina AI');
      const enhancedData = await performEnhancedResearch(keywords, jinaApiKey);
      
      // Add Jina AI extracted content
      if (enhancedData.jinaResearchData?.extractedContent.length) {
        researchData += `JINA AI EXTRACTED CONTENT:\n`;
        enhancedData.jinaResearchData.extractedContent.forEach((content, index) => {
          researchData += `${index + 1}. ${content.title}\n`;
          researchData += `${content.description}\n`;
          researchData += `Content: ${content.content.substring(0, 500)}...\n`;
          researchData += `Source: ${content.url}\n\n`;
        });
      }
      
      // Add semantic search results
      if (enhancedData.jinaResearchData?.semanticResults.length) {
        researchData += `SEMANTIC SEARCH RESULTS:\n`;
        enhancedData.jinaResearchData.semanticResults.forEach((result, index) => {
          researchData += `${index + 1}. ${result.title}\n`;
          researchData += `${result.description}\n`;
          researchData += `URL: ${result.url}\n\n`;
        });
      }
      
      // Add factual validation
      if (enhancedData.jinaResearchData?.factualValidation) {
        const validation = enhancedData.jinaResearchData.factualValidation;
        researchData += `FACTUAL VALIDATION:\n`;
        researchData += `Accuracy Score: ${Math.round(validation.score * 100)}%\n`;
        researchData += `Factual Status: ${validation.isFactual ? 'Verified' : 'Needs Verification'}\n`;
        if (validation.references.length > 0) {
          researchData += `Supporting References:\n`;
          validation.references.forEach((ref, index) => {
            researchData += `- ${ref.title} (${ref.url})\n`;
          });
        }
        researchData += '\n';
      }
      
      // Add structured insights
      if (enhancedData.jinaResearchData?.structuredInsights.length) {
        researchData += `STRUCTURED INSIGHTS:\n`;
        enhancedData.jinaResearchData.structuredInsights.forEach(insight => {
          researchData += `• ${insight}\n`;
        });
        researchData += '\n';
      }
      
      // Add enhanced content gaps
      if (enhancedData.competitorGaps.length > 0) {
        researchData += `CONTENT GAPS ANALYSIS:\n`;
        enhancedData.competitorGaps.forEach((gap, index) => {
          researchData += `${index + 1}. ${gap}\n`;
        });
        researchData += '\n';
      }
      
      // Add regular research data
      if (enhancedData.serpData?.topResults.length > 0) {
        researchData += `TOP SEARCH RESULTS:\n`;
        enhancedData.serpData.topResults.forEach((result: any, index: number) => {
          researchData += `${index + 1}. ${result.title}\n${result.snippet}\nSource: ${result.url}\n\n`;
        });
      }
      
    } else {
      // Fallback to basic SERP research
      console.log('📊 Using basic SERP research');
      const serpData = await researchSERPs(keywords);
      
      // Add top search results
      if (serpData.topResults.length > 0) {
        researchData += `TOP SEARCH RESULTS:\n`;
        serpData.topResults.forEach((result, index) => {
          researchData += `${index + 1}. ${result.title}\n${result.snippet}\nSource: ${result.url}\n\n`;
        });
      }
      
      // Add key statistics
      if (serpData.keyStatistics.length > 0) {
        researchData += `KEY STATISTICS:\n`;
        serpData.keyStatistics.forEach((stat, index) => {
          researchData += `• ${stat}\n`;
        });
        researchData += '\n';
      }
      
      // Add related questions
      if (serpData.relatedQuestions.length > 0) {
        researchData += `RELATED QUESTIONS:\n`;
        serpData.relatedQuestions.forEach((question, index) => {
          researchData += `Q${index + 1}: ${question}\n`;
        });
        researchData += '\n';
      }
      
      // Add authority content
      if (serpData.authorityContent) {
        researchData += `AUTHORITY CONTENT:\n${serpData.authorityContent}\n\n`;
      }
    }
    
    // Add research metadata
    researchData += `RESEARCH METADATA:\n`;
    researchData += `Research Date: ${new Date().toISOString()}\n`;
    researchData += `Enhanced Mode: ${jinaApiKey ? 'Yes (Jina AI)' : 'No (Basic SERP)'}\n`;
    researchData += `Total Research Length: ${researchData.length} characters\n`;
    
    console.log(`✅ Research completed: ${researchData.length} characters of comprehensive data`);
    
    toast({
      title: "Research Complete",
      description: jinaApiKey ? 
        "Enhanced research with Jina AI completed successfully!" :
        "Basic research completed - connect Jina AI for enhanced capabilities",
    });
    
    return researchData;
    
  } catch (error) {
    console.error('Research failed:', error);
    
    toast({
      title: "Research Error",
      description: "Using fallback research data. Content will still be generated.",
      variant: "destructive",
    });
    
    return `RESEARCH DATA FOR: ${keywords}\n\nThis topic requires comprehensive analysis based on current research and expert insights. The content generated will include evidence-based information and practical recommendations.`;
    
  } finally {
    setIsResearching(false);
  }
};
