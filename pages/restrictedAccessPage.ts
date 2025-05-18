import { expect, Locator, Page } from '@playwright/test';

export class RestrictedAccessPage {
  readonly page: Page;
  readonly restrictedAccessTitle: Locator;
  readonly restrictedAccessUserGreeting: Locator;
  readonly logoutButton: Locator;


  constructor(page: Page) {
    this.page = page;
    this.restrictedAccessTitle = page.getByRole("heading", { name: "Restricted Access" });
    this.restrictedAccessUserGreeting = page.getByRole("heading", { name: "Hello" });
    this.logoutButton = page.getByRole("link", { name: "Log out" });
  }

  // Check if the restricted access title is visible and contains the user's name
  async checkRestrictedAccessTitles(userName: string) {
    try{
    expect(this.restrictedAccessTitle).toBeVisible();
    expect(this.restrictedAccessUserGreeting).toHaveText(`Hello ${userName}`);
    }
    catch (error) {
      console.error("Error checking restricted access titles:", error);
    }
  }

  async clickLogoutButton() {
    try{
    await this.logoutButton.click();
    }catch (error) {
      console.error("Error clicking the logout button:", error);
    }
  }
}