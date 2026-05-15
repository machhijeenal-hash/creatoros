import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { getSubscriptionTierLabel } from "@/lib/backend";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { SubscriptionTier } from "@/types";
import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronDown, LogOut, Settings, User } from "lucide-react";

const BREADCRUMB_MAP: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/ai-studio": "AI Studio",
  "/content-planner": "Content Planner",
  "/productivity": "Productivity",
  "/subscriptions": "Subscriptions",
  "/analytics": "Analytics",
  "/settings": "Settings",
};

interface TopBarProps {
  displayName?: string;
  userTier?: SubscriptionTier;
}

export function TopBar({
  displayName = "Creator",
  userTier = "Free",
}: TopBarProps) {
  const { logout } = useAuth();
  const { setCommandPaletteOpen } = useAppStore();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const pageTitle = BREADCRUMB_MAP[currentPath] ?? "CreatorOS";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      data-ocid="topbar"
      className="h-14 flex items-center px-4 gap-4 glass border-b border-white/8 shrink-0"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-muted-foreground text-xs font-body">
          CreatorOS
        </span>
        <span className="text-muted-foreground/40 text-xs">/</span>
        <span className="text-foreground text-sm font-semibold font-display truncate">
          {pageTitle}
        </span>
      </div>

      {/* Command palette trigger */}
      <button
        type="button"
        data-ocid="topbar.command_palette_open"
        onClick={() => setCommandPaletteOpen(true)}
        className={cn(
          "hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg",
          "glass border border-white/10 hover:border-primary/30 transition-smooth",
          "text-muted-foreground hover:text-foreground text-sm",
          "min-w-[200px] max-w-[280px]",
        )}
        aria-label="Open command palette"
      >
        <span className="text-sm flex-1 text-left">
          Search or run a command…
        </span>
        <kbd className="text-xs bg-muted/60 px-1.5 py-0.5 rounded border border-white/10 font-mono shrink-0">
          ⌘K
        </kbd>
      </button>

      {/* Notifications */}
      <button
        type="button"
        data-ocid="topbar.notifications_button"
        aria-label="Notifications"
        className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted/50 transition-smooth text-muted-foreground hover:text-foreground"
      >
        <Bell className="w-4 h-4" />
      </button>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            data-ocid="topbar.user_menu_button"
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-muted/50 transition-smooth"
          >
            <Avatar className="w-7 h-7">
              <AvatarFallback className="bg-gradient-to-br from-primary/70 to-secondary/70 text-white text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start min-w-0">
              <span className="text-sm font-medium text-foreground truncate max-w-24">
                {displayName}
              </span>
              <span
                className={cn(
                  "text-xs",
                  userTier === "Elite"
                    ? "text-secondary"
                    : userTier === "Pro"
                      ? "text-primary"
                      : "text-muted-foreground",
                )}
              >
                {getSubscriptionTierLabel(userTier)}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-52 glass border-white/15"
          data-ocid="topbar.user_dropdown_menu"
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-foreground text-sm">
                {displayName}
              </p>
              <p className="text-xs text-muted-foreground">
                {getSubscriptionTierLabel(userTier)} Plan
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/8" />
          <DropdownMenuItem asChild>
            <Link
              to="/settings"
              data-ocid="topbar.profile_link"
              className="cursor-pointer"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link
              to="/settings"
              data-ocid="topbar.settings_link"
              className="cursor-pointer"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/8" />
          <DropdownMenuItem
            data-ocid="topbar.logout_button"
            onClick={logout}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
