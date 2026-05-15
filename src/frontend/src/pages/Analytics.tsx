import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BarChart3,
  Clock,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

export default function Analytics() {
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto" data-ocid="analytics.page">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Analytics
          </h1>
          <Badge
            className="ml-2 text-xs px-2 py-0.5"
            style={{
              background: "#f59e0b18",
              color: "#fbbf24",
              borderColor: "#f59e0b33",
            }}
          >
            Coming in Round 2
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground ml-12">
          Advanced analytics are being built for the next release.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        className="glass rounded-2xl p-12 flex flex-col items-center text-center gap-6"
        data-ocid="analytics.coming_soon_card"
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,132,255,0.15), rgba(124,58,237,0.1))",
            border: "1px solid rgba(0,132,255,0.25)",
          }}
        >
          <BarChart3 className="w-9 h-9 text-primary" />
        </div>

        <div>
          <h2 className="text-2xl font-display font-bold text-foreground mb-3">
            Advanced Analytics — Round 2
          </h2>
          <p className="text-muted-foreground max-w-lg leading-relaxed">
            Real-time charts, content velocity trends, focus hour analytics, AI
            usage breakdowns, and workflow completion rates — all powered by
            your actual activity data.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
          {[
            { icon: TrendingUp, label: "Content Velocity", color: "#0084ff" },
            { icon: Clock, label: "Focus Trends", color: "#7c3aed" },
            { icon: Zap, label: "AI Usage Stats", color: "#06b6d4" },
            { icon: Target, label: "Goal Completion", color: "#10b981" },
          ].map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="glass rounded-xl p-4 flex flex-col items-center gap-2"
              data-ocid={`analytics.preview.${label.toLowerCase().replace(/\s+/g, "_")}`}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${color}20` }}
              >
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <span className="text-xs text-muted-foreground text-center leading-tight">
                {label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/dashboard">
            <Button
              variant="outline"
              className="gap-2"
              data-ocid="analytics.back_button"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <Link to="/subscriptions">
            <Button
              className="gap-2 font-semibold"
              style={{
                background: "linear-gradient(135deg, #0084ff, #7c3aed)",
              }}
              data-ocid="analytics.upgrade_button"
            >
              <Zap className="w-4 h-4" />
              Get Early Access
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
