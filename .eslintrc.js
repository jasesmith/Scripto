// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html',
    'vue'
  ],
  // check if imports actually resolve
  settings: {
    'import/resolver': {
      'webpack': {
        'config': 'webpack.config.js'
      }
    }
  },
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // no unnecessary semicolons
    'semi': ['error', 'never'],
    // allow parans to group ternaries to prevent confusion
    'no-confusing-arrow': ['error', {'allowParens': true}],
    // allow assignmnts in returns
    'no-return-assign': ['error', 'except-parens'],
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // Don't get mad, get glad!
    "no-console":0,
    "arrow-body-style":0,
    "prefer-template":0,
    "no-alert":0,
    "no-param-reassign":0,
    "no-var":0,
    "no-mixed-operators": 0,
    "no-lonely-if": 0
  }
}
