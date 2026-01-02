import { $, browser } from '@wdio/globals';
import BasePage from './base.page';
import ElementUtils from '../utils/element.utils';
import DriverUtils from '../utils/driver.utils';

class HomePage extends BasePage {

    // Page Title
    get pageTitle() { return $('~Open Menu'); }

    // Header Elements
    get menuButton() { return $('~Open Menu'); }
    get notificationsButton() { return $('id=header.button.notifications'); }
    get backButton() { return $('id=header.button.back'); }

    // Semester Cards
    get semester1Card() { return $('id=home.card.sem1'); }
    get semester2Card() { return $('id=home.card.sem2'); }
    get semester3Card() { return $('id=home.card.sem3'); }
    get semester4Card() { return $('id=home.card.sem4'); }
    get semester5Card() { return $('id=home.card.sem5'); }
    get semester6Card() { return $('id=home.card.sem6'); }

    // Feature Cards
    get interviewCard() { return $('id=home.card.interview'); }
    get careerGuidanceCard() { return $('id=home.card.blog'); }
    get compilerCard() { return $('id=home.card.compiler'); }
    get rateUsCard() { return $('id=home.card.rateUs'); }
    get shareCard() { return $('id=home.card.share'); }
    get contributeCard() { return $('id=home.card.contribute'); }

    // Modal Elements - Rate Us
    get rateUsModalCloseButton() { return $('id=home.modal.rateUs.button.close'); }
    get rateUsModalRateNowButton() { return $('id=home.modal.rateUs.button.rateNow'); }

    // Modal Elements - Update
    get updateModalCloseButton() { return $('id=home.modal.update.button.close'); }
    get updateModalUpdateNowButton() { return $('id=home.modal.update.button.updateNow'); }

    // Helper method to get semester card by number
    getSemesterCard(semesterNumber: number) {
        return $(`id=home.card.sem${semesterNumber}`);
    }

    /**
     * Tap on a card by label
     */
    async tapCard(label: string) {
        await this.tapByLabel(label, 15000);
    }

    /**
     * Tap on notifications button - uses ElementUtils for consistency
     */
    async tapNotificationsButton() {
        await ElementUtils.clickElement(this.notificationsButton, 10000);
    }

    /**
     * Get notifications panel element
     */
    getNotificationsPanel() {
        return $('android.widget.ScrollView');
    }

    /**
     * Check if button is displayed using multiple locator strategies
     * Tries: accessibility label first, then text content
     */
    async isButtonDisplayed(buttonLabel: string): Promise<boolean> {
        const element = await ElementUtils.getElementByMultipleStrategies(buttonLabel, ['label', 'text']);
        return await this.isElementDisplayed(element, 10000);
    }

    /**
     * Check if notifications panel is displayed
     */
    async isNotificationsPanelDisplayed(): Promise<boolean> {
        const panel = this.getNotificationsPanel();
        return await this.isElementDisplayed(panel, 10000);
    }

    /**
     * Scroll down in notifications panel
     */
    async scrollDownInNotifications() {
        const { height } = await browser.getWindowSize();
        await DriverUtils.swipe(
            { x: 500, y: height * 0.7 },
            { x: 500, y: height * 0.3 }
        );
    }

    /**
     * Check if a card is displayed by label
     */
    async isCardDisplayed(cardLabel: string, timeout = 10000): Promise<boolean> {
        return await this.isElementDisplayedByLabel(cardLabel, timeout);
    }

    /**
     * Open the menu drawer
     */
    async openMenuDrawer() {
        await ElementUtils.clickElement(this.menuButton, 10000);
    }

    /**
     * Check if menu drawer is displayed
     */
    async isMenuDrawerDisplayed(): Promise<boolean> {
        const drawer = $('id=drawer.menu');
        return await this.isElementDisplayed(drawer, 10000);
    }

    /**
     * Check if a menu section is displayed by label
     */
    async isMenuSectionDisplayed(sectionLabel: string): Promise<boolean> {
        return await this.isElementDisplayedByLabel(sectionLabel, 10000);
    }
}

export default new HomePage();
