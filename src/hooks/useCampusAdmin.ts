import { useState } from "react";
import { CampusAdminSuspendUser } from "@/lib/api/user";

export function useCampusAdminSuspendUser(token: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suspend = async (
    userId: string,
    isSuspended: boolean,
    organizationId: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      await CampusAdminSuspendUser(token, userId, organizationId, isSuspended);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("เกิดข้อผิดพลาด");
      }
    } finally {
      setLoading(false);
    }
  };

  return { suspend, loading, error };
}