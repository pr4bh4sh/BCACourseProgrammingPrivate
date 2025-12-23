# AI Coding Agent Instructions

## Project Overview

**BCACourseProgramming** is a React Native (v0.82+) educational app for BCA students with a comprehensive E2E automation framework. The project has two main pillars: the mobile app and the advanced testing infrastructure.

### Architecture Summary
- **App**: React Native + React Navigation (Drawer + Stack navigators) + AsyncStorage
- **Automation**: WebdriverIO v9 + Appium + Cucumber BDD + TypeScript + Allure Reports
- **CI/CD**: GitHub Actions with Android Emulator automation and GitHub Pages reporting

---

## Mobile App Architecture

### Navigation Structure
- **Routes.js** ([src/Utils/Routes.js](src/Utils/Routes.js)): Central router managing all navigation
  - Uses `Drawer.Navigator` (right-side menu via [src/Components/Menubar](src/Components/Menubar))
  - Nested `Stack.Navigator` for screen transitions
  - Key screens: Home, CodeView, Compiler, Interview, MCQ, Blog, Memes, Ebooks

### Component Organization
- **Components**: Modular screens in `src/Components/` matching route names
  - Each folder contains UI logic, no additional subfolders (flat structure)
  - Home screen is primary entry point; Menubar handles navigation
- **Utilities**: [src/Utils/](src/Utils/) contains shared resources
  - `Colors.js`: Theme colors (WHITEONE, BLACK, PRIMARY, THEMEBLACK, THEMEDARKBLACK, etc.)
  - `Fonts.js`: Font definitions (regular, medium, light, thin)
  - `Constants.js`: App-wide constants
  - `ThemeContext.js`: Dark/light mode support
- **Assets**: Images and static resources in [src/Assets/](src/Assets/)

### Theming & Styling
- Theme applied in [App.js](App.js) via NavigationContainer theme prop
- Color scheme respects system preference (`useColorScheme()`)
- All text/card backgrounds respond to dark mode
- **Key convention**: Colors always follow pattern `Colors.WHITEONE`, `Colors.PRIMARY`, etc. (PascalCase)

### JSON Data
- Structured data stored in [src/json/](src/json/) as JSON files
- Used for semester content, interview questions, notes
- Loaded asynchronously via AsyncStorage or API

---

## E2E Automation Framework

### Framework Architecture (Page Objects + BDD)
Located in [e2e/](e2e/):

**Test Layers**:
1. **Feature Files** ([e2e/tests/features/](e2e/tests/features/)): Gherkin syntax (BDD)
   - Human-readable scenarios with Given/When/Then steps
   - Tagged with `@home`, `@smoke`, `@regression` for filtering
   
2. **Step Definitions** ([e2e/tests/steps/](e2e/tests/steps/)): TypeScript implementing Gherkin steps
   - Calls page object methods
   - Example: `Given the "Open Menu" is displayed`
   
3. **Page Objects** ([e2e/src/pages/](e2e/src/pages/)): Screen-specific UI interaction
   - Example: [home.page.ts](e2e/src/pages/home.page.ts) defines semester cards, modals
   - **Selector strategy**: Uses `testID` format: `id=home.card.sem1`, `~Open Menu` for accessibility labels
   - Inherits from [BasePage](e2e/src/framework/pages/base.page.ts) for common methods (tapElement, scroll, wait)
   
4. **Utilities**: Reusable device/element operations
   - [driver.utils.ts](e2e/src/framework/utils/driver.utils.ts): scroll, swipe, background app, hide keyboard
   - [element.utils.ts](e2e/src/framework/utils/element.utils.ts): find, click, type, verify, getText

### Selector Mapping (Critical for Test IDs)
- [locator-mapping/selectors/](locator-mapping/selectors/) contains YAML files for all screens
  - Example: [Home.yaml](locator-mapping/selectors/Home.yaml) maps screen elements
  - **Format**: `testID` notation (`id=home.card.sem1`) and accessibility labels (`~Open Menu`)
  - **Pattern**: `feature.component.name` (e.g., `home.card.sem1`, `interview.button.close`)
  - When adding tests, ensure React Native components have matching `testID` props

### WebdriverIO Configuration
- Base config: [wdio.shared.conf.ts](e2e/configs/wdio.shared.conf.ts)
- Android: [wdio.android.app.cucumber.conf.ts](e2e/configs/wdio.android.app.cucumber.conf.ts)
- iOS: [wdio.ios.conf.ts](e2e/configs/wdio.ios.conf.ts)
- **Key settings**: API level 36, x86_64 arch, Cucumber BDD runner, Allure reporter

### Running Tests
- **Download latest APK**: `cd e2e && npm run download:android`
- **Run Android tests**: `npm run android:cucumber`
- **Generate reports**: `npm run allure:generate` → opens HTML report
- **CI/CD**: [.github/workflows/mobile-tests.yml](.github/workflows/mobile-tests.yml) runs on push/PR, deploys to GitHub Pages

---

## Developer Workflows

### Building & Running App
```bash
npm install                 # Install root dependencies
cd ios && pod install      # iOS only
npm run android            # Run on Android emulator
npm run ios                # Run on iOS simulator
npm run studio             # Open Android Studio
```

### Building for Automation
```bash
# Android debug APK (for Appium Inspector)
cd android && ./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk

# iOS Simulator build
xcodebuild -workspace ios/BCAFresh.xcworkspace -configuration Debug \
  -scheme BCAFresh -sdk iphonesimulator -derivedDataPath Build
# Output: Build/Build/Products/Debug-iphonesimulator/BCAFresh.app
```

### Linting & Type Checking
- App: `npm run lint` (ESLint)
- E2E: `cd e2e && npm run lint && npm run type-check`

### Adding New Test
1. Add Gherkin scenario to appropriate `.feature` file
2. Implement step definitions in `e2e/tests/steps/`
3. Create/extend page object in `e2e/src/pages/`
4. Add testID attributes to React Native components
5. Map testIDs in [locator-mapping/selectors/](locator-mapping/selectors/) YAML file
6. Run: `cd e2e && npm run android:cucumber`

---

## Key Conventions & Patterns

### testID Naming
- **Pattern**: `feature.component.type` (lowercase with dots)
- **Examples**: `home.card.sem1`, `interview.button.close`, `home.modal.rateUs.button.close`
- **Rule**: Every interactive element must have a testID for test stability
- **React Native**: Use `testID` prop: `<TouchableOpacity testID="home.card.sem1">`

### Page Object Patterns
- Use getter methods for elements: `get semester1Card() { return $('id=home.card.sem1'); }`
- Accessibility labels use `~` prefix: `$('~Open Menu')`
- Helper methods: `getSemesterCard(num)` for dynamic selection
- All interaction methods inherited from BasePage (avoid reinventing)

### Feature File Structure
- One feature file per screen (Home.feature, Interview.feature, etc.)
- Tag scenarios: `@smoke` (quick), `@regression` (comprehensive), `@home` (feature-based)
- Use Gherkin tables for data-driven tests
- Comment out unstable/WIP scenarios

### CI/CD Pipeline
- **Trigger**: Push to main or PR
- **Steps**: Checkout → Node setup → E2E install → Download APK → Enable KVM → Run tests → Generate Allure → Deploy to gh-pages
- **Reports**: Auto-deployed to `https://{owner}.github.io/{repo}/`
- **Artifacts**: Allure reports available in Actions tab

---
### Fixing Failing E2E Tests
1. Check APK version: `npm run download:android`
2. Inspect selectors: Run Appium Inspector, take screenshot, verify testID values
3. Update selectors in both `.feature` files and page objects
4. Check [Home.yaml](locator-mapping/selectors/Home.yaml) for mapping completeness
5. Run single scenario: `npm run android:cucumber -- --tags @specific-tag`

### Debugging Appium Connection Issues
- Emulator must be running: `adb devices` (should show device)
- Appium driver installed: `appium driver list` (should include uiautomator2)
- Check APK testability: Open Debug APK in Appium Inspector
- Clear old sessions: `adb shell pm clear com.android.chrome` (if needed)

### Updating Allure Reports
- Clean results: `npm run allure:clean`
- Regenerate: `npm run allure:generate`
- Open locally: `npm run allure:open`
- GitHub Pages updates automatically on CI

---

## Important Files Quick Reference
- **App Entry**: [App.js](App.js)
- **Navigation Hub**: [src/Utils/Routes.js](src/Utils/Routes.js)
- **Component Registry**: [src/Components/index.js](src/Components/index.js)
- **Theme/Colors**: [src/Utils/Colors.js](src/Utils/Colors.js)
- **E2E Test Selectors**: [locator-mapping/selectors/](locator-mapping/selectors/)
- **E2E Base Page**: [e2e/src/framework/pages/base.page.ts](e2e/src/framework/pages/base.page.ts)
- **CI/CD Pipeline**: [.github/workflows/mobile-tests.yml](.github/workflows/mobile-tests.yml)
- **E2E Setup**: [Development.md](Development.md) and [e2e/README.md](e2e/README.md)

---

## Testing Environment

- **Node.js**: v20+ required
- **Java**: JDK 17+ (Android builds)
- **Android SDK**: API 36 (Android 15), Build Tools v36
- **Emulator**: Pixel 5 or equivalent, x86_64 arch recommended
- **Appium**: v3.1.2 with uiautomator2 driver
- **iOS** (optional): Xcode 15+, CocoaPods for Pods

