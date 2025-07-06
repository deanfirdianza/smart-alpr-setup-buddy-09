import React, { useState, useEffect } from 'react';
import { Camera, Target, Database, Settings, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Detection {
  id: number;
  plateNumber: string;
  timestamp: Date;
  confidence: number;
}

const Dashboard = () => {
  const { toast } = useToast();
  const [currentFrame, setCurrentFrame] = useState('/placeholder-frame.jpg');
  const [lastDetection, setLastDetection] = useState<Detection | null>(null);
  const [detectionHistory, setDetectionHistory] = useState<Detection[]>([]);
  const [autoOcrEnabled, setAutoOcrEnabled] = useState(true);

  // Mock function to simulate camera feed updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Simulate new frame
      setCurrentFrame(`/frame-${Math.floor(Math.random() * 5) + 1}.jpg`);

      // Simulate detection
      if (Math.random() > 0.7) {
        const newDetection: Detection = {
          id: Date.now(),
          plateNumber: `PLATE-${Math.floor(Math.random() * 999)}`,
          timestamp: new Date(),
          confidence: Math.random() * 0.3 + 0.7,
        };
        setLastDetection(newDetection);
        setDetectionHistory((prev) => [newDetection, ...prev]);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Bar */}
        <nav className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <Camera className="h-6 w-6" />
              <span className="font-bold text-xl">Smart ALPR</span>
            </Link>
            <span className="text-gray-300">|</span>
            <Link to="/history" className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
              View History
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Live</span>
          </div>
        </nav>

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Live ALPR Scan
          </h1>
          <p className="text-gray-600">Real-time license plate recognition system</p>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Video Feed */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-scale-in">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-blue-500" />
                    Live Camera Feed
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video shadow-inner">
                  <img
                    src={currentFrame}
                    alt="Live camera feed"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                  {/* Simulated detection overlay */}
                  {lastDetection && (
                    <div className="absolute top-4 left-4 bg-blue-500/90 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                      Detection Active
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detection Info */}
          <div className="space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Latest Detection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lastDetection ? (
                  <>
                    <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
                      <div className="text-3xl font-bold font-mono text-gray-900 mb-2">
                        {lastDetection.plateNumber}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {lastDetection.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Confidence</span>
                        <Badge variant={lastDetection.confidence > 0.9 ? 'default' : 'secondary'}>
                          {Math.round(lastDetection.confidence * 100)}%
                        </Badge>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Processing Time</span>
                        <span className="text-sm text-gray-800">127ms</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Target className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>Waiting for detections...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Controls */}
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-500" />
                  Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium text-sm">Auto OCR Mode</div>
                    <div className="text-xs text-gray-500">Automatic text recognition</div>
                  </div>
                  <Switch checked={autoOcrEnabled} onCheckedChange={setAutoOcrEnabled} />
                </div>
                
                <Button 
                  onClick={() => {
                    toast({
                      title: "Settings Updated",
                      description: "OCR mode toggled successfully",
                    });
                  }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Apply Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Detections Table */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-indigo-500" />
                Recent Detections
              </CardTitle>
              <Link to="/history">
                <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                  View All History
                </Button>
              </Link>
            </div>
            <CardDescription>Latest license plate recognitions from your system</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plate Number</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detectionHistory.slice(0, 8).map((detection) => (
                  <TableRow key={detection.id} className="hover:bg-blue-50/50">
                    <TableCell className="font-mono font-semibold">
                      {detection.plateNumber}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {detection.timestamp.toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={detection.confidence > 0.9 ? 'default' : 'secondary'}>
                        {Math.round(detection.confidence * 100)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Processed
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
