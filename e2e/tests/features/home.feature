Feature: Home Screen Verification

    As a user, I want to see the main dashboard
    So that I can navigate to different semesters and tools

    Scenario: Verify main dashboard components using natural accessibility labels
        Given the "Open Menu" is displayed
        Then I should see the "Open Menu"
        And I should see the "Semester 1" card
        And I should see the "Semester 6" card
        And I should see the "Online Compiler" card
        And I should see the "Career Guidance" card
