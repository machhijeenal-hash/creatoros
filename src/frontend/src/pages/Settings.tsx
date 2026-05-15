import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  useCreateOrUpdateUser,
  useUpdateUserSettings,
  useUserProfile,
  useUserSettings,
} from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import type { UserSettings } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Check,
  ChevronRight,
  Cpu,
  CreditCard,
  Loader2,
  Palette,
  Shield,
  Timer,
  Trash2,
  User,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type SettingsSection =
  | "profile"
  | "ai-preferences"
  | "timer"
  | "appearance"
  | "subscription"
  | "danger-zone";

interface NavItem {
  id: SettingsSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  danger?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "ai-preferences", label: "AI Preferences", icon: Cpu },
  { id: "timer", label: "Timer", icon: Timer },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "danger-zone", label: "Danger Zone", icon: Trash2, danger: true },
];

const TIER_COLORS: Record<string, string> = {
  Free: "bg-muted text-muted-foreground border-border",
  Pro: "bg-primary/15 text-primary border-primary/30",
  Elite: "bg-secondary/15 text-secondary border-secondary/30",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  children,
  className,
}: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn("glass rounded-2xl p-6 border border-white/10", className)}
    >
      {children}
    </div>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 mt-0.5">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <h2 className="font-display font-semibold text-base text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function NumberStepper({
  value,
  onChange,
  min,
  max,
  unit,
  id,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  unit: string;
  id: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="w-8 h-8 rounded-lg border-border/60 text-foreground"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        data-ocid={`${id}_decrement`}
      >
        −
      </Button>
      <div className="w-16 h-8 rounded-lg border border-border/60 bg-card flex items-center justify-center font-mono text-sm text-foreground">
        {value}
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="w-8 h-8 rounded-lg border-border/60 text-foreground"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        data-ocid={`${id}_increment`}
      >
        +
      </Button>
      <span className="text-xs text-muted-foreground">{unit}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Settings() {
  const [activeSection, setActiveSection] =
    useState<SettingsSection>("profile");

  // Profile state
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: settings, isLoading: settingsLoading } = useUserSettings();
  const updateSettingsMutation = useUpdateUserSettings();
  const updateProfileMutation = useCreateOrUpdateUser();

  const [displayName, setDisplayName] = useState("");
  const [aiModel, setAiModel] = useState("gpt-4");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [darkMode, setDarkMode] = useState(true);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const deleteInputRef = useRef<HTMLInputElement>(null);

  // Sync state from backend
  useEffect(() => {
    if (profile) setDisplayName(profile.displayName ?? "");
  }, [profile]);

  useEffect(() => {
    if (settings) {
      setAiModel(settings.aiModel ?? "gpt-4");
      setTemperature(settings.temperature ?? 0.7);
      setMaxTokens(Number(settings.maxTokens) || 2000);
      setFocusDuration(Number(settings.focusDuration) || 25);
      setBreakDuration(Number(settings.breakDuration) || 5);
      setDarkMode(settings.darkMode ?? true);
    }
  }, [settings]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // ─── Save handlers ────────────────────────────────────────────────────────

  async function saveProfile() {
    try {
      await updateProfileMutation.mutateAsync({
        displayName,
        email: profile?.email ?? "",
      });
      toast.success("Profile saved successfully");
    } catch {
      toast.error("Failed to save profile");
    }
  }

  async function saveAIPreferences() {
    const base = buildSettingsPayload();
    try {
      await updateSettingsMutation.mutateAsync({
        ...base,
        aiModel,
        temperature,
        maxTokens: BigInt(maxTokens),
      });
      toast.success("AI preferences saved");
    } catch {
      toast.error("Failed to save AI preferences");
    }
  }

  async function saveTimerPreferences() {
    const base = buildSettingsPayload();
    try {
      await updateSettingsMutation.mutateAsync({
        ...base,
        focusDuration: BigInt(focusDuration),
        breakDuration: BigInt(breakDuration),
      });
      toast.success("Timer preferences saved");
    } catch {
      toast.error("Failed to save timer preferences");
    }
  }

  async function saveAppearance() {
    const base = buildSettingsPayload();
    try {
      await updateSettingsMutation.mutateAsync({ ...base, darkMode });
      toast.success("Appearance saved");
    } catch {
      toast.error("Failed to save appearance");
    }
  }

  function buildSettingsPayload(): UserSettings {
    return {
      aiModel,
      temperature,
      maxTokens: BigInt(maxTokens),
      focusDuration: BigInt(focusDuration),
      breakDuration: BigInt(breakDuration),
      darkMode,
    };
  }

  // ─── Render ─────────────────────────────────────────────────────────────

  const isSaving =
    updateSettingsMutation.isPending || updateProfileMutation.isPending;
  const isLoading = profileLoading || settingsLoading;

  return (
    <div className="min-h-screen p-6" data-ocid="settings.page">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">
            Settings
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your profile, preferences, and account.
          </p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar nav */}
          <aside className="w-56 shrink-0">
            <nav className="glass rounded-2xl border border-white/10 overflow-hidden">
              {NAV_ITEMS.map((item, i) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    data-ocid={`settings.nav.${item.id}`}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-sm transition-smooth text-left",
                      i < NAV_ITEMS.length - 1 && "border-b border-white/5",
                      isActive
                        ? item.danger
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/10 text-primary"
                        : item.danger
                          ? "text-destructive/70 hover:bg-destructive/5 hover:text-destructive"
                          : "text-muted-foreground hover:bg-card hover:text-foreground",
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1 font-medium">{item.label}</span>
                    {isActive && <ChevronRight className="w-3 h-3" />}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Content area */}
          <main className="flex-1 min-w-0">
            {isLoading ? (
              <div
                className="glass rounded-2xl border border-white/10 p-12 flex items-center justify-center"
                data-ocid="settings.loading_state"
              >
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* PROFILE */}
                  {activeSection === "profile" && (
                    <SectionCard>
                      <SectionTitle
                        icon={User}
                        title="Profile"
                        subtitle="Manage your public-facing identity"
                      />
                      <div className="space-y-5">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="displayName"
                            className="text-sm text-foreground/80"
                          >
                            Display Name
                          </Label>
                          <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Your creator name"
                            className="bg-card border-border/60 text-foreground placeholder:text-muted-foreground/50"
                            data-ocid="settings.profile.display_name_input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label
                            htmlFor="email"
                            className="text-sm text-foreground/80"
                          >
                            Email
                          </Label>
                          <Input
                            id="email"
                            value={profile?.email ?? ""}
                            readOnly
                            disabled
                            className="bg-muted border-border/40 text-muted-foreground cursor-not-allowed"
                            data-ocid="settings.profile.email_input"
                          />
                          <p className="text-xs text-muted-foreground/60">
                            Email is managed through your Internet Identity and
                            cannot be changed here.
                          </p>
                        </div>
                        <Separator className="bg-border/40" />
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            onClick={saveProfile}
                            disabled={isSaving || !displayName.trim()}
                            className="gap-2 glow-accent"
                            data-ocid="settings.profile.save_button"
                          >
                            {updateProfileMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            Save Profile
                          </Button>
                        </div>
                      </div>
                    </SectionCard>
                  )}

                  {/* AI PREFERENCES */}
                  {activeSection === "ai-preferences" && (
                    <SectionCard>
                      <SectionTitle
                        icon={Cpu}
                        title="AI Preferences"
                        subtitle="Tune how CreatorOS generates content for you"
                      />
                      <div className="space-y-7">
                        <div className="space-y-1.5">
                          <Label className="text-sm text-foreground/80">
                            AI Model
                          </Label>
                          <Select value={aiModel} onValueChange={setAiModel}>
                            <SelectTrigger
                              className="bg-card border-border/60 text-foreground"
                              data-ocid="settings.ai.model_select"
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover border-border">
                              <SelectItem value="gpt-4">
                                GPT-4 — Most capable
                              </SelectItem>
                              <SelectItem value="gpt-3.5-turbo">
                                GPT-3.5 Turbo — Faster &amp; lighter
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            GPT-4 produces higher quality outputs but uses more
                            tokens.
                          </p>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm text-foreground/80">
                              Temperature
                            </Label>
                            <span className="font-mono text-sm text-primary">
                              {temperature.toFixed(1)}
                            </span>
                          </div>
                          <Slider
                            min={0}
                            max={1}
                            step={0.1}
                            value={[temperature]}
                            onValueChange={([v]) => setTemperature(v)}
                            className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
                            data-ocid="settings.ai.temperature_slider"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground/60">
                            <span>Precise (0.0)</span>
                            <span>Creative (1.0)</span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label className="text-sm text-foreground/80">
                              Max Tokens
                            </Label>
                            <span className="font-mono text-sm text-primary">
                              {maxTokens.toLocaleString()}
                            </span>
                          </div>
                          <Slider
                            min={100}
                            max={4000}
                            step={100}
                            value={[maxTokens]}
                            onValueChange={([v]) => setMaxTokens(v)}
                            className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
                            data-ocid="settings.ai.max_tokens_slider"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground/60">
                            <span>100 tokens</span>
                            <span>4,000 tokens</span>
                          </div>
                        </div>

                        <Separator className="bg-border/40" />
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            onClick={saveAIPreferences}
                            disabled={isSaving}
                            className="gap-2 glow-accent"
                            data-ocid="settings.ai.save_button"
                          >
                            {updateSettingsMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            Save Preferences
                          </Button>
                        </div>
                      </div>
                    </SectionCard>
                  )}

                  {/* TIMER */}
                  {activeSection === "timer" && (
                    <SectionCard>
                      <SectionTitle
                        icon={Timer}
                        title="Timer Preferences"
                        subtitle="Configure your Pomodoro focus and break intervals"
                      />
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <Label className="text-sm text-foreground/80">
                            Focus Duration
                          </Label>
                          <NumberStepper
                            id="settings.timer.focus"
                            value={focusDuration}
                            onChange={setFocusDuration}
                            min={5}
                            max={60}
                            unit="minutes"
                          />
                          <p className="text-xs text-muted-foreground">
                            Recommended: 25 minutes for deep focus sessions.
                          </p>
                        </div>

                        <Separator className="bg-border/40" />

                        <div className="space-y-3">
                          <Label className="text-sm text-foreground/80">
                            Break Duration
                          </Label>
                          <NumberStepper
                            id="settings.timer.break"
                            value={breakDuration}
                            onChange={setBreakDuration}
                            min={1}
                            max={30}
                            unit="minutes"
                          />
                          <p className="text-xs text-muted-foreground">
                            Recommended: 5 minutes for short breaks.
                          </p>
                        </div>

                        <div className="rounded-xl bg-primary/5 border border-primary/15 p-4">
                          <div className="flex items-center gap-4">
                            <div className="p-2.5 rounded-lg bg-primary/10">
                              <Timer className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {focusDuration}m focus → {breakDuration}m break
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {Math.floor(
                                  60 / (focusDuration + breakDuration),
                                )}{" "}
                                full sessions per hour
                              </p>
                            </div>
                          </div>
                        </div>

                        <Separator className="bg-border/40" />
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            onClick={saveTimerPreferences}
                            disabled={isSaving}
                            className="gap-2 glow-accent"
                            data-ocid="settings.timer.save_button"
                          >
                            {updateSettingsMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            Save Timer
                          </Button>
                        </div>
                      </div>
                    </SectionCard>
                  )}

                  {/* APPEARANCE */}
                  {activeSection === "appearance" && (
                    <SectionCard>
                      <SectionTitle
                        icon={Palette}
                        title="Appearance"
                        subtitle="Customize how CreatorOS looks"
                      />
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border/60">
                          <div className="space-y-0.5">
                            <p className="text-sm font-medium text-foreground">
                              Dark Mode
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Enable the dark futuristic theme
                            </p>
                          </div>
                          <Switch
                            checked={darkMode}
                            onCheckedChange={setDarkMode}
                            className="data-[state=checked]:bg-primary"
                            data-ocid="settings.appearance.dark_mode_switch"
                          />
                        </div>

                        <div className="rounded-xl border border-border/40 overflow-hidden">
                          <div className="bg-card/60 px-4 py-2 border-b border-border/40">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Preview
                            </p>
                          </div>
                          <div
                            className={cn(
                              "p-4 transition-smooth",
                              darkMode
                                ? "bg-[oklch(0.145_0_0)]"
                                : "bg-[oklch(0.99_0_0)]",
                            )}
                          >
                            <div
                              className={cn(
                                "rounded-lg p-3 border transition-smooth",
                                darkMode
                                  ? "bg-[oklch(0.18_0_0)] border-white/10"
                                  : "bg-white border-black/10",
                              )}
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-primary" />
                                <p
                                  className={cn(
                                    "text-xs font-medium",
                                    darkMode ? "text-white" : "text-black",
                                  )}
                                >
                                  CreatorOS
                                </p>
                              </div>
                              <div
                                className={cn(
                                  "h-1.5 rounded-full w-2/3 mb-1",
                                  darkMode ? "bg-white/10" : "bg-black/10",
                                )}
                              />
                              <div
                                className={cn(
                                  "h-1.5 rounded-full w-1/2",
                                  darkMode ? "bg-white/10" : "bg-black/10",
                                )}
                              />
                            </div>
                          </div>
                        </div>

                        <Separator className="bg-border/40" />
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            onClick={saveAppearance}
                            disabled={isSaving}
                            className="gap-2 glow-accent"
                            data-ocid="settings.appearance.save_button"
                          >
                            {updateSettingsMutation.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            Save Appearance
                          </Button>
                        </div>
                      </div>
                    </SectionCard>
                  )}

                  {/* SUBSCRIPTION */}
                  {activeSection === "subscription" && (
                    <SectionCard>
                      <SectionTitle
                        icon={CreditCard}
                        title="Subscription"
                        subtitle="Manage your plan and billing"
                      />
                      <div className="space-y-6">
                        <div className="p-4 rounded-xl border border-border/60 bg-card/40">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Current Plan
                              </p>
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                                    TIER_COLORS[profile?.tier ?? "Free"],
                                  )}
                                  data-ocid="settings.subscription.tier_badge"
                                >
                                  {profile?.tier === "Pro" && (
                                    <Zap className="w-3 h-3 mr-1" />
                                  )}
                                  {profile?.tier === "Elite" && (
                                    <Shield className="w-3 h-3 mr-1" />
                                  )}
                                  {profile?.tier ?? "Free"}
                                </span>
                              </div>
                            </div>
                            {(profile?.tier === "Pro" ||
                              profile?.tier === "Elite") && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="border-border/60 text-foreground"
                                asChild
                                data-ocid="settings.subscription.manage_billing_button"
                              >
                                <Link to="/subscriptions">Manage Billing</Link>
                              </Button>
                            )}
                          </div>
                        </div>

                        {profile?.tier === "Free" && (
                          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-1.5 rounded-lg bg-primary/10">
                                <Zap className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  Unlock the full platform
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Unlimited AI, advanced analytics, and more
                                </p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              className="w-full glow-accent gap-2"
                              asChild
                              data-ocid="settings.subscription.upgrade_button"
                            >
                              <Link to="/subscriptions">
                                <Zap className="w-4 h-4" />
                                Upgrade Plan
                              </Link>
                            </Button>
                          </div>
                        )}

                        <div className="rounded-xl border border-border/30 divide-y divide-border/30">
                          {[
                            {
                              label: "Pro Plan",
                              price: "$19/mo",
                              desc: "Unlimited AI, advanced planner, analytics",
                            },
                            {
                              label: "Elite Plan",
                              price: "$49/mo",
                              desc: "Automation, team workspaces, premium AI",
                            },
                          ].map((plan) => (
                            <div
                              key={plan.label}
                              className="flex items-center justify-between px-4 py-3"
                            >
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {plan.label}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {plan.desc}
                                </p>
                              </div>
                              <span className="font-mono text-sm text-primary">
                                {plan.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </SectionCard>
                  )}

                  {/* DANGER ZONE */}
                  {activeSection === "danger-zone" && (
                    <SectionCard className="border-destructive/20">
                      <SectionTitle
                        icon={Trash2}
                        title="Danger Zone"
                        subtitle="Irreversible actions — proceed with caution"
                      />
                      <div className="space-y-4">
                        <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-4">
                          <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-destructive mb-1">
                                Delete Account
                              </p>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                Permanently deletes your account, all AI
                                generations, content plans, productivity data,
                                and settings. This action{" "}
                                <strong className="text-foreground">
                                  cannot be undone
                                </strong>
                                .
                              </p>
                            </div>
                          </div>
                        </div>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              type="button"
                              variant="destructive"
                              className="gap-2"
                              data-ocid="settings.danger.delete_account_button"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete My Account
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent
                            className="glass border-destructive/30 bg-card"
                            data-ocid="settings.danger.dialog"
                          >
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-foreground font-display flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-destructive" />
                                Delete Account?
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-muted-foreground">
                                This will permanently delete your CreatorOS
                                account and all associated data including AI
                                generations, content plans, and productivity
                                history.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="py-2">
                              <Label
                                htmlFor="deleteConfirm"
                                className="text-sm text-foreground mb-2 block"
                              >
                                Type{" "}
                                <span className="font-mono font-bold text-destructive">
                                  DELETE
                                </span>{" "}
                                to confirm
                              </Label>
                              <Input
                                ref={deleteInputRef}
                                id="deleteConfirm"
                                value={deleteConfirm}
                                onChange={(e) =>
                                  setDeleteConfirm(e.target.value)
                                }
                                placeholder="Type DELETE here"
                                className="border-destructive/40 bg-card font-mono"
                                data-ocid="settings.danger.confirm_input"
                              />
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel
                                className="border-border/60"
                                onClick={() => setDeleteConfirm("")}
                                data-ocid="settings.danger.cancel_button"
                              >
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                disabled={deleteConfirm !== "DELETE"}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-40"
                                onClick={() => {
                                  toast.error(
                                    "Account deletion requires contacting support.",
                                  );
                                  setDeleteConfirm("");
                                }}
                                data-ocid="settings.danger.confirm_button"
                              >
                                Delete Account
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </SectionCard>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </main>
        </div>
      </motion.div>
    </div>
  );
}
