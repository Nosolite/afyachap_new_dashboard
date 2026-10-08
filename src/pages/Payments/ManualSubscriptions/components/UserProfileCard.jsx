import React from "react";
import { Avatar, Box, Card, CardContent, Typography } from "@mui/material";
import { displayName, formatPhone, initials, phoneOf, userPhoto } from "../utils";

const accountLabel = (account) => account?.user_account_type || "—";

export function UserProfileCard({ user, account }) {
  const photo = userPhoto(user);
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar
            src={photo}
            alt={displayName(user)}
            sx={{ width: 56, height: 56, bgcolor: "primary.light", color: "primary.main", fontSize: 20, fontWeight: 700 }}
          >
            {initials(user)}
          </Avatar>
          <Box minWidth={0}>
            <Typography variant="h6" noWrap>
              {displayName(user)}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap sx={{ fontVariantNumeric: "tabular-nums" }}>
              {formatPhone(phoneOf(user)) || "—"}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.email || "—"}
            </Typography>
          </Box>
        </Box>
        <Box mt={2} display="grid" gap={1}>
          <Row label="Account type" value={accountLabel(account)} />
          <Row label="User ID" value={user?.id ?? "—"} />
        </Box>
      </CardContent>
    </Card>
  );
}

function Row({ label, value }) {
  return (
    <Box display="flex" justifyContent="space-between" gap={2}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600} sx={{ fontVariantNumeric: "tabular-nums" }}>
        {value}
      </Typography>
    </Box>
  );
}
