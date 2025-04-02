
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface ArticleGeneratorProps {
  onContentGenerated: (content: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  isGenerating: boolean;
}

const ArticleGenerator = ({ onContentGenerated, setIsGenerating, isGenerating }: ArticleGeneratorProps) => {
  const [researchData, setResearchData] = useState("");
  const [targetKeywords, setTargetKeywords] = useState("");
  const [articleLength, setArticleLength] = useState(2000);
  const [tone, setTone] = useState("informative");
  const [includeImages, setIncludeImages] = useState(true);
  const [includeFAQs, setIncludeFAQs] = useState(true);

  // Sample article for demonstration purposes
  const sampleArticle = `
  # 25 Proven Ways to Make Money Online and Offline in 2025
  
  *Last updated: May 2025*
  
  In today's dynamic economy, finding additional income sources has become an essential skill. Whether you're looking to supplement your primary income, build a side hustle, or completely transform your career path, the opportunities to make money have never been more diverse or accessible.
  
  This comprehensive guide explores 25 legitimate ways to earn money in 2025, covering online opportunities, offline methods, and home-based options. We've thoroughly researched each method, providing you with the most current information on requirements, potential earnings, and how to get started.
  
  **Table of Contents:**
  - [Online Money-Making Methods](#online-methods)
  - [Home-Based Income Opportunities](#home-based)
  - [Offline Income Strategies](#offline-strategies)
  - [Building Sustainable Income](#sustainable-income)
  - [Frequently Asked Questions](#faqs)
  
  ## Online Money-Making Methods {#online-methods}
  
  The digital landscape continues to evolve, creating new opportunities for remote work and online entrepreneurship. Here are the most effective online money-making methods for 2025:
  
  ### 1. Freelance Work Through Specialized Platforms
  
  Freelancing remains one of the most accessible and flexible ways to earn money online. Platforms like Upwork, Fiverr, and Freelancer.com connect skilled professionals with clients worldwide.
  
  **How to succeed as a freelancer in 2025:**
  
  - **Specialize in high-demand niches**: Computer security, AI editing, SEO content creation, and data analysis are experiencing significant growth.
  - **Develop a competitive portfolio**: Showcase your best work with quantifiable results whenever possible.
  - **Master AI collaboration**: Learn to work alongside AI tools rather than competing with them—clients increasingly value human expertise in guiding and refining AI outputs.
  
  **Earning potential:** Entry-level freelancers typically earn $15-30 per hour, while experienced specialists can command $100+ hourly rates. Many successful freelancers report annual incomes exceeding $80,000 working remotely.
  
  ### 2. Website and App Testing
  
  Companies need real human feedback to improve their digital products. Platforms like UserTesting.com pay users to evaluate websites and applications, providing valuable insights on user experience.
  
  **How it works:**
  - Complete a qualification test to demonstrate your ability to provide thoughtful feedback
  - Receive testing opportunities based on your demographic profile
  - Record your screen and voice as you complete tasks and share your thoughts
  - Get paid for your insights, typically $10-60 per test depending on complexity
  
  This opportunity requires minimal technical expertise beyond basic internet navigation skills, making it accessible to most people.
  
  ### 3. AI Tool Integration and Consulting
  
  As artificial intelligence transforms industries, opportunities have emerged for those who can effectively leverage these tools. The AI market is projected to create a $3.7 trillion economic impact in North America by 2030.
  
  **Lucrative AI-related opportunities include:**
  
  - Helping businesses integrate AI into their workflows
  - Creating and selling AI-optimized templates and prompts
  - Teaching others how to use AI tools effectively
  - Editing and refining AI-generated content
  
  This field rewards those who stay current with emerging AI technologies and can translate technical capabilities into practical business applications.
  
  ## Home-Based Income Opportunities {#home-based}
  
  Working from home offers convenience and flexibility. These opportunities allow you to earn without commuting:
  
  ### 12. Pet Services Through Rover or Wag
  
  Animal lovers can monetize their passion by offering pet care services. Apps like Rover and Wag connect pet owners with walkers, sitters, and boarders in their area.
  
  **Requirements:**
  - Pass a background check
  - Complete a safety quiz
  - Have genuine affection for animals
  - Secure appropriate housing permission if offering boarding
  
  **Earning potential:** Most pet sitters charge $25-45 per night for boarding, while dog walkers typically earn $15-25 per 30-minute walk. Regular clients can provide a steady income stream.
  
  ### 14. Short-Term Rental Hosting
  
  If you have extra space in your home or an investment property, short-term rental platforms like Airbnb can generate substantial income. The short-term rental market has shown remarkable resilience, with demand continuing to grow in 2025.
  
  **Keys to success:**
  - Create an appealing listing with professional photography
  - Research local regulations and obtain necessary permits
  - Price competitively based on location, amenities, and seasonal demand
  - Focus on guest experience to generate positive reviews
  
  **Earning potential:** While variable by location, many hosts report earning 1.5-2.5 times more through short-term rentals compared to traditional leasing.
  
  ## Offline Income Strategies {#offline-strategies}
  
  Despite the digital revolution, numerous valuable opportunities exist in the physical world:
  
  ### 15. Reselling Quality Second-Hand Items
  
  The resale market is booming, with consumers increasingly valuing sustainability and unique finds. Selling gently-used clothing and accessories can generate significant income while reducing waste.
  
  **Best practices:**
  - Focus on quality brands with good resale value
  - Take clear, well-lit photos that highlight item condition
  - Research comparable items to price competitively
  - Consider both local consignment shops for immediate cash and online platforms for potentially higher returns
  
  ### 21. Rideshare and Delivery Driving
  
  Transportation and delivery services continue to be in demand. Companies like Uber, Lyft, DoorDash and Amazon Flex offer flexible opportunities to earn by providing these essential services.
  
  **Important considerations:**
  - Understand all associated costs including gas, maintenance, and depreciation
  - Maximize earnings by working during peak demand periods
  - Explore multi-app strategies to minimize downtime between tasks
  - Track all expenses for tax purposes, as many are deductible
  
  **Earning potential:** After expenses, most drivers report earning $15-25 per hour, with earnings higher in metropolitan areas and during peak times.
  
  ## Building Sustainable Income {#sustainable-income}
  
  While quick earnings are appealing, developing sustainable income sources offers greater long-term security:
  
  ### Creating Digital Products
  
  Digital products like e-books, online courses, and templates offer excellent passive income potential. Once created, they can generate revenue for years with minimal additional effort.
  
  **Success factors:**
  - Address specific problems within your area of expertise
  - Focus on professional production quality
  - Create comprehensive marketing plans
  - Regularly update content to maintain relevance
  
  ### Building Multiple Income Streams
  
  Financial resilience comes from diversification. Combining several income methods—perhaps a steady freelance client, a digital product, and a weekend side hustle—creates a more stable financial foundation.
  
  ## Avoiding Scams
  
  Unfortunately, money-making opportunities attract scammers. Protect yourself by:
  
  - Never paying upfront fees to start working
  - Researching companies thoroughly before providing personal information
  - Being skeptical of promises of unrealistic earnings
  - Checking reviews on third-party sites like Reddit and the Better Business Bureau
  
  ## Frequently Asked Questions {#faqs}
  
  **Q: How quickly can I start making money with these methods?**
  
  A: Timeframes vary significantly. Options like pet sitting or selling unused items can generate income within days, while building a profitable freelance business or content platform typically takes several months of consistent effort.
  
  **Q: Which opportunities have the highest earning potential?**
  
  A: Specialized freelancing, short-term rental hosting, and creating successful digital products typically offer the highest income ceilings. However, these also require more upfront investment in skills, time, or resources.
  
  **Q: Can I pursue multiple income streams simultaneously?**
  
  A: Yes, and it's often advisable. Start with one method to establish processes and confidence, then gradually add complementary income streams to maximize earning potential and financial security.
  
  **Q: Do I need special qualifications for these opportunities?**
  
  A: Requirements vary widely. Many entry-level opportunities require no specific qualifications beyond basic skills, while others benefit from specialized knowledge or certification. The article details specific requirements for each method.
  
  ---
  
  Whether you're looking for quick cash or building long-term wealth, the key is to start with methods aligned with your existing skills and resources. Begin today, and you'll be surprised by what you can accomplish with consistent effort over time.
  
  *Have you tried any of these money-making methods? Share your experiences in the comments below!*
  `;

  // Function to generate content (for demonstration)
  const generateContent = () => {
    setIsGenerating(true);

    // Simulating API call with a timeout
    setTimeout(() => {
      onContentGenerated(sampleArticle);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="researchData">Research Data</Label>
        <Textarea 
          id="researchData" 
          placeholder="Paste your research data, URLs, or information here..." 
          className="min-h-[150px]" 
          value={researchData}
          onChange={(e) => setResearchData(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="keywords">Target Keywords</Label>
        <Input
          id="keywords"
          placeholder="money making, online income, side hustles, passive income..."
          value={targetKeywords}
          onChange={(e) => setTargetKeywords(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="tone">Article Tone</Label>
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger id="tone">
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="informative">Informative</SelectItem>
              <SelectItem value="conversational">Conversational</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="persuasive">Persuasive</SelectItem>
              <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <Label>Article Length (words): {articleLength}</Label>
          <Slider
            defaultValue={[2000]}
            max={5000}
            step={500}
            min={1000}
            onValueChange={(value) => setArticleLength(value[0])}
          />
        </div>
      </div>

      <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includeImages" 
                  checked={includeImages}
                  onCheckedChange={setIncludeImages}
                />
                <Label htmlFor="includeImages">Include Image Suggestions</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch 
                  id="includeFAQs" 
                  checked={includeFAQs}
                  onCheckedChange={setIncludeFAQs}
                />
                <Label htmlFor="includeFAQs">Include FAQ Section</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={generateContent} 
          disabled={isGenerating || !researchData.trim()}
          className="w-full md:w-auto"
        >
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isGenerating ? "Generating Article..." : "Generate Article"}
        </Button>
      </div>
    </div>
  );
};

export default ArticleGenerator;
