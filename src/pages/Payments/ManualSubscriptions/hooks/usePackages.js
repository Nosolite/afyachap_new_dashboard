import { useEffect, useState } from "react";
import { get } from "./api";
import { adminSubscriptionPackagesUrl } from "../../../../seed/url";

/**
 * Load the available package taxonomy (business services + active sub-services).
 */
export function usePackages() {
  const [packages, setPackages] = useState({
    business_services: [],
    sub_services: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    get(adminSubscriptionPackagesUrl)
      .then((response) => {
        if (!active) return;
        if (response?.success) {
          setPackages({
            business_services: response.business_services || [],
            sub_services: response.sub_services || [],
          });
        } else {
          setError(new Error(response?.message || "No packages available"));
        }
      })
      .catch((e) => active && setError(e))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  return { packages, loading, error };
}
