import { useCallback, useEffect, useState } from "react";
import { get } from "./api";
import { adminSubscriptionRevenueUrl } from "../../../../seed/url";

/**
 * Load admin-subscription revenue summary + breakdown for a date range.
 */
export function useRevenue(filters = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (filters.start_date) params.set("start_date", filters.start_date);
    if (filters.end_date) params.set("end_date", filters.end_date);
    if (filters.user_id) params.set("user_id", filters.user_id);

    try {
      const response = await get(`${adminSubscriptionRevenueUrl}?${params}`);
      setData(response?.data || response || null);
    } catch (e) {
      setData(null);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [filters.start_date, filters.end_date, filters.user_id]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load };
}
