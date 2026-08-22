# Duffle ᕙ( •̀ ᗜ •́ )ᕗ

A super-simple WYSIWYG markdown editor for your brain dumps.
It's like Typora & Bear but for the web.
You don't organize files and folders, you simply write and search when needed.

![Duffle screenshot](duffle-screenshot.png)

Sign in with GitHub, and write. We support GitHub flavoured markdown in what I
baisedly think is quite a tasty editing experience.

Enjoy!

## Local Development

Duffle is a single TanStack Start app:

```
src/
  components/   editor + shared UI components (sidebar, buttons, dialogs)
  hooks/        client-side hooks
  lib/          utils, auth client, search, collections
  prosemirror/  the markdown editor's prosemirror extensions
  db/           drizzle schemas and connection
  routes/       file-based routes
  server/       server functions and middleware
```

You'll need a `.env` with:

```
DATABASE_URL=      # optional locally — dev falls through to an in-memory PGlite DB
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

Run `pnpm i` and then `pnpm dev` to start the app on `localhost:3001`.
