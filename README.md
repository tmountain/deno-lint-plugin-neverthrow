# deno-lint-plugin-neverthrow

🚀 **A Deno Lint Plugin to enforce proper handling of `neverthrow` Result values.**  

[`https://deno.land/x/deno_lint_plugin_neverthrow`](https://deno.land/x/deno_lint_plugin_neverthrow)

This plugin ensures that `Result` values from [`neverthrow`](https://github.com/supermacro/neverthrow) are properly handled using `.match()`, `.unwrapOr()`, or `_unsafeUnwrap()`, preventing silent failures.

## 📌 Features
✅ Warns when a `Result` is **created but not handled**.  
✅ Allows valid usage like `.match()`, `.unwrapOr()`, `_unsafeUnwrap()`, etc.  
✅ Works seamlessly with `deno lint`.  
✅ Lightweight and easy to install.  

---

## 📦 Installation

To enable the plugin in your **Deno project**, add it to `deno.json`:

```json
{
  "lint": {
    "plugins": ["https://deno.land/x/deno_lint_plugin_neverthrow/mod.ts"]
  }
}
```

---

## 🚀 Usage

After installation, simply run:

```sh
deno lint
```

### **Example Code**

#### ❌ **Incorrect (Unhandled Result)**
This will trigger an error because the `Result` is unused.

```ts
import { ok } from "npm:neverthrow";

ok(42); // ❌ Error: "Result must be handled with `match`, `unwrapOr`, or `_unsafeUnwrap`."
```

#### ✅ **Correct (Handled Result)**
This is valid because the `Result` is properly used.

```ts
import { ok } from "npm:neverthrow";

const result = ok(42);
result.match(
  (value) => console.log(value), 
  (err) => console.error(err)
);
```

---

## 🔧 Configuration

By default, the rule is **enabled**. However, you can manually configure it in `deno.json`:

```json
{
  "lint": {
    "rules": {
      "include": ["must-use-result"]
    },
    "plugins": ["https://deno.land/x/deno_lint_plugin_neverthrow/mod.ts"]
  }
}
```

## 📜 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
