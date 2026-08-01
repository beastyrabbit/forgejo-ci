const allowedRepositories = [
  "beasty/kub-homelab",
  "beasty/paperless-llm",
  "beasty/beastypage",
  "beasty/beasty_printer_hub",
  "beasty/infinitune",
  "beasty/inbox-walk",
  "beasty/moddrop",
  "beasty/tussel",
];

module.exports = {
  platform: "forgejo",
  endpoint: "https://git.heerlab.com/api/v1/",
  autodiscover: true,
  autodiscoverFilter: allowedRepositories,
  onboarding: true,
  requireConfig: "required",
  onboardingConfig: {
    $schema: "https://docs.renovatebot.com/renovate-schema.json",
    extends: ["config:recommended"],
  },
  commitHourlyLimit: 0,
  prHourlyLimit: 0,
  prConcurrentLimit: 0,
  gitAuthor: "Renovate Bot <renovate-bot@heerlab.com>",
};
