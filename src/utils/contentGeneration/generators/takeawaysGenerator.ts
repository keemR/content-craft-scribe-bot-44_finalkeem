
export const generateKeyTakeaways = (keywords: string[]): string => {
  const primaryKeyword = keywords[0] || "this topic";
  
  // Create specific, value-added takeaways based on the primary keyword
  let takeaways = "";
  
  // Generate takeaways specific to the keyword with actual value points
  takeaways += generateSpecificTakeaways(primaryKeyword);
  
  return takeaways;
};

// Helper function to generate keyword-specific takeaways
function generateSpecificTakeaways(keyword: string): string {
  const keywordSpecificTakeaways = {
    "affiliate marketing": [
      "**Niche selection is crucial** - The most successful affiliate marketers focus on specific niches where they can build authority",
      "**Content quality directly impacts conversion rates** - In-depth, helpful content converts significantly better than thin, promotional material",
      "**Diversification of affiliate programs reduces risk** - Relying on a single program or merchant can lead to devastating income drops if terms change",
      "**SEO and email marketing provide the most sustainable traffic** - These channels deliver higher-converting visitors compared to social media",
      "**Trust is your most valuable asset** - Promoting products you haven't personally vetted can permanently damage your reputation"
    ],
    "dropshipping": [
      "**Product research is the primary success factor** - Finding products with healthy margins and manageable competition is more important than store design",
      "**Customer service quality determines sustainability** - Since you don't control fulfillment, exceptional customer communication becomes essential",
      "**Most successful stores focus on a specific niche** - Targeting a defined audience allows more effective marketing than general stores",
      "**Paid advertising skills are nearly essential** - Most profitable dropshipping operations master Facebook or Google ads",
      "**Suppliers and fulfillment partners can make or break your business** - Thorough vetting and relationship building with suppliers is crucial"
    ],
    "freelancing": [
      "**Specialization commands higher rates** - Freelancers with specialized skills earn 2-3x more than generalists",
      "**Client acquisition systems determine income stability** - Developing consistent lead generation prevents the feast-or-famine cycle",
      "**Value-based pricing significantly outperforms hourly rates** - Charging based on client outcomes rather than time can double or triple earnings",
      "**The ability to qualify clients prevents most common problems** - Learning to identify and avoid problematic clients is a critical skill",
      "**Long-term client relationships produce better ROI than constantly finding new ones** - Repeat business is both more profitable and less stressful"
    ],
    "ways to make money online": [
      "**Successful online income requires treating it as a real business** - Approaching with a hobby mindset rarely produces significant results",
      "**Skills-based methods typically generate income faster than audience-based approaches** - Freelancing often provides quicker returns than content creation",
      "**Multiple complementary income streams create stability** - Combining methods that use the same skills or serve the same audience maximizes efficiency",
      "**Passive income requires significant upfront investment** - Whether time, money, or both, truly passive income streams demand substantial initial resources",
      "**Consistency outperforms sporadic brilliance** - Regular, systematic effort historically beats irregular bursts of activity in online business"
    ],
  };
  
  // Default takeaways for keywords not in our database
  const defaultTakeaways = [
    `**Research-based approach** - This guide provides evidence-based insights about ${keyword} from multiple authoritative sources`,
    `**Practical implementation framework** - You'll find step-by-step instructions you can apply immediately, not just theory`,
    `**Common pitfalls identified** - Learn about the mistakes others have made with ${keyword} so you can avoid them`,
    `**Expert perspectives included** - Insights from recognized authorities in ${keyword} inform the recommendations`,
    `**Updated for current conditions** - This guide reflects the latest developments and best practices in ${keyword}`
  ];
  
  // Get the appropriate takeaways or use defaults
  const takeawaysList = keywordSpecificTakeaways[keyword.toLowerCase()] || defaultTakeaways;
  
  // Format the takeaways as bullet points
  return takeawaysList.map(takeaway => `- ${takeaway}`).join('\n');
}
