import { useCallback, useState } from "react";
import { post } from "./api";
import { adminSubscriptionCancelUrl } from "../../../../seed/url";

/**
 * Cancel a user's subscription. `cancel` throws on failure so callers can toast.
 */
export function useCancelSubscription() {
  const [loading, setLoading] = useState(false);

  const cancel = useCallback(async (payload) => {
    if (!payload?.user_id) {
      throw new Error("User is required");
    }
    setLoading(true);
    try {
      return await post(adminSubscriptionCancelUrl, payload);
    } finally {
      setLoading(false);
    }
  }, []);

  return { cancel, loading };
}
