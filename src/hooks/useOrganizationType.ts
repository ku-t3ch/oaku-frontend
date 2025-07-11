import { useState, useEffect } from "react";
import { getOrganizationTypes } from "@/lib/api/organizationType";
import { organizationType } from "@/interface/organizationType";

export function useOrganizationType(token: string, campusId?: string) {
  const [organizationTypes, setOrganizationTypes] = useState<organizationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    const urlToken = token;
    getOrganizationTypes(
      urlToken,
      campusId && campusId !== "all" ? campusId : undefined
    )
      .then((data) => {
        setOrganizationTypes(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token, campusId]);

  return { organizationTypes, loading, error };
}