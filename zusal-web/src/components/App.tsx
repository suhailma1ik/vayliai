import ActivityChart from "./dashboard/ActivityChart";
import RequestRow from "./dashboard/RequestRow";
import Billing from "./dashboard/Billing";
import AccountSettings from "./dashboard/AccountSettings";
import PairApproval from "./dashboard/PairApproval";
import { useEffect, useState, useMemo } from "react";
import type { User } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  List,
  Wallet,
  Settings,
  ArrowUpRight,
  RefreshCw,
  Download,
  Monitor,
  LogOut,
  SunMoon,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ExternalLink,
} from "lucide-react";
import type {
  Account,
  ModelRequest,
  DailyUsage,
  Device,
} from "../lib/contracts";
import { supabase } from "../lib/supabase";
import { demoAccount, demoRequests, demoDaily, demoDevices } from "../lib/demo";
import {
  dateWindow,
  filterRequests,
  summarize,
  toCsv,
  number,
  money,
} from "../lib/usage";
import AuthForm from "./AuthForm";
import { loadUsage } from "../lib/load-usage";
import "../styles/dashboard.css";

const authViews = [
  "sign-in",
  "sign-up",
  "reset-password",
  "update-password",
  "callback",
];
const labels: Record<string, string> = {
  overview: "Overview",
  history: "Request history",
  billing: "Billing",
  settings: "Account settings",
  approve: "Connect a device",
};
function theme() {
  const next =
    document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("zusal-theme", next);
  } catch {}
}
export default function App({
  initialView = "overview",
}: {
  initialView?: string;
}) {
  const [view, setView] = useState(initialView),
    [demo, setDemo] = useState(initialView === "demo"),
    [user, setUser] = useState<User | null>(null),
    [account, setAccount] = useState<Account | null>(null),
    [rows, setRows] = useState<ModelRequest[]>([]),
    [daily, setDaily] = useState<DailyUsage[]>([]),
    [devices, setDevices] = useState<Device[]>([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [updated, setUpdated] = useState<Date | null>(null),
    [reload, setReload] = useState(0),
    [truncated, setTruncated] = useState(false);
  const [range, setRange] = useState("7d"),
    [start, setStart] = useState(""),
    [end, setEnd] = useState(""),
    [model, setModel] = useState(""),
    [status, setStatus] = useState(""),
    [page, setPage] = useState(0),
    [expanded, setExpanded] = useState<string | null>(null);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("demo") === "1" || location.pathname.includes("/demo")) {
      setDemo(true);
      setView(initialView === "demo" ? "overview" : initialView);
      setAccount(demoAccount);
      setRows(demoRequests());
      setDaily(demoDaily());
      setDevices(demoDevices);
      setUpdated(new Date());
      setLoading(false);
      return;
    }
    if (authViews.includes(initialView)) {
      setLoading(false);
      return;
    }
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (error)
          setError("Unable to restore your session. Please sign in again.");
        setUser(data.session?.user ?? null);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to restore your session. Please sign in again.");
        setLoading(false);
      });
    const { data } = supabase.auth.onAuthStateChange((_event, session) =>
      setUser(session?.user ?? null),
    );
    return () => data.subscription.unsubscribe();
  }, [initialView]);
  useEffect(() => {
    if (!user || !supabase || demo) return;
    let active = true;
    setLoading(true);
    setError("");
    Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single(),
      loadUsage(),
      supabase
        .from("daily_usage")
        .select("*")
        .order("day", { ascending: true })
        .limit(367),
      supabase
        .from("devices")
        .select("id,name,created_at,last_seen_at,revoked_at")
        .order("created_at", { ascending: false }),
    ])
      .then(([a, r, d, v]) => {
        if (!active) return;
        const issue = [a.error, r.error, d.error, v.error].find(Boolean);
        if (issue) {
          setError(
            "Some account data could not be loaded. Your usage is unavailable, not zero.",
          );
          return;
        }
        setAccount(a.data);
        setRows((r.data ?? []) as ModelRequest[]);
        setDaily((d.data ?? []) as DailyUsage[]);
        setDevices((v.data ?? []) as Device[]);
        setTruncated(false);
        setUpdated(new Date());
      })
      .catch(() => {
        if (active)
          setError("Unable to reach account services. Try refreshing.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user, demo, reload]);
  let window: { start: string; end: string };
  let rangeError = "";
  try {
    window = dateWindow(range, new Date(), start, end);
  } catch (e) {
    window = dateWindow("7d");
    rangeError = e instanceof Error ? e.message : "Invalid dates";
  }
  const filtered = useMemo(
    () => filterRequests(rows, { ...window, model, status }),
    [rows, window.start, window.end, model, status],
  );
  const summary = summarize(filtered);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  useEffect(() => setPage(0), [range, start, end, model, status]);
  const demoQuery = demo ? "?demo=1" : "";
  function exportCsv() {
    const blob = new Blob([toCsv(filtered)], {
        type: "text/csv;charset=utf-8;",
      }),
      url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "zusal-requests.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  if (authViews.includes(initialView))
    return (
      <AuthForm
        view={
          initialView as
            | "sign-in"
            | "sign-up"
            | "reset-password"
            | "update-password"
            | "callback"
        }
      />
    );
  const nav = [
    { key: "overview", path: "/app", icon: LayoutDashboard },
    { key: "history", path: "/app/history", icon: List },
    { key: "billing", path: "/app/billing", icon: Wallet },
    { key: "settings", path: "/app/settings", icon: Settings },
  ];
  return (
    <div className="workspace">
      <aside className="app-sidebar">
        <a href="/" className="app-brand">
          <img src="/favicon.svg" width="28" height="28" alt="" />
          Zusal
        </a>
        <div className="workspace-picker">
          <span className="avatar">
            {demo ? "AM" : user?.email?.slice(0, 2).toUpperCase() || "ZU"}
          </span>
          <div>
            <strong>{demo ? "Alex’s workspace" : "Personal workspace"}</strong>
            <span>Individual account</span>
          </div>
          <ChevronDown size={13} />
        </div>
        <span className="sidebar-label">WORKSPACE</span>
        <nav aria-label="Workspace">
          {nav.map(({ key, path, icon: Icon }) => (
            <a
              key={key}
              href={path + demoQuery}
              aria-current={view === key ? "page" : undefined}
            >
              <Icon size={16} />
              {labels[key]}
              {key === "overview" && <span className="nav-indicator" />}
            </a>
          ))}
        </nav>
        <div className="sidebar-help">
          <span className="sidebar-label">A LITTLE GUIDANCE</span>
          <p>
            Your next route
            <br />
            starts with a connection.
          </p>
          <a href="/docs">
            Read the docs <ArrowUpRight size={13} />
          </a>
        </div>
        <div className="sidebar-bottom">
          <a href="/docs#support">
            <ExternalLink size={14} />
            Discord community
          </a>
          <button onClick={theme}>
            <SunMoon size={15} />
            Switch theme
          </button>
          {!demo && user && (
            <button
              onClick={() =>
                supabase?.auth.signOut().then(() => location.assign("/sign-in"))
              }
            >
              <LogOut size={15} />
              Sign out
            </button>
          )}
          <span className="sidebar-version">ZUSAL / DEVELOPER PREVIEW</span>
        </div>
      </aside>
      <div className="workspace-main">
        <header className="app-header">
          <div>
            <span className="breadcrumb">
              Workspace <span>/</span> {labels[view] || "Overview"}
            </span>
          </div>
          <div className="app-header-right">
            <a href="/download">
              Install Zusal <ArrowUpRight size={12} />
            </a>
            <span className="avatar small">{demo ? "AM" : "ZU"}</span>
          </div>
        </header>
        <div className="app-content">
          {demo && (
            <div className="demo-banner">
              <span>
                <strong>DEMO WORKSPACE</strong> Illustrative data. No real
                requests or billing actions.
              </span>
              <a href="/sign-up">Create your account ↗</a>
            </div>
          )}
          <div className="app-title">
            <div>
              <span className="eyebrow">YOUR ROUTING WORKSPACE</span>
              <h1>
                {labels[view] || "Overview"}
                <span className="title-period">.</span>
              </h1>
              <p>
                {view === "overview"
                  ? "A little clarity for every call."
                  : view === "history"
                    ? "Follow the details, request by request."
                    : view === "billing"
                      ? "Your routing plan. Your choice."
                      : view === "settings"
                        ? "Your account, connections, and controls."
                        : "Approve only a connection you started."}
              </p>
            </div>
            {(view === "overview" || view === "history") && (
              <button
                className="button compact"
                disabled={loading}
                onClick={() =>
                  demo
                    ? (setRows(demoRequests()), setUpdated(new Date()))
                    : setReload((n) => n + 1)
                }
              >
                <RefreshCw size={13} />
                Refresh
              </button>
            )}
          </div>
          {!demo && !supabase ? (
            <div className="connection-state">
              <Monitor size={30} />
              <h2>
                Your workspace is ready
                <br />
                for a connection.
              </h2>
              <p>
                Account services have not been configured for this preview.
                Nothing here is being presented as your real usage.
              </p>
              <div>
                <a className="button primary" href="/app/demo">
                  Explore demo workspace ↗
                </a>
                <a className="button" href="/docs#account">
                  Connection guide
                </a>
              </div>
              <small>
                Set the public Supabase URL and publishable key to enable
                account login.
              </small>
            </div>
          ) : !demo && !user && !loading ? (
            <div className="connection-state">
              <h2>Your account. Your routes.</h2>
              <p>
                Sign in to view your usage, connect a CLI device, and manage
                your plan.
              </p>
              <a
                className="button primary"
                href={
                  "/sign-in?next=" +
                  encodeURIComponent(location.pathname + location.search)
                }
              >
                Sign in ↗
              </a>
            </div>
          ) : loading ? (
            <div className="loading-state" role="status">
              Loading your workspace…
            </div>
          ) : error ? (
            <div className="notice" role="alert">
              {error}
              <button
                className="button compact"
                onClick={() => setReload((n) => n + 1)}
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              {(view === "overview" || view === "history") && (
                <>
                  <div className="filter-bar">
                    <div
                      className="range-tabs"
                      role="group"
                      aria-label="Date range"
                    >
                      {[
                        ["today", "Today"],
                        ["7d", "Last 7 days"],
                        ["30d", "Last 30 days"],
                        ["custom", "Custom"],
                      ].map(([key, label]) => (
                        <button
                          key={key}
                          aria-pressed={range === key}
                          onClick={() => setRange(key)}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <span className="data-freshness">
                      {updated
                        ? `Updated ${updated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                        : "Waiting for usage"}{" "}
                      <span className="status-dot" />
                    </span>
                  </div>
                  {range === "custom" && (
                    <div className="custom-range">
                      <label>
                        From
                        <input
                          type="date"
                          value={start}
                          onChange={(e) => setStart(e.target.value)}
                        />
                      </label>
                      <label>
                        Through
                        <input
                          type="date"
                          value={end}
                          onChange={(e) => setEnd(e.target.value)}
                        />
                      </label>
                    </div>
                  )}
                  {rangeError && <p role="alert">{rangeError}</p>}
                  <span className="timezone-note">
                    Request times: {timezone}. Detailed history: 30 days. Daily
                    summaries: 12 months.
                  </span>
                  {truncated && (
                    <div className="notice">
                      Showing the latest 1,000 request records. These
                      detail-derived totals and exports are partial; narrow the
                      date range before comparing them with your provider.
                    </div>
                  )}
                  {view === "overview" && (
                    <>
                      <div className="metric-grid">
                        {[
                          {
                            label: "Model requests",
                            value: number(summary.requests),
                            caption: "Execution calls",
                            icon: "↗",
                          },
                          {
                            label: "Tokens",
                            value:
                              summary.partialTokens && summary.knownTokens === 0
                                ? "—"
                                : number(summary.knownTokens),
                            caption: summary.partialTokens
                              ? "Partial reported usage"
                              : "Input + output",
                            icon: "⊞",
                          },
                          {
                            label: "Models used",
                            value: String(summary.models),
                            caption: "Selected in this range",
                            icon: "⇢",
                          },
                          {
                            label: "Estimated model cost",
                            value:
                              summary.partialCost && summary.cost === 0
                                ? "—"
                                : money(summary.cost),
                            caption: summary.partialCost
                              ? "Partial estimate · USD"
                              : "Provider usage · USD",
                            icon: "$",
                          },
                        ].map((m) => (
                          <div className="metric" key={m.label}>
                            <span>
                              {m.label}
                              <span className="metric-icon">{m.icon}</span>
                            </span>
                            <strong>{m.value}</strong>
                            <small>{m.caption}</small>
                          </div>
                        ))}
                      </div>
                      <div className="overview-panels">
                        <section className="activity-panel">
                          <div className="panel-title">
                            <div>
                              <h2>Request activity</h2>
                              <p>Actual model calls, including retries.</p>
                            </div>
                            <span className="pill">REQUESTS</span>
                          </div>
                          <ActivityChart rows={filtered} />
                        </section>
                        <section className="models-panel">
                          <div className="panel-title">
                            <div>
                              <h2>Models in the mix</h2>
                              <p>How your requests were distributed.</p>
                            </div>
                          </div>
                          {summary.requests ? (
                            Array.from(
                              new Set(filtered.map((r) => r.model)),
                            ).map((name, index) => {
                              const count = filtered.filter(
                                (r) => r.model === name,
                              ).length;
                              return (
                                <div className="model-distribution" key={name}>
                                  <div>
                                    <span>
                                      <i
                                        className={`model-color color-${index % 3}`}
                                      />
                                      {name}
                                    </span>
                                    <strong>
                                      {Math.round(
                                        (count / summary.requests) * 100,
                                      )}
                                      %
                                    </strong>
                                  </div>
                                  <div className="distribution-track">
                                    <span
                                      style={{
                                        width: `${(count / summary.requests) * 100}%`,
                                      }}
                                    />
                                  </div>
                                  <small>{count} requests</small>
                                </div>
                              );
                            })
                          ) : (
                            <p className="empty-inline">
                              Your selected models will appear after the first
                              reported call.
                            </p>
                          )}
                        </section>
                      </div>
                    </>
                  )}
                  <section className="history-panel">
                    <div className="panel-title">
                      <div>
                        <h2>
                          {view === "overview"
                            ? "Recent requests"
                            : "Model requests"}
                        </h2>
                        <p>Usage metadata only. Never your prompts or code.</p>
                      </div>
                      {view === "overview" ? (
                        <a
                          href={"/app/history" + demoQuery}
                          className="quiet-link"
                        >
                          View all <ArrowUpRight size={13} />
                        </a>
                      ) : (
                        <button
                          className="button compact"
                          disabled={!filtered.length || !!rangeError}
                          onClick={exportCsv}
                        >
                          <Download size={13} />
                          {truncated ? "Export loaded CSV" : "Export CSV"}
                        </button>
                      )}
                    </div>
                    {view === "history" && (
                      <div className="history-filters">
                        <label>
                          Model
                          <select
                            aria-label="Model"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                          >
                            <option value="">All models</option>
                            {Array.from(new Set(rows.map((r) => r.model))).map(
                              (m) => (
                                <option key={m}>{m}</option>
                              ),
                            )}
                          </select>
                        </label>
                        <label>
                          Status
                          <select
                            aria-label="Status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                          >
                            <option value="">All statuses</option>
                            <option value="successful">Successful</option>
                            <option value="failed">Failed</option>
                            <option value="canceled">Canceled</option>
                          </select>
                        </label>
                      </div>
                    )}
                    <div className="table-scroll">
                      <table className="request-table">
                        <thead>
                          <tr>
                            <th>Model / Request</th>
                            <th>Time</th>
                            <th>Tokens</th>
                            <th>Est. cost</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(view === "overview"
                            ? filtered.slice(0, 5)
                            : filtered.slice(page * 15, (page + 1) * 15)
                          ).map((r) => (
                            <RequestRow
                              key={r.id}
                              request={r}
                              expanded={expanded === r.id}
                              onToggle={() =>
                                setExpanded(expanded === r.id ? null : r.id)
                              }
                            />
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {!filtered.length && (
                      <div className="empty-requests">
                        <span>↳</span>
                        <h3>No requests in this range.</h3>
                        <p>
                          Connect the CLI and complete a routed request.
                          Reporting arrives from the harness; empty history
                          alone does not confirm whether the router is
                          connected.
                        </p>
                        <a href="/download" className="text-link">
                          Set up Zusal ↗
                        </a>
                      </div>
                    )}
                    {view === "history" && filtered.length > 15 && (
                      <div className="pagination">
                        <span>
                          {page * 15 + 1}–
                          {Math.min((page + 1) * 15, filtered.length)} of{" "}
                          {filtered.length}
                        </span>
                        <button
                          aria-label="Previous page"
                          disabled={page === 0}
                          onClick={() => setPage((p) => p - 1)}
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          aria-label="Next page"
                          disabled={(page + 1) * 15 >= filtered.length}
                          onClick={() => setPage((p) => p + 1)}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </section>
                  <div className="cost-note">
                    Estimated model costs are not Zusal charges. Actual provider
                    bills may differ. Missing usage is never treated as a
                    confirmed zero.
                  </div>
                  {view === "overview" && (
                    <section className="daily-summary">
                      <details>
                        <summary>Daily summaries · up to 12 months</summary>
                        <p>
                          Compact daily totals are stored in UTC. Request
                          filters above use {timezone}.
                        </p>
                        <div className="table-scroll">
                          <table className="request-table">
                            <thead>
                              <tr>
                                <th>Day (UTC)</th>
                                <th>Requests</th>
                                <th>Reported tokens</th>
                                <th>Estimated cost</th>
                              </tr>
                            </thead>
                            <tbody>
                              {daily
                                .slice()
                                .reverse()
                                .map((d) => (
                                  <tr key={d.day}>
                                    <td>{d.day}</td>
                                    <td>{d.requests}</td>
                                    <td>
                                      {number(d.tokens)}
                                      {d.missing_tokens ? " · partial" : ""}
                                    </td>
                                    <td>
                                      {d.estimated_cost_usd === null
                                        ? "Unavailable"
                                        : money(d.estimated_cost_usd)}
                                      {d.missing_cost ? " · partial" : ""}
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                        {!daily.length && <p>No summary records yet.</p>}
                      </details>
                    </section>
                  )}
                </>
              )}
              {view === "billing" && <Billing account={account} demo={demo} />}
              {view === "settings" && (
                <AccountSettings
                  user={user}
                  account={account}
                  devices={devices}
                  demo={demo}
                  refresh={() => setReload((n) => n + 1)}
                />
              )}
              {view === "approve" && <PairApproval demo={demo} />}
              {view === "overview" && (
                <div className="plan-footer">
                  <div>
                    <span className="status-dot" />
                    <strong>
                      {account?.subscription_status === "active"
                        ? "Pro workspace"
                        : account?.trial_ends_at
                          ? `Trial ends ${new Date(account.trial_ends_at).toLocaleDateString()}`
                          : "Your first successful request starts your trial"}
                    </strong>
                    <span>Provider usage is billed separately.</span>
                  </div>
                  <a href={"/app/billing" + demoQuery}>Manage plan ↗</a>
                </div>
              )}
            </>
          )}
        </div>
        <footer className="app-bottom">
          <span>ZUSAL / A CONSIDERED ROUTE</span>
          <div>
            <a href="/privacy">Privacy</a>
            <a href="/docs">Documentation ↗</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
