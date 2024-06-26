module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "build",
        "chore",
        "revert",
        "style",
        "test",
      ],
    ],
    "type-empty": [2, "never"], // <type> 不能为空
    "type-case": [0],
    "scope-empty": [0],
    "scope-case": [0],
    "subject-empty": [2, "never"], // <subject> 不能为空 (默认)
    "subject-full-stop": [0, "never"],
    "subject-case": [0, "never"],
    "header-max-length": [0, "always", 72],
  },
};
