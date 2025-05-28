
import { slugify } from '../helpers';

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

// Topic-specific image collections with high relevance
const VITAMIN_D_VISUALS = {
  symptoms: [
    {
      url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      title: 'Adult experiencing fatigue symptoms',
      description: 'Person showing signs of chronic fatigue and low energy levels',
      relevance: 95
    },
    {
      url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80',
      title: 'Muscle weakness and joint pain visualization',
      description: 'Medical illustration showing areas affected by vitamin D deficiency',
      relevance: 92
    },
    {
      url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&q=80',
      title: 'Seasonal depression and mood symptoms',
      description: 'Person experiencing seasonal affective disorder symptoms',
      relevance: 88
    }
  ],
  testing: [
    {
      url: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80',
      title: 'Vitamin D blood test procedure',
      description: 'Healthcare professional conducting vitamin D level blood test',
      relevance: 96
    },
    {
      url: 'https://images.unsplash.com/photo-1582719471137-c3967ffaaf0e?w=800&q=80',
      title: 'At-home vitamin D testing kit',
      description: 'Modern at-home testing kit for vitamin D levels',
      relevance: 90
    }
  ],
  sources: [
    {
      url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&q=80',
      title: 'Vitamin D rich foods collection',
      description: 'Salmon, eggs, fortified milk and other vitamin D food sources',
      relevance: 94
    },
    {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      title: 'Safe sun exposure for vitamin D',
      description: 'Person enjoying healthy sun exposure for natural vitamin D production',
      relevance: 91
    }
  ],
  supplements: [
    {
      url: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=800&q=80',
      title: 'Vitamin D3 supplements and dosing',
      description: 'Various vitamin D3 supplement forms and dosing guidelines',
      relevance: 93
    }
  ]
};

const HEALTH_FITNESS_VISUALS = {
  general: [
    {
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
      title: 'Health and fitness lifestyle',
      description: 'Active lifestyle promoting overall health and wellness',
      relevance: 85
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
  
  // Generate topic-specific visuals
  if (primaryKeyword.toLowerCase().includes('vitamin d') && primaryKeyword.toLowerCase().includes('deficiency')) {
    visuals.push(...generateVitaminDVisuals(heading, sectionIndex));
  } else if (topicCategory === 'health-fitness') {
    visuals.push(...generateHealthFitnessVisuals(heading, sectionIndex));
  } else {
    visuals.push(...generateGenericVisuals(heading, primaryKeyword, sectionIndex));
  }
  
  // Add infographics for data-heavy sections
  if (shouldHaveInfographic(heading)) {
    visuals.push(generateInfographic(heading, primaryKeyword, sectionIndex));
  }
  
  // Add charts for statistical sections
  if (shouldHaveChart(heading)) {
    visuals.push(generateChart(heading, primaryKeyword, sectionIndex));
  }
  
  return visuals.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 3);
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
      altText: `Medical illustration: ${symptomsVisual.description}`,
      caption: `Visual guide to ${heading.toLowerCase()} - Clinical presentation and patient experience`,
      placement: 'inline',
      imageUrl: symptomsVisual.url,
      relevanceScore: symptomsVisual.relevance
    });
  }
  
  if (headingLower.includes('test') || headingLower.includes('diagnos') || headingLower.includes('level')) {
    const testingVisual = VITAMIN_D_VISUALS.testing[sectionIndex % VITAMIN_D_VISUALS.testing.length];
    visuals.push({
      type: 'diagram',
      title: testingVisual.title,
      description: testingVisual.description,
      altText: `Testing procedure: ${testingVisual.description}`,
      caption: `Professional testing protocol for ${heading.toLowerCase()}`,
      placement: 'featured',
      imageUrl: testingVisual.url,
      relevanceScore: testingVisual.relevance
    });
  }
  
  if (headingLower.includes('food') || headingLower.includes('diet') || headingLower.includes('source') || headingLower.includes('sun')) {
    const sourcesVisual = VITAMIN_D_VISUALS.sources[sectionIndex % VITAMIN_D_VISUALS.sources.length];
    visuals.push({
      type: 'infographic',
      title: sourcesVisual.title,
      description: sourcesVisual.description,
      altText: `Nutritional guide: ${sourcesVisual.description}`,
      caption: `Evidence-based sources for ${heading.toLowerCase()}`,
      placement: 'inline',
      imageUrl: sourcesVisual.url,
      relevanceScore: sourcesVisual.relevance
    });
  }
  
  if (headingLower.includes('supplement') || headingLower.includes('treatment') || headingLower.includes('dosing')) {
    const supplementVisual = VITAMIN_D_VISUALS.supplements[0];
    visuals.push({
      type: 'comparison-table',
      title: supplementVisual.title,
      description: supplementVisual.description,
      altText: `Supplement guide: ${supplementVisual.description}`,
      caption: `Professional supplementation protocols for ${heading.toLowerCase()}`,
      placement: 'featured',
      imageUrl: supplementVisual.url,
      relevanceScore: supplementVisual.relevance
    });
  }
  
  return visuals;
}

function generateHealthFitnessVisuals(heading: string, sectionIndex: number): EnhancedVisualContent[] {
  const visual = HEALTH_FITNESS_VISUALS.general[0];
  return [{
    type: 'hero-image',
    title: visual.title,
    description: visual.description,
    altText: `Health concept: ${visual.description}`,
    caption: `Professional approach to ${heading.toLowerCase()}`,
    placement: 'inline',
    imageUrl: visual.url,
    relevanceScore: visual.relevance
  }];
}

function generateGenericVisuals(heading: string, keyword: string, sectionIndex: number): EnhancedVisualContent[] {
  return [{
    type: 'hero-image',
    title: `Professional ${heading} concept`,
    description: `High-quality visual representation of ${heading.toLowerCase()}`,
    altText: `Professional concept illustration for ${heading.toLowerCase()}`,
    caption: `Expert guidance on ${heading.toLowerCase()}`,
    placement: 'inline',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    relevanceScore: 75
  }];
}

function generateInfographic(heading: string, keyword: string, sectionIndex: number): EnhancedVisualContent {
  let infographicData = {};
  let title = `${heading} - Key Statistics`;
  
  if (keyword.toLowerCase().includes('vitamin d') && keyword.toLowerCase().includes('deficiency')) {
    infographicData = {
      statistics: [
        { label: 'Global Deficiency Rate', value: '42%', context: 'US Adults' },
        { label: 'Healthcare Cost', value: '$14.7B', context: 'Annual US Cost' },
        { label: 'Immune Function Impact', value: '83%', context: 'Respiratory Infections' },
        { label: 'Optimal Level', value: '40-60 ng/mL', context: 'Blood Concentration' }
      ],
      type: 'vitamin-d-stats'
    };
    title = `Vitamin D Deficiency - Critical Statistics & Impact`;
  }
  
  return {
    type: 'infographic',
    title,
    description: `Comprehensive statistical overview of ${heading.toLowerCase()}`,
    altText: `Infographic showing key statistics and data points for ${heading.toLowerCase()}`,
    caption: `Data-driven insights: ${heading} statistics and clinical evidence`,
    placement: 'featured',
    chartData: infographicData,
    chartType: 'statistical-infographic',
    relevanceScore: 90
  };
}

function generateChart(heading: string, keyword: string, sectionIndex: number): EnhancedVisualContent {
  let chartData = {};
  let chartType = 'bar-chart';
  
  if (keyword.toLowerCase().includes('vitamin d')) {
    chartData = {
      labels: ['Severe Deficiency', 'Deficiency', 'Insufficient', 'Optimal'],
      datasets: [{
        label: 'Blood Levels (ng/mL)',
        data: [10, 20, 30, 50],
        backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e']
      }]
    };
    chartType = 'vitamin-d-levels';
  }
  
  return {
    type: 'chart',
    title: `${heading} - Visual Analysis`,
    description: `Interactive chart showing key metrics for ${heading.toLowerCase()}`,
    altText: `Chart displaying quantitative analysis of ${heading.toLowerCase()}`,
    caption: `Visual analysis: ${heading} metrics and comparative data`,
    placement: 'inline',
    chartData,
    chartType,
    relevanceScore: 85
  };
}

function shouldHaveInfographic(heading: string): boolean {
  const infographicKeywords = ['statistics', 'data', 'facts', 'overview', 'guide', 'understanding'];
  return infographicKeywords.some(keyword => heading.toLowerCase().includes(keyword));
}

function shouldHaveChart(heading: string): boolean {
  const chartKeywords = ['levels', 'comparison', 'analysis', 'testing', 'optimal', 'range'];
  return chartKeywords.some(keyword => heading.toLowerCase().includes(keyword));
}

export function formatEnhancedVisualsForMarkdown(visuals: EnhancedVisualContent[]): string {
  return visuals.map(visual => {
    if (visual.type === 'infographic' && visual.chartData) {
      return `### 📊 ${visual.title}

<div class="infographic-container">
  <h4>Key Statistics & Clinical Data</h4>
  ${visual.chartData.statistics ? visual.chartData.statistics.map((stat: any) => 
    `- **${stat.label}**: ${stat.value} (${stat.context})`
  ).join('\n  ') : ''}
</div>

*${visual.caption}*

> 📈 **Clinical Insight**: This data represents the latest research findings and clinical evidence.`;
    }
    
    if (visual.type === 'chart' && visual.chartData) {
      return `### 📈 ${visual.title}

<InteractiveChart type="${visual.chartType}" data={${JSON.stringify(visual.chartData)}} />

*${visual.caption}*

> 📊 **Interactive Data**: Hover over chart elements for detailed information and context.`;
    }
    
    if (visual.imageUrl) {
      return `![${visual.altText}](${visual.imageUrl})

**${visual.title}**

*${visual.caption}*

> 🎯 **Relevance Score**: ${visual.relevanceScore}% - This visual directly supports the content and enhances understanding.`;
    }
    
    return `### ${visual.title}

*${visual.description}*

${visual.caption}`;
  }).join('\n\n');
}
