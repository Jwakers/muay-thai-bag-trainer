# Agent / contributor notes

## Styling: Tailwind CSS v4

This project uses **Tailwind v4** (`tailwindcss` + `@tailwindcss/vite`). Global theme and tokens live in `src/index.css` via `@import "tailwindcss"` and an `@theme { ... }` block.

When editing UI:

1. Prefer **named utilities** from the default scale (`text-lg`, `mt-11`, `border-l-8`, `gap-6`, `text-8xl`, …) instead of arbitrary `mt-[…rem]` / `text-[…rem]` unless the value is truly one-off.
2. For layout rhythm that matches this app’s design tokens, use **semantic spacing** from `@theme`: `*-standard` (1.4rem) and `*-power` (2.75rem), e.g. `gap-standard`, `mb-power`, `px-standard`.
3. Reserve **arbitrary bracket classes** for values that are not on the scale (e.g. complex glow shadows, `max-h-[40vh]`, precise letter-spacing).
4. Use valid font-size utilities only — e.g. `text-8xl`, not `text-8` (the latter is not a standard step).

Cursor-specific detail: see `.cursor/rules/tailwind-v4.mdc` for the same guidance in rule form.
