# Monorepo Migration Plan

## Background

Currently Duffle is a hybrid kanban and note taking app. On the homepage, at `routes/index.tsx` users can navigate to either "app", in which the sidebar context will be loaded.

<br />

The sidebar will then dynamically "show & hide" icons to mimic being scoped to that app.

Also our search will scope its queries to the entities belonging to the current sidebar context.

<br />

This isn't very clean, nor scalable. And was more of a restriction of how we we're deploying the app - I was deploying to Vercel using their default domains, so subdomains weren't possible for me.

## The Task

However, I've recently bought the domain `duffle.dev` and now I can freely use subdomains.

<br />

What I want now is to have two separate frontends, the kanban app deployed to `boards.duffle.dev` and the notes app to `notes.duffle.dev`.

<br />

What this calls for is a restructure of our monorepo.

<br />

Currently we just have a single package `packages/www` which hosts our tanstack start application. In here lives the database connection config, api server functions and all the client side code.

<br />

I want to have the following structure:

- `apps/`

  - `kanban`
  - `notes`

- `packages`

  - `ui`
  - `db`
  - `markdown`

With this structure, this is what we're aiming for.

The common UI components that are generic across both apps should be in the `ui` package - you can think of this as all of the components excluding `components/kanban`, `components/notes` & `components/markdown` . Also our shared tailwind styles, and font definitions should live here. Apps should import them into their root `index.css` files using standard css import syntax.

<br />

This is the generic stuff like buttons, sidebars etc that are needed across both apps.

<br />

The `db` package will contain our database connection logic, so our pg lite and production database instances, our tables and our schemas. I'm not going to split the databases across both apps. I still want it when users are logged into one app, they should be logged in on the other. As for migrations, we can run a drizzle kit generate and see if it can migrate tables from the default schemas to their own. If not then it's alright, if it's not needing some crazy code then we can have our own migration script otherwise I'm more than happy to just drop tables on prod, I have no customers right now. One thing to note with authentication is that the better auth client creation function does expect tables to be named in certain ways and to have a certain structure. It will be worth checking their docs to see if they support having their auth tables in a schema. And also we must maintain the snake cased column names across all tables!

<br />

Also it's too much overhead to maintain two dbs right now. So instead I want to leverage Postgres schemas to have isolation. I want to have a `kanban` schema, a `notes` schema and an `auth` schema.

<br />

Our `markdown` package is special. In our current single package we have both editor components but also a rich collection of prosemirror extensions to make our markdown editor a nice experience. I think this component is large enough to be its own package.

<br />

Now as for the apps, we should have two tanstack start apps that behave and look identical except for the sidebar showing different icons and such. Pretty much the same isolation we have now with our `SidebarContext` but now no longer needing if statements everywhere.

<br />

If you were to look back in our git history, there was a time when the landing page, the one that says "Duffle." in large text with a typewriter effect underneath just had a single arrow button that took you into the app. Now that we're splitting the apps, I want that back, exactly as it was in place of the kanban and notes buttons we have going on now. And with that, I no longer need that Excalifont on the landing page.

<br />

I didn't include it in the package layout proposal, but any shared functions needed across both apps we can put in a `packages/utils`. My preference would be for small things, just duplicate them but if there's real benefit in having it shared then we can create a utils package too.

<br />

All packages must start with `@duffle/{package name}` in their package.json files.

We should use standard workspace syntax to reference packages. Also all ts configs must maintain the same strictness levels, i.e. strict true, no uncheckedindexedaccess etc.

<br />

Overall I want us to cleanly handle peer dependencies, for example I can see:

- UI package having a peer dep on the latest version of react
- the markdown package just directly imports all of the codemirror and milkdown package it needs and then apps are consumers of the package

## What I'll do after the fact

Once this is in, I'll handle setting up the deployments in Vercel for each new app. I'll also handle changing our GitHub callback URLs for authentication.

## What you'll do after the fact

Make sure that our GitHub workflow which runs our db migration script against prod is updated to be checking against the right files.

<br />

Make sure my environment variables that I have setup in the `www` package are copied and split across properly.

<br />

Make sure that the app can actually start up.

<br />

## How You'll Work

You'll work by breaking this up into a multi-step plan and executing tasks one by one. When unsure don't make assumptions, instead ask me and I'll guide you. Keep the `www` package until everything is complete.
