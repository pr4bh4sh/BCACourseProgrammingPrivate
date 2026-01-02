import { Given, Then, When } from '@wdio/cucumber-framework';
import DrawerPage from '../../src/pages/drawer.page';
import HomePage from '../../src/pages/home.page';
import ElementUtils from '../../src/utils/element.utils';

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
    const items = dataTable.raw();
    const failures: string[] = [];
    
    for (const row of items) {
        const label = row[0];
        const isDisplayed = await DrawerPage.isItemDisplayed(label) || 
                           await HomePage.isMenuSectionDisplayed(label);
        if (!isDisplayed) {
            console.log(`❌ Drawer item "${label}" was NOT displayed`);
            failures.push(`Drawer item "${label}" was not displayed`);
        } else {
            console.log(`✓ Drawer item "${label}" is displayed`);
        }
    }
    
    await expect(failures.length).toBe(0, `Assertion failures:\n${failures.join('\n')}`);
});

// Verify drawer visibility (parameterized for visible/not visible)
Then(/^the drawer should (not )?be visible$/, async (notVisible: string) => {
    const isOpen = await DrawerPage.isOpen();
    const shouldBeVisible = !notVisible; // If "not" is captured, shouldBeVisible = false
    
    if (shouldBeVisible) {
        await expect(isOpen).toBe(true, 'Expected drawer to be visible, but it is not displayed');
    } else {
        await expect(isOpen).toBe(false, 'Expected drawer to be closed, but it is still visible');
    }
});

// Verify menu drawer is displayed
Then(/^the (?:menu\s+)?drawer should be displayed$/i, async () => {
    const isOpen = await DrawerPage.isOpen();
    await expect(isOpen).toBe(true, 'Expected drawer to be displayed, but it is not visible');
});

// Verify menu drawer sections from data table
Then(/^I should see the following menu sections:$/i, async (dataTable: any) => {
    const sections = dataTable.hashes();
    const failures: string[] = [];
    
    for (const row of sections) {
        const sectionName = row.section;
        const isDisplayed = await HomePage.isMenuSectionDisplayed(sectionName);
        
        if (!isDisplayed) {
            failures.push(`Menu section "${sectionName}" not displayed`);
        }
    }
    
    await expect(failures.length).toBe(0, `Failed menu sections:\n${failures.join('\n')}`);
});
