
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Target, Eye, Search, Clock, Users } from "lucide-react";

interface SEOMetrics {
  overallScore: number;
  keywordDensity: number;
  readabilityScore: number;
  seoOptimization: number;
  contentQuality: number;
  engagementPotential: number;
  wordCount: number;
  readingTime: number;
  targetAudience: string;
  primaryKeyword: string;
  keywordVariations: string[];
}

interface SEOMetricsPanelProps {
  metrics: SEOMetrics;
}

const SEOMetricsPanel = ({ metrics }: SEOMetricsPanelProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "default"; // Changed from "success" to "default"
    if (score >= 60) return "secondary";
    return "destructive";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          SEO Performance Metrics
        </CardTitle>
        <CardDescription>
          Comprehensive analysis of your content's SEO potential and optimization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div className={`text-4xl font-bold ${getScoreColor(metrics.overallScore)}`}>
            {metrics.overallScore}
          </div>
          <p className="text-sm text-gray-500">Overall SEO Score</p>
          <Badge variant={getScoreBadge(metrics.overallScore)} className="mt-2">
            {metrics.overallScore >= 80 ? 'Excellent' : 
             metrics.overallScore >= 60 ? 'Good' : 'Needs Improvement'}
          </Badge>
        </div>

        <Separator />

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Keyword Optimization</span>
                <span className={`text-sm ${getScoreColor(metrics.keywordDensity)}`}>
                  {metrics.keywordDensity}%
                </span>
              </div>
              <Progress value={metrics.keywordDensity} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Readability Score</span>
                <span className={`text-sm ${getScoreColor(metrics.readabilityScore)}`}>
                  {metrics.readabilityScore}/100
                </span>
              </div>
              <Progress value={metrics.readabilityScore} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Content Quality</span>
                <span className={`text-sm ${getScoreColor(metrics.contentQuality)}`}>
                  {metrics.contentQuality}/100
                </span>
              </div>
              <Progress value={metrics.contentQuality} className="h-2" />
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">SEO Optimization</span>
                <span className={`text-sm ${getScoreColor(metrics.seoOptimization)}`}>
                  {metrics.seoOptimization}/100
                </span>
              </div>
              <Progress value={metrics.seoOptimization} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Engagement Potential</span>
                <span className={`text-sm ${getScoreColor(metrics.engagementPotential)}`}>
                  {metrics.engagementPotential}/100
                </span>
              </div>
              <Progress value={metrics.engagementPotential} className="h-2" />
            </div>
          </div>
        </div>

        <Separator />

        {/* Content Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Search className="w-4 h-4 mr-1 text-blue-500" />
              <span className="text-lg font-semibold">{metrics.wordCount}</span>
            </div>
            <p className="text-xs text-gray-500">Words</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 mr-1 text-green-500" />
              <span className="text-lg font-semibold">{metrics.readingTime}</span>
            </div>
            <p className="text-xs text-gray-500">Min Read</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="w-4 h-4 mr-1 text-purple-500" />
              <span className="text-lg font-semibold">{metrics.keywordVariations.length}</span>
            </div>
            <p className="text-xs text-gray-500">Keywords</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 mr-1 text-orange-500" />
              <span className="text-lg font-semibold">A+</span>
            </div>
            <p className="text-xs text-gray-500">Grade Level</p>
          </div>
        </div>

        <Separator />

        {/* Target Information */}
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium">Primary Keyword: </span>
            <Badge variant="outline">{metrics.primaryKeyword}</Badge>
          </div>
          <div>
            <span className="text-sm font-medium">Target Audience: </span>
            <Badge variant="secondary">{metrics.targetAudience}</Badge>
          </div>
          <div>
            <span className="text-sm font-medium">Keyword Variations: </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {metrics.keywordVariations.slice(0, 5).map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
              {metrics.keywordVariations.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{metrics.keywordVariations.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SEOMetricsPanel;
