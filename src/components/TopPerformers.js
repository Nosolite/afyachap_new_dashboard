import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardCard from "../../src/components/shared/DashboardCard";
import CustomSelect from "../../src/components/forms/theme-elements/CustomSelect";
import {
  MenuItem,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Avatar,
  Stack,
  Box,
  Chip,
} from "@mui/material";

const TopPerformers = () => {
  // State for selected month
  const [month, setMonth] = useState("1");
  // State for performers data
  const [performers, setPerformers] = useState([]);
  // State for user details
  const [userDetails, setUserDetails] = useState([]);

  // Fetch top spending users
  const fetchTopSpendingUsers = async () => {
    try {
      const response = await axios.get(
        "https://afyachap.com/api/v1/top-spending-users"
      );
      console.log("Top spending users:", response.data.top_spending_users);
      setPerformers(response.data.top_spending_users);
      return response.data.top_spending_users;
    } catch (error) {
      console.error("Error fetching top spending users: ", error);
    }
  };

  // Fetch user details
  const fetchUserDetails = async (userIds) => {
    try {
      const response = await axios.post(
        "https://www.users.afyachap.com/api/get/users/from/given/ids",
        { users: userIds }
      );
      console.log("User details:", response.data.data);
      setUserDetails(response.data.data);
    } catch (error) {
      console.error("Error fetching user details: ", error);
    }
  };

  // Fetch data on component mount and when month changes
  useEffect(() => {
    const fetchData = async () => {
      const topSpendingUsers = await fetchTopSpendingUsers();
      if (topSpendingUsers) {
        const userIds = topSpendingUsers.map((user) => ({
          user_id: user.user_id,
        }));
        await fetchUserDetails(userIds);
      }
    };
    fetchData();
  }, [month]);

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  const getUserDetails = (userId) => {
    return userDetails.find((user) => user.id === userId) || {};
  };

  return (
    <DashboardCard
      title="Top Spending Customers"
      subtitle="Top Afyachap users"
      action={
        <CustomSelect
          labelId="month-dd"
          id="month-dd"
          size="small"
          value={month}
          onChange={handleChange}
        >
          <MenuItem value={1}>March 2022</MenuItem>
          <MenuItem value={2}>April 2022</MenuItem>
          <MenuItem value={3}>May 2022</MenuItem>
        </CustomSelect>
      }
    >
      <TableContainer>
        <Table
          aria-label="simple table"
          sx={{
            whiteSpace: "nowrap",
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Name
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Last spend (TZS)
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Total Spent (TZS)
                </Typography>
              </TableCell>

              <TableCell>
                <Typography variant="subtitle2" fontWeight={600}>
                  Status
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {performers.map((user) => {
              const userDetail = getUserDetails(user.user_id);
              console.log("Rendering user detail:", userDetail);
              return (
                <TableRow key={user.user_id}>
                  <TableCell>
                    <Stack direction="row" spacing={2}>
                      <Avatar
                        src={userDetail.profileImage}
                        alt={userDetail.profileImage}
                        sx={{ width: 40, height: 40 }}
                      />
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {userDetail.firstName} {userDetail.secondName || ""}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          fontSize="12px"
                          variant="subtitle2"
                        >
                          client
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Typography color="textSecondary" variant="subtitle2">
                      {user.last_amount_spent
                        ? user.last_amount_spent.toLocaleString()
                        : "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">
                      {user.total.toLocaleString()}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      sx={{
                        bgcolor:
                          user.account_status === "FREE"
                            ? (theme) => theme.palette.error.light
                            : user.account_status === "PREMIUM"
                            ? (theme) => theme.palette.warning.light
                            : (theme) => theme.palette.secondary.light,
                        color:
                          user.account_status === "FREE"
                            ? (theme) => theme.palette.error.main
                            : user.account_status === "PREMIUM"
                            ? (theme) => theme.palette.warning.main
                            : (theme) => theme.palette.secondary.main,
                        borderRadius: "8px",
                      }}
                      size="small"
                      label={user.account_status}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </DashboardCard>
  );
};

export default TopPerformers;
