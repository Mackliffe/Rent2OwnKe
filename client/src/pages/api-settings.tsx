import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Settings, Key, Check, AlertCircle, ExternalLink } from "lucide-react";

export default function APISettings() {
  const [apiKeys, setApiKeys] = useState({
    kenyaPropertyPortal: '',
    buyRentKenya: '',
    propertyPointKenya: '',
  });
  
  const [enabledAPIs, setEnabledAPIs] = useState({
    kenyaPropertyPortal: true,
    buyRentKenya: true,
    propertyPointKenya: true,
  });

  const [testResults, setTestResults] = useState<Record<string, 'idle' | 'testing' | 'success' | 'error'>>({});
  const { toast } = useToast();

  const handleAPIKeyChange = (api: string, value: string) => {
    setApiKeys(prev => ({ ...prev, [api]: value }));
  };

  const handleAPIToggle = (api: string, enabled: boolean) => {
    setEnabledAPIs(prev => ({ ...prev, [api]: enabled }));
  };

  const testAPIConnection = async (api: string) => {
    setTestResults(prev => ({ ...prev, [api]: 'testing' }));
    
    try {
      // Simulate API test - in real implementation this would call the actual API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, randomly succeed or fail
      const success = Math.random() > 0.3;
      
      if (success) {
        setTestResults(prev => ({ ...prev, [api]: 'success' }));
        toast({
          title: "API Connection Successful",
          description: `Successfully connected to ${getAPIDisplayName(api)}`,
        });
      } else {
        setTestResults(prev => ({ ...prev, [api]: 'error' }));
        toast({
          title: "API Connection Failed",
          description: `Failed to connect to ${getAPIDisplayName(api)}. Please check your API key.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [api]: 'error' }));
      toast({
        title: "Connection Error",
        description: "An error occurred while testing the API connection.",
        variant: "destructive",
      });
    }
  };

  const saveSettings = async () => {
    try {
      // In a real app, this would save to backend/database
      localStorage.setItem('kenyan-api-settings', JSON.stringify({ apiKeys, enabledAPIs }));
      
      toast({
        title: "Settings Saved",
        description: "Your API settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getAPIDisplayName = (api: string) => {
    const names: Record<string, string> = {
      kenyaPropertyPortal: "Kenya Property Portal",
      buyRentKenya: "BuyRentKenya",
      propertyPointKenya: "PropertyPoint Kenya",
    };
    return names[api] || api;
  };

  const getAPIDescription = (api: string) => {
    const descriptions: Record<string, string> = {
      kenyaPropertyPortal: "Access properties from Kenya's leading property portal with comprehensive listings across all major cities.",
      buyRentKenya: "Integrate with BuyRentKenya's extensive database of rental and purchase properties throughout Kenya.",
      propertyPointKenya: "Connect to PropertyPoint Kenya for premium property listings and detailed market analytics.",
    };
    return descriptions[api] || '';
  };

  const getStatusIcon = (api: string) => {
    const status = testResults[api];
    switch (status) {
      case 'testing':
        return <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Settings className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">API Integration Settings</h1>
              <p className="text-gray-600">Configure your connections to Kenyan real estate data sources</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {Object.keys(apiKeys).map((api) => (
            <Card key={api} className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Key className="w-5 h-5 text-green-600" />
                    <div>
                      <CardTitle className="text-lg">{getAPIDisplayName(api)}</CardTitle>
                      <CardDescription className="text-sm">
                        {getAPIDescription(api)}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(api)}
                    <Switch
                      checked={enabledAPIs[api as keyof typeof enabledAPIs]}
                      onCheckedChange={(checked) => handleAPIToggle(api, checked)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`${api}-key`}>API Key</Label>
                  <Input
                    id={`${api}-key`}
                    type="password"
                    placeholder="Enter your API key"
                    value={apiKeys[api as keyof typeof apiKeys]}
                    onChange={(e) => handleAPIKeyChange(api, e.target.value)}
                    className="focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => testAPIConnection(api)}
                    disabled={!apiKeys[api as keyof typeof apiKeys] || testResults[api] === 'testing'}
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    {testResults[api] === 'testing' ? 'Testing...' : 'Test Connection'}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-green-600 hover:text-green-700"
                    onClick={() => window.open(`https://${api}.com/developers`, '_blank')}
                  >
                    Get API Key
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">Integration Benefits</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• Access to thousands of additional properties from major Kenyan real estate platforms</li>
                    <li>• Real-time property data updates and availability</li>
                    <li>• Expanded search coverage across all Kenyan counties and cities</li>
                    <li>• Professional property photos and detailed descriptions</li>
                    <li>• Direct contact information for property agents and owners</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-3">
            <Button
              onClick={saveSettings}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}