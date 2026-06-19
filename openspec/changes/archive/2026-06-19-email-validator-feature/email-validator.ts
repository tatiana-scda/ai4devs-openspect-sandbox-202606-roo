/**
 * Email Validator Implementation - TypeScript
 * 
 * Part of OpenSpec change: email-validator-feature
 * Implements the requirements specified in specs/email-validation/spec.md
 */

// Unicode-aware email regex pattern
const EMAIL_REGEX = /^[\p{L}\p{N}._%\-+]+@([\p{L}\p{N}]([\p{L}\p{N}\-]{0,61}[\p{L}\p{N}])?\.)+[\p{L}]{2,}$/u;

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  email: string;
  error?: string;
}

/**
 * Email validator configuration options
 */
export interface EmailValidatorOptions {
  allowPlusAliases?: boolean;  // Default: false - blocks '+' to prevent aliasing
  requireTLD?: boolean;         // Default: true - requires top-level domain
}

/**
 * Email Validator Class
 * 
 * Implements all scenarios from specs/email-validation/spec.md:
 * - Validate standard email formats
 * - Support Unicode characters in email addresses  
 * - Block plus characters by default
 * - Use regex patterns for validation
 * - Validate input constraints
 * - Provide detailed error messages
 * - Clean API interface
 */
export class EmailValidator {
  private readonly options: Required<EmailValidatorOptions>;

  /**
   * Creates a new EmailValidator instance
   * @param options - Configuration options for validation
   */
  constructor(options: EmailValidatorOptions = {}) {
    this.options = {
      allowPlusAliases: false,
      requireTLD: true,
      ...options
    };
  }

  /**
   * Validates an email address
   * 
   * Implements scenarios from specs/email-validation/spec.md:
   * - Validate standard email formats
   * - Support Unicode characters in email addresses
   * - Block plus characters by default
   * - Reject invalid characters and formats
   * - Validate input constraints
   * - Provide detailed error messages
   * 
   * @param email - The email address to validate
   * @returns Validation result with error details
   */
  validate(email: string): ValidationResult {
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

    // Scenario: Validate standard email formats - success
    return {
      isValid: true,
      email: trimmedEmail
    };
  }

  /**
   * Simple static validation method
   * 
   * @param email - The email address to validate
   * @param options - Optional validation options
   * @returns Validation result
   */
  static validate(email: string, options?: EmailValidatorOptions): ValidationResult {
    const validator = new EmailValidator(options);
    return validator.validate(email);
  }

  /**
   * Check if an email is valid (simple boolean check)
   * 
   * @param email - The email address to validate
   * @param options - Optional validation options
   * @returns Whether the email is valid
   */
  static isValid(email: string, options?: EmailValidatorOptions): boolean {
    return this.validate(email, options).isValid;
  }
}

/**
 * Simple standalone function for basic usage
 * 
 * @param email - The email to validate
 * @returns Whether the email is valid
 */
export function isValidEmail(email: string): boolean {
  return EmailValidator.isValid(email);
}