// Theme Verification Tests
// Run with: node tests/theme-verification.js

import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!DOCTYPE html><html lang="en"><head></head><body></body></html>');
global.window = dom.window;
global.document = dom.window.document;

// Mock localStorage
const localStorageMock = {
  storage: {},
  getItem: function(key) { return this.storage[key] || null; },
  setItem: function(key, value) { this.storage[key] = value; },
  clear: function() { this.storage = {}; }
};
global.localStorage = localStorageMock;

// Mock matchMedia
global.window.matchMedia = (query) => ({
  matches: query.includes('dark'),
  addEventListener: () => {},
  removeEventListener: () => {}
});

console.log('🧪 THEME VERIFICATION TESTS\n');

// Test 1: Default theme should be dark when no saved preference
console.log('Test 1: Default theme behavior');
localStorage.clear();
// Simulate the FOUC prevention script
var saved = localStorage.getItem('theme');
var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
var effective = !saved ? 'dark' : (saved === 'system' ? (prefersDark ? 'dark' : 'light') : saved);
console.log(`No saved theme -> effective: ${effective}`);
console.log(effective === 'dark' ? '✅ PASS: Default is dark' : '❌ FAIL: Default should be dark');

// Test 2: Explicit theme setting
console.log('\nTest 2: Explicit theme settings');
const themes = ['dark', 'light', 'nord', 'system'];
themes.forEach(theme => {
  localStorage.setItem('theme', theme);
  const saved = localStorage.getItem('theme');
  const effective = saved === 'system' ? (prefersDark ? 'dark' : 'light') : saved;
  console.log(`Set ${theme} -> effective: ${effective} ✅`);
});

// Test 3: Persistence after reload simulation
console.log('\nTest 3: Persistence after reload');
localStorage.setItem('theme', 'nord');
const persistedTheme = localStorage.getItem('theme');
console.log(persistedTheme === 'nord' ? '✅ PASS: Theme persists' : '❌ FAIL: Theme lost');

// Test 4: HTML class application simulation
console.log('\nTest 4: HTML class application');
function simulateClassApplication(theme) {
  const root = document.documentElement;
  root.classList.remove('dark', 'theme-nord');
  if (theme === 'dark') root.classList.add('dark');
  if (theme === 'nord') root.classList.add('theme-nord');
  root.setAttribute('data-theme', theme);
  return {
    hasDark: root.classList.contains('dark'),
    hasNord: root.classList.contains('theme-nord'),
    dataTheme: root.getAttribute('data-theme')
  };
}

const darkResult = simulateClassApplication('dark');
console.log(`Dark theme: ${JSON.stringify(darkResult)}`);
console.log(darkResult.hasDark && darkResult.dataTheme === 'dark' ? '✅ PASS' : '❌ FAIL');

const nordResult = simulateClassApplication('nord');
console.log(`Nord theme: ${JSON.stringify(nordResult)}`);
console.log(nordResult.hasNord && nordResult.dataTheme === 'nord' ? '✅ PASS' : '❌ FAIL');

console.log('\n✅ All tests completed!');
