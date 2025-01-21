import eslint from '@eslint/js';
import eslintPluginTailwindCSS from 'eslint-plugin-tailwindcss';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  eslintPluginTailwindCSS.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    settings: {
      tailwindcss: {
        "callees": ["classnames", "clsx", "twMerge", "cx", "cn"],
        "tags": ["tw"]
      },
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          "argsIgnorePattern": "^_",  // ignore unused variables starting with _
          "varsIgnorePattern": "^_"   // ignore unused variables starting with _
        }
      ],
      "tailwindcss/classnames-order": [
        "warn",
        {
          "callees": ["classnames", "clsx", "twMerge", "cx", "cn"],
          "tags": ["tw"]
        }
      ],
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          "allowNumber": true,
        },
      ],
      "@typescript-eslint/no-misused-promises": ["error", {
        "checksVoidReturn": {
          "attributes": false
        }
      }]
    },
  },
);
