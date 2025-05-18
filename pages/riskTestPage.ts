import { Locator, Page } from "@playwright/test";
import { RestrictedAccessPage } from "./restrictedAccessPage";

export class RiskTestPage {
    readonly page: Page;
    readonly riskTestTitle: Locator;
    readonly investmentRiskQuestionOne: Locator;
    readonly investmentRiskQuestionTwo: Locator;
    readonly investmentRiskQuestionThree: Locator;
    readonly investmentRiskQuestionFour: Locator;
    readonly investmentRiskQuestionFive: Locator;
    readonly investmentRiskQuestionSix: Locator;
    readonly investmentRiskQuestionSeven: Locator;
    readonly submitButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.riskTestTitle = page.getByText("Risk test");
        this.investmentRiskQuestionOne = page.getByText("An investment that is a kind");
        this.investmentRiskQuestionTwo = page.getByText("Yes, this is an investment,");
        this.investmentRiskQuestionThree = page.getByText("No, there is no guarantee");
        this.investmentRiskQuestionFour = page.getByText("No, whilst the bond is");
        this.investmentRiskQuestionFive = page.getByText("No, I should spread my money");
        this.investmentRiskQuestionSix = page.getByText("No, I recognise that Downing");
        this.investmentRiskQuestionSeven = page.getByRole('radio', { name: 'False' });
        this.submitButton = page.getByRole("button", { name: "Submit" });
    }

    async checkRiskTestTitle() {
        await this.riskTestTitle.waitFor({ state: "visible" });
    }

    // Complete the risk test by selecting the options and clicking the submit button
    async completeRiskTest(): Promise<RestrictedAccessPage> {
        const restrictedAccessPage = new RestrictedAccessPage(this.page);
        try{
        await this.investmentRiskQuestionOne.click();
        await this.investmentRiskQuestionTwo.click();
        await this.investmentRiskQuestionThree.click();
        await this.investmentRiskQuestionFour.click();
        await this.investmentRiskQuestionFive.click();
        await this.investmentRiskQuestionSix.click();
        await this.investmentRiskQuestionSeven.check();
        await this.submitButton.click();
        }
        catch (error) {
            console.error("Error completing the risk test:", error);
        }
        return restrictedAccessPage;
    }
}