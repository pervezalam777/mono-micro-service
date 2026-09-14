// Commitlint Configuration
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // Feature
        'fix',      // Bug fix
        'docs',     // Documentation
        'style',    // Code style
        'refactor', // Code refactoring
        'perf',     // Performance improvements
        'test',     # Testing
        'chore',    # Maintenance
        'ci',       # CI/CD
        'build',    # Build system
        'revert',   # Revert changes
        'release'   # Release
      ]
    ],
    'scope-enum': [
      2,
      'always',
      [
        'auth',
        'author',
        'book',
        'common',
        'web',
        'config',
        'docker',
        'terraform'
      ]
    ],
    'subject-case': [2, 'never', ['pascal-case', 'upper-case']],
    'header-max-length': [2, 'always', 100]
  }
}
