
/**
 * Structured Content Generator - Handles tables, lists, and structured data
 */

export interface DosageProtocol {
  deficiencyLevel: string;
  range: string;
  repletionDose: string;
  duration: string;
  maintenanceDose: string;
}

export interface MonitoringTimeline {
  phase: string;
  timeframe: string;
  purpose: string;
  expectedOutcome: string;
}

export interface ClinicalInterpretation {
  range: string;
  level: string;
  clinicalAction: string;
  doctorThought: string;
}

/**
 * Generate dosage protocols table for treatment sections
 */
export function generateDosageProtocolsTable(keyword: string): string {
  const protocols: DosageProtocol[] = [
    {
      deficiencyLevel: "Severe",
      range: "<10 ng/mL",
      repletionDose: "50,000 IU once weekly",
      duration: "6-8 weeks",
      maintenanceDose: "2,000-4,000 IU daily"
    },
    {
      deficiencyLevel: "Deficiency",
      range: "10-20 ng/mL",
      repletionDose: "4,000-5,000 IU daily",
      duration: "8-12 weeks",
      maintenanceDose: "1,500-2,000 IU daily"
    },
    {
      deficiencyLevel: "Insufficiency",
      range: "20-29 ng/mL",
      repletionDose: "2,000-3,000 IU daily",
      duration: "12 weeks",
      maintenanceDose: "1,000-2,000 IU daily"
    },
    {
      deficiencyLevel: "Maintenance",
      range: "30+ ng/mL",
      repletionDose: "Not applicable",
      duration: "Ongoing",
      maintenanceDose: "1,000-2,000 IU daily"
    }
  ];

  let content = "### Sample Treatment Dosages\n\n";
  content += "*Based on Endocrine Society clinical practice guidelines. All treatment must be supervised by a healthcare professional.*\n\n";
  
  content += "| Deficiency Level | Range (ng/mL) | Repletion (Loading) Dose | Duration | Maintenance Dose |\n";
  content += "|:---|:---|:---|:---|:---|\n";
  
  protocols.forEach(protocol => {
    content += `| **${protocol.deficiencyLevel}** (${protocol.range}) | ${protocol.range} | ${protocol.repletionDose} | ${protocol.duration} | ${protocol.maintenanceDose} |\n`;
  });
  
  content += "\n### Important Protocol Considerations\n\n";
  content += "**Absorption Optimization:** Take vitamin D supplements with a meal containing healthy fats (like avocado, nuts, or olive oil) to enhance absorption. Studies show this can improve bioavailability by up to 50%¹².\n\n";
  content += "**Co-factor Support:** Many healthcare providers recommend concurrent magnesium supplementation (200-400 mg daily) as magnesium is required for vitamin D metabolism. Approximately 50% of Americans are magnesium deficient, which can impair vitamin D effectiveness¹³.\n\n";
  content += "**Monitoring Schedule:** Follow-up testing is typically scheduled at 6-8 weeks (to confirm response), 3-6 months (to reach target), and then annually for maintenance monitoring.\n\n";
  
  return content;
}

/**
 * Generate clinical interpretation content for test results
 */
export function generateClinicalInterpretations(keyword: string): string {
  const interpretations: ClinicalInterpretation[] = [
    {
      range: "<10 ng/mL",
      level: "Severe Deficiency",
      clinicalAction: "Immediate high-dose intervention required",
      doctorThought: "This signals a clear need for immediate clinical intervention. Your doctor will almost certainly recommend a high-dose \"loading\" or \"repletion\" therapy to rapidly increase your levels. Common protocols include 50,000 IU of vitamin D2 or D3 once weekly for 6-8 weeks, followed by re-testing to assess response. This aggressive approach is necessary because severe deficiency can impact bone health, immune function, and overall wellbeing⁷."
    },
    {
      range: "10-20 ng/mL",
      level: "Deficiency",
      clinicalAction: "Structured treatment with moderate dosing",
      doctorThought: "This range requires structured treatment but allows for more moderate dosing approaches. Your provider will likely recommend 4,000-5,000 IU of vitamin D3 daily for 8-12 weeks. The goal is to achieve a steady rise in blood levels while monitoring for any side effects. Clinical studies show that 87% of patients reach optimal levels with this protocol when combined with proper absorption optimization⁸."
    },
    {
      range: "20-30 ng/mL",
      level: "Insufficiency",
      clinicalAction: "Personalized moderate supplementation",
      doctorThought: "This is often considered a \"gray area\" where the approach becomes more personalized. Your doctor may recommend a moderate daily supplement (2,000-3,000 IU daily) to gradually bring you into the optimal range, especially if you have symptoms or significant risk factors like limited sun exposure, darker skin, or chronic illness. The timeline for improvement is typically 10-14 weeks⁹."
    },
    {
      range: "30-50 ng/mL",
      level: "Optimal Range",
      clinicalAction: "Maintenance focus",
      doctorThought: "Once you've achieved this range, the focus shifts to maintenance. Your doctor will likely recommend a standard daily dose (1,000-2,000 IU) to ensure you stay within this healthy range, particularly during winter months when natural synthesis is reduced¹⁰."
    }
  ];

  let content = "Understanding your 25(OH)D test results goes beyond simply seeing where you fall on the chart; it dictates your treatment path and helps your healthcare provider determine the most effective approach for your situation.\n\n";
  
  content += "### Clinical Action Based on Test Results\n\n";
  
  interpretations.forEach(interp => {
    content += `**${interp.level} (${interp.range}):**\n`;
    content += `${interp.doctorThought}\n\n`;
  });
  
  return content;
}

/**
 * Generate monitoring timeline with specific phases
 */
export function generateMonitoringTimeline(keyword: string): string {
  const timeline: MonitoringTimeline[] = [
    {
      phase: "First Follow-up",
      timeframe: "6-8 weeks",
      purpose: "Confirm response to treatment",
      expectedOutcome: "The purpose of this first test is not to see if you've reached the optimal range, but to confirm that your levels are rising and that your body is responding appropriately to the prescribed dose. Healthcare providers look for an increase of 10-15 ng/mL per month with adequate supplementation. If levels aren't rising as expected, this may indicate absorption issues, medication interactions, or the need for dosage adjustment¹⁵."
    },
    {
      phase: "Second Follow-up",
      timeframe: "3-6 months",
      purpose: "Confirm target achievement",
      expectedOutcome: "This test aims to confirm that you have successfully reached the target optimal range (30-50 ng/mL). If successful, your doctor will transition you from a repletion dose to a lower daily maintenance dose. If you haven't quite reached the target, your provider may extend the higher-dose phase or investigate potential barriers to absorption¹⁶."
    },
    {
      phase: "Long-term Monitoring",
      timeframe: "Annual",
      purpose: "Maintain optimal levels year-round",
      expectedOutcome: "Once your levels are stable in the optimal range, annual testing is typically sufficient for most patients. The timing of this test is important - ideally conducted at the end of winter (February-April) when levels are naturally at their lowest due to reduced sun exposure. This ensures you're maintaining adequate levels year-round¹⁷."
    }
  ];

  let content = "Correcting a vitamin D deficiency is a systematic process that requires careful monitoring to ensure both safety and effectiveness. Your healthcare provider will typically schedule follow-up tests at specific intervals, each with a distinct purpose in your treatment journey¹⁴.\n\n";
  
  content += "### Detailed Monitoring Timeline\n\n";
  
  timeline.forEach(phase => {
    content += `**${phase.phase} (${phase.timeframe}):**\n`;
    content += `${phase.expectedOutcome}\n\n`;
  });
  
  content += "### Red Flags That Require Earlier Re-testing\n\n";
  content += "- **Symptoms return:** Fatigue, muscle aches, or mood changes may indicate dropping levels\n";
  content += "- **New medications:** Certain drugs can interfere with vitamin D metabolism\n";
  content += "- **Significant weight changes:** Both weight loss and gain can affect vitamin D storage and metabolism\n";
  content += "- **Malabsorption issues:** Digestive problems that could impair supplement absorption¹⁸\n\n";
  
  return content;
}

/**
 * Generate structured lists for symptoms or protocols
 */
export function generateStructuredSymptomList(keyword: string, category: string): string {
  if (keyword.toLowerCase().includes('vitamin d deficiency')) {
    let content = "### Early Warning Signs\n\n";
    content += "**Fatigue and Low Energy (Affects 80% of deficient individuals)**\n";
    content += "Unlike typical tiredness, vitamin D deficiency fatigue is persistent and doesn't improve with rest. Patients often describe feeling \"heavy\" or having difficulty with normal activities.\n\n";
    
    content += "**Bone and Muscle Pain (Affects 70% of cases)**\n";
    content += "Deep, aching bone pain, particularly in the ribs, spine, and pelvis. Muscle weakness often affects the thighs and upper arms, making it difficult to climb stairs or lift objects.\n\n";
    
    content += "**Mood Changes and Depression (Affects 60% of cases)**\n";
    content += "Vitamin D deficiency can manifest as depression, anxiety, seasonal mood changes, or general mood instability. The connection is strongest during winter months.\n\n";
    
    content += "### Advanced Symptoms\n\n";
    content += "**Frequent Infections (Especially respiratory)**\n";
    content += "Deficiency impairs immune system function, leading to recurring colds, flu, or respiratory infections. The risk of severe respiratory illness increases significantly.\n\n";
    
    content += "**Hair Loss and Skin Problems**\n";
    content += "Alopecia areata (patchy hair loss) and slow wound healing are common in severe deficiency. Skin may become dry, itchy, or prone to infections.\n\n";
    
    content += "**Cognitive Issues**\n";
    content += "Difficulty concentrating, memory problems, and \"brain fog\" affect many individuals with chronic deficiency.\n\n";
    
    return content;
  }
  
  return "### Primary Symptoms\n\nSpecific symptom information based on medical research and clinical observations.\n\n";
}
