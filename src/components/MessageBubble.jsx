import { useState } from 'react';

const MessageBubble = ({ message, isOwn, timestamp, onEdit, onDelete }) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.text);

  const handleEdit = () => {
    setIsEditing(true);
    setShowActions(false);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== message.text) {
      onEdit(message.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditText(message.text);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      onDelete(message.id);
    }
    setShowActions(false);
  };

  if (isEditing) {
    return (
      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className={`max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-sm border-2 ${
          isOwn 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-lg border-blue-400' 
            : 'bg-white text-gray-800 rounded-bl-lg border-gray-300'
        }`}>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className={`w-full bg-transparent border-none outline-none resize-none text-sm leading-relaxed ${
              isOwn ? 'text-white placeholder-blue-200' : 'text-gray-800 placeholder-gray-500'
            }`}
            rows="2"
            autoFocus
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={handleCancelEdit}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                isOwn 
                  ? 'text-blue-200 hover:text-white hover:bg-blue-400' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                isOwn 
                  ? 'bg-blue-400 text-white hover:bg-blue-300' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2 group`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="relative">
        <div className={`max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 sm:px-5 py-3 rounded-2xl shadow-sm ${
          isOwn 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-lg' 
            : 'bg-white text-gray-800 rounded-bl-lg border border-gray-200/50'
        } ${message.pending ? 'opacity-60' : ''}`}>
          {/* Check if message is an image (uploaded file) */}
          {message.isImage ? (
            <div className="space-y-2">
              <img
                src={message.imageUrl}
                alt={message.fileName || 'Image'}
                className="w-full max-w-xs rounded-lg shadow-sm"
                loading="lazy"
              />
              <p className="text-sm sm:text-base leading-relaxed break-words font-medium">
                {message.text}
              </p>
            </div>
          ) : message.isGif ? (
            <div className="space-y-2">
              <img
                src={message.gifUrl}
                alt={message.text || 'GIF'}
                className="w-full max-w-xs rounded-lg shadow-sm"
                loading="lazy"
              />
              {message.text && (
                <p className="text-sm sm:text-base leading-relaxed break-words font-medium">
                  {message.text}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm sm:text-base leading-relaxed break-words font-medium">
              {message.text}
            </p>
          )}
          <p className={`text-xs mt-2 font-medium ${
            isOwn ? 'text-blue-100' : 'text-gray-500'
          }`}>
            {timestamp}
            {message.pending && (
              <span className="ml-1 opacity-75">⏳</span>
            )}
            {message.edited && (
              <span className="ml-1 opacity-75">(edited)</span>
            )}
            {message.isImage && (
              <span className="ml-1 opacity-75">📷</span>
            )}
            {message.isGif && (
              <span className="ml-1 opacity-75">🎬</span>
            )}
          </p>
        </div>
        
        {/* Message Actions - Mobile Optimized */}
        {isOwn && (
          <div className={`absolute top-0 ${isOwn ? 'right-full mr-2' : 'left-full ml-2'} flex items-center space-x-1 transition-opacity duration-200 ${
            showActions ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={handleEdit}
              className="p-2 sm:p-2.5 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation"
              title="Edit message"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-2 sm:p-2.5 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 active:bg-red-100 transition-colors touch-manipulation"
              title="Delete message"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
