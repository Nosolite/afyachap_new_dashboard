import React from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Tabs,
  Tab,
  SvgIcon,
  Typography,
  styled,
} from "@mui/material";
import { useSelection } from "../../hooks/use-selection";
import { CustomTable } from "../../components/custom-table";
import {
  paymentsReportHeadCells,
  UsersRenewHeadCells,
} from "../../seed/table-headers";
import { webGetRequest } from "../../services/api-service";
import { revenueSummaryUrl } from "../../seed/url";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
import TicketFilter from "../../components/tickets/TicketFilter";
import dayjs from "dayjs";
import CustomSummaryTable from "./CustomSummaryTable";
import { usePopover } from "../../hooks/use-popover";
import { CustomPopOver } from "../../components/custom-popover";
import RenewedUsers from "../ExpireTomorrow/RenewedUsers";

const useContentsIds = (contents) => {
  return React.useMemo(
    () => contents.map((customer) => customer.id),
    [contents]
  );
};

const BoxStyled = styled(Box)(({ theme }) => ({
  padding: "20px",
  borderRadius: "8px",
  color: theme.palette.text.primary,
  transition: "0.3s ease",
  cursor: "pointer",
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {/* Remove extra Typography to avoid double wrapping */}
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function PaymentReports() {
  const popOver = usePopover();
  const [, setRowsPerPage] = React.useState(5);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //for custom table
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage1] = React.useState(5);

  const handlePageChange1 = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange1 = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [contents, setContents] = React.useState({
    daily_revenues: [],
    summary: {
      total_revenue: 0,
      total_users: 0,
      total_new_users: 0,
      total_renew_users: 0,
      total_users_joined_past_days_paid_today: 0,
      percentage_total_users_paid: 0,
      percentage_total_renew_users: 0,
      percentage_total_new_users: 0,
      percentage_total_users_joined_past_days_paid_today: 0,
    },
  });
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const contentsIds = useContentsIds(contents.daily_revenues);
  const contentsSelection = useSelection(contentsIds);
  const [body, setBody] = React.useState({
    from: dayjs().startOf("day"),
    to: dayjs().add(1, "day"),
  });

  const handleBodyChange = (newValue, key) => {
    setBody({ ...body, [key]: newValue });
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };

  const calculateSummary = (dailyRevenues) => {
    let totalUsers = 0;
    let totalPaid = 0;
    let totalUsersRenew = 0;
    let totalRenewPaid = 0;
    let totalNewUsersPaidToday = 0;
    let totalNewUsersRevenueToday = 0;
    let totalPastUsersPaidToday = 0;
    let totalPastUsersRevenueToday = 0;

    dailyRevenues.forEach((rev) => {
      totalUsers += rev.total_users;
      totalPaid += rev.total_paid;
      totalUsersRenew += rev.total_users_renew;
      totalRenewPaid += rev.renew_total_paid;
      totalNewUsersPaidToday += rev.total_users_joined_paid_today;
      totalNewUsersRevenueToday += rev.new_total_paid;
      totalPastUsersPaidToday += rev.total_users_joined_past_days_paid_today;
      totalPastUsersRevenueToday +=
        rev.total_revenue_for_past_users_joined_today;
    });

    return {
      totalUsers,
      totalPaid,
      totalUsersRenew,
      totalRenewPaid,
      totalNewUsersPaidToday,
      totalNewUsersRevenueToday,
      totalPastUsersPaidToday,
      totalPastUsersRevenueToday,
    };
  };

  // Function to group and sum data by service name
  const calculateOverallSummary = (dailyRevenues) => {
    const summaryByService = dailyRevenues.reduce((acc, rev) => {
      const { service_name, total_users, total_paid } = rev;

      if (!acc[service_name]) {
        acc[service_name] = {
          service_name,
          total_users: 0,
          total_paid: 0,
        };
      }

      // Accumulate the total users and total paid amounts
      acc[service_name].total_users += total_users;
      acc[service_name].total_paid += total_paid;

      return acc;
    }, {});

    // Format the numbers for display
    return Object.values(summaryByService).map((service) => ({
      service_name: service.service_name,
      total_users: formatNumber(service.total_users),
      total_paid: formatNumber(service.total_paid),
    }));
  };

  const fetcher = React.useCallback(() => {
    setIsLoading(true); // Set loading state before fetching
    webGetRequest(
      `${revenueSummaryUrl}start_date=${body.from.format(
        "YYYY-MM-DD"
      )}&end_date=${body.to.format("YYYY-MM-DD")}`,
      (data) => {
        setContents(data);
        setIsLoading(false); // Stop loading after data is fetched
      },
      (error) => {
        setContents({
          daily_revenues: [],
          summary: {
            total_revenue: 0,
            total_users: 0,
            total_new_users: 0,
            total_renew_users: 0,
            total_users_joined_past_days_paid_today: 0,
            percentage_total_users_paid: 0,
            percentage_total_renew_users: 0,
            percentage_total_new_users: 0,
            percentage_total_users_joined_past_days_paid_today: 0,
          },
        });
        setIsLoading(false); // Stop loading even on error
      }
    );
  }, [body.from, body.to]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  React.useEffect(() => {
    fetcher();
  }, [fetcher]);

  const handlePageChange = React.useCallback(
    (event, value) => {
      fetcher(value + 1);
    },
    [fetcher]
  );

  const handleRowsPerPageChange = React.useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  // Calculate amounts summary
  const calculatedSummary = calculateSummary(contents.daily_revenues);
  const overallSummary = calculateOverallSummary(contents.daily_revenues);

  // Now calculate totals for total_users and total_paid
  // Parse the formatted numbers back to numbers for calculation
  const totalUsers = overallSummary.reduce(
    (sum, item) => sum + parseInt(item.total_users.replace(/,/g, ""), 10),
    0
  );
  const totalPaid = overallSummary.reduce(
    (sum, item) => sum + parseFloat(item.total_paid.replace(/,/g, "")),
    0
  );

  // Function to determine row styles based on row index and total rows
  const rowStyle = (index) => ({
    ...(index === overallSummaryWithTotal.length - 1 && {
      fontWeight: "bold",
      fontSize: "18px", // Ensure large font size for the total row
    }),
  });

  const cellStyle = (index) => ({
    ...(index === overallSummaryWithTotal.length - 1 && {
      fontWeight: "bold",
      fontSize: "18px", // Ensure large font size for the total cells
    }),
  });

  // Add a static total row to the overallSummary data
  const overallSummaryWithTotal = [
    ...overallSummary,
    {
      service_name: "Total",
      total_users: formatNumber(totalUsers),
      total_paid: formatNumber(totalPaid),
    },
  ];

  return (
    <Box component="main" sx={{ flexGrow: 1, pt: 4, pb: 8 }}>
      {popOver.open && (
        <CustomPopOver
          id={popOver.id}
          anchorEl={popOver.anchorRef}
          open={popOver.open}
          onClose={popOver.handleClose}
          showDates={true}
          from={body.from}
          to={body.to}
          handleBodyChange={handleBodyChange}
        />
      )}
      <Container maxWidth={false}>
        <Stack spacing={4}>
          <Stack
            direction="row"
            justifyContent="space-between"
            flexWrap="wrap"
            spacing={4}
          >
            <Typography variant="h4" sx={{ fontWeight: "bold" }}>
              Payment Summary
            </Typography>
            <Button
              sx={{ color: "grey", display: "flex", alignItems: "center" }}
              variant="text"
              startIcon={
                <SvgIcon sx={{ mr: 1 }} fontSize="small">
                  <CalendarIcon />
                </SvgIcon>
              }
              endIcon={
                <SvgIcon fontSize="small">
                  <ChevronDownIcon />
                </SvgIcon>
              }
              onClick={popOver.handleOpen}
            >
              {`${body.from.format("MMMM D, YYYY")} - ${body.to.format(
                "MMMM D, YYYY"
              )}`}
            </Button>
          </Stack>

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <TicketFilter
              totalUsers={calculatedSummary.totalUsers}
              totalPaid={calculatedSummary.totalPaid}
              totalUsersRenew={calculatedSummary.totalUsersRenew}
              totalRenewPaid={calculatedSummary.totalRenewPaid}
              totalNewUsersPaidToday={calculatedSummary.totalNewUsersPaidToday}
              percentage_total_users_joined_past_days_paid_today={
                contents.summary
                  .percentage_total_users_joined_past_days_paid_today
              }
              percentage_total_new_users={
                contents.summary.percentage_total_new_users
              }
              totalNewUsersRevenueToday={
                calculatedSummary.totalNewUsersRevenueToday
              }
              percentage_total_users_paid={
                contents.summary.percentage_total_users_paid
              }
              percentage_total_renew_users={
                contents.summary.percentage_total_renew_users
              }
              totalPastUsersPaidToday={
                calculatedSummary.totalPastUsersPaidToday
              }
              totalPastUsersRevenueToday={
                calculatedSummary.totalPastUsersRevenueToday
              }
            />
          </Stack>

          <Box sx={{ width: "100%" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              sx={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                borderRadius: "4px",
                backgroundColor: "white",
              }}
            >
              <Tab
                sx={{
                  marginLeft: "10px",
                }}
                label="Payment Summary Details"
                {...a11yProps(0)}
              />
              <Tab
                sx={{
                  marginLeft: "10px",
                }}
                label="User Renew"
                {...a11yProps(1)}
              />
              <Tab
                sx={{
                  marginLeft: "10px",
                }}
                label="Past Users Paid Today"
                {...a11yProps(2)}
              />
              <Tab
                sx={{
                  marginLeft: "10px",
                }}
                label="New Users Paid Today"
                {...a11yProps(3)}
              />
            </Tabs>
            <TabPanel value={value} index={0}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", marginBottom: "16px" }}
                >
                  Payment Summary Details
                </Typography>
              </Stack>

              <CustomTable
                count={contents.daily_revenues.length}
                items={contents.daily_revenues.filter((item) =>
                  Object.values(item).some((value) =>
                    value
                      .toString()
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                )}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPage={5}
                headCells={paymentsReportHeadCells}
                page={0}
                isLoading={isLoading}
                popOver={popOver}
                searchTerm={searchTerm}
                onSearchTermChange={handleSearch}
                selection={contentsSelection}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <RenewedUsers></RenewedUsers>
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", marginBottom: "16px" }}
                >
                  Past Users Paid Today Details
                </Typography>
              </Stack>

              {/* Add your content for Past Users Paid Today here */}
              {/* For example, if you have data for past users: */}
              <CustomTable
                count={contents.daily_revenues.length}
                items={contents.daily_revenues.filter((item) =>
                  Object.values(item).some((value) =>
                    value
                      .toString()
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                )}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPage={5}
                headCells={paymentsReportHeadCells}
                page={0}
                isLoading={isLoading}
                popOver={popOver}
                searchTerm={searchTerm}
                onSearchTermChange={handleSearch}
                selection={contentsSelection}
              />
            </TabPanel>
            <TabPanel value={value} index={3}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", marginBottom: "16px" }}
                >
                  New Users Paid Today Details
                </Typography>
              </Stack>

              {/* Add your content for New Users Paid Today here */}
              {/* For example, if you have data for new users: */}
              <CustomTable
                count={contents.daily_revenues.length}
                items={contents.daily_revenues.filter((item) =>
                  Object.values(item).some((value) =>
                    value
                      .toString()
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  )
                )}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                rowsPerPage={5}
                headCells={paymentsReportHeadCells}
                page={0}
                isLoading={isLoading}
                popOver={popOver}
                searchTerm={searchTerm}
                onSearchTermChange={handleSearch}
                selection={contentsSelection}
              />
            </TabPanel>
          </Box>

          <BoxStyled>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Overall Summary by Service
            </Typography>
            <CustomSummaryTable
              data={overallSummaryWithTotal}
              headCells={[
                { id: "service_name", label: "Service Name" },
                { id: "total_users", label: "Total Users" },
                { id: "total_paid", label: "Total Amount Paid" },
              ]}
              rowsPerPage={rowsPerPage}
              page={page}
              count={overallSummaryWithTotal.length}
              onPageChange={handlePageChange1}
              onRowsPerPageChange={handleRowsPerPageChange1}
              isLoading={isLoading}
            />
          </BoxStyled>
        </Stack>
      </Container>
    </Box>
  );
}

export default PaymentReports;
