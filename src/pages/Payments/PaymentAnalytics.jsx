import React from "react";
import { Box, Grid } from "@mui/material";
import RevenueUpdates from "../../components/RevenueUpdates";
import YearlyBreakup from "../../components/YearlyBreakup";
import MonthlyEarnings from "../../components/MonthlyEarnings";
import EmployeeSalary from "../../components/EmployeeSalary";
import SellingProducts from "../../components/SellingProducts";
import WeeklyStats from "../../components/WeeklyStats";
import TopPerformers from "../../components/TopPerformers";
import ReportCard from "../../components/ReportCard";

const PaymentAnalytics = () => {
    return (
        <Box sx={{ marginLeft: 4, marginRight: 4 }} component="main">
            <Grid container spacing={3}>
                {/* column */}
                <Grid item sm={12} lg={12}>
                    <ReportCard />
                </Grid>
                {/* column */}
                <Grid item xs={12} lg={8}>
                    <RevenueUpdates />
                </Grid>
                {/* column */}
                <Grid item xs={12} lg={4}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6} lg={12}>
                            <YearlyBreakup />
                        </Grid>
                        <Grid item xs={12} sm={6} lg={12}>
                            <MonthlyEarnings />
                        </Grid>
                    </Grid>
                </Grid>
                {/* column */}
                <Grid item xs={12} lg={8}>
                    <EmployeeSalary />
                </Grid>
                {/* column */}

                {/* column */}
                <Grid item xs={12} lg={4}>
                    <SellingProducts />
                </Grid>
                {/* column */}
                <Grid item xs={12} lg={8}>
                    <TopPerformers />
                </Grid>
                <Grid item xs={12} lg={4}>
                    <WeeklyStats />
                </Grid>
                {/* column */}
            </Grid>
            {/* column */}
            {/* <Welcome /> */}
        </Box>
    );
};

export default PaymentAnalytics;
