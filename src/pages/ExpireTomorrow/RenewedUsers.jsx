import React from "react";
import {
  Box,
  CircularProgress,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useSelection } from "../../hooks/use-selection";
import { CustomSearch } from "../../components/custom-search";
import { UsersRenewHeadCells } from "../../seed/table-headers";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import { useDispatch, useSelector } from "react-redux";
import { webGetRequest } from "../../services/api-service";
import { getAllUsersRenewtsUrl } from "../../seed/url";
import ViewMoreDialog from "./ViewMoreDialog";
import { UsersRenewCustomTable } from "../Payments/UsersRenewCustomTable";

// Hook to memoize the ids of the contents
const useContentsIds = (contents) => {
  return React.useMemo(() => {
    return contents.map((customer) => customer.id);
  }, [contents]);
};

function RenewedUsers() {
  const dispatch = useDispatch();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [contents, setContents] = React.useState({
    renewed_users_details: [],
    pagination: {
      current_page: 1,
      per_page: 0,
      total: 0,
      last_page: 0,
    },
  });
  const [, setSearchTerm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const contentsIds = useContentsIds(contents.renewed_users_details);
  const contentsSelection = useSelection(contentsIds);
  const [openViewDialog, setOpenViewDialog] = React.useState(false);

  const handleClickOpenViewDialog = () => {
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
  };
  const paymentSideNav = useSelector(
    (state) => state.ViewPaymentSideNavReducer
  );

  // Fetching function for the user data
  const fetcher = React.useCallback(
    (page) => {
      setIsLoading(true);
      webGetRequest(
        `${getAllUsersRenewtsUrl}?page=${page}&per_page=${rowsPerPage}`,
        (data) => {
          setContents(data);
          setIsLoading(false);
          console.log("Fetched Data: ", data); // Log the fetched data
        },
        (error) => {
          setContents({
            renewed_users_details: [],
            pagination: {
              current_page: 1,
              per_page: 0,
              total: 0,
              last_page: 0,
            },
          });
          setIsLoading(false);
          console.error("Error fetching data: ", error);
        }
      );
    },
    [rowsPerPage]
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  React.useEffect(() => {
    fetcher(1);
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

  // Payment popover action for the view
  const paymentPopoverItems = [
    {
      id: "view",
      label: "View",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "text.primary" }}>
          <EyeIcon />
        </SvgIcon>
      ),
      onClick: () => {
        if (contentsSelection?.selected[0]?.id) {
          handleClickOpenViewDialog();
        }
      },
    },
  ];

  // View more handler
  const handleViewMore = (user) => {
    dispatch({
      type: "TOOGLE_PAYMENT_SIDENAV",
      payload: {
        ...paymentSideNav,
        openViewPaymentSideNav: true,
        paymentSideNavContent: user,
      },
    });
  };

  // Head cells definition with the render function

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        pt: 2,
        pb: 8,
      }}
    >
      {openViewDialog && (
        <ViewMoreDialog
          open={openViewDialog}
          selected={contentsSelection?.selected[0]?.id}
          handleClose={handleCloseViewDialog}
        />
      )}

      <Container maxWidth={false}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={4}
            alignItems="center"
          >
            <Stack spacing={1}>
              <Typography variant="h4">Accounts Renew</Typography>
            </Stack>
          </Stack>
          <CustomSearch handleSearch={handleSearch} />
          {isLoading && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <CircularProgress
                sx={{
                  mx: "auto",
                  my: 3,
                }}
              />
            </Box>
          )}
          {!isLoading && (
            <UsersRenewCustomTable
              count={contents.pagination.total}
              items={contents.renewed_users_details}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectOne={contentsSelection.handleSelectOne}
              page={
                contents.pagination.current_page >= 1
                  ? contents.pagination.current_page - 1
                  : contents.pagination.current_page
              }
              rowsPerPage={rowsPerPage}
              selected={contentsSelection.selected}
              headCells={UsersRenewHeadCells}
              isLoading={isLoading}
              popoverItems={paymentPopoverItems}
            />
          )}
        </Stack>
      </Container>
    </Box>
  );
}

export default RenewedUsers;
