
import { useState } from "react";
import { Key, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface JinaApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
  currentApiKey?: string;
}

const JinaApiKeyInput = ({ onApiKeyChange, currentApiKey }: JinaApiKeyInputProps) => {
  const [apiKey, setApiKey] = useState(currentApiKey || "");
  const [showKey, setShowKey] = useState(false);
  const { toast } = useToast();

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('jina_api_key', apiKey.trim());
      onApiKeyChange(apiKey.trim());
      toast({
        title: "Jina AI API Key Saved",
        description: "Enhanced research capabilities are now available.",
      });
    } else {
      localStorage.removeItem('jina_api_key');
      onApiKeyChange("");
      toast({
        title: "API Key Removed",
        description: "Switched to basic research mode.",
      });
    }
  };

  const loadStoredApiKey = () => {
    const stored = localStorage.getItem('jina_api_key');
    if (stored) {
      setApiKey(stored);
      onApiKeyChange(stored);
      toast({
        title: "API Key Loaded",
        description: "Using stored Jina AI API key.",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="w-5 h-5" />
          Jina AI Research Enhancement
        </CardTitle>
        <CardDescription>
          Connect Jina AI for enhanced content extraction, semantic search, and fact verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Jina AI provides high-quality content extraction from URLs, semantic search capabilities, 
            and fact verification. Your API key is stored locally and never sent to our servers.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="jina-api-key">Jina AI API Key (Optional)</Label>
          <div className="flex gap-2">
            <Input
              id="jina-api-key"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="jina_xxxxxxxxxxxxxxxxxxxx"
              className="flex-1"
            />
            <Button
              variant="outline"
              onClick={() => setShowKey(!showKey)}
              className="px-3"
            >
              {showKey ? "Hide" : "Show"}
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSaveApiKey} className="flex-1">
            {apiKey ? "Save API Key" : "Remove API Key"}
          </Button>
          <Button variant="outline" onClick={loadStoredApiKey}>
            Load Stored
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a 
              href="https://jina.ai/reader/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              Get API Key
              <ExternalLink className="w-3 h-3" />
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="font-semibold text-blue-900">Content Extraction</div>
            <div className="text-blue-700">Clean, structured content from any URL</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="font-semibold text-green-900">Semantic Search</div>
            <div className="text-green-700">Find contextually relevant information</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="font-semibold text-purple-900">Fact Verification</div>
            <div className="text-purple-700">Validate information accuracy</div>
          </div>
        </div>

        {currentApiKey && (
          <div className="text-sm text-green-600 font-medium">
            ✅ Enhanced research capabilities active
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JinaApiKeyInput;
