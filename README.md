# Forgejo CI

Shared Forgejo Actions helpers for Heerlab Forgejo projects.

Secret values do not live in this repository. Shared platform secrets live in
Infisical project `Forgejo CI`, environment `prod`.

## Actions

- `actions/registry-login`: logs in to `git.heerlab.com` with the shared
  `FORGEJO_PACKAGE_TOKEN` fetched through Forgejo OIDC from Infisical.

## Renovate

`renovate.yaml` runs self-hosted Renovate for Forgejo through the personal
Forgejo Actions runner pool. It runs daily at `05:30 Europe/Berlin`. Manual
dispatch defaults to dry-run mode:

```bash
fj actions dispatch -r beasty/forgejo-ci -I dry_run=true renovate.yaml main
fj actions tasks -r beasty/forgejo-ci
```

To run Renovate for real from a manual dispatch:

```bash
fj actions dispatch -r beasty/forgejo-ci -I dry_run=false renovate.yaml main
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
- optional GitHub.com lookup token: `RENOVATE_GITHUB_COM_TOKEN`

Do not store `RENOVATE_TOKEN` in Forgejo secrets, runner environment variables,
Kubernetes Secrets, `kub-homelab`, or this repository.

The global Renovate config lives in `config.js`. It uses `platform: "forgejo"`,
Forgejo autodiscovery, and an explicit allowlist:

- `beasty/kub-homelab`
- `beasty/paperless-llm`
- `beasty/beastypage`
- `beasty/beasty_printer_hub`
- `beasty/infinitune`
- `beasty/inbox-walk`
- `beasty/moddrop`
- `beasty/tussel`

`beasty/forgejo-ci` is intentionally excluded so Renovate cannot modify its own
runner/config repository. The real access boundary is the `renovate-bot`
collaborator list; grant it write access only to the allowlisted repositories.

Hourly and concurrent Renovate PR limits are disabled in the global runner
config so Forgejo can open the same backlog style as the previous GitHub setup.

The workflow logs into Infisical with Forgejo OIDC, fetches `RENOVATE_TOKEN`,
optionally fetches `RENOVATE_GITHUB_COM_TOKEN`, then runs
`renovate/renovate:latest`. Scheduled runs are real runs. Manual dispatches are
dry-runs unless `dry_run=false` is supplied. Dry-run logs may show onboarding
PRs or dependency branches that would be created, but dry-run mode must not
create or update PRs.
