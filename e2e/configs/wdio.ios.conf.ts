import { config as localAppiumConfig } from './wdio.shared.local.appium.conf.ts';
import path from 'path';

export const config = {
    ...localAppiumConfig,
    capabilities: [{
        platformName: 'iOS',
        'appium:automationName': 'XCUITest',
        'appium:deviceName': 'iPhone Simulator',
        'appium:platformVersion': '15.0',
        'appium:app': path.join(process.cwd(), '../ios/build/Build/Products/Debug-iphonesimulator/BCACourseProgramming.app'),
        'appium:newCommandTimeout': 240,
        'appium:noReset': false,
    }],
};
