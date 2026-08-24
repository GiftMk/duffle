---
recommended_agent: open code with a smart model
---

# Overview

The slash commands menu needs some love, currently they are a whole host of bugs which is why I've just un-commented it for now. But the bugs include:

1. ~~On first page load the slash menu appears and then hides breifly~~ Done. The menu rendered visible until the provider's first debounced (200ms) update hid it. The provider now owns an imperatively created container that starts with `data-show='false'` and a 20ms debounce, matching crepe.
2. ~~The slash menu doesn't appear in the right position when the page is resized~~ Done. The provider only re-computes position on editor updates (and bails when doc/selection are unchanged). A window resize listener + ResizeObserver on the editor now force an update without a prevState, bypassing that bail-out.
3. ~~When an option is selected, it's kind of broken~~ Done. Keys were forwarded in a bubble-phase `document` listener, so prosemirror handled Enter first and split the block before the command ran. Keys are now forwarded in the capture phase (like crepe), which prosemirror ignores because `event.defaultPrevented` is already set.
   For the last one in particular (3) if I were to trigger the slash commands by enter the following

```md
/hea
```

To start triggering the slash commands and to filter down to the heading options, I'd expect the following output when I select the heading one option

```md
#
```

Just a heading preselected with whitespace for me to keep typing.
In reality I get

```md
/

#
```

Notice how the heading drops onto the second line and the slash is still visible!
We need this fixed.

Note that this slash commands implementation is based on Milkdown editor's own implementation for their out the box crepe editor (https://github.com/Milkdown/milkdown/blob/main/packages/crepe/src/feature/block-edit/menu/config.ts), only adapted for react.

I don't use the crepe editor because styling it to match what I want is a bit challenging. But Milkdown's implementation works really well, so, what I'd want is for us to diagnose what's working so well with their implementation and use those findings to correct each of the bugs I listed plus any more that could be lurking. And no we don't need to implement groups in our menu just yet. And yes, I do want to use a base UI autocomplete for this.
