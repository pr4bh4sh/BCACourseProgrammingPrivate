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

    // Header Elements
    get menuButton() { return $('~Open Menu'); }
    get notificationsButton() { return $('~Notifications'); }
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
}

export default new HomePage();
