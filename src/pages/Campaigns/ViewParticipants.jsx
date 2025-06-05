import React from "react";
import {
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { useSelection } from "../../hooks/use-selection";
import { CustomTable } from "../../components/custom-table";
import { CustomSearch } from "../../components/custom-search";
import { campaignParticipantsHeadCells } from "../../seed/table-headers";
import { filterItems } from "../../utils/constant";
import { postRequest, webGetRequest } from "../../services/api-service";
import { getCampaignWinnersUrl, getUsersFromIDsUrl } from "../../seed/url";

const useSpecializationsIds = (specializations) => {
  return React.useMemo(() => {
    return specializations.map((customer) => customer.id);
  }, [specializations]);
};

function ViewParticipants({ open, handleClose, selected }) {
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [specializations, setSpecializations] = React.useState({
    page: 1,
    total_results: 0,
    total_pages: 0,
    results: [],
  });
  const [, setSearchTerm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const specializationsIds = useSpecializationsIds(specializations.results);
  const contentCategorySelection = useSelection(specializationsIds);
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("id");

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const fetcher = React.useCallback(
    (page) => {
      webGetRequest(
        getCampaignWinnersUrl + selected.id + "/list",
        (data) => {
          postRequest(
            getUsersFromIDsUrl,
            {
              users: data.map((item) => {
                return { user_id: item.user_id };
              }),
            },
            (userData) => {
              setSpecializations({
                page: 1,
                total_results: data.length,
                total_pages: 1,
                results: data.map((item) => {
                  const userDetails = userData.data.find(
                    (user) => user.id === item.user_id
                  );
                  if (userDetails === undefined) return item;
                  return { ...item, ...userDetails };
                }),
              });
              setIsLoading(false);
            },
            (errorUserData) => {
              setSpecializations({
                page: 1,
                total_results: 0,
                total_pages: 0,
                results: [],
              });
              setIsLoading(false);
            }
          );
        },
        (error) => {
          setSpecializations({
            page: 1,
            total_results: 0,
            total_pages: 0,
            results: [],
          });
          setIsLoading(false);
        }
      );
    },
    [selected]
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

  const contentPopoverItems = [];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen
      PaperProps={{
        style: {
          boxShadow: "none",
        },
      }}
    >
      <DialogActions>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="close"
          onClick={() => {
            handleClose();
          }}
        >
          <SvgIcon fontSize="large">
            <XMarkIcon />
          </SvgIcon>
        </IconButton>
      </DialogActions>
      <DialogContent>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 2,
            pb: 8,
          }}
        >
          <Container maxWidth="xl">
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <Stack spacing={1}>
                  <Typography variant="h4">{selected.title}</Typography>
                </Stack>
              </Stack>
              <CustomSearch
                popoverItems={filterItems}
                handleSearch={handleSearch}
              />
              <CustomTable
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                count={specializations.total_results}
                items={specializations.results}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSelectOne={contentCategorySelection.handleSelectOne}
                page={
                  specializations.page >= 1
                    ? specializations.page - 1
                    : specializations.page
                }
                rowsPerPage={rowsPerPage}
                selected={contentCategorySelection.selected}
                headCells={campaignParticipantsHeadCells}
                popoverItems={contentPopoverItems}
                isLoading={isLoading}
              />
            </Stack>
          </Container>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default ViewParticipants;
