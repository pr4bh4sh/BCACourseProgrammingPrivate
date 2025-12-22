import { Given, Then, When } from '@wdio/cucumber-framework';
import { expect, browser, $ } from '@wdio/globals';
import HomePage from '../../src/pages/home.page.js';
import DriverUtils from '../../src/framework/utils/driver.utils.js';
import ElementUtils from '../../src/framework/utils/element.utils.js';

Given(/^the "([^"]*)" is displayed$/, async (label) => {
    await HomePage.getElementByLabel(label).waitForDisplayed({ timeout: 20000 });
});

Then(/^I should see the "([^"]*)"$/, async (label) => {
    await expect(HomePage.getElementByLabel(label)).toBeDisplayed();
});

Then(/^I should see the following cards:$/, async (dataTable: any) => {
    const cards = dataTable.raw();
    for (const card of cards) {
        await expect(HomePage.getElementByLabel(card[0])).toBeDisplayed();
    }
});

// Scroll to element by label
When(/^I scroll to the "([^"]*)" card$/, async (label) => {
    await DriverUtils.scrollIntoViewAndroid(label);
});

// Tap on card by label
When(/^I tap on the "([^"]*)" card$/, async (label) => {
    const element = HomePage.getElementByLabel(label);
    await element.waitForDisplayed({ timeout: 10000 });
    await element.click();
});

// Verify button or text is displayed using multiple strategies
Then(/^I should see the "([^"]*)" button$/, async (buttonLabel) => {
    const element = await ElementUtils.getElementByMultipleStrategies(buttonLabel, ['label', 'text']);
    await element.waitForDisplayed({ timeout: 10000 });
    await expect(element).toBeDisplayed();
});

// Go back to home
When(/^I go back to home$/, async () => {
    await browser.back();
    // Wait for home screen to be displayed
    await HomePage.menuButton.waitForDisplayed({ timeout: 10000 });
});

// Tap notifications button
When(/^I tap on the notifications button$/, async () => {
    await HomePage.notificationsButton.click();
});

// Verify notifications panel is displayed
Then(/^the notifications panel should be displayed$/, async () => {
    // Check if the notifications panel/bottom sheet is visible
    // Using a generic approach to find scrollable content
    const notificationsPanel = await $('android.widget.ScrollView');
    await notificationsPanel.waitForDisplayed({ timeout: 10000 });
    await expect(notificationsPanel).toBeDisplayed();
});

// Scroll down in notifications panel
When(/^I scroll down in the notifications panel$/, async () => {
    const { height } = await browser.getWindowSize();
    await DriverUtils.swipe(
        { x: 500, y: height * 0.7 },
        { x: 500, y: height * 0.3 }
    );
});

// Verify additional notification content
Then(/^I should see additional notification content$/, async () => {
    // After scrolling, verify that content is still visible
    const notificationsPanel = await $('android.widget.ScrollView');
    await expect(notificationsPanel).toBeDisplayed();
});

// Verify cards are displayed (simpler than clickable check)
Then(/^the following cards should be displayed:$/, async (dataTable: any) => {
    const cards = dataTable.raw();
    for (const card of cards) {
        const element = HomePage.getElementByLabel(card[0]);
        await element.waitForDisplayed({ timeout: 10000 });
        await expect(element).toBeDisplayed();
    }
});

