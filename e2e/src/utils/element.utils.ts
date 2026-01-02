import { $ } from '@wdio/globals';

export default class ElementUtils {
    /**
     * Get element by trying multiple strategies in order:
     * 1. Accessibility label (iOS/Android)
     * 2. Text content (Android UiSelector)
     * 3. Resource ID (Android)
     * 
     * @param identifier - The text/label/id to search for
     * @param strategies - Optional array of strategies to try. Defaults to ['label', 'text']
     * @returns WebdriverIO element
     */
    static async getElementByMultipleStrategies(
        identifier: string,
        strategies: ('label' | 'text' | 'id')[] = ['label', 'text']
    ) {
        for (const strategy of strategies) {
            let element;

            switch (strategy) {
                case 'label':
                    // Accessibility label (works on both iOS and Android)
                    element = $(`~${identifier}`);
                    break;
                case 'text':
                    // Text content using Android UiSelector
                    element = $(`android=new UiSelector().text("${identifier}")`);
                    break;
                case 'id':
                    // Resource ID
                    element = $(`id=${identifier}`);
                    break;
            }

            // Check if element exists and is displayed
            const isDisplayed = await element.isDisplayed().catch(() => false);
            if (isDisplayed) {
                return element;
            }
        }

        // If no strategy worked, return element with first strategy for error reporting
        return strategies[0] === 'label'
            ? $(`~${identifier}`)
            : $(`android=new UiSelector().text("${identifier}")`);
    }

    /**
     * Get element by text content (Android UiSelector)
     */
    static getElementByText(text: string) {
        return $(`android=new UiSelector().text("${text}")`);
    }

    /**
     * Get element by text containing (Android UiSelector)
     */
    static getElementByTextContains(text: string) {
        return $(`android=new UiSelector().textContains("${text}")`);
    }

    /**
     * Get element by resource ID
     */
    static getElementById(id: string) {
        return $(`id=${id}`);
    }

    /**
     * Get element by accessibility label
     */
    static getElementByLabel(label: string) {
        return $(`~${label}`);
    }

    /**
     * Click element by accessibility label with wait for display
     * @param label - The accessibility label to click
     * @param timeout - Optional timeout in milliseconds (default: 15000)
     */
    static async clickByLabel(label: string, timeout = 15000) {
        const element = this.getElementByLabel(label);
        await element.waitForDisplayed({ timeout });
        await element.click();
    }

    /**
     * Click element by resource ID with wait for display
     * @param id - The resource ID to click
     * @param timeout - Optional timeout in milliseconds (default: 15000)
     */
    static async clickById(id: string, timeout = 15000) {
        const element = this.getElementById(id);
        await element.waitForDisplayed({ timeout });
        await element.click();
    }

    /**
     * Click element by text content with wait for display
     * @param text - The text content to click
     * @param timeout - Optional timeout in milliseconds (default: 15000)
     */
    static async clickByText(text: string, timeout = 15000) {
        const element = this.getElementByText(text);
        await element.waitForDisplayed({ timeout });
        await element.click();
    }

    /**
     * Generic click method - click an element after waiting for it to be displayed
     * @param element - The WebdriverIO element to click
     * @param timeout - Optional timeout in milliseconds (default: 15000)
     */
    static async clickElement(element: any, timeout = 15000) {
        await element.waitForDisplayed({ timeout });
        await element.click();
    }

    /**
     * Check if an element is displayed - returns boolean without throwing errors
     * @param element - The WebdriverIO element to check
     * @param timeout - Optional timeout in milliseconds (default: 10000)
     * @returns true if element is displayed, false otherwise
     */
    static async isElementDisplayed(element: any, timeout = 10000): Promise<boolean> {
        try {
            await element.waitForDisplayed({ timeout });
            return await element.isDisplayed();
        } catch (error) {
            return false;
        }
    }
}
