# Framework Architecture

This document provides an overview of the mobile automation framework architecture and project structure.

## Project Structure

```
e2e/
├── configs/                      # WebdriverIO configuration files
│   ├── wdio.conf.ts             # Base configuration (shared settings)
│   ├── wdio.android.conf.ts     # Android-specific capabilities
│   └── wdio.ios.conf.ts         # iOS-specific capabilities
│
├── src/                         # Source code for framework and page objects
│   ├── framework/               # Core framework utilities
│   │   ├── pages/              # Base page object classes
│   │   │   └── base.page.ts    # Common page object methods
│   │   └── utils/              # Reusable utility functions
│   │       ├── driver.utils.ts # Device interactions (scroll, swipe, wait)
│   │       ├── element.utils.ts# Element operations (find, click, type)
│   │       └── file.utils.ts   # File and data management
│   │
│   └── pages/                   # Application-specific page objects
│       └── home.page.ts        # Home screen page object
│
├── tests/                       # Test files
│   ├── features/               # Gherkin feature files (BDD)
│   │   └── home.feature        # Home screen test scenarios
│   └── steps/                  # Step definitions (TypeScript)
│       └── home.steps.ts       # Home screen step implementations
│
├── scripts/                     # Utility scripts
│   └── download-builds.sh      # Script to download latest APK
│
├── allure-results/             # Raw test results (JSON)
├── allure-report/              # Generated HTML reports
├── appium.log                  # Appium server logs
├── package.json                # Node.js dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## Framework Layers

The framework is organized into distinct layers, each with specific responsibilities:

### 1. Test Layer
- **Feature Files**: Test scenarios written in Gherkin syntax (BDD)
  - Location: `tests/features/`
  - Example: `home.feature`
  - Human-readable test cases that describe application behavior

- **Step Definitions**: TypeScript implementations that execute test steps
  - Location: `tests/steps/`
  - Maps Gherkin steps to actual code
  - Calls page object methods to interact with the app

### 2. Page Object Layer
- **Page Objects**: Encapsulate UI elements and behaviors for each screen
  - Location: `src/pages/`
  - Example: `home.page.ts`
  - Contains selectors and methods for interacting with specific screens
  - Provides clean API for test steps

- **Base Page**: Common functionality inherited by all page objects
  - Location: `src/framework/pages/base.page.ts`
  - Reusable methods like `waitForElement()`, `tapElement()`
  - Reduces code duplication

### 3. Framework Utilities
- **Driver Utils**: Device-level interactions
  - Location: `src/framework/utils/driver.utils.ts`
  - Methods: wait, scroll, swipe, background app, hide keyboard

- **Element Utils**: Element-level operations
  - Location: `src/framework/utils/element.utils.ts`
  - Methods: find, click, type, verify, get text

- **File Utils**: Test data and fixture management
  - Location: `src/framework/utils/file.utils.ts`
  - Read test data from JSON files
  - Handle file paths and attachments

### 4. Appium Layer
- **WebdriverIO**: Test runner that orchestrates execution
  - Configuration: `configs/wdio.conf.ts`
  - Manages test lifecycle and reporting
  - Handles parallel execution

- **Appium Server**: Mobile automation engine
  - Communicates with Android/iOS devices
  - Translates commands to native automation APIs
  - Runs as a service during test execution

### 5. Mobile Application
- **React Native App**: The application under test
  - Android APK or iOS IPA
  - Contains testID attributes for automation
  - Responds to Appium commands

## Test Execution Flow

1. **Developer writes test**: Creates feature file with Gherkin scenarios
2. **Test runner starts**: WebdriverIO reads configuration and starts Appium
3. **Appium connects**: Establishes connection to emulator/simulator
4. **App launches**: Installs and opens the application
5. **Steps execute**: Each Gherkin step runs its corresponding step definition
6. **Page objects interact**: Step definitions call page object methods
7. **Elements located**: Page objects find UI elements using selectors
8. **Actions performed**: Appium sends commands to the app (tap, type, swipe)
9. **Assertions verify**: Test checks expected vs actual results
10. **Results captured**: Screenshots, videos, and logs collected on failure
11. **Report generated**: Allure creates HTML report with all artifacts

## Key Design Principles

### Separation of Concerns
Each layer has a single responsibility:
- Tests describe behavior
- Steps implement test logic
- Page objects handle UI interaction
- Utils provide reusable functionality

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
Page Objects → Base Page
    ↓              ↓
Element Utils ← Driver Utils
    ↓
WebdriverIO
    ↓
Appium Server
    ↓
Mobile App
    ↓
Test Results → Allure Reporter → HTML Report → GitHub Pages
```

