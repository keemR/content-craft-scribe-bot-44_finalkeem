
export const generateFAQs = (keywords: string[], targetAudience?: string): string => {
  const primaryKeyword = keywords[0] || 'this topic';
  
  // Create schema-ready FAQ section
  return `### What is the best way to get started with ${primaryKeyword}?\n
First, define your goals clearly. Then, research the basics and create a simple plan that addresses your specific needs. Many beginners make the mistake of jumping straight to advanced techniques without mastering fundamentals. I'd recommend spending a week learning before implementation.\n\n
### How much time should I invest in ${primaryKeyword}?\n
It depends on your goals and resources. For basic implementation, 5-10 hours weekly is usually sufficient. Complex projects might need full-time attention for several months. Start small and scale up as you gain experience and see results.\n\n
### What tools are essential for ${primaryKeyword}?\n
The most important tools include project management software, analytics platforms, and specialized tools designed for ${primaryKeyword}. I personally recommend starting with free options like [tool example] to learn the basics before investing in premium solutions like [another tool example].\n\n
### How do I measure success with ${primaryKeyword}?\n
Success metrics should align with your initial goals. Common indicators include ROI, efficiency improvements, user satisfaction, and milestone achievements. I suggest establishing baseline measurements before you begin and tracking progress weekly. Most people see meaningful results within 2-3 months.\n\n
### Can ${primaryKeyword} work for ${targetAudience || 'small businesses'}?\n
Absolutely! ${primaryKeyword} can be scaled to work for organizations of any size. The key is adapting the approach to your specific needs and resources. I've seen ${targetAudience || 'small businesses'} achieve impressive results by focusing on the most impactful elements rather than trying to do everything at once.\n\n`;
};
