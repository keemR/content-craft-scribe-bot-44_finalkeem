
import { researchSERPs } from './serpResearchService';

export const performWebResearch = async (
  keywords: string,
  setIsResearching: (isResearching: boolean) => void,
  toast: (props: any) => void
): Promise<string> => {
  setIsResearching(true);
  
  try {
    console.log(`🔍 Starting comprehensive web research for: "${keywords}"`);
    
    toast({
      title: "Research in Progress",
      description: "Analyzing SERPs and gathering authoritative data...",
    });
    
    // Research SERPs for real data
    const serpData = await researchSERPs(keywords);
    
    // Compile comprehensive research data
    let researchData = `COMPREHENSIVE RESEARCH DATA FOR: ${keywords}\n\n`;
    
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
    
    // Add research metadata
    researchData += `RESEARCH METADATA:\n`;
    researchData += `Research Date: ${new Date().toISOString()}\n`;
    researchData += `Sources Analyzed: ${serpData.topResults.length}\n`;
    researchData += `Statistics Found: ${serpData.keyStatistics.length}\n`;
    researchData += `Related Questions: ${serpData.relatedQuestions.length}\n`;
    
    console.log(`✅ Research completed: ${researchData.length} characters of comprehensive data`);
    
    toast({
      title: "Research Complete",
      description: `Found ${serpData.topResults.length} authoritative sources and ${serpData.keyStatistics.length} key statistics`,
    });
    
    return researchData;
    
  } catch (error) {
    console.error('Research failed:', error);
    
    toast({
      title: "Research Error",
      description: "Using fallback research data. Content will still be generated.",
      variant: "destructive",
    });
    
    // Return basic research data as fallback
    return `RESEARCH DATA FOR: ${keywords}\n\nThis topic requires comprehensive analysis based on current medical research and expert insights. The content generated will include evidence-based information and practical recommendations.`;
    
  } finally {
    setIsResearching(false);
  }
};
