import { browser, $ } from '@wdio/globals';
export default class DriverUtils {
    /**
     * Wait for element to be displayed
     */
    static async waitForDisplayed(selector: string, timeout = 10000) {
        const el = await $(selector);
        await el.waitForDisplayed({ timeout });
        return el;
    }

    /**
     * Click on element after waiting for it
     */
    static async click(selector: string) {
        const el = await this.waitForDisplayed(selector);
        await el.click();
    }

    /**
     * Set value of element after waiting for it
     */
    static async setValue(selector: string, value: string) {
        const el = await this.waitForDisplayed(selector);
        await el.setValue(value);
    }

    /**
     * Scroll until element with text is found (Android specific)
     */
    static async scrollIntoViewAndroid(text: string, maxScrolls = 5) {
        try {
            // Try using accessibility label first (more reliable)
            const element = await $(`~${text}`);
            if (await element.isDisplayed()) {
                return element;
            }
        } catch (e) {
            // Element not visible, proceed with scrolling
        }

        // Use UiAutomator2 scroll strategy
        await driver.execute('mobile: scrollGesture', {
            left: 100,
            top: 500,
            width: 800,
            height: 1500,
            direction: 'down',
            percent: 3.0
        });
        
        // Wait a bit for elements to load
        await browser.pause(1000);
    }

    /**
     * Swipe (generic)
     */
    static async swipe(from: { x: number, y: number }, to: { x: number, y: number }) {
        await browser.performActions([
            {
                type: 'pointer',
                id: 'finger1',
                parameters: { pointerType: 'touch' },
                actions: [
                    { type: 'pointerMove', duration: 0, x: from.x, y: from.y },
                    { type: 'pointerDown', button: 0 },
                    { type: 'pointerMove', duration: 1000, x: to.x, y: to.y },
                    { type: 'pointerUp', button: 0 },
                ],
            },
        ]);
    }
}
