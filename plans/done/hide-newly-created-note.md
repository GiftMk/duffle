---
recommended_agent: open code
---

# Overview

Currently, in the /notes route, when we hit the plus button an instant update occurs to the note collection to add a new note.

This causes the note to appear in the notes list breifly as the async navigation triggers.

I want the newly created note to not appear in the notes list, instead we should exclude it from the notes list and just navigate.

## Rough Plan

I was thinking... `useCreateNote` should take in an id from the caller, and the callsite now passes in a `uuidv7`. With this pattern in place, it should allow the call site to generate the new note ID up-front and then exclude it from it's notes list.

We just need to remember to regenerate the new id once we've used it.

This should be simple enough, but I want this pattern of call site provided ids everywhere we create a new note. So let's add it to to the `useCreateAndOpenNote` hook.

Actually, it would be nice if the `useCreateNote` hook had the support to navigate to the new note instead of having to maintain two hooks.

So I'm thinking that we:

1. Drop the create and open hook
2. The useCreateNote hook returns two functions in an object { create, open }
3. Callers can call create and optionally call open
4. If it's cleaner, we can have callsites consume it like so

```ts
const newNote = useNewNote();
const onClick = () => {
  newNote.create();
  newNote.open();
};
```

Don't spend endless time trying to do playwright verification, just let me know when you're done and I'll test if it's working.

If they're any obvious flaws in my plan for why this won't work point them out early, but I think we should be fine.
