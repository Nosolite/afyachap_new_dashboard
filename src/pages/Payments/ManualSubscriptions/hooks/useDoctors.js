import { useCallback, useEffect, useState } from "react";
import { microPost } from "./api";
import { getAllDoctorUrl } from "../../../../seed/url";

/**
 * Debounced, searchable doctor lookup for the consultation assignment flow.
 */
export function useDoctors() {
  const [query, setQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (q) => {
    setLoading(true);
    setError(null);
    try {
      const data = await microPost(getAllDoctorUrl, {
        query: q,
        sort: "id desc",
        limit: 50,
        page: 1,
      });
      setDoctors(Array.isArray(data?.results) ? data.results : []);
    } catch (e) {
      setDoctors([]);
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const q = (query || "").trim();
    const t = setTimeout(() => load(q), 350);
    return () => clearTimeout(t);
  }, [query, load]);

  return { query, setQuery, doctors, loading, error };
}
