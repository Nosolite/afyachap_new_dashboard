import { useCallback, useState } from "react";
import { post } from "./api";
import { adminSubscriptionAssignConsultationUrl } from "../../../../seed/url";

/**
 * Assign a consultation package to a user (creates an OPEN doctor session).
 */
export function useAssignConsultation() {
  const [loading, setLoading] = useState(false);

  const assignConsultation = useCallback(async (payload) => {
    if (!payload?.user_id || !payload?.package_id || !payload?.doctor_id) {
      throw new Error("User, package, and doctor are required");
    }
    setLoading(true);
    try {
      return await post(adminSubscriptionAssignConsultationUrl, payload);
    } finally {
      setLoading(false);
    }
  }, []);

  return { assignConsultation, loading };
}
