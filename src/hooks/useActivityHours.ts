import { useState } from "react";
import { uploadActivityHourFile, getActivityHourFile } from "@/lib/api/activityHours";

export function useActivityHours(token: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, projectId?: string, userId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await uploadActivityHourFile(file, token, projectId, userId);
      return result;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("เกิดข้อผิดพลาด");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (filename: string) => {
    setLoading(true);
    setError(null);
    try {
      const blob = await getActivityHourFile(filename, token);
      return blob;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("เกิดข้อผิดพลาด");
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { uploadFile, downloadFile, loading, error };
}