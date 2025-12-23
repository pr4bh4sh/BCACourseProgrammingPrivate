# Project Setup

Concise technical setup for **BCACourseProgramming**.

### Prerequisites
- **Node.js**: v20+
- **Java**: 17+ (Required for React Native 0.82)
- **Android SDK**: Build Tools v36, Compile SDK 36, Target SDK 36
- **CocoaPods**: (iOS only)

### Installation
```bash
npm install
cd ios && pod install  # Required for iOS
```

### Running the App
1. **Android**:
   ```bash
   npm run android
   ```
2. **iOS**:
   ```bash
   npm run ios
   ```

### Automation
Selectors for automation tests are located in:
`locator-mapping/selectors/*.yaml`

### Building for Automation (Debug)

To generate debug builds for inspection (e.g., Appium Inspector):

**Android**:
```bash
cd android && ./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

**iOS (Simulator)**:
```bash
# Build .app bundle
xcodebuild -workspace ios/BCAFresh.xcworkspace -configuration Debug -scheme BCAFresh -sdk iphonesimulator -derivedDataPath Build -quiet
# Output: Build/Build/Products/Debug-iphonesimulator/BCAFresh.app
```

### Tips
- Use `npx react-native doctor` to check for any missing dependencies.

