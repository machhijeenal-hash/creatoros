import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCreateGeneration,
  useGenerations,
  useUpdateGenerationFavorite,
  useUpdateGenerationSaved,
} from "@/hooks/useBackend";
import type { AIGeneration } from "@/types";
import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  BookmarkCheck,
  Check,
  ClipboardCopy,
  Heart,
  Loader2,
  RefreshCw,
  Sparkles,
  Square,
  Wand2,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface GenForm {
  niche: string;
  platform: string;
  audience: string;
  tone: string;
  goal: string;
}

const INITIAL_FORM: GenForm = {
  niche: "",
  platform: "",
  audience: "",
  tone: "",
  goal: "",
};

const PLATFORMS = [
  "YouTube",
  "TikTok",
  "Instagram",
  "Twitter",
  "Blog",
] as const;
const TONES = [
  "Professional",
  "Casual",
  "Humorous",
  "Inspirational",
  "Educational",
] as const;
const GOALS = [
  "Viral Hook",
  "Content Ideas",
  "Script Outline",
  "Caption",
  "CTA Copy",
] as const;

const SUGGESTIONS = [
  {
    icon: "🎬",
    label: "YouTube Script",
    niche: "tech",
    platform: "YouTube",
    tone: "Educational",
    goal: "Script Outline",
  },
  {
    icon: "🔥",
    label: "Viral TikTok Hook",
    niche: "fitness",
    platform: "TikTok",
    tone: "Inspirational",
    goal: "Viral Hook",
  },
  {
    icon: "✍️",
    label: "Instagram Caption",
    niche: "photography",
    platform: "Instagram",
    tone: "Casual",
    goal: "Caption",
  },
  {
    icon: "💡",
    label: "Content Ideas",
    niche: "business",
    platform: "Blog",
    tone: "Professional",
    goal: "Content Ideas",
  },
] as const;

// ─── Utility ──────────────────────────────────────────────────────────────────

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

// ─── History item ─────────────────────────────────────────────────────────────

function HistoryItem({
  gen,
  active,
  onClick,
}: {
  gen: AIGeneration;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-3 py-2.5 rounded-lg border transition-all duration-200 ${
        active
          ? "border-primary bg-primary/10 text-foreground"
          : "border-border bg-card hover:border-primary/40 hover:bg-muted text-foreground"
      }`}
    >
      <div className="flex items-center justify-between gap-2 min-w-0">
        <span className="text-xs font-medium truncate text-muted-foreground">
          {gen.goal}
        </span>
        {gen.favorite && (
          <Heart className="w-3 h-3 shrink-0 text-secondary fill-secondary" />
        )}
      </div>
      <p className="text-sm font-medium truncate mt-0.5">
        {gen.niche} · {gen.platform}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">
        {formatDate(gen.createdAt)}
      </p>
    </button>
  );
}

// ─── Output panel ─────────────────────────────────────────────────────────────

interface OutputPanelProps {
  generation: AIGeneration | null;
  displayText: string;
  isTyping: boolean;
  isGenerating: boolean;
  onStop: () => void;
  onRegenerate: () => void;
  onCopy: () => void;
  onSave: () => void;
  onFavorite: () => void;
  copied: boolean;
}

function OutputPanel({
  generation,
  displayText,
  isTyping,
  isGenerating,
  onStop,
  onRegenerate,
  onCopy,
  onSave,
  onFavorite,
  copied,
}: OutputPanelProps) {
  if (!generation && !isGenerating && !displayText) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="h-full flex flex-col items-center justify-center gap-6 py-16"
        data-ocid="ai_studio.empty_state"
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: "oklch(0.56 0.22 262 / 0.15)",
            border: "1px solid oklch(0.56 0.22 262 / 0.3)",
          }}
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center max-w-sm">
          <h3 className="text-lg font-semibold font-display text-foreground mb-2">
            Start generating
          </h3>
          <p className="text-sm text-muted-foreground">
            Fill the form to create your first piece of AI content. Choose your
            niche, platform, and goal to get started.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {SUGGESTIONS.map((s) => (
            <div
              key={s.label}
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-border text-muted-foreground"
            >
              {s.icon} {s.label}
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-full" data-ocid="ai_studio.output_panel">
      {/* Action bar */}
      {(generation || displayText) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-4 flex-wrap"
        >
          {isTyping && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={onStop}
              className="gap-1.5"
              data-ocid="ai_studio.stop_button"
            >
              <Square className="w-3 h-3 fill-current" />
              Stop
            </Button>
          )}
          {!isTyping && !isGenerating && generation && (
            <>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onRegenerate}
                className="gap-1.5"
                data-ocid="ai_studio.regenerate_button"
              >
                <RefreshCw className="w-3 h-3" />
                Regenerate
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onCopy}
                className="gap-1.5"
                data-ocid="ai_studio.copy_button"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-primary" />
                ) : (
                  <ClipboardCopy className="w-3 h-3" />
                )}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant={generation.saved ? "default" : "outline"}
                onClick={onSave}
                className="gap-1.5"
                data-ocid="ai_studio.save_button"
              >
                {generation.saved ? (
                  <BookmarkCheck className="w-3 h-3" />
                ) : (
                  <Bookmark className="w-3 h-3" />
                )}
                {generation.saved ? "Saved" : "Save"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant={generation.favorite ? "default" : "outline"}
                onClick={onFavorite}
                className="gap-1.5"
                data-ocid="ai_studio.favorite_button"
              >
                <Heart
                  className={`w-3 h-3 ${generation.favorite ? "fill-current" : ""}`}
                />
                {generation.favorite ? "Favorited" : "Favorite"}
              </Button>
            </>
          )}
        </motion.div>
      )}

      {/* Output text */}
      <div
        className="flex-1 rounded-xl p-5 overflow-y-auto text-sm leading-relaxed prose-sm prose-invert max-w-none min-h-72"
        style={{
          background: "oklch(0.18 0 0 / 0.8)",
          border: "1px solid oklch(0.28 0 0 / 1)",
        }}
        data-ocid="ai_studio.output_text"
      >
        {isGenerating && !displayText ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
            <div className="relative w-12 h-12">
              <div
                className="w-12 h-12 rounded-full animate-spin"
                style={{
                  background:
                    "conic-gradient(from 0deg, oklch(0.56 0.22 262), oklch(0.52 0.18 297), oklch(0.56 0.22 262 / 0))",
                }}
              />
              <div className="absolute inset-1 rounded-full bg-card" />
            </div>
            <p
              className="text-sm text-muted-foreground animate-pulse"
              data-ocid="ai_studio.loading_state"
            >
              Generating your content…
            </p>
          </div>
        ) : displayText ? (
          <div className="text-foreground">
            <ReactMarkdown>{displayText}</ReactMarkdown>
            {isTyping && (
              <span
                className="inline-block w-0.5 h-4 ml-0.5 align-middle animate-pulse"
                style={{ background: "oklch(0.56 0.22 262)" }}
              />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AIStudio() {
  const [form, setForm] = useState<GenForm>(INITIAL_FORM);
  const [activeGen, setActiveGen] = useState<AIGeneration | null>(null);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [historyFilter, setHistoryFilter] = useState<"all" | "saved">("all");
  const typewriterRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wordsRef = useRef<string[]>([]);

  const { data: history = [] } = useGenerations();
  const createGen = useCreateGeneration();
  const updateSaved = useUpdateGenerationSaved();
  const updateFavorite = useUpdateGenerationFavorite();

  const filteredHistory =
    historyFilter === "saved" ? history.filter((g) => g.saved) : history;

  // Start typewriter after response
  const startTypewriter = useCallback((text: string, gen: AIGeneration) => {
    if (typewriterRef.current) clearInterval(typewriterRef.current);
    const words = text.split(" ");
    wordsRef.current = words;
    setActiveGen(gen);
    setDisplayText("");
    setIsTyping(true);

    let idx = 0;
    typewriterRef.current = setInterval(() => {
      idx += 1;
      setDisplayText(words.slice(0, idx).join(" "));
      if (idx >= words.length) {
        if (typewriterRef.current) clearInterval(typewriterRef.current);
        setIsTyping(false);
      }
    }, 25);
  }, []);

  useEffect(() => {
    return () => {
      if (typewriterRef.current) clearInterval(typewriterRef.current);
    };
  }, []);

  function stopTypewriter() {
    if (typewriterRef.current) clearInterval(typewriterRef.current);
    setDisplayText(wordsRef.current.join(" "));
    setIsTyping(false);
  }

  const isFormValid =
    form.niche.trim() &&
    form.platform &&
    form.audience.trim() &&
    form.tone &&
    form.goal;

  async function handleGenerate() {
    if (!isFormValid) return;
    if (typewriterRef.current) clearInterval(typewriterRef.current);
    setDisplayText("");
    setIsTyping(false);
    setActiveGen(null);

    try {
      const gen = await createGen.mutateAsync({
        niche: form.niche,
        platform: form.platform,
        audience: form.audience,
        tone: form.tone,
        goal: form.goal,
      });

      if (gen.outputText.toLowerCase().includes("limit")) {
        toast.error(
          "Free tier limit reached. Upgrade to Pro in Subscriptions.",
        );
        setDisplayText(gen.outputText);
        setActiveGen(gen);
        return;
      }

      startTypewriter(gen.outputText, gen);
    } catch {
      toast.error("Generation failed. Please try again.");
    }
  }

  function loadFromHistory(gen: AIGeneration) {
    if (typewriterRef.current) clearInterval(typewriterRef.current);
    setIsTyping(false);
    setActiveGen(gen);
    setDisplayText(gen.outputText);
    setForm({
      niche: gen.niche,
      platform: gen.platform,
      audience: gen.audience,
      tone: gen.tone,
      goal: gen.goal,
    });
  }

  async function handleCopy() {
    if (!displayText) return;
    await navigator.clipboard.writeText(displayText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSave() {
    if (!activeGen) return;
    await updateSaved.mutateAsync({
      id: activeGen.id,
      saved: !activeGen.saved,
    });
    setActiveGen((g) => (g ? { ...g, saved: !g.saved } : g));
  }

  async function handleFavorite() {
    if (!activeGen) return;
    await updateFavorite.mutateAsync({
      id: activeGen.id,
      favorite: !activeGen.favorite,
    });
    setActiveGen((g) => (g ? { ...g, favorite: !g.favorite } : g));
  }

  function applySuggestion(s: (typeof SUGGESTIONS)[number]) {
    setForm((f) => ({
      ...f,
      niche: s.niche,
      platform: s.platform,
      tone: s.tone,
      goal: s.goal,
    }));
  }

  return (
    <div className="h-full flex flex-col" data-ocid="ai_studio.page">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "oklch(0.56 0.22 262 / 0.15)",
              border: "1px solid oklch(0.56 0.22 262 / 0.3)",
            }}
          >
            <Wand2 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display text-foreground leading-none">
              AI Studio
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Generate content with AI
            </p>
          </div>
        </div>
        <Badge variant="outline" className="gap-1 text-xs">
          <Zap className="w-3 h-3 text-primary" />
          Powered by GPT-4o
        </Badge>
      </div>

      {/* Body — 2-column */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Left panel — form + history */}
        <div
          className="w-full lg:w-[360px] shrink-0 flex flex-col border-b lg:border-b-0 lg:border-r border-border overflow-y-auto"
          data-ocid="ai_studio.left_panel"
        >
          {/* Generation form */}
          <div className="p-5 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground mb-4">
              Generation Settings
            </h2>
            <div className="space-y-3">
              <div>
                <Label
                  htmlFor="niche"
                  className="text-xs text-muted-foreground mb-1.5 block"
                >
                  Niche / Topic
                </Label>
                <Input
                  id="niche"
                  placeholder="e.g. tech, fitness, finance…"
                  value={form.niche}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, niche: e.target.value }))
                  }
                  className="h-9 text-sm"
                  data-ocid="ai_studio.niche_input"
                />
              </div>

              <div>
                <Label
                  htmlFor="platform"
                  className="text-xs text-muted-foreground mb-1.5 block"
                >
                  Platform
                </Label>
                <Select
                  value={form.platform}
                  onValueChange={(v) => setForm((f) => ({ ...f, platform: v }))}
                >
                  <SelectTrigger
                    id="platform"
                    className="h-9 text-sm"
                    data-ocid="ai_studio.platform_select"
                  >
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="audience"
                  className="text-xs text-muted-foreground mb-1.5 block"
                >
                  Target Audience
                </Label>
                <Input
                  id="audience"
                  placeholder="e.g. beginner creators, 25–35…"
                  value={form.audience}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, audience: e.target.value }))
                  }
                  className="h-9 text-sm"
                  data-ocid="ai_studio.audience_input"
                />
              </div>

              <div>
                <Label
                  htmlFor="tone"
                  className="text-xs text-muted-foreground mb-1.5 block"
                >
                  Tone
                </Label>
                <Select
                  value={form.tone}
                  onValueChange={(v) => setForm((f) => ({ ...f, tone: v }))}
                >
                  <SelectTrigger
                    id="tone"
                    className="h-9 text-sm"
                    data-ocid="ai_studio.tone_select"
                  >
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label
                  htmlFor="goal"
                  className="text-xs text-muted-foreground mb-1.5 block"
                >
                  Content Goal
                </Label>
                <Select
                  value={form.goal}
                  onValueChange={(v) => setForm((f) => ({ ...f, goal: v }))}
                >
                  <SelectTrigger
                    id="goal"
                    className="h-9 text-sm"
                    data-ocid="ai_studio.goal_select"
                  >
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {GOALS.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Generate button */}
              <div className="pt-1">
                <Button
                  type="button"
                  className="w-full gap-2 font-semibold relative overflow-hidden"
                  disabled={!isFormValid || createGen.isPending}
                  onClick={handleGenerate}
                  data-ocid="ai_studio.generate_button"
                  style={
                    createGen.isPending
                      ? {
                          backgroundImage:
                            "linear-gradient(90deg, oklch(0.56 0.22 262), oklch(0.52 0.18 297), oklch(0.56 0.22 262))",
                          backgroundSize: "200% 100%",
                          animation: "shimmer 1.5s linear infinite",
                        }
                      : undefined
                  }
                >
                  {createGen.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {createGen.isPending ? "Generating…" : "Generate Content"}
                </Button>

                {/* Quick suggestions */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => applySuggestion(s)}
                      className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                    >
                      {s.icon} {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* History sidebar */}
          <div
            className="flex-1 flex flex-col p-4 min-h-0"
            data-ocid="ai_studio.history_panel"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-foreground">History</h2>
              <span className="text-xs text-muted-foreground">
                {filteredHistory.length}
              </span>
            </div>

            <Tabs
              value={historyFilter}
              onValueChange={(v) => setHistoryFilter(v as "all" | "saved")}
              className="mb-3"
            >
              <TabsList className="h-7">
                <TabsTrigger
                  value="all"
                  className="text-xs h-6 px-3"
                  data-ocid="ai_studio.history_all_tab"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="saved"
                  className="text-xs h-6 px-3"
                  data-ocid="ai_studio.history_saved_tab"
                >
                  Saved
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex-1 overflow-y-auto space-y-1.5">
              <AnimatePresence initial={false}>
                {filteredHistory.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-8 text-center text-xs text-muted-foreground"
                    data-ocid="ai_studio.history_empty_state"
                  >
                    {historyFilter === "saved"
                      ? "No saved generations yet"
                      : "No generations yet"}
                  </motion.div>
                ) : (
                  filteredHistory.map((gen, i) => (
                    <motion.div
                      key={String(gen.id)}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      data-ocid={`ai_studio.history_item.${i + 1}`}
                    >
                      <HistoryItem
                        gen={gen}
                        active={activeGen?.id === gen.id}
                        onClick={() => loadFromHistory(gen)}
                      />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right panel — output */}
        <div
          className="flex-1 p-5 overflow-y-auto"
          data-ocid="ai_studio.right_panel"
        >
          <OutputPanel
            generation={activeGen}
            displayText={displayText}
            isTyping={isTyping}
            isGenerating={createGen.isPending}
            onStop={stopTypewriter}
            onRegenerate={handleGenerate}
            onCopy={handleCopy}
            onSave={handleSave}
            onFavorite={handleFavorite}
            copied={copied}
          />
        </div>
      </div>
    </div>
  );
}
