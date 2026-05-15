import {
  useContentItems,
  useCreateContentItem,
  useDeleteContentItem,
  useUpdateContentItem,
} from "@/hooks/useBackend";
import type { ContentItem, ContentPlatform, ContentStatus } from "@/types";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FilePlus2,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUSES: ContentStatus[] = [
  "Idea",
  "Scripting",
  "Editing",
  "Scheduled",
  "Posted",
];

const STATUS_CONFIG: Record<
  ContentStatus,
  { label: string; color: string; glow: string; dot: string }
> = {
  Idea: {
    label: "Idea",
    color: "border-white/10 text-muted-foreground",
    glow: "rgba(255,255,255,0.04)",
    dot: "bg-muted-foreground",
  },
  Scripting: {
    label: "Scripting",
    color: "border-blue-500/30 text-blue-400",
    glow: "rgba(59,130,246,0.08)",
    dot: "bg-blue-400",
  },
  Editing: {
    label: "Editing",
    color: "border-amber-500/30 text-amber-400",
    glow: "rgba(251,191,36,0.08)",
    dot: "bg-amber-400",
  },
  Scheduled: {
    label: "Scheduled",
    color: "border-purple-500/30 text-purple-400",
    glow: "rgba(168,85,247,0.08)",
    dot: "bg-purple-400",
  },
  Posted: {
    label: "Posted",
    color: "border-emerald-500/30 text-emerald-400",
    glow: "rgba(52,211,153,0.08)",
    dot: "bg-emerald-400",
  },
};

const PLATFORMS: ContentPlatform[] = [
  "YouTube",
  "TikTok",
  "Instagram",
  "Twitter",
  "Blog",
  "Other",
];

const PLATFORM_CONFIG: Record<
  ContentPlatform,
  { label: string; color: string }
> = {
  YouTube: {
    label: "YouTube",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  TikTok: {
    label: "TikTok",
    color: "bg-white/10 text-white/80 border-white/20",
  },
  Instagram: {
    label: "Instagram",
    color: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  },
  Twitter: {
    label: "Twitter",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  Blog: {
    label: "Blog",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  Other: {
    label: "Other",
    color: "bg-muted/50 text-muted-foreground border-border",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDeadline(ts: bigint | undefined): string {
  if (ts == null || ts === 0n) return "";
  const ms = Number(ts) / 1_000_000;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function dateToNano(dateStr: string): bigint | undefined {
  if (!dateStr) return undefined;
  const ms = new Date(dateStr).getTime();
  if (Number.isNaN(ms)) return undefined;
  return BigInt(ms) * 1_000_000n;
}

// ─── Content Form Modal ───────────────────────────────────────────────────────

interface ContentFormData {
  title: string;
  platform: ContentPlatform;
  status: ContentStatus;
  deadline: string;
  notes: string;
}

const DEFAULT_FORM: ContentFormData = {
  title: "",
  platform: "YouTube",
  status: "Idea",
  deadline: "",
  notes: "",
};

interface ContentModalProps {
  item?: ContentItem;
  open: boolean;
  defaultStatus?: ContentStatus;
  onClose: () => void;
}

function ContentModal({
  item,
  open,
  defaultStatus,
  onClose,
}: ContentModalProps) {
  const createMutation = useCreateContentItem();
  const updateMutation = useUpdateContentItem();
  const deleteMutation = useDeleteContentItem();

  const [form, setForm] = useState<ContentFormData>(DEFAULT_FORM);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally resets form when modal opens/closes
  useEffect(() => {
    if (item) {
      setForm({
        title: item.title,
        platform: item.platform,
        status: item.status,
        deadline: item.deadline
          ? (() => {
              const ms = Number(item.deadline) / 1_000_000;
              const d = new Date(ms);
              return Number.isNaN(d.getTime())
                ? ""
                : d.toISOString().split("T")[0];
            })()
          : "",
        notes: item.notes,
      });
    } else {
      setForm({ ...DEFAULT_FORM, status: defaultStatus ?? "Idea" });
    }
    setConfirmDelete(false);
  }, [item, open, defaultStatus]);

  if (!open) return null;

  const isLoading =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    try {
      if (item) {
        await updateMutation.mutateAsync({
          id: item.id,
          title: form.title.trim(),
          platform: form.platform,
          status: form.status,
          deadline: dateToNano(form.deadline),
          notes: form.notes,
        });
        toast.success("Content updated");
      } else {
        await createMutation.mutateAsync({
          title: form.title.trim(),
          platform: form.platform,
          status: form.status,
          deadline: dateToNano(form.deadline),
          notes: form.notes,
        });
        toast.success("Content added to pipeline");
      }
      onClose();
    } catch {
      toast.error("Failed to save content item");
    }
  };

  const handleDelete = async () => {
    if (!item) return;
    try {
      await deleteMutation.mutateAsync(item.id);
      toast.success("Content deleted");
      onClose();
    } catch {
      toast.error("Failed to delete content item");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        key="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          key="modal-panel"
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-lg rounded-2xl border border-white/10 bg-card/95 backdrop-blur-xl shadow-2xl"
          data-ocid="content_planner.dialog"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/8">
            <h2 className="font-display font-semibold text-foreground text-base">
              {item ? "Edit Content" : "Add Content"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/8 transition-smooth"
              data-ocid="content_planner.close_button"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label
                htmlFor="input-title"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Title <span className="text-destructive">*</span>
              </label>
              <input
                id="input-title"
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="e.g. The complete guide to YouTube SEO"
                className="w-full rounded-xl bg-muted/50 border border-white/10 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-smooth"
                data-ocid="content_planner.input"
              />
            </div>

            {/* Platform + Status row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="input-platform"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Platform
                </label>
                <select
                  id="input-platform"
                  value={form.platform}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      platform: e.target.value as ContentPlatform,
                    }))
                  }
                  className="w-full rounded-xl bg-muted/50 border border-white/10 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-smooth"
                  data-ocid="content_planner.select"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="input-status"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Status
                </label>
                <select
                  id="input-status"
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      status: e.target.value as ContentStatus,
                    }))
                  }
                  className="w-full rounded-xl bg-muted/50 border border-white/10 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-smooth"
                  data-ocid="content_planner.select"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Deadline */}
            <div className="space-y-1.5">
              <label
                htmlFor="input-deadline"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Deadline
              </label>
              <input
                id="input-deadline"
                type="date"
                value={form.deadline}
                onChange={(e) =>
                  setForm((f) => ({ ...f, deadline: e.target.value }))
                }
                className="w-full rounded-xl bg-muted/50 border border-white/10 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-smooth"
                data-ocid="content_planner.input"
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label
                htmlFor="input-notes"
                className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                Notes
              </label>
              <textarea
                id="input-notes"
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                placeholder="Ideas, key points, references..."
                rows={3}
                className="w-full rounded-xl bg-muted/50 border border-white/10 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-smooth resize-none"
                data-ocid="content_planner.textarea"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              {item ? (
                confirmDelete ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-destructive">
                      Delete this item?
                    </span>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isLoading}
                      className="px-3 py-1.5 rounded-lg bg-destructive/20 border border-destructive/40 text-destructive text-xs font-medium hover:bg-destructive/30 transition-smooth disabled:opacity-50"
                      data-ocid="content_planner.confirm_button"
                    >
                      Yes, delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-3 py-1.5 rounded-lg bg-muted/50 border border-white/10 text-muted-foreground text-xs font-medium hover:text-foreground transition-smooth"
                      data-ocid="content_planner.cancel_button"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-smooth"
                    data-ocid="content_planner.delete_button"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                )
              ) : (
                <div />
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-muted/50 border border-white/10 text-sm text-muted-foreground hover:text-foreground transition-smooth"
                  data-ocid="content_planner.cancel_button"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-smooth disabled:opacity-50 glow-accent"
                  data-ocid="content_planner.submit_button"
                >
                  {isLoading
                    ? "Saving..."
                    : item
                      ? "Save Changes"
                      : "Add to Pipeline"}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Content Card ─────────────────────────────────────────────────────────────

interface ContentCardProps {
  item: ContentItem;
  index: number;
  onStatusChange: (item: ContentItem, newStatus: ContentStatus) => void;
  onEdit: (item: ContentItem) => void;
}

function ContentCard({
  item,
  index,
  onStatusChange,
  onEdit,
}: ContentCardProps) {
  const currentIdx = STATUSES.indexOf(item.status);
  const prevStatus = currentIdx > 0 ? STATUSES[currentIdx - 1] : null;
  const nextStatus =
    currentIdx < STATUSES.length - 1 ? STATUSES[currentIdx + 1] : null;
  const platform = PLATFORM_CONFIG[item.platform];
  const deadline = formatDeadline(item.deadline);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.22, delay: index * 0.04 }}
      className="glass rounded-xl border border-white/8 group relative overflow-hidden"
      data-ocid={`content_planner.item.${index + 1}`}
    >
      <button
        type="button"
        onClick={() => onEdit(item)}
        className="w-full text-left p-3.5 cursor-pointer block"
        aria-label={`Edit: ${item.title}`}
      >
        {/* Platform badge */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${platform.color}`}
          >
            {platform.label}
          </span>
          {deadline && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <CalendarDays className="w-3 h-3" />
              {deadline}
            </span>
          )}
        </div>

        {/* Title */}
        <p className="text-sm font-medium text-foreground leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-200">
          {item.title}
        </p>

        {/* Notes preview */}
        {item.notes && (
          <p className="text-[11px] text-muted-foreground line-clamp-2">
            {item.notes}
          </p>
        )}
      </button>

      {/* Move arrows */}
      <div
        className="flex items-center gap-1 px-3.5 pb-3"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="presentation"
      >
        {prevStatus && (
          <button
            type="button"
            onClick={() => onStatusChange(item, prevStatus)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground text-[10px] transition-smooth"
            title={`Move to ${prevStatus}`}
          >
            <ChevronLeft className="w-3 h-3" />
            {prevStatus}
          </button>
        )}
        <div className="flex-1" />
        {nextStatus && (
          <button
            type="button"
            onClick={() => onStatusChange(item, nextStatus)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[10px] transition-smooth border border-primary/20"
            title={`Move to ${nextStatus}`}
          >
            {nextStatus}
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Kanban Column ────────────────────────────────────────────────────────────

interface KanbanColumnProps {
  status: ContentStatus;
  items: ContentItem[];
  onStatusChange: (item: ContentItem, newStatus: ContentStatus) => void;
  onEdit: (item: ContentItem) => void;
  onAddNew: (status: ContentStatus) => void;
}

function KanbanColumn({
  status,
  items,
  onStatusChange,
  onEdit,
  onAddNew,
}: KanbanColumnProps) {
  const cfg = STATUS_CONFIG[status];

  return (
    <div
      className="flex flex-col min-w-[260px] max-w-[280px] flex-shrink-0"
      data-ocid={`content_planner.${status.toLowerCase()}_column`}
    >
      {/* Column header */}
      <div
        className={`flex items-center justify-between px-3 py-2.5 rounded-t-2xl border ${cfg.color} border-b-0 mb-0`}
        style={{ background: cfg.glow }}
      >
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <span className="text-xs font-semibold uppercase tracking-wider">
            {cfg.label}
          </span>
        </div>
        <span className="text-xs font-mono text-muted-foreground bg-white/8 px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>

      {/* Cards area */}
      <div
        className="flex-1 rounded-b-2xl rounded-tr-2xl border border-white/8 border-t-0 p-2 space-y-2 min-h-[120px]"
        style={{ background: "rgba(255,255,255,0.02)" }}
      >
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => (
            <ContentCard
              key={String(item.id)}
              item={item}
              index={i}
              onStatusChange={onStatusChange}
              onEdit={onEdit}
            />
          ))}
        </AnimatePresence>

        {/* Add to column */}
        <button
          type="button"
          onClick={() => onAddNew(status)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 hover:bg-white/4 text-xs transition-smooth"
          data-ocid="content_planner.add_button"
        >
          <FilePlus2 className="w-3.5 h-3.5" />
          Add item
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ContentPlanner() {
  const { data: items = [], isLoading } = useContentItems();
  const updateMutation = useUpdateContentItem();

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<ContentItem | undefined>(undefined);
  const [defaultStatus, setDefaultStatus] = useState<ContentStatus>("Idea");
  const [platformFilter, setPlatformFilter] = useState<ContentPlatform | "All">(
    "All",
  );

  const openAddModal = (status: ContentStatus = "Idea") => {
    setEditItem(undefined);
    setDefaultStatus(status);
    setModalOpen(true);
  };

  const openEditModal = (item: ContentItem) => {
    setEditItem(item);
    setModalOpen(true);
  };

  const handleStatusChange = async (
    item: ContentItem,
    newStatus: ContentStatus,
  ) => {
    try {
      await updateMutation.mutateAsync({
        id: item.id,
        title: item.title,
        platform: item.platform,
        status: newStatus,
        deadline: item.deadline,
        notes: item.notes,
      });
      toast.success(`Moved to ${newStatus}`);
    } catch {
      toast.error("Failed to move item");
    }
  };

  const filtered =
    platformFilter === "All"
      ? items
      : items.filter((i) => i.platform === platformFilter);

  const byStatus = (status: ContentStatus) =>
    filtered.filter((i) => i.status === status);

  const totalItems = items.length;

  return (
    <div
      className="flex flex-col h-full min-h-0 p-5 gap-4"
      data-ocid="content_planner.page"
    >
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Content Pipeline
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {totalItems === 0
              ? "Map out your content journey"
              : `${totalItems} piece${totalItems !== 1 ? "s" : ""} across ${STATUSES.length} stages`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => openAddModal("Idea")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-smooth glow-accent"
          data-ocid="content_planner.primary_button"
        >
          <FilePlus2 className="w-4 h-4" />
          Add Content
        </button>
      </motion.div>

      {/* Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="flex items-center gap-2 flex-wrap"
        data-ocid="content_planner.filter.tab"
      >
        {(["All", ...PLATFORMS] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPlatformFilter(p as ContentPlatform | "All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth border ${
              platformFilter === p
                ? "bg-primary/20 border-primary/40 text-primary"
                : "bg-white/4 border-white/8 text-muted-foreground hover:text-foreground hover:bg-white/8"
            }`}
          >
            {p}
          </button>
        ))}
      </motion.div>

      {/* Kanban board */}
      {isLoading ? (
        <div className="flex gap-4" data-ocid="content_planner.loading_state">
          {STATUSES.map((s) => (
            <div
              key={s}
              className="flex-shrink-0 min-w-[260px] max-w-[280px] rounded-2xl border border-white/8 bg-white/2 h-64 animate-pulse"
            />
          ))}
        </div>
      ) : totalItems === 0 && platformFilter === "All" ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="glass rounded-2xl p-16 text-center border border-white/8 flex-1 flex flex-col items-center justify-center"
          data-ocid="content_planner.empty_state"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-5 glow-accent">
            <CalendarDays className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-display font-semibold text-xl text-foreground mb-2">
            No content planned yet
          </h2>
          <p className="text-muted-foreground text-sm max-w-xs mb-6">
            Start mapping your content pipeline. Track ideas, scripting,
            editing, scheduling, and posting — all in one place.
          </p>
          <button
            type="button"
            onClick={() => openAddModal("Idea")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-smooth glow-accent"
            data-ocid="content_planner.primary_button"
          >
            <FilePlus2 className="w-4 h-4" />
            Start Creating
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex gap-4 overflow-x-auto pb-4 flex-1 min-h-0"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.1) transparent",
          }}
        >
          {STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              items={byStatus(status)}
              onStatusChange={handleStatusChange}
              onEdit={openEditModal}
              onAddNew={openAddModal}
            />
          ))}
        </motion.div>
      )}

      {/* Modal */}
      <ContentModal
        open={modalOpen}
        item={editItem}
        defaultStatus={defaultStatus}
        onClose={() => {
          setModalOpen(false);
          setEditItem(undefined);
        }}
      />
    </div>
  );
}
