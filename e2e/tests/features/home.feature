Feature: Home Screen Verification

    As a user, I want to see the main dashboard
    So that I can navigate to different semesters and tools

    @home @smoke @regression
    Scenario: Verify main dashboard components using natural accessibility labels
        Given the "Open Menu" is displayed
        Then I should see the "Open Menu"
        And I should see the following cards:
            | Semester 1      |
            | Semester 6      |
            | Online Compiler |
            | Career Guidance |
