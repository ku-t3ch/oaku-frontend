import { ActivityHourFile } from "@/interface/activityHours";
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

  getProject: async (token: string, projectId: string): Promise<Project> => {
    const res = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลโครงการได้");
    return res.json();
  },

  uploadProjectDocumentFile: async (
    token: string,
    projectId: string,
    file: File
  ): Promise<{ fileUrl: string; project: Project }> => {
    const url = `${API_BASE_URL}/projects/${projectId}/document-file`;
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    return response.json();
  },

  // DELETE PDF document file
  deleteProjectPdfFile: async (
    token: string,
    projectId: string,
    key: string
  ): Promise<{ success: boolean }> => {
    const url = `${API_BASE_URL}/projects/${projectId}/document-file?key=${encodeURIComponent(
      key
    )}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorText}`
      );
    }

    return response.json();
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
    targetUser:
      typeof formData.targetUser === "number" ? formData.targetUser : 0,
    participants:
      typeof formData.participants === "number" ? formData.participants : 0,
    schedule: Array.isArray(formData.schedule) ? formData.schedule : [],
    complianceStandards: Array.isArray(formData.complianceStandards)
      ? formData.complianceStandards
      : [],
    kasetsartStudentIdentities: Array.isArray(
      formData.kasetsartStudentIdentities
    )
      ? formData.kasetsartStudentIdentities
      : [],
    sustainableDevelopmentGoals: Array.isArray(
      formData.sustainableDevelopmentGoals
    )
      ? formData.sustainableDevelopmentGoals
      : [],
    principlesAndReasoning: formData.principlesAndReasoning || "",
    status: formData.status || "PADDING",
    budgetUsed:
      typeof formData.budgetUsed === "number" ? formData.budgetUsed : 0,
    objectives: formData.objectives || "",
    activityFormat: Array.isArray(formData.activityFormat)
      ? formData.activityFormat
      : [],
    expectedProjectOutcome: Array.isArray(formData.expectedProjectOutcome)
      ? formData.expectedProjectOutcome
      : [],
    location: formData.location
      ? {
          location: formData.location.location || "",
          outside: formData.location.outside
            ? [
                {
                  postcode: formData.location.outside.postcode || "",
                  subdistrict: formData.location.outside.subdistrict || "",
                  city: formData.location.outside.city || "",
                  province: formData.location.outside.province || "",
                },
              ]
            : undefined,
        }
      : undefined,
    organizationId: formData.organizationId || "",
    campusId: formData.campusId || "",
    activityHours: Array.isArray(formData.activityHours)
      ? formData.activityHours
      : [],
    activityHourFile: Array.isArray(formData.activityHourFile)
      ? formData.activityHourFile
      : [],
  };
}

export const completeActivityHourFile = async (
  token: string,
  projectId: string,
  activityHourFileId: string
): Promise<{ activityHour: ActivityHourFile; project: Project }> => {
  const url = `${API_BASE_URL}/projects/${projectId}/activity-hour-file/${activityHourFileId}/complete`;
  const response = await fetch(url, {
    method: "PATCH",
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

  return response.json();
};
