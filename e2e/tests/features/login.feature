Feature: User Login

  As a user, I want to be able to login to the app
  So that I can access my personalized content

  Scenario Outline: Successful login with valid credentials
    Given the login screen is displayed
    When I enter "<email>" and "<password>"
    And I tap on the login button
    Then I should be redirected to the home screen

    Examples:
      | email              | password       |
      | testuser@example.com | SecurePass123! |

  Scenario Outline: Failed login with invalid credentials
    Given the login screen is displayed
    When I enter "<email>" and "<password>"
    And I tap on the login button
    Then I should see an error message "Invalid credentials"

    Examples:
      | email             | password |
      | user@invalid.com  | wrong    |
