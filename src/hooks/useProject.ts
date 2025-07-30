import { useState, useEffect, useCallback, useRef } from "react";
import { Project, ProjectFilters } from "@/interface/project";
import { projectService } from "@/lib/api/project";

export const useProjects = (token: string, filters?: ProjectFilters) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const lastFiltersRef = useRef<string>("");
  const cacheRef = useRef<{ [key: string]: Project[] }>({});

  const [creating, setCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [deletingPdf, setDeletingPdf] = useState<boolean>(false);
  const [deletePdfError, setDeletePdfError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!token || !filters) return;

    const cacheKey = JSON.stringify(filters);

    if (lastFiltersRef.current === cacheKey && cacheRef.current[cacheKey]) {
      setProjects(cacheRef.current[cacheKey]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await projectService.getProjects(token, filters);
      setProjects(data);

      cacheRef.current[cacheKey] = data;
      lastFiltersRef.current = cacheKey;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch projects";
      setError(errorMessage);
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  }, [token, filters]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const refetch = useCallback(() => {
    const cacheKey = JSON.stringify(filters);
    if (cacheKey && cacheRef.current[cacheKey]) {
      delete cacheRef.current[cacheKey];
    }
    lastFiltersRef.current = "";
    fetchProjects();
  }, [fetchProjects, filters]);

  const createProject = useCallback(
    async (projectData: Partial<Project>) => {
      if (!token) return;
      setCreating(true);
      setCreateError(null);
      try {
        const newProject = await projectService.createProject(
          token,
          projectData
        );
        setProjects((prev) => [newProject, ...prev]);
        return newProject;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create project";
        setCreateError(errorMessage);
        console.error("Error creating project:", err);
        return null;
      } finally {
        setCreating(false);
      }
    },
    [token]
  );

  const uploadProjectDocumentFile = useCallback(
    async (projectId: string, file: File) => {
      if (!token || !projectId || !file) return;
      try {
        const result = await projectService.uploadProjectDocumentFile(
          token,
          projectId,
          file
        );
        return result;
      } catch (err) {
        console.error("Error uploading PDF file:", err);
        return null;
      }
    },
    [token]
  );
  const deleteProjectPdfFile = useCallback(
    async (projectId: string, key: string) => {
      if (!token || !projectId || !key) return null;
      setDeletingPdf(true);
      setDeletePdfError(null);
      try {
        const result = await projectService.deleteProjectPdfFile(
          token,
          projectId,
          key
        );
        await fetchProjects();
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete PDF file";
        setDeletePdfError(errorMessage);
        console.error("Error deleting PDF file:", err);
        return null;
      } finally {
        setDeletingPdf(false);
      }
    },
    [token, fetchProjects]
  );

  return {
    projects,
    loading,
    error,
    fetchProjects: refetch,
    createProject,
    creating,
    createError,
    deleteProjectPdfFile,
    deletingPdf,
    deletePdfError,
    uploadProjectDocumentFile,
  };
};

export function useProject(token: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchProject = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await projectService.getProject(token, id);
        setProject(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { project, loading, error, fetchProject };
}
