import { Project, ProjectFilters } from "@/interface/project";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const projectService = {
  getProjects: async (
    token: string,
    filters?: ProjectFilters
  ): Promise<Project[]> => {
    const searchParams = new URLSearchParams();

    if (filters?.campusId) searchParams.append("campusId", filters.campusId);
    if (filters?.organizationTypeId)
      searchParams.append("organizationTypeId", filters.organizationTypeId);
    if (filters?.organizationId)
      searchParams.append("organizationId", filters.organizationId);

    const url = `${API_BASE_URL}/projects${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data: Project[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  },

  createProject: async (
    token: string,
    projectData: Partial<Project>
  ): Promise<Project> => {
    const url = `${API_BASE_URL}/projects`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data: Project = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },
};
