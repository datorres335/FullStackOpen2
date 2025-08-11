import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginJest from "eslint-plugin-jest";

export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { 
    files: ["**/*.{js,mjs,cjs,jsx}"], 
    languageOptions: { 
      globals: {
        ...globals.browser,
        ...globals.node,
        __DEV__: "readonly"
      },
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    }
  },
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-react": "off",
      "react/prop-types": "off"
    }
  },
  {
    files: ["**/*.test.{js,jsx}", "**/*.spec.{js,jsx}", "**/__tests__/**/*.{js,jsx}"],
    ...pluginJest.configs['flat/recommended'],
    languageOptions: {
      globals: {
        ...globals.jest
      }
    }
  }
];