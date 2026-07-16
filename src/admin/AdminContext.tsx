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
  getGitHubConfigFromEnv,
} from "../lib/githubGuideApi";
import { renumberChapterTitles, reorderList } from "../lib/reorderList";
import type { GuideMediaItem, GuideSection, GuideStep } from "../types";
import { createAdminId } from "./adminIds";
import {
  summarizeGuideChanges,
  type GuideChangeSummary,
} from "./guideChangeSummary";

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
  toast: AdminToastMessage | null;
  dismissToast: () => void;
  showToast: (tone: AdminToastTone, message: string) => void;
  login: (token: string) => Promise<void>;
  logout: () => void;
  publish: () => Promise<void>;
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
      const payload = await fetchGuideFromGitHub(config);
      const loaded = cloneWalkthrough(payload.walkthrough);
      sessionStorage.setItem(TOKEN_KEY, trimmed);
      setToken(trimmed);
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
      await commitGuideToGitHub(config, { walkthrough: draftWalkthrough });
      setBaselineWalkthrough(cloneWalkthrough(draftWalkthrough));
      resetHistory();
      showToast("success", "Published — commit pushed to GitHub. Pages will redeploy shortly.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Publish failed";
      showToast("error", message);
      throw err;
    } finally {
      setIsPublishing(false);
    }
  }, [token, draftWalkthrough, showToast, resetHistory]);

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
      toast,
      dismissToast,
      showToast,
      login,
      logout,
      publish,
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
      toast,
      dismissToast,
      showToast,
      login,
      logout,
      publish,
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
