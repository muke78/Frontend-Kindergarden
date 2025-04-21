/** @type {import("prettier").Config} */
export default {
  overrides: [
    {
      files: ["*.js", "*.jsx"],
      options: {
        parser: "babel",
      },
    },
    {
      files: ["*.ts", "*.tsx"],
      options: {
        parser: "typescript",
      },
    },
    {
      files: ["*.html"],
      options: {
        parser: "html",
      },
    },
  ],
  semi: true,
  singleQuote: true,
  trailingComma: "es5",
  printWidth: 80,
  tabWidth: 2,
  bracketSpacing: true,
  arrowParens: "avoid",
};
