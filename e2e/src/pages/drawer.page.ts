import { $ } from '@wdio/globals';
import BasePage from './base.page';
import HomePage from './home.page';
import ElementUtils from '../utils/element.utils';

class DrawerPage extends BasePage {
    /**
     * Element getters
     */
    get closeButton() { return $('~Close Drawer'); }

    /**
     * Open the drawer from Home screen
     */
    async open() {
        const menu = HomePage.menuButton;
        await ElementUtils.clickElement(menu, 15000);
        await this.closeButton.waitForDisplayed({ timeout: 15000 });
    }

    /**
     * Close the drawer and wait for Home menu button to reappear
     */
    async close() {
        await ElementUtils.clickElement(this.closeButton, 15000);
        await HomePage.menuButton.waitForDisplayed({ timeout: 15000 });
    }

    /**
     * Is drawer open (Close button visible)
     */
    async isOpen(): Promise<boolean> {
        return await this.isElementDisplayed(this.closeButton, 10000);
    }

    /**
     * Tap on a drawer item by label
     */
    async tapItem(label: string) {
        await this.tapByLabel(label, 15000);
    }

    /**
     * Check if a drawer item is displayed by label
     */
    async isItemDisplayed(label: string): Promise<boolean> {
        return await this.isElementDisplayedByLabel(label, 10000);
    }
}

export default new DrawerPage();
