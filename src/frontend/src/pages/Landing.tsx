import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Flame,
  Menu,
  Play,
  Sparkles,
  Star,
  Target,
  Timer,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

// ─── Fade-up animation variant ──────────────────────────────────────────────
const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: EASE_OUT },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

// ─── Static data arrays with stable IDs ──────────────────────────────────────
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  id: `particle-${i}`,
  left: `${8 + ((i * 6.1) % 86)}%`,
  top: `${10 + ((i * 7.3) % 75)}%`,
  color: i % 2 === 0 ? "#0084ff" : "#7c3aed",
  duration: 3 + (i % 4),
  delay: i * 0.22,
}));

const AVATAR_COLORS = [
  { id: "avatar-blue", color: "#0084ff" },
  { id: "avatar-purple", color: "#7c3aed" },
  { id: "avatar-cyan", color: "#06b6d4" },
  { id: "avatar-green", color: "#10b981" },
];

const HERO_STARS = Array.from({ length: 5 }, (_, i) => ({
  id: `hero-star-${i}`,
}));

const TERMINAL_LINES = [
  { id: "tl-0", text: "Analyzing your niche: Tech & Productivity..." },
  { id: "tl-1", text: "Identifying viral patterns in top 1% content..." },
  { id: "tl-2", text: "Generating hook variations with emotional triggers..." },
  { id: "tl-3", text: "" },
  {
    id: "tl-4",
    text: '\u2726 Hook 1: "I grew from 0 to 50k in 90 days using one system"',
  },
  {
    id: "tl-5",
    text: '\u2726 Hook 2: "Most creators fail because they skip this step"',
  },
  {
    id: "tl-6",
    text: '\u2726 Hook 3: "The algorithm rewards creators who do this daily"',
  },
];

const CHART_BARS = [
  { month: "Jan", height: 42, highlight: false, delay: 0 * 0.05 },
  { month: "Feb", height: 65, highlight: false, delay: 1 * 0.05 },
  { month: "Mar", height: 38, highlight: false, delay: 2 * 0.05 },
  { month: "Apr", height: 80, highlight: false, delay: 3 * 0.05 },
  { month: "May", height: 55, highlight: false, delay: 4 * 0.05 },
  { month: "Jun", height: 90, highlight: false, delay: 5 * 0.05 },
  { month: "Jul", height: 72, highlight: false, delay: 6 * 0.05 },
  { month: "Aug", height: 85, highlight: false, delay: 7 * 0.05 },
  { month: "Sep", height: 60, highlight: true, delay: 8 * 0.05 },
  { month: "Oct", height: 95, highlight: true, delay: 9 * 0.05 },
  { month: "Nov", height: 70, highlight: true, delay: 10 * 0.05 },
  { month: "Dec", height: 88, highlight: true, delay: 11 * 0.05 },
];

const REVIEW_STARS = Array.from({ length: 5 }, (_, i) => ({
  id: `review-star-${i}`,
}));

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for navbar background — in useEffect to prevent memory leak
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Workflow", href: "#workflow" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE_OUT }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-white/10" : ""
      }`}
      style={{
        background: scrolled ? "oklch(0.145 0 0 / 0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
      }}
      data-ocid="nav.panel"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #0084ff, #7c3aed)" }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            CreatorOS
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-8"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScroll(e, link.href)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm" data-ocid="nav.login_button">
              Log in
            </Button>
          </Link>
          <Link to="/login">
            <Button
              size="sm"
              className="font-medium"
              style={{
                background: "linear-gradient(135deg, #0084ff, #7c3aed)",
              }}
              data-ocid="nav.signup_button"
            >
              Start Free
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          data-ocid="nav.mobile_menu_toggle"
          type="button"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/10"
            style={{
              background: "oklch(0.145 0 0 / 0.95)",
              backdropFilter: "blur(20px)",
            }}
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="text-muted-foreground hover:text-foreground transition-colors py-1"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    data-ocid="nav.mobile_login_button"
                  >
                    Log in
                  </Button>
                </Link>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button
                    className="w-full"
                    style={{
                      background: "linear-gradient(135deg, #0084ff, #7c3aed)",
                    }}
                    data-ocid="nav.mobile_signup_button"
                  >
                    Start Free
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#0a0a0a" }}
      data-ocid="hero.section"
    >
      {/* Ambient glow orbs */}
      <div
        className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[120px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, #0084ff22 0%, #7c3aed11 50%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-[20%] left-[5%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: "#0084ff0d" }}
      />
      <div
        className="absolute top-[30%] right-[5%] w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none"
        style={{ background: "#7c3aed0d" }}
      />

      {/* Floating particle dots */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 rounded-full"
          style={{
            left: p.left,
            top: p.top,
            background: p.color,
            opacity: 0.4,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative z-10 max-w-5xl mx-auto px-6 pt-28 pb-16 text-center">
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="inline-flex mb-8"
        >
          <Badge
            className="px-4 py-1.5 text-sm font-medium border"
            style={{
              background: "oklch(0.56 0.22 262 / 0.15)",
              borderColor: "#0084ff44",
              color: "#60a5fa",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            AI-Powered Creator OS
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight text-foreground mb-6"
        >
          Run your creator <br className="hidden sm:block" />
          <span
            style={{
              background: "linear-gradient(135deg, #0084ff 0%, #7c3aed 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            business with AI.
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Generate viral content, automate workflows, track your productivity,
          and scale your creator business — all from one intelligent platform.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link to="/login">
            <Button
              size="lg"
              className="h-12 px-8 text-base font-semibold min-w-[160px]"
              style={{
                background: "linear-gradient(135deg, #0084ff, #7c3aed)",
              }}
              data-ocid="hero.start_free_button"
            >
              Start Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <button
            type="button"
            onClick={() =>
              document
                .querySelector("#workflow")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="inline-flex"
            data-ocid="hero.watch_demo_button"
          >
            <Button
              size="lg"
              variant="outline"
              className="h-12 px-8 text-base font-medium min-w-[160px] border-white/20 hover:border-white/40"
              tabIndex={-1}
            >
              <Play className="w-4 h-4 mr-2" />
              Watch Demo
            </Button>
          </button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {AVATAR_COLORS.map((ac) => (
                <div
                  key={ac.id}
                  className="w-7 h-7 rounded-full border-2"
                  style={{ background: ac.color, borderColor: "#0a0a0a" }}
                />
              ))}
            </div>
            <span>Join early creators</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground/40 hidden md:block" />
          <div className="flex items-center gap-1">
            {HERO_STARS.map((s) => (
              <Star
                key={s.id}
                className="w-3.5 h-3.5 fill-current"
                style={{ color: "#f59e0b" }}
              />
            ))}
            <span className="ml-1">Building fast</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground/40 hidden md:block" />
          <span>No credit card required</span>
        </motion.div>
      </div>

      {/* Dashboard preview image */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.5, ease: EASE_OUT }}
        className="relative z-10 w-full max-w-6xl mx-auto px-6"
        style={{ y: imgY }}
      >
        <div
          className="relative rounded-2xl overflow-hidden border border-white/10"
          style={{
            boxShadow:
              "0 40px 80px -20px #0084ff33, 0 40px 80px -20px #7c3aed22",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent, #0084ff88, #7c3aed88, transparent)",
            }}
          />
          <img
            src="/assets/generated/hero-dashboard-preview.dim_1400x900.jpg"
            alt="CreatorOS dashboard preview"
            className="w-full object-cover"
            style={{ maxHeight: "580px" }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-32"
            style={{
              background: "linear-gradient(to top, #0a0a0a, transparent)",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}

// ─── Feature Cards ────────────────────────────────────────────────────────────
const features = [
  {
    icon: Brain,
    title: "AI Studio",
    description:
      "Generate viral hooks, scripts, captions, and content ideas in seconds. Powered by GPT-4o with real-time streaming output.",
    color: "#0084ff",
  },
  {
    icon: Calendar,
    title: "Content Planner",
    description:
      "Drag-and-drop content calendar with full pipeline tracking. Move ideas from concept to published with zero friction.",
    color: "#7c3aed",
  },
  {
    icon: Timer,
    title: "Productivity System",
    description:
      "Deep work timer, habit streaks, daily goals, and focus analytics. Build the consistency that separates top creators.",
    color: "#06b6d4",
  },
];

function Features() {
  return (
    <section
      id="features"
      className="py-28 px-6"
      style={{ background: "#0a0a0a" }}
      data-ocid="features.section"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge
            className="mb-4 px-3 py-1 text-xs"
            style={{
              background: "#0084ff18",
              borderColor: "#0084ff33",
              color: "#60a5fa",
            }}
          >
            Core Features
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Everything a creator needs
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            One platform to generate, plan, and execute your content strategy —
            no context switching.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="glass glass-hover rounded-2xl p-8 group cursor-default relative overflow-hidden"
              data-ocid={`features.card.${i + 1}`}
            >
              <div
                className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `${feat.color}15` }}
              />
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{
                  background: `${feat.color}20`,
                  border: `1px solid ${feat.color}33`,
                }}
              >
                <feat.icon className="w-6 h-6" style={{ color: feat.color }} />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">
                {feat.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feat.description}
              </p>
              <div
                className="mt-6 flex items-center text-sm font-medium"
                style={{ color: feat.color }}
              >
                Learn more <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AI Workflow Visualization ────────────────────────────────────────────────
function AIWorkflow() {
  return (
    <section
      id="workflow"
      className="py-28 px-6 relative overflow-hidden"
      style={{ background: "#0d0d0f" }}
      data-ocid="workflow.section"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, #0084ff08 0%, transparent 60%)",
        }}
      />
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Badge
              className="mb-4 px-3 py-1 text-xs"
              style={{
                background: "#0084ff18",
                borderColor: "#0084ff33",
                color: "#60a5fa",
              }}
            >
              AI Studio
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              AI that writes like{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #0084ff, #7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                you think.
              </span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Feed it your niche, platform, and tone. Get viral hooks, full
              scripts, carousel frameworks, and captions — streamed in
              real-time, just like ChatGPT.
            </p>
            <ul className="space-y-3">
              {[
                "Real-time streaming output (word-by-word)",
                "Structured outputs for every content format",
                "Generation history & favorites system",
                "One-click copy, save, and regenerate",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <CheckCircle2
                    className="w-4 h-4 shrink-0"
                    style={{ color: "#0084ff" }}
                  />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/login" className="inline-block mt-8">
              <Button
                style={{
                  background: "linear-gradient(135deg, #0084ff, #7c3aed)",
                }}
                data-ocid="workflow.cta_button"
              >
                Try AI Studio Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>

          {/* AI terminal mockup */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            <div
              className="rounded-2xl border border-white/10 overflow-hidden"
              style={{
                background: "oklch(0.18 0 0)",
                boxShadow: "0 0 80px -20px #0084ff44",
              }}
            >
              <div
                className="flex items-center justify-between px-5 py-3 border-b border-white/10"
                style={{ background: "oklch(0.16 0 0)" }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: "#ff5f57" }}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: "#ffbd2e" }}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: "#28c840" }}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3" style={{ color: "#0084ff" }} />
                  AI Studio — Generating
                </div>
                <Badge
                  className="text-xs px-2 py-0.5"
                  style={{
                    background: "#0084ff20",
                    color: "#60a5fa",
                    borderColor: "transparent",
                  }}
                >
                  Streaming
                </Badge>
              </div>
              <div className="px-5 py-4 border-b border-white/10">
                <div className="text-xs text-muted-foreground mb-2">Prompt</div>
                <div
                  className="rounded-lg px-4 py-3 text-sm text-muted-foreground font-mono"
                  style={{
                    background: "oklch(0.14 0 0)",
                    border: "1px solid oklch(0.28 0 0)",
                  }}
                >
                  Generate 3 viral hook ideas for a productivity creator on
                  YouTube with 10k subscribers
                </div>
              </div>
              <div className="px-5 py-4 min-h-[200px]">
                <div className="text-xs text-muted-foreground mb-3">
                  Response
                </div>
                <div className="space-y-1.5 font-mono text-sm">
                  {TERMINAL_LINES.map((tl, i) => (
                    <motion.div
                      key={tl.id}
                      variants={fadeIn}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      custom={i}
                      className={tl.text === "" ? "h-2" : ""}
                      style={{
                        color: tl.text.startsWith("\u2726")
                          ? "#93c5fd"
                          : undefined,
                      }}
                    >
                      {tl.text}
                    </motion.div>
                  ))}
                  <motion.span
                    className="inline-block w-2 h-4 align-middle"
                    style={{ background: "#0084ff" }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                </div>
              </div>
              <div
                className="flex items-center gap-2 px-5 py-3 border-t border-white/10"
                style={{ background: "oklch(0.16 0 0)" }}
              >
                {["Copy", "Save", "Regenerate"].map((action) => (
                  <div
                    key={action}
                    className="px-3 py-1 rounded-md text-xs text-muted-foreground border border-white/10 hover:border-white/20 cursor-pointer transition-colors"
                  >
                    {action}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Productivity Showcase ────────────────────────────────────────────────────
function ProductivityShowcase() {
  const habits = [
    { name: "Daily script writing", streak: 21, color: "#0084ff" },
    { name: "Morning deep work", streak: 14, color: "#7c3aed" },
    { name: "Content planning", streak: 8, color: "#06b6d4" },
  ];

  return (
    <section
      className="py-28 px-6"
      style={{ background: "#0a0a0a" }}
      data-ocid="productivity.section"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            {/* Pomodoro timer card */}
            <div
              className="rounded-2xl p-6 border border-white/10"
              style={{ background: "oklch(0.18 0 0)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: "#0084ff20" }}
                  >
                    <Timer className="w-4 h-4" style={{ color: "#0084ff" }} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Deep Work Session
                    </div>
                    <div className="text-xs text-muted-foreground">
                      25:00 focus block
                    </div>
                  </div>
                </div>
                <Badge
                  className="text-xs"
                  style={{
                    background: "#10b98120",
                    color: "#34d399",
                    borderColor: "transparent",
                  }}
                >
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-center py-6">
                <div className="relative w-32 h-32">
                  <svg
                    className="w-32 h-32 -rotate-90"
                    viewBox="0 0 120 120"
                    role="img"
                    aria-label="Pomodoro timer progress"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="oklch(0.28 0 0)"
                      strokeWidth="6"
                    />
                    <motion.circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#0084ff"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="339.3"
                      strokeDashoffset="84.8"
                      initial={{ strokeDashoffset: 339.3 }}
                      whileInView={{ strokeDashoffset: 84.8 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 1.5,
                        delay: 0.3,
                        ease: "easeOut",
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-2xl font-bold text-foreground">
                      18:42
                    </span>
                    <span className="text-xs text-muted-foreground">
                      remaining
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Habit streaks */}
            <div
              className="rounded-2xl p-6 border border-white/10"
              style={{ background: "oklch(0.18 0 0)" }}
            >
              <div className="flex items-center gap-2 mb-5">
                <Flame className="w-4 h-4" style={{ color: "#f59e0b" }} />
                <span className="text-sm font-semibold text-foreground">
                  Active Streaks
                </span>
              </div>
              <div className="space-y-4">
                {habits.map((habit, i) => (
                  <motion.div
                    key={habit.name}
                    variants={fadeIn}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={i}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-muted-foreground">
                        {habit.name}
                      </span>
                      <span
                        className="text-xs font-semibold"
                        style={{ color: habit.color }}
                      >
                        {habit.streak} day streak \uD83D\uDD25
                      </span>
                    </div>
                    <div
                      className="w-full h-1.5 rounded-full"
                      style={{ background: "oklch(0.22 0 0)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: habit.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(habit.streak / 30) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1,
                          delay: 0.2 + i * 0.15,
                          ease: "easeOut",
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
          >
            <Badge
              className="mb-4 px-3 py-1 text-xs"
              style={{
                background: "#7c3aed18",
                borderColor: "#7c3aed33",
                color: "#a78bfa",
              }}
            >
              Productivity System
            </Badge>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Build habits that{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                compound.
              </span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              A real Pomodoro timer, streak systems, and daily goal tracking
              built for creators who want consistent output — not just
              motivation.
            </p>
            <ul className="space-y-3">
              {[
                "Wall-clock Pomodoro with session history",
                "Habit streaks with visual progress tracking",
                "Daily productivity score from actual activity",
                "Weekly focus hour trends and analytics",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <CheckCircle2
                    className="w-4 h-4 shrink-0"
                    style={{ color: "#7c3aed" }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Analytics Preview ────────────────────────────────────────────────────────
function AnalyticsPreview() {
  return (
    <section
      className="py-28 px-6 relative overflow-hidden"
      style={{ background: "#0d0d0f" }}
      data-ocid="analytics.section"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 80% 50%, #7c3aed08 0%, transparent 60%)",
        }}
      />
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge
            className="mb-4 px-3 py-1 text-xs"
            style={{
              background: "#7c3aed18",
              borderColor: "#7c3aed33",
              color: "#a78bfa",
            }}
          >
            Analytics
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Track what actually matters
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Real analytics from your actual creator activity — no vanity
            metrics, no fake numbers.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          className="rounded-2xl border border-white/10 overflow-hidden"
          style={{ background: "oklch(0.18 0 0)" }}
        >
          <div
            className="px-6 py-4 border-b border-white/10 flex items-center justify-between"
            style={{ background: "oklch(0.16 0 0)" }}
          >
            <div>
              <div className="text-sm font-semibold text-foreground">
                Content Velocity
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Pieces produced per month
              </div>
            </div>
            <Badge
              className="text-xs px-3 py-1"
              style={{
                background: "#f59e0b18",
                color: "#fbbf24",
                borderColor: "#f59e0b33",
              }}
            >
              \u26a0 Example data — yours will appear after activity
            </Badge>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                {
                  label: "Avg. monthly output",
                  value: "—",
                  sub: "No data yet",
                },
                { label: "Top month", value: "—", sub: "No data yet" },
                { label: "Consistency score", value: "—", sub: "No data yet" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-display font-bold text-muted-foreground">
                    {stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {stat.label}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#f59e0b" }}>
                    {stat.sub}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-end gap-2 h-40">
              {CHART_BARS.map((bar) => (
                <div
                  key={bar.month}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <motion.div
                    className="w-full rounded-t-sm"
                    style={{
                      background: bar.highlight
                        ? "linear-gradient(to top, #0084ff, #7c3aed)"
                        : "oklch(0.28 0 0)",
                      opacity: bar.highlight ? 0.4 : 0.3,
                    }}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${bar.height}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.8,
                      delay: bar.delay,
                      ease: "easeOut",
                    }}
                  />
                  <span
                    className="text-xs text-muted-foreground"
                    style={{ opacity: 0.4 }}
                  >
                    {bar.month}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="mt-4 text-center text-xs text-muted-foreground"
              style={{ opacity: 0.5 }}
            >
              Chart shows example structure — real data populates as you use
              CreatorOS
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Get started and explore the platform.",
    color: "#888",
    features: [
      "20 AI generations/month",
      "Basic content calendar",
      "3 habit trackers",
      "Dashboard overview",
      "Community access",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    description: "For creators who are serious about growth.",
    color: "#0084ff",
    features: [
      "Unlimited AI generations",
      "Advanced content planner",
      "Full analytics dashboard",
      "Unlimited habit tracking",
      "Full template vault",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    highlighted: true,
  },
  {
    name: "Elite",
    price: "$49",
    period: "/mo",
    description: "For power users scaling a creator business.",
    color: "#7c3aed",
    features: [
      "Everything in Pro",
      "Workflow automation engine",
      "Advanced AI analytics",
      "Team workspaces (coming soon)",
      "White-label exports",
      "Dedicated success manager",
    ],
    cta: "Go Elite",
    highlighted: false,
  },
];

function Pricing() {
  return (
    <section
      id="pricing"
      className="py-28 px-6"
      style={{ background: "#0a0a0a" }}
      data-ocid="pricing.section"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge
            className="mb-4 px-3 py-1 text-xs"
            style={{
              background: "#0084ff18",
              borderColor: "#0084ff33",
              color: "#60a5fa",
            }}
          >
            Pricing
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Start free forever. Upgrade when you're ready to scale.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="relative rounded-2xl p-8 border transition-all duration-300 hover:scale-[1.02]"
              style={{
                background: plan.highlighted
                  ? "oklch(0.18 0 0)"
                  : "oklch(0.16 0 0)",
                borderColor: plan.highlighted ? "#0084ff50" : "oklch(0.28 0 0)",
                boxShadow: plan.highlighted
                  ? "0 0 60px -20px #0084ff55"
                  : "none",
              }}
              data-ocid={`pricing.plan.${i + 1}`}
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-px left-0 right-0 h-px rounded-t-2xl"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, #0084ff, transparent)",
                  }}
                />
              )}
              {plan.highlighted && (
                <Badge
                  className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-xs"
                  style={{
                    background: "linear-gradient(135deg, #0084ff, #7c3aed)",
                    color: "white",
                    border: "none",
                  }}
                >
                  Most Popular
                </Badge>
              )}

              <div className="mb-6">
                <div
                  className="inline-block text-xs font-semibold px-2 py-1 rounded-md mb-3"
                  style={{ background: `${plan.color}20`, color: plan.color }}
                >
                  {plan.name}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground text-sm">
                    {plan.period}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground"
                  >
                    <CheckCircle2
                      className="w-4 h-4 shrink-0"
                      style={{ color: plan.color }}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to="/login">
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  style={
                    plan.highlighted
                      ? {
                          background:
                            "linear-gradient(135deg, #0084ff, #7c3aed)",
                        }
                      : { borderColor: "oklch(0.3 0 0)" }
                  }
                  data-ocid={`pricing.cta_button.${i + 1}`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const testimonials = [
  {
    name: "Maya Chen",
    role: "YouTube Creator \u00b7 180k subs",
    quote:
      "CreatorOS completely changed how I plan content. The AI hooks generator alone saved me 3 hours every week.",
    avatar: "M",
    color: "#0084ff",
  },
  {
    name: "Jordan Blake",
    role: "Newsletter Writer \u00b7 45k subscribers",
    quote:
      "The productivity system with streak tracking is genuinely addictive. I've been consistent for 31 days straight.",
    avatar: "J",
    color: "#7c3aed",
  },
  {
    name: "Priya Sharma",
    role: "TikTok & IG Creator \u00b7 500k",
    quote:
      "Finally a tool that understands creators. The content calendar with status tracking eliminated my posting anxiety.",
    avatar: "P",
    color: "#06b6d4",
  },
  {
    name: "Marcus Lee",
    role: "Podcast Host & Course Creator",
    quote:
      "The AI Studio is legitimately the best content brainstorming tool I've used. The streaming output feels like magic.",
    avatar: "M",
    color: "#10b981",
  },
];

function Testimonials() {
  return (
    <section
      className="py-28 px-6"
      style={{ background: "#0d0d0f" }}
      data-ocid="testimonials.section"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge
            className="mb-4 px-3 py-1 text-xs"
            style={{
              background: "#0084ff18",
              borderColor: "#0084ff33",
              color: "#60a5fa",
            }}
          >
            Creators love it
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Built for real creators
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Join thousands of creators who run their business on CreatorOS.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="glass glass-hover rounded-2xl p-6"
              data-ocid={`testimonials.card.${i + 1}`}
            >
              <div className="flex gap-0.5 mb-4">
                {REVIEW_STARS.map((s) => (
                  <Star
                    key={s.id}
                    className="w-3.5 h-3.5 fill-current"
                    style={{ color: "#f59e0b" }}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: t.color }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const faqs = [
  {
    q: "Is the AI actually powered by GPT-4o?",
    a: "Yes. CreatorOS uses OpenAI's GPT-4o model for all content generation, streamed in real-time so you see output as it's generated — just like ChatGPT.",
  },
  {
    q: "What makes the analytics different from social media insights?",
    a: "We track your internal creator activity — content produced, focus sessions completed, habits maintained, and workflow progress. This is about your input consistency, not vanity metrics.",
  },
  {
    q: "Is there a free plan forever?",
    a: "Yes. The Free plan gives you 20 AI generations/month and access to core features indefinitely. No credit card required to start.",
  },
  {
    q: "Can I cancel my subscription anytime?",
    a: "Absolutely. You can cancel, downgrade, or modify your subscription at any time from the billing portal. No lock-in, no penalties.",
  },
  {
    q: "What is the Content Planner?",
    a: "A full drag-and-drop content calendar where you can create content items, assign statuses (Idea \u2192 Scripting \u2192 Editing \u2192 Scheduled \u2192 Posted), attach notes, and track your pipeline.",
  },
  {
    q: "When are Team Workspaces available?",
    a: "Team Workspaces are on the Elite roadmap and coming in the next major update. Elite subscribers will get early access.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="py-28 px-6"
      style={{ background: "#0a0a0a" }}
      data-ocid="faq.section"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge
            className="mb-4 px-3 py-1 text-xs"
            style={{
              background: "#0084ff18",
              borderColor: "#0084ff33",
              color: "#60a5fa",
            }}
          >
            FAQ
          </Badge>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Common questions
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i * 0.5}
              className="rounded-xl border border-white/10 overflow-hidden"
              style={{ background: "oklch(0.16 0 0)" }}
              data-ocid={`faq.item.${i + 1}`}
            >
              <button
                type="button"
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                data-ocid={`faq.toggle.${i + 1}`}
              >
                <span className="text-sm font-semibold text-foreground pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className="w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200"
                  style={{
                    transform:
                      openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-white/10 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section
      className="py-28 px-6 relative overflow-hidden"
      style={{ background: "#0d0d0f" }}
      data-ocid="cta.section"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, #0084ff10 0%, #7c3aed08 40%, transparent 70%)",
        }}
      />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8"
            style={{ background: "linear-gradient(135deg, #0084ff, #7c3aed)" }}
          >
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Start building your{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #0084ff, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              creator OS
            </span>{" "}
            today.
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Free forever. No credit card required. Upgrade when you're ready.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login">
              <Button
                size="lg"
                className="h-12 px-10 text-base font-semibold"
                style={{
                  background: "linear-gradient(135deg, #0084ff, #7c3aed)",
                }}
                data-ocid="cta.start_free_button"
              >
                Start Free Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="h-12 px-10 text-base font-medium border-white/20 hover:border-white/40"
                data-ocid="cta.signin_button"
              >
                Sign in
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  const year = new Date().getFullYear();
  const footerLinks = [
    {
      group: "Product",
      links: ["Features", "Pricing", "Changelog", "Roadmap"],
    },
    {
      group: "Resources",
      links: ["Documentation", "Blog", "Templates", "Community"],
    },
    { group: "Company", links: ["About", "Careers", "Privacy", "Terms"] },
  ];

  return (
    <footer
      className="border-t border-white/10 px-6 pt-16 pb-8"
      style={{ background: "#0a0a0a" }}
      data-ocid="footer.section"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #0084ff, #7c3aed)",
                }}
              >
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-foreground">
                CreatorOS
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The AI-powered operating system for modern content creators.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: "#10b981" }}
              />
              <span className="text-xs text-muted-foreground">
                All systems operational
              </span>
            </div>
          </div>

          {footerLinks.map((col) => (
            <div key={col.group}>
              <div className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
                {col.group}
              </div>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 p-0"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            \u00a9 {year} CreatorOS. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
              style={{ color: "#60a5fa" }}
            >
              caffeine.ai
            </a>
          </p>
          <div className="flex items-center gap-4">
            {["Twitter", "LinkedIn", "GitHub"].map((social) => (
              <button
                key={social}
                type="button"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer bg-transparent border-0 p-0"
              >
                {social}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Landing Page (assembled) ─────────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      <Navbar />
      <Hero />
      <Features />
      <AIWorkflow />
      <ProductivityShowcase />
      <AnalyticsPreview />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}
