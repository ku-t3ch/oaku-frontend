import { useState, useCallback } from "react";
import { Organization, OrganizationDetail } from "@/interface/organization";
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  getOrganizationById,
} from "@/lib/api/organization";

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
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
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
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { create, loading, error };
}

// อัปเดต organization รองรับทั้งข้อมูลและรูปภาพ
export function useUpdateOrganization(token: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(
    async (id: string, data: Partial<Organization> & { image?: File }) => {
      setLoading(true);
      setError(null);
      try {
        return await updateOrganization(token, id, data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { update, loading, error };
}

// ดึง organization by ID พร้อมสมาชิก
export function useOrganizationById(token: string) {
  const [organization, setOrganization] = useState<OrganizationDetail | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizationById = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getOrganizationById(token, id);
        setOrganization(data);
        return data;
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { organization, loading, error, fetchOrganizationById };
}
