import assert from "node:assert/strict";
import test from "node:test";
import { getLocalDateKey } from "../app/core/date";

test("getLocalDateKey defaults to midnight reset correctly", () => {
  // 2026-09-23 01:30 at midnight reset belongs to 2026-09-23
  const dateAt1AM = new Date(2026, 8, 23, 1, 30);
  assert.equal(getLocalDateKey(dateAt1AM, "00:00"), "2026-09-23");

  const dateAt11PM = new Date(2026, 8, 23, 23, 30);
  assert.equal(getLocalDateKey(dateAt11PM, "00:00"), "2026-09-23");
});

test("getLocalDateKey respects custom reset time (e.g. 04:00)", () => {
  // Before 04:00 AM on Sept 23 belongs to Sept 22
  const beforeReset = new Date(2026, 8, 23, 2, 45);
  assert.equal(getLocalDateKey(beforeReset, "04:00"), "2026-09-22");

  const justBeforeReset = new Date(2026, 8, 23, 3, 59);
  assert.equal(getLocalDateKey(justBeforeReset, "04:00"), "2026-09-22");

  // Exactly at 04:00 AM or after belongs to Sept 23
  const atReset = new Date(2026, 8, 23, 4, 0);
  assert.equal(getLocalDateKey(atReset, "04:00"), "2026-09-23");

  const afternoon = new Date(2026, 8, 23, 14, 15);
  assert.equal(getLocalDateKey(afternoon, "04:00"), "2026-09-23");
});

