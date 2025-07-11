import { useState, useCallback } from "react";
import { getAllCampuses } from "@/lib/api/campus";
import { Campus } from "@/interface/campus";

export function useCampuses() {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCampuses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCampuses();
      setCampuses(data);
    } catch (err:unknown) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred");
        }
        throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { campuses, loading, error, fetchCampuses };
}
