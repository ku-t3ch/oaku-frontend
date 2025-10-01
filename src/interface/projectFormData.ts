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
      city: string;
      province: string;
    };
  };
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
  targetUser?: number;      
  participants?: number;    
  organizationId?: string;
  campusId?: string;
  activityHourFile?: ActivityHourFile[];
  documentFiles?: string;
  activityHours?: Array<{ [key: string]: number }>;
}
