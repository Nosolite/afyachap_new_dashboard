import { useCallback, useEffect, useState } from "react";
import { get } from "./api";
import { adminSubscriptionAdminAssignedUrl } from "../../../../seed/url";

/**
 * Load the audit list of admin-assigned subscriptions with filters + pagination.
 */
export function useAdminAssignments(filters = {}, page = 1, limit = 20) {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    if (filters.user_id) params.set("user_id", filters.user_id);
    if (filters.service_id) params.set("service_id", filters.service_id);
    if (filters.start_date) params.set("start_date", filters.start_date);
    if (filters.end_date) params.set("end_date", filters.end_date);

    try {
      const response = await get(`${adminSubscriptionAdminAssignedUrl}?${params}`);
      const data = response?.data || [];
      setRows(Array.isArray(data) ? data : []);
      setTotal(Number(response?.pagination?.total || data.length || 0));
    } catch (e) {
      setRows([]);
      setTotal(0);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filters.user_id, filters.service_id, filters.start_date, filters.end_date]);

  useEffect(() => {
    load();
  }, [load]);

  return { rows, total, loading, error, reload: load };
}
