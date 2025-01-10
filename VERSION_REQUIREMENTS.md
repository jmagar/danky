# Version Requirements

This document outlines the version requirements for key dependencies in the project.

## Core Dependencies

- React: `^19.0.0` (Current: 19.0.0, can upgrade but never downgrade)
- Next.js: `^15.1.4` (Current: 15.1.4, can upgrade but never downgrade)
  - `@next/eslint-plugin-next`: `^15.1.4`
  - `eslint-config-next`: `^15.1.4`
- ESLint: `^9.17.0` (Current: 9.17.0, can upgrade but never downgrade)

## Rationale

- **React 19**: Required for latest features and performance improvements including pre-warming for suspended trees and new React DOM static APIs
- **Next.js 15.1**: Required for compatibility with React 19 and latest features including improved performance and stability. All Next.js related packages (including ESLint plugins) must match this version
- **ESLint 9**: Required for modern JavaScript/TypeScript linting capabilities

## Upgrade Policy

These versions are minimum requirements. You can:

- ✅ Upgrade to newer versions
- ❌ Never downgrade below these versions

Downgrading will break functionality and compatibility within the project.
