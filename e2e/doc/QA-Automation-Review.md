# QA Automation Review (Sr QA Architect)

## React Native Project(app) — Setup & Run
- **Selected application**: https://github.com/DevVibhor/BCACourseProgramming
- **Prerequisites**: Node v20+, JDK 17+, Android SDK API 36
- **Install dependencies**: Install app dependencies at root; install iOS pods if needed.
- **Run Android application**: Launch emulator and start Android build.
```bash
# Install
npm install
# Android
npm run android
```
You can find detailed development setup in [Development.md](../../Development.md).

## Application Overview & Test Areas
- **App Behaviour**: Educational app with Home, CodeView, Compiler, Interview, MCQ, Blog, Memes, Ebooks.
- **Navigation**: Drawer + Stack via [src/Utils/Routes.js](src/Utils/Routes.js); theme driven by [App.js](App.js).
- **Test focus**: Home navigation, menu open/close
- **IDs for stability**: All interactive elements use `testID` following `feature.component.type` (mapped in [locator-mapping/selectors/](../../locator-mapping/selectors)).

## Automation Tests — Frameworks Considered
- **Detox**: Fast gray-box RN testing; tight Metro/JS integration; limited cross-platform device coverage.
- **Appium + WebdriverIO**: Device-native, broad Android/iOS support; works with `testID`; slightly heavier setup.
- **Maestro**: Declarative flows, easy onboarding; less granular element APIs for complex apps.


## Selected Framework & Rationale (Pros / Cons)
- **Choice**: WebdriverIO  + Appium + Cucumber BDD.
- **Pros**: Cross-platform, uses RN `testID`, rich waits/page objects, Allure reporting, CI-friendly.
- **Cons**: Slower than Detox, emulator provisioning complexity, selector flakiness if `testID` missing.
- **Technical fit**: Appium `uiautomator2` and XCUITest expose RN `testID` as `id`/`accessibilityId`, enabling stable selectors.
- **BDD alignment**: Cucumber makes scenarios business-readable while Page object model encapsulates device actions; Allure integrates step annotations/screenshots.
- **CI suitability**: WDIO is configurable with multiple ci tools, artifact publishing, and more emulator controls and configuration options scripts already defined in [.github/workflows/mobile-tests.yml](.github/workflows/mobile-tests.yml).
- **Trade-off with Detox and Maestro**: 
    - Detox offers faster JS-driven tests but lacks system level interaction, e.g. permission/notification dialog handling, navigation to OS settings, wifi/data connection toggles required to setup the device for testing.
    - Maestro is yaml driven and lacks capablity to create complex test as well as reusablity. It is good for static apps however not suitable for complex navigation and very dynamic apps.


## How to Run Automation Tests
- **Prepare APK**: Build or download latest debug APK.
- **Run tests (Android)**: Execute Cucumber suite from [Readme](README.md); generate Allure report.
- **Configs**: Shared settings in [e2e/configs/wdio.shared.conf.ts](e2e/configs/wdio.shared.conf.ts); Android in [e2e/configs/wdio.android.app.cucumber.conf.ts](e2e/configs/wdio.android.app.cucumber.conf.ts).

Here's quick steps when the environment is setup and ready to run tests:
```bash
# From e2e/
npm install
npm run download:android            # Fetch latest APK
npm run android:cucumber            # Run full suite
npm run android:cucumber -- --tags @smoke # Run only smoke tests
npm run allure:report                # Generate Allure report and open it
```

## Improvements & Next Steps
- **Stabilize selectors**: Audit screens to ensure consistent `testID`; expand YAML mappings (e.g., Home, Interview). Create a template/naming convention for testID naming which will help during app development phase.
- **Device coverage**: Add iOS config ([e2e/configs/wdio.ios.conf.ts](e2e/configs/wdio.ios.conf.ts)) to run CI test on iOS Simulator.
- **Parallel test execution**: Enable WDIO `workers` and shard by Cucumber tags to reduce build time. This will also need configuring multiple emulators on CI.
- **Smart Test selection**: Run `@smoke` only when app code changes; full `@regression` on main merges; cache APKs between jobs, so app do not rebuild when there are no app code changes e.g. if there was only server side changes.
- **Flaky test reduction**: Configure retry logic for test rerun and count of max retries. Additionally configure max allowed failure so build gets terminated when unusually large number of tests are failing.
- **Monitoring and observability**: Add links to test result in Github PR, Github notifies the status of triggered action via email and app notification. Generate additional slack/SMS notification when there are anomalies detected. e.g. App crash, unusual build termination, large number of test failing.
 - **Visual regression & localization**: Add screenshot-diff checks with per-theme/device baselines (e.g., [wdio image comparison](https://webdriver.io/docs/visual-testing/), or paid tool [Percy.io](https://percy.io/)) and add locale-switch scenarios validating translated content/RTL layouts; keep selectors `testID`-based to avoid text flakiness with language change.
- **Git Commit hooks**: Add Husky + lint-staged to run ESLint/Prettier and `tsc --noEmit` on staged files for git pre-commit and pre-push hooks.


## AI Usage & Judgement — How AI Was Used
- **Code discovery**: I used AI to summarize apps architecture, source code, analyze WCAG(accessibility standard) locator(accessibilityId, labels) and created strategy for adding testID for making application testable. Later when the app was ready to test bootstrapped key files (wdio config, project setup documentation, Page object(POM) generated with screen dumps, tests).
- **Documentation drafting**: Used AI to generate this and other documents in this repo, reviewed the document and made checks for accuracy of file-linked references.
- **Test locator stability**: Created selector conventions for stable `testID` patterns, created locator mapping yaml's. Utilize these yamls for generating and correcting locators in Page object models files to reduce the rework and trace locator changes.
- **CI config generation and failure analysis**: Created CI config for automated test run on github action, analyze failure and fix issue on CI run.
- **Test execution and fixes**: Used AI to analyze the test failure and prompted it to suggest the probable root cause and possible fixes. Chose optimal fixes among the suggestion when AI provided options were great; and nudged for better analysis and course corrected when I knew from experience that AI suggestions were wrong or not in right direction.

### Review Process
- **Base prompt**: Updated the base prompt to adapt based on the errors and incorrect assumption AI was making.
- **Plan modification**: When using AI in planning mode, reviewed and updated the plan to align with the goal. Reviewed AI generated TODO steps to reflect the desired output.
- **Prompts**: Reviewed every AI generated output code and document and fine tuned the initial prompt to get optimal/satisfactory output/result.
- **Code Review**: All code generation was reviewed before accepting the changes. Same as if a human coworker has created the PR.


### Where AI Was Most Helpful
- **Repo mapping**: Quick identification of E2E stack and key configuration files.
- **High level documentation**: Producing runnable commands and test/run sections fast. Verifying the steps by prompting it to follow the setup documents.
- **Standardization**: Reinforcing `testID` patterns and BDD/Page Object best practices. Extracting the testID to locator mapping to be reused and map with Page objects.
 - **Scaffolding**: Assisted auto-generation of page objects and step definitions aligned with ADB/UIAutomator UI hierarchy (XML dump), speeding initial coverage.
 - **CI overview**: Summarizing pipeline structure and report strategy. Analyze the CI error/failure faster as Copilot was able to access the errors with github command line faster than human analysis time.

### Where AI Was Least Helpful
- **Runtime verification**: Could not confirm emulator/device execution without an actual run.
- **App-specific logic**: Limited insight into dynamic content without launching the app.
 - **Permission handling loop**: The agent repeatedly asked for permissions despite no dialog; a manual restart was needed to continue. This seems to be issue with copilot rather than a problem with AI tools in general.
 - **Context loss**: When the context window became very long chats the agent drifted from instructions; keeping sessions short and summarizing frequently helped. However, It was better to start a new session when it started hallucinating.
 - **Unprompted file changes**: Created duplicate docs (e.g., new README) instead of updating the existing files.
 - **Token/model limits**: Large outputs reduced quality; split work into smaller steps and avoided streaming big code blocks. Doing iterative building was better some times.




## Additional / Bonus Task
- **CI Pipeline**: GitHub Actions workflow in [.github/workflows/mobile-tests.yml](https://github.com/pr4bh4sh/BCACourseProgrammingPrivate/actions/workflows/mobile-tests.yml) provisions emulator and runs E2E. This action gets triggered for any changes in `main` branch. e.g. merge, commit. The action also gets triggered when a PR is raised against master.
- **Test Reports**: Allure results generated and published to [GitHub Pages](https://pr4bh4sh.github.io/BCACourseProgrammingPrivate) which are updated automatically after each CI run. Browserstack test runs can be viewed [here](https://app-automate.browserstack.com/projects/BCACourseProgrammingProject/builds/CI+Build/8?public_token=1f3962fa7e1ced14a5796d5fdb16669e4a609ea17228d584394823367fc26d65).
