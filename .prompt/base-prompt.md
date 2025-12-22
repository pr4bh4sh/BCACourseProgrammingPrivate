# Objective

Analyze the existing open-source React Native mobile application (iOS/Android) and produce a complete WCAG 2.1 AA compliance upgrade with language-agnostic automation selectors.

**Output:**
- Prioritized fix list
- Code patches
- Per-screen YAML selector files for automation

**Input:** current repository codebase

> [!IMPORTANT]
> **RULE:** Do NOT generate unnecessary Markdown files, documentation files, or new files unless they directly fix accessibility issues in existing code OR create required per-screen selector YAML files. Focus on source code changes + automation YAML generation.

## Analysis & Fix Scope

### 1. WCAG 2.1 AA Compliance Audit
Evaluate against mobile-relevant success criteria:

- **Perceivable:** 1.4.3 Contrast (Minimum), 1.4.10 Reflow, 1.4.11 Non-text Contrast, 1.1.1 Non-text Content
- **Operable:** 2.1.1 Keyboard, 2.4.7 Focus Visible, 2.5.1 Pointer Gestures, 2.5.3 Label in Name
- **Understandable:** 3.3.2 Labels or Instructions, 3.3.3 Error Suggestion
- **Robust:** 4.1.2 Name, Role, Value

**Action:** Scan all components for missing `accessible`, `accessibilityLabel`, `accessibilityRole`, `accessibilityHint`, `accessibilityState`, `importantForAccessibility`.

### 2. Platform Accessibility Integration

#### iOS (VoiceOver)
```jsx
<View
  accessible={true}
  accessibilityLabel="Submit login"
  accessibilityRole="button"
  accessibilityHint="Double tap to sign in"
  testID="login.submitButton"
/>
```

#### Android (TalkBack)
```jsx
<Button
  accessible={true}
  accessibilityLabel="Submit login"
  accessibilityRole="button"
  accessibilityState={{ busy: isLoading }}
  testID="login.submitButton"
  importantForAccessibility="auto"
/>
```

**Action:** Verify Dynamic Type (iOS), font scaling (Android), reduced motion support.

### 3. Language-Agnostic TestID Implementation (Critical)
> [!IMPORTANT]
> **Rule:** `testID` MUST be technical/English keywords only. Never use translated text.

**Naming Convention (enforce across codebase):**
`ScreenName.elementType.purpose`

**Examples:**
- ✅ **GOOD:**
  - `testID="login.submitButton"`
  - `testID="profile.input.email"`
  - `testID="cart.itemRow.delete"`
  - `testID="settings.toggle.notifications"`
- ❌ **BAD:**
  - `testID="Anmelden"` (German "Sign In")
  - `testID="Entrar"` (Spanish "Enter")
  - `testID="Submit Order Now"` (Contains user text)

**Platform Mapping:**
- **iOS:** `testID` → `accessibilityIdentifier` (Appium: `accessibility id`)
- **Android:** `testID` → `testTag` (Appium: `id` or `android viewtag`)
- **Maestro:** `id:login.submitButton`

**Separation of Concerns:**
- ✅ **CORRECT:**
  ```jsx
  accessibilityLabel="Sign in to your account"  // Human readable, localized
  testID="login.submitButton"                  // Automation only, language-agnostic
  ```

### 4. Per-Screen Automation Selector Catalogue (Required File Generation)
Generate one YAML file **PER SCREEN** in `automation/selectors/` directory for easy updates when source code changes.

**File Structure:**
```text
automation/selectors/
├── login.yml
├── profile.yml
├── cart.yml
└── settings.yml
```

**Example `automation/selectors/login.yml`:**
```yaml
# Login Screen Selectors - Update this file when UI changes
screen: login

selectors:
  emailInput:
    testID: "login.input.email"
    appiumIOS: "accessibility id: login.input.email"
    appiumAndroid: "id: login.input.email"
    maestro: "id: login.input.email"
  
  submitButton:
    testID: "login.submitButton"
    appiumIOS: "accessibility id: login.submitButton"
    appiumAndroid: "id: login.submitButton"
    maestro: "id: login.submitButton"
  
  errorMessage:
    testID: "login.error.message"
    appiumIOS: "accessibility id: login.error.message"
    maestro: "id: login.error.message"
```

**Maestro Flow Usage Example (for reference in comments):**
```yaml
# In your .maestro flows, import screen selectors:
- tapOn: 'id: login.submitButton'  # References login.yml
```

### 5. Deliverables (Required Output Format)

#### A. Prioritized Fix List (Markdown table):
| File | Line | Issue | WCAG | Severity | Fix |
| :--- | :--- | :--- | :--- | :--- | :--- |
| LoginScreen.js | 45 | Missing accessibilityLabel | 4.1.2 | High | Add accessibilityLabel="Enter email" |

#### B. Code Patches (diff format for each source file - MODIFY EXISTING FILES ONLY)

#### C. Per-Screen Selector YAML Files (create `automation/selectors/[screenName].yml` for each screen with interactive elements)

#### D. CONTRIBUTING.md Update (if file exists, provide ONLY the diff patch to add accessibility + testID rules)

#### E. CI/CD Integration (if workflows exist, provide ONLY diff patches to validate new testIDs)

---

### Success Criteria:
1. 100% interactive elements have `testID` following `ScreenName.elementType.purpose` convention.
2. All WCAG 2.1 AA criteria pass for mobile.
3. One YAML selector file generated per screen in `automation/selectors/`.
4. Generated selectors work in Appium + Maestro across English/Spanish/French.
5. No accessibility text pollution from `testIDs`.
6. ZERO unnecessary Markdown/documentation files created.

**Start Analysis Now.** Output fixes + YAML files in order of highest impact first. Focus exclusively on source code modifications + per-screen selector YAML generation.