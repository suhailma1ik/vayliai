import { useEffect, useState } from "react";
import { Monitor } from "lucide-react";
import { invoke } from "../../lib/supabase";
export default function PairApproval({ demo }: { demo: boolean }) {
  const [device, setDevice] = useState<{
    name: string;
    expires_at: string;
  } | null>(null);
  const [code, setCode] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(
    () => setCode(new URLSearchParams(location.search).get("user_code") ?? ""),
    [],
  );
  return (
    <section className="pair-panel">
      <Monitor size={32} />
      <h2>A new workspace is asking to connect.</h2>
      <p>
        Only approve a code shown in a CLI login you started. Approval links
        this device to your account; it does not start the trial.
      </p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (demo) {
            setMessage("Demo only. No device connected.");
            return;
          }
          setBusy(true);
          try {
            if (!device) {
              setDevice(
                await invoke("pair-approve", {
                  action: "inspect",
                  user_code: code,
                }),
              );
              return;
            }
            const result = await invoke("pair-approve", { user_code: code });
            setMessage(
              result.message ?? "Device approved. Return to your CLI.",
            );
          } catch (error) {
            setMessage(
              error instanceof Error ? error.message : "Unable to approve.",
            );
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          Device code
          <input
            value={code}
            onChange={(e) => (
              setCode(e.target.value.toUpperCase()),
              setDevice(null)
            )}
            maxLength={12}
            autoComplete="off"
            required
            placeholder="ABCD-EFGH"
          />
        </label>
        {device && (
          <div className="notice">
            <strong>Connect {device.name}?</strong>
            <p>
              Code expires {new Date(device.expires_at).toLocaleTimeString()}.
              Confirm that this is the device requesting access.
            </p>
          </div>
        )}
        <button className="button primary" disabled={busy}>
          {busy ? "Working…" : device ? "Approve device ↗" : "Review code ↗"}
        </button>
      </form>
      {message && <p role="status">{message}</p>}
    </section>
  );
}
