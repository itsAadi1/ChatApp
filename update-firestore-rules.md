# Fix Firestore Security Rules

## The Problem
Messages work on the same device but don't sync between devices because Firestore security rules are too restrictive.

## The Solution
Update Firestore security rules to allow read/write access for all users.

## Steps to Fix:

### 1. Go to Firebase Console
Visit: https://console.firebase.google.com/project/chatapp-20737/firestore/rules

### 2. Replace the current rules with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{document} {
      allow read, write: if true;
    }
  }
}
```

### 3. Click "Publish" to save the rules

### 4. Test the app
- Open https://chatapp-20737.web.app on two different devices
- Login with different accounts (Aadarsh and Girlfriend)
- Send messages from one device
- Check if they appear on the other device

## Alternative: Use Firebase CLI
If you prefer command line:
```bash
firebase deploy --only firestore:rules
```

## What This Does
- Allows anyone to read and write to the messages collection
- Enables real-time synchronization between devices
- Fixes the cross-device messaging issue
