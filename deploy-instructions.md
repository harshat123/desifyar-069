# Firebase Deployment Instructions

This document provides step-by-step instructions for deploying the Flyer App to Firebase Hosting.

## Prerequisites

1. Make sure you have Firebase CLI installed:
   ```
   npm install -g firebase-tools
   ```

2. Make sure you're logged in to Firebase:
   ```
   firebase login
   ```

3. If you haven't initialized Firebase in your project yet:
   ```
   firebase init
   ```
   - Select "Hosting" when prompted
   - Select your Firebase project or create a new one
   - Use "web-build" as your public directory
   - Configure as a single-page app: Yes
   - Set up automatic builds and deploys with GitHub: No (unless you want to)

## Deployment Steps

1. Build your Expo web app:
   ```
   npm run build
   ```
   This will create a `web-build` directory with your compiled web app.

2. Deploy to Firebase Hosting:
   ```
   npm run deploy
   ```
   Or you can run both commands in sequence:
   ```
   npm run build-and-deploy
   ```

3. After deployment completes, Firebase will provide a URL where your app is hosted.

## Troubleshooting

- If you encounter any issues with React version compatibility, check the package.json file. The app is configured to use React 18.2.0 to be compatible with all dependencies.

- If you see 404 errors after deployment, make sure your Firebase hosting configuration has the correct rewrite rules (they should be set up in firebase.json).

- For any other issues, check the Firebase Hosting documentation or run:
  ```
  firebase deploy --debug
  ```
  to get more detailed error information.