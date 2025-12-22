import type { Options } from '@wdio/types';
import { browser } from '@wdio/globals';
import allureReporter from '@wdio/allure-reporter';
import path from 'path';
import fs from 'fs';

export const config: Options.Testrunner = {
    runner: 'local',
    autoCompileOpts: {
        autoCompile: true,
        tsNodeOpts: {
            project: './tsconfig.json',
            transpileOnly: true
        }
    },
    specs: [
        '../tests/features/**/*.feature'
    ],
    exclude: [],
    maxInstances: 1,
    capabilities: [],
    logLevel: 'info',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    services: [
        ['appium', {
            args: {
                log: './appium.log',
                basePath: '/'
            }
        }]
    ],
    framework: 'cucumber',
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'allure-results',
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: true, // Avoid duplicate screenshots
        }]
    ],
    cucumberOpts: {
        require: ['./tests/steps/**/*.ts'],
        backtrace: false,
        requireModule: [],
        dryRun: false,
        failFast: false,
        snippets: true,
        source: true,
        strict: false,
        tagExpression: '',
        timeout: 60000,
        ignoreUndefinedDefinitions: false
    },
    beforeScenario: async function () {
        await browser.startRecordingScreen();
    },
    afterStep: async function (step: any, scenario: any, result: any, context: any) {
        if (!result.passed) {
            const screenshot = await browser.takeScreenshot();
            allureReporter.addAttachment('Screenshot', Buffer.from(screenshot, 'base64'), 'image/png');
        }
    },
    afterScenario: async function (world: any, result: any) {
        const video = await browser.stopRecordingScreen();
        if (!result.passed) {
            // Attach Video
            allureReporter.addAttachment('Execution Video', Buffer.from(video, 'base64'), 'video/mp4');

            // Attach ADB Logs (Logcat)
            const logcat = await browser.getLogs('logcat');
            allureReporter.addAttachment('ADB Logs (Logcat)', JSON.stringify(logcat, null, 2), 'application/json');

            // Attach Appium Server Logs from file
            try {
                if (fs.existsSync('./appium.log')) {
                    const serverLogs = fs.readFileSync('./appium.log', 'utf8');
                    allureReporter.addAttachment('Appium Server Logs', serverLogs, 'text/plain');
                }
            } catch (e) {
                console.warn('Failed to attach Appium server logs:', e);
            }
        }
    }
};
