import { expect, test } from '@playwright/test';
import { LandingPage } from "../pages/landingPage";
import { SignUpPage } from "../pages/signUpPage";
import { InvestorCategoryPage } from "../pages/investorCategoryPage";
import { RiskTestPage } from "../pages/riskTestPage";
import { RestrictedAccessPage } from "../pages/restrictedAccessPage";
import { faker } from '@faker-js/faker';

test.describe('User Registration', () => {
  let landingPage: LandingPage;
  let signUpPage: SignUpPage;
  let investorCategoryPage: InvestorCategoryPage;
  let riskTestPage: RiskTestPage;
  let restrictedAccessPage: RestrictedAccessPage;

  /**
   * User data structure for registration tests.
   */
  type UserData = {
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
  };

  /**
   * Generates random user data for registration.
   */
  const generateUserData = (): UserData => {
    const birthDate: Date = faker.date.birthdate({ min: 18, max: 65, mode: 'age' });
    const titleArray: string[] = ['(none)', 'Dr', 'Miss', 'Mr', 'Mrs', 'Prof'];
    const howYouHeardArray: string[] = [
      '1: Referred by a friend',
      '2: I am an existing Downing investor',
      '3: In the press',
      '4: Word of mouth',
      '5: Financial adviser/intermediary',
      '6: Social media',
      '7: Search engine',
      '8: Other website',
      '9: Online advertising',
      '10: Other'
    ];
    const firstName: string = faker.person.firstName();
    const lastName: string = faker.person.lastName();

    return {
      randomTitle: faker.helpers.arrayElement(titleArray),
      birthDay: {
        day: birthDate.getDate().toString(),
        month: (birthDate.getMonth() + 1).toString(), // Month is 0-indexed
        year: birthDate.getFullYear().toString(),
      },
      firstName,
      lastName,
      // Generate email using first and last name
      email: `${firstName}${lastName}@${faker.internet.domainName()}`,
      // Remove all non-numeric characters from random phone number
      phoneNumber: faker.phone.number({ style: 'international' }).replace(/[^0-9]/g, ''),
      howYouHeard: faker.helpers.arrayElement(howYouHeardArray),
    };
  };

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await page.goto('/');
    // Assert landing page loaded
    await expect(landingPage.signUpButton).toBeVisible();
  });

  test('User should be able to register successfully', async ({ page }) => {
    // Step 1: Go to sign up page
    signUpPage = await landingPage.clickSignUpButton();

    // Step 2: Generate user data
    const userData: UserData = generateUserData();
    //Static values for testing
    const netWorth: string = '2000000';
    const sourceOfFunds: string = '1: Business ownership';

    // Step 3: Accept cookies
    await signUpPage.acceptCookies();

    // Step 4: Fill out registration form
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

    // Step 5: Accept all consents
    await expect(signUpPage.termsAndConditionsCheckbox).toBeVisible();
    await signUpPage.termsAndConditionsCheckbox.check();
    await signUpPage.emailCommunicationCheckbox.check();
    await signUpPage.phoneCommunicationCheckbox.check();

    // Step 6: Submit registration and assert navigation
    investorCategoryPage = await signUpPage.clickSignUpButton();
    await expect(page).toHaveURL(/\/account\/personal-details\/investor-type/);

    // Step 7: Select investor category
    await expect(investorCategoryPage.highNetWorthButton).toBeVisible();
    investorCategoryPage.selectHighNetWorthInvestor();
    await expect(investorCategoryPage.highNetWorthInvestorHeading).toBeVisible();

    // Step 8: Fill investor details
    await investorCategoryPage.selectHasSufficientIncome();
    await investorCategoryPage.inputSufficientIncomeAmount(netWorth);
    await investorCategoryPage.selectHasSufficientAssets();
    await investorCategoryPage.inputSufficientAssetsAmount(netWorth);
    await investorCategoryPage.inputInvestorName(`${userData.firstName} ${userData.lastName}`);
    await investorCategoryPage.openCalendarAndClickToday();
    await investorCategoryPage.selectSourceOfFunds(sourceOfFunds);
    await investorCategoryPage.checkAllFourCheckboxes();

    // Step 9: Save and go to risk test
    riskTestPage = await investorCategoryPage.clickSaveButton();
    await expect(page).toHaveURL(/\/bond\/personal-details\/risk-test\/-1/);
    await expect(riskTestPage.riskTestTitle).toBeVisible();
    await expect(riskTestPage.riskTestTitle).toHaveText('Risk test');

    // Step 10: Complete risk test and check restricted access
    restrictedAccessPage = await riskTestPage.completeRiskTest();
    await expect(page).toHaveURL('/restricted-access-orders');
    await restrictedAccessPage.checkRestrictedAccessTitles(userData.firstName);

    // Step 11: Logout and verify return to landing page
    await restrictedAccessPage.clickLogoutButton();
    await expect(landingPage.signUpButton).toBeVisible();
    await expect(landingPage.loginButton).toBeVisible();
  });
});