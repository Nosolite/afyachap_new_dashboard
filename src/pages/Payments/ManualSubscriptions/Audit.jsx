import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useAdminAssignments } from "./hooks/useAdminAssignments";
import { CustomAlert } from "../../../components/custom-alert";

const fmtTzs = (n) =>
  "TZS " + Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });
const fmtDate = (s) =>
  s ? new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

export default function Audit() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { rows, total, loading, error } = useAdminAssignments({}, page, 20);

  const [alert, setAlert] = useState({ open: false, severity: "error", message: "" });
  useEffect(() => {
    if (error) setAlert({ open: true, severity: "error", message: "Failed to load assignments" });
  }, [error]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const name = r.user_name || r.user?.name || r.user?.userName || "";
      const phone = r.phone_number || r.user?.phone || "";
      const order = r.order_id || "";
      return `${name} ${phone} ${order}`.toLowerCase().includes(q);
    });
  }, [rows, search]);

  const activeCount = rows.filter((r) => r.is_active).length;
  const totalAmount = rows.reduce((sum, r) => sum + Number(r.amount || 0), 0);

  return (
    <Container maxWidth={false}>
      <Box mb={3}>
        <Typography
          variant="overline"
          color="primary"
          sx={{ fontWeight: 700, letterSpacing: ".08em", lineHeight: 1 }}
        >
          Payments · Manual subscription
        </Typography>
        <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
          Audit
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 640 }}>
          Review every admin-assigned subscription and the revenue it generated.
        </Typography>
      </Box>

      <Grid container spacing={2} mb={2}>
        <Tile label="Admin-assigned revenue" value={loading ? null : fmtTzs(totalAmount)} />
        <Tile label="Active subscriptions" value={loading ? null : String(activeCount)} />
        <Tile label="Assignments (this page)" value={loading ? null : String(rows.length)} />
      </Grid>

      <Paper>
        <Box p={2} display="flex" gap={2} flexWrap="wrap">
          <TextField
            label="Search user, phone or order"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: 220 }}
          />
        </Box>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Assigned</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              {!loading &&
                filtered.map((r, i) => (
                  <TableRow key={r.order_id || i}>
                    <TableCell>
                      {r.user_name || r.user?.name || r.user?.userName || `User ${r.user_id}`}
                    </TableCell>
                    <TableCell>{r.package_name || `Service ID ${r.service_id}`}</TableCell>
                    <TableCell>{fmtDate(r.created_at || r.assigned_at)}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={r.is_active ? "Active" : "Inactive"}
                        color={r.is_active ? "success" : "default"}
                      />
                    </TableCell>
                    <TableCell align="right">{fmtTzs(r.amount)}</TableCell>
                  </TableRow>
                ))}
              {!loading && !filtered.length && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ borderBottom: 0 }}>
                    <Box py={5} textAlign="center">
                      <Box sx={{ color: "text.disabled", display: "flex", justifyContent: "center", mb: 1.5 }}>
                        <ClipboardDocumentListIcon width={40} height={40} />
                      </Box>
                      <Typography variant="subtitle1" fontWeight={700}>
                        {search ? "No matching assignments" : "No assignments yet"}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {search
                          ? "Try a different name, phone, or order ID."
                          : "Assignments you make appear here with their revenue and status."}
                      </Typography>
                      {!search && (
                        <Button
                          variant="outlined"
                          onClick={() => navigate("/payments/manual-subscriptions")}
                        >
                          Go to assign
                        </Button>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page - 1}
          rowsPerPage={20}
          onPageChange={(_, p) => setPage(p + 1)}
          rowsPerPageOptions={[20]}
        />
      </Paper>

      <CustomAlert
        openAlert={alert.open}
        severity={alert.severity}
        severityMessage={alert.message}
        handleCloseAlert={() => setAlert((a) => ({ ...a, open: false }))}
      />
    </Container>
  );
}

function Tile({ label, value }) {
  return (
    <Grid item xs={12} sm={4}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        {value === null ? (
          <Skeleton width="60%" sx={{ mt: 1 }} />
        ) : (
          <Typography variant="h5" sx={{ mt: 0.5, fontVariantNumeric: "tabular-nums" }}>
            {value}
          </Typography>
        )}
      </Paper>
    </Grid>
  );
}
