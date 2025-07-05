import React, { useState } from 'react';
import { 
  Globe, 
  RefreshCw, 
  ArrowLeft, 
  ArrowRight, 
  Home, 
  Settings, 
  Maximize2,
  ExternalLink,
  Monitor
} from 'lucide-react';

interface CloudBrowserProps {
  labId: string;
  sessionId: string;
}

const CloudBrowser: React.FC<CloudBrowserProps> = ({ labId, sessionId }) => {
  const [currentUrl, setCurrentUrl] = useState('http://localhost:3000');
  const [urlInput, setUrlInput] = useState(currentUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleNavigate = (url: string) => {
    setIsLoading(true);
    setCurrentUrl(url);
    setUrlInput(url);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleGo = () => {
    handleNavigate(urlInput);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGo();
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Simulate different application states based on URL
    if (currentUrl.includes('localhost:3000')) {
      return (
        <div className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Your Cloud Application
              </h1>
              <p className="text-gray-600 mb-6">
                This is your application running in the cloud environment. You can modify the code in the editor and see live updates here.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">API Endpoints</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">GET</span>
                      <code className="text-blue-600">/</code>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">GET</span>
                      <code className="text-blue-600">/health</code>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">System Status</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Server Status:</span>
                      <span className="text-green-600 font-medium">Running</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Uptime:</span>
                      <span className="text-gray-600">2m 34s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Environment:</span>
                      <span className="text-gray-600">development</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Try the API</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleNavigate('http://localhost:3000/health')}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                    >
                      Test Health Endpoint
                    </button>
                    <span className="text-gray-500 text-sm">Check if the server is healthy</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleNavigate('http://localhost:3000')}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                    >
                      View Root Endpoint
                    </button>
                    <span className="text-gray-500 text-sm">See the main API response</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (currentUrl.includes('/health')) {
      return (
        <div className="p-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Health Check Response</h2>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                <pre>{JSON.stringify({
                  status: "healthy",
                  uptime: 154.23,
                  timestamp: new Date().toISOString(),
                  environment: "development",
                  version: "1.0.0"
                }, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Web Browser</h3>
          <p className="text-gray-600 mb-4">Your web applications will appear here</p>
          <p className="text-sm text-gray-500">Current URL: {currentUrl}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white ${isFullscreen ? 'fixed inset-0 z-50' : 'h-full'}`}>
      {/* Browser Toolbar */}
      <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleNavigate('http://localhost:3000')}
            className="p-1 text-gray-600 hover:text-gray-900"
            title="Home"
          >
            <Home className="w-4 h-4" />
          </button>
          <button 
            className="p-1 text-gray-600 hover:text-gray-900"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button 
            className="p-1 text-gray-600 hover:text-gray-900"
            title="Forward"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button 
            onClick={() => handleNavigate(currentUrl)}
            className="p-1 text-gray-600 hover:text-gray-900"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          
          <div className="flex-1 flex items-center space-x-2 ml-2">
            <Globe className="w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter URL..."
            />
            <button
              onClick={handleGo}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Go
            </button>
          </div>
          
          <div className="flex items-center space-x-1 ml-2">
            <button 
              className="p-1 text-gray-600 hover:text-gray-900"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button 
              className="p-1 text-gray-600 hover:text-gray-900"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 text-gray-600 hover:text-gray-900"
              title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Browser Content */}
      <div className={`${isFullscreen ? 'h-screen' : 'h-full'} overflow-auto bg-gray-50`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default CloudBrowser; 