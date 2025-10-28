import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";
import {
  adminSubscriptionAdminAssignedUrl,
  adminSubscriptionPackagesUrl,
} from "../../../seed/url";

import { webGetRequest } from "../../../services/api-service";
import { formatMoney } from "../../../utils/constant";

function AllAssignments() {
  const [rows, setRows] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [total, setTotal] = React.useState(0);

  // Filters
  const [query, setQuery] = React.useState(""); // maps to 'search'
  const [status, setStatus] = React.useState(""); // active | expired | all
  const [serviceId, setServiceId] = React.useState(""); // package selection
  const [packageOptions, setPackageOptions] = React.useState([]);
  const [dateFrom, setDateFrom] = React.useState("");
  const [dateTo, setDateTo] = React.useState("");
  const [sortBy, setSortBy] = React.useState("created_at");
  const [sortOrder, setSortOrder] = React.useState("desc");

  const fetcher = React.useCallback(() => {
    setIsLoading(true);
    const params = new URLSearchParams();
    params.set("page", String(page + 1));
    params.set("limit", String(rowsPerPage));
    if (serviceId) params.set("service_id", String(serviceId).trim());
    if (dateFrom) params.set("start_date", dateFrom);
    if (dateTo) params.set("end_date", dateTo);
    if (status) params.set("status", status);
    if (query) params.set("search", query.trim());
    if (sortBy) params.set("sort_by", sortBy);
    if (sortOrder) params.set("sort_order", sortOrder);

    webGetRequest(
      `${adminSubscriptionAdminAssignedUrl}?${params.toString()}`,
      (res) => {
        const data = res?.data || res;
        const items = Array.isArray(data)
          ? data
          : data?.items || data?.results || [];
        const pagination = res?.pagination || {};
        setRows(items);
        setTotal(Number(pagination?.total || items.length || 0));
        setIsLoading(false);
      },
      () => {
        setRows([]);
        setTotal(0);
        setIsLoading(false);
      }
    );
  }, [
    page,
    rowsPerPage,
    serviceId,
    dateFrom,
    dateTo,
    status,
    query,
    sortBy,
    sortOrder,
  ]);

  React.useEffect(() => {
    fetcher();
  }, [fetcher]);

  React.useEffect(() => {
    webGetRequest(
      adminSubscriptionPackagesUrl,
      (response) => {
        const business = Array.isArray(response?.business_services)
          ? response.business_services
          : [];
        const subs = Array.isArray(response?.sub_services)
          ? response.sub_services
          : [];
        const active = (arr) =>
          arr.filter(
            (p) => `${p.status || "ACTIVE"}`.toUpperCase() === "ACTIVE"
          );
        const combined = [...active(business), ...active(subs)].map((p) => ({
          label: p.name,
          value: p.id,
        }));
        setPackageOptions(combined);
      },
      () => setPackageOptions([])
    );
  }, []);

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, pt: 2, pb: 8, bgcolor: "grey.50", minHeight: "100vh" }}
    >
      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 } }}>
        <Paper
          elevation={0}
          sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: "white" }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
          >
            <Stack spacing={1}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                All Manual Assignments
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Explore all admin-assigned subscriptions with powerful filters
                and pagination.
              </Typography>
            </Stack>
            <Tooltip title="Refresh list">
              <IconButton
                onClick={fetcher}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <SvgIcon>
                  <ArrowPathIcon />
                </SvgIcon>
              </IconButton>
            </Tooltip>
          </Stack>
        </Paper>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <TextField
                  fullWidth
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by user, phone, email, order, reference..."
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SvgIcon color="action">
                          <MagnifyingGlassIcon />
                        </SvgIcon>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <TextField
                  select
                  fullWidth
                  label="Package"
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                >
                  <MenuItem value="">All Packages</MenuItem>
                  {packageOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                  <MenuItem value="all">All (explicit)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={1}>
                  <TextField
                    type="date"
                    fullWidth
                    label="From"
                    InputLabelProps={{ shrink: true }}
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                  <TextField
                    type="date"
                    fullWidth
                    label="To"
                    InputLabelProps={{ shrink: true }}
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </Stack>
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  select
                  fullWidth
                  label="Sort By"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="created_at">Created</MenuItem>
                  <MenuItem value="amount">Amount</MenuItem>
                  <MenuItem value="user_id">User ID</MenuItem>
                  <MenuItem value="service_id">Service ID</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6} md={2}>
                <TextField
                  select
                  fullWidth
                  label="Order"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <MenuItem value="desc">Desc</MenuItem>
                  <MenuItem value="asc">Asc</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md="auto">
                <Button
                  variant="contained"
                  onClick={() => {
                    setPage(0);
                    fetcher();
                  }}
                >
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Package</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Reference</TableCell>
                    <TableCell>Channel</TableCell>
                    <TableCell>Assigned</TableCell>
                    <TableCell>Valid Until</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        sx={{
                          py: 6,
                          textAlign: "center",
                          color: "text.secondary",
                        }}
                      >
                        {isLoading ? "Loading..." : "No assignments found"}
                      </TableCell>
                    </TableRow>
                  )}
                  {rows.map((r) => (
                    <TableRow key={`${r.id}-${r.order_id}`} hover>
                      <TableCell>
                        <Stack>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {r?.user_details?.firstName || ""}{" "}
                            {r?.user_details?.secondName ||
                              r?.user_details?.userName ||
                              ""}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {r.user_id} •{" "}
                            {r?.user_details?.phoneNumber || "N/A"}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {r.package_name ||
                            r?.afyachap_data?.package_type ||
                            "-"}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ fontWeight: 500 }}
                        >
                          {formatMoney(
                            Number(r.amount || r?.afyachap_data?.amount || 0)
                          )}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          color={r.is_active ? "success" : "default"}
                          label={r.is_active ? "Active" : "Expired"}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="caption"
                          sx={{ fontFamily: "monospace" }}
                        >
                          {r.order_id || r?.afyachap_data?.order_id || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {r?.selcom_data?.reference || r.reference || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {r?.selcom_data?.data?.[0]?.channel ||
                            r.channel ||
                            "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {r.assigned_at || r?.afyachap_data?.date || "-"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {r?.current_subscription?.subscription_end_at || "-"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <TablePagination
                component="div"
                count={total}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  const v = parseInt(e.target.value, 10) || 20;
                  setRowsPerPage(v);
                  setPage(0);
                }}
                rowsPerPageOptions={[10, 20, 50, 100]}
              />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

export default AllAssignments;
