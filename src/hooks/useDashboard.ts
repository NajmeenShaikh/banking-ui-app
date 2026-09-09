import { useEffect, useState } from "react";
import { fetchDashboard } from "../services/bankingApi";
import type { DashboardData } from "../types/banking";

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setData(await fetchDashboard());
    } catch {
      setError("Unable to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  return { data, isLoading, error, retry: load };
}