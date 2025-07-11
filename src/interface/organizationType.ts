import { Organization } from "./organization";

export interface organizationType {
  id: string;
  name: string;
  campusId: string;
    organizations: Organization[]; 
}

