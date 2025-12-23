import { Given, Then, When } from '@wdio/cucumber-framework';
import { expect } from '@wdio/globals';
import DrawerPage from '../../src/pages/drawer.page';
import HomePage from '../../src/pages/home.page';
import ElementUtils from '../../src/utils/element.utils';

// Verify drawer is open using Close button label
Given(/^the drawer is open$/, async () => {
    const isOpen = await DrawerPage.isOpen();
    await expect(isOpen).toBe(true, `Expected drawer to be open, but the close button was not found or visible`);
});

// Verify list of items in drawer by label
Then(/^I should see the following drawer items:$/, async (dataTable: any) => {
    const items = dataTable.raw();
    for (const row of items) {
        const label = row[0];
        const isDisplayed = await DrawerPage.isItemDisplayed(label);
        if (!isDisplayed) {
            console.log(`❌ Drawer item "${label}" was NOT displayed`);
        } else {
            console.log(`✓ Drawer item "${label}" is displayed`);
        }
        await expect(isDisplayed).toBe(true, `Expected drawer item "${label}" to be displayed, but it was not found`);
    }
});

// Close drawer using testID 'menubar.button.close'
When(/^I close the drawer menu$/, async () => {
    await DrawerPage.close();
});

// Open the drawer menu from the Home screen
When(/^I open the drawer menu$/, async () => {
    await DrawerPage.open();
});
