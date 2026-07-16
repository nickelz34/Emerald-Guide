import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

const TOKEN_KEY = "emerald-guide-admin-token";

export type AdminToastTone = "success" | "error" | "info";

export interface AdminToastMessage {
  tone: AdminToastTone;
  message: string;
}

interface AdminContextValue {
  isAdmin: boolean;
  isDirty: boolean;
  isPublishing: boolean;
  isBootstrapping: boolean;
  draftWalkthrough: GuideSection[];
  toast: AdminToastMessage | null;
  dismissToast: () => void;
  showToast: (tone: AdminToastTone, message: string) => void;
  login: (token: string) => Promise<void>;
  logout: () => void;
  publish: () => Promise<void>;
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
  const [isDirty, setIsDirty] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [toast, setToast] = useState<AdminToastMessage | null>(null);

  const showToast = useCallback((tone: AdminToastTone, message: string) => {
    setToast({ tone, message });
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const setDraftWalkthrough = useCallback((next: GuideSection[]) => {
    setDraftState(next);
    setIsDirty(true);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    clearCurrentFileSha();
    setToken(null);
    setIsAdmin(false);
    setIsDirty(false);
    setDraftState(cloneWalkthrough(bundledWalkthrough));
    showToast("info", "Exited Admin Mode");
  }, [showToast]);

  const login = useCallback(
    async (rawToken: string) => {
      const trimmed = rawToken.trim();
      if (!trimmed) throw new Error("Personal Access Token is required");

      const config = getGitHubConfigFromEnv(trimmed);
      const payload = await fetchGuideFromGitHub(config);
      sessionStorage.setItem(TOKEN_KEY, trimmed);
      setToken(trimmed);
      setDraftState(cloneWalkthrough(payload.walkthrough));
      setIsDirty(false);
      setIsAdmin(true);
      showToast("success", "Admin Mode active — editing live guide data from GitHub");
    },
    [showToast],
  );

  // Restore session token on load (re-validate against GitHub).
  useEffect(() => {
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

  const publish = useCallback(async () => {
    if (!token) throw new Error("Not logged in");
    setIsPublishing(true);
    try {
      const config = getGitHubConfigFromEnv(token);
      await commitGuideToGitHub(config, { walkthrough: draftWalkthrough });
      setIsDirty(false);
      showToast("success", "Published — commit pushed to GitHub. Pages will redeploy shortly.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Publish failed";
      showToast("error", message);
      throw err;
    } finally {
      setIsPublishing(false);
    }
  }, [token, draftWalkthrough, showToast]);

  const updateChapter = useCallback((chapterId: string, patch: Partial<GuideSection>) => {
    setDraftState((prev) =>
      prev.map((ch) => (ch.id === chapterId ? { ...ch, ...patch } : ch)),
    );
    setIsDirty(true);
  }, []);

  const updateStep = useCallback(
    (chapterId: string, stepId: string, patch: Partial<GuideStep>) => {
      setDraftState((prev) =>
        prev.map((ch) => {
          if (ch.id !== chapterId) return ch;
          return {
            ...ch,
            steps: ch.steps.map((s) => (s.id === stepId ? { ...s, ...patch } : s)),
          };
        }),
      );
      setIsDirty(true);
    },
    [],
  );

  const reorderChapters = useCallback((startIndex: number, endIndex: number) => {
    setDraftState((prev) => renumberChapterTitles(reorderList(prev, startIndex, endIndex)));
    setIsDirty(true);
  }, []);

  const reorderSteps = useCallback(
    (chapterId: string, startIndex: number, endIndex: number) => {
      setDraftState((prev) =>
        prev.map((ch) => {
          if (ch.id !== chapterId) return ch;
          return { ...ch, steps: reorderList(ch.steps, startIndex, endIndex) };
        }),
      );
      setIsDirty(true);
    },
    [],
  );

  const addChapter = useCallback(() => {
    const chapterId = createAdminId("chapter");
    const stepId = createAdminId("step");
    const n = draftWalkthrough.length + 1;
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
    setDraftState((prev) => renumberChapterTitles([...prev, chapter]));
    setIsDirty(true);
    return { chapterId, stepId };
  }, [draftWalkthrough.length]);

  const deleteChapter = useCallback((chapterId: string) => {
    setDraftState((prev) => renumberChapterTitles(prev.filter((ch) => ch.id !== chapterId)));
    setIsDirty(true);
  }, []);

  const addStep = useCallback((chapterId: string) => {
    const id = createAdminId("step");
    const step: GuideStep = {
      id,
      title: "New step",
      summary: "",
      details: [],
    };
    setDraftState((prev) =>
      prev.map((ch) => (ch.id === chapterId ? { ...ch, steps: [...ch.steps, step] } : ch)),
    );
    setIsDirty(true);
    return id;
  }, []);

  const deleteStep = useCallback((chapterId: string, stepId: string) => {
    setDraftState((prev) =>
      prev.map((ch) => {
        if (ch.id !== chapterId) return ch;
        return { ...ch, steps: ch.steps.filter((s) => s.id !== stepId) };
      }),
    );
    setIsDirty(true);
  }, []);

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
      draftWalkthrough,
      toast,
      dismissToast,
      showToast,
      login,
      logout,
      publish,
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
      draftWalkthrough,
      toast,
      dismissToast,
      showToast,
      login,
      logout,
      publish,
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
