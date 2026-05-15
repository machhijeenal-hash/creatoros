import { c as createLucideIcon, G as useUserProfile, y as useActor, j as reactExports, q as jsxRuntimeExports, A as AnimatePresence, t as motion, z as LoaderCircle, ah as unwrapResult, Z as Zap, S as Sparkles, C as ChevronDown, B as createActor } from "./index-Bt5dTGTg.js";
import { B as Badge } from "./badge-DMLtg8Eo.js";
import { B as Button } from "./button-iLZnvIfQ.js";
import { S as Separator } from "./separator-wef3YGCR.js";
import { C as Check, a as ChevronUp } from "./chevron-up-D-g5bNOV.js";
import { X } from "./x-hpogwdby.js";
import { S as Star } from "./star-uvVnGxEB.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode);
const PLANS = [
  {
    tier: "Free",
    label: "Free",
    price: "$0",
    priceNote: "forever",
    tagline: "Get started with AI-powered creation",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5" }),
    recommended: false,
    accentClass: "border-border",
    glowClass: "",
    badgeClass: "bg-muted text-muted-foreground",
    features: [
      "20 AI generations / month",
      "Basic dashboard",
      "Up to 50 content items",
      "Basic Pomodoro timer",
      "Community support"
    ]
  },
  {
    tier: "Pro",
    label: "Pro",
    price: "$19",
    priceNote: "/ month",
    tagline: "Unlock unlimited creation for serious creators",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5" }),
    recommended: true,
    accentClass: "border-primary",
    glowClass: "shadow-[0_0_40px_-8px_oklch(0.56_0.22_262/0.45)]",
    badgeClass: "bg-primary text-primary-foreground",
    features: [
      "Unlimited AI generations",
      "Advanced content planner",
      "Full analytics dashboard",
      "All productivity features",
      "Full template vault",
      "Priority support"
    ]
  },
  {
    tier: "Elite",
    label: "Elite",
    price: "$49",
    priceNote: "/ month",
    tagline: "Maximum power for scaling creators",
    icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "w-5 h-5" }),
    recommended: false,
    accentClass: "border-secondary",
    glowClass: "shadow-[0_0_40px_-8px_oklch(0.52_0.18_297/0.45)]",
    badgeClass: "bg-secondary text-secondary-foreground",
    features: [
      "Everything in Pro",
      "Workflow automation engine",
      "Advanced reporting & exports",
      "Team workspaces (Round 2)",
      "Viral Intelligence Engine (Round 2)",
      "Early access to all new features",
      "Dedicated account manager"
    ]
  }
];
const COMPARISON = [
  {
    feature: "AI Content Generation",
    free: "20 / month",
    pro: "Unlimited",
    elite: "Unlimited"
  },
  {
    feature: "Content Planner Items",
    free: "50 items",
    pro: "Unlimited",
    elite: "Unlimited"
  },
  { feature: "Generation History", free: false, pro: true, elite: true },
  { feature: "Full Analytics Dashboard", free: false, pro: true, elite: true },
  {
    feature: "Pomodoro & Focus Timer",
    free: "Basic",
    pro: "Advanced",
    elite: "Advanced"
  },
  { feature: "Habit Streak Tracking", free: false, pro: true, elite: true },
  { feature: "Template Vault", free: false, pro: true, elite: true },
  { feature: "Workflow Automation", free: false, pro: false, elite: true },
  { feature: "Advanced Reporting", free: false, pro: false, elite: true },
  { feature: "Team Workspaces", free: false, pro: false, elite: "Round 2" },
  {
    feature: "Viral Intelligence Engine",
    free: false,
    pro: false,
    elite: "Round 2"
  },
  {
    feature: "Support",
    free: "Community",
    pro: "Priority",
    elite: "Dedicated"
  }
];
const FAQS = [
  {
    q: "Can I cancel or change my plan at any time?",
    a: "Yes. You can upgrade, downgrade, or cancel your subscription at any time from the billing portal. Changes take effect at the start of the next billing cycle. There are no cancellation fees."
  },
  {
    q: "What happens to my data if I downgrade to Free?",
    a: "Your data is always safe. If you downgrade, you keep all existing content items and generations, but new creations will be limited to the Free tier quota. You can upgrade again at any time to restore full access."
  },
  {
    q: "Is there a free trial for Pro or Elite?",
    a: "The Free tier gives you a genuine taste of CreatorOS with no credit card required. We don't offer time-limited trials — you can explore the platform at your own pace and upgrade when you're ready."
  }
];
function ComparisonCell({ value }) {
  if (value === true) return /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-primary mx-auto" });
  if (value === false)
    return /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-muted-foreground mx-auto opacity-40" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-foreground/80", children: value });
}
function FaqItem({ q, a, index }) {
  const [open, setOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 16 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true },
      transition: { delay: index * 0.1, duration: 0.4 },
      className: "glass rounded-xl overflow-hidden",
      "data-ocid": `faq.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => setOpen((v) => !v),
            className: "w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-white/5 transition-smooth",
            "aria-expanded": open,
            "data-ocid": `faq.toggle.${index + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-sm text-foreground", children: q }),
              open ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "w-4 h-4 text-muted-foreground shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-muted-foreground shrink-0" })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: open && /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { height: 0, opacity: 0 },
            animate: { height: "auto", opacity: 1 },
            exit: { height: 0, opacity: 0 },
            transition: { duration: 0.25, ease: "easeInOut" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-5 pb-4 text-sm text-muted-foreground leading-relaxed", children: a })
          },
          "answer"
        ) })
      ]
    }
  );
}
function Subscriptions() {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { actor } = useActor(createActor);
  const [upgrading, setUpgrading] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const params = new URLSearchParams(window.location.search);
  const isSuccess = params.get("success") === "true";
  const currentTier = (profile == null ? void 0 : profile.tier) ?? "Free";
  async function handleUpgrade(tier) {
    if (!actor) return;
    setUpgrading(tier);
    setError(null);
    try {
      const raw = await actor.createCheckoutSession(tier);
      const result = unwrapResult(
        raw
      );
      window.location.href = result.url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create checkout session. Please try again."
      );
      setUpgrading(null);
    }
  }
  async function handleManageBilling() {
    if (!actor) return;
    setError(null);
    try {
      const raw = await actor.getStripePortalUrl();
      const result = unwrapResult(
        raw
      );
      window.open(result.url, "_blank");
    } catch {
      setError("Could not open billing portal. Please try again.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-full bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { y: -60, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -60, opacity: 0 },
        className: "sticky top-0 z-50 bg-primary/20 border-b border-primary/30 backdrop-blur-md",
        "data-ocid": "subscriptions.success_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-6 py-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 text-primary shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-foreground", children: [
            "Subscription activated! Enjoy your",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary font-semibold", children: currentTier }),
            " ",
            "features."
          ] })
        ] })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 },
          className: "text-center space-y-3",
          "data-ocid": "subscriptions.page",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-mono uppercase tracking-widest text-primary", children: "Pricing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "font-display text-4xl font-bold text-foreground", children: [
              "Run your creator business",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient", children: "without limits" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-base max-w-xl mx-auto", children: "Choose the plan that fits your ambition. Upgrade or cancel anytime." })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: error && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.98 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.98 },
          className: "glass border border-destructive/40 rounded-xl px-5 py-3 flex items-center gap-3",
          "data-ocid": "subscriptions.error_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 text-destructive shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setError(null),
                className: "ml-auto text-muted-foreground hover:text-foreground transition-smooth",
                "aria-label": "Dismiss error",
                "data-ocid": "subscriptions.close_button",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
              }
            )
          ]
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid grid-cols-1 md:grid-cols-3 gap-5",
          "data-ocid": "subscriptions.list",
          children: PLANS.map((plan, i) => {
            const isCurrent = plan.tier === currentTier;
            const isDowngrade = plan.tier === "Free" && (currentTier === "Pro" || currentTier === "Elite");
            const isLoadingPlan = upgrading === plan.tier;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 32 },
                animate: { opacity: 1, y: 0 },
                transition: {
                  delay: i * 0.12,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1]
                },
                "data-ocid": `subscriptions.item.${i + 1}`,
                className: [
                  "relative flex flex-col glass rounded-2xl p-6 border-2 transition-smooth",
                  plan.accentClass,
                  plan.glowClass,
                  isCurrent ? "ring-2 ring-primary/40" : ""
                ].join(" "),
                children: [
                  plan.recommended && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-3 left-1/2 -translate-x-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-primary text-primary-foreground text-xs font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-primary/30", children: "Recommended" }) }),
                  isCurrent && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-4 right-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Badge,
                    {
                      className: `text-xs font-bold ${plan.badgeClass}`,
                      "data-ocid": `subscriptions.current_badge.${i + 1}`,
                      children: "Current Plan"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: `p-2 rounded-lg ${plan.tier === "Pro" ? "bg-primary/15 text-primary" : plan.tier === "Elite" ? "bg-secondary/15 text-secondary" : "bg-muted text-muted-foreground"}`,
                        children: plan.icon
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-bold text-foreground", children: plan.label })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-4xl font-bold text-foreground", children: plan.price }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-sm ml-1", children: plan.priceNote })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs mb-6 min-h-[2.5rem] leading-relaxed", children: plan.tagline }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "mb-5 bg-border/50" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2.5 flex-1 mb-7", children: plan.features.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-start gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Check,
                      {
                        className: `w-4 h-4 mt-0.5 shrink-0 ${plan.tier === "Pro" ? "text-primary" : plan.tier === "Elite" ? "text-secondary" : "text-muted-foreground"}`
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground/80 leading-snug", children: f })
                  ] }, f)) }),
                  profileLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 rounded-lg bg-muted animate-pulse" }) : isCurrent ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "outline",
                      disabled: true,
                      className: "w-full",
                      "data-ocid": `subscriptions.current_plan_button.${i + 1}`,
                      children: "Current Plan"
                    }
                  ) : isDowngrade ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      variant: "ghost",
                      onClick: handleManageBilling,
                      className: "w-full flex items-center gap-2 hover:bg-muted",
                      "data-ocid": `subscriptions.manage_billing_button.${i + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4" }),
                        "Manage Billing"
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      onClick: () => handleUpgrade(plan.tier),
                      disabled: isLoadingPlan || !!upgrading,
                      className: `w-full font-semibold ${plan.tier === "Elite" ? "bg-secondary/90 hover:bg-secondary text-secondary-foreground" : ""}`,
                      variant: plan.tier === "Pro" ? "default" : "outline",
                      "data-ocid": `subscriptions.upgrade_button.${i + 1}`,
                      children: isLoadingPlan ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }),
                        "Opening Checkout…"
                      ] }) : `Upgrade to ${plan.label}`
                    }
                  )
                ]
              },
              plan.tier
            );
          })
        }
      ),
      (currentTier === "Pro" || currentTier === "Elite") && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { delay: 0.5 },
          className: "flex justify-center",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: handleManageBilling,
              className: "text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-smooth underline underline-offset-4",
              "data-ocid": "subscriptions.manage_billing_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3.5 h-3.5" }),
                "Manage billing & invoices"
              ]
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "subscriptions.section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.h2,
          {
            initial: { opacity: 0, y: 16 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            className: "font-display text-2xl font-bold text-foreground mb-6 text-center",
            children: "Full feature comparison"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 24 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.5 },
            className: "glass rounded-2xl overflow-hidden",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-4 border-b border-border/50 bg-muted/20", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3 text-xs font-mono uppercase tracking-wider text-muted-foreground", children: "Feature" }),
                PLANS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs font-bold font-mono uppercase tracking-wider ${p.tier === "Pro" ? "text-primary" : p.tier === "Elite" ? "text-secondary" : "text-muted-foreground"}`,
                    children: p.label
                  }
                ) }, p.tier))
              ] }),
              COMPARISON.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `grid grid-cols-4 border-b border-border/30 last:border-0 ${i % 2 === 0 ? "" : "bg-muted/10"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 py-3.5 text-sm text-foreground/90", children: row.feature }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3.5 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ComparisonCell, { value: row.free }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3.5 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ComparisonCell, { value: row.pro }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-3.5 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ComparisonCell, { value: row.elite }) })
                  ]
                },
                row.feature
              ))
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "subscriptions.faq_section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.h2,
          {
            initial: { opacity: 0, y: 16 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            className: "font-display text-2xl font-bold text-foreground mb-6 text-center",
            children: "Billing FAQ"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 max-w-2xl mx-auto", children: FAQS.map((faq, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(FaqItem, { q: faq.q, a: faq.a, index: i }, faq.q)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          className: "text-center space-y-4 pb-8",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
            "Questions? Reach out to",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://caffeine.ai",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-primary hover:underline underline-offset-4 transition-smooth",
                "data-ocid": "subscriptions.support_link",
                children: "Caffeine support"
              }
            ),
            " ",
            "— we're here to help."
          ] })
        }
      )
    ] })
  ] });
}
export {
  Subscriptions as default
};
