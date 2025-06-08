
import { EnhancedVisualContent } from './enhancedVisualGenerator';

export function generateOnlineIncomeVisuals(
  heading: string,
  keyword: string,
  sectionIndex: number
): EnhancedVisualContent[] {
  const visuals: EnhancedVisualContent[] = [];
  const headingLower = heading.toLowerCase();
  
  // Online income specific images
  const onlineIncomeImages = [
    {
      url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80',
      title: 'Professional workspace setup for online income',
      description: 'Modern laptop workspace for digital entrepreneurship',
      relevance: 95
    },
    {
      url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80',
      title: 'Person working on MacBook Pro for online business',
      description: 'Entrepreneur managing online business operations',
      relevance: 92
    },
    {
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80',
      title: 'Remote work setup for online income generation',
      description: 'Professional using laptop for remote online work',
      relevance: 90
    },
    {
      url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
      title: 'Team collaboration for online business success',
      description: 'Multiple people working together on digital projects',
      relevance: 88
    },
    {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      title: 'Clean workspace for online productivity',
      description: 'Minimalist setup for focused online work',
      relevance: 85
    },
    {
      url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
      title: 'Coding and development for online income',
      description: 'Programming and web development for online business',
      relevance: 83
    }
  ];
  
  // Select relevant image based on heading content
  let selectedImage = onlineIncomeImages[sectionIndex % onlineIncomeImages.length];
  
  if (headingLower.includes('freelancing') || headingLower.includes('skills')) {
    selectedImage = onlineIncomeImages[1]; // MacBook Pro working image
  } else if (headingLower.includes('business') || headingLower.includes('ecommerce')) {
    selectedImage = onlineIncomeImages[3]; // Team collaboration
  } else if (headingLower.includes('coding') || headingLower.includes('development')) {
    selectedImage = onlineIncomeImages[5]; // Coding setup
  } else if (headingLower.includes('content') || headingLower.includes('writing')) {
    selectedImage = onlineIncomeImages[4]; // Clean workspace
  }
  
  visuals.push({
    type: 'hero-image',
    title: selectedImage.title,
    description: selectedImage.description,
    altText: `${heading} - ${selectedImage.description}`,
    caption: `💰 ${heading}: Strategic approach to building sustainable online income`,
    placement: 'inline',
    imageUrl: selectedImage.url,
    relevanceScore: selectedImage.relevance
  });
  
  // Add infographics for data-heavy sections
  if (headingLower.includes('income') || headingLower.includes('earning') || headingLower.includes('money')) {
    visuals.push({
      type: 'infographic',
      title: `${heading} - Income Potential Analysis`,
      description: `Data visualization showing income potential and growth timelines for ${heading.toLowerCase()}`,
      altText: `Infographic displaying income statistics and growth data for ${heading.toLowerCase()}`,
      caption: `📊 Income Analytics: ${heading} earning potential with realistic timelines`,
      placement: 'featured',
      chartData: {
        statistics: [
          { label: 'Average Starting Income', value: '$500-2,000', context: 'First 3 months' },
          { label: 'Experienced Income Range', value: '$5,000-50,000', context: 'After 12-24 months' },
          { label: 'Success Rate', value: '25-40%', context: 'With consistent effort' },
          { label: 'Time to First Income', value: '30-90 days', context: 'For most methods' },
          { label: 'Growth Potential', value: 'Unlimited', context: 'Scalable systems' }
        ],
        type: 'online-income-stats'
      },
      chartType: 'income-potential-infographic',
      relevanceScore: 90
    });
  }
  
  return visuals;
}
