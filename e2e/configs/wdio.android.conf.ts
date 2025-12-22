import { config as baseConfig } from './wdio.conf.js';
import path from 'path';

export const config = {
    ...baseConfig,
    capabilities: [{
        'appium:platformName': 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Android Emulator',
        'appium:app': path.join(process.cwd(), '../apps/app-debug.apk'),
        'appium:newCommandTimeout': 240,
        'appium:noReset': false,
    }],
};
