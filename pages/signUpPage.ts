import { Locator, Page } from "@playwright/test";
import { InvestorCategoryPage } from "./investorCategoryPage";

export class SignUpPage {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly acceptCookiesButton: Locator;
  readonly registerTitlesList: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly birthDayInput: Locator;
  readonly birthMonthInput: Locator;
  readonly birthYearInput: Locator;
  readonly emailInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly howYouHeardList: Locator;
  readonly termsAndConditionsCheckbox: Locator;
  readonly emailCommunicationCheckbox: Locator;
  readonly phoneCommunicationCheckbox: Locator;
  readonly signUpButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.getByRole("paragraph").filter({ hasText: "Sign up" });
    this.acceptCookiesButton = page.getByRole("button", { name: "Accept all cookies" });
    this.registerTitlesList = page.locator('#register-titles-list');
    this.firstNameInput = page.locator("#register-first-name-txt");
    this.lastNameInput = page.locator("#register-last-name-txt");
    this.birthDayInput = page.locator("#register-date-of-birth-day-list");
    this.birthMonthInput = page.locator("#register-date-of-birth-month-list");
    this.birthYearInput = page.locator("#register-date-of-birth-year-list");
    this.emailInput = page.locator("#register-email-txt");
    this.phoneNumberInput = page.locator("#register-phone-number-txt");
    this.howYouHeardList = page.locator("#register-how-you-heard-list");
    this.termsAndConditionsCheckbox = page.locator('register span').nth(1);
    this.emailCommunicationCheckbox = page.getByRole("checkbox", { name: "Yes, by email" });
    this.phoneCommunicationCheckbox = page.getByRole("checkbox", { name: "Yes, by phone" });
    this.signUpButton = page.getByRole("button", { name: "Sign up" });
  }

  async acceptCookies() {
    await this.acceptCookiesButton.click();
  }

  // Complete the sign-up form with the generated details
  async fillSignUpForm(
    title: string,
    firstName: string,
    lastName: string,
    birthDay: string,
    birthMonth: string,
    birthYear: string,
    email: string,
    phoneNumber: string,
    howYouHeard: string
  ) {
    try{
    await this.registerTitlesList.selectOption(title);
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.birthDayInput.selectOption(birthDay);
    await this.birthMonthInput.selectOption(birthMonth);
    await this.birthYearInput.selectOption(birthYear);
    await this.emailInput.fill(email);
    await this.phoneNumberInput.fill(phoneNumber);
    await this.howYouHeardList.selectOption(howYouHeard);
    }catch (error) {
      console.error("Error filling sign-up form on Sign Up page:", error);
    }
  }
  async acceptTermsAndConditions() {
    await this.termsAndConditionsCheckbox.click();
  }
  async acceptEmailCommunication() {
    await this.emailCommunicationCheckbox.check();
  }
  async acceptPhoneCommunication() {
    await this.phoneCommunicationCheckbox.check();
  }

  /** Click the sign-up button and wait for the next page to load
  Return a new instance of the InvestorCategoryPage class */
  async clickSignUpButton(): Promise<InvestorCategoryPage> {
    const investorCategoryPage = new InvestorCategoryPage(this.page);
    try { 
    await this.signUpButton.click();
    await this.page.waitForURL("/account/personal-details/investor-type");
    }
    catch (error) {
      console.error("Error clicking sign-up button on Sign Up page:", error);
    }
    return investorCategoryPage;
  }
}