---
recommended_agent: claude, using opus plan
---

# Overview

Currently when a user is not signed in, we take them to the login screen where they are prompted to login.
The user can't do anything with the app until they are logged in.

I want to change this, better auth natively supports anonymous users signing in.
I want you to study these docs (https://better-auth.com/docs/plugins/anonymous) and then come up with a good approach to do the following:

1. Support anonymous users, they should be able to do anything an authenticated user can do
2. When the user logs in via github their account is linked
3. When the user logs in via github, we upsert their notes from their account onto their logged in account, better auth docs say the link account option automatically deletes the anonymous user, so with foreign key constraints it should be fine to assume the notes will be deleted, but for hygeine we should delete the notes from the anonymous user account anyways
