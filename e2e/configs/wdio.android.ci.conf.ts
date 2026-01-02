import { join } from 'node:path';
import { config as baseConfig } from './wdio.shared.conf.ts';
import { browser } from '@wdio/globals';
import path from 'path';
import url from 'node:url';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export const config = {
    ...baseConfig,
    // Multiple capabilities for parallel execution
    capabilities: [
        {
            // First Emulator
            platformName: 'Android',
            'wdio:maxInstances': 1,
            'appium:deviceName': 'emulator-5554',
            'appium:udid': 'emulator-5554',
            'appium:systemPort': 8201,
            'appium:platformVersion': '11.0',
            'appium:automationName': 'UiAutomator2',
            'appium:orientation': 'PORTRAIT',
            'appium:app': join(process.cwd(), '../apps/app-debug.apk'),
            'appium:appWaitActivity': '*.MainActivity',
            'appium:newCommandTimeout': 240,
            'appium:noReset': false,
        },
    ],

    // CI-optimized configuration
    logLevel: 'debug',
    waitforTimeout: 45000,

    // Disable screenshots on every step to save artifacts in CI
    mochaOpts: {
        ...baseConfig.mochaOpts,
        timeout: 5 * 60 * 1000, // 5 minutes for CI
    },

    before: async () => {
        // Update Appium settings for Android
        if (browser.isAndroid) {
            await browser.updateSettings({
                waitForSelectorTimeout: 3 * 1000
            });
        }
    }
};
