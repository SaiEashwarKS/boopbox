import { defineConfig } from "oxlint";

export default defineConfig({
  // Enable relevant built-in plugins for a modern TS backend stack
  plugins: ["typescript", "unicorn", "oxc", "import", "promise", "node"],

  // Category-level severity
  categories: {
    correctness: "error",
    suspicious: "warn",
    perf: "warn",
  },

  // Environment
  env: {
    node: true,
    es2024: true,
  },

  // Fine-grained rule overrides
  rules: {
    // -- TypeScript ---------------------------------------------------------
    "typescript/no-explicit-any": "error",
    "typescript/no-non-null-assertion": "warn",
    "typescript/consistent-type-imports": "warn",

    // -- Type-aware rules (require --type-aware flag) -----------------------
    "typescript/no-floating-promises": "error",
    "typescript/no-misused-promises": "error",
    "typescript/await-thenable": "error",
    "typescript/no-unsafe-assignment": "warn",
    "typescript/no-unsafe-call": "warn",
    "typescript/no-unsafe-member-access": "warn",
    "typescript/no-unsafe-return": "warn",

    // -- Import hygiene -----------------------------------------------------
    "import/no-cycle": "error",
    "import/no-self-import": "error",
    "import/no-duplicates": "warn",

    // -- Promise ------------------------------------------------------------
    "promise/no-return-wrap": "error",

    // -- Unicorn (modern JS patterns) ---------------------------------------
    "unicorn/prefer-node-protocol": "error",
    "unicorn/no-array-for-each": "warn",
    "unicorn/prefer-top-level-await": "warn",

    // -- Core ESLint --------------------------------------------------------
    "no-console": "warn",
    "no-debugger": "error",
    "no-unused-vars": "off", // delegated to TypeScript's noUnusedLocals
    "eslint/no-unused-vars": "off",
  },

  ignorePatterns: ["dist", "node_modules", ".turbo", ".next", "build"],
});
