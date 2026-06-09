# Forgejo CI

Shared Forgejo Actions helpers for Heerlab Forgejo projects.

Secret values do not live in this repository. Shared platform secrets live in
Infisical project `Forgejo CI`, environment `prod`.

## Actions

- `actions/registry-login`: logs in to `git.heerlab.com` with the shared
  `FORGEJO_PACKAGE_TOKEN` fetched through Forgejo OIDC from Infisical.

