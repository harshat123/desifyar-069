# Deployment Instructions for Flyer App

## Prerequisites
- Node.js (v16 or higher)
- Firebase CLI (`npm install -g firebase-tools`)
- Expo CLI (`npm install -g expo-cli`)

## Step 1: Build the Web Version

```bash
# Install dependencies
npm install

# Build the web version
npm run build
```

This will create a `web-build` directory with your compiled web app.

## Step 2: Firebase Setup

If you haven't already set up Firebase:

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project (if not already done)
firebase init
```

During initialization:
- Select "Hosting"
- Select your Firebase project or create a new one
- Use "web-build" as your public directory
- Configure as a single-page app: Yes
- Set up automatic builds and deploys with GitHub: No (unless you want to)

## Step 3: Deploy to Firebase

```bash
# Deploy to Firebase
firebase deploy
```

After deployment, you'll receive a URL where your app is hosted.

## Step 4: Verify Deployment

Open the provided URL in your browser to verify that your app is working correctly.

## Troubleshooting

### Issue: Blank screen after deployment
- Check browser console for errors
- Verify that all paths in your app are correct
- Make sure your Firebase configuration is correct

### Issue: Missing assets
- Ensure all assets are properly referenced in your code
- Check if the build process included all necessary files

### Issue: Routing issues
- Verify that the Firebase rewrite rules in firebase.json are correct
- Make sure your app's routing configuration works with Firebase hosting

## Additional Resources

- [Expo Web Documentation](https://docs.expo.dev/workflow/web/)
- [Firebase Hosting Documentation](https://firebase.google.com/docs/hosting)
- [React Native Web Documentation](https://necolas.github.io/react-native-web/)