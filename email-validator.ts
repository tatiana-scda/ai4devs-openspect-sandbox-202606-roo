/**
 * Email Validator
 * 
 * Validates email addresses according to RFC standards with additional constraints:
 * - Supports international characters (Unicode) for different country alphabets
 * - Blocks '+' characters to prevent aliasing
 * - Uses regex pattern matching (no exhaustive domain lists)
 * - Rejects invalid characters
 */

interface ValidationResult {
  isValid: boolean;
  email: string;
  error?: string;
}

interface EmailValidatorOptions {
  allowPlusAliases?: boolean; // Default: false (block '+' characters)
  requireTLD?: boolean;       // Default: true (require top-level domain)
}

class EmailValidator {
  private readonly options: Required<EmailValidatorOptions>;
  private readonly regex: RegExp;

  constructor(options: EmailValidatorOptions = {}) {
    this.options = {
      allowPlusAliases: false,
      requireTLD: true,
      ...options
    };
    
    // Build regex pattern based on options
    this.regex = this.buildRegex();
  }

  /**
   * Builds the regex pattern for email validation
   * Supports:
   * - Unicode characters in local part and domain (for international alphabets)
   * - Standard email format: local-part@domain.tld
   * - Blocks '+' if allowPlusAliases is false
   * - Requires TLD if requireTLD is true
   */
  private buildRegex(): RegExp {
    // Local part pattern
    // - Unicode letters, numbers, and common email special characters
    // - Excludes '+' if not allowed
    const localPartChars = this.options.allowPlusAliases 
      ? 'a-zA-Z0-9._%\-+' 
      : 'a-zA-Z0-9._%\-';
    
    // Unicode support for international characters
    const unicodeLocal = '\p{L}\p{N}._%\-'; // Unicode letters and numbers
    const localPattern = `[${localPartChars}\p{L}\p{N}]+`;

    // Domain pattern
    // - Supports Unicode domain names (IDN)
    // - Allows hyphens but not at start/end of domain parts
    const domainPattern = this.options.requireTLD
      ? '([a-zA-Z0-9\p{L}]([a-zA-Z0-9\p{L}\-]{0,61}[a-zA-Z0-9\p{L}])?\.)+[a-zA-Z\p{L}]{2,}'
      : '([a-zA-Z0-9\p{L}]([a-zA-Z0-9\p{L}\-]{0,61}[a-zA-Z0-9\p{L}])?\.)+[a-zA-Z\p{L}]+';

    // Full email pattern with Unicode flag
    const pattern = `^${localPattern}@${domainPattern}$`;
    
    return new RegExp(pattern, 'u'); // 'u' flag for Unicode support
  }

  /**
   * Validates an email address
   * @param email The email address to validate
   * @returns ValidationResult with isValid and error details
   */
  validate(email: string): ValidationResult {
    // Check if input is a string
    if (typeof email !== 'string') {
      return {
        isValid: false,
        email: String(email),
        error: 'Input must be a string'
      };
    }

    // Trim whitespace
    const trimmedEmail = email.trim();
    
    // Check for empty string
    if (trimmedEmail.length === 0) {
      return {
        isValid: false,
        email: trimmedEmail,
        error: 'Email cannot be empty'
      };
    }

    // Check basic length constraints (RFC 5321 recommends max 254 chars)
    if (trimmedEmail.length > 254) {
      return {
        isValid: false,
        email: trimmedEmail,
        error: 'Email address too long (max 254 characters)'
      };
    }

    // Check for multiple @ symbols
    const atCount = (trimmedEmail.match(/@/g) || []).length;
    if (atCount !== 1) {
      return {
        isValid: false,
        email: trimmedEmail,
        error: atCount === 0 ? 'Missing @ symbol' : 'Multiple @ symbols found'
      };
    }

    // Check for '+' character if not allowed
    if (!this.options.allowPlusAliases && trimmedEmail.includes('+')) {
      return {
        isValid: false,
        email: trimmedEmail,
        error: 'Plus (+) characters are not allowed'
      };
    }

    // Test against regex pattern
    if (!this.regex.test(trimmedEmail)) {
      return {
        isValid: false,
        email: trimmedEmail,
        error: 'Invalid email format'
      };
    }

    // Additional validation for domain parts
    const [localPart, domain] = trimmedEmail.split('@');
    
    // Check domain parts
    const domainParts = domain.split('.');
    for (const part of domainParts) {
      if (part.length === 0) {
        return {
          isValid: false,
          email: trimmedEmail,
          error: 'Empty domain part'
        };
      }
      
      if (part.startsWith('-') || part.endsWith('-')) {
        return {
          isValid: false,
          email: trimmedEmail,
          error: 'Domain part cannot start or end with hyphen'
        };
      }
    }

    // Check local part doesn't start or end with dot
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      return {
        isValid: false,
        email: trimmedEmail,
        error: 'Local part cannot start or end with dot'
      };
    }

    // Check for consecutive dots in local part
    if (localPart.includes('..')) {
      return {
        isValid: false,
        email: trimmedEmail,
        error: 'Local part cannot contain consecutive dots'
      };
    }

    return {
      isValid: true,
      email: trimmedEmail
    };
  }

  /**
   * Simple static validation method
   * @param email The email address to validate
   * @param options Optional validation options
   * @returns ValidationResult
   */
  static validate(email: string, options?: EmailValidatorOptions): ValidationResult {
    const validator = new EmailValidator(options);
    return validator.validate(email);
  }

  /**
   * Check if an email is valid (simple boolean check)
   * @param email The email address to validate
   * @param options Optional validation options
   * @returns boolean
   */
  static isValid(email: string, options?: EmailValidatorOptions): boolean {
    return this.validate(email, options).isValid;
  }
}

// Test cases to demonstrate functionality
const testCases: Array<{ email: string; expected: boolean; description: string }> = [
  // Valid emails
  { email: 'test@example.com', expected: true, description: 'Standard email' },
  { email: 'john.doe@company.org', expected: true, description: 'Email with dots in local part' },
  { email: 'user_name@domain.co.uk', expected: true, description: 'Email with underscore and multi-level TLD' },
  { email: 'tëst@example.com', expected: true, description: 'Email with Unicode character in local part' },
  { email: 'test@münchen.de', expected: true, description: 'Email with Unicode in domain' },
  { email: 'user-123@sub.domain.com', expected: true, description: 'Email with numbers and hyphen' },
  { email: 'first.last@sub-sub.domain.com', expected: true, description: 'Email with multiple subdomains' },
  
  // Invalid emails
  { email: '', expected: false, description: 'Empty string' },
  { email: '   ', expected: false, description: 'Whitespace only' },
  { email: 'test+alias@example.com', expected: false, description: 'Plus alias (blocked by default)' },
  { email: 'test@example', expected: false, description: 'Missing TLD' },
  { email: 'test@.com', expected: false, description: 'Domain starts with dot' },
  { email: 'test@example..com', expected: false, description: 'Consecutive dots in domain' },
  { email: '.test@example.com', expected: false, description: 'Local part starts with dot' },
  { email: 'test.@example.com', expected: false, description: 'Local part ends with dot' },
  { email: 'test..name@example.com', expected: false, description: 'Consecutive dots in local part' },
  { email: '@example.com', expected: false, description: 'Missing local part' },
  { email: 'test@', expected: false, description: 'Missing domain' },
  { email: 'test@example.com.', expected: false, description: 'Domain ends with dot' },
  { email: 'test@-domain.com', expected: false, description: 'Domain part starts with hyphen' },
  { email: 'test@domain-.com', expected: false, description: 'Domain part ends with hyphen' },
  { email: 'test@example.c', expected: false, description: 'TLD too short' },
  { email: 'a'.repeat(255) + '@example.com', expected: false, description: 'Email too long' },
  
  // International emails
  { email: '用户@例子.中国', expected: true, description: 'Chinese characters' },
  { email: '用户@例子.中国', expected: true, description: 'Chinese characters' },
  { email: ' मामा@उदाहरण.भारत', expected: true, description: 'Hindi characters' },
  { email: 'يستخدم@مثال.شبكة', expected: true, description: 'Arabic characters' },
  { email: 'користувач@приклад.укр', expected: true, description: 'Ukrainian characters' },
  { email: 'utilisateur@exemple.fr', expected: true, description: 'French with accents' },
];

// Run tests
console.log('Email Validator Tests\n');
console.log('='.repeat(50));

testCases.forEach((testCase, index) => {
  const result = EmailValidator.validate(testCase.email);
  const passed = result.isValid === testCase.expected;
  const status = passed ? '✓ PASS' : '✗ FAIL';
  
  console.log(`${index + 1}. ${status} | ${testCase.description}`);
  console.log(`   Email: "${testCase.email}"`);
  console.log(`   Expected: ${testCase.expected}, Got: ${result.isValid}`);
  if (!passed) {
    console.log(`   Error: ${result.error || 'None'}`);
  }
  console.log('');
});

console.log('='.repeat(50));
console.log('\nSimple usage example:');
console.log('const isValid = EmailValidator.isValid("test@example.com");');
console.log('const result = EmailValidator.validate("test@example.com");');

// Export for module usage
export { EmailValidator, ValidationResult, EmailValidatorOptions };