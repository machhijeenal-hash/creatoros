import { c as createLucideIcon, q as jsxRuntimeExports, t as motion, Z as Zap, L as Link } from "./index-Bt5dTGTg.js";
import { B as Badge } from "./badge-DMLtg8Eo.js";
import { B as Button } from "./button-iLZnvIfQ.js";
import { a as TrendingUp, C as Clock, T as Target } from "./trending-up-Dr0YnVYD.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
];
const ArrowLeft = createLucideIcon("arrow-left", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16", key: "c24i48" }],
  ["path", { d: "M18 17V9", key: "2bz60n" }],
  ["path", { d: "M13 17V5", key: "1frdt8" }],
  ["path", { d: "M8 17v-3", key: "17ska0" }]
];
const ChartColumn = createLucideIcon("chart-column", __iconNode);
function Analytics() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 md:p-8 max-w-5xl mx-auto", "data-ocid": "analytics.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 },
        className: "mb-8",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-4 h-4 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-display font-bold text-foreground", children: "Analytics" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                className: "ml-2 text-xs px-2 py-0.5",
                style: {
                  background: "#f59e0b18",
                  color: "#fbbf24",
                  borderColor: "#f59e0b33"
                },
                children: "Coming in Round 2"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground ml-12", children: "Advanced analytics are being built for the next release." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.97 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
        className: "glass rounded-2xl p-12 flex flex-col items-center text-center gap-6",
        "data-ocid": "analytics.coming_soon_card",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-20 h-20 rounded-2xl flex items-center justify-center",
              style: {
                background: "linear-gradient(135deg, rgba(0,132,255,0.15), rgba(124,58,237,0.1))",
                border: "1px solid rgba(0,132,255,0.25)"
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { className: "w-9 h-9 text-primary" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-display font-bold text-foreground mb-3", children: "Advanced Analytics — Round 2" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground max-w-lg leading-relaxed", children: "Real-time charts, content velocity trends, focus hour analytics, AI usage breakdowns, and workflow completion rates — all powered by your actual activity data." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl", children: [
            { icon: TrendingUp, label: "Content Velocity", color: "#0084ff" },
            { icon: Clock, label: "Focus Trends", color: "#7c3aed" },
            { icon: Zap, label: "AI Usage Stats", color: "#06b6d4" },
            { icon: Target, label: "Goal Completion", color: "#10b981" }
          ].map(({ icon: Icon, label, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "glass rounded-xl p-4 flex flex-col items-center gap-2",
              "data-ocid": `analytics.preview.${label.toLowerCase().replace(/\s+/g, "_")}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-9 h-9 rounded-lg flex items-center justify-center",
                    style: { background: `${color}20` },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4", style: { color } })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground text-center leading-tight", children: label })
              ]
            },
            label
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/dashboard", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                className: "gap-2",
                "data-ocid": "analytics.back_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
                  "Back to Dashboard"
                ]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/subscriptions", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                className: "gap-2 font-semibold",
                style: {
                  background: "linear-gradient(135deg, #0084ff, #7c3aed)"
                },
                "data-ocid": "analytics.upgrade_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }),
                  "Get Early Access"
                ]
              }
            ) })
          ] })
        ]
      }
    )
  ] });
}
export {
  Analytics as default
};
