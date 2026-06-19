# Email Validator Feature

## Overview
Create a validator for users' inputed email that supports international characters and follows the specified constraints.

## Requirements
- Consider different servers and countries alphabets for valid entries
- Do not accept invalid characters  
- Output should validate a string
- Use regex, don't make exhaustive list of domains
- Block '+' characters to prevent aliasing (as per delivery observations)

## Acceptance Criteria
- [ ] Validates standard email formats (user@domain.com)
- [ ] Supports Unicode characters for international alphabets
- [ ] Rejects emails with '+' characters by default
- [ ] Uses regex pattern matching
- [ ] Returns validation result with error details
- [ ] Handles edge cases (empty, too long, multiple @ symbols)
- [ ] Includes test cases demonstrating success and failure

## Non-Goals
- Do not create exhaustive domain lists
- Do not implement full RFC 5322 compliance (simplified for practical use)
- Do not validate actual domain existence (DNS lookup)

## Technical Notes
- Use Unicode-aware regex patterns (`\p{L}` for letters, `\p{N}` for numbers)
- Maximum email length: 254 characters (RFC 5321)
- Support international domain names (IDN)
- Configurable option to allow '+' characters if needed