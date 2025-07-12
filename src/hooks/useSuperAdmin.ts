import { useState, useCallback } from "react";
import { suspendUser as apiSuspendUser } from "@/lib/api/user";
import { User } from "@/interface/user";

export function useSuspendUser(token: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // รองรับส่ง isSuspended (true/false)
  const suspend = useCallback(
    async (id: string, isSuspended: boolean = true) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiSuspendUser(token, id, isSuspended);
        setUser(result);
        return result;
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  return { suspend, loading, error, user };
}