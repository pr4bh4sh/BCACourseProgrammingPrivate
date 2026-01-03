import { $ } from '@wdio/globals';
import BasePage from './base.page';
import ElementUtils from '../utils/element.utils';

class SectionPage extends BasePage {

    // Override getPageTitle method from BasePage
    getPageTitle(title: string) {
        return $(`android=new UiSelector().text("${title}")`);
    }

    // Header Elements
    get backButton() { return $('id=header.button.back'); }
    get menuButton() { return $('id=header.button.menu'); }

    async isTitleDisplayed(title: string): Promise<boolean> {
        return await this.isElementDisplayedByLabel(title, 5000);
    }

    /**
     * Tap back button to go back
     */
    async tapBackButton() {
        await ElementUtils.clickElement(this.backButton, 10000);
    }

    /**
     * Tap menu button to open drawer
     */
    async tapMenuButton() {
        await ElementUtils.clickElement(this.menuButton, 10000);
    }

    /**
     * Check if page is displayed (using text or accessibility label)
     */
    async isPageDisplayed(): Promise<boolean> {
        return await this.isElementDisplayedByLabel('Interview Questions', 15000);
    }
}

export default new SectionPage();
