const mustUseResultRule: Deno.lint.LintRuleMeta = {
    code: "neverthrow-must-use",
    tags: ["recommended"],
    docs: {
        description: "Ensure neverthrow results are used correctly.",
        recommended: true,
    },
};

const rule: Deno.lint.LintRule = {
    meta: mustUseResultRule,

    create(context: Deno.lint.RuleContext) {
        return {
            ExpressionStatement(node) {
                if (node.expression.type === "CallExpression" && isUnhandledResult(node.expression)) {
                    context.report({
                        node,
                        message: "Result must be fully handled with `match`, `unwrapOr`, `_unsafeUnwrap`, or `await` for ResultAsync.",
                    });
                }
            },
        };
    },
};

// Detects if a `Result` or `ResultAsync` is used incorrectly
function isUnhandledResult(node: Deno.lint.CallExpression): boolean {
    if (node.callee.type === "Identifier") {
        const funcName = node.callee.name;
        return funcName === "ok" || funcName === "err"; // Unhandled `ok()` or `err()`
    }

    if (node.callee.type === "MemberExpression") {
        const prop = node.callee.property;
        if (prop.type === "Identifier") {
            const invalidHandlers = ["map", "mapErr", "andThen", "orElse"];
            const validHandlers = ["match", "unwrapOr", "_unsafeUnwrap"];

            if (invalidHandlers.includes(prop.name)) {
                return true; // ❌ These do NOT fully handle the Result
            }

            return !validHandlers.includes(prop.name); // ✅ Ignore if properly handled
        }
    }

    return false;
}

// Correctly structured plugin export
export default {
    name: "neverthrow-must-use",
    rules: {
        "must-use-result": rule,
    },
} as Deno.lint.LintPluginModule;

