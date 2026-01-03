Feature: Home Page Verification

  @smoke @regression @homepage
  Scenario: Home page displays all required sections
    Given the app is launched
    And the home page is displayed
    Then I should see the following cards:
      | Semester 1          |
      | Semester 2          |
      | Semester 3          |
      | Semester 4          |
      | Semester 5          |
      | Semester 6          |
      | Interview Questions |
      | Career Guidance     |
      | Online Compiler     |
      | Rate Us             |
      | Share with Friends  |
      | Contribute          |

  @smoke @regression @navigation @parametrized
  Scenario Outline: Navigate to different sections
    Given the app is launched
    And the home page is displayed
    When I tap on <sectionName>
    Then <sectionName> section title should be open

    Examples:
      | sectionName         |
      | Semester 1          |
      | Semester 2          |
      | Interview Questions |
      