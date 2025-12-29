# Mobile E2E Automation Framework

**Documentation:** [Framework Architecture](./doc/FRAMEWORK_ARCHITECTURE.md) | **Reports:** [Latest Test Results](https://pr4bh4sh.github.io/BCACourseProgrammingPrivate/)

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

## Running Tests

### Android Tests

Make sure your Android emulator is running, then:

```bash
npm run android:cucumber
```

### BrowserStack (cloud Android)

Follow the setup in [doc/browserstack_setup.md](./doc/browserstack_setup.md), export BrowserStack credentials, then run:

```bash
npm run android:browserstack
```

- Uses [configs/browserstack/wdio.android.bs.app.conf.ts](./configs/browserstack/wdio.android.bs.app.conf.ts) for capabilities.
- CI workflow: [../.github/workflows/browserstack.yml](../.github/workflows/browserstack.yml).

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
- **`configs/browserstack/wdio.android.bs.app.conf.ts`** - BrowserStack cloud run config; CI workflow in `../.github/workflows/browserstack.yml`.


## What Gets Captured on Failures for reporting

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
```

### "App not found"

**Problem**: The APK file doesn't exist.

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

**Workflow of CI pipeline**: `.github/workflows/mobile-tests.yml`

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
# tests/features/home.feature
Feature: Home Screen Verification

  @home @smoke
  Scenario: Verify main dashboard cards
    Given the "Open Menu" is displayed
    Then the following cards should be displayed:
      | Semester 1 |
      | Semester 6 |
```

### 2. Create Step Definitions

```typescript
// tests/steps/home.steps.ts
import { Given, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import HomePage from '../../src/pages/home.page';

Given(/^the "([^"]*)" is displayed$/, async (label) => {
  await HomePage.getElementByLabel(label).waitForDisplayed({ timeout: 20000 });
});

Then(/^the following cards should be displayed:$/, async (dataTable: any) => {
  const cards = dataTable.raw().map((row: string[]) => row[0]);
  for (const card of cards) {
    const isDisplayed = await HomePage.isCardDisplayed(card);
    await expect(isDisplayed).toBe(true, `Expected card "${card}" to be displayed`);
  }
});
```

### 3. Create Page Object

```typescript
// src/pages/home.page.ts
import { $ } from '@wdio/globals';
import BasePage from '../framework/pages/base.page';

class HomePage extends BasePage {
  get menuButton() { return $('~Open Menu'); }

  async tapCard(label: string) {
    await this.tapByLabel(label, 15000);
  }

  async isCardDisplayed(cardLabel: string): Promise<boolean> {
    return await this.isElementDisplayedByLabel(cardLabel, 10000);
  }
}

export default new HomePage();
```

## Best Practices

- Use testID attributes - More reliable than XPath
- Keep page objects focused - One page object per screen
- Write descriptive scenarios - Make them readable by non-developers
- Use scenario outlines - For data-driven tests
- Reset app state - Each scenario should be independent
- Add meaningful waits - Don't use hardcoded sleeps

## Need Help?

- Check the [Architecture Overview](./doc/FRAMEWORK_ARCHITECTURE.md) to understand the framework structure
- Review existing tests in `tests/features/` for examples
- Check Allure reports for detailed failure information
