
export const generateKeyTakeaways = (keywords: string[], topicCategory: string = 'general'): string => {
  const primaryKeyword = keywords[0] || "this topic";
  
  // Create specific, value-added takeaways based on the primary keyword and topic category
  let takeaways = "";
  
  // Generate takeaways specific to the keyword and topic category with actual value points
  takeaways += generateSpecificTakeaways(primaryKeyword, topicCategory);
  
  return takeaways;
};

// Helper function to generate keyword-specific takeaways
function generateSpecificTakeaways(keyword: string, topicCategory: string): string {
  // Meal planning and nutrition takeaways
  if (topicCategory === 'meal-planning') {
    const mealPlanningTakeaways = [
      "**Plan meals around sales and seasons** - Seasonal produce can be 30-50% cheaper than out-of-season options while providing maximum nutrition",
      "**Protein flexibility saves money** - Replacing meat with beans, lentils, or eggs in 2-3 meals weekly can reduce grocery costs by up to 25%",
      "**Strategic bulk buying prevents waste** - Focus on shelf-stable items like rice, oats, and frozen vegetables that won't spoil before use",
      "**Meal prepping reduces impulse spending** - Families who prepare meals in advance spend 40% less on unplanned food purchases and takeout",
      "**Simple swaps maintain nutrition on a budget** - Frozen fruits and vegetables retain 90% of nutrients at 1/3 the cost of fresh options when out of season"
    ];
    return mealPlanningTakeaways.map(takeaway => `- ${takeaway}`).join('\n');
  }
  
  // Marketing takeaways
  if (topicCategory === 'marketing') {
    const keywordSpecificTakeaways = {
      "affiliate marketing": [
        "**Niche selection is crucial** - The most successful affiliate marketers focus on specific niches where they can build authority",
        "**Content quality directly impacts conversion rates** - In-depth, helpful content converts significantly better than thin, promotional material",
        "**Diversification of affiliate programs reduces risk** - Relying on a single program or merchant can lead to devastating income drops if terms change",
        "**SEO and email marketing provide the most sustainable traffic** - These channels deliver higher-converting visitors compared to social media",
        "**Trust is your most valuable asset** - Promoting products you haven't personally vetted can permanently damage your reputation"
      ],
      "content marketing": [
        "**Consistency outperforms frequency** - Regular publishing schedules show 72% better engagement than sporadic high-volume posting",
        "**Distribution strategy is as important as content creation** - The most successful content marketers spend 40% of their time on promotion",
        "**Content clusters drive more organic traffic** - Topic-focused content structured around pillar pages generates 3x more search visibility",
        "**Repurposing increases ROI significantly** - Converting one piece of content into multiple formats can triple your reach with minimal extra effort",
        "**User-generated content builds trust** - Content featuring customer stories and testimonials converts 30% better than brand-created content alone"
      ]
    };
    
    return (keywordSpecificTakeaways[keyword.toLowerCase()] || [
      `**Strategic approach yields better results** - Effective ${keyword} requires planning and consistent implementation rather than random efforts`,
      `**Audience understanding is foundational** - Research shows that ${keyword} campaigns targeted to specific audience needs perform 3x better`,
      `**Measurable goals drive success** - Setting clear KPIs for ${keyword} efforts leads to 65% higher performance rates`,
      `**Adaptation is necessary** - ${keyword} strategies must evolve with changing market conditions and consumer preferences`,
      `**Integration with other channels is essential** - ${keyword} performs best when coordinated with other marketing efforts in a cohesive strategy`
    ]).map(takeaway => `- ${takeaway}`).join('\n');
  }
  
  // Online income takeaways
  if (topicCategory === 'online-income') {
    const keywordSpecificTakeaways = {
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
    
    return (keywordSpecificTakeaways[keyword.toLowerCase()] || [
      `**Skill development directly correlates with earning potential** - Higher-value skills in ${keyword} can increase your earning capacity by 200-300%`,
      `**Time investment varies significantly by method** - Some ${keyword} approaches require months of upfront work, while others can generate income in days`,
      `**Risk and reward are typically proportional** - Higher-earning ${keyword} strategies generally involve greater initial investment or learning curve`,
      `**Diversification prevents income volatility** - Successful ${keyword} practitioners rarely rely on a single revenue source`,
      `**Market research prevents wasted effort** - Validating demand before fully committing to a ${keyword} strategy saves time and resources`
    ]).map(takeaway => `- ${takeaway}`).join('\n');
  }
  
  // Health and fitness takeaways
  if (topicCategory === 'health-fitness') {
    return [
      "**Consistency outperforms intensity** - Research shows that regular moderate exercise produces better long-term results than sporadic intense workouts",
      "**Nutrition accounts for 70-80% of results** - Physical transformation relies more on dietary habits than exercise routine",
      "**Rest is as important as activity** - Proper recovery periods prevent injuries and enable continuous progress",
      "**Personalization matters significantly** - Generic fitness plans produce 40% less effective results than tailored approaches",
      "**Mental aspects affect physical outcomes** - Stress management and sleep quality directly impact fitness results by affecting hormone balance"
    ].map(takeaway => `- ${takeaway}`).join('\n');
  }
  
  // Technology takeaways
  if (topicCategory === 'technology') {
    return [
      "**User experience determines adoption rates** - Technology with intuitive interfaces achieves 60% higher user retention",
      "**Integration capabilities affect overall value** - Solutions that connect with existing systems show 45% higher ROI",
      "**Security considerations cannot be afterthoughts** - Implementing security from the beginning costs 30% less than retrofitting later",
      "**Scalability prevents future limitations** - Technology designed for growth adapts to increasing demands without major overhauls",
      "**Support ecosystem influences long-term viability** - Strong documentation and community resources significantly improve implementation success"
    ].map(takeaway => `- ${takeaway}`).join('\n');
  }
  
  // Default takeaways for other topics
  const defaultTakeaways = [
    `**Research-based approach** - This guide provides evidence-based insights about ${keyword} from multiple authoritative sources`,
    `**Practical implementation framework** - You'll find step-by-step instructions you can apply immediately, not just theory`,
    `**Common pitfalls identified** - Learn about the mistakes others have made with ${keyword} so you can avoid them`,
    `**Expert perspectives included** - Insights from recognized authorities in ${keyword} inform the recommendations`,
    `**Updated for current conditions** - This guide reflects the latest developments and best practices in ${keyword}`
  ];
  
  // Format the takeaways as bullet points
  return defaultTakeaways.map(takeaway => `- ${takeaway}`).join('\n');
}
