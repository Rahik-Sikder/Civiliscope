import React, { useState } from 'react';
import { debugApiCall, testNetworkAndCors } from './testApiCall';
import { useSenators } from '../hooks/useSenators';

export const DebugPage: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Also test the actual hook
  const { data: senatorsData, error: senatorsError, isLoading: senatorsLoading } = useSenators();

  const runTests = async () => {
    setIsRunning(true);
    setLogs([]);
    
    // Capture console.log output
    const originalLog = console.log;
    const originalError = console.error;
    const capturedLogs: string[] = [];
    
    console.log = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      capturedLogs.push(`[LOG] ${message}`);
      originalLog(...args);
    };
    
    console.error = (...args) => {
      const message = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      capturedLogs.push(`[ERROR] ${message}`);
      originalError(...args);
    };

    try {
      await debugApiCall();
      await testNetworkAndCors();
    } catch (error) {
      capturedLogs.push(`[FATAL ERROR] ${error}`);
    }
    
    // Restore original console methods
    console.log = originalLog;
    console.error = originalError;
    
    setLogs(capturedLogs);
    setIsRunning(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">API Debug Page</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow p-4 border">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Manual Tests</h2>
          <button 
            onClick={runTests}
            disabled={isRunning}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isRunning ? 'Running Tests...' : 'Run API Debug Tests'}
          </button>
          
          {logs.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Test Results:</h3>
              <div className="bg-gray-100 p-3 rounded text-sm font-mono max-h-96 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index} className={`mb-1 ${log.includes('[ERROR]') || log.includes('[FATAL ERROR]') ? 'text-red-600' : 'text-gray-800'}`}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hook Status */}
        <div className="bg-white rounded-lg shadow p-4 border">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">useSenators Hook Status</h2>
          
          <div className="space-y-2">
            <div>
              <span className="font-medium text-gray-700">Loading: </span>
              <span className={`px-2 py-1 rounded text-sm ${senatorsLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {senatorsLoading ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Error: </span>
              {senatorsError ? (
                <div className="bg-red-100 text-red-800 p-2 rounded text-sm mt-1">
                  <pre>{JSON.stringify(senatorsError, null, 2)}</pre>
                </div>
              ) : (
                <span className="px-2 py-1 rounded text-sm bg-green-100 text-green-800">None</span>
              )}
            </div>
            
            <div>
              <span className="font-medium text-gray-700">Data: </span>
              {senatorsData ? (
                <div className="bg-blue-100 text-blue-800 p-2 rounded text-sm mt-1">
                  <div>Count: {senatorsData.length}</div>
                  {senatorsData.length > 0 && (
                    <details className="mt-2">
                      <summary className="cursor-pointer">First Senator</summary>
                      <pre className="mt-1 text-xs">{JSON.stringify(senatorsData[0], null, 2)}</pre>
                    </details>
                  )}
                </div>
              ) : (
                <span className="px-2 py-1 rounded text-sm bg-gray-100 text-gray-800">None</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Environment Info */}
      <div className="mt-6 bg-white rounded-lg shadow p-4 border">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Environment Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-700">API Base URL: </span>
            <code className="bg-gray-400 px-2 py-1 rounded">{import.meta.env.VITE_API_BASE_URL}</code>
          </div>
          <div>
            <span className="font-medium text-gray-700">Full Senators URL: </span>
            <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">{import.meta.env.VITE_API_BASE_URL}api/senators/</code>
          </div>
          <div>
            <span className="font-medium text-gray-700">Dev Mode: </span>
            <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">{import.meta.env.DEV ? 'Yes' : 'No'}</code>
          </div>
          <div>
            <span className="font-medium text-gray-700">Mode: </span>
            <code className="bg-gray-100 px-2 py-1 rounded text-gray-800">{import.meta.env.MODE}</code>
          </div>
        </div>
      </div>
    </div>
  );
};