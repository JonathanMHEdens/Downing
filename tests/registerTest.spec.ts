import { expect, test } from '@playwright/test';
import { LandingPage } from "../pages/landingPage";
import { SignUpPage } from "../pages/signUpPage";
import { InvestorCategoryPage } from "../pages/investorCategoryPage";
import { RiskTestPage } from "../pages/riskTestPage";
import { RestrictedAccessPage } from "../pages/restrictedAccessPage";

import { faker} from '@faker-js/faker';

test.describe('User Registration', () => {
  let landingPage: LandingPage;
  let signUpPage: SignUpPage;
  let investorCategoryPage: InvestorCategoryPage;
  let riskTestPage: RiskTestPage;
  let restrictedAccessPage: RestrictedAccessPage;

   type UserData  = {
    randomTitle: string;
    birthDay: {
      day: string;
      month: string;
      year: string;
    };
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    howYouHeard: string;
    } 

    const generateUserData = () : UserData => {
    const birthDate: Date = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
    const titleArray: string[] = ['(none)', 'Dr' ,'Miss' ,'Mr', 'Mrs', 'Prof'];
    const howYouHeardArray: string[] = ['1: Referred by a friend', '2: I am an existing Downing investor', '3: In the press', '4: Word of mouth',
        '5: Financial adviser/intermediary', '6: Social media', '7: Search engine', '8: Other website', '9: Online advertising', '10: Other'];
    const firstName: string = faker.person.firstName();
    const lastName: string = faker.person.lastName();
       
   return {
   randomTitle: faker.helpers.arrayElement(titleArray),
   birthDay: {
        day: birthDate.getDate().toString(),
        month: birthDate.getMonth().toString(),
        year: birthDate.getFullYear().toString(),
    },
    firstName,
    lastName,
    //Generate email using first and last name
    email: `${firstName}${lastName}@`+faker.internet.domainName(),
    // Remove all non-numeric characters from random phone number
    phoneNumber: faker.phone.number({style: 'international'}).replace(/[^0-9]/g, ''),   
    howYouHeard: faker.helpers.arrayElement(howYouHeardArray),    
  }
}

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await page.goto('/');
  });

  test('User should be able to register successfully', async ({ page }) => {
    signUpPage = await landingPage.clickSignUpButton();
    const userData: UserData = generateUserData();
    
    await signUpPage.acceptCookies();

    await signUpPage.fillSignUpForm(
      userData.randomTitle,
        userData.firstName,
        userData.lastName,
        `${userData.birthDay.day}: ${userData.birthDay.day}`,
        `${userData.birthDay.month}: ${userData.birthDay.month}`,
        `${userData.birthDay.year}`,
        userData.email,
        userData.phoneNumber,
        userData.howYouHeard
    );
    await signUpPage.termsAndConditionsCheckbox.check();
    await signUpPage.emailCommunicationCheckbox.check();
    await signUpPage.phoneCommunicationCheckbox.check();
    
    investorCategoryPage = await signUpPage.clickSignUpButton();
    //Regex used to match the URL pattern, because the URL contains dynamic values
    await expect(page).toHaveURL(/.*\/account\/personal-details\/investor-type/);

    await expect(investorCategoryPage.highNetWorthButton).toBeVisible();
    investorCategoryPage.selectHighNetWorthInvestor();
    await expect(investorCategoryPage.highNetWorthInvestorHeading).toBeVisible();

    await investorCategoryPage.selectHasSufficientIncome();
    await investorCategoryPage.inputSufficientIncomeAmount('1500000');
    await investorCategoryPage.selctHasSufficientAssets();
    await investorCategoryPage.inputSufficientAssetsAmount('2000000');
    await investorCategoryPage.inputInvestorName(userData.firstName + " " + userData.lastName);
    await investorCategoryPage.openCalendarAndClickToday();
    await investorCategoryPage.selectSourceOfFunds('1: Business ownership');
    await investorCategoryPage.checkAllFourCheckboxes();
    riskTestPage = await investorCategoryPage.clickSaveButton();
    expect(page).toHaveURL(/.*\/risk-test/);
    expect(riskTestPage.riskTestTitle).toBeVisible();
    expect(riskTestPage.riskTestTitle).toHaveText('Risk Test');
    restrictedAccessPage = await riskTestPage.completeRiskTest();
    await expect(page).toHaveURL(/.*\/restricted-access-orders/);

    restrictedAccessPage.checkRestrictedAccessTitles(userData.firstName);

    

  });
});