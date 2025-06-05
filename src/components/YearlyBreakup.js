import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import { Grid, Stack, Typography, Avatar } from "@mui/material";
import { IconArrowUpLeft, IconArrowDownLeft } from "@tabler/icons-react";

import DashboardCard from "../../src/components/shared/DashboardCard";

const YearlyBreakup = () => {
  const [revenueData, setRevenueData] = useState(null);
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const successlight = theme.palette.success.light;

  useEffect(() => {
    fetch("https://afyachap.com/api/v1/get/total/revenue/compare_to_last_year")
      .then((response) => response.json())
      .then((data) => setRevenueData(data))
      .catch((error) => console.error("Error fetching revenue data:", error));
  }, []);

  const formatToCurrency = (amount, currency = "TZS") => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency,
    }).format(amount);
  };

  const calculatePercentageChange = (current, last) => {
    if (last === 0) return 0;
    return ((current - last) / last) * 100;
  };

  const options = {
    chart: {
      type: "donut",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: [primary, primarylight],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: "75%",
          background: "transparent",
        },
      },
    },
    tooltip: {
      enabled: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };

  const percentageChange =
    revenueData &&
    typeof revenueData.current_year === "number" &&
    typeof revenueData.last_year === "number"
      ? calculatePercentageChange(
          revenueData.current_year,
          revenueData.last_year
        )
      : null;

  const isIncrease = percentageChange !== null && percentageChange >= 0;
  const avatarBgColor = isIncrease ? successlight : "#ba1a1a";

  return (
    <DashboardCard title="Yearly Revenue">
      <Grid container spacing={1}>
        <Grid item xs={8} sm={8}>
          <Typography variant="h4" fontWeight="700">
            {revenueData && !isNaN(revenueData.current_year)
              ? `TZS ${formatToCurrency(parseInt(revenueData.current_year))}`
              : "Loading..."}
          </Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Avatar sx={{ bgcolor: avatarBgColor, width: 27, height: 27 }}>
              {isIncrease ? (
                <IconArrowUpLeft width={20} />
              ) : (
                <IconArrowDownLeft width={20} />
              )}
            </Avatar>

            <Typography variant="subtitle2" fontWeight="600">
              {percentageChange !== null
                ? `${percentageChange.toFixed(2)}%`
                : "Loading..."}
            </Typography>

            <Typography variant="subtitle2" color="textSecondary">
              compared to last year
            </Typography>
          </Stack>
          <Stack spacing={10} mt={2} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 6,
                  height: 6,
                  bgcolor: primarylight,
                  svg: { display: "none" },
                }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                2023
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar
                sx={{
                  width: 9,
                  height: 9,
                  bgcolor: primary,
                  svg: { display: "none" },
                }}
              ></Avatar>
              <Typography variant="subtitle2" color="textSecondary">
                2024
              </Typography>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={4} sm={4}>
          <Chart
            options={options}
            series={
              revenueData
                ? [revenueData.current_year, revenueData.last_year]
                : []
            }
            type="donut"
            height="130px"
          />
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default YearlyBreakup;
