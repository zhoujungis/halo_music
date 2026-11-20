import test from "node:test";
import assert from "node:assert/strict";
import { onRequestGet } from "../functions/api/announcement.js";

function dbReturning(row) {
  return {
    prepare() {
      const statement = {
        bind() { return statement; },
        async first() { return row; },
      };
      return statement;
    },
  };
}

test("empty announcement stays hidden", async () => {
  const response = await onRequestGet({ env: { DB: dbReturning({ content: "   ", updated_at: 1 }) } });
  assert.deepEqual(await response.json(), { announcement: null });
});

test("announcement content is returned for the bar", async () => {
  const response = await onRequestGet({ env: { DB: dbReturning({ content: " 今晚维护 ", updated_at: 123 }) } });
  assert.deepEqual(await response.json(), { announcement: { content: "今晚维护", updatedAt: 123 } });
});

test("missing table degrades to no announcement", async () => {
  const db = {
    prepare() {
      const statement = {
        bind() { return statement; },
        async first() { throw new Error("no such table: announcements"); },
      };
      return statement;
    },
  };
  const response = await onRequestGet({ env: { DB: db } });
  assert.deepEqual(await response.json(), { announcement: null });
});
