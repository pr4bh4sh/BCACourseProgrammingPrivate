import { config as baseConfig } from '../wdio.shared.conf.js';
import path from 'path';
import url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
// Remove mochaOpts since we'll use Cucumber instead
const { mochaOpts: _mochaOpts, ...cleanBaseConfig } = baseConfig;

export const config: WebdriverIO.Config = {
    ...cleanBaseConfig,

    // ============
    // Specs - Cucumber Feature Files
    // ============
    specs: [
        path.join(__dirname, '..', '..', 'tests', 'features', '**', '*.feature')
    ],

    // ============
    // Framework
    // ============
    framework: 'cucumber',
    cucumberOpts: {
        require: [
            path.join(__dirname, '..', '..', 'tests', 'steps', '**', '*.ts')
        ],
        backtrace: false,
        compiler: [],
        dryRun: false,
        failFast: false,
        snippets: true,
        source: true,
        strict: false,
        timeout: 20000,
        ignoreUndefinedDefinitions: false,
        scenarioLevelReporter: false,
    },

    // =============================
    // Browserstack specific config
    // =============================
    // User configuration
    user: process.env.BROWSERSTACK_USER || 'BROWSERSTACK_USER',
    key: process.env.BROWSERSTACK_ACCESS_KEY || 'BROWSERSTACK_ACCESS_KEY',
    // Use browserstack service
    services: [
        [
            'browserstack',
            {
                accessibility: false,
                buildIdentifier: '${BUILD_NUMBER}',
                browserstackLocal: true,
                opts: { forcelocal: false, localIdentifier: "webdriverio-appium-app-browserstack-repo" },
                // for ios
                // app: process.env.BROWSERSTACK_APP_PATH || './examples/BStackSampleApp.ipa',
                // for android
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
    logLevel: 'info',
    waitforTimeout: 10000,
    connectionRetryTimeout: 90000,
    connectionRetryCount: 3,
    // ============
    // Capabilities
    // ============
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
};
