import React from "react";
import { Box, Button, Card, CardContent, Chip, Typography } from "@mui/material";

const formatDate = (s) =>
  s ? new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

/**
 * Current subscription status + assign/cancel actions.
 */
export function CurrentSubscriptionCard({ account, subscription, packages, onAssign, onCancel }) {
  const type = account?.user_account_type;
  const isPremium = type === "PREMIUM";
  const active = isPremium && account?.valid_to && new Date(account.valid_to) > new Date();

  const packageName = (() => {
    const sid = subscription?.service_id;
    if (!sid) return "No active package";
    const sub = packages?.sub_services?.find((s) => s.id === sid);
    const biz = packages?.business_services?.find((s) => s.id === sid);
    return sub?.name || biz?.name || `Service ID ${sid}`;
  })();

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={2}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Current subscription
            </Typography>
            <Typography variant="h6">{packageName}</Typography>
            <Typography variant="body2" color="text.secondary">
              {active ? `Expires ${formatDate(account.valid_to)}` : "Not active"}
            </Typography>
          </Box>
          <Chip
            size="small"
            label={active ? "Active" : "Inactive"}
            color={active ? "success" : "default"}
            variant="filled"
          />
        </Box>
        <Box mt={2} display="flex" gap={1}>
          <Button variant="contained" onClick={onAssign}>
            Assign package
          </Button>
          <Button variant="outlined" color="error" onClick={onCancel}>
            Cancel
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
