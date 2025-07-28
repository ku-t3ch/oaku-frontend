import {
  Status,
  ComplianceStandard,
  KasetsartStudentIdentity,
  SDG,
} from "./project";
import { ActivityHourFile } from "./activityHours"; // เพิ่มถ้ายังไม่มี

export interface ProjectFormData {
  activityCode: string;
  nameEn: string;
  nameTh: string;
  dateStart: string;
  dateEnd: string;
  activityFormat: string[];
  objectives: string;
  expectedProjectOutcome: string[];
  budgetUsed: number;
  principlesAndReasoning: string;
  status: Status;
  complianceStandards: ComplianceStandard[];
  kasetsartStudentIdentities: KasetsartStudentIdentity[];
  sustainableDevelopmentGoals: SDG[];

  location?: {
    location: string;
    outside?: {
      subdistrict: string;
      postcode: string;
      address: string;
      city: string;
      province: string;
    };
  };
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
      participants: { staff?: number; student?: number }[];
    }>;
  }>;
  targetUser?: Record<string, number>[];
  participants?: Record<string, number>[];
  organizationId?: string;
  campusId?: string;
  activityHourFile?: ActivityHourFile[];
  activityHours?: Array<{ [key: string]: number }>;
}
