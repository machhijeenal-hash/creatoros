import { useDashboardMetrics, useUserProfile } from "@/hooks/useBackend";
import type { AIGeneration, ContentItem } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  LayoutDashboard,
  Plus,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatBigint(val: bigint | undefined | null): number {
  if (val == null) return 0;
  return Number(val);
}

function timeAgo(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function StatCardSkeleton() {
  return (
    <div className="glass rounded-2xl p-5 animate-pulse">
      <div className="h-3.5 bg-muted rounded w-1/2 mb-4" />
      <div className="h-8 bg-muted rounded w-1/3 mb-2" />
      <div className="h-3 bg-muted rounded w-2/3" />
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  icon: React.ReactNode;
  description: string;
  accentColor: string;
  index: number;
}

function StatCard({
  label,
  value,
  suffix = "",
  icon,
  description,
  accentColor,
  index,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.07,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="glass glass-hover rounded-2xl p-5 relative overflow-hidden group cursor-default"
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at top left, ${accentColor}15, transparent 60%)`,
        }}
      />
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${accentColor}20` }}
        >
          <span style={{ color: accentColor }}>{icon}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-3xl font-display font-bold text-foreground">
          {value}
        </span>
        {suffix && (
          <span className="text-sm font-medium text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </motion.div>
  );
}

// ─── Generation Item ──────────────────────────────────────────────────────────

function GenerationItem({ gen, index }: { gen: AIGeneration; index: number }) {
  const preview =
    gen.outputText.slice(0, 90) + (gen.outputText.length > 90 ? "…" : "");
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: 0.1 + index * 0.06 }}
      data-ocid={`dashboard.generation.item.${index + 1}`}
      className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-smooth group"
    >
      <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground line-clamp-2 leading-snug">
          {preview}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">{gen.platform}</span>
          <span className="text-xs text-muted-foreground/50">·</span>
          <span className="text-xs text-muted-foreground">
            {timeAgo(gen.createdAt)}
          </span>
          {gen.favorite && (
            <span className="text-xs text-yellow-400/80 ml-auto">★</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Task Completion Widget ────────────────────────────────────────────────────

function TaskCompletionWidget({
  rate,
  index,
}: { rate: number; index: number }) {
  const pct = Math.min(100, Math.max(0, Math.round(rate * 100)));
  const color = pct >= 80 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#0084ff";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 + index * 0.08 }}
      className="glass glass-hover rounded-2xl p-5 h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Task Completion
          </span>
        </div>
        <span className="text-2xl font-display font-bold" style={{ color }}>
          {pct}%
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        {pct === 0
          ? "No tasks completed yet — add tasks in Productivity"
          : pct >= 80
            ? "Excellent consistency!"
            : pct >= 50
              ? "Good progress — keep going!"
              : "Room to grow — complete more tasks today"}
      </p>
    </motion.div>
  );
}

// ─── Next Content Card ────────────────────────────────────────────────────────

function NextContentCard({ item }: { item: ContentItem }) {
  const statusColor: Record<string, string> = {
    Idea: "#6366f1",
    Scripting: "#0084ff",
    Editing: "#f59e0b",
    Scheduled: "#22c55e",
    Posted: "#a855f7",
  };
  const color = statusColor[item.status] ?? "#0084ff";
  return (
    <div className="flex items-start gap-3">
      <div
        className="w-2 h-2 rounded-full mt-2 shrink-0"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {item.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className="text-xs px-1.5 py-0.5 rounded font-medium"
            style={{ background: `${color}20`, color }}
          >
            {item.status}
          </span>
          <span className="text-xs text-muted-foreground">{item.platform}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Activity Chart ───────────────────────────────────────────────────────────

interface ChartDataPoint {
  day: string;
  content: number;
  focus: number;
}

function ActivityChart({
  weeklyContent,
  focusHours,
  isEmpty,
}: {
  weeklyContent: number;
  focusHours: number;
  isEmpty: boolean;
}) {
  const data: ChartDataPoint[] = useMemo(() => {
    if (isEmpty) return [];
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const todayIdx = (new Date().getDay() + 6) % 7;
    const daysElapsed = todayIdx + 1;
    const perDayContent = daysElapsed > 0 ? weeklyContent / daysElapsed : 0;
    const perDayFocus = daysElapsed > 0 ? focusHours / daysElapsed : 0;
    return days.map((day, i) => ({
      day,
      content: i <= todayIdx ? Math.round(perDayContent) : 0,
      focus: i <= todayIdx ? Math.round(perDayFocus * 10) / 10 : 0,
    }));
  }, [weeklyContent, focusHours, isEmpty]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.3 }}
      data-ocid="dashboard.activity_chart"
      className="glass glass-hover rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            Weekly Activity
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Content</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-secondary" />
            <span className="text-xs text-muted-foreground">Focus hrs</span>
          </div>
        </div>
      </div>

      {isEmpty ? (
        <div className="h-40 flex flex-col items-center justify-center gap-2">
          <TrendingUp className="w-8 h-8 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground text-center">
            Add content &amp; log focus sessions to see trends
          </p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradContent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#818cf8" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradFocus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(20,20,30,0.95)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px",
                fontSize: "12px",
                color: "#f0f0f0",
              }}
            />
            <Area
              type="monotone"
              dataKey="content"
              stroke="#818cf8"
              strokeWidth={2}
              fill="url(#gradContent)"
              name="Content"
            />
            <Area
              type="monotone"
              dataKey="focus"
              stroke="#a78bfa"
              strokeWidth={2}
              fill="url(#gradFocus)"
              name="Focus (hrs)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}

// ─── Welcome Onboarding ───────────────────────────────────────────────────────

function WelcomeOnboarding() {
  const steps = [
    {
      icon: Brain,
      label: "Generate your first idea",
      to: "/ai-studio" as const,
      ocid: "dashboard.welcome.step1",
    },
    {
      icon: Calendar,
      label: "Add content to planner",
      to: "/content-planner" as const,
      ocid: "dashboard.welcome.step2",
    },
    {
      icon: Clock,
      label: "Log a focus session",
      to: "/productivity" as const,
      ocid: "dashboard.welcome.step3",
    },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      data-ocid="dashboard.welcome_card"
      className="col-span-full rounded-2xl relative overflow-hidden border"
      style={{
        background:
          "linear-gradient(135deg, rgba(30,30,45,0.95) 0%, rgba(20,20,30,0.8) 100%)",
        borderColor: "rgba(129,140,248,0.3)",
        boxShadow:
          "0 0 60px rgba(129,140,248,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(129,140,248,0.12), transparent 60%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(167,139,250,0.10), transparent 60%)",
        }}
      />

      <div className="relative z-10 p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(129,140,248,0.25), rgba(167,139,250,0.15))",
            border: "1px solid rgba(129,140,248,0.4)",
          }}
        >
          <LayoutDashboard className="w-6 h-6 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-display font-bold text-foreground mb-1">
            Welcome to CreatorOS! 🚀
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl leading-relaxed">
            Your AI-powered creator operating system is ready. Start by
            generating your first content idea, or plan your content calendar —
            your metrics will populate automatically as you create.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            to="/ai-studio"
            data-ocid="dashboard.welcome.ai_studio_button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-smooth text-white"
            style={{
              background: "linear-gradient(135deg, #818cf8, #a78bfa)",
              boxShadow: "0 0 20px rgba(129,140,248,0.35)",
            }}
          >
            <Sparkles className="w-4 h-4" />
            Open AI Studio
          </Link>
          <Link
            to="/content-planner"
            data-ocid="dashboard.welcome.planner_button"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-smooth text-foreground/80 hover:text-foreground border border-border/60 hover:border-border bg-muted/30 hover:bg-muted/50"
          >
            <Calendar className="w-4 h-4" />
            Plan Content
          </Link>
        </div>
      </div>

      <div className="relative z-10 px-8 pb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {steps.map(({ icon: Icon, label, to, ocid }) => (
          <Link
            key={ocid}
            to={to}
            data-ocid={ocid}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 hover:bg-muted/40 border border-border/30 hover:border-border/60 transition-smooth group"
          >
            <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-smooth">
              {label}
            </span>
            <ArrowRight className="w-3 h-3 text-muted-foreground/40 ml-auto group-hover:text-primary transition-smooth" />
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Dashboard Page ────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { data: metrics, isLoading } = useDashboardMetrics();
  const { data: userProfile } = useUserProfile();

  const displayName = userProfile?.displayName || "Creator";
  const greeting = getGreeting();

  const streak = formatBigint(metrics?.contentStreak);
  const productivityScore = formatBigint(metrics?.productivityScore);
  const weeklyContent = formatBigint(metrics?.weeklyContentCount);
  const focusHours = metrics?.focusHoursThisWeek ?? 0;
  const taskRate = metrics?.taskCompletionRate ?? 0;
  const recentGens = metrics?.recentGenerations?.slice(0, 5) ?? [];
  const nextContent: ContentItem | null = metrics?.nextScheduledContent ?? null;

  const isFirstLaunch =
    !isLoading &&
    streak === 0 &&
    productivityScore === 0 &&
    weeklyContent === 0 &&
    focusHours === 0 &&
    recentGens.length === 0;

  const chartIsEmpty = weeklyContent === 0 && focusHours === 0;

  const statCards = [
    {
      label: "Content Streak",
      value: streak,
      suffix: streak === 1 ? "day" : "days",
      icon: <Flame className="w-4 h-4" />,
      description:
        streak === 0
          ? "Create content to start your streak"
          : `${streak}-day streak — keep it up!`,
      accentColor: "#f97316",
    },
    {
      label: "Productivity Score",
      value: productivityScore,
      suffix: "/100",
      icon: <Target className="w-4 h-4" />,
      description:
        productivityScore === 0
          ? "Complete tasks & sessions to earn score"
          : productivityScore >= 80
            ? "Elite level"
            : productivityScore >= 50
              ? "Building momentum"
              : "Getting started",
      accentColor: "#0084ff",
    },
    {
      label: "Focus Hours",
      value: Math.round(focusHours * 10) / 10,
      suffix: "hrs",
      icon: <Clock className="w-4 h-4" />,
      description:
        focusHours === 0
          ? "Start a focus session in Productivity"
          : "This week",
      accentColor: "#7c3aed",
    },
    {
      label: "Content This Week",
      value: weeklyContent,
      suffix: weeklyContent === 1 ? "piece" : "pieces",
      icon: <BookOpen className="w-4 h-4" />,
      description:
        weeklyContent === 0
          ? "Plan or post content to track here"
          : "Items created or scheduled",
      accentColor: "#22c55e",
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto" data-ocid="dashboard.page">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">
          {greeting}, <span className="text-gradient">{displayName}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isFirstLaunch
            ? "Your creator workspace is ready — let's build something great."
            : "Here's a snapshot of your creator journey today."}
        </p>
      </motion.div>

      {/* Stat Cards */}
      {isLoading ? (
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          data-ocid="dashboard.stats_grid.loading_state"
        >
          {[0, 1, 2, 3].map((i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          data-ocid="dashboard.stats_grid"
        >
          {statCards.map((card, i) => (
            <StatCard key={card.label} {...card} index={i} />
          ))}
        </div>
      )}

      {/* Welcome onboarding on first launch */}
      {isFirstLaunch && (
        <div className="grid grid-cols-1 gap-4 mb-6">
          <WelcomeOnboarding />
        </div>
      )}

      {/* Activity + Task completion row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ActivityChart
            weeklyContent={weeklyContent}
            focusHours={focusHours}
            isEmpty={chartIsEmpty}
          />
        </div>
        <div>
          {isLoading ? (
            <div
              className="glass rounded-2xl p-5 animate-pulse"
              data-ocid="dashboard.task_completion.loading_state"
            >
              <div className="h-4 bg-muted rounded w-1/2 mb-4" />
              <div className="h-2 bg-muted rounded mb-2" />
              <div className="h-3 bg-muted rounded w-3/4" />
            </div>
          ) : (
            <TaskCompletionWidget rate={taskRate} index={0} />
          )}
        </div>
      </div>

      {/* Recent Generations + Next Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Recent AI Generations */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="glass glass-hover rounded-2xl p-5"
          data-ocid="dashboard.recent_generations"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Recent Generations
              </span>
            </div>
            <Link
              to="/ai-studio"
              data-ocid="dashboard.recent_generations.view_all"
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-smooth"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {isLoading ? (
            <div
              className="space-y-3"
              data-ocid="dashboard.recent_generations.loading_state"
            >
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-7 h-7 rounded-lg bg-muted shrink-0" />
                  <div className="flex-1">
                    <div className="h-3 bg-muted rounded mb-1.5" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentGens.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-3 py-8"
              data-ocid="dashboard.recent_generations.empty_state"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary/60" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground/70">
                  No generations yet
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your AI-generated content will appear here
                </p>
              </div>
              <Link
                to="/ai-studio"
                data-ocid="dashboard.recent_generations.cta_button"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-primary border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-smooth"
              >
                <Plus className="w-3.5 h-3.5" />
                Start creating
              </Link>
            </div>
          ) : (
            <div className="space-y-1">
              {recentGens.map((gen, i) => (
                <GenerationItem key={Number(gen.id)} gen={gen} index={i} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Next Scheduled Content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.42 }}
          className="glass glass-hover rounded-2xl p-5"
          data-ocid="dashboard.next_content"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Up Next
              </span>
            </div>
            <Link
              to="/content-planner"
              data-ocid="dashboard.next_content.view_all"
              className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-smooth"
            >
              Planner <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {isLoading ? (
            <div
              className="animate-pulse"
              data-ocid="dashboard.next_content.loading_state"
            >
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ) : nextContent == null ? (
            <div
              className="flex flex-col items-center justify-center gap-3 py-8"
              data-ocid="dashboard.next_content.empty_state"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary/60" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-foreground/70">
                  Nothing scheduled
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Plan your next piece of content
                </p>
              </div>
              <Link
                to="/content-planner"
                data-ocid="dashboard.next_content.cta_button"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-primary border border-primary/30 bg-primary/10 hover:bg-primary/20 transition-smooth"
              >
                <Plus className="w-3.5 h-3.5" />
                Plan content
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <NextContentCard item={nextContent} />
              <div className="border-t border-border/40 pt-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-primary/60" />
                  <span className="text-xs text-muted-foreground">
                    Keep your pipeline moving — what comes after this?
                  </span>
                </div>
              </div>
              <Link
                to="/content-planner"
                data-ocid="dashboard.next_content.add_more_button"
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground border border-border/40 hover:border-border/80 bg-muted/20 hover:bg-muted/40 transition-smooth"
              >
                <Plus className="w-3.5 h-3.5" />
                Add more content
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
