import { Organization } from "./organization";
import { Campus } from "./campus";
import { ActivityHour } from "./activityHours";

export type Status = "COMPLETED" | "IN_PROGRESS" | "PADDING" | "CANCELED";
export type ComplianceStandard = "KNOWLEDGE" | "SKILLS" | "ETHICS" | "PERSONAL_CHARACTERISTICS";
export type KasetsartStudentIdentity = "INTEGRITY" | "DETERMINATION" | "KNOWLEDGE_CREATION" | "UNITY";
export type SDG =
  | "SDG1" | "SDG2" | "SDG3" | "SDG4" | "SDG5" | "SDG6" | "SDG7" | "SDG8" | "SDG9"
  | "SDG10" | "SDG11" | "SDG12" | "SDG13" | "SDG14" | "SDG15" | "SDG16" | "SDG17";

// You can define ActivityHour interface in a separate file for better type safety
export interface ActivityHour {
  id: string;
  isCompleted: boolean;
  fileNamePrinciple?: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  userId: string;
}

export interface Project {
  id: string;
  publicProjectId: string;
  activityCode: string;
  nameEn: string;
  nameTh: string;
  dateStart: string; // ISO date string
  dateEnd: string;   // ISO date string
  targetUser: Record<string, number>[]; // e.g. [{ staff: 20 }, { student: 50 }]
  participants?: Record<string, number>[]; // e.g. [{ staff: 10 }, { student: 10 }]
  schedule?: Array<{
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
  }>;
  principlesAndReasoning?: string;
  status: Status;
  budgetUsed?: number;
  objectives?: string;
  activityFormat: string[];
  expectedProjectOutcome: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  location?: {
    location: string;
    outside?: Array<{
      postcode: string;
      address: string;
      city: string;
      province: string;
    }>;
  };
  organizationId: string;
  campusId: string;
  organization?: Organization;
  campus?: Campus;
  activities?: ActivityHour[];
  complianceStandards?: ComplianceStandard[];
  kasetsartStudentIdentities?: KasetsartStudentIdentity[];
  sustainableDevelopmentGoals?: SDG[];
  activityHours?: ActivityHour[];
}

export interface ProjectFilters {
  campusId?: string;
  organizationTypeId?: string;
  organizationId?: string;
}