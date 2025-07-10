import { useState, useEffect, useCallback } from "react";
import { Campus } from "@/interface/campus";
import { getAllCampuses } from "@/lib/api/campus";

export const useCampus = () => {
  const [campuses, setCampuses] = useState<Campus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampuses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCampuses();
      setCampuses(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("เกิดข้อผิดพลาดในการโหลดข้อมูลวิทยาเขต");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampuses();
  }, [fetchCampuses]);

  return { campuses, loading, error, refetch: fetchCampuses };
};
