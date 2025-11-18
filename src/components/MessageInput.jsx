import { useState, useRef } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Handle file uploads to Firebase Storage
  const handleFileUpload = async (file) => {
    if (!file) return;

    // Check if it's an image file
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (GIF, PNG, JPG, etc.)');
      return;
    }

    setIsUploading(true);

    try {
      // Create a unique filename with timestamp
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      
      // Create a reference to the file in Firebase Storage
      const storageRef = ref(storage, `images/${fileName}`);
      
      // Upload the file
      console.log('📤 Uploading file to Firebase Storage:', fileName);
      const snapshot = await uploadBytes(storageRef, file);
      console.log('✅ File uploaded successfully:', snapshot);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('🔗 Download URL:', downloadURL);
      
      // Send the image as a message with Firebase Storage URL
      const imageMessage = {
        type: 'image',
        imageUrl: downloadURL,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        storagePath: snapshot.ref.fullPath
      };

      onSendMessage(JSON.stringify(imageMessage));
      setIsUploading(false);
    } catch (error) {
      console.error('❌ Error uploading file to Firebase Storage:', error);
      alert('Error uploading file. Please try again.');
      setIsUploading(false);
    }
  };

  // Handle paste events (for mobile keyboard GIFs)
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      // Check if pasted item is a file
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file && file.type.startsWith('image/')) {
          e.preventDefault();
          handleFileUpload(file);
          return;
        }
      }
    }
  };

  // Handle file input change
  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle photo button click
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-3 sm:space-x-4">
      <div className="flex-1 relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          onPaste={handlePaste}
          placeholder={isUploading ? "Uploading..." : "Type a message or paste GIF URL..."}
          className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500 bg-white/80 backdrop-blur-sm text-sm sm:text-base"
          disabled={isUploading}
        />
        
        {/* Hidden file input for mobile keyboard GIFs */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
        
        {/* Upload indicator */}
        {isUploading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {/* Photo Button */}
      <button
        type="button"
        onClick={handlePhotoClick}
        disabled={isUploading}
        className={`px-3 sm:px-4 py-3 sm:py-4 rounded-2xl transition-all duration-200 shadow-lg touch-manipulation ${
          !isUploading
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 hover:shadow-xl active:scale-95'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
        title="Add Photo"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>
      
      <button
        type="submit"
        disabled={!message.trim() || isUploading}
        className={`px-4 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition-all duration-200 shadow-lg touch-manipulation ${
          message.trim() && !isUploading
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 hover:shadow-xl active:scale-95'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        <div className="flex items-center space-x-1 sm:space-x-2">
          {isUploading ? (
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
          <span className="hidden sm:inline">{isUploading ? 'Uploading...' : 'Send'}</span>
        </div>
      </button>
    </form>
  );
};

export default MessageInput;
