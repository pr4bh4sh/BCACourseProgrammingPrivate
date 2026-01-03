import type { Options } from '@wdio/types';
import { browser } from '@wdio/globals';
import allureReporter from '@wdio/allure-reporter';
import { join } from 'path';
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'node:child_process';

const reportRoot = join(process.cwd(), 'reports');
const logsDir = join(reportRoot, 'logs');
const allureResultsDir = join(reportRoot, 'allure-results');

// Ensure report directories exist before reporters/services write to them.
if (!existsSync(reportRoot)) {
    mkdirSync(reportRoot, { recursive: true });
}
if (!existsSync(logsDir)) {
    mkdirSync(logsDir, { recursive: true });
}
if (!existsSync(allureResultsDir)) {
    mkdirSync(allureResultsDir, { recursive: true });
}

/**
 * Shared base configuration for all WebdriverIO test runs.
 * Specific configurations (Android, iOS, BrowserStack) extend this.
 */
export const config: Options.Testrunner = {
    //
    // ====================
    // Runner Configuration
    // ====================
    //
    runner: 'local',
    
    //
    // ==================
    // Specify Test Files
    // ==================
    //
    specs: [
        '../tests/features/**/*.feature'
    ],
    exclude: [],
    
    //
    // ============
    // Capabilities
    // ============
    // NOTE: Capabilities will be overwritten by each specific configuration
    //
    
    //
    // ===================
    // Test Configurations
    // ===================
    //
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    
    //
    // Test runner services
    // Services are empty here but will be defined in specific configurations
    //
    services: [],
    
    //
    // Framework
    //
    framework: 'cucumber',
    reporters: [
        'spec',
        ['allure', {
            outputDir: allureResultsDir,
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: true, // Avoid duplicate screenshots
        }]
    ],
    // Options to be passed to Mocha.
    mochaOpts: {
        ui: 'bdd',
        /**
         * NOTE: This has been increased for debugging with Appium Inspector.
         * Set to 10 minutes to allow time for element inspection.
         */
        timeout: 10 * 60 * 1000, // 10min for debugging
    },
    cucumberOpts: {
        require: ['./tests/steps/**/*.ts'],
        backtrace: true, // <boolean> show full backtrace for errors
        requireModule: [],
        dryRun: false, // <boolean> invoke formatters without executing steps
        failFast: false, // <boolean> abort the run on first failure
        snippets: true, // <boolean> hide step definition snippets for pending steps
        source: true, // <boolean> hide source URIs
        strict: false, // <boolean> fail if there are any undefined or pending steps
        tagExpression: '',
        timeout: 60000, // <number> timeout for step definitions
        ignoreUndefinedDefinitions: false, // <boolean> Enable this config to treat undefined definitions as warnings.
        scenarioLevelReporter: false, // Enable this to make webdriver.io behave as if scenarios and not steps were the tests.
    },

    /**
     * Start video recording before each scenario
     */
    beforeScenario: async function (world: any) {
        try {
            if (browser.isAndroid || browser.isIOS) {
                await browser.startRecordingScreen({
                    videoSize: '720x1280',
                    timeLimit: 180, // 3 minutes max
                    bitRate: 3000000,
                });
            }
        } catch (e) {
            console.log('Could not start screen recording:', e);
        }
    },

    /**
     * Take screenshot and video on step failure, attach logs
     */
    afterStep: async function (step: any, scenario: any, result: any, context: any) {
        if (!result.passed) {
            // Capture Screenshot
            const screenshot = await browser.takeScreenshot();
            allureReporter.addAttachment('Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');

            // Capture UI Source Dump
            try {
                const source = await browser.getPageSource();
                if (source) {
                    console.log(`Captured UI Source Dump, length: ${source.length}`);
                    allureReporter.addAttachment('UI Source Dump', source, 'application/xml');
                }
            } catch (e) {
                console.warn('Could not capture UI Source Dump:', e);
            }

            // Capture ADB Logs (Logcat) for Android
            try {
                if (browser.isAndroid) {
                    const logcat = await browser.getLogs('logcat');
                    allureReporter.addAttachment('ADB Logs (Logcat)', JSON.stringify(logcat, null, 2), 'application/json');
                }
            } catch (e) {
                console.warn('Could not capture ADB logs:', e);
            }
        }
    },

    /**
     * Stop video recording and attach artifacts on scenario end
     */
    afterScenario: async function (world: any, result: any) {
        let videoBuffer: string | undefined;
        try {
            videoBuffer = await browser.stopRecordingScreen();
        } catch (e) {
            console.log('Could not stop screen recording:', e);
        }

        if (!result.passed) {
            // Attach video recording if available
            if (videoBuffer) {
                allureReporter.addAttachment('Video Recording', Buffer.from(videoBuffer, 'base64'), 'video/mp4');
            }

            // Attach Appium server logs
            const appiumLogPath = join(logsDir, 'appium.log');
            if (existsSync(appiumLogPath)) {
                try {
                    const logContent = readFileSync(appiumLogPath, 'utf-8');
                    // Get last 500 lines of log for the attachment
                    const logLines = logContent.split('\n');
                    const recentLogs = logLines.slice(-500).join('\n');
                    allureReporter.addAttachment('Appium Server Logs (last 500 lines)', recentLogs, 'text/plain');
                } catch (e) {
                    console.log('Could not read Appium logs:', e);
                }
            }
        }

        // Reload session to get fresh app state for next scenario
        try {
            await browser.reloadSession();
        } catch (e) {
            console.log('Could not reload session:', e);
        }
    },
};
