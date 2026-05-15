import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated } = useAuth();
  const { data: userProfile } = useUserProfile();

  const tier = userProfile?.tier ?? "Free";
  const displayName = userProfile?.displayName || "Creator";
  const showUpgradeBanner = isAuthenticated && tier === "Free";

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar userTier={tier} displayName={displayName} />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* TopBar */}
        <TopBar displayName={displayName} userTier={tier} />

        {/* Upgrade banner for Free tier */}
        {showUpgradeBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className={cn(
              "flex items-center justify-between px-4 py-2",
              "bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-primary/20",
            )}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs text-foreground/80">
                You&apos;re on the{" "}
                <strong className="text-foreground">Free plan</strong>. Unlock
                unlimited AI generation, analytics &amp; more.
              </span>
            </div>
            <Link
              to="/subscriptions"
              data-ocid="upgrade_banner.cta_button"
              className={cn(
                "text-xs font-semibold text-primary hover:text-primary/80 transition-smooth",
                "px-3 py-1 rounded-md bg-primary/15 hover:bg-primary/25 border border-primary/30",
              )}
            >
              Upgrade →
            </Link>
          </motion.div>
        )}

        {/* Page content */}
        <main
          data-ocid="main_content"
          className="flex-1 overflow-y-auto overflow-x-hidden bg-background"
        >
          <motion.div
            key="page-content"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
