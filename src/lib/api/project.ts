import { Project, ProjectFilters } from "@/interface/project";
import { ProjectFormData } from "@/interface/projectFormData";


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

export function mapFormDataToProjectPayload(formData: ProjectFormData) {
  return {
    activityCode: formData.activityCode,
    nameEn: formData.nameEn,
    nameTh: formData.nameTh,
    dateStart: formData.dateStart
      ? new Date(formData.dateStart).toISOString()
      : undefined,
    dateEnd: formData.dateEnd
      ? new Date(formData.dateEnd).toISOString()
      : undefined,
    targetUser: Array.isArray(formData.targetUser) ? formData.targetUser : [],
    participants: Array.isArray(formData.participants) ? formData.participants : [],
    schedule: Array.isArray(formData.schedule) ? formData.schedule : [],
    complianceStandards: Array.isArray(formData.complianceStandards) ? formData.complianceStandards : [],
    kasetsartStudentIdentities: Array.isArray(formData.kasetsartStudentIdentities) ? formData.kasetsartStudentIdentities : [],
    sustainableDevelopmentGoals: Array.isArray(formData.sustainableDevelopmentGoals) ? formData.sustainableDevelopmentGoals : [],
    principlesAndReasoning: formData.principlesAndReasoning || "",
    status: formData.status || "PADDING",
    budgetUsed: typeof formData.budgetUsed === "number" ? formData.budgetUsed : 0,
    objectives: formData.objectives || "",
    activityFormat: Array.isArray(formData.activityFormat) ? formData.activityFormat : [],
    expectedProjectOutcome: Array.isArray(formData.expectedProjectOutcome) ? formData.expectedProjectOutcome : [],
    location: formData.location || undefined,
    organizationId: formData.organizationId || "",
    campusId: formData.campusId || "",
    activityHours: Array.isArray(formData.activityHours) ? formData.activityHours : [],
  };
}
