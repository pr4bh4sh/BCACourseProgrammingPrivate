import { config as baseConfig } from './wdio.conf';
import path from 'path';

export const config = {
    ...baseConfig,
    capabilities: [{
        'appium:platformName': 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': 'Android Emulator',
        'appium:app': path.join(process.cwd(), '../android/app/build/outputs/apk/debug/app-debug.apk'), // Adjust path as needed
        'appium:newCommandTimeout': 240,
        'appium:noReset': false,
    }],
};
