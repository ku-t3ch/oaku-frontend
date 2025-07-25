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
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch projects";
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
        const newProject = await projectService.createProject(token, projectData);
        setProjects((prev) => [newProject, ...prev]);
        return newProject;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to create project";
        setCreateError(errorMessage);
        console.error("Error creating project:", err);
        return null;
      } finally {
        setCreating(false);
      }
    },
    [token]
  );

  return {
    projects,
    loading,
    error,
    fetchProjects: refetch,
    createProject,
    creating,
    createError,
  };
};