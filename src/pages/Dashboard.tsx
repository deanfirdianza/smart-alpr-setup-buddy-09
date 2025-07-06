
import React, { useState, useEffect } from 'react';
import { Camera, Activity, Clock, Target, ToggleLeft, ToggleRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';

interface Detection {
  id: string;
  plate: string;
  confidence: number;
  timestamp: Date;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [autoOcrMode, setAutoOcrMode] = useState(true);
  const [lastDetection, setLastDetection] = useState<Detection | null>(null);
  const [recentDetections, setRecentDetections] = useState<Detection[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);

  // Simulate real-time detections for demo
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoOcrMode && Math.random() > 0.7) {
        const plates = ['ABC123', 'XYZ789', 'DEF456', 'GHI321', 'JKL987'];
        const randomPlate = plates[Math.floor(Math.random() * plates.length)];
        const confidence = 75 + Math.random() * 25; // 75-100%
        
        const newDetection: Detection = {
          id: Date.now().toString(),
          plate: randomPlate,
          confidence: Math.round(confidence),
          timestamp: new Date()
        };

        setLastDetection(newDetection);
        setRecentDetections(prev => [newDetection, ...prev.slice(0, 9)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [autoOcrMode]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-500';
    if (confidence >= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Setup
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Live ALPR Scan
              </h1>
              {isStreaming && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-600 font-medium">Live</span>
                </div>
              )}
            </div>
          </div>

          {/* Auto OCR Toggle */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="auto-ocr" className="text-sm font-medium">
              Auto OCR Mode
            </Label>
            <Switch
              id="auto-ocr"
              checked={autoOcrMode}
              onCheckedChange={setAutoOcrMode}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Video Feed */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-blue-500" />
                  Live Camera Feed
                </CardTitle>
                <CardDescription>MJPEG Stream from IP Camera</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  {/* Simulated video feed */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Camera size={48} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Camera Stream</p>
                      <p className="text-xs">rtsp://192.168.1.100:554/stream</p>
                    </div>
                  </div>
                  
                  {/* Detection Overlay */}
                  {lastDetection && (
                    <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg animate-fade-in">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-green-400" />
                        <span className="font-mono font-bold">{lastDetection.plate}</span>
                        <Badge variant="secondary" className="text-xs">
                          {lastDetection.confidence}%
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* Scanning Animation */}
                  {autoOcrMode && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detection Info */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-500" />
                  Latest Detection
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lastDetection ? (
                  <div className="text-center space-y-4 animate-scale-in">
                    <div className="text-3xl font-mono font-bold text-gray-800 bg-gray-100 rounded-lg py-4 px-6">
                      {lastDetection.plate}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getConfidenceColor(lastDetection.confidence)}`}></div>
                      <span className="text-lg font-semibold">{lastDetection.confidence}% Confidence</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{formatTime(lastDetection.timestamp)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Waiting for detection...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Camera</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Connected
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">YOLO Engine</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Active
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">OCR Engine</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Ready
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Detections Today</span>
                  <Badge variant="outline">{recentDetections.length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Detections Table */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Recent Detections</CardTitle>
            <CardDescription>Latest license plate detections with confidence scores</CardDescription>
          </CardHeader>
          <CardContent>
            {recentDetections.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>License Plate</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Confidence</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDetections.map((detection) => (
                    <TableRow key={detection.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-mono font-medium">{detection.plate}</TableCell>
                      <TableCell className="text-gray-600">{formatTime(detection.timestamp)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getConfidenceColor(detection.confidence)}`}></div>
                          <span>{detection.confidence}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No detections yet. Enable Auto OCR Mode to start scanning.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
