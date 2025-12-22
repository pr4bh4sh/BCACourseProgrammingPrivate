# Mobile E2E Automation Framework

This directory contains a production-quality mobile automation framework for the BCACourseProgramming React Native app.

## Tech Stack

- **WebdriverIO v8+**: Test runner for mobile and web.
- **TypeScript**: Ensuring type safety and better developer experience.
- **Appium**: Mobile automation engine.
- **Cucumber (BDD)**: Writing tests in plain English using Gherkin syntax.
- **Allure Reporting**: Detailed and visual test execution reports.
- **GitHub Actions**: Continuous Integration for running tests on emulators.

## Project Structure

```text
e2e/
├── configs/                # WebdriverIO configuration files
│   ├── wdio.conf.ts        # Base configuration
│   ├── wdio.android.conf.ts# Android specific capabilities
│   └── wdio.ios.conf.ts    # iOS specific capabilities
├── src/
│   ├── framework/          # Core framework utilities and base classes
│   │   ├── utils/          # Driver and file utilities
│   │   └── pages/          # Base Page Object
│   └── pages/              # Application-specific Page Objects
└── tests/
    ├── features/           # Gherkin feature files
    └── steps/              # Step definitions matching feature files
```

## Getting Started

### Prerequisites

- Node.js (v20+)
- Appium Server (`npm install -g appium`)
- Appium Drivers (`appium driver install uiautomator2`, `appium driver install xcuitest`)
- Android Studio / Xcode for emulators/simulators.

### Installation

1. Navigate to the `e2e` directory:
   ```bash
   cd e2e
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running Tests

- **Run Android Tests:**
  ```bash
  npm run android
  ```
- **Run iOS Tests:**
  ```bash
  npm run ios
  ```

### Reporting

After running tests, generate and view the Allure report:

```bash
npm run allure:report
```

## CI/CD

The framework is integrated with GitHub Actions. The workflow `.github/workflows/mobile-tests.yml` automatically runs Android tests on every push and pull request to the `main` branch.

## Best Practices

- **Page Object Model (POM)**: Centralize selectors and behavioral methods in page objects.
- **Locators**: Prefer `testID` (Android) and `accessibilityLabel` (iOS).
- **Hooks**: Use hooks for automatic screenshots and logs on failure.
- **Dynamic Data**: Pass parameters from feature files to step definitions for flexible test scenarios.
