
import React, { useState } from 'react';
import { Camera, Database, CheckCircle2, Play, Info, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ConfigurationFormProps {
  onTestConnection: () => void;
  onStartScanning: () => void;
  isConnecting: boolean;
  connectionStatus: 'idle' | 'success' | 'error';
}

const ConfigurationForm: React.FC<ConfigurationFormProps> = ({
  onTestConnection,
  onStartScanning,
  isConnecting,
  connectionStatus
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    cameraUrl: 'rtsp://192.168.1.100:554/stream',
    dbHost: 'localhost',
    dbPort: '3306',
    dbUser: 'alpr_user',
    dbPassword: '',
    dbName: 'alpr_database'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Camera Configuration */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">Camera Configuration</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="camera-url" className="text-sm font-medium">
              Camera Stream URL
            </Label>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400 hover:text-blue-500 transition-colors" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Enter your IP camera's RTSP or HTTP stream URL. 
                  Example: rtsp://camera-ip:554/stream or http://camera-ip/mjpeg
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="camera-url"
            type="text"
            placeholder="rtsp://192.168.1.100:554/stream"
            value={formData.cameraUrl}
            onChange={(e) => handleInputChange('cameraUrl', e.target.value)}
            className="h-12 text-base border-2 focus:border-blue-400 transition-colors"
          />
        </div>
      </div>

      {/* Database Configuration */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-800">Database Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="db-host" className="text-sm font-medium">
                Database Host
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400 hover:text-purple-500 transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>IP address or hostname of your database server</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="db-host"
              type="text"
              placeholder="localhost"
              value={formData.dbHost}
              onChange={(e) => handleInputChange('dbHost', e.target.value)}
              className="h-11 border-2 focus:border-purple-400 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="db-port" className="text-sm font-medium">
                Port
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400 hover:text-purple-500 transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Database port (usually 3306 for MySQL, 5432 for PostgreSQL)</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="db-port"
              type="text"
              placeholder="3306"
              value={formData.dbPort}
              onChange={(e) => handleInputChange('dbPort', e.target.value)}
              className="h-11 border-2 focus:border-purple-400 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="db-user" className="text-sm font-medium">
                Username
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400 hover:text-purple-500 transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Database user with read/write permissions</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id="db-user"
              type="text"
              placeholder="alpr_user"
              value={formData.dbUser}
              onChange={(e) => handleInputChange('dbUser', e.target.value)}
              className="h-11 border-2 focus:border-purple-400 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="db-password" className="text-sm font-medium">
                Password
              </Label>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-400 hover:text-purple-500 transition-colors" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Database password (encrypted and stored securely)</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <div className="relative">
              <Input
                id="db-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.dbPassword}
                onChange={(e) => handleInputChange('dbPassword', e.target.value)}
                className="h-11 border-2 focus:border-purple-400 transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="db-name" className="text-sm font-medium">
              Database Name
            </Label>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400 hover:text-purple-500 transition-colors" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Name of the database where ALPR data will be stored</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            id="db-name"
            type="text"
            placeholder="alpr_database"
            value={formData.dbName}
            onChange={(e) => handleInputChange('dbName', e.target.value)}
            className="h-11 border-2 focus:border-purple-400 transition-colors"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button
          onClick={onTestConnection}
          disabled={isConnecting}
          variant="outline"
          size="lg"
          className="flex-1 h-12 text-base border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
        >
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Testing Connection...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Test Camera Connection
            </>
          )}
        </Button>

        <Button
          onClick={onStartScanning}
          disabled={connectionStatus !== 'success'}
          size="lg"
          className="flex-1 h-12 text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Play className="h-5 w-5 mr-2" />
          Save and Start Scanning
        </Button>
      </div>
    </div>
  );
};

export default ConfigurationForm;
