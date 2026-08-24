---
recommended_agent: open code
---

# Overview

Tanstack query natively supports optimistic updates (https://tanstack.com/query/v4/docs/framework/react/guides/optimistic-updates), and if you dig through my old commits, you'll see at a point in time I was using this approach but then switched back to tanstack db.

The main problem with tanstack db is that it forces me to disable SSR.

I'd like to test out the approach again of just using tanstack query without tanstack db, this would allow me to re-enable ssr and get I think a good performance boost.

Ensure that the tanstack router integration stays intact with the route loaders prefilling tanstack query's cache
