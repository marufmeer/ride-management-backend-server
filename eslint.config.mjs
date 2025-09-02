import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  {
    rules:{
        "no-console":"warn",
      "@typescript-eslint/no-explicit-any":"off",
       "no-useless-escape": "off",
        "@typescript-eslint/no-non-null-assertion":"off",
       "@typescript-eslint/no-dynamic-delete": "off"
    }
  }
);