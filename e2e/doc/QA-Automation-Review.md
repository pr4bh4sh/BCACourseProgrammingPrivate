# QA Automation Review

## React Native Project (app) — Setup & Run
- **Selected application**: https://github.com/DevVibhor/BCACourseProgramming and forked for the assignment at [pr4bh4sh/BCACourseProgrammingPrivate](https://github.com/pr4bh4sh/BCACourseProgrammingPrivate)
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
- **App Overview**: The application under test is an educational app with Home, CodeView, Compiler, Interview, MCQ, Blog, Memes, and Ebooks.
- **Navigation**: Drawer + Stack via [src/Utils/Routes.js](../../src/Utils/Routes.js); theme driven by [App.js](../../App.js).
- **Automation Test focus and scope**: Home navigation, menu
- **IDs for stability**: All interactive elements use `testID` following `feature.component.type` (mapped in [locator-mapping/selectors/](../../locator-mapping/selectors)). These were generated using AI; the agent session is logged at [Ai-prompt-log/accessibility_labels_session.md](../../Ai-prompt-log/accessibility_labels_session.md).

## Automation Tests — Frameworks Considered
- **Detox**: Fast gray-box for React Native testing; tight Metro/JS integration; limited cross-platform device coverage.
- **Appium + WebdriverIO**: Device-native, broad Android/iOS support; works with `testID`; slightly heavier setup.
- **Maestro**: Declarative flows, easy onboarding; less granular element APIs for complex apps.


## Selected Framework & Rationale (Pros / Cons)
- **Choice**: WebdriverIO + Appium + Cucumber BDD.
- **Pros**: Cross-platform, uses RN `testID`, rich waits/page objects, Allure reporting, CI-friendly. Appium supports application backdoor.
- **Cons**: Slower than Detox, emulator provisioning complexity, selector flakiness if a `testID` is missing.
- **Technical fit**: Appium `uiautomator2` and XCUITest expose RN `testID` as `id`/`accessibilityId`, enabling stable selectors.
- **BDD alignment**: Cucumber makes scenarios business-readable while Page Object Model (POM) encapsulates device actions; Allure integrates step annotations/screenshots.
- **CI suitability**: WDIO is configurable with multiple CI tools, artifact publishing, and more emulator controls and configuration options. CI config is already defined in [.github/workflows/mobile-tests.yml](../../.github/workflows/mobile-tests.yml).
- **Trade-offs with Detox and Maestro**:
    - Detox offers faster JS-driven tests but lacks system-level interaction, e.g., permission/notification dialog handling, navigation to OS settings, Wi‑Fi/data connection toggles required to set up the device for testing.
    - Maestro is YAML-driven and lacks capability to create complex tests as well as reusability. It is good for static apps; however, it is not suitable for complex navigation and highly dynamic apps. Also, it doesn't support application backdoors.


## How to Run Automation Tests
- **Prepare APK**: Build or download latest debug APK.
- **Run tests (Android)**: Execute Cucumber suite from [README.md](../README.md); generate Allure report.
- **Configs**: Shared settings in [../configs/wdio.shared.conf.ts](../configs/wdio.shared.conf.ts); Android in [../configs/wdio.android.app.cucumber.conf.ts](../configs/wdio.android.app.cucumber.conf.ts).

Here are short steps to run tests once the environment is set up:
```bash
# From e2e/
npm install
npm run download:android            # Fetch latest APK
npm run android:cucumber            # Run full suite
npm run android:cucumber -- --tags @smoke # Run only smoke tests
npm run allure:report               # Generate Allure report and open it
```

## Improvements & Next Steps
- **Stabilize selectors**: Audit screens to ensure consistent `testID`; expand YAML mappings (e.g., Home, Interview). Create a template and naming convention for `testID` to help during app development.
- **Device coverage**: Add iOS config [../configs/wdio.ios.conf.ts](../configs/wdio.ios.conf.ts) to run CI tests on the iOS Simulator.
- **Parallel runs**: Enable WDIO `workers` and shard by Cucumber tags to reduce build time. This will also require configuring multiple emulators on CI.
- **Smart test selection**: Run `@smoke` only when app code changes; full `@regression` on main merges; cache APKs between jobs, so the app does not rebuild when there are no app code changes (e.g., only server-side changes).
- **Flaky test reduction**: Configure retry logic (max retries) and a failure threshold to terminate the build when an unusually large number of tests are failing.
- **Monitoring and observability**: Add links to test results in GitHub PRs; GitHub notifies the status of triggered actions via email and app notification. Generate additional Slack/SMS notifications when anomalies are detected (e.g., app crash, unusual build termination, a large number of tests failing).
- **Visual regression & localization**: Add screenshot-diff checks with per-theme/device baselines (e.g., [wdio image comparison](https://webdriver.io/docs/visual-testing/), or paid tool [Percy.io](https://percy.io/)) and add locale-switch scenarios validating translated content/RTL layouts; keep selectors `testID`-based to avoid text flakiness with language change.
- **Reporting history**: The current configuration with Allure on CI shows only the latest test execution and doesn't preserve history. We can retain history by hosting the reports outside GitHub Pages to keep historical data for each run. The current approach of storing reports in GitHub Pages will increase the repository size.
- **Git commit hooks**: Add Husky and lint-staged to run ESLint/Prettier and `tsc --noEmit` on staged files for pre-commit and pre-push hooks.


## AI Usage & Judgement — How AI Was Used
- **Code discovery**: I used AI to summarize app architecture and source code, analyze WCAG (accessibility standard) locators (accessibilityId, labels), and create a strategy for adding `testID` to make the application testable. Later, when the app was ready to test, it bootstrapped key files (WDIO config, project setup documentation, Page Object Model (POM) generated with screen dumps, tests).
- **Documentation drafting**: Used AI to generate this and other documents in this repo, reviewed the document, and checked for accuracy of file-linked references.
- **Test locator stability**: Created selector conventions for stable `testID` patterns, created locator mapping YAMLs. Utilize these YAMLs for generating and correcting locators in page object model files to reduce rework and trace locator changes.
- **CI config generation and failure analysis**: Created CI config for automated test runs on GitHub Actions, analyze failures, and fix issues on CI runs.
- **Test execution and fixes**: Used AI to analyze test failures and prompted it to suggest the probable root cause and possible fixes. Chose optimal fixes among the suggestions when AI provided options; and nudged for better analysis and course-corrected when I knew from experience that AI suggestions were wrong or not in the right direction.

### Review Process
- **Base prompt**: Updated the base prompt to adapt based on the errors and incorrect assumptions AI was making.
- **Plan modification**: When using AI in planning mode, reviewed and updated the plan to align with the goal. Reviewed AI-generated TODO steps to reflect the desired output.
- **Prompts**: Reviewed every AI-generated code and document and fine-tuned the initial prompt to get optimal/satisfactory results.
- **Code Review**: All code generation was reviewed before accepting the changes, same as if a human coworker had created the PR.


### Where AI Was Most Helpful
- **Repo mapping**: Quick identification of E2E stack and key configuration files.
- **High level documentation**: Producing runnable commands and test/run sections fast. Verifying the steps by prompting it to follow the setup documents.
- **Standardization**: Reinforcing `testID` patterns and BDD/Page Object best practices. Extracting the `testID` to locator mapping to be reused and mapped with Page Objects.
 - **Scaffolding**: Assisted auto-generation of page objects and step definitions aligned with ADB/UIAutomator UI hierarchy (XML dump), speeding initial coverage.
 - **CI overview**: Summarizing pipeline structure and report strategy. Analyze CI errors/failures faster as Copilot was able to access the errors with GitHub command line faster than human analysis time.

### Where AI Was Least Helpful
- **Runtime verification**: Could not confirm emulator/device execution without an actual run.
- **App-specific logic**: Limited insight into dynamic content without launching the app.
 - **Command Permission handling loop**: The agent repeatedly asked for permissions to execute command despite no popup to accept it, a manual restart was needed to continue. This seems to be an issue with Copilot rather than a problem with AI tools in general.
 - **Context loss**: When the context window became very long chats the agent drifted from instructions; keeping sessions short and summarizing frequently helped. However, It was better to start a new session when it started hallucinating.
 - **Unprompted file changes**: Created duplicate docs (e.g., new README) instead of updating the existing files.
 - **Token/model limits**: Large outputs reduced quality; split work into smaller steps and avoided streaming big code blocks. Iterative building was better sometimes.
- **Obsolete document references**: By the nature of how AI is trained, code generation and APIs sometimes referenced old documents. For example, when I created the scaffolding for the CI config, some action references were outdated.


> Note: AI prompts are logged at [Ai-prompt-log](../../Ai-prompt-log/). The base prompt for E2E tests is at [e2e/.prompt/base-prompt.md](../../e2e/.prompt/base-prompt.md), and the application prompt is at [.github/copilot-instructions.md](../../.github/copilot-instructions.md).

## Additional / Bonus Task
- **CI Pipeline**: GitHub Actions workflow in [.github/workflows/mobile-tests.yml](https://github.com/pr4bh4sh/BCACourseProgrammingPrivate/actions/workflows/mobile-tests.yml) provisions an emulator and runs E2E. This action gets triggered for any changes in the `main` branch (e.g., merges, commits). The action also gets triggered when a PR is raised against `main`.
- **Test Reports**: Allure results are generated and published to [GitHub Pages](https://pr4bh4sh.github.io/BCACourseProgrammingPrivate) and are updated automatically after each CI run. BrowserStack test runs can be viewed [here](https://app-automate.browserstack.com/projects/BCACourseProgrammingProject/builds/CI+Build/8?public_token=1f3962fa7e1ced14a5796d5fdb16669e4a609ea17228d584394823367fc26d65).
