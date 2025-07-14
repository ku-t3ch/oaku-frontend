import { useState, useCallback } from "react";
import { Organization } from "@/interface/organization";
import { getOrganizations, createOrganization, updateOrganization } from "@/lib/api/organization";

// ดึง organizations
export function useOrganizations(token: string) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizations = useCallback(
    async (params: { campusId?: string; organizationTypeId?: string } = {}) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getOrganizations(token, params);
        setOrganizations(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { organizations, loading, error, fetchOrganizations };
}

// สร้าง organization
export function useCreateOrganization(token: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(
    async (data: Partial<Organization>) => {
      setLoading(true);
      setError(null);
      try {
        return await createOrganization(token, data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { create, loading, error };
}

// อัปเดต organization
export function useUpdateOrganization(token: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (id: string, data: Partial<Organization>) => {
      setLoading(true);
      setError(null);
      try {
        return await updateOrganization(token, id, data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { update, loading, error };
}