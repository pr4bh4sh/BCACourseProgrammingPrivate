import BasePage from '../pages/base.page';

/**
 * Dynamically import page object from page name string
 * @param pageName - Name of the page (e.g., 'home', 'interview questions', 'drawer')
 * @returns Page object instance
 */
export async function getPage(pageName: string): Promise<BasePage> {
    // Normalize: lowercase, trim, and remove spaces
    const normalizedPageName = pageName.toLowerCase().trim().replace(/\s+/g, '');
    const pageModule = await import(`../pages/${normalizedPageName}.page`);
    return pageModule.default;
}
