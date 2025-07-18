export interface Project {
  id: string;
  publicProjectId: string;
  activityCode: string;
  nameEn: string;
  nameTh: string;
  dateStart: string;
  dateEnd: string;
  targetUser: Array<Record<string, number>>; // [{"student": 50}, {"researcher": 10}]
  participants: Array<Record<string, number>> | null; // [{"student": 45}, {"researcher": 8}]
  schedule: Array<{
    location: string;
    eachDay: Array<{
      date: string;
      description: string;
      timeline: Array<{
        timeStart: string;
        timeEnd: string;
        description: string;
      }>;
    }>;
  }> | null;
  principlesAndReasoning: string | null;
  status: "COMPLETED" | "IN_PROGRESS" | "PADDING" | "CANCELED";
  budgetUsed: number | null;
  objectives: string | null;
  activityFormat: string[];
  expectedProjectOutcome: string[];
  createdAt: string;
  updatedAt: string;
  location: {
    location: string;
    outside: Array<{
      city: string;
      address: string;
      postcode: string;
      province: string;
    }>;
  } | null;
  organizationId: string;
  campusId: string;
  complianceStandards: ("KNOWLEDGE" | "SKILLS" | "ETHICS" | "PERSONAL_CHARACTERISTICS")[];
  kasetsartStudentIdentities: ("INTEGRITY" | "DETERMINATION" | "KNOWLEDGE_CREATION" | "UNITY")[];
  sustainableDevelopmentGoals: string[]; // SDG1, SDG2, etc.
  activityHours: {
    categories: Array<{
      hours: number;
      category: string;
    }>;
    totalHours: number;
  } | null;
  organization: {
    id: string;
    nameEn: string;
    nameTh: string;
    image?: string;
    campus: {
      id: string;
      name: string;
    };
    organizationType: {
      id: string;
      name: string;
    };
  };
  campus: {
    id: string;
    name: string;
  };
}

export interface ProjectFilters {
  campusId?: string;
  organizationTypeId?: string;
  organizationId?: string;
}

// Additional helper types
export interface ProjectScheduleDay {
  date: string;
  description: string;
  timeline: Array<{
    timeStart: string;
    timeEnd: string;
    description: string;
  }>;
}

export interface ProjectSchedule {
  location: string;
  eachDay: ProjectScheduleDay[];
}

export interface ProjectLocation {
  location: string;
  outside: Array<{
    city: string;
    address: string;
    postcode: string;
    province: string;
  }>;
}

export interface ActivityCategory {
  hours: number;
  category: string;
}

export interface ProjectActivityHours {
  categories: ActivityCategory[];
  totalHours: number;
}

// Enum types for better type safety
export type ProjectStatus = "COMPLETED" | "IN_PROGRESS" | "PADDING" | "CANCELED";

export type ComplianceStandard = "KNOWLEDGE" | "SKILLS" | "ETHICS" | "PERSONAL_CHARACTERISTICS";

export type KasetsartStudentIdentity = "INTEGRITY" | "DETERMINATION" | "KNOWLEDGE_CREATION" | "UNITY";

export type SDG = 
  | "SDG1" | "SDG2" | "SDG3" | "SDG4" | "SDG5" | "SDG6" 
  | "SDG7" | "SDG8" | "SDG9" | "SDG10" | "SDG11" | "SDG12" 
  | "SDG13" | "SDG14" | "SDG15" | "SDG16" | "SDG17";