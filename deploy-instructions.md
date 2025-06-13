# Flyer App Deployment Instructions

## Prerequisites
- Node.js 16+ installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase account created
- Git installed (optional, for version control)

## Step 1: Fix Dependencies
The app has been updated to use React 18.2.0 instead of React 19.0.0 to resolve compatibility issues with lucide-react-native.

## Step 2: Build the App
1. Install dependencies:
   ```bash
   npm install
   ```

2. Build the web version:
   ```bash
   npm run build
   ```
   This will create a `dist` directory with the built web app.

## Step 3: Firebase Setup
1. Login to Firebase:
   ```bash
   firebase login
   ```

2. Initialize Firebase in your project (if not already done):
   ```bash
   firebase init
   ```
   - Select "Hosting"
   - Select your Firebase project
   - Specify "dist" as your public directory
   - Configure as a single-page app: Yes
   - Set up automatic builds and deploys with GitHub: No (unless you want to)

3. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## Step 4: Verify Deployment
1. After deployment, Firebase will provide a URL to your deployed app.
2. Open the URL in your browser to verify that the app is working correctly.
3. Test key functionality like:
   - Viewing flyers
   - Creating new flyers
   - Location search
   - Date picker

## Troubleshooting
- If you see Firebase's default page instead of your app:
  - Make sure the `firebase.json` file has the correct "public" directory set to "dist"
  - Ensure your app is properly building to the "dist" directory
  - Check that the `index.html` file in the "dist" directory is correct

- If the app doesn't load properly:
  - Check the browser console for errors
  - Verify that all dependencies are installed correctly
  - Make sure the build process completed successfully

## Additional Notes
- For native app deployment (iOS/Android), you would use EAS Build:
  ```bash
  npm install -g eas-cli
  eas login
  eas build --platform all
  ```

- To update your deployment after making changes:
  1. Make your changes
  2. Rebuild the app: `npm run build`
  3. Redeploy: `firebase deploy`