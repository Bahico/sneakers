# Styling Rules - Tailwind CSS Only

This project enforces the use of **Tailwind CSS** for all HTML styling. Inline styles and custom CSS classes should be avoided.

## Rules

### ✅ Allowed
- Tailwind CSS utility classes (e.g., `class="flex items-center justify-center"`)
- Conditional Tailwind classes using `[ngClass]` or `[class.xxx]`
- Component-specific CSS classes (only when absolutely necessary and documented)

### ❌ Not Allowed
- Inline `style` attributes: `style="color: red;"`
- Angular style bindings: `[style.color]="'red'"` or `[style.--custom-property]="value"`
- Static style attributes: `style="display: flex;"`

## Examples

### ❌ Bad - Inline Styles
```html
<div style="display: flex; align-items: center;">
  <img style="mix-blend-mode: multiply;" src="image.jpg">
</div>
```

### ✅ Good - Tailwind Classes
```html
<div class="flex items-center">
  <img class="mix-blend-multiply" src="image.jpg">
</div>
```

### ❌ Bad - Style Bindings
```html
<div [style.cursor]="zooming() ? 'zoom-out' : 'zoom-in'">
  <img [style.mix-blend-mode]="'multiply'">
</div>
```

### ✅ Good - Conditional Classes
```html
<div [ngClass]="{
  'cursor-zoom-out': zooming(),
  'cursor-zoom-in': !zooming()
}">
  <img class="mix-blend-multiply">
</div>
```

## Common Tailwind Alternatives

| Inline Style | Tailwind Class |
|-------------|----------------|
| `style="display: flex;"` | `class="flex"` |
| `style="align-items: center;"` | `class="items-center"` |
| `style="justify-content: center;"` | `class="justify-center"` |
| `style="color: red;"` | `class="text-red-500"` |
| `style="background-color: blue;"` | `class="bg-blue-500"` |
| `style="padding: 1rem;"` | `class="p-4"` |
| `style="margin: 0.5rem;"` | `class="m-2"` |
| `style="mix-blend-mode: multiply;"` | `class="mix-blend-multiply"` |
| `style="cursor: pointer;"` | `class="cursor-pointer"` |
| `style="opacity: 0.5;"` | `class="opacity-50"` |

## Enforcement

### Automated Checking
Run the linting script to check for violations:
```bash
npm run lint:tailwind
```

This will scan all HTML templates in the `src` directory and report any inline styles found.

### Pre-commit Hook (Recommended)
Add this to your `.git/hooks/pre-commit` to automatically check before commits:
```bash
#!/bin/sh
npm run lint:tailwind
```

## Special Cases

### Dynamic Styles
For truly dynamic styles that cannot be achieved with Tailwind (e.g., CSS custom properties for dynamic values), you may use style bindings, but they must be:
1. Documented with a comment explaining why Tailwind cannot be used
2. Approved by the team lead
3. Kept to an absolute minimum

Example:
```html
<!-- Using style binding for dynamic CSS variable value that changes at runtime -->
<div [style.--dynamic-height.px]="calculatedHeight()">
```

### Third-party Components
Third-party components (e.g., Taiga UI) may use inline styles internally. This is acceptable as long as your application code does not add inline styles.

## Migration Guide

When migrating existing inline styles to Tailwind:

1. Identify the CSS property in the inline style
2. Find the equivalent Tailwind utility class
3. Replace the inline style with the Tailwind class
4. Test to ensure the visual result is the same
5. Remove any unused custom CSS classes from component stylesheets

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tailwind CSS Utilities](https://tailwindcss.com/docs/utility-first)
- [Angular Class Binding](https://angular.dev/guide/templates/class-binding)

