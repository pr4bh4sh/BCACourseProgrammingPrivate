# Framework Architecture

This document provides an overview of the mobile automation framework architecture and project structure.

## Project Structure

```
e2e/
├── package.json                 # Node.js dependencies and scripts
├── package-lock.json            # Locked dependency versions
├── README.md                    # Project documentation and usage
├── tsconfig.json                # TypeScript configuration
├── configs/                     # WebdriverIO/Appium configuration files
│   ├── wdio.shared.conf.ts              # Base/shared configuration
│   ├── wdio.shared.local.appium.conf.ts # Local Appium runner settings
│   ├── wdio.android.app.cucumber.conf.ts# Android (App + Cucumber) config
│   ├── wdio.android.ci.conf.ts          # Android CI capabilities
│   ├── wdio.ios.conf.ts                 # iOS-specific capabilities
│   └── browserstack/                    # BrowserStack-related configs/assets
│
├── doc/                         # Documentation
│   ├── FRAMEWORK_ARCHITECTURE.md# Architecture overview (this document)
│   └── browserstack_setup.md    # BrowserStack setup guide
│
├── src/                         # Source code for page objects
│   └── pages/                   # Application-specific page objects and base
│       ├── base.page.ts         # Common page object methods
│       └── home.page.ts         # Home screen page object
│   └── utils/                   # Reusable utilities
│       ├── driver.utils.ts      # Device interactions (scroll, swipe, wait)
│       ├── element.utils.ts     # Element operations (find, click, type)
│       └── file.utils.ts        # File and data management
│
├── tests/                       # Test files
│   ├── features/                # Gherkin feature files (BDD)
│   └── steps/                   # Step definitions (TypeScript)
│
├── scripts/                     # Utility scripts
│   └── download-builds.sh       # Script to download latest builds/APK
│
├── reports/                     # Consolidated run artifacts and reports (safe to clean)
│   ├── allure-results/          # Raw Allure result artifacts (JSON, attachments)
│   ├── allure-report/           # Generated Allure HTML reports
│   └── logs/                    # Additional logs
```

Tip: `npm run allure:clean` deletes the `reports/` folder; every run will recreate it.

## Framework Layers

The framework is organized into distinct layers, each with specific responsibilities:

### 1. Test Layer
- **Feature Files**: Test scenarios written in Gherkin syntax (BDD)
  - Location: [tests/features/](../tests/features/)
  - Example: [home.feature](../tests/features/home.feature)
  - Human-readable test cases that describe application behavior

- **Step Definitions**: TypeScript implementations that execute test steps
  - Location: [tests/steps/](../tests/steps/)
  - Example: [home.steps.ts](../tests/steps/home.steps.ts)
  - Maps Gherkin steps to actual code
  - Calls page object methods to interact with the app

### 2. Page Object Layer
- **Base Page**: Common functionality inherited by all page objects
  - Location: [src/pages/base.page.ts](../src/pages/base.page.ts)
  - Reusable methods like `waitForElement()`, `tapElement()`
  - Reduces code duplication
- **Page Objects**: Encapsulate UI elements and behaviors for each screen
  - Location: [src/pages/](../src/pages/)
  - Example: [home.page.ts](../src/pages/home.page.ts)
  - Contains selectors and methods for interacting with specific screens
  - Single responsibility: one page object per screen; it owns selectors plus user actions only
  - Provides clean API for test steps while hiding locator details

### 3. Appium Configration Layer
- **WebdriverIO**: Test runner that orchestrates execution
  - Configuration: `configs/wdio.shared.conf.ts` (base) with platform-specific overrides such as `configs/wdio.android.app.cucumber.conf.ts`, `configs/wdio.android.ci.conf.ts`, and `configs/wdio.ios.conf.ts`
  - Manages test lifecycle and reporting
  - Handles parallel execution

- **Appium Server**: Mobile automation engine
  - Communicates with Android/iOS devices
  - Translates commands to native automation APIs
  - Runs as a service during test execution

### 4. Mobile Application
- **React Native App**: The application under test
  - Android APK or iOS IPA
  - Contains testID attributes for automation
  - Responds to Appium commands

## Test Execution Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Developer/QA writes test                                 │
│    Creates feature file with Gherkin scenarios              │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Test runner starts                                       │
│    WebdriverIO reads configuration and starts Appium        │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Appium server                                            │
│    Establishes connection to emulator/simulator             │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Appium installs the AUT                                  │
│    and opens/start the application                          │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Cucumber Steps gets executed.                            │
│    Each Gherkin step runs its corresponding step definition │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Page objects interaction                                 │
│    Step definitions call page object methods                │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Elements located                                         │
│    Page objects find UI elements using selectors            │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 8. Actions performed                                        │
│    Appium sends commands to the app (tap, type, swipe)      │
└────────────────────────────┬────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────┐
│ 9. Assertions verifed                                       │
│    Test checks expected vs actual results                   │
└────────────────────────────┬────────────────────────────────┘
                             ↓
                    ┌────────────────┐
                    │  Test passed?  │───────────────────┬
                    └────┬───────────┘                   |
                         │                               |
                    Yes  │                               |  NO
                         ↓                               | 
        ┌────────────────────────────────────┐           |
        │ 10. Results captured               │           |
        │     Test artifacts collected       │           |
        └────────────┬───────────────────────┘           |
                     │                                   ↓
                     │      ┌─────────────────────────────────────┐
                     │      │ 10. Failure artifacts               │
                     │      │     Screenshots, videos, logs       │
                     │      └─────────────┬───────────────────────┘
                     │                    │
                     └────────┬───────────┘
                              ↓
            ┌─────────────────────────────────────────────┐
            │ 11. Report generated                        │
            │     Allure creates HTML report with all     │
            │     artifacts                               │
            └─────────────────────────────────────────────┘
```

## Key Design Principles

### Separation of Concerns
Each layer has a single responsibility:
- Tests describe behavior
- Steps implement test logic
- Page objects handle UI interaction
- Base page provides reusable functionality

### Reusability
- Base page class shared by all page objects
- Common utilities used across tests
- Configuration inheritance (base → platform-specific)

### Maintainability
- Page Object Model isolates UI changes
- Selectors centralized in page objects
- One change updates all tests using that element

### Readability
- BDD/Gherkin makes tests understandable by non-developers
- Descriptive method names in page objects
- Clear separation between what and how

### Debuggability
- Comprehensive failure artifacts
- Detailed logging at each layer
- Video recordings show exact failure point
- UI dumps reveal element hierarchy issues

## Component Relationships

```
Feature File
    ↓
Step Definitions
    ↓
Page Objects (includes Base Page)
    ↓
WebdriverIO
    ↓
Appium Server
    ↓
Mobile App
    ↓
Test Results → Allure Reporter → reports/allure-results → reports/allure-report (HTML)
```

