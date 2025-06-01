import { App } from "@octokit/app";
import { Octokit } from "@octokit/core";
import { paginateRest } from "@octokit/plugin-paginate-rest";
import { restEndpointMethods } from "@octokit/plugin-rest-endpoint-methods";
import { retry } from "@octokit/plugin-retry";

export const octokitFromCore = new Octokit()

const fromCore = octokitFromCore.graphql({
  query: `query($owner: String!, $repo: String!, $number: Int!) {
      repository(owner: $owner, name: $repo) {
        pullRequest(number: $number) {
          closingIssuesReferences(first: 50) {
            nodes {
              number
              title
              url
            }
          }
        }
      }
    }`,
  owner: "",
  repo: "",
  number: "",
});


export const app = new App({
  appId: "",
  privateKey: "",
  webhooks: {
    secret: "",
  },
  Octokit: Octokit.plugin(restEndpointMethods, paginateRest, retry),
});

app.webhooks.on("pull_request.opened", async ({ payload, octokit }) => {
  const fromWebhookCallback = await octokit.graphql({
    query: `query($owner: String!, $repo: String!, $number: Int!) {
      repository(owner: $owner, name: $repo) {
        pullRequest(number: $number) {
          closingIssuesReferences(first: 50) {
            nodes {
              number
              title
              url
            }
          }
        }
      }
    }`,
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    number: payload.pull_request.number,
  });
});
export default {
  async fetch(request): Promise<Response> {
    await app.webhooks.verifyAndReceive({
      id: request.headers.get("x-github-delivery") || "",
      name: request.headers.get("x-github-event") || "",
      signature: request.headers.get("x-hub-signature-256") || "",
      payload: await request.text(),
    });
    return new Response(`{ "ok": true }`, {
      headers: { "content-type": "application/json" },
    });
  },
} satisfies ExportedHandler<Env>;
