# Duffle ᕙ( •̀ ᗜ •́ )ᕗ

A super-simple WYSIWYG markdown editor for your brain dumps.
It's like Typora & Bear but for the web.
You don't organize files and folders, you simply write and search when needed.

![Duffle screenshot](duffle-screenshot.png)

There's absolutely no login required ( ˶°ㅁ°) !!

We have a cool feature where you can generate an import code to load your notes onto another device.
Lazy-man's cross-device sync!

We support GitHub flavoured markdown in what I baisedly think is quite a tasty editing experience.

Enjoy!

## Local Development

Duffle is a monorepo with two TanStack Start apps sharing a set of workspace packages:

```
apps/
  board/          boards.duffle.dev — pnpm --filter @duffle/board dev (port 3002)
  book/           notes.duffle.dev  — pnpm --filter @duffle/book dev (port 3001)
packages/
  ui/             shared components, tailwind theme, fonts
  db/             drizzle schemas/connection, shared better-auth server factory
  markdown/       the markdown editor and its prosemirror extensions
  utils/          small cross-app helpers
```

Each app needs its own `.env` (see `apps/board/.env`/`apps/book/.env`) with:

```
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

`DATABASE_URL`, `BETTER_AUTH_SECRET`, and the GitHub credentials should be the same across both apps' `.env` files — they share one database and one auth setup. `BETTER_AUTH_URL` is app-specific (each app's own local URL, e.g. `http://localhost:3002` for board).

We use pnpm on Node.js, make sure you have those installed. Run `pnpm i` and then `pnpm dev` to run both apps together, or `pnpm dev:board` / `pnpm dev:book` to run just one.
