import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useTheme } from "@mui/material/styles";
import DashboardWidgetCard from "../../src/components/shared/DashboardWidgetCard";
import axios from "axios";

const EmployeeSalary = () => {
  const theme = useTheme();
  const warning = theme.palette.warning.main;
  const error = theme.palette.error.main;
  const primary = theme.palette.primary.main;

  const [chartData, setChartData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [maxRevenue, setMaxRevenue] = useState(null);
  const [minRevenue, setMinRevenue] = useState(null);
  const formatToCurrency = (amount, currency = "TZS") => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency,
    }).format(amount);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://afyachap.com/api/v1/monthly-revenue?year=${year}`
        );
        const revenueData = response.data.monthly_revenue;

        const months = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const currentYearData = revenueData.filter(
          (item) => item.year === year
        );

        const revenues = currentYearData.map((item) => item.total);
        const max = Math.max(...revenues);
        const min = Math.min(...revenues);

        const colors = currentYearData.map((item) => {
          if (item.total === max) return warning;
          if (item.total === min) return error;
          return primary;
        });

        setChartData(
          currentYearData.map((item) => ({
            x: months[item.month - 1],
            y: item.total,
          }))
        );
        setMaxRevenue(max);
        setMinRevenue(min);

        setOptions((prevOptions) => ({
          ...prevOptions,
          colors: colors,
        }));
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, [year]);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const [options, setOptions] = useState({
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 280,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: "45%",
        distributed: true,
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: [],
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
    },
  });

  const series = [
    {
      name: "Revenue",
      data: chartData,
    },
  ];

  return (
    <DashboardWidgetCard
      title="Revenue Monthly"
      subtitle="Every month"
      dataLabel1="Maximum"
      dataItem1={`${formatToCurrency(maxRevenue)}`}
      dataLabel2="Minimum"
      dataItem2={`${formatToCurrency(minRevenue)}`}
    >
      <Chart options={options} series={series} type="bar" height="280px" />
    </DashboardWidgetCard>
  );
};

export default EmployeeSalary;
