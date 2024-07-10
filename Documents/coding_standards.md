
# Coding standards

## Naming Conventions:
- Use meaningful names for variables, functions, and files. 

### 1. Files 
- Use Pascal Case for component file names. e.g. LikesTab.js

### 2. Variables:
- Camel Case for variable names:
  - Start with a lowercase letter
  - For multiple words, capitalize the first letter of each subsequent word.

### 3. Functions
- Camel Case will be used for function names.
  - Start with a lowercase letter.
  - For a function with multiple words, capitalize the first letter of each subsequent word.
  - Functions should be named to clearly describe what they do. e.g. getUserPosts

### 4. Component Structure
- Use functional components and hooks wherever possible.
- Ensure components are self-contained and modular.
  #### 4.1 Component Declaration
  - Define the component as a constant or function.
  - 
<br>

## Code Layout and Structure

### 1. Formatting:
Ensure consistent spacing and alignment throughout the code.

### 2. Comments
Add comments for function description and to explain complex code. 
Use `//` for single-line comments and `/* */` for multi-line comments.
Keep explanations minimal yet descriptive for easy understanding.
 

<br>

# Testing and Debugging

### Types of Tests
Our project will have 3 master types of tests:
- **Unit Testing:**
  - Jest individual components, functions, and utilities in isolation to ensure they behave as expected.
  - Using : Jest
  - Each test has to have the same name as the component being tested, with test includeded.
    

- **Integration Testing:**
  - Test the interactions between different components or modules to verify that they work together correctly.
  - Using : Cypress


- **End-to-End Testing:**
  - Test the entire application from the user's perspective to ensure that all components and functionalities work together
  - Using : Cypress

### Testing Conventions Using Jest
1. Setting up Jest
Installing jest:
Add to project by running:
npm install --save-dev jest
Configure Jest:
Add a Jest configuration to your package.json or create a jest.config.js file:
"scripts": {
"test": "jest"
},
"jest": {
"testEnvironment": "node",
"collectCoverage": true,
"coverageDirectory": "coverage",
"coverageReporters": ["html", "text"]
}

2. Organizing Our Tests
Directory Structure: Place our tests in a __tests__ directory or alongside the
files they are testing, using the .test.js or .spec.js suffix.
src/
components/
Header.js
__tests__/

Testing Conventions Using Jest 2

Header.test.js
services/
api.js
__tests__/
api.test.js

3. Writing Tests
Use consistent naming convention
Use a consistent naming convention for our test files and folders. A
common approach is to use the same name as the component or module
you are testing, with a .test.js or .spec.js extension.

4. Group Related Tests with Describe
Blocks

Use
describe blocks to group related tests together. This helps structure your tests
logically and makes them more readable.
A describe block is a function that takes a name and a callback function as
arguments, and defines a scope for a set of tests. For example, you can use a
describe block to group all the tests for a specific feature, functionality, or
behaviour of your component.
// src/components/__tests__/Header.test.js
import React from 'react';
import { render } from '@testing-library/react';
import Header from '../Header';
describe('Header Component', () => {
test('renders the header with the correct text', () => {

Testing Conventions Using Jest 3

const { getByText } = render(<Header />);
expect(getByText('MovieHub')).toBeInTheDocument();
});
});

5. Use Meaningful Test Names with It
Blocks

Inside each
describe block, use it blocks to define individual test cases. The name of the
it block should be clear and descriptive, following the pattern of "it
should/does [something]".

// src/components/__tests__/Header.test.js
describe('Header Component', () => {
it('should render the header with the correct text', () =>
const { getByText } = render(<Header />);
expect(getByText('MovieHub')).toBeInTheDocument();
});
});

6. Use BeforeEach and AfterEach Hooks
for Common Setup and Teardown

Use
beforeEach and afterEach hooks to run common setup or teardown actions
before or after each test in a describe block.
describe('Header Component', () => {
let component;
beforeEach(() => {
component = render(<Header />);

Testing Conventions Using Jest 4

});
afterEach(() => {
component.unmount();
});
it('should render the header with the correct text', () =>
const { getByText } = component;
expect(getByText('MovieHub')).toBeInTheDocument();
});
});

7. Use test utilities and custom matchers
for readability and reusability
8. Follow the AAA pattern for test
structure
For writing clear and consistent tests is to follow the AAA pattern, which stands
for Arrange, Act, and Assert.
Structure our tests into three sections: arrange, where we set up the initial
conditions and inputs for our test; act, where we execute the code or action
that we want to test; and assert, where we verify the expected results or
outcomes of our test.

9. Continuous Intergration
Integrate Jest with our CI/CD pipeline to automatically run tests on each commit
and pull request.
# .github/workflows/ci.yml
name: CI

Testing Conventions Using Jest 5

on: [push, pull_request]
jobs:
test:
runs-on: ubuntu-latest
steps:
- uses: actions/checkout@v2
- name: Set up Node.js
uses: actions/setup-node@v2
with:
node-version: '14'
- run: npm install
- run: npm test

### Code Coverage
- Measured using Jest


For more information on the testing, you may refer to the [Testing Specification](https://github.com/COS301-SE-2024/MiniProject5/blob/documentation/documentation/Testing-Specification.md)


<br>

## Git Repository and Strategy

### Git Flow

We will be using the Git Flow branching strategy. One of the primary benefits is that it facilitates parallel development, allowing our production code to remaster stable at all times. 

### CI/CD


#### Linting
- We will be using Eslint to mastertain code quality and consistency, ensuring uniform code across the project.
- The custom rules for our project will correspond to those that were stated in the coding standards.
- Eslint is well-suited for the task of analysing our React project, with it being a dedicated javascript/typescript linter.


