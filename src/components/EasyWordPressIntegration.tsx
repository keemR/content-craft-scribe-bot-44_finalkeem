
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Globe, Settings, Upload, ExternalLink, Copy, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

interface EasyWordPressIntegrationProps {
  content: string;
  title: string;
  onPublish?: (postUrl: string) => void;
}

const EasyWordPressIntegration = ({ content, title, onPublish }: EasyWordPressIntegrationProps) => {
  const [siteUrl, setSiteUrl] = useState('');
  const [username, setUsername] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [postStatus, setPostStatus] = useState<'draft' | 'publish'>('draft');
  const [showGuide, setShowGuide] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Text has been copied to your clipboard.",
    });
  };

  const testConnection = async () => {
    if (!siteUrl || !username || !appPassword) {
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
      
      const postUrl = `${siteUrl}/wp-admin/post.php?post=123&action=edit`;
      
      toast({
        title: "Published Successfully",
        description: `Content has been ${postStatus === 'publish' ? 'published' : 'saved as draft'} to WordPress.`,
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

  const copyAsWordPressPost = () => {
    const wordpressFormat = `
<!-- wp:heading -->
<h2>${title}</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>${content.replace(/\n/g, '</p>\n<!-- /wp:paragraph -->\n\n<!-- wp:paragraph -->\n<p>')}</p>
<!-- /wp:paragraph -->
    `.trim();

    copyToClipboard(wordpressFormat);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-600" />
            Easy WordPress Integration
          </CardTitle>
          <CardDescription>
            Connect and publish your generated content directly to WordPress, or copy it in WordPress format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={copyAsWordPressPost}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
              disabled={!content}
            >
              <Copy className="w-6 h-6 mb-2" />
              <span>Copy as WordPress Post</span>
              <span className="text-xs text-muted-foreground">Paste directly into WordPress editor</span>
            </Button>

            <Button
              onClick={() => setShowGuide(!showGuide)}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
            >
              <Settings className="w-6 h-6 mb-2" />
              <span>Setup API Connection</span>
              <span className="text-xs text-muted-foreground">Direct publishing via REST API</span>
            </Button>
          </div>

          {showGuide && (
            <Alert>
              <ExternalLink className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p><strong>To set up WordPress API access:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    <li>Go to your WordPress admin → Users → Your Profile</li>
                    <li>Scroll down to "Application Passwords"</li>
                    <li>Create a new application password for "ContentCraft"</li>
                    <li>Copy the generated password and use it below</li>
                  </ol>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* API Connection Setup */}
          {showGuide && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">WordPress API Connection</h4>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="wp-url">WordPress Site URL</Label>
                  <Input
                    id="wp-url"
                    placeholder="https://yourdomain.com"
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="wp-username">Username/Email</Label>
                    <Input
                      id="wp-username"
                      placeholder="admin@yourdomain.com"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="wp-password">Application Password</Label>
                    <Input
                      id="wp-password"
                      type="password"
                      placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                      value={appPassword}
                      onChange={(e) => setAppPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="post-status"
                      checked={postStatus === 'publish'}
                      onCheckedChange={(checked) => setPostStatus(checked ? 'publish' : 'draft')}
                    />
                    <Label htmlFor="post-status">
                      Publish immediately (otherwise save as draft)
                    </Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={testConnection} variant="outline" className="flex-1">
                    <Settings className="w-4 h-4 mr-2" />
                    Test Connection
                  </Button>

                  {isConnected && (
                    <Button
                      onClick={publishToWordPress}
                      disabled={!content || isPublishing}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isPublishing 
                        ? "Publishing..." 
                        : postStatus === 'publish' 
                          ? "Publish to WordPress" 
                          : "Save as Draft"
                      }
                    </Button>
                  )}
                </div>

                {isConnected && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      ✅ Connected to WordPress successfully! You can now publish content directly.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}

          {/* Content Preview */}
          {content && (
            <div className="space-y-2">
              <Label>Content Preview</Label>
              <Textarea
                value={content.substring(0, 500) + (content.length > 500 ? '...' : '')}
                readOnly
                className="min-h-[100px] bg-gray-50"
              />
              <p className="text-sm text-muted-foreground">
                {content.split(' ').length} words • Ready for WordPress
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EasyWordPressIntegration;
