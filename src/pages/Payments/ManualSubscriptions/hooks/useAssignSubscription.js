import { useCallback, useState } from "react";
import { post } from "./api";
import { adminSubscriptionAssignUrl } from "../../../../seed/url";

/**
 * Assign a package to a user. `assign` throws on failure so callers can toast.
 * A busy flag guards against double-submit.
 */
export function useAssignSubscription() {
  const [loading, setLoading] = useState(false);

  const assign = useCallback(async (payload) => {
    if (!payload?.user_id || !payload?.package_id) {
      throw new Error("User and package are required");
    }
    setLoading(true);
    try {
      return await post(adminSubscriptionAssignUrl, payload);
    } finally {
      setLoading(false);
    }
  }, []);

  return { assign, loading };
}
