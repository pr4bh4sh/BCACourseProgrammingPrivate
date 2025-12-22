import { Given, When, Then } from '@wdio/cucumber-framework';
import LoginPage from '../../src/pages/login.page';
import DriverUtils from '../../src/framework/utils/driver.utils';

Given(/^the login screen is displayed$/, async () => {
    await LoginPage.emailInput.waitForDisplayed();
});

When(/^I enter "([^"]*)" and "([^"]*)"$/, async (email, password) => {
    await LoginPage.login(email, password);
});

When(/^I tap on the login button$/, async () => {
    await LoginPage.loginButton.click();
});

Then(/^I should be redirected to the home screen$/, async () => {
    // Basic verification, e.g., wait for an element on the home screen
    await DriverUtils.waitForDisplayed('~home-screen-header');
});

Then(/^I should see an error message "([^"]*)"$/, async (expectedError) => {
    const errorMsg = await LoginPage.errorMessage.getText();
    expect(errorMsg).toContain(expectedError);
});
