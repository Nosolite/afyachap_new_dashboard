import {
  Box,
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

export const CustomSummaryPaymentTable = (props) => {
  const {
    dailyRevenues = [],
    finalSummary = {},
    page = 0,
    rowsPerPage = 5,
    count = 0,
    isLoading = false,
    onPageChange = () => {},
    onRowsPerPageChange = () => {},
  } = props;

  // Define dynamic headers based on data keys
  const headers = [
    { id: "date", label: "Date" },
    { id: "service_name", label: "Service Name" },
    { id: "total_users", label: "Total Users Paid" },
    { id: "total_paid", label: "Total Paid Amount" },
    { id: "new_total_paid", label: "New Users Total Paid" },
    { id: "renew_total_paid", label: "Renew Users Total Paid" },
    { id: "total_users_renew", label: "Total Users Renewed" },
    { id: "total_users_joined", label: "Total Users Joined" },
  ];

  return (
    <>
      <Card elevation={1} sx={{ mb: 2, p: 2 }}>
        <Typography variant="h6">Final Summary</Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Typography>Total Paid: {finalSummary.total_paid}</Typography>
          <Typography>New Total Paid: {finalSummary.new_total_paid}</Typography>
          <Typography>
            Renew Total Paid: {finalSummary.renew_total_paid}
          </Typography>
          <Typography>
            Total Users Renewed: {finalSummary.total_users_renew}
          </Typography>
          <Typography>
            Total Users Joined: {finalSummary.total_users_joined}
          </Typography>
        </Box>
      </Card>

      <Card elevation={1}>
        <Box sx={{ minWidth: 800 }}>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header.id}>{header.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dailyRevenues.map((row, index) => (
                <TableRow hover key={index}>
                  {headers.map((column) => (
                    <TableCell key={column.id}>{row[column.id]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        {dailyRevenues.length === 0 && isLoading && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <CircularProgress sx={{ mx: "auto", my: 3 }} />
          </Box>
        )}
        {dailyRevenues.length === 0 && !isLoading && (
          <Typography sx={{ my: 3 }} align="center" variant="subtitle1">
            No items
          </Typography>
        )}
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      </Card>
    </>
  );
};

CustomSummaryPaymentTable.propTypes = {
  dailyRevenues: PropTypes.array.isRequired,
  finalSummary: PropTypes.object.isRequired,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  count: PropTypes.number,
  isLoading: PropTypes.bool,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
};
