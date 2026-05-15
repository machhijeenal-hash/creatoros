import { c as createLucideIcon, a2 as useContentItems, a3 as useUpdateContentItem, j as reactExports, q as jsxRuntimeExports, t as motion, a4 as CalendarDays, A as AnimatePresence, a5 as useCreateContentItem, a6 as useDeleteContentItem, a7 as ChevronLeft, a8 as ChevronRight } from "./index-Bt5dTGTg.js";
import { u as ue } from "./index-D6O8apJ6.js";
import { X } from "./x-hpogwdby.js";
import { T as Trash2 } from "./trash-2-CTHojxzA.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4", key: "1pf5j1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M3 15h6", key: "4e2qda" }],
  ["path", { d: "M6 12v6", key: "1u72j0" }]
];
const FilePlus2 = createLucideIcon("file-plus-2", __iconNode);
const STATUSES = [
  "Idea",
  "Scripting",
  "Editing",
  "Scheduled",
  "Posted"
];
const STATUS_CONFIG = {
  Idea: {
    label: "Idea",
    color: "border-white/10 text-muted-foreground",
    glow: "rgba(255,255,255,0.04)",
    dot: "bg-muted-foreground"
  },
  Scripting: {
    label: "Scripting",
    color: "border-blue-500/30 text-blue-400",
    glow: "rgba(59,130,246,0.08)",
    dot: "bg-blue-400"
  },
  Editing: {
    label: "Editing",
    color: "border-amber-500/30 text-amber-400",
    glow: "rgba(251,191,36,0.08)",
    dot: "bg-amber-400"
  },
  Scheduled: {
    label: "Scheduled",
    color: "border-purple-500/30 text-purple-400",
    glow: "rgba(168,85,247,0.08)",
    dot: "bg-purple-400"
  },
  Posted: {
    label: "Posted",
    color: "border-emerald-500/30 text-emerald-400",
    glow: "rgba(52,211,153,0.08)",
    dot: "bg-emerald-400"
  }
};
const PLATFORMS = [
  "YouTube",
  "TikTok",
  "Instagram",
  "Twitter",
  "Blog",
  "Other"
];
const PLATFORM_CONFIG = {
  YouTube: {
    label: "YouTube",
    color: "bg-red-500/20 text-red-400 border-red-500/30"
  },
  TikTok: {
    label: "TikTok",
    color: "bg-white/10 text-white/80 border-white/20"
  },
  Instagram: {
    label: "Instagram",
    color: "bg-pink-500/20 text-pink-400 border-pink-500/30"
  },
  Twitter: {
    label: "Twitter",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30"
  },
  Blog: {
    label: "Blog",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
  },
  Other: {
    label: "Other",
    color: "bg-muted/50 text-muted-foreground border-border"
  }
};
function formatDeadline(ts) {
  if (ts == null || ts === 0n) return "";
  const ms = Number(ts) / 1e6;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function dateToNano(dateStr) {
  if (!dateStr) return void 0;
  const ms = new Date(dateStr).getTime();
  if (Number.isNaN(ms)) return void 0;
  return BigInt(ms) * 1000000n;
}
const DEFAULT_FORM = {
  title: "",
  platform: "YouTube",
  status: "Idea",
  deadline: "",
  notes: ""
};
function ContentModal({
  item,
  open,
  defaultStatus,
  onClose
}) {
  const createMutation = useCreateContentItem();
  const updateMutation = useUpdateContentItem();
  const deleteMutation = useDeleteContentItem();
  const [form, setForm] = reactExports.useState(DEFAULT_FORM);
  const [confirmDelete, setConfirmDelete] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (item) {
      setForm({
        title: item.title,
        platform: item.platform,
        status: item.status,
        deadline: item.deadline ? (() => {
          const ms = Number(item.deadline) / 1e6;
          const d = new Date(ms);
          return Number.isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
        })() : "",
        notes: item.notes
      });
    } else {
      setForm({ ...DEFAULT_FORM, status: defaultStatus ?? "Idea" });
    }
    setConfirmDelete(false);
  }, [item, open, defaultStatus]);
  if (!open) return null;
  const isLoading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      ue.error("Title is required");
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
          notes: form.notes
        });
        ue.success("Content updated");
      } else {
        await createMutation.mutateAsync({
          title: form.title.trim(),
          platform: form.platform,
          status: form.status,
          deadline: dateToNano(form.deadline),
          notes: form.notes
        });
        ue.success("Content added to pipeline");
      }
      onClose();
    } catch {
      ue.error("Failed to save content item");
    }
  };
  const handleDelete = async () => {
    if (!item) return;
    try {
      await deleteMutation.mutateAsync(item.id);
      ue.success("Content deleted");
      onClose();
    } catch {
      ue.error("Failed to delete content item");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      className: "fixed inset-0 z-50 flex items-center justify-center p-4",
      style: { background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" },
      onClick: (e) => e.target === e.currentTarget && onClose(),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.96, y: 16 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.96, y: 16 },
          transition: { duration: 0.2 },
          className: "w-full max-w-lg rounded-2xl border border-white/10 bg-card/95 backdrop-blur-xl shadow-2xl",
          "data-ocid": "content_planner.dialog",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-foreground text-base", children: item ? "Edit Content" : "Add Content" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  className: "w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/8 transition-smooth",
                  "data-ocid": "content_planner.close_button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "px-6 py-5 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "label",
                  {
                    htmlFor: "input-title",
                    className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
                    children: [
                      "Title ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "input-title",
                    type: "text",
                    value: form.title,
                    onChange: (e) => setForm((f) => ({ ...f, title: e.target.value })),
                    placeholder: "e.g. The complete guide to YouTube SEO",
                    className: "w-full rounded-xl bg-muted/50 border border-white/10 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-smooth",
                    "data-ocid": "content_planner.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "input-platform",
                      className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
                      children: "Platform"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      id: "input-platform",
                      value: form.platform,
                      onChange: (e) => setForm((f) => ({
                        ...f,
                        platform: e.target.value
                      })),
                      className: "w-full rounded-xl bg-muted/50 border border-white/10 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-smooth",
                      "data-ocid": "content_planner.select",
                      children: PLATFORMS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p, children: p }, p))
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: "input-status",
                      className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
                      children: "Status"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "select",
                    {
                      id: "input-status",
                      value: form.status,
                      onChange: (e) => setForm((f) => ({
                        ...f,
                        status: e.target.value
                      })),
                      className: "w-full rounded-xl bg-muted/50 border border-white/10 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-smooth",
                      "data-ocid": "content_planner.select",
                      children: STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s, children: s }, s))
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "input-deadline",
                    className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
                    children: "Deadline"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "input-deadline",
                    type: "date",
                    value: form.deadline,
                    onChange: (e) => setForm((f) => ({ ...f, deadline: e.target.value })),
                    className: "w-full rounded-xl bg-muted/50 border border-white/10 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-smooth",
                    "data-ocid": "content_planner.input"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "input-notes",
                    className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
                    children: "Notes"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "textarea",
                  {
                    id: "input-notes",
                    value: form.notes,
                    onChange: (e) => setForm((f) => ({ ...f, notes: e.target.value })),
                    placeholder: "Ideas, key points, references...",
                    rows: 3,
                    className: "w-full rounded-xl bg-muted/50 border border-white/10 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-smooth resize-none",
                    "data-ocid": "content_planner.textarea"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-2", children: [
                item ? confirmDelete ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-destructive", children: "Delete this item?" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: handleDelete,
                      disabled: isLoading,
                      className: "px-3 py-1.5 rounded-lg bg-destructive/20 border border-destructive/40 text-destructive text-xs font-medium hover:bg-destructive/30 transition-smooth disabled:opacity-50",
                      "data-ocid": "content_planner.confirm_button",
                      children: "Yes, delete"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setConfirmDelete(false),
                      className: "px-3 py-1.5 rounded-lg bg-muted/50 border border-white/10 text-muted-foreground text-xs font-medium hover:text-foreground transition-smooth",
                      "data-ocid": "content_planner.cancel_button",
                      children: "Cancel"
                    }
                  )
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => setConfirmDelete(true),
                    className: "flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-smooth",
                    "data-ocid": "content_planner.delete_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
                      "Delete"
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: onClose,
                      className: "px-4 py-2 rounded-xl bg-muted/50 border border-white/10 text-sm text-muted-foreground hover:text-foreground transition-smooth",
                      "data-ocid": "content_planner.cancel_button",
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "submit",
                      disabled: isLoading,
                      className: "px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-smooth disabled:opacity-50 glow-accent",
                      "data-ocid": "content_planner.submit_button",
                      children: isLoading ? "Saving..." : item ? "Save Changes" : "Add to Pipeline"
                    }
                  )
                ] })
              ] })
            ] })
          ]
        },
        "modal-panel"
      )
    },
    "modal-overlay"
  ) });
}
function ContentCard({
  item,
  index,
  onStatusChange,
  onEdit
}) {
  const currentIdx = STATUSES.indexOf(item.status);
  const prevStatus = currentIdx > 0 ? STATUSES[currentIdx - 1] : null;
  const nextStatus = currentIdx < STATUSES.length - 1 ? STATUSES[currentIdx + 1] : null;
  const platform = PLATFORM_CONFIG[item.platform];
  const deadline = formatDeadline(item.deadline);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      layout: true,
      initial: { opacity: 0, y: 12 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, scale: 0.95 },
      transition: { duration: 0.22, delay: index * 0.04 },
      className: "glass rounded-xl border border-white/8 group relative overflow-hidden",
      "data-ocid": `content_planner.item.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            onClick: () => onEdit(item),
            className: "w-full text-left p-3.5 cursor-pointer block",
            "aria-label": `Edit: ${item.title}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${platform.color}`,
                    children: platform.label
                  }
                ),
                deadline && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] text-muted-foreground", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-3 h-3" }),
                  deadline
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors duration-200", children: item.title }),
              item.notes && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground line-clamp-2", children: item.notes })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-1 px-3.5 pb-3",
            onClick: (e) => e.stopPropagation(),
            onKeyDown: (e) => e.stopPropagation(),
            role: "presentation",
            children: [
              prevStatus && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => onStatusChange(item, prevStatus),
                  className: "flex items-center gap-1 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground text-[10px] transition-smooth",
                  title: `Move to ${prevStatus}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "w-3 h-3" }),
                    prevStatus
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
              nextStatus && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => onStatusChange(item, nextStatus),
                  className: "flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[10px] transition-smooth border border-primary/20",
                  title: `Move to ${nextStatus}`,
                  children: [
                    nextStatus,
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" })
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function KanbanColumn({
  status,
  items,
  onStatusChange,
  onEdit,
  onAddNew
}) {
  const cfg = STATUS_CONFIG[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col min-w-[260px] max-w-[280px] flex-shrink-0",
      "data-ocid": `content_planner.${status.toLowerCase()}_column`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex items-center justify-between px-3 py-2.5 rounded-t-2xl border ${cfg.color} border-b-0 mb-0`,
            style: { background: cfg.glow },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-2 h-2 rounded-full ${cfg.dot}` }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider", children: cfg.label })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-muted-foreground bg-white/8 px-2 py-0.5 rounded-full", children: items.length })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-1 rounded-b-2xl rounded-tr-2xl border border-white/8 border-t-0 p-2 space-y-2 min-h-[120px]",
            style: { background: "rgba(255,255,255,0.02)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                ContentCard,
                {
                  item,
                  index: i,
                  onStatusChange,
                  onEdit
                },
                String(item.id)
              )) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => onAddNew(status),
                  className: "w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 hover:bg-white/4 text-xs transition-smooth",
                  "data-ocid": "content_planner.add_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FilePlus2, { className: "w-3.5 h-3.5" }),
                    "Add item"
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
}
function ContentPlanner() {
  const { data: items = [], isLoading } = useContentItems();
  const updateMutation = useUpdateContentItem();
  const [modalOpen, setModalOpen] = reactExports.useState(false);
  const [editItem, setEditItem] = reactExports.useState(void 0);
  const [defaultStatus, setDefaultStatus] = reactExports.useState("Idea");
  const [platformFilter, setPlatformFilter] = reactExports.useState(
    "All"
  );
  const openAddModal = (status = "Idea") => {
    setEditItem(void 0);
    setDefaultStatus(status);
    setModalOpen(true);
  };
  const openEditModal = (item) => {
    setEditItem(item);
    setModalOpen(true);
  };
  const handleStatusChange = async (item, newStatus) => {
    try {
      await updateMutation.mutateAsync({
        id: item.id,
        title: item.title,
        platform: item.platform,
        status: newStatus,
        deadline: item.deadline,
        notes: item.notes
      });
      ue.success(`Moved to ${newStatus}`);
    } catch {
      ue.error("Failed to move item");
    }
  };
  const filtered = platformFilter === "All" ? items : items.filter((i) => i.platform === platformFilter);
  const byStatus = (status) => filtered.filter((i) => i.status === status);
  const totalItems = items.length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-full min-h-0 p-5 gap-4",
      "data-ocid": "content_planner.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -8 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.3 },
            className: "flex items-center justify-between flex-wrap gap-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-2xl text-foreground", children: "Content Pipeline" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-0.5", children: totalItems === 0 ? "Map out your content journey" : `${totalItems} piece${totalItems !== 1 ? "s" : ""} across ${STATUSES.length} stages` })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => openAddModal("Idea"),
                  className: "flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-smooth glow-accent",
                  "data-ocid": "content_planner.primary_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FilePlus2, { className: "w-4 h-4" }),
                    "Add Content"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: -4 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.3, delay: 0.05 },
            className: "flex items-center gap-2 flex-wrap",
            "data-ocid": "content_planner.filter.tab",
            children: ["All", ...PLATFORMS].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => setPlatformFilter(p),
                className: `px-3 py-1.5 rounded-lg text-xs font-medium transition-smooth border ${platformFilter === p ? "bg-primary/20 border-primary/40 text-primary" : "bg-white/4 border-white/8 text-muted-foreground hover:text-foreground hover:bg-white/8"}`,
                children: p
              },
              p
            ))
          }
        ),
        isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4", "data-ocid": "content_planner.loading_state", children: STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex-shrink-0 min-w-[260px] max-w-[280px] rounded-2xl border border-white/8 bg-white/2 h-64 animate-pulse"
          },
          s
        )) }) : totalItems === 0 && platformFilter === "All" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.97 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.4, delay: 0.1 },
            className: "glass rounded-2xl p-16 text-center border border-white/8 flex-1 flex flex-col items-center justify-center",
            "data-ocid": "content_planner.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mx-auto mb-5 glow-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-10 h-10 text-primary" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-xl text-foreground mb-2", children: "No content planned yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mb-6", children: "Start mapping your content pipeline. Track ideas, scripting, editing, scheduling, and posting — all in one place." }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => openAddModal("Idea"),
                  className: "flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-smooth glow-accent",
                  "data-ocid": "content_planner.primary_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FilePlus2, { className: "w-4 h-4" }),
                    "Start Creating"
                  ]
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.35, delay: 0.1 },
            className: "flex gap-4 overflow-x-auto pb-4 flex-1 min-h-0",
            style: {
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(255,255,255,0.1) transparent"
            },
            children: STATUSES.map((status) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              KanbanColumn,
              {
                status,
                items: byStatus(status),
                onStatusChange: handleStatusChange,
                onEdit: openEditModal,
                onAddNew: openAddModal
              },
              status
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ContentModal,
          {
            open: modalOpen,
            item: editItem,
            defaultStatus,
            onClose: () => {
              setModalOpen(false);
              setEditItem(void 0);
            }
          }
        )
      ]
    }
  );
}
export {
  ContentPlanner as default
};
