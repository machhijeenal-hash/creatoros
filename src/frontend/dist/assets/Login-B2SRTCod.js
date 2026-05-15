import { w as useAuth, x as useNavigate, y as useActor, j as reactExports, q as jsxRuntimeExports, t as motion, Z as Zap, A as AnimatePresence, z as LoaderCircle, B as createActor } from "./index-Bt5dTGTg.js";
import { S as Shield } from "./shield-l8SFz--n.js";
const FEATURES = [
  { icon: "⚡", label: "AI-powered content generation" },
  { icon: "📅", label: "Smart content planner" },
  { icon: "🎯", label: "Productivity system & streaks" }
];
function Login() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const navigate = useNavigate();
  const { actor } = useActor(createActor);
  const hasInitialized = reactExports.useRef(false);
  const [initializingUser, setInitializingUser] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (isAuthenticated && actor && !hasInitialized.current) {
      hasInitialized.current = true;
      setInitializingUser(true);
      actor.createOrUpdateUser("", "").catch(() => {
      }).finally(() => {
        setInitializingUser(false);
        navigate({ to: "/dashboard" });
      });
    }
  }, [isAuthenticated, actor, navigate]);
  reactExports.useEffect(() => {
    if (isAuthenticated && !initializingUser && hasInitialized.current) {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, initializingUser, navigate]);
  const busy = isLoading || initializingUser;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen bg-background flex items-center justify-center overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "aria-hidden": "true", className: "pointer-events-none absolute inset-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-primary opacity-[0.12] blur-[120px]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full bg-secondary opacity-[0.10] blur-[100px]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-primary opacity-[0.05] blur-[80px]" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "aria-hidden": "true",
        className: "pointer-events-none absolute inset-0 opacity-[0.04]",
        style: {
          backgroundImage: "radial-gradient(circle, oklch(0.95 0 0) 1px, transparent 1px)",
          backgroundSize: "28px 28px"
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 28, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
        className: "relative z-10 w-full max-w-[420px] mx-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-8 shadow-2xl shadow-black/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: -10 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.15, duration: 0.45 },
                className: "flex flex-col items-center mb-8",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-7 h-7 text-primary-foreground fill-current" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-2xl bg-primary opacity-20 blur-md scale-110" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-2xl font-bold tracking-tight text-foreground", children: [
                    "Creator",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "OS" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground font-body", children: "Your AI-powered creator operating system" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border mb-6" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0.25, duration: 0.4 },
                className: "text-center mb-6",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-xl font-semibold text-foreground mb-2", children: "Welcome back" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground leading-relaxed", children: [
                    "Sign in with Internet Identity — a privacy-first,",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                    "passwordless login. No email. No tracking."
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0, y: 8 },
                animate: { opacity: 1, y: 0 },
                transition: { delay: 0.35, duration: 0.4 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "login.submit_button",
                    onClick: login,
                    disabled: busy,
                    className: "w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm transition-smooth hover:brightness-110 hover:shadow-lg hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed glow-accent",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: busy ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.span,
                      {
                        initial: { opacity: 0, scale: 0.8 },
                        animate: { opacity: 1, scale: 1 },
                        exit: { opacity: 0, scale: 0.8 },
                        className: "flex items-center gap-2",
                        "data-ocid": "login.loading_state",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
                          initializingUser ? "Setting up your account…" : "Connecting…"
                        ]
                      },
                      "loading"
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.span,
                      {
                        initial: { opacity: 0, scale: 0.8 },
                        animate: { opacity: 1, scale: 1 },
                        exit: { opacity: 0, scale: 0.8 },
                        className: "flex items-center gap-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4" }),
                          "Sign in with Internet Identity"
                        ]
                      },
                      "idle"
                    ) })
                  }
                )
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.ul,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0.48, duration: 0.4 },
                className: "mt-6 flex flex-col gap-2",
                "aria-label": "Platform features",
                children: FEATURES.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.li,
                  {
                    initial: { opacity: 0, x: -8 },
                    animate: { opacity: 1, x: 0 },
                    transition: { delay: 0.52 + i * 0.08, duration: 0.35 },
                    className: "flex items-center gap-3 text-xs text-muted-foreground",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base leading-none", children: f.icon }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: f.label })
                    ]
                  },
                  f.label
                ))
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.p,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                transition: { delay: 0.7, duration: 0.4 },
                className: "mt-6 text-center text-xs text-muted-foreground/60",
                children: "Internet Identity never shares your data. No passwords stored."
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 text-center text-xs text-muted-foreground/50", children: [
            "© ",
            (/* @__PURE__ */ new Date()).getFullYear(),
            " CreatorOS. Built with",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
                target: "_blank",
                rel: "noreferrer",
                className: "underline underline-offset-2 hover:text-muted-foreground transition-colors",
                children: "caffeine.ai"
              }
            )
          ] })
        ]
      }
    )
  ] });
}
export {
  Login as default
};
