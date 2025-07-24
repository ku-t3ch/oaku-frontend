import { useState, useEffect, useCallback } from "react";
import { Project, ProjectFilters } from "@/interface/project";
import { projectService } from "@/lib/api/project";

export const useProjects = (token: string, filters?: ProjectFilters) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [creating, setCreating] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const data = await projectService.getProjects(token, filters);
      setProjects(data);
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
    fetchProjects();
  }, [fetchProjects]);

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