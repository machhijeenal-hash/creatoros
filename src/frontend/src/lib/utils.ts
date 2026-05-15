import type { SubscriptionTier } from "@/types";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Format a bigint nanosecond timestamp to a human-readable date string */
export function formatDate(
  ns: bigint,
  opts?: Intl.DateTimeFormatOptions,
): string {
  const ms = Number(ns / 1_000_000n);
  return new Date(ms).toLocaleDateString(
    "en-US",
    opts ?? { month: "short", day: "numeric", year: "numeric" },
  );
}

/** Format a bigint nanosecond timestamp to a relative time string (e.g. "2h ago") */
export function formatRelativeTime(ns: bigint): string {
  const ms = Number(ns / 1_000_000n);
  const diff = Date.now() - ms;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/** Format a duration in minutes to a human-readable string */
export function formatDuration(minutes: number | bigint): string {
  const m = typeof minutes === "bigint" ? Number(minutes) : minutes;
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  return rem === 0 ? `${h}h` : `${h}h ${rem}m`;
}

/** Get a display label for a subscription tier */
export function getSubscriptionTierLabel(tier: SubscriptionTier): string {
  switch (tier) {
    case "Pro":
      return "Pro";
    case "Elite":
      return "Elite";
    default:
      return "Free";
  }
}

/** Check if a Motoko variant object has the given key active */
export function isVariant(
  variant: Record<string, unknown>,
  key: string,
): boolean {
  return key in variant && variant[key] === null;
}

/** Truncate a string to a max length with ellipsis */
export function truncate(str: string, max: number): string {
  return str.length > max ? `${str.slice(0, max)}…` : str;
}

/** Capitalize first letter */
export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Format a number with compact notation (e.g. 1200 -> 1.2k) */
export function formatCompact(n: number): string {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

/** Platform-specific emoji/icon label */
export function getPlatformEmoji(platform: string): string {
  switch (platform) {
    case "YouTube":
      return "🎬";
    case "TikTok":
      return "🎵";
    case "Instagram":
      return "📸";
    case "Twitter":
      return "𝕏";
    case "Blog":
      return "✍️";
    default:
      return "📄";
  }
}
