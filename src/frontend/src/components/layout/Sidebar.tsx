import { getSubscriptionTierLabel } from "@/lib/backend";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { SubscriptionTier } from "@/types";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BarChart2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  requiresTier?: SubscriptionTier;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "AI Studio", icon: Sparkles, href: "/ai-studio" },
  { label: "Content Planner", icon: CalendarDays, href: "/content-planner" },
  { label: "Productivity", icon: Timer, href: "/productivity" },
  { label: "Subscriptions", icon: Zap, href: "/subscriptions" },
  {
    label: "Analytics",
    icon: BarChart2,
    href: "/analytics",
    requiresTier: "Pro",
  },
];

const BOTTOM_ITEMS: NavItem[] = [
  { label: "Settings", icon: Settings, href: "/settings" },
];

interface SidebarProps {
  userTier?: SubscriptionTier;
  displayName?: string;
}

export function Sidebar({
  userTier = "Free",
  displayName = "Creator",
}: SidebarProps) {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (href: string) => currentPath === href;

  return (
    <motion.nav
      data-ocid="sidebar"
      initial={false}
      animate={{ width: sidebarCollapsed ? 68 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative flex flex-col h-full glass border-r border-white/8 shrink-0 overflow-hidden z-30"
    >
      {/* Logo */}
      <div className="flex items-center px-4 h-16 border-b border-white/8 shrink-0">
        <Link to="/dashboard" className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-glow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                key="logo-text"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="font-display font-bold text-foreground text-lg whitespace-nowrap"
              >
                CreatorOS
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Main nav */}
      <div className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              data-ocid={`sidebar.${item.label.toLowerCase().replace(/ /g, "-")}.link`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth group relative",
                active
                  ? "bg-primary/15 text-primary border border-primary/25 shadow-glow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <Icon
                className={cn(
                  "w-4.5 h-4.5 shrink-0",
                  active
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
                style={{ width: 18, height: 18 }}
              />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    key={item.href}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.12 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute right-2 w-1.5 h-1.5 rounded-full bg-primary"
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Bottom section */}
      <div className="border-t border-white/8 py-3 px-2 flex flex-col gap-1">
        {BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              to={item.href}
              data-ocid={`sidebar.${item.label.toLowerCase()}.link`}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth group",
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <Icon style={{ width: 18, height: 18 }} className="shrink-0" />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    key={item.href}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  />
                )}
              </AnimatePresence>
              {!sidebarCollapsed && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}

        {/* User tier badge */}
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-1 mt-1 px-3 py-2.5 rounded-lg bg-muted/40 border border-white/6"
          >
            <p className="text-xs text-muted-foreground truncate">
              {displayName}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  userTier === "Elite"
                    ? "bg-secondary shadow-glow-purple"
                    : userTier === "Pro"
                      ? "bg-primary shadow-glow-sm"
                      : "bg-muted-foreground",
                )}
              />
              <span
                className={cn(
                  "text-xs font-semibold",
                  userTier === "Elite"
                    ? "text-secondary"
                    : userTier === "Pro"
                      ? "text-primary"
                      : "text-muted-foreground",
                )}
              >
                {getSubscriptionTierLabel(userTier)} Plan
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        type="button"
        data-ocid="sidebar.collapse_button"
        onClick={toggleSidebar}
        aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full glass border border-white/15 flex items-center justify-center hover:border-primary/40 hover:text-primary transition-smooth text-muted-foreground z-40"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-3 h-3" />
        ) : (
          <ChevronLeft className="w-3 h-3" />
        )}
      </button>
    </motion.nav>
  );
}
