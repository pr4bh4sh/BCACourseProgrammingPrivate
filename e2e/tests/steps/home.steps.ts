import { Given, Then, When } from '@wdio/cucumber-framework';
import { browser } from '@wdio/globals';
import HomePage from '../../src/pages/home.page';
import SectionPage from '../../src/pages/section.page';
import DriverUtils from '../../src/utils/driver.utils';
import { getPage } from '../../src/utils/page.utils';
import ElementUtils from '@src/utils/element.utils';

// App launch step with Android activity verification
Given(/^the app is launched$/, async () => {
    // App should already be launched by Appium
    // Wait for app to be ready
    await browser.pause(2000);
    // TODO: check current activity is current app package, find alternative for iOS
    // Verify current activity on Android (useful for debug & stability)
    if (browser.isAndroid) {
        try {
            const activity = await browser.getCurrentActivity();
            console.log(`Current Android activity: ${activity}`);
        } catch (e) {
            console.log('Could not retrieve current activity:', e);
        }
    }
});

// Generic page navigation - handles "home page", "interview page", etc.
Given(/^(?:the )?(.+?)(?:\s+page)?\s+(?:is\s+)?displayed$/, async (pageName: string) => {
    const page = await getPage(pageName);
    await page.waitForPage();
});

// Generic tap action - handles "tap on card", "tap on menu item", "tap on button", etc.
When(/^I tap on(?:\s+(?:the|a))?\s+(["\']?)(.+?)\1(?:\s+(?:card|button|section))?$/i, async (quote: string, elementName: string) => {
    await HomePage.tapCard(elementName);
});

// Verify list of cards with data table (MUST come before generic element visibility)
Then(/^I should see the following cards:$/, async (dataTable: any) => {
    const cards = dataTable.raw().map((row: string[]) => row[0]);

    for (const card of cards) {
        let isDisplayed = await HomePage.isCardDisplayed(card, 3000);

        // If card is not visible, try scrolling to it
        if (!isDisplayed) {
            console.log(`⚠️  Card "${card}" not visible, attempting to scroll...`);
            try {
                await DriverUtils.scrollIntoViewAndroid(card);
                // Wait a bit for scroll to complete and check again
                await browser.pause(500);
                isDisplayed = await HomePage.isCardDisplayed(card, 3000);
            } catch (scrollError) {
                console.log(`⚠️  Could not scroll to "${card}":`, scrollError);
            }
        }

        await expect.soft(HomePage.getElementByLabel(card)).toBeDisplayed({
            message: `Expected card "${card}" to be visible on the home screen`,
        });

        if (!isDisplayed) {
            console.log(`❌ Card "${card}" was NOT displayed even after scrolling`);
        } else {
            console.log(`✓ Card "${card}" is displayed`);
        }
    }
    expect.assertSoftFailures();
});

Then(/^(.+?)\s+section title should be open$/i, async (title: string) => {
    await expect(ElementUtils.getElementByText(title)).toBeDisplayed({
        message: `Expected ${title} title to be displayed, but it was not found`
    });
});

