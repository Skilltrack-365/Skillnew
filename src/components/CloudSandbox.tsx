import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Code, 
  Globe, 
  Database, 
  FileText, 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Upload, 
  Share2, 
  Maximize2, 
  Minimize2,
  Monitor,
  Server,
  Cpu,
  HardDrive,
  Network
} from 'lucide-react';
import CloudTerminal from './CloudTerminal';
import CloudCodeEditor from './CloudCodeEditor';
import CloudBrowser from './CloudBrowser';
import CloudDatabase from './CloudDatabase';
import CloudFileManager from './CloudFileManager';
import CloudSettings from './CloudSettings';

interface CloudSandboxProps {
  labId: string;
  sessionId: string;
  timeRemaining: number;
  onSessionEnd: () => void;
}

interface SystemStatus {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
}

const CloudSandbox: React.FC<CloudSandboxProps> = ({
  labId,
  sessionId,
  timeRemaining,
  onSessionEnd
}) => {
  const [activeTab, setActiveTab] = useState('terminal');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    cpu: 45,
    memory: 62,
    storage: 28,
    network: 15
  });

  const tabs = [
    { id: 'terminal', name: 'Terminal', icon: Terminal, description: 'Command line interface' },
    { id: 'editor', name: 'Code Editor', icon: Code, description: 'Integrated development environment' },
    { id: 'browser', name: 'Browser', icon: Globe, description: 'Web application preview' },
    { id: 'database', name: 'Database', icon: Database, description: 'Database management console' },
    { id: 'files', name: 'Files', icon: FileText, description: 'File system explorer' },
    { id: 'settings', name: 'Settings', icon: Settings, description: 'Environment configuration' }
  ];

  // Simulate system status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus(prev => ({
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 20)),
        memory: Math.max(20, Math.min(85, prev.memory + (Math.random() - 0.5) * 15)),
        storage: Math.max(15, Math.min(40, prev.storage + (Math.random() - 0.5) * 10)),
        network: Math.max(5, Math.min(30, prev.network + (Math.random() - 0.5) * 8))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'terminal':
        return (
          <CloudTerminal
            labId={labId}
            sessionId={sessionId}
            timeRemaining={timeRemaining}
            onSessionEnd={onSessionEnd}
          />
        );
      case 'editor':
        return <CloudCodeEditor labId={labId} sessionId={sessionId} />;
      case 'browser':
        return <CloudBrowser labId={labId} sessionId={sessionId} />;
      case 'database':
        return <CloudDatabase labId={labId} sessionId={sessionId} />;
      case 'files':
        return <CloudFileManager labId={labId} sessionId={sessionId} />;
      case 'settings':
        return <CloudSettings labId={labId} sessionId={sessionId} />;
      default:
        return null;
    }
  };

  const getStatusColor = (value: number) => {
    if (value < 50) return 'text-green-500';
    if (value < 75) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className={`bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50' : 'rounded-lg shadow-lg'}`}>
      {/* Main Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Cloud Sandbox</h2>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                {isRunning ? 'Running' : 'Paused'}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              Session: {sessionId} | Lab: {labId}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* System Status Indicators */}
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1">
                <Cpu className="w-3 h-3 text-gray-400" />
                <span className={getStatusColor(systemStatus.cpu)}>{Math.round(systemStatus.cpu)}%</span>
              </div>
              <div className="flex items-center space-x-1">
                <HardDrive className="w-3 h-3 text-gray-400" />
                <span className={getStatusColor(systemStatus.memory)}>{Math.round(systemStatus.memory)}%</span>
              </div>
              <div className="flex items-center space-x-1">
                <Network className="w-3 h-3 text-gray-400" />
                <span className={getStatusColor(systemStatus.network)}>{Math.round(systemStatus.network)}%</span>
              </div>
            </div>

            {/* Time Remaining */}
            <div className="text-sm font-mono text-gray-600">
              {formatTime(timeRemaining)}
            </div>

            {/* Control Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`p-2 rounded-lg ${
                  isRunning 
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
                title={isRunning ? 'Pause Environment' : 'Resume Environment'}
              >
                {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                title="Reset Environment"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                title="Download Workspace"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                title="Share Environment"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex space-x-1 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                title={tab.description}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`${isFullscreen ? 'h-screen' : 'h-[600px]'} overflow-hidden`}>
        {renderTabContent()}
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Environment: Ubuntu 22.04 LTS</span>
            <span>•</span>
            <span>Docker: v24.0.5</span>
            <span>•</span>
            <span>Node.js: v18.17.0</span>
            <span>•</span>
            <span>Python: v3.11.0</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Last saved: {new Date().toLocaleTimeString()}</span>
            <span>•</span>
            <span>Auto-save: Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloudSandbox; 