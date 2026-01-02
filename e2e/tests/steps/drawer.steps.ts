import { Given, Then, When } from '@wdio/cucumber-framework';
import { browser } from '@wdio/globals';
import DrawerPage from '../../src/pages/drawer.page';
import HomePage from '../../src/pages/home.page';
import ElementUtils from '../../src/utils/element.utils';
import DriverUtils from '../../src/utils/driver.utils';

// Verify "Open Menu" button is displayed (catches specific element before generic page pattern)
Given(/^the "Open Menu" is displayed$/i, async () => {
    const element = await ElementUtils.getElementByLabel('Open Menu');
    await expect(element).toBeDisplayed({
        message: 'Expected "Open Menu" button to be displayed on the home page'
    });
});

// Open the menu drawer (handles all variations)
When(/^I open the (?:menu\s+)?drawer(?:\s+menu)?$/i, async () => {
    await HomePage.openMenuDrawer();
});

// Close drawer using testID 'menubar.button.close'
When(/^I close the drawer menu$/, async () => {
    await DrawerPage.close();
});

// Verify list of items in drawer by label (handles both drawer items and menu sections)
Then(/^I should see the following drawer items:$/, async (dataTable: any) => {
    const items = dataTable.raw().map((row: string[]) => row[0]);
    
    for (const item of items) {
        let isDisplayed = await DrawerPage.isItemDisplayed(item) || 
                         await HomePage.isMenuSectionDisplayed(item);
        
        // If item is not visible, try scrolling to it
        if (!isDisplayed) {
            console.log(`⚠️  Drawer item "${item}" not visible, attempting to scroll...`);
            try {
                await DriverUtils.scrollIntoViewAndroid(item);
                // Wait a bit for scroll to complete and check again
                await browser.pause(500);
                isDisplayed = await DrawerPage.isItemDisplayed(item) || 
                             await HomePage.isMenuSectionDisplayed(item);
            } catch (scrollError) {
                console.log(`⚠️  Could not scroll to "${item}":`, scrollError);
            }
        }
        
        await expect.soft(DrawerPage.getElementByLabel(item)).toBeDisplayed({
            message: `Expected drawer item "${item}" to be visible in the drawer`,
        });

        if (!isDisplayed) {
            console.log(`❌ Drawer item "${item}" was NOT displayed even after scrolling`);
        } else {
            console.log(`✓ Drawer item "${item}" is displayed`);
        }
    }
    expect.assertSoftFailures();
});

// Verify drawer visibility (parameterized for visible/not visible)
Then(/^the drawer should (not )?be visible$/, async (notVisible: string) => {
    const shouldBeVisible = !notVisible; // If "not" is captured, shouldBeVisible = false
    
    if (shouldBeVisible) {
        await expect(DrawerPage.closeButton).toBeDisplayed({
            message: 'Expected drawer to be visible, but it is not displayed'
        });
    } else {
        await expect(DrawerPage.closeButton).not.toBeDisplayed({
            message: 'Expected drawer to be closed, but it is still visible'
        });
    }
});

// Verify menu drawer is displayed
Then(/^the (?:menu\s+)?drawer should be displayed$/i, async () => {
    await expect(DrawerPage.closeButton).toBeDisplayed({
        message: 'Expected drawer to be displayed, but it is not visible'
    });
});

// Verify menu drawer sections from data table
Then(/^I should see the following menu sections:$/i, async (dataTable: any) => {
    const sections = dataTable.hashes();
    
    for (const row of sections) {
        const sectionName = row.section;
        
        await expect.soft(HomePage.getElementByLabel(sectionName)).toBeDisplayed({
            message: `Expected menu section "${sectionName}" to be displayed`,
        });
    }
    expect.assertSoftFailures();
});

// Verify a specific element by accessibility label is displayed
Then(/^I should see the "([^"]+)"$/i, async (elementLabel: string) => {
    const element = await ElementUtils.getElementByLabel(elementLabel);
    await expect(element).toBeDisplayed({
        message: `Expected element "${elementLabel}" to be displayed, but it was not found`
    });
});
