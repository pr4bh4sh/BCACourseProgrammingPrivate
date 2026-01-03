import { $ } from '@wdio/globals';
import ElementUtils from '../utils/element.utils';

export default class BasePage {
    /**
     * Page title element - should be overridden in each page class
     */
    get pageTitle(): WebdriverIO.Element {
        throw new Error('pageTitle getter must be implemented in the page class');
    }

    /**
     * Wait for page title to be displayed (30 seconds timeout)
     */
    async waitForPage() {
        await this.pageTitle.waitForDisplayed({ timeout: 30000 });
    }

    /**
     * Wait for element to be displayed
     */
    async waitForDisplayed(selector: string) {
        const el = await $(selector);
        await el.waitForDisplayed();
    }

    /**
     * Get element by accessibility ID
     */
    getById(id: string) {
        return $(`~${id}`);
    }

    /**
     * Get element by accessibility label
     */
    getElementByLabel(label: string) {
        return $(`~${label}`);
    }

    /**
     * Check if an element is displayed by label
     * Returns true if element is displayed, false otherwise
     */
    async isElementDisplayedByLabel(label: string, timeout = 10000): Promise<boolean> {
        const element = this.getElementByLabel(label);
        return await ElementUtils.isElementDisplayed(element, timeout);
    }

    /**
     * Check if a specific element is displayed
     * Returns true if element is displayed, false otherwise
     */
    async isElementDisplayed(element: any, timeout = 10000): Promise<boolean> {
        return await ElementUtils.isElementDisplayed(element, timeout);
    }

    /**
     * Tap/Click element by label using ElementUtils
     */
    async tapByLabel(label: string, timeout = 15000) {
        await ElementUtils.clickByLabel(label, timeout);
    }

    /**
     * Wait for element by label and return it
     */
    async waitForElementByLabel(label: string, timeout = 15000) {
        const element = this.getElementByLabel(label);
        await element.waitForDisplayed({ timeout });
        return element;
    }
}
