import { c as createLucideIcon, q as jsxRuntimeExports, W as cn, j as reactExports, a9 as useProductivitySessions, aa as useLogProductivitySession, ab as useDailyTasks, ac as useCreateDailyTask, ad as useToggleDailyTask, ae as useDeleteDailyTask, af as useUserSettings, t as motion, Z as Zap, A as AnimatePresence } from "./index-Bt5dTGTg.js";
import { B as Badge } from "./badge-DMLtg8Eo.js";
import { B as Button } from "./button-iLZnvIfQ.js";
import { I as Input } from "./input-DpzPCDDG.js";
import { T as Target, a as TrendingUp, C as Clock } from "./trending-up-Dr0YnVYD.js";
import { P as Play } from "./play-D-ElFPiQ.js";
import { C as CircleCheck } from "./circle-check-DUKEi9zg.js";
import { x as generateCategoricalChart, B as Bar, X as XAxis, Y as YAxis, y as formatAxisMap, P as Plus, R as ResponsiveContainer, T as Tooltip, z as Cell } from "./generateCategoricalChart-pjM-mTa5.js";
import { T as Trash2 } from "./trash-2-CTHojxzA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }]];
const Circle = createLucideIcon("circle", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["path", { d: "M10 2v2", key: "7u0qdc" }],
  ["path", { d: "M14 2v2", key: "6buw04" }],
  [
    "path",
    {
      d: "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1",
      key: "pwadti"
    }
  ],
  ["path", { d: "M6 2v2", key: "colzsn" }]
];
const Coffee = createLucideIcon("coffee", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { x: "14", y: "4", width: "4", height: "16", rx: "1", key: "zuxfzm" }],
  ["rect", { x: "6", y: "4", width: "4", height: "16", rx: "1", key: "1okwgv" }]
];
const Pause = createLucideIcon("pause", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["polygon", { points: "5 4 15 12 5 20 5 4", key: "16p6eg" }],
  ["line", { x1: "19", x2: "19", y1: "5", y2: "19", key: "futhcm" }]
];
const SkipForward = createLucideIcon("skip-forward", __iconNode);
var BarChart = generateCategoricalChart({
  chartName: "BarChart",
  GraphicalChild: Bar,
  defaultTooltipEventType: "axis",
  validateTooltipEventTypes: ["axis", "item"],
  axisComponents: [{
    axisType: "xAxis",
    AxisComp: XAxis
  }, {
    axisType: "yAxis",
    AxisComp: YAxis
  }],
  formatAxisMap
});
function Skeleton({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "skeleton",
      className: cn("bg-accent animate-pulse rounded-md", className),
      ...props
    }
  );
}
const DEFAULT_FOCUS_MINUTES = 25;
const DEFAULT_BREAK_MINUTES = 5;
const POMODOROS_BEFORE_LONG_BREAK = 4;
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
    gain.gain.exponentialRampToValueAtTime(1e-3, ctx.currentTime + duration);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
    setTimeout(() => ctx.close(), (duration + 0.1) * 1e3);
  } catch (_) {
  }
}
function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
function getDayLabel(date) {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
}
function getWeeklyChartData(sessions) {
  const today = /* @__PURE__ */ new Date();
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push({ label: getDayLabel(d), hours: 0, date: d });
  }
  for (const s of sessions) {
    if (s.sessionType !== "Focus") continue;
    const ts = Number(s.completedAt);
    const sessionDate = new Date(ts > 1e15 ? ts / 1e6 : ts);
    for (const day of days) {
      if (sessionDate.getFullYear() === day.date.getFullYear() && sessionDate.getMonth() === day.date.getMonth() && sessionDate.getDate() === day.date.getDate()) {
        day.hours += Number(s.durationMinutes) / 60;
      }
    }
  }
  return days.map((d) => ({ ...d, hours: Math.round(d.hours * 10) / 10 }));
}
function getTodayFocusSessions(sessions) {
  const today = /* @__PURE__ */ new Date();
  return sessions.filter((s) => {
    if (s.sessionType !== "Focus") return false;
    const ts = Number(s.completedAt);
    const d = new Date(ts > 1e15 ? ts / 1e6 : ts);
    return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
  });
}
function CircularTimer({
  progress,
  phase,
  timeLeft,
  state
}) {
  const SIZE = 280;
  const STROKE = 10;
  const R = (SIZE - STROKE * 2) / 2;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC * (1 - progress);
  const isFocus = phase === "Focus";
  const strokeColor = isFocus ? "oklch(0.56 0.22 262)" : "oklch(0.7 0.17 162)";
  const glowColor = isFocus ? "#0084ff" : "#34d399";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative flex items-center justify-center",
      style: { width: SIZE, height: SIZE },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-0 rounded-full",
            style: {
              background: `radial-gradient(circle, ${glowColor}18 0%, transparent 70%)`,
              filter: state === "Running" ? `drop-shadow(0 0 24px ${glowColor}40)` : "none",
              transition: "filter 0.6s ease"
            }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            width: SIZE,
            height: SIZE,
            className: "-rotate-90",
            role: "img",
            "aria-label": "Timer progress",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: SIZE / 2,
                  cy: SIZE / 2,
                  r: R,
                  fill: "none",
                  stroke: "oklch(var(--border))",
                  strokeWidth: STROKE
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "circle",
                {
                  cx: SIZE / 2,
                  cy: SIZE / 2,
                  r: R,
                  fill: "none",
                  stroke: strokeColor,
                  strokeWidth: STROKE,
                  strokeLinecap: "round",
                  strokeDasharray: CIRC,
                  strokeDashoffset: offset,
                  style: {
                    transition: "stroke-dashoffset 0.9s linear, stroke 0.4s ease"
                  }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute flex flex-col items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[56px] font-display font-bold text-foreground tabular-nums leading-none", children: formatTime(timeLeft) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: `text-sm font-medium tracking-widest uppercase ${isFocus ? "text-primary" : "text-emerald-400"}`,
              children: phase
            }
          ),
          state === "Running" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: `mt-1 w-2 h-2 rounded-full ${isFocus ? "bg-primary" : "bg-emerald-400"}`,
              animate: { opacity: [1, 0.3, 1] },
              transition: { duration: 1.2, repeat: Number.POSITIVE_INFINITY }
            }
          )
        ] })
      ]
    }
  );
}
function StatTile({
  icon,
  label,
  value,
  color,
  bg
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 p-3 rounded-xl bg-card/40 border border-border/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `w-7 h-7 rounded-lg ${bg} ${color} flex items-center justify-center`,
        children: icon
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-display font-bold text-foreground leading-none", children: value }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground leading-tight", children: label })
  ] });
}
function Productivity() {
  const [timerState, setTimerState] = reactExports.useState("Idle");
  const [phase, setPhase] = reactExports.useState("Focus");
  const [sessionCount, setSessionCount] = reactExports.useState(0);
  const [timeLeft, setTimeLeft] = reactExports.useState(() => DEFAULT_FOCUS_MINUTES * 60);
  const startTimestampRef = reactExports.useRef(null);
  const pausedSecondsRef = reactExports.useRef(DEFAULT_FOCUS_MINUTES * 60);
  const intervalRef = reactExports.useRef(null);
  const totalDurationRef = reactExports.useRef(DEFAULT_FOCUS_MINUTES * 60);
  const phaseRef = reactExports.useRef("Focus");
  const sessionCountRef = reactExports.useRef(0);
  const { data: sessions = [], isLoading: sessionsLoading } = useProductivitySessions();
  const logSession = useLogProductivitySession();
  const { data: tasks = [], isLoading: tasksLoading } = useDailyTasks();
  const createTask = useCreateDailyTask();
  const toggleTask = useToggleDailyTask();
  const deleteTask = useDeleteDailyTask();
  const { data: userSettings } = useUserSettings();
  const FOCUS_DURATION = Number((userSettings == null ? void 0 : userSettings.focusDuration) ?? DEFAULT_FOCUS_MINUTES) * 60;
  const BREAK_DURATION = Number((userSettings == null ? void 0 : userSettings.breakDuration) ?? DEFAULT_BREAK_MINUTES) * 60;
  reactExports.useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  reactExports.useEffect(() => {
    sessionCountRef.current = sessionCount;
  }, [sessionCount]);
  const [taskInput, setTaskInput] = reactExports.useState("");
  const todayFocusSessions = getTodayFocusSessions(sessions);
  const chartData = getWeeklyChartData(sessions);
  const todayFocusMinutes = todayFocusSessions.reduce(
    (sum, s) => sum + Number(s.durationMinutes),
    0
  );
  const progress = timeLeft / totalDurationRef.current;
  const displaySessionNum = sessionCount % POMODOROS_BEFORE_LONG_BREAK + 1;
  const handleTimerComplete = reactExports.useCallback(() => {
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
  const tick = reactExports.useCallback(() => {
    if (startTimestampRef.current === null) return;
    const elapsed = Math.floor((Date.now() - startTimestampRef.current) / 1e3);
    const remaining = pausedSecondsRef.current - elapsed;
    if (remaining <= 0) {
      handleTimerComplete();
    } else {
      setTimeLeft(remaining);
    }
  }, [handleTimerComplete]);
  reactExports.useEffect(() => {
    if (timerState === "Running") {
      intervalRef.current = setInterval(tick, 1e3);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState, tick]);
  function handleStart() {
    startTimestampRef.current = Date.now();
    setTimerState("Running");
  }
  function handlePause() {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (startTimestampRef.current !== null) {
      const elapsed = Math.floor(
        (Date.now() - startTimestampRef.current) / 1e3
      );
      pausedSecondsRef.current = Math.max(
        0,
        pausedSecondsRef.current - elapsed
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
  function handleAddTask(e) {
    e.preventDefault();
    const trimmed = taskInput.trim();
    if (!trimmed) return;
    createTask.mutate(trimmed);
    setTaskInput("");
  }
  const recentSessions = [...sessions].sort((a, b) => Number(b.completedAt) - Number(a.completedAt)).slice(0, 14);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "min-h-screen bg-background px-4 md:px-8 py-8",
      "data-ocid": "productivity.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -16 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.4 },
            className: "mb-8",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-4 h-4 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Productivity" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground ml-12", children: "Deep work sessions, daily goals, and habit tracking." })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "xl:col-span-2 flex flex-col gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5 },
                className: "glass rounded-2xl p-8",
                "data-ocid": "productivity.timer.card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-6", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-muted-foreground uppercase tracking-widest", children: "Session" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5", children: Array.from(
                        { length: POMODOROS_BEFORE_LONG_BREAK },
                        (_, i) => `dot-${i}`
                      ).map((dotId, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        motion.div,
                        {
                          className: `w-2.5 h-2.5 rounded-full transition-smooth ${i < sessionCount % POMODOROS_BEFORE_LONG_BREAK ? "bg-primary" : i === sessionCount % POMODOROS_BEFORE_LONG_BREAK && phase === "Focus" && timerState !== "Idle" ? "bg-primary/50" : "bg-border"}`,
                          animate: i === sessionCount % POMODOROS_BEFORE_LONG_BREAK && timerState === "Running" && phase === "Focus" ? { scale: [1, 1.3, 1] } : {},
                          transition: {
                            duration: 2,
                            repeat: Number.POSITIVE_INFINITY
                          }
                        },
                        dotId
                      )) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                        displaySessionNum,
                        " of ",
                        POMODOROS_BEFORE_LONG_BREAK
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Badge,
                      {
                        variant: "outline",
                        className: `text-xs flex items-center gap-1 ${phase === "Focus" ? "border-primary/40 text-primary" : "border-emerald-500/40 text-emerald-400"}`,
                        children: [
                          phase === "Focus" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Coffee, { className: "w-3 h-3" }),
                          phase
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    CircularTimer,
                    {
                      progress,
                      phase,
                      timeLeft,
                      state: timerState
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-3", children: [
                    timerState !== "Running" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        type: "button",
                        size: "lg",
                        className: "px-10 font-semibold glow-accent",
                        onClick: handleStart,
                        "data-ocid": "productivity.start_button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4 mr-2" }),
                          timerState === "Paused" ? "Resume" : "Start"
                        ]
                      }
                    ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        type: "button",
                        size: "lg",
                        variant: "outline",
                        className: "px-10 font-semibold",
                        onClick: handlePause,
                        "data-ocid": "productivity.pause_button",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-4 h-4 mr-2" }),
                          "Pause"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "outline",
                        size: "icon",
                        className: "w-11 h-11",
                        onClick: handleReset,
                        "data-ocid": "productivity.reset_button",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "button",
                        variant: "ghost",
                        size: "icon",
                        className: "w-11 h-11 text-muted-foreground",
                        onClick: handleSkip,
                        "data-ocid": "productivity.skip_button",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SkipForward, { className: "w-4 h-4" })
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5, delay: 0.1 },
                className: "glass rounded-2xl p-6",
                "data-ocid": "productivity.tasks.card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "Today's Tasks" }),
                    tasks.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "secondary", className: "ml-auto text-xs", children: [
                      tasks.filter((t) => t.completed).length,
                      "/",
                      tasks.length
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddTask, className: "flex gap-2 mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        value: taskInput,
                        onChange: (e) => setTaskInput(e.target.value),
                        placeholder: "Add a task for today…",
                        className: "bg-card/50 border-border/60 text-sm",
                        "data-ocid": "productivity.task.input"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "submit",
                        variant: "outline",
                        size: "icon",
                        disabled: !taskInput.trim() || createTask.isPending,
                        className: "shrink-0",
                        "data-ocid": "productivity.task.add_button",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" })
                      }
                    )
                  ] }),
                  tasksLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded-lg" }, i)) }) : tasks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "text-center py-8",
                      "data-ocid": "productivity.tasks.empty_state",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No tasks yet. Add your first goal for today." })
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { initial: false, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: tasks.map((task, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      initial: { opacity: 0, x: -12 },
                      animate: { opacity: 1, x: 0 },
                      exit: { opacity: 0, x: 12, height: 0 },
                      transition: { duration: 0.2, delay: index * 0.04 },
                      className: "flex items-center gap-3 px-3 py-2.5 rounded-xl bg-card/40 border border-border/40 group",
                      "data-ocid": `productivity.task.item.${index + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => toggleTask.mutate(task.id),
                            className: "shrink-0 transition-smooth",
                            "aria-label": task.completed ? "Mark incomplete" : "Mark complete",
                            "data-ocid": `productivity.task.checkbox.${index + 1}`,
                            children: task.completed ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "w-5 h-5 text-muted-foreground hover:text-primary transition-smooth" })
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: `flex-1 text-sm min-w-0 truncate ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`,
                            children: task.title
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => deleteTask.mutate(task.id),
                            className: "opacity-0 group-hover:opacity-100 transition-smooth text-muted-foreground hover:text-destructive",
                            "aria-label": "Delete task",
                            "data-ocid": `productivity.task.delete_button.${index + 1}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                          }
                        )
                      ]
                    },
                    String(task.id)
                  )) }) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5, delay: 0.15 },
                className: "glass rounded-2xl p-6",
                "data-ocid": "productivity.stats.card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-primary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "Today's Progress" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      StatTile,
                      {
                        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }),
                        label: "Focus Sessions",
                        value: String(todayFocusSessions.length),
                        color: "text-primary",
                        bg: "bg-primary/10"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      StatTile,
                      {
                        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
                        label: "Focus Minutes",
                        value: String(todayFocusMinutes),
                        color: "text-emerald-400",
                        bg: "bg-emerald-400/10"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      StatTile,
                      {
                        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { className: "w-4 h-4" }),
                        label: "Tasks Done",
                        value: String(tasks.filter((t) => t.completed).length),
                        color: "text-secondary",
                        bg: "bg-secondary/10"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      StatTile,
                      {
                        icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
                        label: "Total Tasks",
                        value: String(tasks.length),
                        color: "text-muted-foreground",
                        bg: "bg-muted"
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5, delay: 0.22 },
                className: "glass rounded-2xl p-6",
                "data-ocid": "productivity.chart.card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-secondary" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "Weekly Focus" })
                  ] }),
                  sessionsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-36 rounded-lg" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 140, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: chartData, barCategoryGap: "30%", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      XAxis,
                      {
                        dataKey: "label",
                        tick: { fill: "oklch(0.55 0 0)", fontSize: 11 },
                        axisLine: false,
                        tickLine: false
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, { hide: true }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Tooltip,
                      {
                        contentStyle: {
                          background: "oklch(0.18 0 0)",
                          border: "1px solid oklch(0.28 0 0)",
                          borderRadius: 8,
                          color: "oklch(0.95 0 0)",
                          fontSize: 12
                        },
                        formatter: (val) => [`${val}h`, "Focus"]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "hours", radius: [4, 4, 0, 0], maxBarSize: 28, children: chartData.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Cell,
                      {
                        fill: i === chartData.length - 1 ? "oklch(0.56 0.22 262)" : "oklch(0.28 0.04 262)"
                      },
                      entry.label
                    )) })
                  ] }) })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5, delay: 0.28 },
                className: "glass rounded-2xl p-6",
                "data-ocid": "productivity.history.card",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground", children: "Session History" })
                  ] }),
                  sessionsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 rounded-lg" }, i)) }) : recentSessions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      className: "text-center py-8",
                      "data-ocid": "productivity.history.empty_state",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No sessions today." }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Start your first Pomodoro to begin tracking." })
                      ]
                    }
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto pr-1", children: recentSessions.map((session, index) => {
                    const ts = Number(session.completedAt);
                    const date = new Date(ts > 1e15 ? ts / 1e6 : ts);
                    const timeStr = date.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    });
                    const isFocus = session.sessionType === "Focus";
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.div,
                      {
                        initial: { opacity: 0, x: 10 },
                        animate: { opacity: 1, x: 0 },
                        transition: { duration: 0.2, delay: index * 0.03 },
                        className: "flex items-center gap-3 px-3 py-2 rounded-lg bg-card/30 border border-border/30",
                        "data-ocid": `productivity.history.item.${index + 1}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: `w-2 h-2 rounded-full shrink-0 ${isFocus ? "bg-primary" : "bg-emerald-400"}`
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-medium text-foreground", children: [
                              isFocus ? "Focus" : "Break",
                              " —",
                              " ",
                              Number(session.durationMinutes),
                              " min"
                            ] }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: timeStr })
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Badge,
                            {
                              variant: "outline",
                              className: `text-[10px] shrink-0 ${isFocus ? "border-primary/30 text-primary" : "border-emerald-500/30 text-emerald-400"}`,
                              children: isFocus ? "🎯" : "☕"
                            }
                          )
                        ]
                      },
                      String(session.id)
                    );
                  }) })
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  Productivity as default
};
