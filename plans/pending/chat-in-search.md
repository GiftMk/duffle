---
recommended_agent: claude, opus planning
---

# Overview

We recently revamped our search dialog to be larger and show a grid of cards.

If you dig back into much older git commits, you'll see that my search used to have a hybrid chat and search toggle, even though nothing actually happened when you hit the chat toggle.

I'd like to bring the chat toggle back but this time implementing it.

What I'd like to do is when the chat toggle is selected, we render a smooth chat that pretty much looks like anthropic's chat.

Textarea at the bottom that accepts user input, up arrow button to submit your prompt.
The user's prompt then appears on the right hand side in a bubble, but the LLM response is NOT in a bubble and fills up a good amount of space, (like claude)

We should have auto-scrolling there too, markdown rendering support and everything. I want it to look and feel like duffle however.

As far as the LLM goes, we'll just give it a really basic tool, the most basic, essentially just a simple tool that returns the markdown for the last 20 notes the user has most recently edited. We'll make this tool better later.

When it comes to libraries, I'd don't want us to hand roll alot of chat boiler plate if we don't have to.

We're deploying on vercel so using the vercel AI sdk is a good choice.

And using the elements component kit could be a good bet (https://elements.ai-sdk.dev/) granted we can customize it to look and feel exactly like our app.

When we do this I want the chat components to go in their own /ai components folder. For hooks, they should go in /hooks/ai.ts, and same for lib files if needed.

The output of this is a simple but smooth, streaming chat app.

You'd need to confirm that the vercel AI sdk can work nicely with tanstack start, if not we may need to explore the tanstack AI sdk, in which we'd need to confirm that it works nicely when deploying to vercel.

We don't need to worry about users being restricted with their chat access.

As for the model, assume we're using OpenAI and I'll provide a valid key in the .env.

For the model personality, it should follow the fun playful vibe of duffle, but most importantly it should strictly adhere to and be given the instructions in the unslop skill (https://github.com/cursor/plugins/blob/main/pstack/skills/unslop/SKILL.md) to make it's responses not insufferable.

And the model should be prompted to reference the source material as much as possible and mention the document that it got things from. Note we'll add proper citations later.
