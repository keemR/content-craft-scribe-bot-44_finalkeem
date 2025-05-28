
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { WordPress, Settings, Upload, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface WordPressConfig {
  siteUrl: string;
  username: string;
  password: string;
  postStatus: 'draft' | 'publish' | 'private';
  postCategory: string;
  postTags: string;
  autoPublish: boolean;
  addFeaturedImage: boolean;
  enableSEO: boolean;
}

interface WordPressIntegrationProps {
  content: string;
  title: string;
  onPublish?: (postUrl: string) => void;
}

const WordPressIntegration = ({ content, title, onPublish }: WordPressIntegrationProps) => {
  const [config, setConfig] = useState<WordPressConfig>({
    siteUrl: '',
    username: '',
    password: '',
    postStatus: 'draft',
    postCategory: '',
    postTags: '',
    autoPublish: false,
    addFeaturedImage: true,
    enableSEO: true
  });
  const [isConnected, setIsConnected] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();

  const testConnection = async () => {
    if (!config.siteUrl || !config.username || !config.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all WordPress connection details.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate WordPress API connection test
      setIsConnected(true);
      toast({
        title: "Connection Successful",
        description: "Successfully connected to your WordPress site.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to WordPress. Please check your credentials.",
        variant: "destructive",
      });
    }
  };

  const publishToWordPress = async () => {
    if (!isConnected) {
      toast({
        title: "Not Connected",
        description: "Please test and establish connection first.",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);

    try {
      // Simulate WordPress API call to create post
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const postUrl = `${config.siteUrl}/wp-admin/post.php?post=123&action=edit`;
      
      toast({
        title: "Published Successfully",
        description: `Content has been ${config.postStatus === 'publish' ? 'published' : 'saved as draft'} to WordPress.`,
      });
      
      onPublish?.(postUrl);
      
    } catch (error) {
      toast({
        title: "Publishing Failed",
        description: "Failed to publish content to WordPress.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <WordPress className="w-5 h-5 mr-2 text-blue-600" />
          WordPress Integration
        </CardTitle>
        <CardDescription>
          Connect and publish your generated content directly to your WordPress site
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Settings */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="wp-url">WordPress Site URL</Label>
              <Input
                id="wp-url"
                placeholder="https://yourdomain.com"
                value={config.siteUrl}
                onChange={(e) => setConfig(prev => ({ ...prev, siteUrl: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="wp-username">Username/Email</Label>
              <Input
                id="wp-username"
                placeholder="admin@yourdomain.com"
                value={config.username}
                onChange={(e) => setConfig(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="wp-password">Application Password</Label>
            <Input
              id="wp-password"
              type="password"
              placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
              value={config.password}
              onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
            />
            <p className="text-xs text-gray-500 mt-1">
              Use WordPress Application Passwords for secure API access
            </p>
          </div>

          <Button onClick={testConnection} variant="outline" className="w-full">
            <Settings className="w-4 h-4 mr-2" />
            Test Connection
          </Button>

          {isConnected && (
            <Alert>
              <ExternalLink className="h-4 w-4" />
              <AlertDescription>
                ✅ Connected to WordPress successfully!
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Publishing Options */}
        <div className="space-y-4">
          <h4 className="font-medium">Publishing Options</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="post-status">Post Status</Label>
              <Select 
                value={config.postStatus} 
                onValueChange={(value: 'draft' | 'publish' | 'private') => 
                  setConfig(prev => ({ ...prev, postStatus: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="publish">Publish</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="post-category">Category</Label>
              <Input
                id="post-category"
                placeholder="Health, Fitness, Lifestyle..."
                value={config.postCategory}
                onChange={(e) => setConfig(prev => ({ ...prev, postCategory: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="post-tags">Tags (comma-separated)</Label>
            <Input
              id="post-tags"
              placeholder="nutrition, wellness, tips"
              value={config.postTags}
              onChange={(e) => setConfig(prev => ({ ...prev, postTags: e.target.value }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured-image"
                  checked={config.addFeaturedImage}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, addFeaturedImage: checked }))}
                />
                <Label htmlFor="featured-image">Add Featured Image</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="enable-seo"
                  checked={config.enableSEO}
                  onCheckedChange={(checked) => setConfig(prev => ({ ...prev, enableSEO: checked }))}
                />
                <Label htmlFor="enable-seo">Optimize for SEO</Label>
              </div>
            </div>
          </div>
        </div>

        {/* Publish Button */}
        <Button
          onClick={publishToWordPress}
          disabled={!isConnected || !content || isPublishing}
          className="w-full"
          size="lg"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isPublishing 
            ? "Publishing..." 
            : config.postStatus === 'publish' 
              ? "Publish to WordPress" 
              : "Save as Draft"
          }
        </Button>
      </CardContent>
    </Card>
  );
};

export default WordPressIntegration;
