import { Organization } from "./organization";
import { Campus } from "./campus";
import { ActivityHourFile } from "./activityHours";

export type Status = "COMPLETED" | "IN_PROGRESS" | "PADDING" | "CANCELED";
export type ComplianceStandard =
  | "KNOWLEDGE"
  | "SKILLS"
  | "ETHICS"
  | "PERSONAL_CHARACTERISTICS";
export type KasetsartStudentIdentity =
  | "INTEGRITY"
  | "DETERMINATION"
  | "KNOWLEDGE_CREATION"
  | "UNITY";
export type SDG =
  | "SDG1"
  | "SDG2"
  | "SDG3"
  | "SDG4"
  | "SDG5"
  | "SDG6"
  | "SDG7"
  | "SDG8"
  | "SDG9"
  | "SDG10"
  | "SDG11"
  | "SDG12"
  | "SDG13"
  | "SDG14"
  | "SDG15"
  | "SDG16"
  | "SDG17";

export interface Project {
  id: string;
  publicProjectId: string;
  activityCode: string;
  nameEn: string;
  nameTh: string;
  dateStart: string;
  dateEnd: string;
  targetUser?: number;
  participants?: number;
  schedule?: Array<{
    eachDay: Array<{
      date: string;
      description: string;
      timeline: Array<{
        timeStart: string;
        timeEnd: string;
        description: string;
        location: string;
      }>;
    }>;
  }>;
  principlesAndReasoning?: string;
  status: Status;
  budgetUsed?: number;
  objectives?: string;
  activityFormat: string[];
  expectedProjectOutcome: string[];
  createdAt: string;
  updatedAt: string;
  location?: {
    location: string;
    outside?: Array<{
      postcode: string;
      subdistrict: string;
      address: string;
      city: string;
      province: string;
    }>;
  };
  organizationId: string;
  campusId: string;
  organization?: Organization;
  campus?: Campus;
  activityHourFiles?: ActivityHourFile[];
  complianceStandards?: ComplianceStandard[];
  kasetsartStudentIdentities?: KasetsartStudentIdentity[];
  sustainableDevelopmentGoals?: SDG[];
  activityHours?: Array<{ [key: string]: number }>;
}

export interface ProjectFilters {
  campusId?: string;
  organizationTypeId?: string;
  organizationId?: string;
}
