// "off" or 0 - turn the rule off
// "warn" or 1 - turn the rule on as a warning (doesn’t affect exit code)
// "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
module.exports = {
    "parser": "babel-eslint",
    "extends": "airbnb",
    "env": {
      "node": true,
      "mocha": true
    },
    "rules": {
      "no-script-url": "off",
      "linebreak-style": "off",
      "indent": ["off", 4],
      "semi": ["off"],
      "arrow-parens": ["off"],
      "compat/compat": "off",
      "consistent-return": "off",
      "comma-dangle": "off",
      "generator-star-spacing": "off",
      "import/no-unresolved": "off",
      "import/no-extraneous-dependencies": "off",
      "no-console": "off",
      "no-use-before-define": "off",
      "no-multi-assign": "off",
      "promise/param-names": "off",
      "promise/always-return": "off",
      "promise/catch-or-return": "off",
      "promise/no-native": "off",
      "quotes": ["off", "single"],
      "strict": ["off", "never"],
      "no-underscore-dangle": "off"
    },
    "plugins": [
      "import",
      "promise",
      "compat"
    ]
  }
