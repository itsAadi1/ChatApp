# Private Chat App

A simple, private chat application built with React, Firebase Firestore, and Tailwind CSS. Features a simple two-user login system without Firebase Authentication.

## Features

- 🚀 **Simple Login**: Just two buttons - "I am Aadarsh" or "I am Girlfriend"
- 💾 **Persistent Login**: Remembers your choice using localStorage
- 💬 **Real-time Chat**: Messages sync instantly using Firebase Firestore
- 📱 **Responsive Design**: Works great on both desktop and mobile
- 🎨 **WhatsApp-style UI**: Different colored message bubbles for each user
- ⏰ **Timestamps**: Shows time under each message (HH:mm format)
- 🔄 **Auto-scroll**: Automatically scrolls to latest messages
- 🚪 **Logout**: Clear localStorage and return to user selection

## Tech Stack

- **Frontend**: React 18 with functional components
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Build Tool**: Vite
- **Real-time**: Firebase Firestore real-time listeners

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name (e.g., "private-chat-app")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firestore Database

1. In your Firebase project, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database (choose closest to your users)
5. Click "Done"

### 3. Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>` to add a web app
5. Enter app nickname (e.g., "chat-app")
6. Click "Register app"
7. Copy the `firebaseConfig` object

### 4. Configure the App

1. Open `src/firebase.js` in your project
2. Replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

### 5. Install Dependencies and Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## Deployment to Firebase Hosting

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Initialize Firebase Hosting

```bash
firebase init hosting
```

When prompted:
- Select your Firebase project
- Set public directory to `dist` (Vite's build output)
- Configure as single-page app: `Yes`
- Overwrite index.html: `No`

### 4. Build and Deploy

```bash
# Build the app
npm run build

# Deploy to Firebase Hosting
firebase deploy
```

Your app will be available at: `https://your-project-id.web.app`

## Project Structure

```
src/
├── components/
│   ├── UserSelection.jsx    # Login screen with user buttons
│   ├── ChatInterface.jsx    # Main chat container
│   ├── MessageBubble.jsx    # Individual message component
│   └── MessageInput.jsx     # Message input form
├── firebase.js              # Firebase configuration
├── App.jsx                  # Main app component
└── index.css                # Tailwind CSS imports
```

## Firestore Database Structure

The app uses a simple collection structure:

```
messages/
├── {messageId}/
│   ├── text: string
│   ├── sender: string ("Aadarsh" or "Girlfriend")
│   └── timestamp: serverTimestamp
```

## Security Rules (Optional)

For production, consider updating your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{document} {
      allow read, write: if true; // Allow all for simplicity
    }
  }
}
```

## Customization

### Adding More Users

To add more users, modify the `UserSelection.jsx` component:

1. Add new buttons in the component
2. Update the user selection logic
3. Adjust styling in `ChatInterface.jsx` and `MessageBubble.jsx`

### Changing Colors

The app uses Tailwind CSS classes. Main color schemes:
- **Aadarsh**: Blue theme (`bg-blue-500`, `text-blue-700`)
- **Girlfriend**: Pink theme (`bg-pink-500`, `text-pink-700`)

### Styling Messages

Modify `MessageBubble.jsx` to change:
- Message bubble appearance
- Timestamp format
- Spacing and layout

## Troubleshooting

### Common Issues

1. **Firebase config not working**: Make sure you copied the complete config object
2. **Messages not appearing**: Check Firestore security rules and network connection
3. **Build errors**: Ensure all dependencies are installed with `npm install`

### Development Tips

- Use browser dev tools to check for console errors
- Verify Firebase project settings match your config
- Test on different devices for responsive design

## License

This project is open source and available under the MIT License.