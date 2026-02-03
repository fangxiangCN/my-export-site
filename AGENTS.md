# Repository Guidelines

## Project Structure & Module Organization
- `app/` contains Next.js App Router pages, layouts, route handlers, and shared UI (for example, `app/page.tsx`).
- `public/` holds static assets such as images and icons.
- `sanity/` contains Sanity Studio configuration, schemas, and environment helpers (see `sanity.config.ts`).
- `scripts/` includes project utility scripts (for example, content seeding).
- Root configuration lives in files like `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, and `postcss.config.mjs`.

## Build, Test, and Development Commands
- `npm run dev` starts the Next.js dev server at `http://localhost:3000`.
- `npm run build` creates a production build.
- `npm run start` runs the production server (after build).
- `npm run lint` runs ESLint (Next.js core web vitals + TypeScript rules).

## Coding Style & Naming Conventions
- TypeScript + React; follow App Router file naming (`page.tsx`, `layout.tsx`, `loading.tsx`).
- Match the local formatting in each file; most code uses 2-space indentation and consistent quote style within the file.
- Tailwind CSS is enabled via `@import "tailwindcss";` in `app/globals.css`; prefer utility classes over custom CSS where practical.
- Keep components focused and data fetching in server components unless client-only features are required.

## Testing Guidelines
- No automated test runner is configured yet.
- If adding tests, place them in `tests/` or `app/__tests__/` and add a `npm run test` script to `package.json`.

## Commit & Pull Request Guidelines
- Git history currently has only “Initial commit from Create Next App”; no formal convention yet.
- Use short, imperative commit subjects (example: “Add product grid”).
- PRs should include a concise summary, linked issue (if any), and screenshots for UI changes. Note any Sanity schema or content migrations.

## Security & Configuration Tips
- Store secrets in `.env.local`; do not commit it.
- Required Sanity env vars: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`. Optional: `NEXT_PUBLIC_SANITY_API_VERSION`.
- Scripts that write to Sanity may require `SANITY_API_TOKEN`.
