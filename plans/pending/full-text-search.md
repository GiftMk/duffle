---
recommended_agent: open code, with a smart model
---

# Overview

Currently, we only support pg trigram based search on our note titles.
I'd like to have full text search support on the note bodies.

We should combine these results using reciprocal rank fusion, for now let's not have any weighting towards the title,
we can adjust that later.

I'm thinking we do RRF all in sql, not in memory, I'd like to see CTEs being used here for cleanliness.

Reference this guide https://orm.drizzle.team/docs/guides/postgresql-full-text-search for how to implement it.

Note we want to use search_to_tsvector in our implementation.
