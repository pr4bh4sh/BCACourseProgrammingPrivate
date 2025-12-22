Feature: Home Screen Verification

    As a user, I want to see the main dashboard
    So that I can navigate to different semesters and tools

    @home @smoke @regression
    Scenario: Verify main dashboard components using natural accessibility labels
        Given the "Open Menu" is displayed
        Then I should see the "Open Menu"
        And I should see the following cards:
            | Semester 1 |
            | Semester 6 |

    @home @smoke
    Scenario: Navigate to Interview Questions screen
        Given the "Open Menu" is displayed
        When I scroll to the "Interview Questions" card
        And I tap on the "Interview Questions" card
        Then I should see the "Interview Questions" button

    @home @regression
    Scenario: Open and scroll notifications panel
        Given the "Open Menu" is displayed
        When I tap on the notifications button
        Then the notifications panel should be displayed
        When I scroll down in the notifications panel
        Then I should see additional notification content

    @home @smoke
    Scenario: Verify all main cards are displayed
        Given the "Open Menu" is displayed
        Then the following cards should be displayed:
            | Semester 1          |
            | Semester 6          |
            | Interview Questions |
            | Career Guidance     |
            | Online Compiler     |
