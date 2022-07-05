# PFC Assignment
 The goal is to provide a simple REST service validating IBAN formats

## Code structure
 Project consists of several files:
 * iban-checker.js
   * includes several service functions providing format checks
   * only one function is exported as an aggregator
   * doesn't differ between failed format and none supported country code
 * main.js
   * main application file containing the end point 
 * test.js
   * contains several function tests
 * package.json
   * contains dependencies for the project and project info
 * package-lock.json
   * contains full dependency list and compile info
 * README.md
   * this file

## Usage
 * To run the project simply type ***node ./main.js***
   * this will start the server on **localhost:3000**
   * after the server is started use ***localhost:3000/api/check_iban/:iban*** to send iban verification requests to it
   * both successful and unsuccessful IBAN verifications would result in response code 200
   * a failed formatted request would result in a response code 400 though
 * To stop the server press ***Ctrl + C***
 * To run tests type ***npm test***
   * this will run all test cases from the *test.js* file

## Possible improvements
 This is just a simple quick implementation, which has some future potential for improvements. Both with project structure and implementation.
 Some examples are below:
 * Introduce routs and controllers, in case API would be growing, which would help with project structure and maintainability
 * Separate cases where a country code isn't recognized and an overall format miss match happens
 * Elaborate server's response in a successful case to include more detailed information, like instead of *IBAN OK* to say specifically *IBAN seems correctly formatted for [Country_name]*
 * Use OpenAPI libs for documenting the API
 * etc