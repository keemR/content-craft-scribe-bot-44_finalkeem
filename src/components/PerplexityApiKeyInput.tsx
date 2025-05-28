
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Key, ExternalLink } from "lucide-react";

interface PerplexityApiKeyInputProps {
  onApiKeySet: (apiKey: string) => void;
  className?: string;
}

const PerplexityApiKeyInput = ({ onApiKeySet, className }: PerplexityApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingKey, setIsTestingKey] = useState(false);

  const testApiKey = async () => {
    if (!apiKey.trim()) return;
    
    setIsTestingKey(true);
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            { role: 'user', content: 'Test connection' }
          ],
          max_tokens: 10
        }),
      });
      
      if (response.ok) {
        onApiKeySet(apiKey);
      } else {
        alert('Invalid API key. Please check and try again.');
      }
    } catch (error) {
      alert('Error testing API key. Please check your connection and try again.');
    } finally {
      setIsTestingKey(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="w-5 h-5 mr-2" />
          Perplexity API Integration
        </CardTitle>
        <CardDescription>
          Connect to Perplexity AI for real-time research data and competitive content analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <ExternalLink className="h-4 w-4" />
          <AlertDescription>
            For optimal results, we recommend connecting to Supabase to securely store your API keys.{' '}
            <a 
              href="https://docs.lovable.dev/integrations/supabase/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Learn more about Supabase integration
            </a>
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="perplexity-api-key">Perplexity API Key</Label>
          <div className="relative">
            <Input
              id="perplexity-api-key"
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowApiKey(!showApiKey)}
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Get your API key from{' '}
            <a 
              href="https://www.perplexity.ai/settings/api" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Perplexity AI Settings
            </a>
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={testApiKey}
            disabled={!apiKey.trim() || isTestingKey}
            className="flex-1"
          >
            {isTestingKey ? "Testing..." : "Test & Connect"}
          </Button>
          <Button 
            variant="outline"
            onClick={() => onApiKeySet("")}
            className="px-4"
          >
            Skip (Use Mock Data)
          </Button>
        </div>

        <Alert>
          <AlertDescription>
            <strong>Benefits with API key:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
              <li>Real-time competitor analysis and content gaps</li>
              <li>Latest statistics and research findings</li>
              <li>Expert quotes and recent study citations</li>
              <li>Current industry trends and developments</li>
              <li>Higher content quality and competitiveness</li>
            </ul>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default PerplexityApiKeyInput;
