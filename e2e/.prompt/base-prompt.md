## Prompt to build the framework

You are an expert Lead Mobile QA Architect.  
Design and generate a complete, production‑quality mobile automation framework for a React Native app using **WebdriverIO v8+, TypeScript, Appium, Allure reporting, and GitHub Actions CI**. The goal is a POC that still looks architecturally sound enough for a prduction grade project.

### 1. Project and tooling

Create a new Node/TypeScript project with:

- WebdriverIO test runner configured for **Appium mobile testing**, not browser.[1][2][3]
- TypeScript configuration (`tsconfig.json`) suitable for E2E tests (ESNext modules, strict typing on, path aliases for `src`, `tests`, and `framework`).[2]
- NPM scripts to:  
  - run Android tests, iOS tests, all tests  
  - run tests headless in CI  
  - generate and open Allure reports.[4][5]

Use the official `webdriverio/appium-boilerplate` repo as a reference for folder layout and configuration style, but modernize for the latest WebdriverIO and TypeScript where needed.[6][3]

### 2. Framework architecture

Implement a modular framework with the following:

- **Feature files and BDD layer (optional but preferred):**  
  - Use WebdriverIO + Cucumber.  
  - Demonstrate a feature file that combines multiple scenario outlines and examples (e.g., login, signup, basic CRUD flow) against a React Native app.[7][1]

- **Step layer with dynamic data:**  
  - Step definitions must accept dynamic strings and data tables without needing changes to underlying locators or page objects.  
  - Use parameterized steps and helper utilities so a non‑developer can combine steps flexibly.

- **Page Object Model with string‑based locators:**  
  - Centralize all selectors in dedicated page object classes.  
  - Prefer accessibility IDs and resource IDs over XPath; where XPath is used, wrap it in readable helper functions.[1][2]
  - Keep locators as string constants or small value objects; page objects expose **behavioral methods** (e.g., `loginWith(email, password)`) instead of raw element access.

- **Appium design principles:**  
  - Provide a shared **driver utilities** module (e.g., wait for element, scroll to text, swipe, hide keyboard, background app).  
  - Provide a **file utilities** module (e.g., read test data from JSON, handle fixture paths, attach files or logs).  
  - Apply clean Page Object Model and avoid duplication by using base page classes and platform‑specific subclasses where needed.[6][7][1]

- **Configuration and capabilities:**  
  - `wdio.android.conf.ts` and `wdio.ios.conf.ts` with capabilities suitable for a React Native app under test, including app path, deviceName, platformVersion, automationName, and `appium:`‑prefixed caps.[1][6]
  - Hooks to take screenshots, grab page source, and collect logs on failure.[5]
  - Parallel execution support via `maxInstances` and per‑capability overrides.[1]

### 3. Reporting and artefacts

Integrate **Allure Reporter** with WebdriverIO:

- Add `@wdio/allure-reporter` in the config, enabled for all runs.[4][5][1]
- On every test failure, attach to Allure:  
  - screenshot  
  - page source  
  - Appium server log (if accessible)  
  - custom log messages from framework utilities.[5][4]
- Generate an HTML Allure report; include instructions and scripts (`allure generate`, `allure open`) in `package.json`.[8][9][4]
- Keep video recording **disabled by default** to save space, but document how to enable it in future.

### 4. GitHub Actions CI (with emulator)

Create a **GitHub Actions workflow** file (e.g., `.github/workflows/mobile-tests.yml`) that:

- Triggers on pull requests and pushes to `main`.[10][11]
- Runs on an appropriate runner (Ubuntu or macOS as needed) and:  
  - checks out the repo  
  - sets up Node  
  - installs dependencies  
  - installs and starts Appium (either via `@wdio/appium-service` or a GitHub Action like `appium-server-action`).[11][12][10]
  - creates and boots an **Android emulator** using `reactivecircus/android-emulator-runner` or similar.[10][11]
  - runs the WebdriverIO tests with the Android config.  
- After test execution, publishes **Allure HTML report** as:  
  - a build artifact, and  
  - an optional static site branch (e.g., `allure-report`) so the report is available via GitHub Pages.[4][5]

### 5. React Native specifics

- Assume the app is a standard React Native (not Expo) project with multiple screens (e.g., login, home, details, settings).  
- Show how to structure selectors so that they are resilient to React Native implementation details, preferring **testIDs/accessibility labels** in JSX that map cleanly to Appium selectors.[2][1]
- Provide at least one example of a cross‑platform selector strategy that works on both Android and iOS.

### 6. Deliverables from the assistant

Respond with:

1. Folder structure of the project, showing `src`/`tests`/`framework` layers, feature files, steps, and configs.[7][6][1]
2. Key configuration files: `package.json`, `wdio.*.conf.ts`, `tsconfig.json`.[3][2][1]
3. Example page object(s) and step definitions that demonstrate dynamic strings and scenario outlines.[2][1]
4. Example GitHub Actions workflow YAML that starts an emulator, runs Appium tests, and publishes Allure report artefacts/branch.[12][11][10]
5. Any helper utilities (driver utils, file utils, reporting hooks).[6][7][1]

Use modern, idiomatic TypeScript and WebdriverIO patterns and keep the code clean.

[1](https://spurqlabs.com/mobile-test-automation-using-webdriver-io-and-appium/)
[2](https://www.youtube.com/watch?v=zWm0F3-ayQw)
[3](https://webdriver.io/docs/boilerplates/)
[4](https://allurereport.org/docs/webdriverio/)
[5](https://webdriver.io/docs/allure-reporter/)
[6](https://github.com/webdriverio/appium-boilerplate)
[7](https://v7.webdriver.io/docs/boilerplates/)
[8](https://www.youtube.com/watch?v=CkaVbCZQCuU)
[9](https://www.youtube.com/watch?v=CF9AmntWRM4)
[10](https://www.linkedin.com/pulse/running-appium-tests-github-actions-moataz-nabil)
[11](https://testautomationu.applitools.com/appium-java-tutorial/chapter11.2.html)
[12](https://github.com/marketplace/actions/appium-server-action)
[13](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/148384902/9040769a-fbcd-47cf-8f6e-deaf9e509351/image.jpg)
[14](https://www.youtube.com/watch?v=B2jjoS394z8)
[15](https://www.linkedin.com/posts/digitalhousepvtltd_%F0%9D%98%8F%F0%9D%98%B0%F0%9D%98%B8-%F0%9D%98%B5%F0%9D%98%B0-%F0%9D%91%A9%F0%9D%91%BC%F0%9D%91%B0%F0%9D%91%B3%F0%9D%91%AB-%F0%9D%98%A2%F0%9D%98%AF-%F0%9D%91%A8%F0%9D%92%96%F0%9D%92%95%F0%9D%92%90%F0%9D%92%8E%F0%9D%92%82%F0%9D%92%95%F0%9D%92%8A%F0%9D%92%90%F0%9D%92%8F-activity-7371764384672595968-hQms)
[16](https://python.plainenglish.io/how-i-built-a-fully-automated-qa-framework-in-python-to-test-web-api-and-mobile-apps-7e9ea0e4c22f)
[17](https://www.youtube.com/watch?v=SpoVsuZcUPs)
[18](https://www.linkedin.com/posts/smizibon_testautomation-qualityassurance-typescript-activity-7368517257758441474-Qhs-)
[19](https://www.youtube.com/watch?v=W-36NmDoSdg)
[20](https://discuss.appium.io/t/set-up-appium-and-git-hub-action/37480)
[21](https://unruffled-lumiere-b4796a.netlify.app/docs/boilerplate/)