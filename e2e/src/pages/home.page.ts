import { $ } from '@wdio/globals';
import BasePage from '../framework/pages/base.page.js';

class HomePage extends BasePage {
    /**
     * Get an element by its natural accessibility label
     * In WebdriverIO/Appium, $(`~label`) matches accessibilityLabel (Android/iOS)
     */
    getElementByLabel(label: string) {
        return $(`~${label}`);
    }

    /**
     * Check if an element with a specific label is displayed
     */
    async isLabelDisplayed(label: string) {
        return (await this.getElementByLabel(label).isDisplayed());
    }
}

export default new HomePage();
