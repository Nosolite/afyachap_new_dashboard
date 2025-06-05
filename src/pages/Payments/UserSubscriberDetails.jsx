import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  CardContent,
  MenuItem,
  TextField,
  IconButton,
  Tooltip,
  Modal,
  Card,
  Grid,
  Pagination,
} from "@mui/material";
import { styled } from "@mui/system";
import { FaEdit, FaCreditCard, FaPaypal, FaBitcoin } from "react-icons/fa";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  padding: theme.spacing(2),
}));

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  minWidth: 300,
}));

const UserSubscriberDetails = ({ userId }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [filterBy, setFilterBy] = useState("all");
  const [page, setPage] = useState(1);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [basicAccountInfo, setAccountInfo] = useState({});
  const [transactionData, setTransactionData] = useState([]); // Initialize as an empty array
  const accountInfo =
    userDetails.basic_info_payment && userDetails.basic_info_payment.length > 0
      ? userDetails.basic_info_payment[0]
      : null;

  const [subscriptionData, setSubscriptionData] = useState([]);

  useEffect(() => {
    // Fetch User Account Details
    // Fetch User Account Details
    const fetchUserAccountDetails = async () => {
      try {
        const response = await fetch(
          `https://afyachap.com/api/v1/get/user_account_details?user_id=${userId}`
        );
        const data = await response.json();
        setUserDetails(data.user_details);
        setAccountInfo(data.basic_info_payment);
        console.log(data, "test data of user");
        console.log("Basic Account Info:", basicAccountInfo); // Ensure correct logging
      } catch (error) {
        console.error("Error fetching user account details:", error);
      }
    };

    fetchUserAccountDetails();

    // Fetch User Transactions
    const fetchUserTransactions = async () => {
      try {
        const response = await fetch(
          `https://afyachap.com/api/v1/get/getSpecificUserAllTransactions?user_id=${userId}`
        );
        const data = await response.json();
        setTransactionData(data.data);
      } catch (error) {
        console.error("Error fetching user transactions:", error);
      }
    };

    // Fetch User Completed Subscription Transactions
    const fetchUserSubscriptions = async () => {
      try {
        const response = await fetch(
          `https://afyachap.com/api/v1/get/getUserCompletedSubscriptionTransactions?user_id=${userId}`
        );
        const data = await response.json();
        setSubscriptionData(data.subscription_details);
      } catch (error) {
        console.error("Error fetching user subscriptions:", error);
      }
    };

    fetchUserSubscriptions();
    fetchUserTransactions();
  }, [userId]);

  const handleSort = (criteria) => {
    setSortBy(criteria);
  };

  const handleFilter = (event) => {
    setFilterBy(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleRowExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleEditModalOpen = () => {
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case "Credit Card":
        return <FaCreditCard />;
      case "PayPal":
        return <FaPaypal />;
      case "Bitcoin":
        return <FaBitcoin />;
      default:
        return null;
    }
  };
  const activityData = [
    { month: "Jan", activity: 65 },
    { month: "Feb", activity: 59 },
    { month: "Mar", activity: 80 },
    { month: "Apr", activity: 81 },
    { month: "May", activity: 56 },
    { month: "Jun", activity: 55 },
  ];

  const sortedAndFilteredTransactions = (transactionData || [])
    .filter((transaction) =>
      filterBy === "all" ? true : transaction.paymentMethod === filterBy
    )
    .sort((a, b) => {
      if (sortBy === "date")
        return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "amount") return b.amount - a.amount;
      return 0;
    });

  return (
    <Box>
      <StyledCard>
        {userDetails && (
          <CardContent>
            <Box display="flex" alignItems="center">
              {userDetails.profileImage && (
                <Box
                  component="img"
                  src={userDetails.profileImage}
                  alt="Profile"
                  sx={{ width: "50%", borderRadius: 4 }}
                  mr={2}
                />
              )}

              {/* User Details Table */}
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <strong>Name</strong>
                      </TableCell>
                      <TableCell>
                        {userDetails.firstName} {userDetails.secondName}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Gender</strong>
                      </TableCell>
                      <TableCell>{userDetails.gender}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Date of Birth</strong>
                      </TableCell>
                      <TableCell>{userDetails.dateOfBirth}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Email</strong>
                      </TableCell>
                      <TableCell>{userDetails.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Phone Number</strong>
                      </TableCell>
                      <TableCell>{userDetails.phoneNumber}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Age</strong>
                      </TableCell>
                      <TableCell>{userDetails.age}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                      <TableCell>{userDetails.status}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <strong>Account Created</strong>
                      </TableCell>
                      <TableCell>{userDetails.createdAt}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* Basic Account Information */}
            {basicAccountInfo && basicAccountInfo.length > 0 ? (
              <>
                <Typography variant="h6" gutterBottom mt={2}>
                  Account Information
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <strong>Account Type</strong>
                        </TableCell>
                        <TableCell>
                          {basicAccountInfo[0].user_account_type}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>Active Session</strong>
                        </TableCell>
                        <TableCell>
                          {basicAccountInfo[0].active_session}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <strong>Valid To</strong>
                        </TableCell>
                        <TableCell>{basicAccountInfo[0].valid_to}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" mt={2}>
                No account information available.
              </Typography>
            )}
          </CardContent>
        )}
      </StyledCard>
      <StyledCard>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            User Activity
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={activityData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="activity" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </StyledCard>
      <StyledCard>
        <Typography variant="h4" gutterBottom>
          Transaction History
        </Typography>
        <Box mb={2}>
          <TextField
            select
            label="Sort by"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
            sx={{ mr: 2, minWidth: 120 }}
          >
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="amount">Amount</MenuItem>
          </TextField>
          <TextField
            select
            label="Filter by"
            value={filterBy}
            onChange={handleFilter}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="COMPLETED">COMPLETED</MenuItem>
            <MenuItem value="PENDING">PENDING</MenuItem>
            <MenuItem value="CANCELLED">CANCELED</MenuItem>
            {/* Add more payment filters here */}
          </TextField>
        </Box>
        <TableContainer component={Paper}>
          <Table aria-label="Transaction history table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedAndFilteredTransactions.map((transaction) => (
                <React.Fragment key={transaction.id}>
                  <TableRow>
                    <TableCell>{transaction.created_at}</TableCell>
                    <TableCell>{transaction.order_id}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.payment_status}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleRowExpand(transaction.id)}
                        aria-label={`Expand details for transaction ${transaction.order_id}`}
                      >
                        {expandedRow === transaction.id ? (
                          <MdExpandLess />
                        ) : (
                          <MdExpandMore />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {expandedRow === transaction.id && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Box p={2}>
                          <Typography variant="body2">
                            <strong>Transaction No:</strong>{" "}
                            {transaction.transact_no}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box mt={2} display="flex" justifyContent="center">
          <Pagination
            count={10}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </StyledCard>

      <StyledCard>
        <Typography variant="h4" gutterBottom>
          Subscription Pament Details
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Service</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Validity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptionData.map((subscription, index) => (
                <TableRow key={index}>
                  <TableCell>{subscription.service_name}</TableCell>
                  <TableCell>{subscription.package_type}</TableCell>
                  <TableCell>
                    {subscription.amount} {subscription.currency}
                  </TableCell>
                  <TableCell>
                    {subscription.from} to {subscription.to}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </StyledCard>

      {/* Edit Modal */}
      <StyledModal open={editModalOpen} onClose={handleEditModalClose}>
        <ModalContent>
          <Typography variant="h6" gutterBottom>
            Edit Subscriber Details
          </Typography>
          {/* Edit form content */}
        </ModalContent>
      </StyledModal>
    </Box>
  );
};

export default UserSubscriberDetails;
