## ADDED Requirements

### Requirement: Email Validation with International Support
The system SHALL provide email validation functionality that supports international characters and blocks invalid formats. The validator SHALL use regex patterns instead of exhaustive domain lists.

#### Scenario: Validate standard email formats
- **WHEN** a standard ASCII email address like `test@example.com` is provided
- **THEN** the validator SHALL return `isValid: true`

#### Scenario: Support Unicode characters in email addresses
- **WHEN** an email with Unicode characters like `用户@例子.中国` is provided
- **THEN** the validator SHALL return `isValid: true`
- **AND** support all international alphabets including Chinese, Arabic, Hindi, and Ukrainian

#### Scenario: Block plus characters by default
- **WHEN** an email containing `+` character like `test+alias@example.com` is provided
- **THEN** the validator SHALL return `isValid: false`
- **AND** provide error message indicating plus characters are not allowed

### Requirement: Regex-Based Validation
The system SHALL use regex pattern matching for email validation without maintaining exhaustive domain lists.

#### Scenario: Use Unicode regex patterns
- **WHEN** validation is performed on emails with international characters
- **THEN** the validator SHALL use Unicode regex patterns (`\p{L}`, `\p{N}`)
- **AND** use the `u` flag for Unicode support

#### Scenario: Reject invalid formats
- **WHEN** an email with invalid format like `test@domain@com` is provided
- **THEN** the validator SHALL return `isValid: false`
- **AND** provide specific error messages

### Requirement: Input Validation and Error Handling
The system SHALL validate input types and provide detailed error messages for debugging.

#### Scenario: Validate input constraints
- **WHEN** non-string input is provided
- **THEN** the validator SHALL return `isValid: false` with appropriate error
- **AND** when empty string is provided, return `isValid: false`
- **AND** when string over 254 characters is provided, return `isValid: false`

#### Scenario: Provide detailed error messages
- **WHEN** validation fails
- **THEN** the validator SHALL return a descriptive error message
- **AND** include error types for missing @, multiple @, invalid characters, and format issues

### Requirement: Clean API Interface
The system SHALL provide a clean API interface for email validation with multiple usage modes.

#### Scenario: Simple boolean validation
- **WHEN** `EmailValidator.isValid(email)` is called
- **THEN** the validator SHALL return `true` for valid emails and `false` for invalid emails

#### Scenario: Detailed validation with error reporting
- **WHEN** `EmailValidator.validate(email)` is called
- **THEN** the validator SHALL return a `ValidationResult` object with `isValid`, `email`, and optional `error`

#### Scenario: Configurable validation options
- **WHEN** validator is configured with `allowPlusAliases: true`
- **THEN** the validator SHALL allow plus characters in email addresses