import { createActor } from "@/backend";
import {
  normalizeAIGeneration,
  normalizeContentItem,
  normalizeDailyTask,
  normalizeDashboardMetrics,
  normalizeProductivitySession,
  normalizeUserProfile,
  normalizeUserSettings,
} from "@/lib/backend";
import type { UserSettings } from "@/types";
import type {
  AIGeneration,
  ContentItem,
  DailyTask,
  DashboardMetrics,
  ProductivitySession,
  UserProfile,
} from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ─── Actor hook ───────────────────────────────────────────────────────────────

function useBackendActor() {
  return useActor(createActor);
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useUserProfile() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<UserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      const raw = await (actor as any).getUserProfile();
      if (!raw || raw.length === 0) return null;
      return normalizeUserProfile(raw[0] ?? raw);
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUserSettings() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<UserSettings | null>({
    queryKey: ["userSettings"],
    queryFn: async () => {
      if (!actor) return null;
      const raw = await (actor as any).getUserSettings();
      if (!raw || raw.length === 0) return null;
      return normalizeUserSettings(raw[0] ?? raw);
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardMetrics() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<DashboardMetrics | null>({
    queryKey: ["dashboardMetrics"],
    queryFn: async () => {
      if (!actor) return null;
      const raw = await (actor as any).getDashboardMetrics();
      if (!raw) return null;
      return normalizeDashboardMetrics(raw);
    },
    enabled: !!actor && !isFetching,
    staleTime: 60 * 1000,
  });
}

export function useGenerations() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<AIGeneration[]>({
    queryKey: ["generations"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await (actor as any).listGenerations();
      return (raw as unknown[]).map(normalizeAIGeneration);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useContentItems() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<ContentItem[]>({
    queryKey: ["contentItems"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await (actor as any).listContentItems();
      return (raw as unknown[]).map(normalizeContentItem);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProductivitySessions() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<ProductivitySession[]>({
    queryKey: ["productivitySessions"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await (actor as any).listProductivitySessions();
      return (raw as unknown[]).map(normalizeProductivitySession);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDailyTasks() {
  const { actor, isFetching } = useBackendActor();
  return useQuery<DailyTask[]>({
    queryKey: ["dailyTasks"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await (actor as any).listDailyTasks();
      return (raw as unknown[]).map(normalizeDailyTask);
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useUpdateUserSettings() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: UserSettings) => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).updateUserSettings(
        settings.aiModel,
        settings.temperature,
        settings.maxTokens,
        settings.focusDuration,
        settings.breakDuration,
        settings.darkMode,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userSettings"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useCreateOrUpdateUser() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { displayName: string; email: string }) => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).createOrUpdateUser(params.displayName, params.email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useToggleDailyTask() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).toggleDailyTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyTasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    },
  });
}

export function useCreateDailyTask() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (title: string) => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).createDailyTask(title);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyTasks"] });
    },
  });
}

export function useDeleteDailyTask() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (taskId: bigint) => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).deleteDailyTask(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dailyTasks"] });
    },
  });
}

export function useCreateContentItem() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      title: string;
      platform: string;
      status: string;
      deadline?: bigint;
      notes: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).createContentItem(
        params.title,
        { [params.platform]: null },
        { [params.status]: null },
        params.deadline != null ? [params.deadline] : [],
        params.notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentItems"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    },
  });
}

export function useUpdateContentItem() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      id: bigint;
      title: string;
      platform: string;
      status: string;
      deadline?: bigint;
      notes: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).updateContentItem(
        params.id,
        params.title,
        { [params.platform]: null },
        { [params.status]: null },
        params.deadline != null ? [params.deadline] : [],
        params.notes,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentItems"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    },
  });
}

export function useDeleteContentItem() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).deleteContentItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentItems"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    },
  });
}

export function useLogProductivitySession() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      durationMinutes: bigint;
      sessionType: "Focus" | "Break";
    }) => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).logProductivitySession(params.durationMinutes, {
        [params.sessionType]: null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productivitySessions"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    },
  });
}

export function useCreateGeneration() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      niche: string;
      platform: string;
      audience: string;
      tone: string;
      goal: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      const raw = await (actor as any).createGeneration(
        params.niche,
        params.platform,
        params.audience,
        params.tone,
        params.goal,
      );
      return normalizeAIGeneration(raw);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    },
  });
}

export function useUpdateGenerationSaved() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: bigint; saved: boolean }) => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).updateGenerationSaved(params.id, params.saved);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generations"] });
    },
  });
}

export function useUpdateGenerationFavorite() {
  const { actor } = useBackendActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (params: { id: bigint; favorite: boolean }) => {
      if (!actor) throw new Error("Not connected");
      await (actor as any).updateGenerationFavorite(params.id, params.favorite);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["generations"] });
    },
  });
}
