import { Given, Then } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import HomePage from '../../src/pages/home.page.js';

Given(/^the "([^"]*)" is displayed$/, async (label) => {
    await HomePage.getElementByLabel(label).waitForDisplayed({ timeout: 20000 });
});

Then(/^I should see the "([^"]*)"$/, async (label) => {
    await expect(HomePage.getElementByLabel(label)).toBeDisplayed();
});

Then(/^I should see the "([^"]*)" card$/, async (label) => {
    await expect(HomePage.getElementByLabel(label)).toBeDisplayed();
});
