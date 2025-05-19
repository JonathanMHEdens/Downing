import { expect, Locator, Page } from '@playwright/test';
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

// Await the sign up button to be visible and then click it
  // Return a new instance of the SignUpPage class
  async clickSignUpButton(): Promise<SignUpPage> {
    const signUpPage = new SignUpPage(this.page);
    try{
    await this.signUpButton.waitFor({ state: 'visible' });
    await this.signUpButton.click();
    }
    catch (error) {
      console.error("Error clicking the sign up button on Landing Page:", error);
    }
    return signUpPage;
  }
}