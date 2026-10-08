import { useCallback, useEffect, useState } from "react";
import { authPost } from "./api";
import { getAllUsersUrl } from "../../../../seed/url";

const LIMIT = 10;

/**
 * Debounced user search against the users service.
 * Returns a flattened options list (deduped across pages).
 */
export function useUserSearch() {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async (q, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authPost(getAllUsersUrl, {
        query: q,
        from: "",
        to: "",
        sort: "id desc",
        limit: LIMIT,
        page,
      });
      const incoming = Array.isArray(data?.results) ? data.results : [];
      setOptions((prev) => {
        if (page === 1) return incoming;
        const seen = new Set(prev.map((u) => u.id));
        return [...prev, ...incoming.filter((u) => !seen.has(u.id))];
      });
    } catch (e) {
      setOptions([]);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q = (query || "").trim();
    if (q.length < 1) {
      setOptions([]);
      setError(null);
      return;
    }
    const t = setTimeout(() => fetchUsers(q, 1), 350);
    return () => clearTimeout(t);
  }, [query, fetchUsers]);

  return { query, setQuery, options, loading, error, clear: () => setQuery("") };
}
