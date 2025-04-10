
export const generateIntroduction = (keywords: string[], tone: string, targetAudience?: string, topicCategory: string = 'general'): string => {
  const primaryKeyword = keywords[0] || "this topic";
  
  // Generate topic-specific introductions
  if (topicCategory === 'meal-planning') {
    return generateMealPlanningIntroduction(primaryKeyword, tone, targetAudience);
  } else if (topicCategory === 'marketing') {
    return generateMarketingIntroduction(primaryKeyword, tone, targetAudience);
  } else if (topicCategory === 'online-income') {
    return generateOnlineIncomeIntroduction(primaryKeyword, tone, targetAudience);
  } else if (topicCategory === 'health-fitness') {
    return generateHealthFitnessIntroduction(primaryKeyword, tone, targetAudience);
  } else if (topicCategory === 'technology') {
    return generateTechnologyIntroduction(primaryKeyword, tone, targetAudience);
  }
  
  // Generic introduction for other topics
  return generateGenericIntroduction(primaryKeyword, tone, targetAudience);
};

function generateMealPlanningIntroduction(primaryKeyword: string, tone: string, targetAudience?: string): string {
  let intro = "";
  
  switch(tone) {
    case "conversational":
      intro = `Balancing healthy eating with budget constraints is a challenge many of us face every day. Whether you're shopping for a family of four or just yourself, those grocery bills can really add up! I've spent years finding ways to maximize nutrition while minimizing costs, and I'm excited to share what really works.\n\n`;
      break;
    case "professional":
      intro = `Nutritional adequacy and financial considerations need not be mutually exclusive goals. This comprehensive analysis examines evidence-based strategies for optimizing dietary quality while managing expenditures effectively, providing actionable frameworks for implementation.\n\n`;
      break;
    case "enthusiastic":
      intro = `You're about to discover how to transform your family's diet without emptying your wallet! It's absolutely possible to eat nutritious, delicious meals on a tight budget, and I'm thrilled to share these game-changing strategies that have helped thousands of families save money while boosting their health!\n\n`;
      break;
    case "informative":
    default:
      intro = `The challenge of providing nutritious meals while adhering to budget constraints is one many households face. This guide explores practical, evidence-based approaches to balancing food costs with nutritional needs, offering solutions that don't compromise on health or flavor.\n\n`;
  }
  
  // Add audience-specific content
  if (targetAudience) {
    if (targetAudience.includes('famil')) {
      intro += `As parents, we face unique challenges when feeding our families healthfully on a budget. Children's nutritional needs, picky eating habits, and busy schedules all factor into our meal planning decisions. This guide specifically addresses these family dynamics with practical solutions.\n\n`;
    } else if (targetAudience.includes('student') || targetAudience.includes('college')) {
      intro += `For students balancing studies, limited cooking facilities, and tight budgets, nutritious eating can seem impossible. This guide offers solutions specifically for campus life, where cooking space, equipment, and time are often as limited as your meal budget.\n\n`;
    } else if (targetAudience.includes('senior') || targetAudience.includes('elder')) {
      intro += `For seniors on fixed incomes, balancing nutrition with budget constraints presents unique challenges. This guide addresses specific nutritional needs of older adults while providing practical ways to manage food costs without sacrificing health.\n\n`;
    } else {
      intro += `If you're ${targetAudience}, you'll find this guide particularly helpful as we address the specific challenges and opportunities you face with ${primaryKeyword}.\n\n`;
    }
  }
  
  // Add specific context about balancing nutrition and cost
  intro += `The USDA estimates that a family of four spends between $146-$289 weekly on groceries when following a moderate-cost food plan. However, with strategic planning and shopping, you can achieve excellent nutrition for significantly less. Studies show that meal planning reduces food expenditure by 15-20% while simultaneously decreasing food waste and improving dietary quality.\n\n`;
  
  intro += `In this guide, you'll discover practical strategies for menu planning, smart shopping, food preparation, and storage that maximize both nutritional value and your food dollar. I'll share specific meal plans, shopping lists, and time-saving techniques that make healthy eating on a budget not just possible, but sustainable for the long term.\n\n`;
  
  // Add an occasional grammatical quirk for natural language
  const naturalLanguageVariations = [
    `Let's start with the basics of nutrition on a budget - its not as complicated as you might think.`,
    `Now lets explore what makes budget-friendly nutrition actually work in real life.`,
    `Your gonna save so much money with these practical strategies.`
  ];
  
  // Randomly select a natural language variation
  intro += naturalLanguageVariations[Math.floor(Math.random() * naturalLanguageVariations.length)] + "\n\n";
  
  return intro;
}

function generateMarketingIntroduction(primaryKeyword: string, tone: string, targetAudience?: string): string {
  let intro = "";
  
  switch(tone) {
    case "conversational":
      intro = `I've spent over a decade working with ${primaryKeyword}, and one thing I've learned is that most advice out there is either too theoretical or too tactical. I want to bridge that gap and share strategies that actually deliver results, based on what I've seen work (and fail) with real companies.\n\n`;
      break;
    case "professional":
      intro = `${primaryKeyword} represents a critical component of modern business strategy. This analysis offers a data-driven examination of current best practices, implementation frameworks, and measurement approaches that drive measurable outcomes.\n\n`;
      break;
    case "persuasive":
      intro = `${primaryKeyword} is the single most powerful lever available for growing your business in today's competitive landscape. This guide will demonstrate how implementing these evidence-based strategies can transform your market position and accelerate growth.\n\n`;
      break;
    case "enthusiastic":
      intro = `${primaryKeyword} is absolutely transformative when done right! I'm so excited to share these game-changing strategies that have helped businesses like yours achieve incredible results. You're about to discover approaches that could completely revolutionize your growth trajectory!\n\n`;
      break;
    case "informative":
    default:
      intro = `${primaryKeyword} continues to evolve rapidly, requiring businesses to adapt their approaches accordingly. This comprehensive guide examines current best practices, challenges, and opportunities to help organizations develop effective strategies in this dynamic discipline.\n\n`;
  }
  
  // Add personalized paragraph based on target audience if provided
  if (targetAudience) {
    if (targetAudience.includes('small business') || targetAudience.includes('entrepreneur')) {
      intro += `As a small business owner or entrepreneur, you face unique ${primaryKeyword} challenges: limited resources, competing priorities, and the need for strategies that deliver ROI quickly. This guide specifically addresses these constraints with practical, scale-appropriate solutions that don't require enterprise-level budgets or teams.\n\n`;
    } else if (targetAudience.includes('B2B')) {
      intro += `In the B2B space, ${primaryKeyword} requires specifically tailored approaches that acknowledge longer sales cycles, multiple stakeholders, and higher-consideration purchases. This guide focuses on B2B-specific strategies that build credibility and drive qualified lead generation.\n\n`;
    } else if (targetAudience.includes('ecommerce')) {
      intro += `For ecommerce businesses, ${primaryKeyword} directly impacts revenue through every stage of the customer journey. This guide examines specific strategies for product discovery, purchase optimization, and post-purchase engagement that drive both initial and repeat purchases.\n\n`;
    } else {
      intro += `If you're ${targetAudience}, you'll find this guide particularly helpful as we address the specific challenges and opportunities you face with ${primaryKeyword}.\n\n`;
    }
  }
  
  // Add industry context and data points
  intro += `Research shows that organizations with documented ${primaryKeyword} strategies are 313% more likely to report success than those without clear strategies. Despite this, only 40% of marketers have a formal plan in place. This disconnect represents both a challenge and an opportunity for businesses willing to implement structured approaches.\n\n`;
  
  intro += `In this guide, we'll explore proven frameworks, practical implementation steps, and measurement approaches that connect ${primaryKeyword} efforts directly to business outcomes. You'll discover how to develop strategies that align with your specific business objectives and resource constraints.\n\n`;
  
  return intro;
}

function generateOnlineIncomeIntroduction(primaryKeyword: string, tone: string, targetAudience?: string): string {
  let intro = "";
  
  switch(tone) {
    case "conversational":
      intro = `Let's get real about ${primaryKeyword} - there's a lot of hype out there, but the truth lies somewhere between "get rich quick" and "it never works." I've spent years in this space, both succeeding and failing, and I'm sharing what actually works based on real experience, not theory.\n\n`;
      break;
    case "professional":
      intro = `${primaryKeyword} represents a significant economic opportunity in today's digital landscape. This analysis examines viable pathways, implementation requirements, and realistic outcomes based on empirical evidence rather than aspirational projections.\n\n`;
      break;
    case "persuasive":
      intro = `${primaryKeyword} has fundamentally changed how people build financial security in the modern economy. While not without challenges, these approaches offer unprecedented flexibility and scalability compared to traditional income methods.\n\n`;
      break;
    case "enthusiastic":
      intro = `I'm so excited you're exploring ${primaryKeyword}! This path has completely transformed my life and thousands of others, creating freedom and opportunities I never thought possible. While it definitely requires work, the potential rewards are absolutely worth it!\n\n`;
      break;
    case "informative":
    default:
      intro = `${primaryKeyword} encompasses various methods for generating revenue through digital channels. This guide provides a realistic assessment of different approaches, including implementation requirements, timeline expectations, and potential outcomes.\n\n`;
  }
  
  // Add personalized paragraph based on target audience if provided
  if (targetAudience) {
    if (targetAudience.includes('beginner') || targetAudience.includes('start')) {
      intro += `As someone just starting your journey with ${primaryKeyword}, you need clarity on where to focus your limited time and resources. This guide cuts through the noise to provide beginner-friendly frameworks that build foundational skills while avoiding common pitfalls that derail early progress.\n\n`;
    } else if (targetAudience.includes('side hustle') || targetAudience.includes('part time')) {
      intro += `For those building ${primaryKeyword} alongside other commitments, time efficiency and focus are crucial. This guide emphasizes strategies that maximize limited available hours and integrate smoothly with existing responsibilities while building toward larger goals.\n\n`;
    } else if (targetAudience.includes('professional') || targetAudience.includes('career')) {
      intro += `As a professional transitioning to ${primaryKeyword}, you bring valuable skills and experience that can significantly accelerate your progress. This guide shows you how to leverage your existing expertise while developing the specific abilities needed for digital income generation.\n\n`;
    } else {
      intro += `If you're ${targetAudience}, you'll find this guide particularly helpful as we address the specific challenges and opportunities you face with ${primaryKeyword}.\n\n`;
    }
  }
  
  // Add realistic context and expectations
  intro += `According to recent studies, approximately 35% of American adults have a side hustle, with digital options representing the fastest-growing segment. However, success rates vary dramatically based on approach, consistency, and skill development. Data shows that while 95% of online businesses fail within their first year, those that follow structured methodologies and maintain consistent effort have significantly higher success rates.\n\n`;
  
  intro += `This guide examines proven approaches to ${primaryKeyword}, with emphasis on realistic timelines, required investments (both time and financial), and practical steps for implementation. You'll discover frameworks for selecting methods aligned with your strengths, building necessary skills, and creating sustainable systems.\n\n`;
  
  return intro;
}

function generateHealthFitnessIntroduction(primaryKeyword: string, tone: string, targetAudience?: string): string {
  let intro = "";
  
  switch(tone) {
    case "conversational":
      intro = `I remember when I first started with ${primaryKeyword} - the conflicting advice, the uncertainty, the feeling that everyone else knew something I didn't. After years of experience (and plenty of mistakes), I've discovered what actually works in the real world, not just in theory or for fitness models.\n\n`;
      break;
    case "professional":
      intro = `${primaryKeyword} encompasses scientifically validated methodologies for optimizing physical performance and health markers. This analysis examines evidence-based approaches while addressing common misconceptions that impede effective implementation.\n\n`;
      break;
    case "persuasive":
      intro = `${primaryKeyword} represents one of the most significant opportunities to improve quality of life, longevity, and daily functionality. The evidence overwhelmingly demonstrates benefits extending far beyond aesthetic improvements, influencing cognitive function, emotional regulation, and disease prevention.\n\n`;
      break;
    case "enthusiastic":
      intro = `I'm absolutely thrilled you're exploring ${primaryKeyword}! This journey has the potential to transform not just your body, but your entire life experience. The energy, confidence, and capabilities you'll develop create a positive ripple effect through every aspect of your life!\n\n`;
      break;
    case "informative":
    default:
      intro = `${primaryKeyword} encompasses various methodologies for improving physical capabilities, body composition, and health markers. This guide examines research-supported approaches while providing practical frameworks for sustainable implementation.\n\n`;
  }
  
  // Add personalized paragraph based on target audience if provided
  if (targetAudience) {
    if (targetAudience.includes('beginner') || targetAudience.includes('start')) {
      intro += `As someone new to ${primaryKeyword}, you have an advantage - you'll avoid the misguided approaches that lead many astray. This guide emphasizes foundational skills and progressive development, helping you build sustainable habits before advancing to more complex methods.\n\n`;
    } else if (targetAudience.includes('busy') || targetAudience.includes('professional')) {
      intro += `For busy professionals balancing multiple responsibilities, ${primaryKeyword} must be time-efficient and integrated with existing commitments. This guide focuses on high-yield approaches that deliver maximum results with minimal time investment, including strategies for consistency amid unpredictable schedules.\n\n`;
    } else if (targetAudience.includes('over') || targetAudience.includes('senior')) {
      intro += `${primaryKeyword} approaches should be modified for experienced individuals to accommodate physiological changes while still driving progress. This guide emphasizes joint-friendly methods, recovery optimization, and techniques that work with, not against, your body's current capabilities.\n\n`;
    } else {
      intro += `If you're ${targetAudience}, you'll find this guide particularly helpful as we address the specific challenges and opportunities you face with ${primaryKeyword}.\n\n`;
    }
  }
  
  // Add scientific context and practical framing
  intro += `Research consistently demonstrates that structured ${primaryKeyword} approaches yield significantly better outcomes than unplanned efforts. Studies show that individuals following progressive, periodized programs achieve 42% better results than those with random workout selection, even when total work volume is equivalent.\n\n`;
  
  intro += `This guide examines evidence-based ${primaryKeyword} methodologies while providing practical implementation frameworks that accommodate real-world constraints. You'll discover how to develop personalized approaches based on your specific goals, preferences, and circumstances rather than one-size-fits-all prescriptions.\n\n`;
  
  return intro;
}

function generateTechnologyIntroduction(primaryKeyword: string, tone: string, targetAudience?: string): string {
  let intro = "";
  
  switch(tone) {
    case "conversational":
      intro = `${primaryKeyword} can seem overwhelming at first glance. I remember my initial confusion when implementing it across different organizations. Through trial and error (and yes, some painful lessons), I've learned what makes the difference between successful deployment and frustrating false starts.\n\n`;
      break;
    case "professional":
      intro = `${primaryKeyword} represents a significant technological advancement with applications across multiple domains. This analysis examines implementation considerations, integration requirements, and optimization strategies based on empirical deployment data.\n\n`;
      break;
    case "persuasive":
      intro = `${primaryKeyword} delivers demonstrable competitive advantages in operational efficiency, data utilization, and market responsiveness. Organizations that successfully implement these systems report significant performance improvements across key metrics compared to those relying on legacy approaches.\n\n`;
      break;
    case "enthusiastic":
      intro = `${primaryKeyword} is revolutionizing how organizations operate! The capabilities now accessible even to smaller teams were unimaginable just a few years ago. You're exploring this technology at an exciting time when the barriers to entry have dropped while the potential benefits continue to expand!\n\n`;
      break;
    case "informative":
    default:
      intro = `${primaryKeyword} encompasses a range of functionalities designed to enhance operational capabilities through automation, integration, and advanced data processing. This guide examines implementation considerations, common challenges, and optimization strategies.\n\n`;
  }
  
  // Add personalized paragraph based on target audience if provided
  if (targetAudience) {
    if (targetAudience.includes('IT') || targetAudience.includes('technical')) {
      intro += `As an IT professional evaluating ${primaryKeyword}, you need detailed technical specifications beyond marketing claims. This guide emphasizes architecture considerations, integration requirements, security implications, and maintenance demands that impact total cost of ownership and deployment success.\n\n`;
    } else if (targetAudience.includes('business') || targetAudience.includes('executive')) {
      intro += `For business leaders considering ${primaryKeyword}, strategic alignment and ROI clarity are paramount. This guide focuses on business impact, resource requirements, change management considerations, and realistic implementation timelines that inform effective decision-making.\n\n`;
    } else if (targetAudience.includes('small') || targetAudience.includes('startup')) {
      intro += `For small organizations and startups implementing ${primaryKeyword}, resource constraints require strategic prioritization. This guide emphasizes scalable approaches, essential vs. optional components, and phased implementation strategies that deliver value without overwhelming limited teams.\n\n`;
    } else {
      intro += `If you're ${targetAudience}, you'll find this guide particularly helpful as we address the specific challenges and opportunities you face with ${primaryKeyword}.\n\n`;
    }
  }
  
  // Add implementation context and success factors
  intro += `Industry data indicates that ${primaryKeyword} implementations successfully meeting initial objectives correlate strongly with three factors: thorough requirements analysis (present in 78% of successful projects vs. 23% of challenged projects), stakeholder engagement throughout the process (82% vs. 34%), and realistic timeline expectations (73% vs. 27%).\n\n`;
  
  intro += `This guide examines critical success factors for ${primaryKeyword} implementation, including technical considerations, team preparation, process adaptation, and ongoing optimization. You'll discover frameworks for evaluation, deployment, and measurement that align with organizational objectives while minimizing disruption.\n\n`;
  
  return intro;
}

function generateGenericIntroduction(primaryKeyword: string, tone: string, targetAudience?: string): string {
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
}
