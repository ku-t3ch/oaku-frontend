import { useState, useEffect } from "react";
import { getOrganizationsByCampusId } from "@/lib/api/organization";

export function useOrganization(selectedCampus: string) {
  const [organizations, setOrganizations] = useState<{
    [x: string]: any;
    nameTh: any; id: string; name: string 
}[]>([]);
  const [orgLoading, setOrgLoading] = useState(false);

  useEffect(() => {
    if (selectedCampus !== "all") {
      setOrgLoading(true);
      getOrganizationsByCampusId(selectedCampus)
        .then((data) => {
          setOrganizations(data || []);
        })
        .catch(() => setOrganizations([]))
        .finally(() => setOrgLoading(false));
    } else {
      setOrganizations([]);
    }
  }, [selectedCampus]);

  return { organizations, orgLoading };
}

