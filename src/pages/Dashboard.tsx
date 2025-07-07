import React, { useState, useEffect } from 'react';
import { Camera, Target, Database, Settings, Clock, Play, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { getScanHistory, HistoryRecord } from '@/api/history';
import { scanOnceImage, getAutoOCRStatus, setAutoOCRStatus } from '@/api/dashboard';
import { toLocaleDateString } from '@/lib/utils';

const Dashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentFrame, setCurrentFrame] = useState(`${import.meta.env.VITE_VIDEO_FEED_URL}`);
  const [lastDetection, setLastDetection] = useState<HistoryRecord | null>(null);
  const [detectionHistory, setDetectionHistory] = useState<HistoryRecord[]>([]);
  const [autoOcrEnabled, setAutoOcrEnabled] = useState(false);

  // import.meta.env.VIDEO_FEED_URL
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentFrame(`${import.meta.env.VITE_VIDEO_FEED_URL}?${Date.now()}`);
    }, 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchOCRStatus = async () => {
      try {
        const status = await getAutoOCRStatus();
        setAutoOcrEnabled(status);
      } catch {
        toast({ title: "Failed to load Auto OCR setting" });
      }
    };
    fetchOCRStatus();
  }, []);

  useEffect(() => {
    if (!autoOcrEnabled) return;

    const interval = setInterval(async () => {
      try {
        const result = await scanOnceImage();
        if (result?.formatted_plate) {
          const detection: HistoryRecord = {
            id: Date.now(),
            plate_number: result.formatted_plate,
            timestamp: new Date().toISOString(),
            confidence: result.confidence,
          };
          setLastDetection(detection);
          setDetectionHistory(prev => [detection, ...prev]);
        }
      } catch (err) {
        toast({ title: "Auto OCR Error", description: "Failed to scan." });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoOcrEnabled]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getScanHistory({ page: 1, per_page: 10 });
        const history = res.items.map((item: any) => ({
          ...item,
          timestamp: item.timestamp,
          confidence: parseFloat(item.confidence),
        }));
        setDetectionHistory(history);
      } catch {
        toast({ title: "Failed to load detection history" });
      }
    };
    fetchHistory();
  }, []);

  const handleManualScan = async () => {
    try {
      const result = await scanOnceImage();
      if (result?.formatted_plate) {
        const detection: HistoryRecord = {
          id: Date.now(),
          plate_number: result.formatted_plate,
          timestamp: new Date().toISOString(),
          confidence: result.confidence,
        };
        setLastDetection(detection);
        setDetectionHistory(prev => [detection, ...prev]);
        toast({ title: "Manual Scan Success! 📸", description: `Detected: ${detection.plate_number}` });
      } else {
        toast({ title: "Scan failed", variant: "destructive" });
      }
    } catch {
      toast({ title: "Scan error", variant: "destructive" });
    }
  };

  const handleViewHistory = (plate: string) => navigate(`/history?plate=${plate}`);

  const handleToggleAutoOCR = async (val: boolean) => {
    setAutoOcrEnabled(val);
    try {
      await setAutoOCRStatus(val);
      toast({ title: `Auto OCR ${val ? 'Enabled' : 'Disabled'}` });
    } catch {
      toast({ title: 'Failed to update Auto OCR setting', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-right mb-4 text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
        </div>
        <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600">Home</Link><span>/</span>
          <span className="text-gray-900 font-medium">Dashboard</span>
        </div>

        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
              <Play className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Live ALPR Scan
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time license plate detection and recognition system
          </p>
        </div>

        <div className="mb-8 flex justify-center gap-4">
          <Link to="/registry"><Button variant="outline"><Database className="h-4 w-4" /> Registry</Button></Link>
          <Link to="/history"><Button variant="outline"><FileText className="h-4 w-4" /> History</Button></Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-scale-in">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2"><Camera className="h-5 w-5 text-blue-500" /> Live Feed</CardTitle>
                  <Badge className="bg-green-100 text-green-800 border-green-200"><div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                  <img src={currentFrame} alt="Live camera" className="w-full h-full object-cover" />
                  {lastDetection && (
                    <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium animate-pulse">
                      Detection Active
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-xl bg-white/90">
              <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5 text-green-500" /> Latest Detection</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {lastDetection ? (
                  <>
                    <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100">
                      <div className="text-3xl font-bold font-mono mb-2">{lastDetection.plate_number}</div>
                      <div className="flex justify-center gap-2 text-sm text-gray-600"><Clock className="h-4 w-4" />{new Date(lastDetection.timestamp).toLocaleString()}</div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between"><span>Confidence</span><Badge>{Math.round(lastDetection.confidence * 100)}%</Badge></div>
                      <div className="flex justify-between"><span>Processing Time</span><span>~120ms</span></div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500"><Target className="h-12 w-12 mx-auto mb-3 opacity-30" /><p>Waiting for detection…</p></div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-xl bg-white/90">
              <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-purple-500" /> Controls</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div><div className="font-medium text-sm">Auto OCR Mode</div><div className="text-xs text-gray-500">Automatic detection loop</div></div>
                  <Switch checked={autoOcrEnabled} onCheckedChange={handleToggleAutoOCR} />
                </div>
                {!autoOcrEnabled && (
                  <Button onClick={handleManualScan} className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                    <Camera className="h-4 w-4 mr-2" /> Scan Now
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="shadow-xl bg-white/90 animate-fade-in">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5 text-indigo-500" /> Recent Detections</CardTitle>
              <Link to="/history"><Button variant="outline" size="sm" className="text-blue-600 border-blue-200">View History</Button></Link>
            </div>
            <CardDescription>Latest detection records</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plate</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detectionHistory.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-mono font-semibold">{d.plate_number}</TableCell>
                    <TableCell>{new Date(d.timestamp).toLocaleString()}</TableCell>
                    <TableCell><Badge>{Math.round(d.confidence * 100)}%</Badge></TableCell>
                    <TableCell><Button onClick={() => handleViewHistory(d.plate_number)} variant="outline" size="sm"><Eye className="h-4 w-4 mr-1" />View</Button></TableCell>
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
