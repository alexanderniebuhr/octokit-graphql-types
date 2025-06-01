# octokit-graphql-types

As you can see in `src/index.ts` the variables are not typed correctly, hower as you can see all are typed as as `unknown`.
This looks off to me, and I really need to use the `octokit` instance available in the webhook callback, to get it authenticated.
