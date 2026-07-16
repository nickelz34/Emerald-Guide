import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { walkthrough as bundledWalkthrough } from "../data/walkthroughFromJson";
import {
  clearCurrentFileSha,
  commitGuideToGitHub,
  fetchGuideFromGitHub,
  fetchRepoTextFile,
  getGitHubConfigFromEnv,
} from "../lib/githubGuideApi";
import { renumberChapterTitles, reorderList } from "../lib/reorderList";
import type { GuideMediaItem, GuideSection, GuideStep } from "../types";
import { createAdminId } from "./adminIds";
import {
  summarizeGuideChanges,
  type GuideChangeSummary,
} from "./guideChangeSummary";
import type { ChangelogSection } from "../data/changelog";
import {
  applyChangelogDraftToPlan,
  applyReadmeReleaseUpdates,
  bumpPackageJsonVersion,
  bumpPackageLockVersion,
  changelogDraftFromPlan,
  planReleaseFromGuideChanges,
  prependChangelogEntry,
  toChangelogRelease,
  type ChangelogDraft,
  type PlannedRelease,
} from "./releaseFromChanges";

const TOKEN_KEY = "emerald-guide-admin-token";
const MAX_HISTORY = 50;

export type AdminToastTone = "success" | "error" | "info";

export interface AdminToastMessage {
  tone: AdminToastTone;
  message: string;
}

interface AdminContextValue {
  isAdmin: boolean;
  /** True when draft differs from the last loaded/published baseline. */
  isDirty: boolean;
  isPublishing: boolean;
  isBootstrapping: boolean;
  canUndo: boolean;
  canRedo: boolean;
  draftWalkthrough: GuideSection[];
  /** Last loaded/published walkthrough (used for pending-change diffs). */
  baselineWalkthrough: GuideSection[];
  changeSummary: GuideChangeSummary;
  /** Planned semver/changelog release for the current pending edits (null when clean). */
  pendingRelease: PlannedRelease | null;
  /** Editable changelog copy for the pending release (null when clean). */
  changelogDraft: ChangelogDraft | null;
  /** package.json version last loaded from GitHub (or after a successful publish). */
  repoVersion: string | null;
  toast: AdminToastMessage | null;
  dismissToast: () => void;
  showToast: (tone: AdminToastTone, message: string) => void;
  login: (token: string) => Promise<void>;
  logout: () => void;
  publish: () => Promise<void>;
  setChangelogSummary: (summary: string) => void;
  setChangelogSectionHeading: (sectionIndex: number, heading: string) => void;
  setChangelogItem: (sectionIndex: number, itemIndex: number, text: string) => void;
  addChangelogItem: (sectionIndex: number) => void;
  removeChangelogItem: (sectionIndex: number, itemIndex: number) => void;
  addChangelogSection: () => void;
  removeChangelogSection: (sectionIndex: number) => void;
  resetChangelogDraft: () => void;
  undo: () => void;
  redo: () => void;
  setDraftWalkthrough: (next: GuideSection[]) => void;
  updateChapter: (chapterId: string, patch: Partial<GuideSection>) => void;
  updateStep: (chapterId: string, stepId: string, patch: Partial<GuideStep>) => void;
  reorderChapters: (startIndex: number, endIndex: number) => void;
  reorderSteps: (chapterId: string, startIndex: number, endIndex: number) => void;
  addChapter: () => { chapterId: string; stepId: string };
  deleteChapter: (chapterId: string) => void;
  addStep: (chapterId: string) => string;
  deleteStep: (chapterId: string, stepId: string) => void;
  setStepMedia: (chapterId: string, stepId: string, media: GuideMediaItem[]) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

function cloneWalkthrough(sections: GuideSection[]): GuideSection[] {
  return structuredClone(sections);
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [draftWalkthrough, setDraftState] = useState<GuideSection[]>(() =>
    cloneWalkthrough(bundledWalkthrough),
  );
  const [baselineWalkthrough, setBaselineWalkthrough] = useState<GuideSection[]>(() =>
    cloneWalkthrough(bundledWalkthrough),
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [repoVersion, setRepoVersion] = useState<string | null>(null);
  const [changelogDraft, setChangelogDraft] = useState<ChangelogDraft | null>(null);
  const [changelogDraftKey, setChangelogDraftKey] = useState("");
  const [toast, setToast] = useState<AdminToastMessage | null>(null);
  const [undoStack, setUndoStack] = useState<GuideSection[][]>([]);
  const [redoStack, setRedoStack] = useState<GuideSection[][]>([]);
  const draftRef = useRef(draftWalkthrough);
  draftRef.current = draftWalkthrough;

  const changeSummary = useMemo(
    () => summarizeGuideChanges(baselineWalkthrough, draftWalkthrough),
    [baselineWalkthrough, draftWalkthrough],
  );
  const isDirty = changeSummary.total > 0;
  const pendingRelease = useMemo(() => {
    if (!isDirty || !repoVersion) return null;
    try {
      return planReleaseFromGuideChanges(changeSummary, repoVersion);
    } catch {
      return null;
    }
  }, [isDirty, repoVersion, changeSummary]);

  const pendingReleaseKey = useMemo(() => {
    if (!pendingRelease) return "";
    return [
      pendingRelease.version,
      pendingRelease.bump,
      changeSummary.items.map((item) => item.id).join("|"),
    ].join("::");
  }, [pendingRelease, changeSummary.items]);

  // Re-seed editable changelog when the auto plan changes (new edits / version).
  useEffect(() => {
    if (!pendingRelease || !pendingReleaseKey) {
      setChangelogDraft(null);
      setChangelogDraftKey("");
      return;
    }
    if (changelogDraftKey === pendingReleaseKey) return;
    setChangelogDraft(changelogDraftFromPlan(pendingRelease));
    setChangelogDraftKey(pendingReleaseKey);
  }, [pendingRelease, pendingReleaseKey, changelogDraftKey]);

  const showToast = useCallback((tone: AdminToastTone, message: string) => {
    setToast({ tone, message });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const resetHistory = useCallback(() => {
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  const applyDraft = useCallback((next: GuideSection[], options?: { recordHistory?: boolean }) => {
    const recordHistory = options?.recordHistory !== false;
    if (recordHistory) {
      setUndoStack((prev) => {
        const stacked = [...prev, cloneWalkthrough(draftRef.current)];
        return stacked.length > MAX_HISTORY ? stacked.slice(stacked.length - MAX_HISTORY) : stacked;
      });
      setRedoStack([]);
    }
    setDraftState(next);
  }, []);

  const setDraftWalkthrough = useCallback(
    (next: GuideSection[]) => {
      applyDraft(next);
    },
    [applyDraft],
  );

  const undo = useCallback(() => {
    setUndoStack((prevUndo) => {
      if (prevUndo.length === 0) return prevUndo;
      const previous = prevUndo[prevUndo.length - 1];
      setRedoStack((prevRedo) => [...prevRedo, cloneWalkthrough(draftRef.current)]);
      setDraftState(cloneWalkthrough(previous));
      return prevUndo.slice(0, -1);
    });
  }, []);

  const redo = useCallback(() => {
    setRedoStack((prevRedo) => {
      if (prevRedo.length === 0) return prevRedo;
      const next = prevRedo[prevRedo.length - 1];
      setUndoStack((prevUndo) => [...prevUndo, cloneWalkthrough(draftRef.current)]);
      setDraftState(cloneWalkthrough(next));
      return prevRedo.slice(0, -1);
    });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    clearCurrentFileSha();
    setToken(null);
    setIsAdmin(false);
    setRepoVersion(null);
    setChangelogDraft(null);
    setChangelogDraftKey("");
    resetHistory();
    const bundled = cloneWalkthrough(bundledWalkthrough);
    setDraftState(bundled);
    setBaselineWalkthrough(bundled);
    showToast("info", "Exited Admin Mode");
  }, [showToast, resetHistory]);

  const login = useCallback(
    async (rawToken: string) => {
      const trimmed = rawToken.trim();
      if (!trimmed) throw new Error("Personal Access Token is required");

      const config = getGitHubConfigFromEnv(trimmed);
      const [payload, packageJsonText] = await Promise.all([
        fetchGuideFromGitHub(config),
        fetchRepoTextFile(config, "package.json"),
      ]);
      const pkg = JSON.parse(packageJsonText) as { version?: string };
      if (!pkg.version) throw new Error("package.json on GitHub is missing version");

      const loaded = cloneWalkthrough(payload.walkthrough);
      sessionStorage.setItem(TOKEN_KEY, trimmed);
      setToken(trimmed);
      setRepoVersion(pkg.version);
      setDraftState(loaded);
      setBaselineWalkthrough(cloneWalkthrough(loaded));
      resetHistory();
      setIsAdmin(true);
      showToast("success", "Admin Mode active — editing live guide data from GitHub");
    },
    [showToast, resetHistory],
  );

  // Restore session token only when Admin Mode is explicitly requested via ?admin=1.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") !== "1") return;

    const cached = sessionStorage.getItem(TOKEN_KEY);
    if (!cached) return;
    let cancelled = false;
    setIsBootstrapping(true);
    void (async () => {
      try {
        await login(cached);
      } catch {
        if (!cancelled) {
          sessionStorage.removeItem(TOKEN_KEY);
          clearCurrentFileSha();
        }
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [login]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(t);
  }, [toast]);

  // Ctrl/Cmd+Z undo, Ctrl/Cmd+Shift+Z redo while in admin mode.
  useEffect(() => {
    if (!isAdmin) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target;
      const inField =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable);
      // Allow native text undo inside fields; use history undo when not typing
      // or when using Ctrl+Z with Alt for force (also support Ctrl+Z always for draft).
      const key = e.key.toLowerCase();
      const mod = e.metaKey || e.ctrlKey;
      if (!mod || key !== "z") return;
      if (inField && !e.altKey) return;
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isAdmin, undo, redo]);

  const publish = useCallback(async () => {
    if (!token) throw new Error("Not logged in");
    setIsPublishing(true);
    try {
      const config = getGitHubConfigFromEnv(token);
      const summary = summarizeGuideChanges(baselineWalkthrough, draftWalkthrough);
      if (summary.total === 0) throw new Error("No guide changes to publish");

      const [packageJsonText, packageLockText, changelogText, readmeText] = await Promise.all([
        fetchRepoTextFile(config, "package.json"),
        fetchRepoTextFile(config, "package-lock.json"),
        fetchRepoTextFile(config, "src/data/changelog.ts"),
        fetchRepoTextFile(config, "README.md"),
      ]);
      const pkg = JSON.parse(packageJsonText) as { version?: string };
      if (!pkg.version) throw new Error("package.json on GitHub is missing version");

      const autoPlan = planReleaseFromGuideChanges(summary, pkg.version);
      const draft = changelogDraft ?? changelogDraftFromPlan(autoPlan);
      const plan = applyChangelogDraftToPlan(autoPlan, draft, summary.total);
      const release = toChangelogRelease(plan);
      const nextPackageJson = bumpPackageJsonVersion(packageJsonText, plan.version);
      const nextPackageLock = bumpPackageLockVersion(packageLockText, plan.version);
      const nextChangelog = prependChangelogEntry(changelogText, release);
      const nextReadme = applyReadmeReleaseUpdates(readmeText, plan, draftWalkthrough);

      const result = await commitGuideToGitHub(config, {
        updatedData: { walkthrough: draftWalkthrough },
        files: [
          { path: "package.json", content: nextPackageJson },
          { path: "package-lock.json", content: nextPackageLock },
          { path: "src/data/changelog.ts", content: nextChangelog },
          { path: "README.md", content: nextReadme },
        ],
        commitTitle: plan.commitTitle,
        commitBody: plan.commitBody,
        version: plan.version,
      });

      setBaselineWalkthrough(cloneWalkthrough(draftWalkthrough));
      setRepoVersion(plan.version);
      setChangelogDraft(null);
      setChangelogDraftKey("");
      resetHistory();
      const via =
        result.mode === "pull-request"
          ? ` via PR${result.prNumber ? ` #${result.prNumber}` : ""}`
          : "";
      showToast(
        "success",
        `Published v${plan.version}${via} — changelog updated. Pages will redeploy shortly.`,
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Publish failed";
      showToast("error", message);
      throw err;
    } finally {
      setIsPublishing(false);
    }
  }, [token, baselineWalkthrough, draftWalkthrough, changelogDraft, showToast, resetHistory]);

  const setChangelogSummary = useCallback((summary: string) => {
    setChangelogDraft((prev) => (prev ? { ...prev, summary } : prev));
  }, []);

  const setChangelogSectionHeading = useCallback((sectionIndex: number, heading: string) => {
    setChangelogDraft((prev) => {
      if (!prev) return prev;
      const sections = prev.sections.map((section, index) =>
        index === sectionIndex ? { ...section, heading } : section,
      );
      return { ...prev, sections };
    });
  }, []);

  const setChangelogItem = useCallback(
    (sectionIndex: number, itemIndex: number, text: string) => {
      setChangelogDraft((prev) => {
        if (!prev) return prev;
        const sections = prev.sections.map((section, index) => {
          if (index !== sectionIndex) return section;
          const items = section.items.map((item, i) => (i === itemIndex ? text : item));
          return { ...section, items };
        });
        return { ...prev, sections };
      });
    },
    [],
  );

  const addChangelogItem = useCallback((sectionIndex: number) => {
    setChangelogDraft((prev) => {
      if (!prev) return prev;
      const sections = prev.sections.map((section, index) =>
        index === sectionIndex ? { ...section, items: [...section.items, ""] } : section,
      );
      return { ...prev, sections };
    });
  }, []);

  const removeChangelogItem = useCallback((sectionIndex: number, itemIndex: number) => {
    setChangelogDraft((prev) => {
      if (!prev) return prev;
      const sections = prev.sections
        .map((section, index) => {
          if (index !== sectionIndex) return section;
          return {
            ...section,
            items: section.items.filter((_, i) => i !== itemIndex),
          };
        })
        .filter((section) => section.items.length > 0 || prev.sections.length === 1);
      return {
        ...prev,
        sections: sections.length > 0 ? sections : [{ heading: "Walkthrough", items: [""] }],
      };
    });
  }, []);

  const addChangelogSection = useCallback(() => {
    setChangelogDraft((prev) => {
      if (!prev) return prev;
      const section: ChangelogSection = { heading: "Walkthrough", items: [""] };
      return { ...prev, sections: [...prev.sections, section] };
    });
  }, []);

  const removeChangelogSection = useCallback((sectionIndex: number) => {
    setChangelogDraft((prev) => {
      if (!prev || prev.sections.length <= 1) return prev;
      return {
        ...prev,
        sections: prev.sections.filter((_, index) => index !== sectionIndex),
      };
    });
  }, []);

  const resetChangelogDraft = useCallback(() => {
    if (!pendingRelease) return;
    setChangelogDraft(changelogDraftFromPlan(pendingRelease));
    setChangelogDraftKey(pendingReleaseKey);
  }, [pendingRelease, pendingReleaseKey]);

  const updateChapter = useCallback(
    (chapterId: string, patch: Partial<GuideSection>) => {
      applyDraft(
        draftRef.current.map((ch) => (ch.id === chapterId ? { ...ch, ...patch } : ch)),
      );
    },
    [applyDraft],
  );

  const updateStep = useCallback(
    (chapterId: string, stepId: string, patch: Partial<GuideStep>) => {
      applyDraft(
        draftRef.current.map((ch) => {
          if (ch.id !== chapterId) return ch;
          return {
            ...ch,
            steps: ch.steps.map((s) => (s.id === stepId ? { ...s, ...patch } : s)),
          };
        }),
      );
    },
    [applyDraft],
  );

  const reorderChapters = useCallback(
    (startIndex: number, endIndex: number) => {
      applyDraft(renumberChapterTitles(reorderList(draftRef.current, startIndex, endIndex)));
    },
    [applyDraft],
  );

  const reorderSteps = useCallback(
    (chapterId: string, startIndex: number, endIndex: number) => {
      applyDraft(
        draftRef.current.map((ch) => {
          if (ch.id !== chapterId) return ch;
          return { ...ch, steps: reorderList(ch.steps, startIndex, endIndex) };
        }),
      );
    },
    [applyDraft],
  );

  const addChapter = useCallback(() => {
    const chapterId = createAdminId("chapter");
    const stepId = createAdminId("step");
    const n = draftRef.current.length + 1;
    const chapter: GuideSection = {
      id: chapterId,
      title: `Ch. ${n} — New chapter`,
      description: "",
      steps: [
        {
          id: stepId,
          title: "New step",
          summary: "",
          details: [],
        },
      ],
      band: "story",
    };
    applyDraft(renumberChapterTitles([...draftRef.current, chapter]));
    return { chapterId, stepId };
  }, [applyDraft]);

  const deleteChapter = useCallback(
    (chapterId: string) => {
      applyDraft(renumberChapterTitles(draftRef.current.filter((ch) => ch.id !== chapterId)));
    },
    [applyDraft],
  );

  const addStep = useCallback(
    (chapterId: string) => {
      const id = createAdminId("step");
      const step: GuideStep = {
        id,
        title: "New step",
        summary: "",
        details: [],
      };
      applyDraft(
        draftRef.current.map((ch) =>
          ch.id === chapterId ? { ...ch, steps: [...ch.steps, step] } : ch,
        ),
      );
      return id;
    },
    [applyDraft],
  );

  const deleteStep = useCallback(
    (chapterId: string, stepId: string) => {
      applyDraft(
        draftRef.current.map((ch) => {
          if (ch.id !== chapterId) return ch;
          return { ...ch, steps: ch.steps.filter((s) => s.id !== stepId) };
        }),
      );
    },
    [applyDraft],
  );

  const setStepMedia = useCallback(
    (chapterId: string, stepId: string, media: GuideMediaItem[]) => {
      updateStep(chapterId, stepId, { media: media.length ? media : undefined });
    },
    [updateStep],
  );

  const value = useMemo<AdminContextValue>(
    () => ({
      isAdmin,
      isDirty,
      isPublishing,
      isBootstrapping,
      canUndo: undoStack.length > 0,
      canRedo: redoStack.length > 0,
      draftWalkthrough,
      baselineWalkthrough,
      changeSummary,
      pendingRelease,
      changelogDraft,
      repoVersion,
      toast,
      dismissToast,
      showToast,
      login,
      logout,
      publish,
      setChangelogSummary,
      setChangelogSectionHeading,
      setChangelogItem,
      addChangelogItem,
      removeChangelogItem,
      addChangelogSection,
      removeChangelogSection,
      resetChangelogDraft,
      undo,
      redo,
      setDraftWalkthrough,
      updateChapter,
      updateStep,
      reorderChapters,
      reorderSteps,
      addChapter,
      deleteChapter,
      addStep,
      deleteStep,
      setStepMedia,
    }),
    [
      isAdmin,
      isDirty,
      isPublishing,
      isBootstrapping,
      undoStack.length,
      redoStack.length,
      draftWalkthrough,
      baselineWalkthrough,
      changeSummary,
      pendingRelease,
      changelogDraft,
      repoVersion,
      toast,
      dismissToast,
      showToast,
      login,
      logout,
      publish,
      setChangelogSummary,
      setChangelogSectionHeading,
      setChangelogItem,
      addChangelogItem,
      removeChangelogItem,
      addChangelogSection,
      removeChangelogSection,
      resetChangelogDraft,
      undo,
      redo,
      setDraftWalkthrough,
      updateChapter,
      updateStep,
      reorderChapters,
      reorderSteps,
      addChapter,
      deleteChapter,
      addStep,
      deleteStep,
      setStepMedia,
    ],
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
