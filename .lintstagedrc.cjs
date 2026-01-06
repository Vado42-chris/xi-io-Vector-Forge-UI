/**
 * lint-staged Configuration
 * Runs linters on staged files only
 * 
 * Note: Uses CommonJS (module.exports) for compatibility with lint-staged and pre-commit hooks
 * Even though package.json has "type": "module", config files should use CommonJS
 */

module.exports = {
  '*.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],
  '*.{json,css,md}': ['prettier --write'],
};
