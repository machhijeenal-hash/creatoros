import { createActor } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserProfile } from "@/hooks/useBackend";
import { unwrapResult } from "@/lib/backend";
import type { SubscriptionTier } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import {
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

// ─── Plan config ─────────────────────────────────────────────────────────────

interface Plan {
  tier: SubscriptionTier;
  label: string;
  price: string;
  priceNote: string;
  tagline: string;
  icon: React.ReactNode;
  recommended: boolean;
  accentClass: string;
  glowClass: string;
  badgeClass: string;
  features: string[];
}

const PLANS: Plan[] = [
  {
    tier: "Free",
    label: "Free",
    price: "$0",
    priceNote: "forever",
    tagline: "Get started with AI-powered creation",
    icon: <Zap className="w-5 h-5" />,
    recommended: false,
    accentClass: "border-border",
    glowClass: "",
    badgeClass: "bg-muted text-muted-foreground",
    features: [
      "20 AI generations / month",
      "Basic dashboard",
      "Up to 50 content items",
      "Basic Pomodoro timer",
      "Community support",
    ],
  },
  {
    tier: "Pro",
    label: "Pro",
    price: "$19",
    priceNote: "/ month",
    tagline: "Unlock unlimited creation for serious creators",
    icon: <Sparkles className="w-5 h-5" />,
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
      "Priority support",
    ],
  },
  {
    tier: "Elite",
    label: "Elite",
    price: "$49",
    priceNote: "/ month",
    tagline: "Maximum power for scaling creators",
    icon: <Star className="w-5 h-5" />,
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
      "Dedicated account manager",
    ],
  },
];

// ─── Comparison table data ────────────────────────────────────────────────────

type CellValue = boolean | string;

interface ComparisonRow {
  feature: string;
  free: CellValue;
  pro: CellValue;
  elite: CellValue;
}

const COMPARISON: ComparisonRow[] = [
  {
    feature: "AI Content Generation",
    free: "20 / month",
    pro: "Unlimited",
    elite: "Unlimited",
  },
  {
    feature: "Content Planner Items",
    free: "50 items",
    pro: "Unlimited",
    elite: "Unlimited",
  },
  { feature: "Generation History", free: false, pro: true, elite: true },
  { feature: "Full Analytics Dashboard", free: false, pro: true, elite: true },
  {
    feature: "Pomodoro & Focus Timer",
    free: "Basic",
    pro: "Advanced",
    elite: "Advanced",
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
    elite: "Round 2",
  },
  {
    feature: "Support",
    free: "Community",
    pro: "Priority",
    elite: "Dedicated",
  },
];

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "Can I cancel or change my plan at any time?",
    a: "Yes. You can upgrade, downgrade, or cancel your subscription at any time from the billing portal. Changes take effect at the start of the next billing cycle. There are no cancellation fees.",
  },
  {
    q: "What happens to my data if I downgrade to Free?",
    a: "Your data is always safe. If you downgrade, you keep all existing content items and generations, but new creations will be limited to the Free tier quota. You can upgrade again at any time to restore full access.",
  },
  {
    q: "Is there a free trial for Pro or Elite?",
    a: "The Free tier gives you a genuine taste of CreatorOS with no credit card required. We don't offer time-limited trials — you can explore the platform at your own pace and upgrade when you're ready.",
  },
];

// ─── Cell renderer ────────────────────────────────────────────────────────────

function ComparisonCell({ value }: { value: CellValue }) {
  if (value === true) return <Check className="w-4 h-4 text-primary mx-auto" />;
  if (value === false)
    return <X className="w-4 h-4 text-muted-foreground mx-auto opacity-40" />;
  return (
    <span className="text-xs font-medium text-foreground/80">{value}</span>
  );
}

// ─── FAQ accordion item ───────────────────────────────────────────────────────

function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="glass rounded-xl overflow-hidden"
      data-ocid={`faq.item.${index + 1}`}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-white/5 transition-smooth"
        aria-expanded={open}
        data-ocid={`faq.toggle.${index + 1}`}
      >
        <span className="font-display font-semibold text-sm text-foreground">
          {q}
        </span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Subscriptions() {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { actor } = useActor(createActor);
  const [upgrading, setUpgrading] = useState<SubscriptionTier | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Success banner from Stripe redirect
  const params = new URLSearchParams(window.location.search);
  const isSuccess = params.get("success") === "true";

  const currentTier: SubscriptionTier = profile?.tier ?? "Free";

  async function handleUpgrade(tier: SubscriptionTier) {
    if (!actor) return;
    setUpgrading(tier);
    setError(null);
    try {
      const raw = await (actor as any).createCheckoutSession(tier);
      const result = unwrapResult(
        raw as { ok: { url: string } } | { err: string },
      );
      window.location.href = result.url;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create checkout session. Please try again.",
      );
      setUpgrading(null);
    }
  }

  async function handleManageBilling() {
    if (!actor) return;
    setError(null);
    try {
      const raw = await (actor as any).getStripePortalUrl();
      const result = unwrapResult(
        raw as { ok: { url: string } } | { err: string },
      );
      window.open(result.url, "_blank");
    } catch {
      setError("Could not open billing portal. Please try again.");
    }
  }

  return (
    <div className="min-h-full bg-background">
      {/* Success Banner */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="sticky top-0 z-50 bg-primary/20 border-b border-primary/30 backdrop-blur-md"
            data-ocid="subscriptions.success_state"
          >
            <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-3">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <p className="text-sm font-medium text-foreground">
                Subscription activated! Enjoy your{" "}
                <span className="text-primary font-semibold">
                  {currentTier}
                </span>{" "}
                features.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-3"
          data-ocid="subscriptions.page"
        >
          <p className="text-xs font-mono uppercase tracking-widest text-primary">
            Pricing
          </p>
          <h1 className="font-display text-4xl font-bold text-foreground">
            Run your creator business{" "}
            <span className="text-gradient">without limits</span>
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Choose the plan that fits your ambition. Upgrade or cancel anytime.
          </p>
        </motion.div>

        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="glass border border-destructive/40 rounded-xl px-5 py-3 flex items-center gap-3"
              data-ocid="subscriptions.error_state"
            >
              <X className="w-4 h-4 text-destructive shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
              <button
                type="button"
                onClick={() => setError(null)}
                className="ml-auto text-muted-foreground hover:text-foreground transition-smooth"
                aria-label="Dismiss error"
                data-ocid="subscriptions.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Plan cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          data-ocid="subscriptions.list"
        >
          {PLANS.map((plan, i) => {
            const isCurrent = plan.tier === currentTier;
            const isDowngrade =
              plan.tier === "Free" &&
              (currentTier === "Pro" || currentTier === "Elite");
            const isLoadingPlan = upgrading === plan.tier;

            return (
              <motion.div
                key={plan.tier}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.12,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                data-ocid={`subscriptions.item.${i + 1}`}
                className={[
                  "relative flex flex-col glass rounded-2xl p-6 border-2 transition-smooth",
                  plan.accentClass,
                  plan.glowClass,
                  isCurrent ? "ring-2 ring-primary/40" : "",
                ].join(" ")}
              >
                {/* Recommended badge */}
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground text-xs font-bold font-mono px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-primary/30">
                      Recommended
                    </span>
                  </div>
                )}

                {/* Current plan badge */}
                {isCurrent && (
                  <div className="absolute top-4 right-4">
                    <Badge
                      className={`text-xs font-bold ${plan.badgeClass}`}
                      data-ocid={`subscriptions.current_badge.${i + 1}`}
                    >
                      Current Plan
                    </Badge>
                  </div>
                )}

                {/* Icon + label */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`p-2 rounded-lg ${
                      plan.tier === "Pro"
                        ? "bg-primary/15 text-primary"
                        : plan.tier === "Elite"
                          ? "bg-secondary/15 text-secondary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {plan.icon}
                  </span>
                  <span className="font-display text-lg font-bold text-foreground">
                    {plan.label}
                  </span>
                </div>

                {/* Price */}
                <div className="mb-1">
                  <span className="font-display text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm ml-1">
                    {plan.priceNote}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs mb-6 min-h-[2.5rem] leading-relaxed">
                  {plan.tagline}
                </p>

                <Separator className="mb-5 bg-border/50" />

                {/* Features */}
                <ul className="space-y-2.5 flex-1 mb-7">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          plan.tier === "Pro"
                            ? "text-primary"
                            : plan.tier === "Elite"
                              ? "text-secondary"
                              : "text-muted-foreground"
                        }`}
                      />
                      <span className="text-sm text-foreground/80 leading-snug">
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {profileLoading ? (
                  <div className="h-10 rounded-lg bg-muted animate-pulse" />
                ) : isCurrent ? (
                  <Button
                    variant="outline"
                    disabled
                    className="w-full"
                    data-ocid={`subscriptions.current_plan_button.${i + 1}`}
                  >
                    Current Plan
                  </Button>
                ) : isDowngrade ? (
                  <Button
                    variant="ghost"
                    onClick={handleManageBilling}
                    className="w-full flex items-center gap-2 hover:bg-muted"
                    data-ocid={`subscriptions.manage_billing_button.${i + 1}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Manage Billing
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleUpgrade(plan.tier)}
                    disabled={isLoadingPlan || !!upgrading}
                    className={`w-full font-semibold ${
                      plan.tier === "Elite"
                        ? "bg-secondary/90 hover:bg-secondary text-secondary-foreground"
                        : ""
                    }`}
                    variant={plan.tier === "Pro" ? "default" : "outline"}
                    data-ocid={`subscriptions.upgrade_button.${i + 1}`}
                  >
                    {isLoadingPlan ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Opening Checkout…
                      </>
                    ) : (
                      `Upgrade to ${plan.label}`
                    )}
                  </Button>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Billing management row */}
        {(currentTier === "Pro" || currentTier === "Elite") && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center"
          >
            <button
              type="button"
              onClick={handleManageBilling}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-smooth underline underline-offset-4"
              data-ocid="subscriptions.manage_billing_button"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Manage billing &amp; invoices
            </button>
          </motion.div>
        )}

        {/* Feature comparison table */}
        <section data-ocid="subscriptions.section">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl font-bold text-foreground mb-6 text-center"
          >
            Full feature comparison
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl overflow-hidden"
          >
            {/* Table header */}
            <div className="grid grid-cols-4 border-b border-border/50 bg-muted/20">
              <div className="px-5 py-3 text-xs font-mono uppercase tracking-wider text-muted-foreground">
                Feature
              </div>
              {PLANS.map((p) => (
                <div key={p.tier} className="px-4 py-3 text-center">
                  <span
                    className={`text-xs font-bold font-mono uppercase tracking-wider ${
                      p.tier === "Pro"
                        ? "text-primary"
                        : p.tier === "Elite"
                          ? "text-secondary"
                          : "text-muted-foreground"
                    }`}
                  >
                    {p.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Rows */}
            {COMPARISON.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-4 border-b border-border/30 last:border-0 ${
                  i % 2 === 0 ? "" : "bg-muted/10"
                }`}
              >
                <div className="px-5 py-3.5 text-sm text-foreground/90">
                  {row.feature}
                </div>
                <div className="px-4 py-3.5 flex items-center justify-center">
                  <ComparisonCell value={row.free} />
                </div>
                <div className="px-4 py-3.5 flex items-center justify-center">
                  <ComparisonCell value={row.pro} />
                </div>
                <div className="px-4 py-3.5 flex items-center justify-center">
                  <ComparisonCell value={row.elite} />
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* FAQ */}
        <section data-ocid="subscriptions.faq_section">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl font-bold text-foreground mb-6 text-center"
          >
            Billing FAQ
          </motion.h2>
          <div className="space-y-3 max-w-2xl mx-auto">
            {FAQS.map((faq, i) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-4 pb-8"
        >
          <p className="text-muted-foreground text-sm">
            Questions? Reach out to{" "}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline underline-offset-4 transition-smooth"
              data-ocid="subscriptions.support_link"
            >
              Caffeine support
            </a>{" "}
            — we&apos;re here to help.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
