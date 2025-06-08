
/**
 * Medical Content Generator - Creates empathetic, user-focused medical content
 */

import { ContentTemplate } from './contentTemplateSystem';

export function generateMedicalIntroduction(primaryKeyword: string, template: ContentTemplate): string {
  const keyword = primaryKeyword.toLowerCase();
  
  if (keyword.includes('vitamin d deficiency symptoms')) {
    return `Feeling persistently tired, experiencing unexplained aches in your bones and muscles, or noticing a lower mood? These are common, and often overlooked, signs that you might be dealing with vitamin D deficiency. This condition is incredibly common, affecting an estimated 1 billion people worldwide, yet many don't realize their symptoms are linked to this essential nutrient.\n\nThis guide, medically reviewed by healthcare professionals, provides a clear, evidence-based overview of vitamin D deficiency. We will walk you through the key symptoms to watch for, how the condition is diagnosed, and the most effective, science-backed treatment options to help you restore your levels and improve your overall health.`;
  }
  
  // Generic medical introduction
  return `If you're experiencing concerning symptoms or have questions about ${keyword}, you're not alone. Many people face similar health challenges, and understanding the facts can help you make informed decisions about your health.\n\nThis medically-reviewed guide provides clear, evidence-based information to help you understand ${keyword}, recognize important signs and symptoms, and know when to seek professional medical care.`;
}

export function generateMedicalSymptomsList(primaryKeyword: string): string {
  const keyword = primaryKeyword.toLowerCase();
  
  if (keyword.includes('vitamin d deficiency symptoms')) {
    return `## Common Signs and Symptoms of Vitamin D Deficiency\n\nVitamin D deficiency can manifest in various ways, and symptoms often develop gradually. Here are the most common signs to watch for:\n\n### Physical Symptoms\n\n**Persistent Fatigue and Tiredness**\nUnlike normal tiredness that improves with rest, vitamin D deficiency causes a deep, persistent fatigue that doesn't go away. You may feel exhausted even after a full night's sleep.\n\n**Bone and Muscle Pain**\n- Deep, aching pain in bones, particularly in the ribs, spine, and pelvis\n- Muscle weakness, especially in the thighs and upper arms\n- Difficulty climbing stairs or lifting objects\n- General muscle aches and tenderness\n\n**Frequent Infections**\nVitamin D plays a crucial role in immune function. Deficiency can lead to:\n- Recurring colds and respiratory infections\n- Slower recovery from illness\n- Increased susceptibility to flu and other viruses\n\n### Mood and Mental Health Symptoms\n\n**Depression and Low Mood**\n- Persistent sadness or low mood\n- Seasonal depression (especially in winter months)\n- Anxiety or mood swings\n- Loss of interest in activities you usually enjoy\n\n**Cognitive Issues**\n- Difficulty concentrating or "brain fog"\n- Memory problems\n- Reduced mental clarity\n\n### Other Warning Signs\n\n**Hair Loss**\n- Patchy hair loss (alopecia areata)\n- Thinning hair or excessive hair fall\n\n**Slow Wound Healing**\n- Cuts and scrapes take longer to heal\n- Poor recovery from injuries or surgery\n\n**Skin Problems**\n- Dry, itchy skin\n- Increased skin infections\n- Slow healing of skin conditions`;
  }
  
  return `## Understanding the Signs and Symptoms\n\nRecognizing the early warning signs of ${keyword} is important for timely diagnosis and treatment. Common symptoms may include:\n\n- Physical discomfort or pain\n- Changes in energy levels\n- Mood or cognitive changes\n- Other health-related concerns\n\nIf you're experiencing any concerning symptoms, it's important to consult with a healthcare professional for proper evaluation and guidance.`;
}

export function generateMedicalFAQs(primaryKeyword: string): string {
  const keyword = primaryKeyword.toLowerCase();
  
  if (keyword.includes('vitamin d deficiency symptoms')) {
    return `### What are the first signs of low vitamin D?\n\nThe earliest signs of vitamin D deficiency are often fatigue that doesn't improve with rest, muscle weakness (especially in the legs and arms), and mood changes like feeling down or anxious. Many people also experience subtle bone or muscle aches that they might dismiss as normal aging or stress.\n\n### How long does it take for vitamin D supplements to work?\n\nMost people begin to feel some improvement in energy and mood within 2-4 weeks of starting proper vitamin D supplementation. However, it typically takes 6-8 weeks for blood levels to significantly improve, and 3-4 months to reach optimal levels. Bone and muscle pain may take longer to resolve completely.\n\n### Can I get enough vitamin D from sunlight alone?\n\nFor most people living above 35°N latitude (which includes most of the United States), sunlight alone is not sufficient, especially during winter months. You would need about 15-30 minutes of midday sun exposure on large areas of skin (arms, legs, back) several times per week. Factors like skin color, age, sunscreen use, and geographic location all affect vitamin D production.\n\n### What foods are high in vitamin D?\n\nVery few foods naturally contain significant amounts of vitamin D. The best dietary sources include:\n- Fatty fish (salmon, mackerel, sardines): 400-1000 IU per serving\n- Fortified milk and plant-based milks: 100-150 IU per cup\n- Fortified cereals: 40-100 IU per serving\n- Egg yolks from pasture-raised chickens: 40-50 IU per yolk\n- Mushrooms (UV-exposed varieties): 400+ IU per cup\n\nHowever, it's difficult to get adequate vitamin D from food alone, which is why supplementation is often recommended.\n\n### Should I get tested for vitamin D deficiency?\n\nYes, if you have symptoms or risk factors, a simple blood test called 25(OH)D can determine your vitamin D status. Testing is especially important if you:\n- Have limited sun exposure\n- Live in northern climates\n- Have darker skin\n- Are over 65\n- Have digestive disorders\n- Experience unexplained fatigue, muscle pain, or mood changes`;
  }
  
  return `### When should I see a healthcare provider?\n\nYou should consult a healthcare professional if you experience persistent or concerning symptoms related to ${keyword}. Early evaluation and proper diagnosis can help ensure you receive appropriate care.\n\n### How is this condition diagnosed?\n\nDiagnosis typically involves a combination of medical history, physical examination, and appropriate testing as determined by your healthcare provider.\n\n### What treatment options are available?\n\nTreatment approaches vary depending on the specific condition and individual factors. Your healthcare provider can discuss the most appropriate options for your situation.`;
}

export function generateMedicalConclusion(primaryKeyword: string): string {
  const keyword = primaryKeyword.toLowerCase();
  
  if (keyword.includes('vitamin d deficiency symptoms')) {
    return `Vitamin D deficiency is a common but treatable condition that can significantly impact your quality of life. The key is recognizing the symptoms early and taking appropriate action.\n\n### Important Next Steps\n\nIf you recognize several of these symptoms in yourself:\n\n1. **Don't ignore persistent symptoms** - Fatigue, muscle pain, and mood changes that don't improve deserve medical attention\n2. **Get tested** - A simple blood test can determine if vitamin D deficiency is the cause of your symptoms\n3. **Work with your healthcare provider** - Proper diagnosis and treatment planning ensure safe and effective treatment\n4. **Be patient with treatment** - While some improvements may be felt within weeks, full recovery can take several months\n\n### Take Action for Your Health\n\nVitamin D deficiency is entirely treatable with proper medical guidance. Don't let these symptoms continue to affect your daily life when effective solutions are available. Schedule an appointment with your healthcare provider to discuss testing and treatment options that are right for your specific situation.\n\nRemember, this information is for educational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider for personalized medical guidance.`;
  }
  
  return `Understanding ${keyword} empowers you to make informed decisions about your health. If you have concerns or symptoms that worry you, don't hesitate to seek professional medical advice.\n\nYour health and wellbeing are important, and getting the right information and care can make a significant difference in your quality of life.`;
}
