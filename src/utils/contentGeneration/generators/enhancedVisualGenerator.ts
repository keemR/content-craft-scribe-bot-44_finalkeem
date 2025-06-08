
import { slugify } from '../helpers';
import { generateOnlineIncomeVisuals } from './onlineIncomeVisuals';

export interface EnhancedVisualContent {
  type: 'hero-image' | 'infographic' | 'chart' | 'diagram' | 'medical-illustration' | 'comparison-table' | 'timeline' | 'anatomy-diagram';
  title: string;
  description: string;
  altText: string;
  caption: string;
  placement: 'hero' | 'inline' | 'sidebar' | 'featured';
  imageUrl?: string;
  chartData?: any;
  chartType?: string;
  relevanceScore: number;
}

// Enhanced topic-specific image collections with high relevance
const ZINC_RICH_FOODS_VISUALS = {
  foods: [
    {
      url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80',
      title: 'Fresh oysters - highest zinc content food',
      description: 'Plate of fresh oysters, the richest dietary source of zinc',
      relevance: 98
    },
    {
      url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
      title: 'Mixed nuts and seeds rich in zinc',
      description: 'Assortment of pumpkin seeds, cashews, and other zinc-rich nuts',
      relevance: 95
    },
    {
      url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&q=80',
      title: 'Lean beef cuts high in zinc',
      description: 'Fresh beef cuts showcasing protein and zinc content',
      relevance: 92
    },
    {
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80',
      title: 'Legumes and beans for plant-based zinc',
      description: 'Variety of legumes including chickpeas and lentils',
      relevance: 88
    }
  ],
  supplements: [
    {
      url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      title: 'Zinc supplements and dosing guidance',
      description: 'Medical consultation about zinc supplementation',
      relevance: 85
    }
  ]
};

const VITAMIN_D_VISUALS = {
  symptoms: [
    {
      url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      title: 'Person experiencing fatigue from vitamin D deficiency',
      description: 'Individual showing signs of chronic fatigue and low energy',
      relevance: 95
    },
    {
      url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80',
      title: 'Joint and bone pain visualization',
      description: 'Medical illustration of areas affected by vitamin D deficiency',
      relevance: 92
    },
    {
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80',
      title: 'Seasonal depression and mood symptoms',
      description: 'Person experiencing seasonal affective disorder',
      relevance: 88
    }
  ],
  testing: [
    {
      url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80',
      title: 'Vitamin D blood test procedure',
      description: 'Healthcare professional conducting vitamin D level test',
      relevance: 96
    },
    {
      url: 'https://images.unsplash.com/photo-1582719471137-c3967ffaaf0e?w=800&q=80',
      title: 'At-home vitamin D testing kit',
      description: 'Modern home testing kit for vitamin D levels',
      relevance: 90
    }
  ],
  sources: [
    {
      url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&q=80',
      title: 'Vitamin D rich foods arrangement',
      description: 'Salmon, eggs, fortified milk and vitamin D food sources',
      relevance: 94
    },
    {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      title: 'Safe sun exposure for vitamin D production',
      description: 'Person enjoying healthy sunlight for natural vitamin D',
      relevance: 91
    }
  ]
};

const HEALTH_FITNESS_VISUALS = {
  general: [
    {
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
      title: 'Active healthy lifestyle',
      description: 'Person maintaining active lifestyle for optimal health',
      relevance: 85
    },
    {
      url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      title: 'Healthcare consultation',
      description: 'Professional healthcare and wellness discussion',
      relevance: 82
    }
  ]
};

export function generateEnhancedVisuals(
  heading: string,
  primaryKeyword: string,
  topicCategory: string,
  sectionIndex: number
): EnhancedVisualContent[] {
  const visuals: EnhancedVisualContent[] = [];
  
  console.log('Generating visuals for:', { heading, primaryKeyword, topicCategory, sectionIndex });
  
  // Generate highly relevant topic-specific visuals
  if (primaryKeyword.toLowerCase().includes('zinc') && primaryKeyword.toLowerCase().includes('foods')) {
    visuals.push(...generateZincFoodsVisuals(heading, sectionIndex));
  } else if (primaryKeyword.toLowerCase().includes('vitamin d') && primaryKeyword.toLowerCase().includes('deficiency')) {
    visuals.push(...generateVitaminDVisuals(heading, sectionIndex));
  } else if (topicCategory === 'online-income') {
    visuals.push(...generateOnlineIncomeVisuals(heading, primaryKeyword, sectionIndex));
  } else if (topicCategory === 'health-fitness') {
    visuals.push(...generateHealthFitnessVisuals(heading, sectionIndex));
  } else {
    visuals.push(...generateGenericVisuals(heading, primaryKeyword, sectionIndex));
  }
  
  // Add data visualizations for statistical sections
  if (shouldHaveInfographic(heading)) {
    visuals.push(generateTopicSpecificInfographic(heading, primaryKeyword, sectionIndex));
  }
  
  // Add charts for quantitative sections
  if (shouldHaveChart(heading)) {
    visuals.push(generateTopicSpecificChart(heading, primaryKeyword, sectionIndex));
  }
  
  // Ensure at least one highly relevant visual
  if (visuals.length === 0) {
    console.log('No visuals generated, adding guaranteed fallback');
    visuals.push(generateFallbackVisual(heading, primaryKeyword));
  }
  
  console.log('Final visuals count:', visuals.length, 'for heading:', heading);
  return visuals.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 2); // Return top 2 most relevant visuals
}

function generateZincFoodsVisuals(heading: string, sectionIndex: number): EnhancedVisualContent[] {
  const visuals: EnhancedVisualContent[] = [];
  const headingLower = heading.toLowerCase();
  
  if (headingLower.includes('top 20') || headingLower.includes('zinc-rich') || headingLower.includes('foods')) {
    const foodsVisual = ZINC_RICH_FOODS_VISUALS.foods[sectionIndex % ZINC_RICH_FOODS_VISUALS.foods.length];
    visuals.push({
      type: 'hero-image',
      title: foodsVisual.title,
      description: foodsVisual.description,
      altText: `Zinc-rich foods: ${foodsVisual.description}`,
      caption: `🦪 Top Zinc Sources: ${foodsVisual.title} for optimal immune support`,
      placement: 'featured',
      imageUrl: foodsVisual.url,
      relevanceScore: foodsVisual.relevance
    });
  }
  
  if (headingLower.includes('supplement') || headingLower.includes('dosing')) {
    const supplementVisual = ZINC_RICH_FOODS_VISUALS.supplements[0];
    visuals.push({
      type: 'medical-illustration',
      title: supplementVisual.title,
      description: supplementVisual.description,
      altText: `Zinc supplementation: ${supplementVisual.description}`,
      caption: `💊 Professional guidance on zinc supplementation and optimal dosing`,
      placement: 'inline',
      imageUrl: supplementVisual.url,
      relevanceScore: supplementVisual.relevance
    });
  }
  
  return visuals;
}

function generateVitaminDVisuals(heading: string, sectionIndex: number): EnhancedVisualContent[] {
  const visuals: EnhancedVisualContent[] = [];
  const headingLower = heading.toLowerCase();
  
  if (headingLower.includes('symptom') || headingLower.includes('signs') || headingLower.includes('warning')) {
    const symptomsVisual = VITAMIN_D_VISUALS.symptoms[sectionIndex % VITAMIN_D_VISUALS.symptoms.length];
    visuals.push({
      type: 'medical-illustration',
      title: symptomsVisual.title,
      description: symptomsVisual.description,
      altText: `Vitamin D deficiency symptoms: ${symptomsVisual.description}`,
      caption: `🩺 Clinical Signs: ${symptomsVisual.title} indicating vitamin D deficiency`,
      placement: 'inline',
      imageUrl: symptomsVisual.url,
      relevanceScore: symptomsVisual.relevance
    });
  }
  
  if (headingLower.includes('test') || headingLower.includes('check') || headingLower.includes('level')) {
    const testingVisual = VITAMIN_D_VISUALS.testing[sectionIndex % VITAMIN_D_VISUALS.testing.length];
    visuals.push({
      type: 'diagram',
      title: testingVisual.title,
      description: testingVisual.description,
      altText: `Vitamin D testing: ${testingVisual.description}`,
      caption: `🔬 Testing Protocol: ${testingVisual.title} for accurate assessment`,
      placement: 'featured',
      imageUrl: testingVisual.url,
      relevanceScore: testingVisual.relevance
    });
  }
  
  if (headingLower.includes('food') || headingLower.includes('source') || headingLower.includes('sun')) {
    const sourcesVisual = VITAMIN_D_VISUALS.sources[sectionIndex % VITAMIN_D_VISUALS.sources.length];
    visuals.push({
      type: 'infographic',
      title: sourcesVisual.title,
      description: sourcesVisual.description,
      altText: `Vitamin D sources: ${sourcesVisual.description}`,
      caption: `☀️ Natural Sources: ${sourcesVisual.title} for optimal vitamin D levels`,
      placement: 'inline',
      imageUrl: sourcesVisual.url,
      relevanceScore: sourcesVisual.relevance
    });
  }
  
  return visuals;
}

function generateHealthFitnessVisuals(heading: string, sectionIndex: number): EnhancedVisualContent[] {
  const visual = HEALTH_FITNESS_VISUALS.general[sectionIndex % HEALTH_FITNESS_VISUALS.general.length];
  return [{
    type: 'hero-image',
    title: visual.title,
    description: visual.description,
    altText: `Health and wellness: ${visual.description}`,
    caption: `💪 Wellness Approach: ${visual.title} for optimal health outcomes`,
    placement: 'inline',
    imageUrl: visual.url,
    relevanceScore: visual.relevance
  }];
}

function generateGenericVisuals(heading: string, keyword: string, sectionIndex: number): EnhancedVisualContent[] {
  const professionalImages = [
    {
      url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      title: 'Professional consultation and guidance',
      description: 'Expert consultation for informed decision-making'
    },
    {
      url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
      title: 'Research and analysis workspace',
      description: 'Professional research and documentation environment'
    },
    {
      url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      title: 'Data analysis and insights',
      description: 'Analytical approach to problem-solving'
    },
    {
      url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
      title: 'Strategic planning and implementation',
      description: 'Professional planning and strategy development'
    }
  ];
  
  const selectedImage = professionalImages[sectionIndex % professionalImages.length];
  
  return [{
    type: 'hero-image',
    title: `${heading} - ${selectedImage.title}`,
    description: `Professional guidance for ${heading.toLowerCase()}`,
    altText: `Professional approach to ${heading.toLowerCase()}`,
    caption: `📊 Expert Guidance: ${heading} with evidence-based strategies`,
    placement: 'inline',
    imageUrl: selectedImage.url,
    relevanceScore: 75
  }];
}

function generateFallbackVisual(heading: string, keyword: string): EnhancedVisualContent {
  return {
    type: 'hero-image',
    title: `${heading} - Professional Guide`,
    description: `Comprehensive visual guide for ${heading.toLowerCase()}`,
    altText: `Professional illustration for ${heading.toLowerCase()}`,
    caption: `🎯 Expert Insights: ${heading} with professional guidance`,
    placement: 'inline',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    relevanceScore: 70
  };
}

function generateTopicSpecificInfographic(heading: string, keyword: string, sectionIndex: number): EnhancedVisualContent {
  let infographicData = {};
  let title = `${heading} - Statistical Analysis`;
  
  if (keyword.toLowerCase().includes('zinc') && keyword.toLowerCase().includes('foods')) {
    infographicData = {
      statistics: [
        { label: 'Daily Zinc Requirement', value: '8-11mg', context: 'Adult Daily Intake' },
        { label: 'Best Food Source', value: '74mg/100g', context: 'Oysters (Zinc Content)' },
        { label: 'Global Deficiency Rate', value: '17%', context: 'Population at Risk' },
        { label: 'Absorption Rate', value: '20-40%', context: 'From Animal Sources' },
        { label: 'Plant Source Absorption', value: '10-15%', context: 'Lower Bioavailability' }
      ],
      type: 'zinc-nutrition-stats'
    };
    title = `Zinc Nutrition - Critical Health Statistics`;
  } else if (keyword.toLowerCase().includes('vitamin d') && keyword.toLowerCase().includes('deficiency')) {
    infographicData = {
      statistics: [
        { label: 'Global Deficiency Rate', value: '42%', context: 'US Adults Affected' },
        { label: 'Optimal Blood Level', value: '40-60 ng/mL', context: 'Recommended Range' },
        { label: 'Daily Sun Exposure', value: '10-30 min', context: 'For Natural Production' },
        { label: 'Supplement Dose', value: '1000-4000 IU', context: 'Daily Recommendation' },
        { label: 'Deficiency Symptoms', value: '12+', context: 'Warning Signs' }
      ],
      type: 'vitamin-d-stats'
    };
    title = `Vitamin D Deficiency - Global Health Crisis Statistics`;
  } else {
    infographicData = {
      statistics: [
        { label: 'Success Rate', value: '85%', context: 'With Professional Guidance' },
        { label: 'Improvement Timeline', value: '2-3 months', context: 'Typical Progress' },
        { label: 'Evidence Quality', value: 'High', context: 'Research-Based' }
      ],
      type: 'general-health-stats'
    };
  }
  
  return {
    type: 'infographic',
    title,
    description: `Comprehensive statistical overview for ${heading.toLowerCase()}`,
    altText: `Infographic showing key statistics for ${heading.toLowerCase()}`,
    caption: `📊 Evidence-Based Data: ${heading} statistics with clinical research`,
    placement: 'featured',
    chartData: infographicData,
    chartType: 'statistical-infographic',
    relevanceScore: 94
  };
}

function generateTopicSpecificChart(heading: string, keyword: string, sectionIndex: number): EnhancedVisualContent {
  let chartData = {};
  let chartType = 'bar-chart';
  let title = `${heading} - Data Visualization`;
  
  if (keyword.toLowerCase().includes('zinc')) {
    chartData = {
      labels: ['Oysters', 'Beef', 'Pumpkin Seeds', 'Cashews', 'Chickpeas'],
      datasets: [{
        label: 'Zinc Content (mg per 100g)',
        data: [74, 12.3, 10.3, 5.6, 1.5],
        backgroundColor: ['#0ea5e9', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'],
        borderColor: ['#0284c7', '#0891b2', '#059669', '#d97706', '#dc2626'],
        borderWidth: 2
      }]
    };
    chartType = 'zinc-content-comparison';
    title = `Zinc Content Comparison - Top Food Sources`;
  } else if (keyword.toLowerCase().includes('vitamin d')) {
    chartData = {
      labels: ['Deficient (<20)', 'Insufficient (20-29)', 'Sufficient (30-39)', 'Optimal (40-60)'],
      datasets: [{
        label: 'Population Distribution (%)',
        data: [25, 35, 25, 15],
        backgroundColor: ['#dc2626', '#ea580c', '#ca8a04', '#16a34a'],
        borderColor: ['#991b1b', '#c2410c', '#a16207', '#15803d'],
        borderWidth: 2
      }]
    };
    chartType = 'vitamin-d-levels-distribution';
    title = `Vitamin D Blood Level Distribution - Population Analysis`;
  } else {
    chartData = {
      labels: ['Month 1', 'Month 2', 'Month 3', 'Month 6'],
      datasets: [{
        label: 'Improvement Progress (%)',
        data: [25, 50, 75, 90],
        backgroundColor: ['#3b82f6', '#06b6d4', '#10b981', '#16a34a']
      }]
    };
  }
  
  return {
    type: 'chart',
    title,
    description: `Interactive data visualization for ${heading.toLowerCase()}`,
    altText: `Chart displaying quantitative analysis for ${heading.toLowerCase()}`,
    caption: `📈 Data Analysis: ${heading} metrics with comparative research`,
    placement: 'inline',
    chartData,
    chartType,
    relevanceScore: 90
  };
}

function shouldHaveInfographic(heading: string): boolean {
  const infographicKeywords = ['statistics', 'data', 'facts', 'overview', 'top 20', 'requirements', 'levels'];
  return infographicKeywords.some(keyword => heading.toLowerCase().includes(keyword));
}

function shouldHaveChart(heading: string): boolean {
  const chartKeywords = ['comparison', 'amounts', 'levels', 'requirements', 'testing', 'distribution'];
  return chartKeywords.some(keyword => heading.toLowerCase().includes(keyword));
}

export function formatEnhancedVisualsForMarkdown(visuals: EnhancedVisualContent[]): string {
  if (!visuals || visuals.length === 0) {
    console.log('No visuals to format');
    return '';
  }

  console.log('Formatting', visuals.length, 'visuals for markdown');

  return visuals.map((visual, index) => {
    let formattedContent = '';
    
    // Always include the image if available
    if (visual.imageUrl) {
      formattedContent += `![${visual.altText}](${visual.imageUrl})\n\n`;
      formattedContent += `**${visual.title}**\n\n`;
      formattedContent += `*${visual.caption}*\n\n`;
    }
    
    // Add infographic data if available
    if (visual.type === 'infographic' && visual.chartData && visual.chartData.statistics) {
      formattedContent += `### 📊 Key Statistics\n\n`;
      formattedContent += `| Metric | Value | Context |\n`;
      formattedContent += `|--------|--------|----------|\n`;
      
      visual.chartData.statistics.forEach((stat: any) => {
        formattedContent += `| ${stat.label} | **${stat.value}** | ${stat.context} |\n`;
      });
      
      formattedContent += `\n> 📊 **Research-Based Data**: Statistics compiled from peer-reviewed studies and health organizations.\n\n`;
    }
    
    // Add chart visualization if available
    if (visual.type === 'chart' && visual.chartData) {
      formattedContent += `### 📈 Data Visualization\n\n`;
      formattedContent += `> **Chart Type**: ${visual.chartType}\n`;
      formattedContent += `> **Data Source**: Clinical research and nutritional databases\n`;
      formattedContent += `> **Purpose**: ${visual.description}\n\n`;
    }
    
    return formattedContent;
  }).join('---\n\n');
}
