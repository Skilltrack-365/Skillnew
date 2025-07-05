import React, { useState } from 'react';
import { Monitor, Code, Terminal, Globe, Database, Settings, FileText, Download } from 'lucide-react';
import CloudTerminal from './CloudTerminal';

interface CloudEnvironmentProps {
  labId: string;
  sessionId: string;
  timeRemaining: number;
  onSessionEnd: () => void;
}

const CloudEnvironment: React.FC<CloudEnvironmentProps> = ({
  labId,
  sessionId,
  timeRemaining,
  onSessionEnd
}) => {
  const [activeTab, setActiveTab] = useState('terminal');

  const tabs = [
    { id: 'terminal', name: 'Terminal', icon: Terminal },
    { id: 'editor', name: 'Code Editor', icon: Code },
    { id: 'browser', name: 'Browser', icon: Globe },
    { id: 'database', name: 'Database', icon: Database },
    { id: 'files', name: 'Files', icon: FileText },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

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
        return (
          <div className="bg-gray-900 text-white rounded-lg h-96 p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Code className="w-5 h-5" />
                <span>Code Editor</span>
              </div>
              <div className="flex space-x-2">
                <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                  Save
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm">
                  Run
                </button>
              </div>
            </div>
            <div className="bg-gray-800 rounded p-4 h-80 overflow-auto font-mono text-sm">
              <div className="text-gray-400 mb-2">// Welcome to the cloud code editor</div>
              <div className="text-blue-400">function</div>
              <div className="text-yellow-400 ml-4">helloWorld</div>
              <div className="text-white">{"() {"}</div>
              <div className="text-green-400 ml-8">console.log("Hello from the cloud!");</div>
              <div className="text-white">{"}"}</div>
              <div className="mt-4 text-gray-400">// Start coding your lab exercises here</div>
            </div>
          </div>
        );
      
      case 'browser':
        return (
          <div className="bg-white rounded-lg h-96 border">
            <div className="bg-gray-100 px-4 py-2 border-b flex items-center space-x-2">
              <Globe className="w-4 h-4 text-gray-600" />
              <div className="flex-1 bg-white rounded px-3 py-1 text-sm border">
                https://localhost:3000
              </div>
              <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                Go
              </button>
            </div>
            <div className="p-8 text-center">
              <Monitor className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Web Browser</h3>
              <p className="text-gray-600">Your web applications will appear here</p>
            </div>
          </div>
        );
      
      case 'database':
        return (
          <div className="bg-white rounded-lg h-96 border">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-gray-600" />
                <span className="font-medium">Database Console</span>
              </div>
            </div>
            <div className="p-4">
              <div className="bg-gray-900 text-green-400 rounded p-4 font-mono text-sm h-80 overflow-auto">
                <div>MySQL [skilltrack_lab]&gt; SHOW TABLES;</div>
                <div className="mt-2">+------------------+</div>
                <div>| Tables_in_lab    |</div>
                <div>+------------------+</div>
                <div>| users            |</div>
                <div>| products         |</div>
                <div>| orders           |</div>
                <div>+------------------+</div>
                <div className="mt-4">3 rows in set (0.00 sec)</div>
                <div className="mt-4 flex items-center">
                  <span>MySQL [skilltrack_lab]&gt;</span>
                  <span className="bg-green-400 w-2 h-4 animate-pulse ml-2"></span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'files':
        return (
          <div className="bg-white rounded-lg h-96 border">
            <div className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-600" />
                <span className="font-medium">File Manager</span>
              </div>
              <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
                <Download className="w-4 h-4 mr-1" />
                Download All
              </button>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <FileText className="w-4 h-4 text-blue-600 mr-3" />
                  <span>README.md</span>
                  <span className="ml-auto text-sm text-gray-500">2KB</span>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <FileText className="w-4 h-4 text-green-600 mr-3" />
                  <span>app.js</span>
                  <span className="ml-auto text-sm text-gray-500">15KB</span>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <FileText className="w-4 h-4 text-orange-600 mr-3" />
                  <span>package.json</span>
                  <span className="ml-auto text-sm text-gray-500">1KB</span>
                </div>
                <div className="flex items-center p-2 hover:bg-gray-50 rounded">
                  <FileText className="w-4 h-4 text-purple-600 mr-3" />
                  <span>docker-compose.yml</span>
                  <span className="ml-auto text-sm text-gray-500">3KB</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'settings':
        return (
          <div className="bg-white rounded-lg h-96 border p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Settings className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-semibold">Environment Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Environment Type
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Development</option>
                  <option>Production</option>
                  <option>Testing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Allocation
                </label>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">CPU: 2 cores</span>
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Memory: 4GB</span>
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Storage: 20GB</span>
                    <span className="text-sm text-green-600">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white rounded-t-lg">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default CloudEnvironment;