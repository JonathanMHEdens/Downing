import { Locator, Page } from '@playwright/test';
import { SignUpPage } from './signUpPage';

export class LandingPage {
  readonly page: Page;
  readonly title: Locator;
  readonly loginButton: Locator;
  readonly signUpButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1');
    this.loginButton = page.getByRole('link', { name: 'Log in' });
    this.signUpButton = page.getByRole('link', { name: 'Sign up' });
  }

    async clickSignUpButton(): Promise<SignUpPage> {
        const signUpPage = new SignUpPage(this.page);
        await this.signUpButton.click();
        return signUpPage;
    }
}