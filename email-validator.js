/**
 * Email Validator
 * 
 * Validates email addresses according to RFC standards with additional constraints:
 * - Supports international characters (Unicode) for different country alphabets
 * - Blocks '+' characters to prevent aliasing
 * - Uses regex pattern matching (no exhaustive domain lists)
 * - Rejects invalid characters
 */

/**
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether the email is valid
 * @property {string} email - The email that was validated
 * @property {string} [error] - Error message if invalid
 */

/**
 * @typedef {Object} EmailValidatorOptions
 * @property {boolean} [allowPlusAliases=false] - Allow '+' characters in email
 * @property {boolean} [requireTLD=true] - Require top-level domain
 */

class EmailValidator {
  /**
   * @param {EmailValidatorOptions} [options={}] - Validation options
   */
  constructor(options = {}) {
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
   * @returns {RegExp}
   */
  buildRegex() {
    // Local part pattern
    const localPartChars = this.options.allowPlusAliases 
      ? 'a-zA-Z0-9._%\\-+' 
      : 'a-zA-Z0-9._%\\-';
    
    // Unicode support for international characters
    const localPattern = `[${localPartChars}\p{L}\p{N}]+`;

    // Domain pattern
    const domainPattern = this.options.requireTLD
      ? '([a-zA-Z0-9\p{L}]([a-zA-Z0-9\p{L}\-]{0,61}[a-zA-Z0-9\p{L}])?\.)+[a-zA-Z\p{L}]{2,}'
      : '([a-zA-Z0-9\p{L}]([a-zA-Z0-9\p{L}\-]{0,61}[a-zA-Z0-9\p{L}])?\.)+[a-zA-Z\p{L}]+';

    // Full email pattern with Unicode flag
    const pattern = `^${localPattern}@${domainPattern}$`;
    
    return new RegExp(pattern, 'u'); // 'u' flag for Unicode support
  }

  /**
   * Validates an email address
   * @param {string} email - The email address to validate
   * @returns {ValidationResult} Validation result
   */
  validate(email) {
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
   * @param {string} email - The email address to validate
   * @param {EmailValidatorOptions} [options] - Optional validation options
   * @returns {ValidationResult} Validation result
   */
  static validate(email, options) {
    const validator = new EmailValidator(options);
    return validator.validate(email);
  }

  /**
   * Check if an email is valid (simple boolean check)
   * @param {string} email - The email address to validate
   * @param {EmailValidatorOptions} [options] - Optional validation options
   * @returns {boolean} Whether the email is valid
   */
  static isValid(email, options) {
    return this.validate(email, options).isValid;
  }
}

// Simple standalone function for basic usage
/**
 * Simple email validation function
 * @param {string} email - The email to validate
 * @returns {boolean} Whether the email is valid
 */
function isValidEmail(email) {
  return EmailValidator.isValid(email);
}

// Export for different module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EmailValidator, isValidEmail };
} else if (typeof window !== 'undefined') {
  window.EmailValidator = EmailValidator;
  window.isValidEmail = isValidEmail;
}

// Test cases
const testCases = [
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
  { email: 'मामा@उदाहरण.भारत', expected: true, description: 'Hindi characters' },
  { email: 'يستخدم@مثال.شبكة', expected: true, description: 'Arabic characters' },
  { email: 'користувач@приклад.укр', expected: true, description: 'Ukrainian characters' },
  { email: 'utilisateur@exemple.fr', expected: true, description: 'French with accents' },
];

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  console.log('Email Validator Tests\n');
  console.log('='.repeat(50));

  let passed = 0;
  let failed = 0;

  testCases.forEach((testCase, index) => {
    const result = EmailValidator.validate(testCase.email);
    const isPass = result.isValid === testCase.expected;
    const status = isPass ? '✓ PASS' : '✗ FAIL';
    
    console.log(`${index + 1}. ${status} | ${testCase.description}`);
    console.log(`   Email: "${testCase.email}"`);
    console.log(`   Expected: ${testCase.expected}, Got: ${result.isValid}`);
    if (!isPass) {
      console.log(`   Error: ${result.error || 'None'}`);
      failed++;
    } else {
      passed++;
    }
    console.log('');
  });

  console.log('='.repeat(50));
  console.log(`\nResults: ${passed} passed, ${failed} failed out of ${testCases.length} tests`);
  
  // Usage examples
  console.log('\nUsage examples:');
  console.log('1. Simple validation:');
  console.log('   const isValid = EmailValidator.isValid("test@example.com");');
  console.log('');
  console.log('2. Detailed validation:');
  console.log('   const result = EmailValidator.validate("test@example.com");');
  console.log('   console.log(result.isValid, result.error);');
  console.log('');
  console.log('3. With options:');
  console.log('   const validator = new EmailValidator({ allowPlusAliases: true });');
  console.log('   const result = validator.validate("test+alias@example.com");');
}