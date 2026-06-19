/**
 * Email Validator Implementation
 * 
 * Part of OpenSpec change: email-validator-feature
 * Implements the requirements specified in specs/email-validation/spec.md
 */

const EMAIL_REGEX = /^[\p{L}\p{N}._%\-+]+@([\p{L}\p{N}]([\p{L}\p{N}\-]{0,61}[\p{L}\p{N}])?\.)+[\p{L}]{2,}$/u;

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

/**
 * Email Validator Class
 * 
 * Implements all scenarios from specs/email-validation/spec.md
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
  }

  /**
   * Validates an email address
   * 
   * @param {string} email - The email address to validate
   * @returns {ValidationResult} Validation result with error details
   */
  validate(email) {
    // Scenario: Validate input types and constraints
    if (typeof email !== 'string') {
      return {
        isValid: false,
        email: String(email),
        error: 'Input must be a string'
      };
    }

    // Trim whitespace
    const trimmedEmail = email.trim();
    
    // Scenario: Empty string rejection
    if (trimmedEmail.length === 0) {
      return {
        isValid: false,
        email: trimmedEmail,
        error: 'Email cannot be empty'
      };
    }

    // RFC 5321: Maximum email length is 254 characters
    if (trimmedEmail.length > 254) {
      return {
        isValid: false,
        email: trimmedEmail,
        error: 'Email address too long (max 254 characters)'
      };
    }

    // Scenario: Exactly one @ symbol
    const atCount = (trimmedEmail.match(/@/g) || []).length;
    if (atCount !== 1) {
      return {
        isValid: false,
        email: trimmedEmail,
        error: atCount === 0 ? 'Missing @ symbol' : 'Multiple @ symbols found'
      };
    }

    // Scenario: Block plus characters by default
    if (!this.options.allowPlusAliases && trimmedEmail.includes('+')) {
      return {
        isValid: false,
        email: trimmedEmail,
        error: 'Plus (+) characters are not allowed'
      };
    }

    // Scenario: Use regex patterns for validation with Unicode support
    if (!EMAIL_REGEX.test(trimmedEmail)) {
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
   * 
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
   * 
   * @param {string} email - The email address to validate
   * @param {EmailValidatorOptions} [options] - Optional validation options
   * @returns {boolean} Whether the email is valid
   */
  static isValid(email, options) {
    return this.validate(email, options).isValid;
  }
}

/**
 * Simple standalone function for basic usage
 * 
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

// Auto-run tests if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  console.log('📧 Email Validator - OpenSpec Implementation\n');
  console.log('Change: email-validator-feature');
  console.log('Spec: specs/email-validation/spec.md\n');
  
  const testCases = [
    { email: 'test@example.com', expected: true, scenario: 'Standard email format' },
    { email: 'john.doe@company.org', expected: true, scenario: 'Email with dots' },
    { email: 'user_name@domain.co.uk', expected: true, scenario: 'Email with underscore' },
    { email: '用户@例子.中国', expected: true, scenario: 'Chinese Unicode' },
    { email: 'tëst@example.com', expected: true, scenario: 'European accents' },
    { email: 'test@münchen.de', expected: true, scenario: 'German umlauts' },
    { email: '', expected: false, scenario: 'Empty string' },
    { email: 'test+alias@example.com', expected: false, scenario: 'Plus blocked' },
    { email: 'test@domain@com', expected: false, scenario: 'Multiple @' }
  ];

  let passed = 0;
  testCases.forEach(testCase => {
    const result = EmailValidator.validate(testCase.email);
    if (result.isValid === testCase.expected) passed++;
  });

  console.log(`✅ ${passed}/${testCases.length} test scenarios passed`);
  console.log('Implementation complete for email-validator-feature change.');
}