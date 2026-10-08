import { useCallback, useEffect, useState } from "react";
import { get } from "./api";
import {
  adminSubscriptionUserDetailsUrl,
  adminSubscriptionUserHistoryUrl,
} from "../../../../seed/url";

const LIMIT = 10;

const emptyPagination = {
  current_page: 1,
  last_page: 1,
  per_page: LIMIT,
  total: 0,
};

/**
 * Load a single user's details + paginated subscription history.
 */
export function useSubscriptionDetail(userId) {
  const [details, setDetails] = useState(null);
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState(emptyPagination);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async (uid, p = 1) => {
    if (!uid) return;
    setLoading(true);
    setError(null);

    try {
      const res = await get(`${adminSubscriptionUserDetailsUrl}${uid}/details`);
      setDetails(res || null);
    } catch (e) {
      setDetails(null);
      setError(e);
    }

    try {
      const res = await get(
        `${adminSubscriptionUserHistoryUrl}${uid}/history?page=${p}&limit=${LIMIT}`
      );
      const list = res?.subscription_history || res?.data || res?.results || [];
      const pag = res?.pagination || {};
      setHistory(Array.isArray(list) ? list : []);
      setPagination({
        current_page: Number(pag.current_page || p),
        last_page: Number(pag.last_page || 1),
        per_page: Number(pag.per_page || LIMIT),
        total: Number(pag.total || (Array.isArray(list) ? list.length : 0)),
      });
    } catch (e) {
      setHistory([]);
      setPagination(emptyPagination);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    load(userId, page);
  }, [userId, page, load]);

  const reload = useCallback(() => load(userId, page), [load, userId, page]);

  return { details, history, pagination, page, setPage, loading, error, reload };
}
