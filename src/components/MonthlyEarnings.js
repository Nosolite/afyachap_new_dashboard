import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import { Stack, Typography, Avatar, Fab } from "@mui/material";
import { IconArrowDownRight, IconArrowUpRight } from "@tabler/icons-react";

import DashboardCard from "../../src/components/shared/DashboardCard";

const MonthlyEarnings = () => {
  // State for revenue data
  const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);
  const [lastMonthRevenue, setLastMonthRevenue] = useState(0);

  // Calculate percentage change
  const percentageChange =
    ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

  // Determine arrow icon based on percentage change
  const arrowIcon =
    percentageChange > 0 ? <IconArrowUpRight /> : <IconArrowDownRight />;

  // Chart color
  const theme = useTheme();
  const secondarylight = theme.palette.secondary.light;
  const primarylight = theme.palette.primary.light;

  const formatToCurrency = (amount, currency = "TZS") => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency,
    }).format(amount);
  };

  // Chart options
  const optionscolumnchart = {
    chart: {
      type: "area",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 60,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      colors: [secondarylight, primarylight],
      type: "solid",
      opacity: 0.05,
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      x: {
        show: false,
      },
      y: {
        formatter: function (value) {
          return formatToCurrency(value);
        },
        title: {
          formatter: function (seriesName, { dataPointIndex }) {
            return dataPointIndex === 0 ? "Last Month: " : "Current Month: ";
          },
        },
      },
    },
    colors: [theme.palette.secondary.main, theme.palette.primary.main],
    labels: ["Last Month", "Current Month"],
  };

  useEffect(() => {
    // Fetch revenue data from API
    const fetchRevenueData = async () => {
      try {
        const response = await fetch(
          "https://afyachap.com/api/v1/monthly-revenue-comparison"
        );
        const data = await response.json();
        setCurrentMonthRevenue(data.current_month);
        setLastMonthRevenue(data.last_month);
      } catch (error) {
        console.error("Error fetching revenue data:", error);
      }
    };

    fetchRevenueData();
  }, []);

  return (
    <DashboardCard
      title="Monthly Earnings"
      action={
        <Fab color="secondary" size="medium">
          <Typography variant="bold" sx={{ fontWeight: 900 }}>
            TZS
          </Typography>
        </Fab>
      }
      footer={
        <Chart
          options={optionscolumnchart}
          series={[{ data: [lastMonthRevenue, currentMonthRevenue] }]}
          type="area"
          height="60px"
        />
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          {formatToCurrency(currentMonthRevenue)}
        </Typography>
        <Stack direction="row" spacing={1} my={1} alignItems="center">
          <Avatar sx={{ width: 27, height: 27 }}>{arrowIcon}</Avatar>
          <Typography variant="subtitle2" fontWeight="600">
            {Math.abs(percentageChange).toFixed(2)}%
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            compared to last month
          </Typography>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
