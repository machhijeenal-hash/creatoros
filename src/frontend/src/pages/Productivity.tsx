import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateDailyTask,
  useDailyTasks,
  useDeleteDailyTask,
  useLogProductivitySession,
  useProductivitySessions,
  useToggleDailyTask,
  useUserSettings,
} from "@/hooks/useBackend";
import type { ProductivitySession } from "@/types";
import {
  CheckCircle2,
  Circle,
  Clock,
  Coffee,
  Pause,
  Play,
  Plus,
  RotateCcw,
  SkipForward,
  Target,
  Trash2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ─── Default timer durations (overridden by user settings) ───────────────────
const DEFAULT_FOCUS_MINUTES = 25;
const DEFAULT_BREAK_MINUTES = 5;
const POMODOROS_BEFORE_LONG_BREAK = 4;

type TimerPhase = "Focus" | "Break";
type TimerState = "Idle" | "Running" | "Paused";

// ─── Audio beep using Web Audio API ──────────────────────────────────────────
function playBeep(frequency = 880, duration = 0.3) {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = frequency;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
    setTimeout(() => ctx.close(), (duration + 0.1) * 1000);
  } catch (_) {
    /* ignore */
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function getDayLabel(date: Date) {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
}

function getWeeklyChartData(sessions: ProductivitySession[]) {
  const today = new Date();
  const days: { label: string; hours: number; date: Date }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({ label: getDayLabel(d), hours: 0, date: d });
  }
  for (const s of sessions) {
    if (s.sessionType !== "Focus") continue;
    const ts = Number(s.completedAt);
    const sessionDate = new Date(ts > 1e15 ? ts / 1_000_000 : ts);
    for (const day of days) {
      if (
        sessionDate.getFullYear() === day.date.getFullYear() &&
        sessionDate.getMonth() === day.date.getMonth() &&
        sessionDate.getDate() === day.date.getDate()
      ) {
        day.hours += Number(s.durationMinutes) / 60;
      }
    }
  }
  return days.map((d) => ({ ...d, hours: Math.round(d.hours * 10) / 10 }));
}

function getTodayFocusSessions(sessions: ProductivitySession[]) {
  const today = new Date();
  return sessions.filter((s) => {
    if (s.sessionType !== "Focus") return false;
    const ts = Number(s.completedAt);
    const d = new Date(ts > 1e15 ? ts / 1_000_000 : ts);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  });
}

// ─── Circular Progress SVG ────────────────────────────────────────────────────
function CircularTimer({
  progress,
  phase,
  timeLeft,
  state,
}: {
  progress: number;
  phase: TimerPhase;
  timeLeft: number;
  state: TimerState;
}) {
  const SIZE = 280;
  const STROKE = 10;
  const R = (SIZE - STROKE * 2) / 2;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC * (1 - progress);

  const isFocus = phase === "Focus";
  const strokeColor = isFocus ? "oklch(0.56 0.22 262)" : "oklch(0.7 0.17 162)";
  const glowColor = isFocus ? "#0084ff" : "#34d399";

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: SIZE, height: SIZE }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${glowColor}18 0%, transparent 70%)`,
          filter:
            state === "Running"
              ? `drop-shadow(0 0 24px ${glowColor}40)`
              : "none",
          transition: "filter 0.6s ease",
        }}
      />
      <svg
        width={SIZE}
        height={SIZE}
        className="-rotate-90"
        role="img"
        aria-label="Timer progress"
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke="oklch(var(--border))"
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          fill="none"
          stroke={strokeColor}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 0.9s linear, stroke 0.4s ease",
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center gap-1">
        <span className="text-[56px] font-display font-bold text-foreground tabular-nums leading-none">
          {formatTime(timeLeft)}
        </span>
        <span
          className={`text-sm font-medium tracking-widest uppercase ${isFocus ? "text-primary" : "text-emerald-400"}`}
        >
          {phase}
        </span>
        {state === "Running" && (
          <motion.div
            className={`mt-1 w-2 h-2 rounded-full ${isFocus ? "bg-primary" : "bg-emerald-400"}`}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Number.POSITIVE_INFINITY }}
          />
        )}
      </div>
    </div>
  );
}

// ─── StatTile sub-component ───────────────────────────────────────────────────
function StatTile({
  icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl bg-card/40 border border-border/40">
      <div
        className={`w-7 h-7 rounded-lg ${bg} ${color} flex items-center justify-center`}
      >
        {icon}
      </div>
      <span className="text-lg font-display font-bold text-foreground leading-none">
        {value}
      </span>
      <span className="text-xs text-muted-foreground leading-tight">
        {label}
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Productivity() {
  // ── Timer state
  const [timerState, setTimerState] = useState<TimerState>("Idle");
  const [phase, setPhase] = useState<TimerPhase>("Focus");
  const [sessionCount, setSessionCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(() => DEFAULT_FOCUS_MINUTES * 60);
  const startTimestampRef = useRef<number | null>(null);
  const pausedSecondsRef = useRef<number>(DEFAULT_FOCUS_MINUTES * 60);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalDurationRef = useRef(DEFAULT_FOCUS_MINUTES * 60);
  // track phase ref to use in timer complete without stale closure
  const phaseRef = useRef<TimerPhase>("Focus");
  const sessionCountRef = useRef(0);

  // ── Backend hooks
  const { data: sessions = [], isLoading: sessionsLoading } =
    useProductivitySessions();
  const logSession = useLogProductivitySession();
  const { data: tasks = [], isLoading: tasksLoading } = useDailyTasks();
  const createTask = useCreateDailyTask();
  const toggleTask = useToggleDailyTask();
  const deleteTask = useDeleteDailyTask();
  const { data: userSettings } = useUserSettings();

  // ── Timer durations from settings (fall back to defaults)
  const FOCUS_DURATION =
    Number(userSettings?.focusDuration ?? DEFAULT_FOCUS_MINUTES) * 60;
  const BREAK_DURATION =
    Number(userSettings?.breakDuration ?? DEFAULT_BREAK_MINUTES) * 60;

  // keep refs in sync
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    sessionCountRef.current = sessionCount;
  }, [sessionCount]);

  // ── New task input
  const [taskInput, setTaskInput] = useState("");

  // ── Derived data
  const todayFocusSessions = getTodayFocusSessions(sessions);
  const chartData = getWeeklyChartData(sessions);
  const todayFocusMinutes = todayFocusSessions.reduce(
    (sum, s) => sum + Number(s.durationMinutes),
    0,
  );
  const progress = timeLeft / totalDurationRef.current;
  const displaySessionNum = (sessionCount % POMODOROS_BEFORE_LONG_BREAK) + 1;

  // ── Timer complete
  // biome-ignore lint/correctness/useExhaustiveDependencies: FOCUS_DURATION/BREAK_DURATION are stable derived constants
  const handleTimerComplete = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerState("Idle");
    playBeep(880, 0.25);
    setTimeout(() => playBeep(880, 0.25), 350);
    setTimeout(() => playBeep(1100, 0.4), 700);

    const durationMinutes = BigInt(Math.round(totalDurationRef.current / 60));
    logSession.mutate({ durationMinutes, sessionType: phaseRef.current });

    if (phaseRef.current === "Focus") {
      setSessionCount((prev) => prev + 1);
      totalDurationRef.current = BREAK_DURATION;
      pausedSecondsRef.current = BREAK_DURATION;
      setTimeLeft(BREAK_DURATION);
      setPhase("Break");
    } else {
      totalDurationRef.current = FOCUS_DURATION;
      pausedSecondsRef.current = FOCUS_DURATION;
      setTimeLeft(FOCUS_DURATION);
      setPhase("Focus");
    }
  }, [logSession]);

  // ── Tick
  const tick = useCallback(() => {
    if (startTimestampRef.current === null) return;
    const elapsed = Math.floor((Date.now() - startTimestampRef.current) / 1000);
    const remaining = pausedSecondsRef.current - elapsed;
    if (remaining <= 0) {
      handleTimerComplete();
    } else {
      setTimeLeft(remaining);
    }
  }, [handleTimerComplete]);

  useEffect(() => {
    if (timerState === "Running") {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState, tick]);

  // ── Controls
  function handleStart() {
    startTimestampRef.current = Date.now();
    setTimerState("Running");
  }

  function handlePause() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (startTimestampRef.current !== null) {
      const elapsed = Math.floor(
        (Date.now() - startTimestampRef.current) / 1000,
      );
      pausedSecondsRef.current = Math.max(
        0,
        pausedSecondsRef.current - elapsed,
      );
      startTimestampRef.current = null;
    }
    setTimerState("Paused");
  }

  function handleReset() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    startTimestampRef.current = null;
    const duration = phase === "Focus" ? FOCUS_DURATION : BREAK_DURATION;
    totalDurationRef.current = duration;
    pausedSecondsRef.current = duration;
    setTimeLeft(duration);
    setTimerState("Idle");
  }

  function handleSkip() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    startTimestampRef.current = null;
    setTimerState("Idle");
    if (phase === "Focus") {
      totalDurationRef.current = BREAK_DURATION;
      pausedSecondsRef.current = BREAK_DURATION;
      setTimeLeft(BREAK_DURATION);
      setPhase("Break");
    } else {
      totalDurationRef.current = FOCUS_DURATION;
      pausedSecondsRef.current = FOCUS_DURATION;
      setTimeLeft(FOCUS_DURATION);
      setPhase("Focus");
    }
  }

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = taskInput.trim();
    if (!trimmed) return;
    createTask.mutate(trimmed);
    setTaskInput("");
  }

  const recentSessions = [...sessions]
    .sort((a, b) => Number(b.completedAt) - Number(a.completedAt))
    .slice(0, 14);

  return (
    <div
      className="min-h-screen bg-background px-4 md:px-8 py-8"
      data-ocid="productivity.page"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <Target className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Productivity
          </h1>
        </div>
        <p className="text-sm text-muted-foreground ml-12">
          Deep work sessions, daily goals, and habit tracking.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left col: Pomodoro + Tasks */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Pomodoro Timer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-8"
            data-ocid="productivity.timer.card"
          >
            {/* Session progress indicator */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  Session
                </span>
                <div className="flex gap-1.5">
                  {Array.from(
                    { length: POMODOROS_BEFORE_LONG_BREAK },
                    (_, i) => `dot-${i}`,
                  ).map((dotId, i) => (
                    <motion.div
                      key={dotId}
                      className={`w-2.5 h-2.5 rounded-full transition-smooth ${
                        i < sessionCount % POMODOROS_BEFORE_LONG_BREAK
                          ? "bg-primary"
                          : i === sessionCount % POMODOROS_BEFORE_LONG_BREAK &&
                              phase === "Focus" &&
                              timerState !== "Idle"
                            ? "bg-primary/50"
                            : "bg-border"
                      }`}
                      animate={
                        i === sessionCount % POMODOROS_BEFORE_LONG_BREAK &&
                        timerState === "Running" &&
                        phase === "Focus"
                          ? { scale: [1, 1.3, 1] }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {displaySessionNum} of {POMODOROS_BEFORE_LONG_BREAK}
                </span>
              </div>
              <Badge
                variant="outline"
                className={`text-xs flex items-center gap-1 ${
                  phase === "Focus"
                    ? "border-primary/40 text-primary"
                    : "border-emerald-500/40 text-emerald-400"
                }`}
              >
                {phase === "Focus" ? (
                  <Zap className="w-3 h-3" />
                ) : (
                  <Coffee className="w-3 h-3" />
                )}
                {phase}
              </Badge>
            </div>

            {/* Circular timer */}
            <div className="flex justify-center mb-8">
              <CircularTimer
                progress={progress}
                phase={phase}
                timeLeft={timeLeft}
                state={timerState}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3">
              {timerState !== "Running" ? (
                <Button
                  type="button"
                  size="lg"
                  className="px-10 font-semibold glow-accent"
                  onClick={handleStart}
                  data-ocid="productivity.start_button"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {timerState === "Paused" ? "Resume" : "Start"}
                </Button>
              ) : (
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="px-10 font-semibold"
                  onClick={handlePause}
                  data-ocid="productivity.pause_button"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="w-11 h-11"
                onClick={handleReset}
                data-ocid="productivity.reset_button"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="w-11 h-11 text-muted-foreground"
                onClick={handleSkip}
                data-ocid="productivity.skip_button"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          {/* Daily Tasks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass rounded-2xl p-6"
            data-ocid="productivity.tasks.card"
          >
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <h2 className="font-display font-semibold text-foreground">
                Today's Tasks
              </h2>
              {tasks.length > 0 && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {tasks.filter((t) => t.completed).length}/{tasks.length}
                </Badge>
              )}
            </div>

            <form onSubmit={handleAddTask} className="flex gap-2 mb-4">
              <Input
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder="Add a task for today…"
                className="bg-card/50 border-border/60 text-sm"
                data-ocid="productivity.task.input"
              />
              <Button
                type="submit"
                variant="outline"
                size="icon"
                disabled={!taskInput.trim() || createTask.isPending}
                className="shrink-0"
                data-ocid="productivity.task.add_button"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </form>

            {tasksLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 rounded-lg" />
                ))}
              </div>
            ) : tasks.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
                data-ocid="productivity.tasks.empty_state"
              >
                <Target className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                <p className="text-sm text-muted-foreground">
                  No tasks yet. Add your first goal for today.
                </p>
              </motion.div>
            ) : (
              <AnimatePresence initial={false}>
                <div className="space-y-2">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={String(task.id)}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12, height: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.04 }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-card/40 border border-border/40 group"
                      data-ocid={`productivity.task.item.${index + 1}`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleTask.mutate(task.id)}
                        className="shrink-0 transition-smooth"
                        aria-label={
                          task.completed ? "Mark incomplete" : "Mark complete"
                        }
                        data-ocid={`productivity.task.checkbox.${index + 1}`}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-smooth" />
                        )}
                      </button>
                      <span
                        className={`flex-1 text-sm min-w-0 truncate ${
                          task.completed
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {task.title}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteTask.mutate(task.id)}
                        className="opacity-0 group-hover:opacity-100 transition-smooth text-muted-foreground hover:text-destructive"
                        aria-label="Delete task"
                        data-ocid={`productivity.task.delete_button.${index + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </motion.div>
        </div>

        {/* Right col: Stats + Chart + History */}
        <div className="flex flex-col gap-6">
          {/* Today's Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass rounded-2xl p-6"
            data-ocid="productivity.stats.card"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="font-display font-semibold text-foreground">
                Today's Progress
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatTile
                icon={<Zap className="w-4 h-4" />}
                label="Focus Sessions"
                value={String(todayFocusSessions.length)}
                color="text-primary"
                bg="bg-primary/10"
              />
              <StatTile
                icon={<Clock className="w-4 h-4" />}
                label="Focus Minutes"
                value={String(todayFocusMinutes)}
                color="text-emerald-400"
                bg="bg-emerald-400/10"
              />
              <StatTile
                icon={<Target className="w-4 h-4" />}
                label="Tasks Done"
                value={String(tasks.filter((t) => t.completed).length)}
                color="text-secondary"
                bg="bg-secondary/10"
              />
              <StatTile
                icon={<CheckCircle2 className="w-4 h-4" />}
                label="Total Tasks"
                value={String(tasks.length)}
                color="text-muted-foreground"
                bg="bg-muted"
              />
            </div>
          </motion.div>

          {/* Weekly Focus Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="glass rounded-2xl p-6"
            data-ocid="productivity.chart.card"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <h2 className="font-display font-semibold text-foreground">
                Weekly Focus
              </h2>
            </div>
            {sessionsLoading ? (
              <Skeleton className="h-36 rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={chartData} barCategoryGap="30%">
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "oklch(0.55 0 0)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.18 0 0)",
                      border: "1px solid oklch(0.28 0 0)",
                      borderRadius: 8,
                      color: "oklch(0.95 0 0)",
                      fontSize: 12,
                    }}
                    formatter={(val: number) => [`${val}h`, "Focus"]}
                  />
                  <Bar dataKey="hours" radius={[4, 4, 0, 0]} maxBarSize={28}>
                    {chartData.map((entry, i) => (
                      <Cell
                        key={entry.label}
                        fill={
                          i === chartData.length - 1
                            ? "oklch(0.56 0.22 262)"
                            : "oklch(0.28 0.04 262)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Session History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="glass rounded-2xl p-6"
            data-ocid="productivity.history.card"
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-display font-semibold text-foreground">
                Session History
              </h2>
            </div>
            {sessionsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-10 rounded-lg" />
                ))}
              </div>
            ) : recentSessions.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
                data-ocid="productivity.history.empty_state"
              >
                <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                <p className="text-sm text-muted-foreground">
                  No sessions today.
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Start your first Pomodoro to begin tracking.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {recentSessions.map((session, index) => {
                  const ts = Number(session.completedAt);
                  const date = new Date(ts > 1e15 ? ts / 1_000_000 : ts);
                  const timeStr = date.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const isFocus = session.sessionType === "Focus";
                  return (
                    <motion.div
                      key={String(session.id)}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg bg-card/30 border border-border/30"
                      data-ocid={`productivity.history.item.${index + 1}`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 ${isFocus ? "bg-primary" : "bg-emerald-400"}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">
                          {isFocus ? "Focus" : "Break"} —{" "}
                          {Number(session.durationMinutes)} min
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {timeStr}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] shrink-0 ${
                          isFocus
                            ? "border-primary/30 text-primary"
                            : "border-emerald-500/30 text-emerald-400"
                        }`}
                      >
                        {isFocus ? "🎯" : "☕"}
                      </Badge>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
