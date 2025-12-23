import { execSync } from 'node:child_process';
import { browser } from '@wdio/globals';
import { config as sharedConfig } from './wdio.shared.conf.js';

/**
 * Check if a port is in use
 */
function isPortInUse(port: number): boolean {
    try {
        // On macOS/Linux, lsof -i :port returns 0 if the port is in use
        execSync(`lsof -i :${port}`, { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

// If you want to use an already running Appium server, set the environment variable USE_EXISTING_SERVER to true
// Example: USE_EXISTING_SERVER=true npm run android.app
const port = parseInt(process.env.PORT || '4723', 10);
const useExistingServer = process.env.USE_EXISTING_SERVER === 'true' || isPortInUse(port);

if (useExistingServer) {
    console.log(`\nℹ️  Detected Appium server already running on port ${port}. Using existing server.\n`);
}

export const config = {
    ...sharedConfig,

    //
    // =================
    // Service Provider
    // =================
    //
    port: port,

    //
    // ======
    // Appium
    // ======
    //
    // If we use an existing server, we don't need the appium service to start/stop it
    services: [
        ...(sharedConfig.services || []),
        ...(useExistingServer ? [] : [
            [
                'appium',
                {
                    // This will use the globally installed version of Appium
                    // command: 'appium',
                    args: {
                        // The port on which the Appium server should be started.
                        // Default is 4723. Change this if you have multiple servers or port conflicts.
                        port: port,

                        // Relaxed Security: Allows Appium to execute potentially insecure features like ADB shell commands.
                        // ENABLE: When you need to run 'adb' commands directly or use features that require system-level access.
                        // DISABLE: In highly secure environments where you want to restrict Appium's capabilities.
                        relaxedSecurity: true,

                        // Allow CORS: Enables Cross-Origin Resource Sharing.
                        // ENABLE: Required for web-based inspectors (like https://inspector.appiumpro.com/) to communicate with your local Appium server.
                        // DISABLE: If you only use the desktop Appium Inspector app and want to restrict browser access to the server.
                        allowCors: true,

                        // Log Timestamp: Adds a timestamp to each log entry.
                        // ENABLE: For better debugging and tracking the timing of events during test execution.
                        // DISABLE: If you prefer cleaner logs without timing information.
                        logTimestamp: true,

                        // Log: Specifies the file path where Appium server logs will be written.
                        // Useful for troubleshooting server-side issues after a test run.
                        log: './logs/appium.log',

                        // Use Plugins: Specifies which Appium plugins to load on startup.
                        // ENABLE: To extend Appium's functionality (e.g., 'inspector' for the web-based element inspector).
                        // DISABLE: To run a "vanilla" Appium server with minimal overhead.
                        // usePlugins: 'inspector',

                        // Allow Insecure: Explicitly allows specific features that are considered insecure and disabled by default.
                        // 'session_discovery': Required for Appium 3.x to allow inspectors to list and connect to active sessions.
                        // ENABLE: When using external tools that need to "find" your running test session.
                        // DISABLE: To prevent unauthorized tools from discovering active automation sessions.
                        allowInsecure: 'session_discovery',
                    },
                },
            ],
        ]),
    ],
    before: async ()=> {
        // Only update the setting for Android, this is needed to reduce the timeout for the UiSelector locator strategy,
        // which is also used in certain tests, so it will not wait for 10 seconds if it can't find an element
        if (driver.isAndroid){
            await driver.updateSettings({
                // This reduces the timeout for the UiUiSelector from 10 seconds to 3 seconds
                waitForSelectorTimeout: 3 * 1000
            });
        }
    }
};
