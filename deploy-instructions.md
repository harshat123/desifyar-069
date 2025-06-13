# Firebase Deployment Instructions

Follow these steps to deploy your Flyer App to Firebase Hosting:

## Prerequisites

1. Make sure you have Firebase CLI installed:
   ```
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```
   firebase login
   ```

3. Initialize Firebase in your project (if not already done):
   ```
   firebase init
   ```
   - Select "Hosting" when prompted
   - Select your Firebase project or create a new one
   - Specify "web-build" as your public directory
   - Configure as a single-page app: Yes
   - Set up automatic builds and deploys with GitHub: No (unless you want to)

## Deployment Steps

1. Build your web application:
   ```
   npm run build
   ```
   This will create a `web-build` directory with your compiled app.

2. Deploy to Firebase:
   ```
   firebase deploy --only hosting
   ```
   Or use the shortcut command:
   ```
   npm run deploy
   ```

3. After successful deployment, Firebase will provide a URL where your app is hosted.

## Troubleshooting

- If you encounter any issues with the index.html file, make sure the file in `public/index.html` is correctly formatted and has the proper content for your Flyer App.
- The `firebase.json` file should be configured to handle routing for a single-page application.
- Make sure your web-build directory is generated correctly before deploying.

## Important Notes

- The Firebase hosting configuration in `firebase.json` includes cache control settings:
  - No caching for HTML files to ensure users always get the latest version
  - 1 week caching for static assets (images, CSS, JS) for better performance

- Remember that Firebase Hosting is for the web version of your app only. For native mobile deployment, you'll need to use EAS Build or another mobile app distribution service.