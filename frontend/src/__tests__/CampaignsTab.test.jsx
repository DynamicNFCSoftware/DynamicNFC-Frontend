import { describe, it } from "vitest";

describe("CampaignsTab (CMP-Q01 stubs)", () => {
  it.todo("rename: accepts valid campaign name and persists update");
  it.todo("rename: rejects invalid campaign name (<3 chars / >80 chars)");
  it.todo("status transition: allows valid transitions (draft->active, active->paused)");
  it.todo("status transition: blocks invalid transitions (archived->active)");
  it.todo("filter/sort: combines search + status + source + sort correctly");
});
