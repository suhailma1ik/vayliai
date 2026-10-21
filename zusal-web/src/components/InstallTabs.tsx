import { useState } from "react";
export default function InstallTabs() {
  const [os, setOs] = useState("macOS");
  const [harness, setHarness] = useState("Pi");
  const [copied, setCopied] = useState(false);
  const release = import.meta.env.PUBLIC_RELEASE_URL;
  const command = os === "Windows" ? "npm.cmd install" : "npm install";
  return (
    <div>
      <div className="page-tabs" role="group" aria-label="Operating system">
        {["macOS", "Windows", "Linux"].map((item) => (
          <button
            key={item}
            aria-pressed={os === item}
            onClick={() => setOs(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="page-tabs" role="group" aria-label="Agent harness">
        {["Pi", "DeepSeek Harness"].map((item) => (
          <button
            key={item}
            aria-pressed={harness === item}
            onClick={() => setHarness(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <section className="install-panel" aria-live="polite">
        <span className="eyebrow">
          {os} / {harness}
        </span>
        <h2>
          {harness === "Pi"
            ? "Start with the Pi prototype."
            : "A second path is in progress."}
        </h2>
        {harness === "Pi" ? (
          <>
            <p>
              The current source prototype loads an explicit Pi extension and
              runs a local selection backend. It requires Node.js 22.19 or newer
              and Pi 1.2.0. Public release packaging and platform verification
              are not complete.
            </p>
            <p>
              From a trusted checkout of the <code>pi-router</code> project:
            </p>
            <div className="copy-command">
              <code>{command}</code>
              <button
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(command);
                    setCopied(true);
                  } catch {
                    setCopied(false);
                  }
                }}
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre>
              {
                "npm start\n# In a second terminal, from pi-router:\nnpm run pi\n# Inside Pi:\n/model our-router/auto"
              }
            </pre>
            <p>
              {os === "Windows"
                ? "Use native PowerShell. Windows compatibility is a launch target, not yet a verified release claim."
                : `${os} is a launch target; confirm your exact platform against the release notes before use.`}
            </p>
            <a href="/docs#quickstart" className="text-link">
              Configuration and troubleshooting ↗
            </a>
          </>
        ) : (
          <>
            <p>
              DeepSeek Harness is a planned integration. We’ll publish
              installation commands once the adapter and platform checks pass.
              There is no DeepSeek release to install from this site yet.
            </p>
            <a href="/docs#compatibility" className="text-link">
              See compatibility status ↗
            </a>
          </>
        )}
      </section>
      {release && /^https:\/\//.test(release) ? (
        <a
          href={release}
          className="button primary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Open release downloads ↗
        </a>
      ) : (
        <div className="notice">
          <strong>Public download coming with the verified release.</strong>
          <p>
            No package or binary is published through this site yet.
            Installation instructions remain public; no subscription is required
            to read them.
          </p>
        </div>
      )}
    </div>
  );
}
