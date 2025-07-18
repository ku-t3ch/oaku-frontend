import { Project, ProjectFilters } from "@/interface/project";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const projectService = {
  // Get all projects with optional filters
  getProjects: async (
    token: string,
    filters?: ProjectFilters
  ): Promise<Project[]> => {
    try {
      const searchParams = new URLSearchParams();
      
      if (filters?.campusId) {
        searchParams.append("campusId", filters.campusId);
      }
      if (filters?.organizationTypeId) {
        searchParams.append("organizationTypeId", filters.organizationTypeId);
      }
      if (filters?.organizationId) {
        searchParams.append("organizationId", filters.organizationId);
      }

      const url = `${API_BASE_URL}/projects${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  },
};