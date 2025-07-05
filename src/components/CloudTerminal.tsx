import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Copy, Download, RefreshCw, Settings, Maximize2, Minimize2 } from 'lucide-react';

interface CloudTerminalProps {
  labId: string;
  sessionId: string;
  timeRemaining: number;
  onSessionEnd: () => void;
}

const CloudTerminal: React.FC<CloudTerminalProps> = ({ 
  labId, 
  sessionId, 
  timeRemaining, 
  onSessionEnd 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'Welcome to Skilltrack-365 Labs Cloud Environment',
    'Session ID: ' + sessionId,
    'Lab Environment: ' + labId,
    'Type "help" for available commands',
    ''
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const terminalRef = useRef<HTMLDivElement>(null);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCommand = (command: string) => {
    const newHistory = [...terminalHistory, `user@cloud-lab:~$ ${command}`];
    
    // Simulate command responses
    switch (command.toLowerCase().trim()) {
      case 'help':
        newHistory.push('Available commands:');
        newHistory.push('  ls          - List files and directories');
        newHistory.push('  pwd         - Print working directory');
        newHistory.push('  whoami      - Display current user');
        newHistory.push('  date        - Show current date and time');
        newHistory.push('  clear       - Clear terminal screen');
        newHistory.push('  docker ps   - List running containers');
        newHistory.push('  kubectl get pods - List Kubernetes pods');
        break;
      case 'ls':
        newHistory.push('total 8');
        newHistory.push('drwxr-xr-x 2 user user 4096 Dec 15 10:30 projects');
        newHistory.push('drwxr-xr-x 2 user user 4096 Dec 15 10:30 scripts');
        newHistory.push('-rw-r--r-- 1 user user  156 Dec 15 10:30 README.md');
        break;
      case 'pwd':
        newHistory.push('/home/user');
        break;
      case 'whoami':
        newHistory.push('user');
        break;
      case 'date':
        newHistory.push(new Date().toString());
        break;
      case 'clear':
        setTerminalHistory(['']);
        return;
      case 'docker ps':
        newHistory.push('CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES');
        newHistory.push('abc123def456   nginx     "nginx"   2m ago    Up 2m     80/tcp    web-server');
        break;
      case 'kubectl get pods':
        newHistory.push('NAME                     READY   STATUS    RESTARTS   AGE');
        newHistory.push('frontend-deployment-1    1/1     Running   0          5m');
        newHistory.push('backend-deployment-2     1/1     Running   0          5m');
        break;
      default:
        if (command.trim()) {
          newHistory.push(`bash: ${command}: command not found`);
        }
    }
    
    newHistory.push('');
    setTerminalHistory(newHistory);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
      setCurrentInput('');
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onSessionEnd();
    }
  }, [timeRemaining, onSessionEnd]);

  return (
    <div className={`bg-gray-900 text-green-400 font-mono text-sm ${
      isFullscreen ? 'fixed inset-0 z-50' : 'rounded-lg'
    }`}>
      {/* Terminal Header */}
      <div className="bg-gray-800 px-4 py-2 flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <Terminal className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 text-xs">Cloud Terminal - {sessionId}</span>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="text-xs text-gray-300">
            Time: {formatTime(timeRemaining)}
          </div>
          <button className="text-gray-400 hover:text-white">
            <Copy className="w-4 h-4" />
          </button>
          <button className="text-gray-400 hover:text-white">
            <Download className="w-4 h-4" />
          </button>
          <button className="text-gray-400 hover:text-white">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="text-gray-400 hover:text-white">
            <Settings className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="text-gray-400 hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className={`p-4 overflow-y-auto ${isFullscreen ? 'h-screen' : 'h-96'}`}
      >
        {terminalHistory.map((line, index) => (
          <div key={index} className="mb-1">
            {line}
          </div>
        ))}
        
        {/* Current Input Line */}
        <div className="flex items-center">
          <span className="text-blue-400">user@cloud-lab:~$</span>
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="ml-2 bg-transparent border-none outline-none flex-1 text-green-400"
            autoFocus
          />
          <span className="bg-green-400 w-2 h-4 animate-pulse ml-1"></span>
        </div>
      </div>
    </div>
  );
};

export default CloudTerminal;