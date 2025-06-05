import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import { MenuItem, Grid, Box, CircularProgress } from "@mui/material";
import DashboardCard from "../../src/components/shared/DashboardCard";
import CustomSelect from "../../src/components/forms/theme-elements/CustomSelect";
import axios from "axios"; // Import axios for making HTTP requests

const RevenueUpdates = () => {
  const [month, setMonth] = useState(""); // Initial state for month
  const [selectedDate, setSelectedDate] = useState(""); // Initial state for selected date
  const [revenueData, setRevenueData] = useState([]); // State to hold revenue data for the selected month
  const [seriesColumnChart, setSeriesColumnChart] = useState([]); // State for chart series data
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Set the default value to the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Add 1 because getMonth() returns zero-based index
    const currentYear = currentDate.getFullYear();
    const defaultMonth = `${currentMonth} ${currentYear}`;
    setMonth(defaultMonth); // Set the initial value of month
    setSelectedDate(defaultMonth); // Set the initial value of selectedDate

    // Fetch revenue data for the default month
    fetchData(currentMonth, currentYear);
  }, []);
  const formatToCurrency = (amount, currency = "TZS") => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency,
    }).format(amount);
  };

  useEffect(() => {
    // Update chart data when revenueData changes
    const chartData = {
      name: "Revenue this month",
      data: revenueData.map((data) => data.total),
    };
    setSeriesColumnChart([chartData]);
  }, [revenueData]);

  // Handle change event for CustomSelect
  const handleChange = async (event) => {
    const selectedMonth = event.target.value;
    setMonth(selectedMonth);
    setSelectedDate(selectedMonth);

    // Parse selected month to get month number and year
    const [monthNumber, year] = selectedMonth.split(" ");

    // Fetch revenue data for the selected month
    fetchData(parseInt(monthNumber), parseInt(year));
  };

  // Fetch revenue data for the given month and year
  const fetchData = (monthNumber, year) => {
    setIsLoading(true);
    axios
      .get(
        `https://afyachap.com/api/v1/daily-revenue-for-month?month=${monthNumber}&year=${year}`
      )
      .then((response) => {
        setRevenueData(response.data.daily_revenue);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching revenue data:", error);
        setIsLoading(false);
      });
  };

  // Generate menu items dynamically for the current year and up to the current month
  const generateMenuItems = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // Add 1 because getMonth() returns zero-based index
    const menuItems = [];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    for (let i = 1; i <= currentMonth; i++) {
      menuItems.push(
        <MenuItem
          key={`${months[i - 1]} ${currentYear}`}
          value={`${i} ${currentYear}`}
        >
          {`${months[i - 1]} ${currentYear}`}
        </MenuItem>
      );
    }
    return menuItems;
  };

  // Options for the chart
  const formatDate = (date) => {
    let formattedDate = date;

    if (typeof date === "string") {
      // Check if date is already in the format of 'yyyy-mm-dd'
      if (date.includes("-")) {
        const [year, month, day] = date.split("-");
        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const formatted = new Date(year, month - 1, day); // Month - 1 because month is zero-indexed
        const dayName = dayNames[formatted.getDay()];
        formattedDate = `${dayName} ${day}`;
      } else {
        // Handle other date formats if needed
      }
    }

    return formattedDate;
  };

  // chart
  // Update the options for the chart to format the x-axis dates
  const optionscolumnchart = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: true,
      },
      height: 370,
      stacked: true,
    },
    colors: [primary],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "category", // Set x-axis type to category
      categories: revenueData.map((data) => formatDate(data.day)), // Use days of the month as categories
      labels: {
        rotate: -45, // Rotate labels for better readability if necessary
        style: {
          fontSize: "12px", // Adjust font size if needed
          fontFamily: "'Plus Jakarta Sans', sans-serif;", // Set font family
        },
      },
    },
    legend: {
      show: false,
    },
  };

  return (
    <DashboardCard
      title="Revenue Updates"
      subtitle="Overview Revenue per month"
      action={
        <CustomSelect
          labelId="month-dd"
          id="month-dd"
          value={month}
          size="small"
          onChange={handleChange}
        >
          {generateMenuItems()}
        </CustomSelect>
      }
    >
      <Grid container spacing={3}>
        {/* column */}
        <Grid item xs={12} sm={12}>
          {isLoading ? (
            <Box
              height={370}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress
                size={26}
                sx={{
                  color: "primary.main",
                }}
              />{" "}
              {/* Replace Spinner with your actual spinner component */}
            </Box>
          ) : (
            <Chart
              options={optionscolumnchart}
              series={seriesColumnChart}
              type="bar"
              height={370}
            />
          )}
        </Grid>
        {/* column */}
        <Grid item xs={12} sm={4}>
          {/* Additional components remain the same */}
        </Grid>
      </Grid>
    </DashboardCard>
  );
};

export default RevenueUpdates;
