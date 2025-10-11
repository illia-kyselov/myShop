import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import tailwindcss from "eslint-plugin-tailwindcss";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";

export default [
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
    },
    {
        plugins: {
            tailwindcss,
            react,
            "react-hooks": reactHooks,
        },
        rules: {
            "tailwindcss/no-custom-classname": "off",
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": "warn",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_" },
            ],
            "@typescript-eslint/no-require-imports": "off",
        },
    },
    prettier,
];
