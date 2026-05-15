import type { backendInterface, AIGeneration, ContentItem, DashboardMetrics, DailyTask, ProductivitySession, UserProfile, UserSettings, StripeSessionStatus, TransformationOutput, Result, Result_1, Result_2, Result_3, Result_4, Result_5 } from "../backend";
import { ContentStatus, Platform, SessionType, SubscriptionTier, UserRole } from "../backend";
import type { Principal } from "@icp-sdk/core/principal";

const samplePrincipal = { toText: () => "aaaaa-aa", compareTo: () => 0 } as unknown as Principal;
const now = BigInt(Date.now()) * BigInt(1_000_000);

const sampleProfile: UserProfile = {
  principal: samplePrincipal,
  displayName: "Alex Creator",
  email: "alex@example.com",
  tier: SubscriptionTier.Free,
  createdAt: now,
  updatedAt: now,
};

const sampleGeneration: AIGeneration = {
  id: BigInt(1),
  goal: "Grow YouTube channel",
  tone: "Energetic",
  audience: "Aspiring creators",
  platform: "YouTube",
  niche: "Creator Economy",
  outputText: "🎯 5 Viral Hook Ideas for Creator Economy Content:\n\n1. **\"I gained 10K subscribers doing THIS one thing...\"** — Curiosity gap hook that promises a secret\n2. **\"Why 99% of creators never grow (and how to be in the 1%)\"** — Exclusivity + problem awareness\n3. **\"The algorithm is broken — here's how I reverse-engineered it\"** — Authority + controversy\n4. **\"This $0 strategy outperformed my $500 ad spend\"** — Budget contrast + relatability\n5. **\"Nobody talks about THIS creator mistake (I learned it the hard way)\"** — Vulnerability + cautionary tale",
  saved: true,
  favorite: true,
  userPrincipal: samplePrincipal,
  createdAt: now,
};

const sampleContentItem: ContentItem = {
  id: BigInt(1),
  title: "5 AI Tools Every Creator Needs in 2025",
  platform: Platform.YouTube,
  status: ContentStatus.Scripting,
  notes: "Focus on practical tools with demos",
  userPrincipal: samplePrincipal,
  createdAt: now,
  updatedAt: now,
};

const sampleTask: DailyTask = {
  id: BigInt(1),
  title: "Record intro for AI tools video",
  completed: false,
  createdDate: now,
  userPrincipal: samplePrincipal,
};

const sampleSession: ProductivitySession = {
  id: BigInt(1),
  durationMinutes: BigInt(25),
  sessionType: SessionType.Focus,
  completedAt: now,
  userPrincipal: samplePrincipal,
};

const sampleMetrics: DashboardMetrics = {
  weeklyContentCount: BigInt(3),
  productivityScore: BigInt(72),
  focusHoursThisWeek: 4.5,
  recentGenerations: [sampleGeneration],
  taskCompletionRate: 0.68,
  contentStreak: BigInt(5),
  nextScheduledContent: sampleContentItem,
};

const sampleSettings: UserSettings = {
  darkMode: true,
  aiModel: "gpt-4o",
  temperature: 0.7,
  maxTokens: BigInt(1500),
  focusDuration: BigInt(25),
  breakDuration: BigInt(5),
};

export const mockBackend: backendInterface = {
  _initializeAccessControl: async (): Promise<void> => undefined,

  assignCallerUserRole: async (_user: Principal, _role: UserRole): Promise<void> => undefined,

  createCheckoutSession: async (_items, _successUrl, _cancelUrl): Promise<string> =>
    "https://checkout.stripe.com/pay/mock_session_id",

  createContentItem: async (title, platform, status, deadline, notes): Promise<Result_1> => ({
    __kind__: "ok",
    ok: {
      id: BigInt(Date.now()),
      title,
      platform,
      status,
      deadline: deadline ?? undefined,
      notes,
      userPrincipal: samplePrincipal,
      createdAt: now,
      updatedAt: now,
    },
  }),

  createDailyTask: async (title, _date): Promise<Result_5> => ({
    __kind__: "ok",
    ok: {
      id: BigInt(Date.now()),
      title,
      completed: false,
      createdDate: now,
      userPrincipal: samplePrincipal,
    },
  }),

  createGeneration: async (_params): Promise<Result_4> => ({
    __kind__: "ok",
    ok: sampleGeneration,
  }),

  createOrUpdateUser: async (_displayName, _email): Promise<Result_3> => ({
    __kind__: "ok",
    ok: sampleProfile,
  }),

  deleteContentItem: async (_id): Promise<Result> => ({ __kind__: "ok", ok: true }),

  deleteDailyTask: async (_id): Promise<Result> => ({ __kind__: "ok", ok: true }),

  getCallerUserRole: async (): Promise<UserRole> => UserRole.user,

  getDashboardMetrics: async (): Promise<DashboardMetrics> => sampleMetrics,

  getStripeSessionStatus: async (_sessionId): Promise<StripeSessionStatus> => ({
    __kind__: "completed",
    completed: { userPrincipal: "aaaaa-aa", response: "{}" },
  }),

  getUserProfile: async (): Promise<UserProfile | null> => sampleProfile,

  isCallerAdmin: async (): Promise<boolean> => false,

  isOpenAIConfigured: async (): Promise<boolean> => true,

  isStripeConfigured: async (): Promise<boolean> => true,

  listContentItems: async (): Promise<ContentItem[]> => [
    sampleContentItem,
    {
      id: BigInt(2),
      title: "Instagram Carousel: Creator Productivity Tips",
      platform: Platform.Instagram,
      status: ContentStatus.Idea,
      notes: "10 tips format, clean design",
      userPrincipal: samplePrincipal,
      createdAt: now,
      updatedAt: now,
    },
  ],

  listDailyTasks: async (_date): Promise<DailyTask[]> => [
    sampleTask,
    {
      id: BigInt(2),
      title: "Edit thumbnail for latest video",
      completed: true,
      createdDate: now,
      userPrincipal: samplePrincipal,
    },
  ],

  listGenerations: async (): Promise<AIGeneration[]> => [sampleGeneration],

  listProductivitySessions: async (_limit): Promise<ProductivitySession[]> => [sampleSession],

  logProductivitySession: async (_duration, _type): Promise<Result_2> => ({
    __kind__: "ok",
    ok: sampleSession,
  }),

  setOpenAIApiKey: async (_key): Promise<void> => undefined,

  setStripeConfiguration: async (_config): Promise<void> => undefined,

  toggleDailyTask: async (_id): Promise<Result> => ({ __kind__: "ok", ok: true }),

  transform: async (input): Promise<TransformationOutput> => ({
    status: BigInt(200),
    body: input.response.body,
    headers: input.response.headers,
  }),

  updateContentItem: async (id, title, platform, status, deadline, notes): Promise<Result_1> => ({
    __kind__: "ok",
    ok: {
      id,
      title,
      platform,
      status,
      deadline: deadline ?? undefined,
      notes,
      userPrincipal: samplePrincipal,
      createdAt: now,
      updatedAt: now,
    },
  }),

  updateGenerationFavorite: async (_id, _favorite): Promise<Result> => ({ __kind__: "ok", ok: true }),

  updateGenerationSaved: async (_id, _saved): Promise<Result> => ({ __kind__: "ok", ok: true }),

  updateSubscriptionTier: async (): Promise<Result> => ({ __kind__: "ok", ok: true }),

  updateUserSettings: async (_settings): Promise<Result> => ({ __kind__: "ok", ok: true }),
};
