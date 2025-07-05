import React, { useState, useEffect } from 'react';
import { Clock, Play, Pause, Square, AlertTriangle, CheckCircle } from 'lucide-react';

interface SessionManagerProps {
  labId: string;
  duration: number; // in minutes
  onSessionStart: (sessionId: string) => void;
  onSessionEnd: () => void;
}

const SessionManager: React.FC<SessionManagerProps> = ({
  labId,
  duration,
  onSessionStart,
  onSessionEnd
}) => {
  const [sessionState, setSessionState] = useState<'idle' | 'starting' | 'active' | 'paused' | 'ended'>('idle');
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // Convert to seconds
  const [sessionId, setSessionId] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (sessionState === 'active' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setSessionState('ended');
            onSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionState, timeRemaining, onSessionEnd]);

  const startSession = () => {
    setSessionState('starting');
    const newSessionId = `lab-${labId}-${Date.now()}`;
    setSessionId(newSessionId);
    
    // Simulate session initialization
    setTimeout(() => {
      setSessionState('active');
      onSessionStart(newSessionId);
    }, 3000);
  };

  const pauseSession = () => {
    setSessionState('paused');
  };

  const resumeSession = () => {
    setSessionState('active');
  };

  const endSession = () => {
    setSessionState('ended');
    onSessionEnd();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const percentage = (timeRemaining / (duration * 60)) * 100;
    if (percentage > 50) return 'text-green-500';
    if (percentage > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Lab Session</h3>
        <div className={`flex items-center text-2xl font-mono font-bold ${getTimeColor()}`}>
          <Clock className="w-5 h-5 mr-2" />
          {formatTime(timeRemaining)}
        </div>
      </div>

      {sessionState === 'idle' && (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Ready to start your lab session?</p>
          <button
            onClick={startSession}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center mx-auto"
          >
            <Play className="w-5 h-5 mr-2" />
            Start Lab Session
          </button>
        </div>
      )}

      {sessionState === 'starting' && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing cloud environment...</p>
          <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
        </div>
      )}

      {(sessionState === 'active' || sessionState === 'paused') && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                sessionState === 'active' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'
              }`}></div>
              <span className="text-sm font-medium text-gray-700">
                Session ID: {sessionId}
              </span>
            </div>
            <div className="flex space-x-2">
              {sessionState === 'active' ? (
                <button
                  onClick={pauseSession}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm flex items-center"
                >
                  <Pause className="w-4 h-4 mr-1" />
                  Pause
                </button>
              ) : (
                <button
                  onClick={resumeSession}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Resume
                </button>
              )}
              <button
                onClick={endSession}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center"
              >
                <Square className="w-4 h-4 mr-1" />
                End
              </button>
            </div>
          </div>

          {timeRemaining < 300 && ( // 5 minutes warning
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800 text-sm font-medium">
                  Session ending soon! Save your work.
                </span>
              </div>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{Math.round(((duration * 60 - timeRemaining) / (duration * 60)) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((duration * 60 - timeRemaining) / (duration * 60)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {sessionState === 'ended' && (
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Session Completed</h4>
          <p className="text-gray-600 mb-4">Your lab session has ended. Great work!</p>
          <button
            onClick={() => {
              setSessionState('idle');
              setTimeRemaining(duration * 60);
              setSessionId('');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Start New Session
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionManager;