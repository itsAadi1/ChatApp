import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import ConnectionStatus from './ConnectionStatus';
import OfflineBanner from './OfflineBanner';

const ChatInterface = ({ currentUser, messages, onSendMessage, onLogout, onEditMessage, onDeleteMessage }) => {
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Also scroll when component mounts with existing messages
  useEffect(() => {
    if (messages.length > 0 && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, []);

  const handleSendMessage = (text) => {
    onSendMessage(text);
    setIsTyping(false);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Offline Banner */}
      <OfflineBanner />
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
                 <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg ${
                   currentUser === 'He' 
                     ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                     : 'bg-gradient-to-br from-pink-500 to-pink-600'
                 }`}>
                   {currentUser === 'He' ? 'H' : 'S'}
                 </div>
                 <div>
                   <h1 className="text-lg sm:text-xl font-bold text-gray-800">
                     {currentUser === 'He' ? 'He' : 'She'}
                   </h1>
                   <ConnectionStatus />
                 </div>
        </div>
        
        <button
          onClick={onLogout}
          className="px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 touch-manipulation"
        >
          <div className="flex items-center space-x-1 sm:space-x-2">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </div>
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-12 sm:mt-16">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-3xl mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No messages yet</p>
            <p className="text-sm sm:text-base text-gray-500">Start the conversation below!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.sender === currentUser}
              timestamp={formatTime(message.timestamp)}
              onEdit={onEditMessage}
              onDelete={onDeleteMessage}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 px-4 sm:px-6 py-3 sm:py-4">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

export default ChatInterface;
