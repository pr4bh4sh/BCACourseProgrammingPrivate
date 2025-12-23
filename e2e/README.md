# Mobile E2E Automation Framework

**Documentation:** [Framework Architecture](FRAMEWORK_ARCHITECTURE.md) | **Reports:** [Latest Test Results](https://pr4bh4sh.github.io/BCACourseProgrammingPrivate/)

## Tech Stack

- **WebdriverIO v9** - Modern test runner for mobile automation
- **TypeScript** - Type-safe test code
- **Appium** - Cross-platform mobile automation
- **Cucumber BDD** - Human-readable test scenarios
- **Allure Reports** - Detailed test reports with screenshots, videos, and logs
- **GitHub Actions** - Automated testing on every push

## Quick Start

### Prerequisites

Make sure you have these installed:

- **Node.js** v20 or higher
  - Download: https://nodejs.org/
  - Or install via Homebrew (macOS):
    ```bash
    brew install node@20
    ```

- **Java Development Kit (JDK)** - Required for Android automation
  - Download: https://www.oracle.com/java/technologies/downloads/
  - Or install via Homebrew (macOS):
    ```bash
    brew install openjdk@17
    ```

- **Appium** - Install globally:
  ```bash
  npm install -g appium
  ```
  
  > [!TIP]
  > For easier setup with all dependencies, you can use:
  > ```bash
  > npm install -g appium-installer
  > appium-installer
  > ```
  > This interactive tool will guide you through installing Appium, drivers, and dependencies.

- **Appium Drivers** - Install required drivers:
  ```bash
  appium driver install uiautomator2  # For Android
  appium driver install xcuitest      # For iOS
  ```

- **Android Studio** (for Android) or **Xcode** (for iOS)

### Installation

1. Navigate to the e2e directory:
   ```bash
   cd e2e
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Download the latest APK (for Android):
   ```bash
   npm run download:android
   ```

## Setting Up Emulators

### Android Emulator

1. **Open Android Studio** → Tools → Device Manager

2. **Create a new device** (if you don't have one):
   - Click "Create Device"
   - Choose a phone (e.g., Pixel 5)
   - Select system image: **API Level 36** (Android 15)
   - Click "Finish"

3. **Start the emulator**:
   - Click the play button next to your device
   - Wait for it to fully boot (you'll see the home screen)

4. **Verify it's running**:
   ```bash
   adb devices
   ```
   You should see your emulator listed.

### iOS Simulator (macOS only)

1. **Open Xcode** → Window → Devices and Simulators

2. **Create a simulator** (if needed):
   - Click the "+" button
   - Choose device type (e.g., iPhone 15)
   - Select iOS version (15.0+)

3. **Start the simulator**:
   ```bash
   open -a Simulator
   ```

4. **Verify it's running**:
   ```bash
   xcrun simctl list devices | grep Booted
   ```

## Running Tests

### Android Tests

Make sure your Android emulator is running, then:

```bash
npm run android:cucumber
```

### iOS Tests

Make sure your iOS simulator is running, then:

```bash
npm run ios
```

### View Test Reports

After tests complete, generate and open the Allure report:

```bash
npm run allure:report
```

This will:
1. Generate an HTML report from test results
2. Open it automatically in your browser

## Configuration

### Customizing Test Runs

Edit the config files in `configs/`:

- **`wdio.conf.ts`** - Base configuration (timeouts, reporters, hooks)
- **`wdio.android.conf.ts`** - Android-specific settings (device name, app path)
- **`wdio.ios.conf.ts`** - iOS-specific settings

### Common Customizations

**Change device name** (Android):
```typescript
// configs/wdio.android.conf.ts
capabilities: [{
  'appium:deviceName': 'Pixel_5_API_36', // Your emulator name
}]
```

**Change app path**:
```typescript
'appium:app': path.join(process.cwd(), 'apps/your-app.apk'),
```

**Adjust timeouts**:
```typescript
// configs/wdio.conf.ts
waitforTimeout: 10000,        // Element wait timeout
connectionRetryTimeout: 120000, // Appium connection timeout
```

## What Gets Captured on Failures

When a test fails, the framework automatically captures:

- **Screenshot** - Visual state at failure
- **UI Source Dump** - Complete element hierarchy (XML)
- **Video Recording** - Full scenario playback
- **Appium Logs** - Server-side debugging info
- **ADB Logcat** - Android system logs (for crashes)

All these are attached to the Allure report for easy debugging.

## Troubleshooting

### "No devices found"

**Problem**: Appium can't find your emulator/simulator.

**Solution**:
```bash
# Android: Check if emulator is running
adb devices

# iOS: Check if simulator is booted
xcrun simctl list devices | grep Booted
```

### "App not found"

**Problem**: The APK/IPA file doesn't exist.

**Solution**:
```bash
# Download the latest Android APK
npm run download:android

# Or check the path in configs/wdio.android.conf.ts
```

### "Appium server not starting"

**Problem**: Port 4723 might be in use.

**Solution**:
```bash
# Kill any existing Appium processes
pkill -f appium

# Or manually specify a different port in configs/wdio.conf.ts
```

### "Tests are slow"

**Problem**: Emulator performance issues.

**Solution**:
- Enable hardware acceleration in Android Studio
- Allocate more RAM to the emulator (AVD settings)
- Disable animations: `adb shell settings put global window_animation_scale 0`

### "Element not found"

**Problem**: Selector might be incorrect or element not visible.

**Solution**:
1. Check the UI Source Dump in the Allure report
2. Use `testID` attributes (preferred over XPath)
3. Add explicit waits in page objects

## CI/CD Integration

Tests run automatically on GitHub Actions for every push and pull request.

**Workflow**: `.github/workflows/mobile-tests.yml`

The CI pipeline:
1. Sets up Node.js and dependencies
2. Downloads the latest debug APK
3. Starts an Android emulator (API 36)
4. Runs all tests
5. Generates Allure report
6. Publishes report to GitHub Pages

**View live reports**: https://pr4bh4sh.github.io/BCACourseProgrammingPrivate/

## Writing New Tests

### 1. Create a Feature File

```gherkin
# tests/features/login.feature
Feature: User Login

  Scenario: Successful login
    Given I am on the login screen
    When I enter email "user@example.com"
    And I enter password "password123"
    And I tap the login button
    Then I should see the home screen
```

### 2. Create Step Definitions

```typescript
// tests/steps/login.steps.ts
import { Given, When, Then } from '@wdio/cucumber-framework';
import LoginPage from '../../src/pages/login.page';

Given('I am on the login screen', async () => {
  await LoginPage.waitForPageLoad();
});

When('I enter email {string}', async (email: string) => {
  await LoginPage.enterEmail(email);
});
```

### 3. Create Page Object

```typescript
// src/pages/login.page.ts
import BasePage from '../framework/pages/base.page';

class LoginPage extends BasePage {
  get emailInput() { return $('~email-input'); }
  get passwordInput() { return $('~password-input'); }
  
  async enterEmail(email: string) {
    await this.emailInput.setValue(email);
  }
}

export default new LoginPage();
```

## Best Practices

- Use testID attributes - More reliable than XPath
- Keep page objects focused - One page object per screen
- Write descriptive scenarios - Make them readable by non-developers
- Use scenario outlines - For data-driven tests
- Reset app state - Each scenario should be independent
- Add meaningful waits - Don't use hardcoded sleeps

## Need Help?

- Check the [Architecture Overview](ARCHITECTURE.md) to understand the framework structure
- Review existing tests in `tests/features/` for examples
- Check Allure reports for detailed failure information
- Review Appium logs in `appium.log`
