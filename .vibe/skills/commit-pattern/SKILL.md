---
name: commit-pattern
description: Following the conventional commit format, add the JIRA ticket number and create the commit message based on the changes made in the code. If no JIRA ticket found, use a generic reference number of BONUS-0000.
user-invocable: true
allowed-tools:
  - read_file
  - grep
  - ask_user_question
---

# Commit pattern skill

This skill helps create commit messages following the conventional commit format.