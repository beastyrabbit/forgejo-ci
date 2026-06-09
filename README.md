# Forgejo CI

Shared Forgejo Actions helpers for Heerlab Forgejo projects.

Secret values do not live in this repository. Shared platform secrets live in
Infisical project `Forgejo CI`, environment `prod`.

## Actions

- `actions/registry-login`: logs in to `git.heerlab.com` with the shared
  `FORGEJO_PACKAGE_TOKEN` fetched through Forgejo OIDC from Infisical.

## Renovate

`renovate.yaml` runs self-hosted Renovate for Forgejo through the personal
Forgejo Actions runner pool. The first workflow stage is manual dry-run only:

```bash
fj actions dispatch -r beasty/forgejo-ci renovate.yaml main
fj actions tasks -r beasty/forgejo-ci
```

Renovate uses the dedicated Forgejo user `renovate-bot`:

- full name: `Renovate Bot`
- email: `renovate-bot@heerlab.com`
- account policy: non-admin, restricted, no repository creation
- token name: `renovate-forgejo-ci`

The token value is stored only in Infisical:

- project: `Forgejo CI`
- project ID: `d6d9daf6-28ad-436b-8db5-ccf02ab7c4cc`
- environment: `prod`
- path: `/renovate`
- secret: `RENOVATE_TOKEN`

Do not store `RENOVATE_TOKEN` in Forgejo secrets, runner environment variables,
Kubernetes Secrets, `kub-homelab`, or this repository.

The global Renovate config lives in `config.js`. It uses `platform: "forgejo"`,
Forgejo autodiscovery, and an explicit allowlist:

- `beasty/kub-homelab`
- `beasty/paperless-llm`
- `beasty/beastypage`
- `beasty/beasty_printer_hub`
- `beasty/infinitune`
- `beasty/moddrop`
- `beasty/tussel`

`beasty/forgejo-ci` is intentionally excluded so Renovate cannot modify its own
runner/config repository. The real access boundary is the `renovate-bot`
collaborator list; grant it write access only to the allowlisted repositories.

The workflow logs into Infisical with Forgejo OIDC, fetches `RENOVATE_TOKEN`,
then runs `renovate/renovate:latest` with `RENOVATE_DRY_RUN=full`. Dry-run logs
may show onboarding PRs that would be created, but this stage must not create or
update PRs.

After a clean dry-run, enable the scheduled real run in a follow-up change. Use
a Berlin-local schedule outside DST transition hours, for example:

```yaml
on:
  schedule:
    - cron: '30 5 * * *'
      timezone: Europe/Berlin
  workflow_dispatch:
```

Keep manual dispatch available for future dry-run debugging when the scheduled
workflow is added.
