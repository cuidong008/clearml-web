const {defineConfig} = require('eslint-define-config')

module.exports = defineConfig({
    env: { // 环境
        browser: true, // 浏览器环境中的全局变量。
        node: true, // Node.js 全局变量和 Node.js 作用域。
        es6: true // 启用除了 modules 以外的所有 ECMAScript 6 特性（该选项会自动设置 ecmaVersion 解析器选项为 6）。
    },
    parser: "@typescript-eslint/parser", // 解析器
    parserOptions: { // 解析器配置
        ecmaVersion: "latest", // 5（默认）， 你可以使用 6、7、8、9 或 10 来指定你想要使用的 ECMAScript 版本。你也可以用年份命名的版本号，你也可以用 latest 来指向最新的版本。
        sourceType: "module", // 设置为 "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)。
        ecmaFeatures: { // 表示你想使用的额外的语言特性
            jsx: true // 启用 JSX
        }
    },
    extends: [
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended"
    ],
    settings: {
        react: {
            version: 'detect'
        }
    },
    plugins: [
        "react",
        "@typescript-eslint",
        "prettier"
    ],
    rules: {
        "prettier/prettier": "error",
        "arrow-body-style": "off",
        "prefer-arrow-callback": "off",
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-unused-vars': "off",
        'no-unused-vars': "off",
        'space-before-function-paren': 'off',
        "no-confusing-arrow": 0, // 禁止在可能与比较操作符相混淆的地方使用箭头函数
        // eslint-plugin-react 的配置
        "react/no-this-in-sfc": 0,
        "react/prop-types": 0,
        "react/display-name": "off",
    }
})