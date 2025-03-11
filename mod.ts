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
            CallExpression(node) {
                if (isResultCall(node) && isStandalone(node)) {
                    context.report({
                        node,
                        message: "Result must be handled with `match`, `unwrapOr`, or `_unsafeUnwrap`.",
                    });
                }
            },
        };
    },
};

// Detects `Result` methods (map, match, unwrapOr, etc.)
function isResultCall(node: Deno.lint.CallExpression): boolean {
    if (node.callee.type === "MemberExpression") {
        const prop = node.callee.property;
        if (prop.type === "Identifier") {
            return ["mapErr", "map", "andThen", "orElse", "match", "unwrapOr", "_unsafeUnwrap"]
                .includes(prop.name);
        }
    }
    return false;
}

// Checks if the result is not assigned or used in an expression
function isStandalone(node: Deno.lint.CallExpression): boolean {
    const parent = node.parent;
    return !parent || parent.type === "ExpressionStatement";
}

// Correctly structured plugin export
export default {
    name: "neverthrow-must-use",
    rules: {
        "must-use-result": rule,
    },
} as Deno.lint.LintPluginModule;
