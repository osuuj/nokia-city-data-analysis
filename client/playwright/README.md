# Playwright Test Suite

This directory contains the Playwright test suite for the client application. Below are the instructions and details for setting up and running the tests.

## Installation

To get started with Playwright, ensure you have Node.js installed. Then, install the necessary dependencies by running:

```bash
npm install
```

## Running Tests

You can run the tests using the following command:

```bash
npx playwright test
```

This command will execute all the tests located in the `tests` directory.

## Configuration

The Playwright configuration file is located at `playwright.config.ts`. You can customize various settings such as:

- Test directory
- Timeout settings
- Browser options

Refer to the Playwright documentation for more details on configuration options.

## Writing Tests

Tests are located in the `tests` directory. Each test file typically exports test cases using the `test` function provided by Playwright. You can add your own test cases to verify the behavior of the application.

## Additional Resources

For more information on Playwright, visit the official documentation at [Playwright Documentation](https://playwright.dev/docs/intro).