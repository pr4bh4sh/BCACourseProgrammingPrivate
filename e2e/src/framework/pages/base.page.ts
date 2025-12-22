export default class BasePage {
    /**
     * Wait for element to be displayed
     */
    async waitForDisplayed(selector: string) {
        const el = await $(selector);
        await el.waitForDisplayed();
    }

    /**
     * Get element by accessibility ID
     */
    getById(id: string) {
        return $(`~${id}`);
    }
}
