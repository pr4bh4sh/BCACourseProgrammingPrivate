import BasePage from '../framework/pages/base.page';

class LoginPage extends BasePage {
    /**
     * Selectors
     */
    get emailInput() { return this.getById('email-input'); }
    get passwordInput() { return this.getById('password-input'); }
    get loginButton() { return this.getById('login-button'); }
    get errorMessage() { return this.getById('error-message'); }

    /**
     * Actions
     */
    async login(email: string, password: string) {
        await this.emailInput.setValue(email);
        await this.passwordInput.setValue(password);
        await this.loginButton.click();
    }
}

export default new LoginPage();
