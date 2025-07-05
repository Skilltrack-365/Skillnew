import React, { useState } from 'react';
import { 
  FileText, 
  Folder, 
  Download, 
  Upload, 
  Trash2, 
  Edit, 
  Copy, 
  MoreVertical,
  Search,
  Grid,
  List,
  Plus
} from 'lucide-react';

interface CloudFileManagerProps {
  labId: string;
  sessionId: string;
}

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
  icon?: string;
}

const CloudFileManager: React.FC<CloudFileManagerProps> = ({ labId, sessionId }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPath, setCurrentPath] = useState('/home/user');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const files: FileItem[] = [
    { id: '1', name: 'Documents', type: 'folder', modified: '2024-01-15 10:30', icon: '📁' },
    { id: '2', name: 'Downloads', type: 'folder', modified: '2024-01-15 09:15', icon: '📁' },
    { id: '3', name: 'Pictures', type: 'folder', modified: '2024-01-14 16:45', icon: '📁' },
    { id: '4', name: 'README.md', type: 'file', size: '2.3 KB', modified: '2024-01-15 11:20', icon: '📄' },
    { id: '5', name: 'app.js', type: 'file', size: '15.7 KB', modified: '2024-01-15 10:45', icon: '📄' },
    { id: '6', name: 'package.json', type: 'file', size: '1.2 KB', modified: '2024-01-15 10:30', icon: '📄' },
    { id: '7', name: 'docker-compose.yml', type: 'file', size: '3.1 KB', modified: '2024-01-15 09:30', icon: '📄' },
    { id: '8', name: 'config.env', type: 'file', size: '0.5 KB', modified: '2024-01-15 08:15', icon: '📄' }
  ];

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleFileDoubleClick = (file: FileItem) => {
    if (file.type === 'folder') {
      setCurrentPath(prev => `${prev}/${file.name}`);
    }
  };

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') {
      return <Folder className="w-5 h-5 text-blue-500" />;
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
        return <FileText className="w-5 h-5 text-yellow-500" />;
      case 'json':
        return <FileText className="w-5 h-5 text-green-500" />;
      case 'md':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'yml':
      case 'yaml':
        return <FileText className="w-5 h-5 text-purple-500" />;
      case 'env':
        return <FileText className="w-5 h-5 text-red-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <Upload className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <Copy className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              <Plus className="w-4 h-4" />
              <span>New</span>
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-6 py-2 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2 text-sm">
          {currentPath.split('/').map((segment, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span className="text-gray-400">/</span>}
              <button
                onClick={() => {
                  const newPath = currentPath.split('/').slice(0, index + 1).join('/');
                  setCurrentPath(newPath);
                }}
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {segment || 'home'}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto p-6">
        {viewMode === 'list' ? (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modified
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFiles.map((file) => (
                  <tr 
                    key={file.id}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      selectedFiles.includes(file.id) ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleFileSelect(file.id)}
                    onDoubleClick={() => handleFileDoubleClick(file)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file)}
                        <span className="text-sm font-medium text-gray-900">{file.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {file.size || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {file.modified}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedFiles.includes(file.id) ? 'bg-blue-50 border-blue-300' : ''
                }`}
                onClick={() => handleFileSelect(file.id)}
                onDoubleClick={() => handleFileDoubleClick(file)}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    {getFileIcon(file)}
                  </div>
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{file.size || 'Folder'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-200 px-6 py-2 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{filteredFiles.length} items</span>
          <span>{selectedFiles.length} selected</span>
        </div>
      </div>
    </div>
  );
};

export default CloudFileManager; 