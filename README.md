# Duffle ᕙ( •̀ ᗜ •́ )ᕗ

A super-simple WYSIWYG markdown editor for your brain dumps.
It's like Typora & Bear but for the web.
You don't organize files and folders, you simply write and search when needed.

There's absolutely no login required ( ˶°ㅁ°) !!

We have a cool feature where you can generate an import code to load your notes onto another device.
Lazy-man's cross-device sync!

We support GitHub flavoured markdown in what I baisedly think is quite a tasty editing experience.

Enjoy!

## Local Development

For environment variables, if you want to use the import/export feature create a public blob storage in Vercel and paste the creds in a .env like so:

```
BLOB_STORE_ID=store_****
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_****
```

We use bun, make sure you have that installed.
Run `bun i` and then `bun dev` to get going.
