
export const generateKeyTakeaways = (keywords: string[]): string => {
  const primaryKeyword = keywords[0] || "this topic";
  
  // Create more natural-sounding takeaways with varying structures
  let takeaways = "";
  
  // Mix bullet points, bold elements, and occasional questions
  takeaways += "- This guide provides **practical knowledge** about " + primaryKeyword + " based on extensive research\n";
  takeaways += "- You'll discover actionable techniques that can be implemented right away\n";
  takeaways += "- We've gathered insights from professionals who work with " + primaryKeyword + " daily\n";
  takeaways += "- Learn what mistakes to avoid when dealing with " + primaryKeyword + "\n";
  takeaways += "- Find links to trustworthy resources for deeper learning\n";
  
  return takeaways;
};
