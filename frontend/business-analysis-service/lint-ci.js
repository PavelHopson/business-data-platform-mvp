#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Running ESLint...');

try {
  execSync('npx eslint . --ext .js,.jsx,.ts,.tsx --max-warnings 0', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ ESLint passed');
} catch (error) {
  console.error('❌ ESLint failed');
  process.exit(1);
}

console.log('🔍 Running TypeScript type check...');

try {
  execSync('npx tsc --noEmit', {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log('✅ TypeScript type check passed');
} catch (error) {
  console.error('❌ TypeScript type check failed');
  process.exit(1);
}

console.log('🎉 All checks passed!');
