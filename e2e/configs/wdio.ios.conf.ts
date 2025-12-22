import { config as baseConfig } from './wdio.conf';
import path from 'path';

export const config = {
    ...baseConfig,
    capabilities: [{
        'appium:platformName': 'iOS',
        'appium:automationName': 'XCUITest',
        'appium:deviceName': 'iPhone Simulator',
        'appium:app': path.join(process.cwd(), '../ios/build/Build/Products/Debug-iphonesimulator/BCACourseProgramming.app'), // Adjust path as needed
        'appium:newCommandTimeout': 240,
        'appium:noReset': false,
    }],
};
