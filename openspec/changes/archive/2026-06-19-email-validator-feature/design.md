# Design: Email Validator

## Architecture Overview
The email validator will be implemented as a standalone utility class with multiple usage modes.

## Components

### 1. Core Validator Class
```javascript
class EmailValidator {
  constructor(options = {})
  validate(email) -> ValidationResult
  static isValid(email, options) -> boolean
  static validate(email, options) -> ValidationResult
}
```

### 2. ValidationResult Interface
```typescript
interface ValidationResult {
  isValid: boolean;
  email: string;
  error?: string;
}
```

### 3. Options Interface
```typescript
interface EmailValidatorOptions {
  allowPlusAliases?: boolean;  // Default: false
  requireTLD?: boolean;         // Default: true
}
```

## Algorithm

### Step 1: Input Validation
- Type checking (must be string)
- Trim whitespace
- Empty string check
- Length validation (max 254 chars per RFC 5321)

### Step 2: Basic Structure Check
- Exactly one @ symbol
- Split into local part and domain
- Non-empty local part and domain

### Step 3: Character Validation
- Block '+' characters if not allowed
- Regex pattern validation with Unicode support

### Step 4: Detailed Format Validation
- Local part: no leading/trailing dots, no consecutive dots
- Domain parts: no leading/trailing hyphens, no empty parts

## Regex Patterns

### Local Part Pattern
```regex
[a-zA-Z0-9._%\-\p{L}\p{N}]+
```
- Supports: ASCII letters, numbers, `.`, `_`, `%`, `-`
- Unicode: `\p{L}` for letters, `\p{N}` for numbers in any language

### Domain Pattern  
```regex
([a-zA-Z0-9\p{L}]([a-zA-Z0-9\p{L}\-]{0,61}[a-zA-Z0-9\p{L}])?\.)+[a-zA-Z\p{L}]{2,}
```
- Supports: Unicode domain names (IDN)
- Each domain part: max 63 chars
- TLD: min 2 chars

### Full Pattern
```regex
^[local-pattern]@[domain-pattern]$
```
- Uses `u` flag for Unicode support

## File Structure
```
email-validator.js      # Main JavaScript implementation
email-validator.ts      # TypeScript version (optional)
tests/
  email-validator.test.js # Test suite
```

## Dependencies
- None (standalone, works in browser and Node.js)

## Compatibility
- Node.js 12+
- Modern browsers (ES6+)
- TypeScript 3.8+

## Error Handling
- Detailed error messages for each validation failure
- Specific error types for different failure modes
- Helpful for debugging and user feedback