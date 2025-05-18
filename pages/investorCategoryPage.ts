import { Locator, Page } from "@playwright/test";
import { RiskTestPage } from "./riskTestPage";

export class InvestorCategoryPage {
  readonly page: Page;
  readonly highNetWorthButton: Locator;
  readonly sophisticatedInvestorButton: Locator;
  readonly selfCertifiedSophisticatedButton: Locator;
  readonly restrictedInvestorButton: Locator;
  readonly highNetWorthInvestorHeading: Locator;
  readonly highNetWorthIncomeYesRadio: Locator;
  readonly highNetWorthIncomeNoRadio: Locator;
  readonly highNetWorthIncomeAmountInput: Locator;
  readonly highNetWorthAssetsYesRadio: Locator;
  readonly highNetWorthAssetsNoRadio: Locator;
  readonly highNetWorthAssetsAmountInput: Locator;
  readonly declarationsInvestorNameInput: Locator;
  readonly declarationsCalendarOpenButton: Locator;
  readonly calendarTodayButton: Locator;
  readonly declarationDateField: Locator;
  readonly sourceOfFundsDropdown: Locator;
  readonly understandRiskLevelCheckbox: Locator;
  readonly understandCapitalCheckbox: Locator;
  readonly sufficientAssetsCheckbox: Locator;
  readonly confirmFundsCheckbox: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.highNetWorthButton = page.getByText("High Net Worth");
    this.sophisticatedInvestorButton = page.getByText("Sophisticated Investor", { exact: true });
    this.selfCertifiedSophisticatedButton = page.getByText("Self Certified Sophisticated");
    this.restrictedInvestorButton = page.getByText("Restricted Investor");
    this.highNetWorthInvestorHeading = page.getByText("High Net Worth Investor");
    this.highNetWorthIncomeYesRadio = page.locator("#high-net-worth-has-sufficient-income-yes-radio");
    this.highNetWorthIncomeNoRadio = page.locator("#high-net-worth-has-sufficient-income-no-radio");
    this.highNetWorthIncomeAmountInput = page.locator("#high-net-worth-sufficient-income-amount-txt");
    this.highNetWorthAssetsYesRadio = page.locator("#high-net-worth-has-sufficient-net-assets-yes-radio");
    this.highNetWorthAssetsNoRadio = page.locator("#high-net-worth-has-sufficient-net-assets-no-radio");
    this.highNetWorthAssetsAmountInput = page.locator("#high-net-worth-sufficient-net-assets-amount-txt");
    this.declarationsInvestorNameInput = page.locator("#declarations-investor-name-txt");
    this.declarationsCalendarOpenButton = page.getByRole("button", { name: "Open Calendar" });
    this.calendarTodayButton = page.getByText("Today");
    this.declarationDateField = page.locator("div").filter({ hasText: "High Net Worth Certified" }).nth(2);
    this.sourceOfFundsDropdown = page.getByRole("combobox");
    this.understandRiskLevelCheckbox = page.getByRole("checkbox", { name: "I understand the level of" });
    this.understandCapitalCheckbox = page.getByRole("checkbox", { name: "If I were to lose the capital" });
    this.sufficientAssetsCheckbox = page.getByRole("checkbox", { name: "I have sufficient assets and/" });
    this.confirmFundsCheckbox = page.getByRole("checkbox", { name: "I confirm that any funds" });
    this.saveButton = page.getByRole("button", { name: "Save" });
  }

  async selectHighNetWorthInvestor() {
    await this.highNetWorthButton.click();
  }

  async selectHasSufficientIncome() {
    await this.highNetWorthIncomeYesRadio.check();
    await this.highNetWorthIncomeAmountInput.waitFor({ state: "visible" });
  }

  async inputSufficientIncomeAmount(amount: string) {
    await this.highNetWorthIncomeAmountInput.fill(amount);
  }

  async selectHasSufficientAssets() {
    await this.highNetWorthAssetsYesRadio.check();
    await this.highNetWorthAssetsAmountInput.waitFor({ state: "visible" });
  }

  async inputSufficientAssetsAmount(amount: string) {
    await this.highNetWorthAssetsAmountInput.fill(amount);
  }

  async inputInvestorName(name: string) {
    await this.declarationsInvestorNameInput.fill(name);
  }

  // Open the calendar and click on the "Today" button
  // This method waits for the calendar to be visible before clicking
  async openCalendarAndClickToday() {
    try{
    await this.declarationsCalendarOpenButton.click();
    await this.calendarTodayButton.waitFor({ state: "visible" });
    await this.calendarTodayButton.click();
    }catch (error) {
      console.error("Error opening calendar and clicking today:", error);
    }
  }

  async selectSourceOfFunds(source: string) {
    await this.sourceOfFundsDropdown.selectOption(source);
  }

  // Check all four checkboxes
  async checkAllFourCheckboxes() {
    try{
    await this.understandRiskLevelCheckbox.check();
    await this.understandCapitalCheckbox.check();
    await this.sufficientAssetsCheckbox.check();
    await this.confirmFundsCheckbox.check();
    }catch (error) {
      console.error("Error checking all four checkboxes:", error);
    }
  }

  // Click the save button and return a new instance of the RiskTestPage class
  async clickSaveButton(): Promise<RiskTestPage> {
    const riskTest = new RiskTestPage(this.page);
    try{
    await this.saveButton.click();
    }catch (error) {
      console.error("Error clicking save button:", error);
    }
    return riskTest;
  }
}