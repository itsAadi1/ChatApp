import { useState, useEffect, useRef } from 'react';
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import UserSelection from './components/UserSelection';
import ChatInterface from './components/ChatInterface';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check localStorage for saved user on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('chatUser');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
    setLoading(false);
  }, []);

  // Set up real-time listener for messages
  useEffect(() => {
    if (!currentUser) return;

    console.log('🚀 Setting up real-time listener for user:', currentUser);
    console.log('🔧 Firebase config:', {
      projectId: 'chatapp-20737',
      apiKey: 'AIzaSyC8qkMHXtsQB_6FBFAzhTtU6wE6RBAbUuA',
      authDomain: 'chatapp-20737.firebaseapp.com'
    });
    
    // Test Firebase connection first
    console.log('🔍 Testing Firebase connection...');
    console.log('📊 Database instance:', db);
    
    const messagesRef = collection(db, 'messages');
    console.log('📝 Messages collection reference:', messagesRef);
    
    // Use timestamp field for ordering (created by serverTimestamp)
    const q = query(messagesRef, orderBy('timestamp', 'asc'));
    console.log('🔍 Query created with orderBy timestamp:', q);

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        console.log('✅ SUCCESS: Received snapshot with', snapshot.docs.length, 'messages');
        console.log('📱 Device info:', {
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString(),
          platform: navigator.platform,
          language: navigator.language
        });
        
        if (snapshot.docs.length === 0) {
          console.log('⚠️ WARNING: No messages found in database');
        }
        
        const messagesData = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log('📄 Document data:', { id: doc.id, ...data });
          
          // Ensure timestamp is properly handled and remove pending flag for synced messages
          const messageData = {
            id: doc.id,
            ...data,
            pending: false, // Messages from Firestore are synced
            // Ensure timestamp is available for display
            timestamp: data.timestamp || data.createdAt
          };
          
          return messageData;
        });
        
        console.log('💬 Final messages array:', messagesData);
        setMessages(messagesData);
        
        // Log message count for debugging
        console.log('📊 Total messages loaded:', messagesData.length);
      },
      (error) => {
        console.error('❌ CRITICAL ERROR in real-time listener:', error);
        console.error('🚨 Error details:', {
          code: error.code,
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        
        // Show user-friendly error
        alert(`Firebase Error: ${error.message}\n\nPlease check your internet connection and try refreshing the page.`);
      }
    );

    return () => {
      console.log('🔌 Unsubscribing from real-time listener');
      unsubscribe();
    };
  }, [currentUser]);

  const handleUserSelect = (user) => {
    setCurrentUser(user);
    localStorage.setItem('chatUser', user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('chatUser');
  };

  // Function to detect if a message contains a GIF URL
  const isGifUrl = (text) => {
    const gifExtensions = ['.gif', '.gifv'];
    const gifDomains = ['giphy.com', 'tenor.com', 'imgur.com', 'media.giphy.com'];
    
    // Check if text contains GIF file extensions
    const hasGifExtension = gifExtensions.some(ext => text.toLowerCase().includes(ext));
    
    // Check if text contains GIF domains
    const hasGifDomain = gifDomains.some(domain => text.toLowerCase().includes(domain));
    
    return hasGifExtension || hasGifDomain;
  };

  // Function to extract GIF URL from text
  const extractGifUrl = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlRegex);
    
    if (urls) {
      for (const url of urls) {
        if (isGifUrl(url)) {
          // Convert .gifv to .gif for better compatibility
          return url.replace('.gifv', '.gif');
        }
      }
    }
    
    return null;
  };

        const sendMessage = async (text) => {
          if (!text.trim() || !currentUser) return;

          console.log('📤 Sending message:', text, 'from user:', currentUser);

          try {
            let messageData;

            // Check if it's an image message (uploaded file)
            try {
              const imageData = JSON.parse(text);
              if (imageData.type === 'image' && imageData.imageUrl) {
                messageData = {
                  text: `📷 ${imageData.fileName || 'Image'}`,
                  sender: currentUser,
                  timestamp: serverTimestamp(),
                  edited: false,
                  isImage: true,
                  imageUrl: imageData.imageUrl,
                  fileName: imageData.fileName,
                  fileSize: imageData.fileSize,
                  fileType: imageData.fileType,
                  storagePath: imageData.storagePath,
                  pending: true // Mark as pending until synced
                };
                console.log('📷 Sending image message:', imageData.fileName);
              }
            } catch (e) {
              // Not a JSON image message, treat as regular text
            }
      
      // If not an image message, check for GIF URLs
      if (!messageData) {
        const gifUrl = extractGifUrl(text);
        const isGif = !!gifUrl;
        
        messageData = {
          text: text.trim(),
          sender: currentUser,
          timestamp: serverTimestamp(),
          edited: false,
          isGif: isGif,
          pending: true, // Mark as pending until synced
          ...(isGif && { gifUrl: gifUrl })
        };
        console.log('💬 Sending text message:', text);
      }
      
      console.log('📦 Message data to send:', messageData);
      console.log('🔗 Database reference:', db);
      
      const messagesRef = collection(db, 'messages');
      console.log('📝 Collection reference:', messagesRef);
      
      const docRef = await addDoc(messagesRef, messageData);
      console.log('✅ Message sent successfully with ID:', docRef.id);
      console.log('🎯 Document path:', docRef.path);
      
      // Verify the message was actually saved
      setTimeout(async () => {
        try {
          const verifyRef = collection(db, 'messages');
          const verifyQuery = query(verifyRef, orderBy('timestamp', 'desc'));
          const verifySnapshot = await getDocs(verifyQuery);
          console.log('🔍 Verification: Found', verifySnapshot.docs.length, 'messages in database');
        } catch (verifyError) {
          console.error('❌ Verification failed:', verifyError);
        }
      }, 1000);
      
    } catch (error) {
      console.error('❌ CRITICAL ERROR sending message:', error);
      console.error('🚨 Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      alert(`Failed to send message!\n\nError: ${error.message}\n\nPlease check your internet connection and try again.`);
    }
  };


  const editMessage = async (messageId, newText) => {
    if (!newText.trim()) return;

    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, {
        text: newText.trim(),
        edited: true,
        editedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error editing message:', error);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await deleteDoc(messageRef);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg animate-pulse">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="text-xl font-semibold text-gray-700 mb-2">Loading NoobAayush</div>
          <div className="flex items-center justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <UserSelection onUserSelect={handleUserSelect} />;
  }

        return (
          <ChatInterface
            currentUser={currentUser}
            messages={messages}
            onSendMessage={sendMessage}
            onLogout={handleLogout}
            onEditMessage={editMessage}
            onDeleteMessage={deleteMessage}
          />
        );
}

export default App;
