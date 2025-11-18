import { useState } from 'react';
import PasswordInput from './PasswordInput';

const UserSelection = ({ onUserSelect }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowPasswordInput(true);
  };

  const handlePasswordCorrect = () => {
    onUserSelect(selectedUser);
  };

  const handleBack = () => {
    setSelectedUser(null);
    setShowPasswordInput(false);
  };

  if (showPasswordInput) {
    return (
      <PasswordInput
        user={selectedUser}
        onPasswordCorrect={handlePasswordCorrect}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-10 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 sm:mb-6 flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            NoobAayush
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-medium">Select your identity to continue</p>
        </div>
        
        {/* User Selection Buttons */}
        <div className="space-y-4 mb-6 sm:mb-8">
          <button
            onClick={() => handleUserClick('He')}
            className={`w-full p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 touch-manipulation ${
              selectedUser === 'He'
                ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 shadow-lg'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 text-gray-700 hover:text-blue-800 hover:shadow-md'
            }`}
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
                H
              </div>
              <div className="text-left">
                <div className="text-lg sm:text-xl font-semibold">He</div>
                <div className="text-xs sm:text-sm opacity-75">Primary User</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleUserClick('She')}
            className={`w-full p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 touch-manipulation ${
              selectedUser === 'She'
                ? 'border-pink-500 bg-gradient-to-r from-pink-50 to-pink-100 text-pink-800 shadow-lg'
                : 'border-gray-200 hover:border-pink-300 hover:bg-gradient-to-r hover:from-pink-50 hover:to-pink-100 text-gray-700 hover:text-pink-800 hover:shadow-md'
            }`}
          >
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
                S
              </div>
              <div className="text-left">
                <div className="text-lg sm:text-xl font-semibold">She</div>
                <div className="text-xs sm:text-sm opacity-75">Secondary User</div>
              </div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Password protected for security</span>
          </div>
          <p className="text-xs text-gray-400">
            Your choice will be remembered for next time
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSelection;
