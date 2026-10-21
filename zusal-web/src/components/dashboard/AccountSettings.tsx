import { useState, type SubmitEvent } from "react";
import { Monitor } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import type { Account, Device } from "../../lib/contracts";
import { supabase, invoke } from "../../lib/supabase";
export default function AccountSettings({
  user,
  account,
  devices,
  demo,
  refresh,
}: {
  user: User | null;
  account: Account | null;
  devices: Device[];
  demo: boolean;
  refresh: () => void;
}) {
  const [name, setName] = useState(account?.display_name ?? ""),
    [password, setPassword] = useState(""),
    [confirmation, setConfirmation] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function run(action: () => Promise<void>) {
    if (demo) {
      setMessage("Demo only. Your real account has not changed.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      await action();
      refresh();
      setMessage("Changes saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Unable to save changes.");
    } finally {
      setBusy(false);
    }
  }
  const hasPassword = user?.identities?.some((i) => i.provider === "email");
  return (
    <div className="settings-sections">
      <section>
        <span className="eyebrow">PROFILE</span>
        <h2>A familiar name.</h2>
        <form
          onSubmit={(e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault();
            run(async () => {
              const { error } = await supabase!
                .from("profiles")
                .update({ display_name: name.trim().slice(0, 80) })
                .eq("id", user!.id);
              if (error) throw error;
            });
          }}
        >
          <label>
            Display name
            <input
              value={name}
              maxLength={80}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Email
            <input
              readOnly
              value={demo ? "alex@example.test" : (user?.email ?? "")}
            />
          </label>
          <p>
            Sign-in methods:{" "}
            {demo
              ? "Google · illustrative"
              : user?.identities?.map((i) => i.provider).join(", ") ||
                "Unavailable"}
            . Account linking is handled through verified identity flows.
          </p>
          <button className="button" disabled={busy}>
            Save profile
          </button>
        </form>
      </section>
      {(hasPassword || demo) && (
        <section>
          <span className="eyebrow">PASSWORD</span>
          <h2>Keep your access yours.</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                const { error } = await supabase!.auth.updateUser({ password });
                if (error) throw error;
                setPassword("");
              });
            }}
          >
            <label>
              New password
              <input
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button className="button" disabled={busy}>
              Change password
            </button>
          </form>
        </section>
      )}
      <section>
        <span className="eyebrow">CONNECTED DEVICES</span>
        <h2>Your workspaces, connected.</h2>
        <p>
          Revoke an individual CLI device without changing your provider
          accounts.
        </p>
        {devices
          .filter((d) => !d.revoked_at)
          .map((d) => (
            <div className="device-row" key={d.id}>
              <Monitor size={20} />
              <div>
                <strong>{d.name}</strong>
                <small>
                  Last seen{" "}
                  {d.last_seen_at
                    ? new Date(d.last_seen_at).toLocaleString()
                    : "not yet"}
                </small>
              </div>
              <button
                className="button compact"
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    const { error } = await supabase!
                      .from("devices")
                      .update({ revoked_at: new Date().toISOString() })
                      .eq("id", d.id);
                    if (error) throw error;
                  })
                }
              >
                Revoke
              </button>
            </div>
          ))}
        {!devices.some((d) => !d.revoked_at) && (
          <p>
            No connected devices. Start with <code>zusal login</code> in a
            compatible release.
          </p>
        )}
      </section>
      <section className="danger-section">
        <span className="eyebrow">DELETE ACCOUNT</span>
        <h2>Close this route.</h2>
        <p>
          Deletion immediately ends access, cancels future renewals, revokes
          devices, and removes profile and usage records. Some billing records
          may be retained separately. This action does not automatically refund
          a paid period.
        </p>
        <p>
          Sign in again immediately before deleting. Type{" "}
          <strong>DELETE</strong> to confirm.
        </p>
        <label>
          Deletion confirmation
          <input
            value={confirmation}
            autoComplete="off"
            onChange={(e) => setConfirmation(e.target.value)}
          />
        </label>
        <button
          className="button danger"
          disabled={confirmation !== "DELETE" || busy}
          onClick={() =>
            run(async () => {
              await invoke("delete-account", { confirmation });
              await supabase!.auth.signOut();
              location.assign("/");
            })
          }
        >
          Delete account permanently
        </button>
      </section>
      {message && (
        <p className="form-message" role="status">
          {message}
        </p>
      )}
    </div>
  );
}
