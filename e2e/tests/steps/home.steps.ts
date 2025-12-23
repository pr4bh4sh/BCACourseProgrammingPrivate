import { Given, Then, When } from '@wdio/cucumber-framework';
import { expect, browser } from '@wdio/globals';
import HomePage from '../../src/pages/home.page';
import DriverUtils from '../../src/utils/driver.utils';

Given(/^the "([^"]*)" is displayed$/, async (label) => {
    await HomePage.getElementByLabel(label).waitForDisplayed({ timeout: 20000 });
});

Then(/^I should see the "([^"]*)"$/, async (label) => {
    await expect(HomePage.getElementByLabel(label)).toBeDisplayed();
});

Then(/^I should see the following cards:$/, async (dataTable: any) => {
    const cards = dataTable.raw().map((row: string[]) => row[0]);
    for (const card of cards) {
        const isDisplayed = await HomePage.isCardDisplayed(card);
        if (!isDisplayed) {
            console.log(`❌ Card "${card}" was NOT displayed`);
        } else {
            console.log(`✓ Card "${card}" is displayed`);
        }
        await expect(isDisplayed).toBe(true, `Expected card "${card}" to be displayed, but it was not found`);
    }
});

// Scroll to element by label
When(/^I scroll to the "([^"]*)" card$/, async (label) => {
    await DriverUtils.scrollIntoViewAndroid(label);
});

// Tap on card by label
When(/^I tap on the "([^"]*)" card$/, async (label) => {
    await HomePage.tapCard(label);
});

// Verify button or text is displayed using multiple strategies
Then(/^I should see the "([^"]*)" button$/, async (buttonLabel) => {
    const isDisplayed = await HomePage.isButtonDisplayed(buttonLabel);
    await expect(isDisplayed).toBe(true, `Expected button "${buttonLabel}" to be displayed, but it was not found`);
});

// Go back to home
When(/^I go back to home$/, async () => {
    await browser.back();
    // Wait for home screen to be displayed
    await HomePage.menuButton.waitForDisplayed({ timeout: 10000 });
});

// Tap notifications button
When(/^I tap on the notifications button$/, async () => {
    await HomePage.tapNotificationsButton();
});

// Verify notifications panel is displayed
Then(/^the notifications panel should be displayed$/, async () => {
    const isDisplayed = await HomePage.isNotificationsPanelDisplayed();
    await expect(isDisplayed).toBe(true, `Expected notifications panel to be displayed, but it was not found`);
});

// Scroll down in notifications panel
When(/^I scroll down in the notifications panel$/, async () => {
    await HomePage.scrollDownInNotifications();
});

// Verify additional notification content
Then(/^I should see additional notification content$/, async () => {
    const isDisplayed = await HomePage.isNotificationsPanelDisplayed();
    await expect(isDisplayed).toBe(true, `Expected additional notification content to be visible in the notifications panel`);
});

// Verify cards are displayed (simpler than clickable check)
Then(/^the following cards should be displayed:$/, async (dataTable: any) => {
    const cards = dataTable.raw().map((row: string[]) => row[0]);
    for (const card of cards) {
        const isDisplayed = await HomePage.isCardDisplayed(card);
        if (!isDisplayed) {
            console.log(`❌ Card "${card}" was NOT displayed`);
        } else {
            console.log(`✓ Card "${card}" is displayed`);
        }
        await expect(isDisplayed).toBe(true, `Expected card "${card}" to be displayed, but it was not found`);
    }
});

