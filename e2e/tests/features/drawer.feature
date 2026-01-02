Feature: Drawer Menu Verification
    As a user, I want to use the drawer menu
    So that I can navigate to content and actions

  @drawer @smoke
  Scenario: Verify drawer is open and key items are visible
    Given the app is launched
    And the home page is displayed
    When I open the drawer menu
    Then I should see the following drawer items:
      | C#         |
      | CSS        |
      | HTML       |
      | JavaScript |
      | R          |
      | Python     |
      | SQL        |
      | YouTube          |
      | Twitter          |
      | Send Suggestions |
      | Report a bug     |

  @drawer @smoke
  Scenario: Close the drawer from the menu
    Given the "Open Menu" is displayed
    When I open the drawer menu
    Then the drawer should be visible
    When I close the drawer menu
    Then I should see the "Open Menu"
    And the drawer should not be visible
