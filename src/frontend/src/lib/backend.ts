/**
 * Backend wrapper — typed helpers over the raw actor.
 * All bigint conversions, variant normalization, and Result unwrapping happen here.
 * Import the canister actor via useActor(createActor) in hooks; this file just provides
 * conversion utilities and typed call wrappers.
 */
import type {
  AIGeneration,
  ContentItem,
  ContentPlatform,
  ContentStatus,
  DailyTask,
  DashboardMetrics,
  ProductivitySession,
  SubscriptionTier,
  UserProfile,
  UserSettings,
} from "@/types";
import type { Principal } from "@icp-sdk/core/principal";

// ─── Variant normalization ────────────────────────────────────────────────────

/** Converts a Motoko variant object like { Free: null } → 'Free' */
export function variantToString<T extends string>(variant: Record<T, null>): T {
  return Object.keys(variant)[0] as T;
}

/** Converts a plain string like 'Free' → { Free: null } */
export function stringToVariant<T extends string>(key: T): Record<T, null> {
  return { [key]: null } as Record<T, null>;
}

/** Returns true if a variant object has the given key active */
export function isVariant<T extends string>(variant: Record<string, unknown>, key: T): boolean {
  return key in variant && variant[key] === null;
}

// ─── Tier helpers ─────────────────────────────────────────────────────────────

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

export function tierRank(tier: SubscriptionTier): number {
  switch (tier) {
    case "Elite":
      return 3;
    case "Pro":
      return 2;
    default:
      return 1;
  }
}

export function hasTierAccess(userTier: SubscriptionTier, required: SubscriptionTier): boolean {
  return tierRank(userTier) >= tierRank(required);
}

// ─── Raw → typed converters ──────────────────────────────────────────────────

// biome-ignore lint/suspicious/noExplicitAny: raw candid types from actor
type CandidOptional<T> = [] | [T];

function fromOptional<T>(opt: CandidOptional<T>): T | undefined {
  return opt.length > 0 ? opt[0] : undefined;
}

// biome-ignore lint/suspicious/noExplicitAny: raw candid response
export function normalizeUserProfile(raw: any): UserProfile {
  return {
    principal: raw.principal as Principal,
    displayName: raw.displayName as string,
    email: raw.email as string,
    tier: variantToString(raw.tier) as SubscriptionTier,
    createdAt: BigInt(raw.createdAt),
    updatedAt: BigInt(raw.updatedAt),
  };
}

// biome-ignore lint/suspicious/noExplicitAny: raw candid response
export function normalizeUserSettings(raw: any): UserSettings {
  return {
    aiModel: raw.aiModel as string,
    temperature: raw.temperature as number,
    maxTokens: BigInt(raw.maxTokens),
    focusDuration: BigInt(raw.focusDuration),
    breakDuration: BigInt(raw.breakDuration),
    darkMode: raw.darkMode as boolean,
  };
}

// biome-ignore lint/suspicious/noExplicitAny: raw candid response
export function normalizeAIGeneration(raw: any): AIGeneration {
  return {
    id: BigInt(raw.id),
    userPrincipal: raw.userPrincipal as Principal,
    niche: raw.niche as string,
    platform: raw.platform as string,
    audience: raw.audience as string,
    tone: raw.tone as string,
    goal: raw.goal as string,
    outputText: raw.outputText as string,
    createdAt: BigInt(raw.createdAt),
    saved: raw.saved as boolean,
    favorite: raw.favorite as boolean,
  };
}

// biome-ignore lint/suspicious/noExplicitAny: raw candid response
export function normalizeContentItem(raw: any): ContentItem {
  return {
    id: BigInt(raw.id),
    userPrincipal: raw.userPrincipal as Principal,
    title: raw.title as string,
    platform: variantToString(raw.platform) as ContentPlatform,
    status: variantToString(raw.status) as ContentStatus,
    deadline: fromOptional(raw.deadline as CandidOptional<bigint>),
    notes: raw.notes as string,
    createdAt: BigInt(raw.createdAt),
    updatedAt: BigInt(raw.updatedAt),
  };
}

// biome-ignore lint/suspicious/noExplicitAny: raw candid response
export function normalizeProductivitySession(raw: any): ProductivitySession {
  return {
    id: BigInt(raw.id),
    userPrincipal: raw.userPrincipal as Principal,
    durationMinutes: BigInt(raw.durationMinutes),
    completedAt: BigInt(raw.completedAt),
    sessionType: variantToString(raw.sessionType) as "Focus" | "Break",
  };
}

// biome-ignore lint/suspicious/noExplicitAny: raw candid response
export function normalizeDailyTask(raw: any): DailyTask {
  return {
    id: BigInt(raw.id),
    userPrincipal: raw.userPrincipal as Principal,
    title: raw.title as string,
    completed: raw.completed as boolean,
    createdDate: BigInt(raw.createdDate),
  };
}

// biome-ignore lint/suspicious/noExplicitAny: raw candid response
export function normalizeDashboardMetrics(raw: any): DashboardMetrics {
  return {
    contentStreak: BigInt(raw.contentStreak),
    productivityScore: BigInt(raw.productivityScore),
    weeklyContentCount: BigInt(raw.weeklyContentCount),
    focusHoursThisWeek: raw.focusHoursThisWeek as number,
    taskCompletionRate: raw.taskCompletionRate as number,
    recentGenerations: (raw.recentGenerations as unknown[]).map(normalizeAIGeneration),
    nextScheduledContent: fromOptional(raw.nextScheduledContent) != null
      ? normalizeContentItem(fromOptional(raw.nextScheduledContent))
      : undefined,
  };
}

// ─── Result unwrapper ────────────────────────────────────────────────────────

/** Unwrap { ok: T } | { err: string } from canister Result type */
export function unwrapResult<T>(result: { ok: T } | { err: string }): T {
  if ("ok" in result) return result.ok;
  throw new Error((result as { err: string }).err);
}
