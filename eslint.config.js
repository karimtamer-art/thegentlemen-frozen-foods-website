import html from "@html-eslint/eslint-plugin";

export default [
  // Lint plain .js files
  {
    files: ["js/**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        navigator: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "error",
      "no-console": "off",
      eqeqeq: ["error", "always"],
      "no-var": "warn",
      "prefer-const": "warn",
    },
  },
  // Lint HTML files
  {
    ...html.configs["flat/recommended"],
    files: ["**/*.html"],
    plugins: { "@html-eslint": html },
    parser: html.parser,
    rules: {
      ...html.configs["flat/recommended"].rules,
      "@html-eslint/require-lang": "error",
      "@html-eslint/require-title": "error",
      "@html-eslint/no-duplicate-id": "error",
      "@html-eslint/require-img-alt": "error",
      "@html-eslint/no-inline-styles": "warn",
      "@html-eslint/no-target-blank": "error",
    },
  },
];
