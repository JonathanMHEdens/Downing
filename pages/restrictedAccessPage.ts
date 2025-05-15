import { expect, Locator, Page } from '@playwright/test';

export class RestrictedAccessPage {
  readonly page: Page;
  readonly restrictedAccessTitle: Locator;
  readonly restrictedAccessUserGreeting: Locator;


  constructor(page: Page) {
    this.page = page;
    this.restrictedAccessTitle = page.getByRole("heading", {name: "Restricted Access"});
    
  }

   async checkRestrictedAccessTitles(userName: string) {    
    expect(this.restrictedAccessTitle).toBeVisible();
    expect(this.restrictedAccessUserGreeting).toHaveText(`Hello ${userName}`);
    expect(this.page).toHaveURL('/restricted-access-orders/');
  }

}