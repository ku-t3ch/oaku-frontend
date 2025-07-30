import { useState } from "react";
import {
  uploadActivityHourFile,
  deleteActivityHourFile,
  downloadActivityHourFile,
} from "@/lib/api/activityHours";

export function useActivityHours(token: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, projectId: string, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await uploadActivityHourFile(file, token, projectId, userId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (projectId: string, fileNamePrinciple: string) => {
    setLoading(true);
    setError(null);
    try {
      const blob = await downloadActivityHourFile(projectId, fileNamePrinciple, token);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileNamePrinciple;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      return blob;
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await deleteActivityHourFile(id, token);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { uploadFile, downloadFile, deleteFile, loading, error };
}