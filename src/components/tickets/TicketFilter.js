import { Box, Grid, Typography, styled } from "@mui/material";

const BoxStyled = styled(Box)(({ theme }) => ({
  position: "relative", // Add relative positioning
  padding: theme.spacing(4),
  transition: "0.3s ease-in-out",
  cursor: "pointer",
  color: "inherit",
  textAlign: "center",
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  "&:hover": {
    transform: "scale(1.05)",
    boxShadow: theme.shadows[4],
  },
}));

const Badge = styled(Typography)(({ theme, bgcolor, textcolor }) => ({
  position: "absolute", // Absolute positioning
  right: theme.spacing(1), // Align to the right
  bottom: theme.spacing(1), // Align to the bottom
  padding: theme.spacing(0.5, 1),
  backgroundColor: bgcolor || theme.palette.success.main, // Dynamic background color
  color: textcolor || theme.palette.success.contrastText, // Dynamic text color
  borderRadius: theme.shape.borderRadius,
  fontSize: "0.65rem",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Adding a shadow
}));

const formatToCurrency = (amount, currency = "TZS") => {
  return new Intl.NumberFormat("en-TZ", {
    style: "currency",
    currency,
  }).format(amount);
};

const TicketFilter = ({
  totalUsers,
  totalPaid,
  totalUsersRenew,
  totalRenewPaid,
  totalNewUsersPaidToday,
  totalNewUsersRevenueToday,
  totalPastUsersPaidToday,
  totalPastUsersRevenueToday,
  totalUsersPercentage,
  percentage_total_users_paid,
  percentage_total_renew_users,
  totalUsersRenewPercentage,
  totalRenewPaidPercentage,
  percentage_total_new_users,
  percentage_total_users_joined_past_days_paid_today,
  totalNewUsersPaidTodayPercentage,
  totalNewUsersRevenueTodayPercentage,
  totalPastUsersPaidTodayPercentage,
  totalPastUsersRevenueTodayPercentage,
}) => {
  return (
    <Grid container spacing={4} justifyContent="center">
      <Grid item xs={12} sm={6} lg={3}>
        <BoxStyled
          sx={{ backgroundColor: "primary.lightest", color: "primary.main" }}
        >
          <Typography variant="h4">{totalUsers}</Typography>
          <Typography variant="subtitle1">Total Users Paid</Typography>
          <Badge bgcolor="primary.lightest" textcolor="info.main">
            {percentage_total_users_paid}%
          </Badge>{" "}
          {/* Display badge for total users percentage */}
        </BoxStyled>
      </Grid>

      <Grid item xs={12} sm={6} lg={3}>
        <BoxStyled
          sx={{ backgroundColor: "info.lightest", color: "info.main" }}
        >
          <Typography variant="h4">{formatToCurrency(totalPaid)}</Typography>
          <Typography variant="subtitle1">Total Amount Paid</Typography>
        </BoxStyled>
      </Grid>

      <Grid item xs={12} sm={6} lg={3}>
        <BoxStyled
          sx={{ backgroundColor: "warning.light", color: "warning.main" }}
        >
          <Typography variant="h4">{totalUsersRenew}</Typography>
          <Typography variant="subtitle1">Total Users Renew</Typography>
          <Badge bgcolor="warning.light" textcolor="warning.main">
            {percentage_total_renew_users}%
          </Badge>{" "}
          {/* Display badge for total users renew percentage */}
        </BoxStyled>
      </Grid>

      <Grid item xs={12} sm={6} lg={3}>
        <BoxStyled
          sx={{ backgroundColor: "success.lightest", color: "success.main" }}
        >
          <Typography variant="h4">
            {formatToCurrency(totalRenewPaid)}
          </Typography>
          <Typography variant="subtitle1">Total Renew Amount Paid</Typography>
          {/* Display badge for total renew paid percentage */}
        </BoxStyled>
      </Grid>

      <Grid item xs={12} sm={6} lg={3}>
        <BoxStyled
          sx={{ backgroundColor: "info.lightest", color: "info.main" }}
        >
          <Typography variant="h4">{totalNewUsersPaidToday}</Typography>
          <Typography variant="subtitle1">
            Total New Users Paid Today
          </Typography>
          <Badge bgcolor="info.lightest" textcolor="info.main">
            {percentage_total_new_users}%
          </Badge>{" "}
          {/* Display badge for new users paid today percentage */}
        </BoxStyled>
      </Grid>

      <Grid item xs={12} sm={6} lg={3}>
        <BoxStyled
          sx={{ backgroundColor: "warning.lightest", color: "warning.main" }}
        >
          <Typography variant="h4">
            {formatToCurrency(totalNewUsersRevenueToday)}
          </Typography>
          <Typography variant="subtitle1">Today's New User Revenue</Typography>
          {/* Display badge for today's new user revenue percentage */}
        </BoxStyled>
      </Grid>

      <Grid item xs={12} sm={6} lg={3}>
        <BoxStyled
          sx={{ backgroundColor: "success.lightest", color: "success.main" }}
        >
          <Typography variant="h4">{totalPastUsersPaidToday}</Typography>
          <Typography variant="subtitle1">
            Total Past Users Paid Today
          </Typography>
          <Badge bgcolor="success.lightest" textcolor="success.main">
            {percentage_total_users_joined_past_days_paid_today}%
          </Badge>{" "}
          {/* Display badge for past users paid today percentage */}
        </BoxStyled>
      </Grid>

      <Grid item xs={12} sm={6} lg={3}>
        <BoxStyled
          sx={{ backgroundColor: "purple.light", color: "purple.800" }}
        >
          <Typography variant="h4">
            {formatToCurrency(totalPastUsersRevenueToday)}
          </Typography>
          <Typography variant="subtitle1">Past User Revenue Today</Typography>
          {/* Display badge for past user revenue today percentage */}
        </BoxStyled>
      </Grid>
    </Grid>
  );
};

export default TicketFilter;
