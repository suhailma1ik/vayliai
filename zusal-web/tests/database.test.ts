import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
const first = "00000000-0000-4000-8000-000000000001",
  second = "00000000-0000-4000-8000-000000000002";
test("database enforces tenant isolation, immutable grants, trial boundaries and idempotent aggregates", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      `create role anon;create role authenticated;create role service_role;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;grant usage on schema auth to authenticated;`,
    );
    await db.exec(
      await readFile(
        new URL(
          "../supabase/migrations/202610180001_core.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    await db.query("insert into auth.users(id) values($1),($2)", [
      first,
      second,
    ]);
    await db.query(
      "insert into public.devices(account_id,name,token_hash) values($1,'Test Mac','hash-one'),($2,'Other','hash-two')",
      [first, second],
    );
    const device = (
      await db.query<{ id: string }>(
        "select id from devices where account_id=$1",
        [first],
      )
    ).rows[0].id;
    const event = {
      id: "request-one",
      occurred_at: new Date().toISOString(),
      model: "model-a",
      provider: "test",
      status: "successful",
      input_tokens: 10,
      output_tokens: 5,
      estimated_cost_usd: 0.001,
    };
    await db.query("select accept_usage($1,$2,$3::jsonb)", [
      first,
      device,
      JSON.stringify(event),
    ]);
    await db.query("select accept_usage($1,$2,$3::jsonb)", [
      first,
      device,
      JSON.stringify(event),
    ]);
    let account = (
      await db.query<{ trial_kind: string; days: number }>(
        "select trial_kind,extract(epoch from (trial_ends_at-trial_started_at))/86400 as days from profiles where id=$1",
        [first],
      )
    ).rows[0];
    assert.equal(account.trial_kind, "launch");
    assert.equal(Number(account.days), 30);
    assert.equal(
      (
        await db.query<{ requests: number }>(
          "select requests from daily_usage where account_id=$1",
          [first],
        )
      ).rows[0].requests,
      1,
    );
    assert.equal(
      (
        await db.query<{ activations: number }>(
          "select activations from launch_counter",
        )
      ).rows[0].activations,
      1,
    );
    await db.exec("update launch_counter set activations=1000");
    const secondDevice = (
      await db.query<{ id: string }>(
        "select id from devices where account_id=$1",
        [second],
      )
    ).rows[0].id;
    await db.query("select accept_usage($1,$2,$3::jsonb)", [
      second,
      secondDevice,
      JSON.stringify({ ...event, id: "failed", status: "failed" }),
    ]);
    assert.equal(
      (
        await db.query<{ trial_kind: string }>(
          "select trial_kind from profiles where id=$1",
          [second],
        )
      ).rows[0].trial_kind,
      null,
    );
    await db.query("select accept_usage($1,$2,$3::jsonb)", [
      second,
      secondDevice,
      JSON.stringify({ ...event, id: "next" }),
    ]);
    account = (
      await db.query<{ trial_kind: string; days: number }>(
        "select trial_kind,extract(epoch from (trial_ends_at-trial_started_at))/86400 as days from profiles where id=$1",
        [second],
      )
    ).rows[0];
    assert.equal(account.trial_kind, "standard");
    assert.equal(Number(account.days), 14);
    await assert.rejects(
      db.query("select accept_usage($1,$2,$3::jsonb)", [
        first,
        secondDevice,
        JSON.stringify({ ...event, id: "attack" }),
      ]),
    );
    await db.exec(
      `set role authenticated;set request.jwt.claim.sub='${first}';`,
    );
    assert.equal((await db.query("select * from profiles")).rows.length, 1);
    assert.equal(
      (await db.query("select * from model_requests")).rows.length,
      1,
    );
    await db.query("update profiles set display_name='Allowed' where id=$1", [
      first,
    ]);
    await assert.rejects(
      db.query("update profiles set subscription_status='active' where id=$1", [
        first,
      ]),
    );
    await assert.rejects(db.query("select token_hash from devices"));
    await assert.rejects(db.query("select * from launch_counter"));
    await assert.rejects(
      db.query("select accept_usage($1,$2,$3::jsonb)", [
        first,
        device,
        JSON.stringify(event),
      ]),
    );
    await db.query("update devices set revoked_at=now() where id=$1", [device]);
    await db.exec("reset role;");
    await assert.rejects(
      db.query("select accept_usage($1,$2,$3::jsonb)", [
        first,
        device,
        JSON.stringify({ ...event, id: "revoked" }),
      ]),
    );
    await db.query("delete from auth.users where id=$1", [first]);
    assert.equal(
      (await db.query("select * from daily_usage where account_id=$1", [first]))
        .rows.length,
      0,
    );
  } finally {
    await db.close();
  }
});
test("pairing consumes once and paid renewal grace never resets on replay", async () => {
  const db = new PGlite();
  try {
    await db.exec(
      `create role anon;create role authenticated;create role service_role;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql stable as $$select null::uuid$$;`,
    );
    await db.exec(
      await readFile(
        new URL(
          "../supabase/migrations/202610180001_core.sql",
          import.meta.url,
        ),
        "utf8",
      ),
    );
    await db.query("insert into auth.users values($1)", [first]);
    await db.query(
      "insert into pairings(device_hash,user_code,name,expires_at,approved_by) values('pair','ABCD-EFGH','Device',now()+interval '10 minutes',$1)",
      [first],
    );
    assert.ok(
      (
        await db.query<{ consume_pair: string }>(
          "select consume_pair('pair','hash')",
        )
      ).rows[0].consume_pair,
    );
    assert.equal(
      (
        await db.query<{ consume_pair: string }>(
          "select consume_pair('pair','hash2')",
        )
      ).rows[0].consume_pair,
      null,
    );
    const at = new Date(Date.now() - 3600000).toISOString(),
      later = new Date().toISOString();
    await db.query(
      "select apply_billing($1,'evt1',$2,'sub_test','past_due',now(),false)",
      [first, at],
    );
    await db.query(
      "select apply_billing($1,'evt2',$2,'sub_test','past_due',now(),false)",
      [first, later],
    );
    const result = (
      await db.query<{ renewal_failed_at: Date }>(
        "select renewal_failed_at from profiles where id=$1",
        [first],
      )
    ).rows[0];
    assert.equal(new Date(result.renewal_failed_at).toISOString(), at);
    await db.query(
      "select apply_billing($1,'evt-old',$2,'sub_test','active',now()+interval '1 year',false)",
      [first, new Date(Date.now() - 86400000).toISOString()],
    );
    assert.equal(
      (
        await db.query<{ subscription_status: string }>(
          "select subscription_status from profiles",
        )
      ).rows[0].subscription_status,
      "past_due",
    );
  } finally {
    await db.close();
  }
});
