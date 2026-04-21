# GitHub Summaries

This folder is updated automatically by the `github-activity-summary.yml` workflow.

- Schedule: every hour
- Grouping: by day file (`YYYY-MM-DD.md`)
- Sections: hour bucket updates (for example `14:00 update`)
- Source: git commits from the selected lookback window

You can also run the workflow manually from GitHub Actions and choose:
- `lookback_hours` (default `1`)
- `timezone` (default `Europe/Istanbul`)
