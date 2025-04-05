
export const generateIntroduction = (keywords: string[], tone: string, targetAudience?: string): string => {
  const primaryKeyword = keywords[0] || "this topic";
  let intro = "";
  
  // Vary introduction based on tone and target audience for personalization
  switch(tone) {
    case "conversational":
      intro = `Have you ever wondered about ${primaryKeyword}? Trust me, you're not alone. Many people ask me about this all the time. I've spent years working with ${primaryKeyword}, and I'm sharing what I've learned the hard way.\n\n`;
      break;
    case "professional":
      intro = `${primaryKeyword} represents a critical area for professionals across industries. This analysis examines the key components related to ${primaryKeyword}, based on both data and real-world application.\n\n`;
      break;
    case "persuasive":
      intro = `${primaryKeyword} can transform how you approach your goals. This guide will show you exactly why and how to harness its potential, with evidence-based strategies that work.\n\n`;
      break;
    case "enthusiastic":
      intro = `${primaryKeyword} is one of the most exciting developments in recent years! I'm so glad you're interested in learning more about it. Let me share some amazing insights I've gathered.\n\n`;
      break;
    case "informative":
    default:
      intro = `Understanding ${primaryKeyword} matters in today's environment. This guide explores the topic completely, from basic concepts to advanced applications, helping you navigate this important area.\n\n`;
  }
  
  // Add a personalized paragraph based on target audience if provided
  if (targetAudience) {
    intro += `If you're ${targetAudience}, you'll find this guide particularly helpful as we address the specific challenges and opportunities you face with ${primaryKeyword}.\n\n`;
  }
  
  // Add a natural transition to the main content
  intro += `We'll cover various aspects of ${primaryKeyword}, including best practices, common challenges, and practical solutions. By the end, you'll have a clear understanding of how to approach ${primaryKeyword} effectively.\n\n`;
  
  // Add an occasional grammatical quirk for natural language
  const naturalLanguageVariations = [
    `Let's get started with the basics - its important to build a solid foundation.`,
    `Now lets explore what makes ${primaryKeyword} so valuable.`,
    `Your gonna learn a lot in the next few sections.`
  ];
  
  // Randomly select a natural language variation
  intro += naturalLanguageVariations[Math.floor(Math.random() * naturalLanguageVariations.length)] + "\n\n";
  
  return intro;
};
