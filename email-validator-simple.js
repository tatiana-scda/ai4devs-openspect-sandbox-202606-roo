/**
 * Simple Email Validator Script
 * 
 * A minimal email validator that can be used standalone or as a module.
 * Supports international characters and blocks '+' aliases by default.
 * Uses regex pattern matching without exhaustive domain lists.
 */

/**
 * Email regex pattern that supports:
 * - Standard ASCII characters
 * - Unicode characters (for international alphabets)
 * - Common email special characters (., _, %, -)
 * - Excludes '+' by default to prevent aliasing
 * - Requires proper domain structure
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%\p{L}\p{N}\-]+@([a-zA-Z0-9\p{L}]([a-zA-Z0-9\p{L}\-]{0,61}[a-zA-Z0-9\p{L}])?\.)+[a-zA-Z\p{L}]{2,}$/u;

/**
 * Validates an email address string
 * @param {string} email - The email to validate
 * @param {Object} [options] - Validation options
 * @param {boolean} [options.allowPlus=false] - Allow '+' characters
 * @returns {Object} - { isValid: boolean, error?: string }
 */
function validateEmail(email, options = {}) {
  const { allowPlus = false } = options;

  // Type check
  if (typeof email !== 'string') {
    return { isValid: false, error: 'Input must be a string' };
  }

  // Trim and check empty
  const trimmed = email.trim();
  if (!trimmed) {
    return { isValid: false, error: 'Email cannot be empty' };
  }

  // Length check (RFC 5321 max)
  if (trimmed.length > 254) {
    return { isValid: false, error: 'Email too long' };
  }

  // Check for exactly one @
  const atCount = (trimmed.match(/@/g) || []).length;
  if (atCount !== 1) {
    return { isValid: false, error: atCount ? 'Multiple @ symbols' : 'Missing @ symbol' };
  }

  // Block '+' if not allowed
  if (!allowPlus && trimmed.includes('+')) {
    return { isValid: false, error: 'Plus (+) characters not allowed' };
  }

  // Test regex
  if (!EMAIL_REGEX.test(trimmed)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  // Additional checks
  const [local, domain] = trimmed.split('@');
  
  // Local part checks
  if (local.startsWith('.') || local.endsWith('.')) {
    return { isValid: false, error: 'Local part cannot start/end with dot' };
  }
  
  if (local.includes('..')) {
    return { isValid: false, error: 'Local part cannot have consecutive dots' };
  }

  // Domain checks
  const parts = domain.split('.');
  if (parts.some(part => !part)) {
    return { isValid: false, error: 'Empty domain part' };
  }
  
  if (parts.some(part => part.startsWith('-') || part.endsWith('-'))) {
    return { isValid: false, error: 'Domain part cannot start/end with hyphen' };
  }

  return { isValid: true };
}

/**
 * Simple boolean validation
 * @param {string} email - The email to validate
 * @param {Object} [options] - Validation options
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email, options) {
  return validateEmail(email, options).isValid;
}

// Test cases to demonstrate usage
const tests = [
  // Valid
  ['test@example.com', true, 'Standard email'],
  ['john.doe@company.org', true, 'Email with dots'],
  ['tëst@example.com', true, 'Unicode in local'],
  ['test@münchen.de', true, 'Unicode in domain'],
  ['用户@例子.中国', true, 'Chinese email'],
  ['मामा@उदाहरण.भारत', true, 'Hindi email'],
  
  // Invalid
  ['', false, 'Empty'],
  ['test+alias@example.com', false, 'Plus alias (blocked)'],
  ['test@example', false, 'No TLD'],
  ['@example.com', false, 'No local part'],
  ['test@.com', false, 'Domain starts with dot'],
  ['.test@example.com', false, 'Local starts with dot'],
  ['test..name@example.com', false, 'Consecutive dots'],
];

// Run tests if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  console.log('📧 Simple Email Validator\n');
  
  let passed = 0;
  tests.forEach(([email, expected, desc]) => {
    const result = validateEmail(email);
    const pass = result.isValid === expected;
    console.log(`${pass ? '✓' : '✗'} ${desc}: "${email}" -> ${result.isValid}`);
    if (pass) passed++;
  });
  
  console.log(`\n${passed}/${tests.length} tests passed`);
  
  // Usage examples
  console.log('\n📖 Usage:');
  console.log('  validateEmail("test@example.com") // -> { isValid: true }');
  console.log('  isValidEmail("test@example.com")   // -> true');
  console.log('  validateEmail("+test@example.com")  // -> { isValid: false, error: "..." }');
  
  // Export for module usage
  module.exports = { validateEmail, isValidEmail };
}

// Browser export
if (typeof window !== 'undefined') {
  window.validateEmail = validateEmail;
  window.isValidEmail = isValidEmail;
}