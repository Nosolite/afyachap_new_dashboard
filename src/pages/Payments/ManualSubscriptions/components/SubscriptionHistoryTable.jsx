import React from "react";
import {
  Box,
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

const fmt = (s) =>
  s ? new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

const statusProps = (status, endAt) => {
  const s = String(status || "").toUpperCase();
  if (s === "ACTIVE") return { label: "Active", color: "success" };
  if (s === "CANCELLED") return { label: "Cancelled", color: "error" };
  if (s === "SUPERSEDED") return { label: "Superseded", color: "warning" };
  if (s === "EXPIRED") return { label: "Expired", color: "default" };
  // fallback: derive from end date
  if (endAt && new Date(endAt) < new Date()) return { label: "Expired", color: "default" };
  return { label: "Active", color: "success" };
};

const packageName = (serviceId, packages) => {
  const sub = packages?.sub_services?.find((s) => s.id === serviceId);
  const biz = packages?.business_services?.find((s) => s.id === serviceId);
  return sub?.name || biz?.name || `Service ID ${serviceId}`;
};

export function SubscriptionHistoryTable({ history, packages, pagination, page, setPage, loading }) {
  if (loading) {
    return (
      <Box>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={48}
            sx={{ mb: 1, borderRadius: 1 }}
          />
        ))}
      </Box>
    );
  }

  if (!history.length) {
    return (
      <Box py={4} textAlign="center">
        <Typography color="text.secondary">No subscription history</Typography>
      </Box>
    );
  }

  const perPage = pagination?.per_page || 10;
  const total = pagination?.total || history.length;

  return (
    <>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Package</TableCell>
              <TableCell>Period</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Order</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((h, i) => {
              const s = statusProps(h.status, h.subscription_end_at);
              return (
                <TableRow key={h.id || i}>
                  <TableCell>{packageName(h.service_id, packages)}</TableCell>
                  <TableCell>
                    {fmt(h.subscription_start_at)} → {fmt(h.subscription_end_at)}
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={s.label} color={s.color} />
                  </TableCell>
                  <TableCell>{h.order_id || "—"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={Math.max(0, page - 1)}
        rowsPerPage={perPage}
        onPageChange={(_, p) => setPage(p + 1)}
        rowsPerPageOptions={[perPage]}
      />
    </>
  );
}
