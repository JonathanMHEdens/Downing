# Downing
Technical Test Answers and Code

Technical test answers are supplied in the Word document.

To install the project, clone the Git repository and run npm install from the terminal.
run npx playwright install to install required browsers.
To run the test run npx playwright test --ui then click play adjacent to the test case.

To successfully generate and view the allure report, you will need to have the Java JDK installed and a Windows environment variable of JAVA_HOME set the file pathway.
The Java JDK can be easily installed using the official Java Platform extension for VS Code.

To generate the allure report run the following command in the terminal:
npx allure generate ./allure-results --clean

To view the generated allure report, run the following command in the terminal:
npx allure open ./allure-report

The report will then open in your browser, and can be navigated using the UI provided.
