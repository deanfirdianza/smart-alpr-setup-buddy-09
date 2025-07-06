import React, { useState } from 'react';
import { Camera, Database, CheckCircle2, Play, Info, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import AIAssistant from '@/components/AIAssistant';
import ConfigurationForm from '@/components/ConfigurationForm';

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleTestConnection = async () => {
    setIsConnecting(true);
    setConnectionStatus('idle');

    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Randomly succeed or fail for demo purposes
    const success = Math.random() > 0.3;
    
    if (success) {
      setConnectionStatus('success');
      toast({
        title: "Connection Successful! 🎉",
        description: "Camera stream is accessible and database connection established.",
      });
    } else {
      setConnectionStatus('error');
      toast({
        title: "Connection Failed",
        description: "Please check your camera URL and database credentials.",
        variant: "destructive",
      });
    }
    
    setIsConnecting(false);
  };

  const handleStartScanning = () => {
    toast({
      title: "ALPR System Starting! 🚀",
      description: "Your license plate recognition system is now active.",
    });
    
    // Navigate to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* AI Assistant */}
        <AIAssistant />
        
        {/* Navigation Bar */}
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Camera className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-xl text-gray-800">Smart ALPR</span>
          </div>
          <div className="flex gap-4">
            <Link to="/dashboard" className="text-blue-600 hover:text-blue-800 transition-colors">
              Dashboard
            </Link>
            <Link to="/registry" className="text-blue-600 hover:text-blue-800 transition-colors">
              Registry
            </Link>
            <Link to="/history" className="text-blue-600 hover:text-blue-800 transition-colors">
              History
            </Link>
          </div>
        </nav>
        
        {/* Header */}
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to Smart ALPR Setup
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Let's get your Automatic License Plate Recognition system configured. 
              We'll help you connect your camera and database in just a few simple steps.
            </p>
          </div>

          {/* Main Configuration Card */}
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm animate-scale-in">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl text-gray-800 flex items-center justify-center gap-2">
                  <Zap className="h-6 w-6 text-blue-500" />
                  System Configuration
                </CardTitle>
                <CardDescription className="text-lg">
                  Configure your camera source and database connection
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-8">
                <ConfigurationForm 
                  onTestConnection={handleTestConnection}
                  onStartScanning={handleStartScanning}
                  isConnecting={isConnecting}
                  connectionStatus={connectionStatus}
                />
              </CardContent>
            </Card>

            {/* Status Display */}
            {connectionStatus !== 'idle' && (
              <div className="mt-6 flex justify-center animate-fade-in">
                <Badge 
                  variant={connectionStatus === 'success' ? 'default' : 'destructive'}
                  className="px-4 py-2 text-sm"
                >
                  {connectionStatus === 'success' ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      System Ready
                    </>
                  ) : (
                    <>
                      <Info className="h-4 w-4 mr-2" />
                      Configuration Needed
                    </>
                  )}
                </Badge>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-gray-500">
            {/* <p>Need help? Our AI assistant is here to guide you through the setup process.</p> */}
            <p></p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Index;
