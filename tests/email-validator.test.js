/**
 * Email Validator Test Suite
 * 
 * Part of OpenSpec change: email-validator-feature
 * Tests all scenarios from specs/email-validation/spec.md
 * 
 * Run with: node tests/email-validator.test.js
 */

const { EmailValidator } = require('../email-validator.js');

// Test reporter
class TestReporter {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.suites = [];
    this.currentSuite = null;
  }

  startSuite(name) {
    this.currentSuite = { name, tests: [] };
    this.suites.push(this.currentSuite);
    console.log(`\n📁 ${name}`);
    console.log('-'.repeat(50));
  }

  addTest(testName, email, expected, scenario) {
    const result = EmailValidator.validate(email);
    const isPass = result.isValid === expected;
    
    const testResult = {
      testName,
      email,
      expected,
      actual: result.isValid,
      isPass,
      error: result.error
    };
    
    this.currentSuite.tests.push(testResult);
    
    const status = isPass ? '✅ PASS' : '❌ FAIL';
    console.log(`  ${status} ${testName}`);
    console.log(`     Email: "${email}"`);
    console.log(`     Expected: ${expected}, Got: ${result.isValid}`);
    if (!isPass) {
      console.log(`     Error: ${result.error || 'None'}`);
      this.failed++;
    } else {
      this.passed++;
    }
    console.log('');
    
    return isPass;
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(60));
    
    this.suites.forEach(suite => {
      const suitePassed = suite.tests.filter(t => t.isPass).length;
      const suiteFailed = suite.tests.length - suitePassed;
      console.log(`\n📁 ${suite.name}: ${suitePassed}/${suite.tests.length} passed`);
      
      if (suiteFailed > 0) {
        console.log('   Failed tests:');
        suite.tests.filter(t => !t.isPass).forEach(test => {
          console.log(`   ❌ ${test.testName}`);
        });
      }
    });
    
    console.log('\n' + '='.repeat(60));
    console.log(`🎯 TOTAL: ${this.passed}/${this.passed + this.failed} tests passed`);
    
    if (this.failed === 0) {
      console.log('\n🎉 ALL TESTS PASSED!');
      console.log('✅ All scenarios from specs/email-validation/spec.md are implemented correctly.');
    } else {
      console.log(`\n⚠️  ${this.failed} test(s) failed. Please review.`);
    }
    
    return this.failed === 0;
  }
}

// Main test execution
function runTests() {
  console.log('🧪 Email Validator Test Suite');
  console.log('OpenSpec Change: email-validator-feature');
  console.log('Spec: specs/email-validation/spec.md');
  
  const reporter = new TestReporter();

  // ============================================
  // Task 4: Standard Email Formats
  // ============================================
  reporter.startSuite('Task 4: Standard Email Formats');
  
  reporter.addTest(
    'Basic email format',
    'test@example.com',
    true,
    'Standard email format'
  );
  
  reporter.addTest(
    'Email with dots in local part',
    'john.doe@company.org',
    true,
    'Email with dots in local part'
  );
  
  reporter.addTest(
    'Email with underscore',
    'user_name@domain.com',
    true,
    'Email with underscore in local part'
  );
  
  reporter.addTest(
    'Email with numbers',
    'user123@domain456.com',
    true,
    'Email with numbers in local part and domain'
  );
  
  reporter.addTest(
    'Email with hyphen',
    'user-name@domain-name.com',
    true,
    'Email with hyphens in local part and domain'
  );
  
  reporter.addTest(
    'Multi-level TLD',
    'test@domain.co.uk',
    true,
    'Email with multi-level TLD'
  );
  
  reporter.addTest(
    'Complex subdomains',
    'user@sub.sub2.domain.com',
    true,
    'Email with multiple subdomains'
  );

  // ============================================
  // Task 5: International Characters (Unicode)
  // ============================================
  reporter.startSuite('Task 5: International Characters (Unicode)');
  
  reporter.addTest(
    'Chinese characters',
    '用户@例子.中国',
    true,
    'Chinese Unicode characters in local and domain'
  );
  
  reporter.addTest(
    'Hindi characters',
    'मामा@उदाहरण.भारत',
    true,
    'Hindi Unicode characters'
  );
  
  reporter.addTest(
    'Arabic characters',
    'يستخدم@مثال.شبكة',
    true,
    'Arabic Unicode characters'
  );
  
  reporter.addTest(
    'Ukrainian characters',
    'користувач@приклад.укр',
    true,
    'Ukrainian Unicode characters'
  );
  
  reporter.addTest(
    'European accents',
    'tëst@example.com',
    true,
    'European accented characters in local part'
  );
  
  reporter.addTest(
    'German umlauts in domain',
    'test@münchen.de',
    true,
    'German umlauts in domain'
  );
  
  reporter.addTest(
    'French accents',
    'utilisateur@exemple.fr',
    true,
    'French accented characters'
  );

  // ============================================
  // Task 6: Edge Cases (empty, too long, etc.)
  // ============================================
  reporter.startSuite('Task 6: Edge Cases');
  
  reporter.addTest(
    'Empty string',
    '',
    false,
    'Empty string should be invalid'
  );
  
  reporter.addTest(
    'Whitespace only',
    '   ',
    false,
    'Whitespace only should be invalid'
  );
  
  reporter.addTest(
    'Email too long',
    'a'.repeat(255) + '@example.com',
    false,
    'Email over 254 characters should be invalid'
  );
  
  reporter.addTest(
    'Maximum length email (254 chars)',
    'a'.repeat(248) + '@b.co',
    true,
    'Email exactly at 254 characters should be valid'
  );
  
  reporter.addTest(
    'Non-string input',
    123,
    false,
    'Non-string input should be invalid'
  );
  
  reporter.addTest(
    'Null input',
    null,
    false,
    'Null input should be invalid'
  );
  
  reporter.addTest(
    'Undefined input',
    undefined,
    false,
    'Undefined input should be invalid'
  );

  // ============================================
  // Task 7: Invalid Character Rejection
  // ============================================
  reporter.startSuite('Task 7: Invalid Character Rejection');
  
  reporter.addTest(
    'Multiple @ symbols',
    'test@domain@com',
    false,
    'Email with multiple @ symbols should be invalid'
  );
  
  reporter.addTest(
    'Missing @ symbol',
    'testdomain.com',
    false,
    'Email missing @ symbol should be invalid'
  );
  
  reporter.addTest(
    'Missing local part',
    '@example.com',
    false,
    'Email missing local part should be invalid'
  );
  
  reporter.addTest(
    'Missing domain',
    'test@',
    false,
    'Email missing domain should be invalid'
  );
  
  reporter.addTest(
    'Space in email',
    'test example@domain.com',
    false,
    'Email with space should be invalid'
  );
  
  reporter.addTest(
    'Domain starts with dot',
    'test@.com',
    false,
    'Domain starting with dot should be invalid'
  );
  
  reporter.addTest(
    'Domain ends with dot',
    'test@example.com.',
    false,
    'Domain ending with dot should be invalid'
  );
  
  reporter.addTest(
    'Consecutive dots in domain',
    'test@example..com',
    false,
    'Consecutive dots in domain should be invalid'
  );
  
  reporter.addTest(
    'Local part starts with dot',
    '.test@example.com',
    false,
    'Local part starting with dot should be invalid'
  );
  
  reporter.addTest(
    'Local part ends with dot',
    'test.@example.com',
    false,
    'Local part ending with dot should be invalid'
  );
  
  reporter.addTest(
    'Consecutive dots in local part',
    'test..name@example.com',
    false,
    'Consecutive dots in local part should be invalid'
  );
  
  reporter.addTest(
    'Domain part starts with hyphen',
    'test@-domain.com',
    false,
    'Domain part starting with hyphen should be invalid'
  );
  
  reporter.addTest(
    'Domain part ends with hyphen',
    'test@domain-.com',
    false,
    'Domain part ending with hyphen should be invalid'
  );

  // ============================================
  // Task 8: Plus Character Blocking
  // ============================================
  reporter.startSuite('Task 8: Plus Character Blocking');
  
  reporter.addTest(
    'Plus character blocked by default',
    'test+alias@example.com',
    false,
    'Plus character should be blocked by default'
  );
  
  reporter.addTest(
    'Multiple plus characters',
    'test+alias+name@example.com',
    false,
    'Multiple plus characters should be blocked by default'
  );
  
  // Test for plus character allowed when configured - need to use custom validator
  const validatorWithPlus = new EmailValidator({ allowPlusAliases: true });
  const plusResult = validatorWithPlus.validate('test+alias@example.com');
  const plusTestPassed = plusResult.isValid === true;
  
  if (plusTestPassed) {
    reporter.passed++;
    console.log(`  ✅ PASS Plus character allowed when configured`);
    console.log(`     Email: "test+alias@example.com"`);
    console.log(`     Expected: true, Got: ${plusResult.isValid}`);
    console.log('');
  } else {
    reporter.failed++;
    console.log(`  ❌ FAIL Plus character allowed when configured`);
    console.log(`     Email: "test+alias@example.com"`);
    console.log(`     Expected: true, Got: ${plusResult.isValid}`);
    console.log(`     Error: ${plusResult.error || 'None'}`);
    console.log('');
  }

  // Final summary
  const allPassed = reporter.printSummary();
  
  return allPassed;
}

// Run tests if this file is executed directly
if (require.main === module) {
  const success = runTests();
  process.exit(success ? 0 : 1);
}

module.exports = { runTests };