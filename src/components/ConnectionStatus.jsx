import { useState, useEffect } from 'react';

const ConnectionStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSeen, setLastSeen] = useState(new Date());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastSeen(new Date());
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Update last seen every 30 seconds when online
    const interval = setInterval(() => {
      if (navigator.onLine) {
        setLastSeen(new Date());
      }
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex items-center space-x-2 text-xs">
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
      <span className={`font-medium ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
        {isOnline ? 'Connected' : 'Offline'}
      </span>
      {isOnline && (
        <span className="text-gray-500">
          • {lastSeen.toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default ConnectionStatus;
