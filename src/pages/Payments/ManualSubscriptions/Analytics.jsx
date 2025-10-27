import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  SvgIcon,
  Typography,
  Paper,
  Chip,
} from "@mui/material";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import ChartBarIcon from "@heroicons/react/24/outline/ChartBarIcon";
import { CustomChart } from "../../../components/custom-chart";
import { formatMoney } from "../../../utils/constant";
import { webGetRequest } from "../../../services/api-service";
import {
  adminSubscriptionRevenueUrl,
  adminSubscriptionAdminAssignedUrl,
} from "../../../seed/url";

export default function Analytics() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [summary, setSummary] = React.useState({
    total_revenue: 0,
    total_subscriptions: 0,
    unique_users: 0,
    average_subscription_value: 0,
  });
  const [monthly, setMonthly] = React.useState([]);
  const [byPackage, setByPackage] = React.useState([]);
  const [recentAssignments, setRecentAssignments] = React.useState([]);
  const [selectedRange, setSelectedRange] = React.useState("Last 6 months");

  const loadData = React.useCallback(() => {
    setIsLoading(true);
    // Revenue and monthly breakdown
    webGetRequest(
      `${adminSubscriptionRevenueUrl}`,
      (response) => {
        if (response?.success) {
          setSummary(response?.data?.summary || {});
          setMonthly(response?.data?.monthly_breakdown || []);
          setByPackage(response?.data?.revenue_by_package || []);
        }
        setIsLoading(false);
      },
      () => setIsLoading(false)
    );

    // Recent admin assignments
    webGetRequest(
      `${adminSubscriptionAdminAssignedUrl}?limit=10&page=1`,
      (response) => {
        if (response?.success) {
          setRecentAssignments(response?.data || []);
        }
      },
      () => {}
    );
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const monthlyLabels = monthly.map((m) => m.month);
  const monthlyValues = monthly.map((m) => m.total_amount);

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
                Manual Subs • Analytics
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 700 }}
              >
                Monitor revenue, adoption and trends for admin-assigned
                subscriptions.
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button
                onClick={loadData}
                sx={{
                  bgcolor: "primary.main",
                  color: "white",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
                startIcon={
                  <SvgIcon>
                    <ArrowPathIcon />
                  </SvgIcon>
                }
              >
                Refresh
              </Button>
            </Stack>
          </Stack>
        </Paper>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="flex-start">
                  <SvgIcon color="primary">
                    <CurrencyDollarIcon />
                  </SvgIcon>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatMoney(summary?.total_revenue || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total revenue
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="flex-start">
                  <SvgIcon color="success">
                    <ChartBarIcon />
                  </SvgIcon>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {summary?.total_subscriptions || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total subscriptions
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="flex-start">
                  <SvgIcon color="info">
                    <UsersIcon />
                  </SvgIcon>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {summary?.unique_users || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unique users
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Stack spacing={1} alignItems="flex-start">
                  <SvgIcon color="warning">
                    <CurrencyDollarIcon />
                  </SvgIcon>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {formatMoney(summary?.average_subscription_value || 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Average value
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <CustomChart
              chartTitle="Revenue over time"
              chartSubTitle={selectedRange}
              labels={monthlyLabels}
              values={monthlyValues}
              isLoading={isLoading}
              selectedFilterValue={selectedRange}
              popoverItems={[
                {
                  id: "3m",
                  label: "Last 3 months",
                  onClick: () => setSelectedRange("Last 3 months"),
                },
                {
                  id: "6m",
                  label: "Last 6 months",
                  onClick: () => setSelectedRange("Last 6 months"),
                },
                {
                  id: "12m",
                  label: "Last 12 months",
                  onClick: () => setSelectedRange("Last 12 months"),
                },
              ]}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Top packages
                </Typography>
                <Stack spacing={1}>
                  {byPackage?.slice(0, 8).map((p, i) => (
                    <Stack
                      key={i}
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {p.package_name}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip
                          label={p.subscription_count}
                          color="success"
                          size="small"
                        />
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ fontWeight: 600 }}
                        >
                          {formatMoney(p.total_amount)}
                        </Typography>
                      </Stack>
                    </Stack>
                  ))}
                  {!byPackage?.length && (
                    <Typography variant="body2" color="text.secondary">
                      No package data yet.
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Recent admin assignments
                </Typography>
                <Stack spacing={1}>
                  {recentAssignments?.slice(0, 10).map((r, idx) => (
                    <Stack
                      key={idx}
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ py: 1 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ minWidth: 72, fontFamily: "monospace" }}
                      >
                        #{r.order_id}
                      </Typography>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {r.user_details?.firstName || r.user_details?.userName}
                      </Typography>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        {r.package_name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      >
                        {formatMoney(r.amount)}
                      </Typography>
                      <Chip
                        label={r.is_active ? "Active" : "Expired"}
                        color={r.is_active ? "success" : "default"}
                        size="small"
                      />
                    </Stack>
                  ))}
                  {!recentAssignments?.length && (
                    <Typography variant="body2" color="text.secondary">
                      No recent assignments.
                    </Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
