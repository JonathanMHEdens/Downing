 import { faker } from '@faker-js/faker'; 
   /**
   * User data structure for registration tests.
   */
  export type UserData = {
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
  export const generateUserData = (): UserData => {
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