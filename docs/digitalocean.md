# DigitalOcean demo deployment

The [App Platform specification](../.do/app.yaml) builds the existing API and web Dockerfiles from the public `snowsadh/dots` repository. It uses one API instance, one web instance, and a PostgreSQL development database in Singapore. The public Git source does not require installing a GitHub app on Snow's account; deployments are started explicitly after pushing changes.

The selected sizes cost approximately **$22/month** before model usage and excess bandwidth: $10 API, $5 web, and $7 development database. Verify the current [App Platform prices](https://docs.digitalocean.com/products/app-platform/details/pricing/) before creating resources. These are paid resources; stopping use does not delete them.

## Frontend-only alternative

[`.do/frontend.yaml`](../.do/frontend.yaml) deploys just the $5/month web service and uses the existing Cloud Run API. Set a unique encrypted `AUTH_SECRET` in a private copy before creating the app. The API origin is a build-time value; changing it requires rebuilding the web image. A frontend deployment does not change the model or credentials running on GCP.

The frontend-only option requires a healthy Cloud Run API with active project billing, a reachable database, and working model credentials. Resolve backend health failures before treating it as a working map-generation deployment. Existing GCP charges are separate from DigitalOcean credit. DigitalOcean also requires an enabled billing account before it accepts resource creation.

## Credentials and deployment sequence

1. Install `doctl` with `brew install doctl` and authenticate with `doctl auth login --context dots`. Check the account with `doctl --context dots account get`.
2. Push the tested code to `main`. Validate the template with `doctl apps spec validate .do/app.yaml --schema-only`.
3. Create a private copy of the specification outside Git. Fill the API's encrypted `MODEL_API_KEY` from the local API environment and generate a unique encrypted web `AUTH_SECRET`. Never commit a filled specification or print its contents in logs. Keep model credentials in API runtime variables only. DigitalOcean supplies `DATABASE_URL`; migrations run in the API container's existing start command.
4. First create the app with just the `api` service, `db`, and the `/backend` ingress rule. Obtain the app's `default_ingress`, then set the web's `NEXT_PUBLIC_API_URL` to that HTTPS origin plus `/backend` and update the app with the complete private specification. Do not deploy the template's `.invalid` placeholder as the final frontend configuration. Dockerfile builds cannot resolve DigitalOcean's dynamic URL bindings at build time, while Next.js needs this value when building its browser bundle.
5. Wait for a successful deployment, check `/backend/` for API health, upload a permitted plan, and verify that the UI reaches parsing, review, tactile conversion, and STL download. The loading screen asks judges to allow 10–15 minutes for parsing and review; that is an estimate rather than a completion guarantee.

Example CLI actions, using private specifications already prepared with the correct values:

```bash
doctl --context dots apps create --spec /private/path/dots-api.json
doctl --context dots apps get APP_ID
doctl --context dots apps update APP_ID --spec /private/path/dots-full.json
doctl --context dots apps list-deployments APP_ID
doctl --context dots apps logs APP_ID api --type run
```

The `/backend` prefix is stripped before requests reach Hono. It is separate from the web app's `/api/auth` routes. Google sign-in is optional and requires its own credentials and a callback registered for the final app domain.

## Demo limits

Run exactly one API instance. Parse and tactile jobs run inside that process; a restart interrupts them, and startup marks those jobs as failed so they can be retried. Avoid deployments during a judge's map-generation run. Do not enable scale to zero for this background-work demo.

App Platform containers have [ephemeral storage and no persistent volumes](https://docs.digitalocean.com/products/app-platform/details/limits/). PostgreSQL preserves project rows, but uploaded images and STL files disappear when the API container is replaced. Object storage is required for durable uploaded projects. Use permitted, non-sensitive demo inputs: project IDs are public access links, and Google sign-in does not enforce API ownership.

Before deleting the app to stop charges, save any needed database records and generated files. A development database is a demo resource, not a production backup plan.
