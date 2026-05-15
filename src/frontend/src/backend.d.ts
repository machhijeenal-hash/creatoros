import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductivitySession {
    id: bigint;
    completedAt: Timestamp;
    sessionType: SessionType;
    durationMinutes: bigint;
    userPrincipal: UserId;
}
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Result_2 = {
    __kind__: "ok";
    ok: ProductivitySession;
} | {
    __kind__: "err";
    err: string;
};
export interface ContentItem {
    id: bigint;
    status: ContentStatus;
    title: string;
    createdAt: Timestamp;
    deadline?: Timestamp;
    platform: Platform;
    updatedAt: Timestamp;
    userPrincipal: UserId;
    notes: string;
}
export type Result_5 = {
    __kind__: "ok";
    ok: DailyTask;
} | {
    __kind__: "err";
    err: string;
};
export type Result_1 = {
    __kind__: "ok";
    ok: ContentItem;
} | {
    __kind__: "err";
    err: string;
};
export type Result_4 = {
    __kind__: "ok";
    ok: AIGeneration;
} | {
    __kind__: "err";
    err: string;
};
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface AIGenerationParams {
    goal: string;
    tone: string;
    audience: string;
    platform: string;
    niche: string;
}
export interface AIGeneration {
    id: bigint;
    goal: string;
    createdAt: Timestamp;
    tone: string;
    audience: string;
    platform: string;
    saved: boolean;
    userPrincipal: UserId;
    niche: string;
    outputText: string;
    favorite: boolean;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface http_header {
    value: string;
    name: string;
}
export type UserId = Principal;
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export type Result_3 = {
    __kind__: "ok";
    ok: UserProfile;
} | {
    __kind__: "err";
    err: string;
};
export type Result = {
    __kind__: "ok";
    ok: boolean;
} | {
    __kind__: "err";
    err: string;
};
export interface UserSettings {
    temperature: number;
    aiModel: string;
    darkMode: boolean;
    focusDuration: bigint;
    maxTokens: bigint;
    breakDuration: bigint;
}
export interface DashboardMetrics {
    weeklyContentCount: bigint;
    productivityScore: bigint;
    focusHoursThisWeek: number;
    recentGenerations: Array<AIGeneration>;
    taskCompletionRate: number;
    contentStreak: bigint;
    nextScheduledContent?: ContentItem;
}
export interface DailyTask {
    id: bigint;
    title: string;
    completed: boolean;
    createdDate: Timestamp;
    userPrincipal: UserId;
}
export interface UserProfile {
    principal: UserId;
    displayName: string;
    createdAt: Timestamp;
    tier: SubscriptionTier;
    email: string;
    updatedAt: Timestamp;
}
export enum ContentStatus {
    Idea = "Idea",
    Posted = "Posted",
    Scheduled = "Scheduled",
    Scripting = "Scripting",
    Editing = "Editing"
}
export enum Platform {
    Blog = "Blog",
    TikTok = "TikTok",
    YouTube = "YouTube",
    Other = "Other",
    Instagram = "Instagram",
    Twitter = "Twitter"
}
export enum SessionType {
    Break = "Break",
    Focus = "Focus"
}
export enum SubscriptionTier {
    Pro = "Pro",
    Elite = "Elite",
    Free = "Free"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createContentItem(title: string, platform: Platform, status: ContentStatus, deadline: Timestamp | null, notes: string): Promise<Result_1>;
    createDailyTask(title: string, date: Timestamp): Promise<Result_5>;
    createGeneration(params: AIGenerationParams): Promise<Result_4>;
    createOrUpdateUser(displayName: string, email: string): Promise<Result_3>;
    deleteContentItem(id: bigint): Promise<Result>;
    deleteDailyTask(id: bigint): Promise<Result>;
    getCallerUserRole(): Promise<UserRole>;
    getDashboardMetrics(): Promise<DashboardMetrics>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isOpenAIConfigured(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    listContentItems(): Promise<Array<ContentItem>>;
    listDailyTasks(date: Timestamp): Promise<Array<DailyTask>>;
    listGenerations(): Promise<Array<AIGeneration>>;
    listProductivitySessions(limit: bigint): Promise<Array<ProductivitySession>>;
    logProductivitySession(durationMinutes: bigint, sessionType: SessionType): Promise<Result_2>;
    setOpenAIApiKey(key: string): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    toggleDailyTask(id: bigint): Promise<Result>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateContentItem(id: bigint, title: string, platform: Platform, status: ContentStatus, deadline: Timestamp | null, notes: string): Promise<Result_1>;
    updateGenerationFavorite(id: bigint, favorite: boolean): Promise<Result>;
    updateGenerationSaved(id: bigint, saved: boolean): Promise<Result>;
    updateSubscriptionTier(target: Principal, tier: SubscriptionTier, stripeSubId: string, stripeCustomerId: string, periodStart: Timestamp, periodEnd: Timestamp): Promise<Result>;
    updateUserSettings(newSettings: UserSettings): Promise<Result>;
}
