import { join } from "node:path";
import { config as baseConfig } from "./wdio.shared.local.appium.conf.js";
import { browser } from '@wdio/globals';
import path from "path";
import url from "node:url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
// We need to remove the `mochaOpts` from the `baseConfig` to have all
// Mocha references removed
const { mochaOpts: _mochaOpts, ...cleanBaseConfig } = baseConfig;

export const config = {
    ...cleanBaseConfig,

    // ============
    // Capabilities
    // ============
    // For all capabilities please check
    // https://github.com/appium/appium-uiautomator2-driver
    capabilities: [
        {
            // The defaults you need to have in your config
            platformName: "Android",
            "wdio:maxInstances": 1,
            // For W3C the appium capabilities need to have an extension prefix
            // This is `appium:` for all Appium Capabilities which can be found here

            //
            // NOTE: Change this name according to the Emulator you have created on your local machine
            "appium:deviceName": "emulator-5554",
            "appium:udid": "emulator-5554",
            //
            // NOTE: Change this version according to the Emulator you have created on your local machine
            "appium:platformVersion": "16.0",
            "appium:orientation": "PORTRAIT",
            "appium:automationName": "UiAutomator2",
            // The path to the app
            'appium:app': path.join(process.cwd(), '../apps/app-debug.apk'),
            'appium:appWaitActivity': '*.MainActivity',
            "appium:newCommandTimeout": 240,
            "appium:noReset": false,
        },
    ],
};
