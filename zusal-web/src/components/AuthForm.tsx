import { countEvent } from "../lib/analytics";
import { safeNext } from "../lib/auth-redirect";
import { useEffect, useState, type SubmitEvent } from "react";
import { supabase } from "../lib/supabase";
type View =
  "sign-in" | "sign-up" | "reset-password" | "update-password" | "callback";
export default function AuthForm({ view }: { view: View }) {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const title =
    view === "sign-up"
      ? "Find your new route."
      : view === "reset-password"
        ? "A fresh start."
        : view === "update-password"
          ? "Choose a new password."
          : view === "callback"
            ? "Connecting your account."
            : "Welcome back.";
  useEffect(() => {
    if (view === "callback" && supabase) {
      const params = new URLSearchParams(location.search);
      if (params.has("error")) {
        setMessage("Sign-in could not be completed. Please try again.");
        return;
      }
      supabase.auth
        .getSession()
        .then(({ data, error }) => {
          if (error || !data.session)
            setMessage(
              "No active session was found. Return to sign in or request a new link.",
            );
          else location.replace(safeNext(location.search));
        })
        .catch(() =>
          setMessage("Sign-in services are unavailable. Please try again."),
        );
    }
  }, [view]);
  async function submit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setMessage("");
    try {
      if (view === "sign-up") {
        countEvent("signup_submit");
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(safeNext(location.search))}`,
          },
        });
        if (error) throw error;
        setMessage(
          "Check your inbox to verify your account. Your trial has not started.",
        );
      } else if (view === "reset-password") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${location.origin}/update-password`,
        });
        if (error) throw error;
        setMessage(
          "If an account exists for this address, you’ll receive a reset link.",
        );
      } else if (view === "update-password") {
        const { data } = await supabase.auth.getSession();
        if (!data.session)
          throw new Error("Open a valid password reset link first.");
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setMessage("Password updated. You can return to your dashboard.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        location.assign(safeNext(location.search));
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function google() {
    if (!supabase) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(safeNext(location.search))}`,
        },
      });
      if (error) throw error;
    } catch {
      setMessage("Google sign-in is unavailable. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="auth-wrap">
      <div className="auth-side">
        <span className="eyebrow">A LITTLE MORE INTENTION</span>
        <h1>
          Build freely.
          <br />
          Route thoughtfully.
        </h1>
        <p>
          Your agent. Your models.
          <br />A clearer path between them.
        </p>
        <div className="auth-path" aria-hidden="true">
          ↳<span>⇢</span>↗
        </div>
        <span className="eyebrow">ZUSAL / INDIVIDUAL DEVELOPERS</span>
      </div>
      <div className="auth-card">
        <span className="eyebrow">
          {view === "sign-up" ? "CREATE AN ACCOUNT" : "YOUR WORKSPACE"}
        </span>
        <h2>{title}</h2>
        <p>
          {view === "sign-up"
            ? "No card required. Your free period begins on your first successful routed request."
            : "A considered route for whatever comes next."}
        </p>
        {!supabase && (
          <div className="notice">
            <strong>Account services aren’t connected yet.</strong>
            <p>
              This preview does not accept or store credentials.{" "}
              <a className="text-link" href="/app/demo">
                Explore the labeled dashboard demo →
              </a>
            </p>
          </div>
        )}
        {view !== "callback" && (
          <>
            {(view === "sign-in" || view === "sign-up") && (
              <>
                <button
                  className="button google-button"
                  onClick={google}
                  disabled={!supabase || busy}
                >
                  <span aria-hidden="true">G</span> Continue with Google
                </button>
                <div className="auth-divider">
                  <span>or with email</span>
                </div>
              </>
            )}
            <form onSubmit={submit}>
              {view !== "update-password" && (
                <label>
                  Email
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!supabase}
                  />
                </label>
              )}
              {view !== "reset-password" && (
                <label>
                  Password
                  <input
                    type="password"
                    autoComplete={
                      view === "sign-in" ? "current-password" : "new-password"
                    }
                    minLength={8}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={!supabase}
                  />
                </label>
              )}
              {view === "sign-up" && (
                <p className="auth-fine">
                  By creating an account, you acknowledge our{" "}
                  <a href="/privacy">privacy draft</a> and{" "}
                  <a href="/terms">terms draft</a>. Public launch requires final
                  policies.
                </p>
              )}
              <button className="button primary" disabled={!supabase || busy}>
                {busy
                  ? "Working…"
                  : view === "sign-up"
                    ? "Create account ↗"
                    : view === "reset-password"
                      ? "Send reset link ↗"
                      : view === "update-password"
                        ? "Update password ↗"
                        : "Sign in ↗"}
              </button>
            </form>
          </>
        )}
        {message && (
          <p className="form-message" role="status">
            {message}
          </p>
        )}
        {view === "sign-in" ? (
          <div className="auth-links">
            <a href="/reset-password">Forgot password?</a>
            <a href="/sign-up">Create an account →</a>
          </div>
        ) : (
          <div className="auth-links">
            <a href="/sign-in">Back to sign in →</a>
            {view === "update-password" && <a href="/app">Dashboard →</a>}
          </div>
        )}
      </div>
    </section>
  );
}
