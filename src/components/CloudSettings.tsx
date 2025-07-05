import React, { useState } from 'react';
import { Settings, Save, RotateCcw, Download, Upload, Server, Cpu, HardDrive, Network, Shield } from 'lucide-react';

interface CloudSettingsProps {
  labId: string;
  sessionId: string;
}

const CloudSettings: React.FC<CloudSettingsProps> = ({ labId, sessionId }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    environment: 'development',
    autoSave: true,
    theme: 'light',
    fontSize: 14,
    cpu: 2,
    memory: 4,
    storage: 20,
    network: 'standard'
  });

  const tabs = [
    { id: 'general', name: 'General', icon: Settings },
    { id: 'resources', name: 'Resources', icon: Server },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'backup', name: 'Backup', icon: Download }
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Simulate saving settings
    console.log('Settings saved:', settings);
  };

  const handleReset = () => {
    setSettings({
      environment: 'development',
      autoSave: true,
      theme: 'light',
      fontSize: 14,
      cpu: 2,
      memory: 4,
      storage: 20,
      network: 'standard'
    });
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Environment Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Environment Type
            </label>
            <select
              value={settings.environment}
              onChange={(e) => handleSettingChange('environment', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={settings.theme}
              onChange={(e) => handleSettingChange('theme', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Font Size
            </label>
            <input
              type="range"
              min="10"
              max="20"
              value={settings.fontSize}
              onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>10px</span>
              <span>{settings.fontSize}px</span>
              <span>20px</span>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="autoSave"
              checked={settings.autoSave}
              onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="autoSave" className="ml-2 block text-sm text-gray-900">
              Enable auto-save
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResourceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Allocation</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CPU Cores
            </label>
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="1"
                max="8"
                value={settings.cpu}
                onChange={(e) => handleSettingChange('cpu', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-900 w-8">{settings.cpu}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Memory (GB)
            </label>
            <div className="flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="1"
                max="16"
                value={settings.memory}
                onChange={(e) => handleSettingChange('memory', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-900 w-8">{settings.memory}GB</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Storage (GB)
            </label>
            <div className="flex items-center space-x-2">
              <HardDrive className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="10"
                max="100"
                value={settings.storage}
                onChange={(e) => handleSettingChange('storage', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm font-medium text-gray-900 w-12">{settings.storage}GB</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Network Type
            </label>
            <select
              value={settings.network}
              onChange={(e) => handleSettingChange('network', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="standard">Standard</option>
              <option value="enhanced">Enhanced</option>
              <option value="premium">Premium</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Current Usage</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>CPU Usage:</span>
            <span className="text-green-600">45%</span>
          </div>
          <div className="flex justify-between">
            <span>Memory Usage:</span>
            <span className="text-yellow-600">62%</span>
          </div>
          <div className="flex justify-between">
            <span>Storage Usage:</span>
            <span className="text-blue-600">28%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Configuration</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Firewall</h4>
              <p className="text-sm text-gray-500">Protect your environment from unauthorized access</p>
            </div>
            <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">
              Enabled
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">SSL/TLS</h4>
              <p className="text-sm text-gray-500">Encrypt data in transit</p>
            </div>
            <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">
              Enabled
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Access Control</h4>
              <p className="text-sm text-gray-500">Manage user permissions and access</p>
            </div>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
              Configure
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Audit Logging</h4>
              <p className="text-sm text-gray-500">Track all activities and changes</p>
            </div>
            <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm">
              Disabled
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Backup & Recovery</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Automatic Backups</h4>
              <p className="text-sm text-gray-500">Daily backups at 2:00 AM UTC</p>
            </div>
            <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">
              Enabled
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Manual Backup</h4>
              <p className="text-sm text-gray-500">Create a backup of your current environment</p>
            </div>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
              Create Backup
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Restore Point</h4>
              <p className="text-sm text-gray-500">Restore from a previous backup</p>
            </div>
            <button className="bg-yellow-600 text-white px-3 py-1 rounded text-sm">
              Restore
            </button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Backups</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>2024-01-15 02:00 UTC</span>
                <span className="text-green-600">Success</span>
              </div>
              <div className="flex justify-between">
                <span>2024-01-14 02:00 UTC</span>
                <span className="text-green-600">Success</span>
              </div>
              <div className="flex justify-between">
                <span>2024-01-13 02:00 UTC</span>
                <span className="text-green-600">Success</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'resources':
        return renderResourceSettings();
      case 'security':
        return renderSecuritySettings();
      case 'backup':
        return renderBackupSettings();
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex bg-white">
      {/* Settings Sidebar */}
      <div className="w-64 border-r border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Settings</h3>
          </div>
        </div>
        
        <div className="p-4">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm flex items-center space-x-2 ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {tabs.find(t => t.id === activeTab)?.name} Settings
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleReset}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CloudSettings; 