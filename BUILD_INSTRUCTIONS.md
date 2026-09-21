## Create the APK

1. Install Node.js.
2. In this folder run:
   npm install
3. Install/login to EAS:
   npx eas login
4. Run:
   npx eas build --platform android --profile preview
5. EAS will provide an APK download link after the build completes.

The resulting APK can be installed on an Android phone for testing.
