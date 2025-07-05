import React, { useState, useRef, useEffect } from 'react';
import { 
  Save, 
  Play, 
  Folder, 
  File, 
  Settings, 
  Search, 
  GitBranch, 
  Terminal,
  ChevronDown,
  ChevronRight,
  X,
  Plus
} from 'lucide-react';

interface CloudCodeEditorProps {
  labId: string;
  sessionId: string;
}

interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  language?: string;
  children?: FileNode[];
  isOpen?: boolean;
}

const CloudCodeEditor: React.FC<CloudCodeEditorProps> = ({ labId, sessionId }) => {
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [files, setFiles] = useState<FileNode[]>([
    {
      id: '1',
      name: 'project',
      type: 'folder',
      isOpen: true,
      children: [
        {
          id: '2',
          name: 'src',
          type: 'folder',
          isOpen: true,
          children: [
            {
              id: '3',
              name: 'app.js',
              type: 'file',
              language: 'javascript',
              content: `// Welcome to your cloud development environment!

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'Hello from the cloud!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

app.listen(port, () => {
  console.log(\`Server running on port \${port}\`);
});`
            },
            {
              id: '4',
              name: 'package.json',
              type: 'file',
              language: 'json',
              content: `{
  "name": "cloud-lab-app",
  "version": "1.0.0",
  "description": "Sample application for cloud lab",
  "main": "src/app.js",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.5.0"
  }
}`
            }
          ]
        },
        {
          id: '5',
          name: 'README.md',
          type: 'file',
          language: 'markdown',
          content: `# Cloud Lab Application

This is a sample application for the cloud lab environment.

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

3. Open your browser to \`http://localhost:3000\`

## Features

- Express.js backend
- RESTful API endpoints
- Health check endpoint
- Environment configuration

## API Endpoints

- \`GET /\` - Welcome message
- \`GET /health\` - Health check
`
        }
      ]
    }
  ]);
  const [editorContent, setEditorContent] = useState('');
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (activeFile) {
      const file = findFile(files, activeFile);
      if (file && file.content) {
        setEditorContent(file.content);
      }
    }
  }, [activeFile, files]);

  const findFile = (nodes: FileNode[], id: string): FileNode | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findFile(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const updateFileContent = (fileId: string, content: string) => {
    const updateNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === fileId) {
          return { ...node, content };
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };
    setFiles(updateNode(files));
  };

  const toggleFolder = (folderId: string) => {
    const updateNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map(node => {
        if (node.id === folderId) {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) };
        }
        return node;
      });
    };
    setFiles(updateNode(files));
  };

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map(node => (
      <div key={node.id}>
        <div
          className={`flex items-center px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 ${
            activeFile === node.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (node.type === 'folder') {
              toggleFolder(node.id);
            } else {
              setActiveFile(node.id);
            }
          }}
        >
          {node.type === 'folder' ? (
            <>
              {node.isOpen ? (
                <ChevronDown className="w-3 h-3 mr-1" />
              ) : (
                <ChevronRight className="w-3 h-3 mr-1" />
              )}
              <Folder className="w-4 h-4 mr-2 text-blue-500" />
            </>
          ) : (
            <File className="w-4 h-4 mr-2 text-gray-500" />
          )}
          <span>{node.name}</span>
        </div>
        {node.type === 'folder' && node.isOpen && node.children && (
          <div>{renderFileTree(node.children, level + 1)}</div>
        )}
      </div>
    ));
  };

  const handleSave = () => {
    if (activeFile) {
      updateFileContent(activeFile, editorContent);
      setTerminalOutput(prev => [...prev, `File saved: ${findFile(files, activeFile)?.name}`]);
    }
  };

  const handleRun = () => {
    setTerminalOutput(prev => [
      ...prev,
      'Starting application...',
      'npm run dev',
      '> cloud-lab-app@1.0.0 dev',
      '> nodemon src/app.js',
      '',
      '[nodemon] 3.0.1',
      '[nodemon] to restart at any time, enter `rs`',
      '[nodemon] watching path(s): *.*',
      '[nodemon] watching extensions: js,mjs,cjs,json',
      '[nodemon] starting `node src/app.js`',
      'Server running on port 3000',
      ''
    ]);
  };

  const handleTerminalCommand = (command: string) => {
    setTerminalOutput(prev => [...prev, `$ ${command}`]);
    
    switch (command.toLowerCase().trim()) {
      case 'npm install':
        setTerminalOutput(prev => [
          ...prev,
          'added 156 packages, and audited 157 packages in 1s',
          'found 0 vulnerabilities',
          ''
        ]);
        break;
      case 'npm run dev':
        handleRun();
        break;
      case 'clear':
        setTerminalOutput([]);
        break;
      default:
        setTerminalOutput(prev => [...prev, `Command not found: ${command}`, '']);
    }
    setCurrentCommand('');
  };

  const getLanguageClass = (language?: string) => {
    switch (language) {
      case 'javascript':
        return 'language-javascript';
      case 'json':
        return 'language-json';
      case 'markdown':
        return 'language-markdown';
      default:
        return '';
    }
  };

  return (
    <div className="h-full flex bg-white">
      {/* File Explorer */}
      <div className="w-64 border-r border-gray-200 bg-gray-50">
        <div className="p-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">EXPLORER</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto h-full">
          {renderFileTree(files)}
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Editor Toolbar */}
        <div className="border-b border-gray-200 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button
              onClick={handleRun}
              className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              <Play className="w-4 h-4" />
              <span>Run</span>
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Search className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <GitBranch className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowTerminal(!showTerminal)}
              className={`p-1 rounded ${
                showTerminal ? 'bg-gray-200 text-gray-700' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Terminal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex">
          <div className="flex-1 p-4">
            {activeFile ? (
              <textarea
                ref={editorRef}
                value={editorContent}
                onChange={(e) => setEditorContent(e.target.value)}
                className={`w-full h-full p-4 font-mono text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${getLanguageClass(findFile(files, activeFile)?.language)}`}
                placeholder="Start coding..."
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <File className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Select a file to start editing</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Terminal */}
        {showTerminal && (
          <div className="h-48 border-t border-gray-200 bg-gray-900 text-green-400">
            <div className="px-4 py-2 border-b border-gray-700 flex items-center justify-between">
              <span className="text-sm font-medium">TERMINAL</span>
              <button
                onClick={() => setShowTerminal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 h-32 overflow-y-auto font-mono text-sm">
              {terminalOutput.map((line, index) => (
                <div key={index} className="mb-1">{line}</div>
              ))}
              <div className="flex items-center">
                <span className="text-blue-400">$</span>
                <input
                  type="text"
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleTerminalCommand(currentCommand);
                    }
                  }}
                  className="ml-2 bg-transparent border-none outline-none flex-1 text-green-400"
                  autoFocus
                />
                <span className="bg-green-400 w-2 h-4 animate-pulse ml-1"></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CloudCodeEditor; 