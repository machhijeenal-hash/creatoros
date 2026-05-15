import { createActor } from "@/backend";
import { useAuth } from "@/hooks/useAuth";
import { useActor } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Shield, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const FEATURES = [
  { icon: "⚡", label: "AI-powered content generation" },
  { icon: "📅", label: "Smart content planner" },
  { icon: "🎯", label: "Productivity system & streaks" },
];

export default function Login() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const hasInitialized = useRef(false);
  const [initializingUser, setInitializingUser] = useState(false);

  // Initialize user record on first login
  useEffect(() => {
    if (isAuthenticated && actor && !hasInitialized.current) {
      hasInitialized.current = true;
      setInitializingUser(true);
      actor
        .createOrUpdateUser("", "")
        .catch(() => {})
        .finally(() => {
          setInitializingUser(false);
          navigate({ to: "/dashboard" });
        });
    }
  }, [isAuthenticated, actor, navigate]);

  // Already authenticated with no pending init — redirect immediately
  useEffect(() => {
    if (isAuthenticated && !initializingUser && hasInitialized.current) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, initializingUser, navigate]);

  const busy = isLoading || initializingUser;

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden">
      {/* Ambient glow backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-primary opacity-[0.12] blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-secondary opacity-[0.10] blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary opacity-[0.05] blur-[80px]" />
      </div>

      {/* Dot-grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, oklch(0.95 0 0) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-[420px] mx-4"
      >
        <div className="glass rounded-2xl p-8 shadow-2xl shadow-black/40">
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.45 }}
            className="flex flex-col items-center mb-8"
          >
            <div className="relative mb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Zap className="w-7 h-7 text-primary-foreground fill-current" />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-primary opacity-20 blur-md scale-110" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Creator<span className="text-gradient">OS</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground font-body">
              Your AI-powered creator operating system
            </p>
          </motion.div>

          {/* Divider */}
          <div className="border-t border-border mb-6" />

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="text-center mb-6"
          >
            <h2 className="font-display text-xl font-semibold text-foreground mb-2">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sign in with Internet Identity — a privacy-first,
              <br />
              passwordless login. No email. No tracking.
            </p>
          </motion.div>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <button
              type="button"
              data-ocid="login.submit_button"
              onClick={login}
              disabled={busy}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm transition-smooth hover:brightness-110 hover:shadow-lg hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed glow-accent"
            >
              <AnimatePresence mode="wait">
                {busy ? (
                  <motion.span
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                    data-ocid="login.loading_state"
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {initializingUser
                      ? "Setting up your account…"
                      : "Connecting…"}
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    Sign in with Internet Identity
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </motion.div>

          {/* Feature pills */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.48, duration: 0.4 }}
            className="mt-6 flex flex-col gap-2"
            aria-label="Platform features"
          >
            {FEATURES.map((f, i) => (
              <motion.li
                key={f.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.52 + i * 0.08, duration: 0.35 }}
                className="flex items-center gap-3 text-xs text-muted-foreground"
              >
                <span className="text-base leading-none">{f.icon}</span>
                <span>{f.label}</span>
              </motion.li>
            ))}
          </motion.ul>

          {/* Privacy note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="mt-6 text-center text-xs text-muted-foreground/60"
          >
            Internet Identity never shares your data. No passwords stored.
          </motion.p>
        </div>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} CreatorOS. Built with{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </motion.div>
    </div>
  );
}
