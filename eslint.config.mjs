import stylisticJs from "@stylistic/eslint-plugin-js";
import { includeIgnoreFile } from "@eslint/compat";
import globals from "globals";
import path from 'node:path';
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const gitignorePath = path.resolve(__dirname, ".gitignore");

export default [
    includeIgnoreFile(gitignorePath),
    {
        plugins: {
            "@stylistic/js": stylisticJs,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.jquery,
                ...globals.node,
                require: "writable",
                define: "writable",
            },
            ecmaVersion: 6,
            sourceType: "module",
        },
        rules: {
            "no-bitwise": "error",
            camelcase: "off",
            curly: "error",
            eqeqeq: "error",
            "@stylistic/js/wrap-iife": ["error", "any"],
            "no-use-before-define": ["error", {
                functions: false,
            }],
            "@stylistic/js/comma-style": ["error", "last"],
            "@stylistic/js/max-len": ["error", {
                code: 80,
                ignoreComments: true,
            }],
            "new-cap": "error",
            "no-caller": "error",
            "@stylistic/js/quotes": ["error", "single"],
            "no-undef": "error",
            "no-unused-vars": "error",
            strict: ["error", "function"],
        },
    }
];