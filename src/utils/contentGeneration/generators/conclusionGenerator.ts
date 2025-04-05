
export const generateConclusion = (keywords: string[], tone: string, targetAudience?: string): string => {
  const primaryKeyword = keywords[0] || 'this topic';
  
  // Create a personalized conclusion based on tone and audience
  let conclusion = `${primaryKeyword} continues to evolve, and staying informed about best practices is essential for long-term success. By implementing the strategies outlined in this guide, you'll be well-positioned to achieve your goals and overcome common obstacles.\n\n`;
  
  // Add tonal variations
  switch(tone) {
    case "conversational":
      conclusion += `I've been working with ${primaryKeyword} for years, and I still learn something new every day. Don't get discouraged if things don't go perfectly at first - thats normal! Keep at it, and you'll see progress.\n\n`;
      break;
    case "professional":
      conclusion += `Ongoing education and adaptation remain critical factors in maintaining efficacy with ${primaryKeyword} implementations. Regular evaluation of outcomes against objectives will facilitate continuous improvement.\n\n`;
      break;
    case "enthusiastic":
      conclusion += `I'm so excited for you to start implementing these ideas! You're gonna love seeing the results as they start coming in. Remember to enjoy the process!\n\n`;
      break;
    default:
      conclusion += `Remember that mastery comes with practice and persistence. Initial challenges are part of the learning process. With dedication and the right approach, you can become proficient in ${primaryKeyword}.\n\n`;
  }
  
  // Add audience-specific closing if applicable
  if (targetAudience) {
    conclusion += `As ${targetAudience}, you're uniquely positioned to benefit from these approaches to ${primaryKeyword}. Your perspective and experience bring valuable context to the implementation.\n\n`;
  }
  
  // Add a natural closing with minor colloquialisms
  conclusion += `I hope this guide has given you practical knowledge you can use right away. If you have questions or want to share your experiences with ${primaryKeyword}, leave a comment below or reach out directly. Good luck with your ${primaryKeyword} journey!\n\n`;
  
  return conclusion;
};
