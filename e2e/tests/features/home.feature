Feature: Home Screen Verification

    As a user, I want to see the main dashboard
    So that I can navigate to different semesters and tools

    Scenario: Verify main dashboard components using natural accessibility labels
        Given the "Drawer Button" is displayed
        Then I should see the "Drawer Button"
        And I should see the "1st Sem" card
        And I should see the "6th Sem" card
        And I should see the "Code_🔥 Compiler" card
        And I should see the "Career_🎓 Guidance" card
