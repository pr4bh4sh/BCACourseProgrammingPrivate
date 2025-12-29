# BrowserStack Setup Documentation

## Prerequisites
- A BrowserStack account
- Project dependencies installed (see [Setup Instructions](../README.md#Prerequisites))

## Step 1: Install Required Packages
Ensure you have the necessary packages installed:
```bash
npm install --save-dev @wdio/cli @wdio/local-runner @wdio/cucumber-framework @wdio/browserstack-service
```

## Step 2: Configure WebdriverIO
See the complete WebdriverIO configuration at:
[configs/browserstack/wdio.android.bs.app.conf.ts](../configs/browserstack/wdio.android.bs.app.conf.ts)

### Key Configuration: BrowserStack Service Setup
```typescript
services: [
    [
        'browserstack',
        {
            accessibility: false,
            buildIdentifier: '${BUILD_NUMBER}',
            browserstackLocal: true,
            opts: { forcelocal: false, localIdentifier: "webdriverio-appium-app-browserstack-repo" },
            app: process.env.BROWSERSTACK_APP_PATH || 'bs://5f92c6c364aea06c0780adb9f5e0714ecb338239',
            testObservability: true,
            testObservabilityOptions: {
                'projectName': 'BCACourseProgrammingProject',
                'buildName': 'CI Build',
                'buildTag': 'BrowserStack integration check',
            },
        }
    ]
],
```

### Device Capabilities
```typescript
capabilities: [
    {
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:app': process.env.BROWSERSTACK_APP_ID || "bs://5f92c6c364aea06c0780adb9f5e0714ecb338239",
        'appium:appWaitActivity': '*.MainActivity',
        'appium:newCommandTimeout': 240,
        'bstack:options': {
            debug: true,
            deviceName: 'Samsung Galaxy S22 Ultra',
            platformVersion: '12.0',
            projectName: 'BCACourseProgrammingProject',
            buildName: 'android',
            sessionName: 'wdio-test'
        }
    },
]
```

## Step 3: Set Environment Variables Locally
For local testing, set your BrowserStack credentials as environment variables:

### macOS/Linux
```bash
export BROWSERSTACK_USER='your_username'
export BROWSERSTACK_ACCESS_KEY='your_access_key'
export BROWSERSTACK_APP_ID='your_app_id'
```

## Step 4: Run Tests Locally
Execute your tests using npm:
```bash
npm run android:browserstack
```

This will:
1. Upload your app to BrowserStack if not already uploaded
2. Create a test session on BrowserStack cloud
3. Run your Cucumber feature tests on the specified device
4. Generate an Allure report with results

## Step 5: Add Secrets to GitHub Repository
To enable automated testing via GitHub Actions, add your BrowserStack credentials as repository secrets:

### How to Add GitHub Secrets:
1. Navigate to your repository on GitHub
2. Go to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:
   - **BROWSERSTACK_USERNAME** - Your BrowserStack username
   - **BROWSERSTACK_ACCESS_KEY** - Your BrowserStack access key

For detailed instructions, see: [GitHub Documentation - Using Encrypted Secrets](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)


## Step 6: Run Tests via GitHub Actions
The BrowserStack workflow is configured to run manually:

1. Go to [Actions](https://github.com/pr4bh4sh/BCACourseProgrammingPrivate/actions/workflows/browserstack.yml) tab in GitHub repository
2. Select **BrowserStack E2E Tests** workflow
3. Click **Run workflow**
4. The workflow will:
   - Install dependencies
   - Run tests on BrowserStack
   - Generate Allure reports
   - Upload artifacts for review
