import globals from "globals";

export default [
  {
    ignores: ["assets/js/bootstrap.min.js"],
  },
  {
    files: ["assets/js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        ...globals.browser,
        Tesseract: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { args: "none" }],
      "no-undef": "error",
      "no-eval": "warn",
      "no-console": "off",
      "no-var": "warn",
      "prefer-const": "warn",
      eqeqeq: ["warn", "smart"],
      "no-throw-literal": "error",
      "no-unreachable": "error",
      "no-constant-condition": "warn",
      "getter-return": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "no-extra-boolean-cast": "warn",
      "no-irregular-whitespace": "error",
      "no-redeclare": "error",
      "no-self-assign": "warn",
      "no-unexpected-multiline": "warn",
    },
  },
];
