import type { Principal } from "@icp-sdk/core/principal";

export type SubscriptionTier = "Free" | "Pro" | "Elite";

export interface UserProfile {
  principal: Principal;
  displayName: string;
  email: string;
  tier: SubscriptionTier;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface UserSettings {
  aiModel: string;
  temperature: number;
  maxTokens: bigint;
  focusDuration: bigint;
  breakDuration: bigint;
  darkMode: boolean;
}

export type ContentPlatform =
  | "YouTube"
  | "TikTok"
  | "Instagram"
  | "Twitter"
  | "Blog"
  | "Other";

export type ContentStatus =
  | "Idea"
  | "Scripting"
  | "Editing"
  | "Scheduled"
  | "Posted";

export interface AIGeneration {
  id: bigint;
  userPrincipal: Principal;
  niche: string;
  platform: string;
  audience: string;
  tone: string;
  goal: string;
  outputText: string;
  createdAt: bigint;
  saved: boolean;
  favorite: boolean;
}

export interface ContentItem {
  id: bigint;
  userPrincipal: Principal;
  title: string;
  platform: ContentPlatform;
  status: ContentStatus;
  deadline: bigint | undefined;
  notes: string;
  createdAt: bigint;
  updatedAt: bigint;
}

export interface ProductivitySession {
  id: bigint;
  userPrincipal: Principal;
  durationMinutes: bigint;
  completedAt: bigint;
  sessionType: "Focus" | "Break";
}

export interface DailyTask {
  id: bigint;
  userPrincipal: Principal;
  title: string;
  completed: boolean;
  createdDate: bigint;
}

export interface DashboardMetrics {
  contentStreak: bigint;
  productivityScore: bigint;
  weeklyContentCount: bigint;
  focusHoursThisWeek: number;
  taskCompletionRate: number;
  recentGenerations: AIGeneration[];
  nextScheduledContent: ContentItem | undefined;
}

export interface CheckoutSessionResult {
  sessionId: string;
  url: string;
}
