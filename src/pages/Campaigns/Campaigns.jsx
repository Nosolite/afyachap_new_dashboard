import React from "react";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import {
  Box,
  Button,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useSelection } from "../../hooks/use-selection";
import { CustomTable } from "../../components/custom-table";
import { CustomSearch } from "../../components/custom-search";
import { campaignHeadCells } from "../../seed/table-headers";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import PencilIcon from "@heroicons/react/24/outline/PencilIcon";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { DeleteDialog } from "../../components/delete-dialog";
import { CREATE, UPDATE, filterItems } from "../../utils/constant";
import { FormDialog } from "../../components/form-dialog";
import { campaignFields } from "../../seed/form-fields";
import ViewCampaign from "./ViewCampaign";
import { webDeleteRequest, webGetRequest } from "../../services/api-service";
import { campaignUrl } from "../../seed/url";
import { CustomAlert } from "../../components/custom-alert";
import dayjs from "dayjs";
import ViewParticipants from "./ViewParticipants";

const useSpecializationsIds = (specializations) => {
  return React.useMemo(() => {
    return specializations.map((customer) => customer.id);
  }, [specializations]);
};

function Campaigns() {
  const [action, setAction] = React.useState(CREATE);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [specializations, setSpecializations] = React.useState({
    page: 1,
    total_results: 0,
    total_pages: 0,
    results: [],
  });
  const [, setSearchTerm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const specializationsIds = useSpecializationsIds(specializations.results);
  const contentCategorySelection = useSelection(specializationsIds);
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [openParticipantsDialog, setOpenParticipantsDialog] =
    React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [severity, setSeverity] = React.useState("");
  const [severityMessage, setSeverityMessage] = React.useState("");
  const values = [
    {
      campaignId:
        action === UPDATE ? contentCategorySelection.selected[0].id : 0,
      title:
        action === UPDATE ? contentCategorySelection.selected[0].title : "",
      description:
        action === UPDATE
          ? contentCategorySelection.selected[0].description
          : "",
      image:
        action === UPDATE ? contentCategorySelection.selected[0].image : null,
      start_time:
        action === UPDATE
          ? dayjs(contentCategorySelection.selected[0].start_time)
          : "",
      end_time:
        action === UPDATE
          ? dayjs(contentCategorySelection.selected[0].end_time)
          : "",
    },
  ];

  const fetcher = React.useCallback((page) => {
    setIsLoading(true);
    webGetRequest(
      campaignUrl,
      (data) => {
        setSpecializations({
          page: 1,
          total_results: data.length,
          total_pages: 1,
          results: data,
        });
        setIsLoading(false);
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
  }, []);

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

  const handleClickOpenCreateDialog = () => {
    setOpenCreateDialog(true);
  };

  const handleCloseCreateDialog = () => {
    action === UPDATE ? fetcher(specializations.page) : fetcher(1);
    setOpenCreateDialog(false);
    setAction(CREATE);
  };

  const handleClickOpenViewDialog = () => {
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
  };

  const handleClickOpenParticipantsDialog = () => {
    setOpenParticipantsDialog(true);
  };

  const handleCloseParticipantsDialog = () => {
    setOpenParticipantsDialog(false);
  };

  const handleClickOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleClickAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  const handleDelete = async () => {
    webDeleteRequest(
      campaignUrl + "/" + contentCategorySelection.selected[0].id,
      (data) => {
        fetcher(specializations.page);
        setSeverityMessage(data.message);
        setSeverity("success");
        handleClickAlert();
        setIsDeleting(false);
        handleCloseDeleteDialog();
      },
      (error) => {
        if (error?.response?.data?.message) {
          setSeverityMessage(error.response.data.message[0]);
          setSeverity("error");
          handleClickAlert();
        }
        setIsDeleting(false);
      }
    );
  };

  const contentPopoverItems = [
    {
      id: "packages",
      label: "Packages",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "text.primary" }}>
          <CreditCardIcon />
        </SvgIcon>
      ),
      onClick: () => {
        if (contentCategorySelection?.selected[0]?.id) {
          handleClickOpenViewDialog();
        }
      },
    },
    {
      id: "participants",
      label: "Participants",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "text.primary" }}>
          <UsersIcon />
        </SvgIcon>
      ),
      onClick: () => {
        if (contentCategorySelection?.selected[0]?.id) {
          handleClickOpenParticipantsDialog();
        }
      },
    },
    {
      id: "edit",
      label: "Edit",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "text.primary" }}>
          <PencilIcon />
        </SvgIcon>
      ),
      onClick: () => {
        if (contentCategorySelection?.selected[0]?.id) {
          setAction(UPDATE);
          handleClickOpenCreateDialog();
        }
      },
    },
    {
      id: "delete",
      label: "Delete",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "text.primary" }}>
          <TrashIcon />
        </SvgIcon>
      ),
      onClick: () => {
        if (contentCategorySelection?.selected[0]?.id) {
          handleClickOpenDeleteDialog();
        }
      },
    },
  ];

  return (
    <>
      {openAlert && (
        <CustomAlert
          openAlert={openAlert}
          handleCloseAlert={handleCloseAlert}
          severity={severity}
          severityMessage={severityMessage}
        />
      )}
      {openCreateDialog && (
        <FormDialog
          open={openCreateDialog}
          handleClose={handleCloseCreateDialog}
          dialogTitle={"Campaign"}
          action={action}
          fields={campaignFields}
          values={values}
          url={
            action === CREATE
              ? campaignUrl
              : campaignUrl + "/" + contentCategorySelection.selected[0].id
          }
          isWebServerRequest={true}
        />
      )}
      {openViewDialog && (
        <ViewCampaign
          open={openViewDialog}
          handleClose={handleCloseViewDialog}
          selected={contentCategorySelection.selected[0]}
        />
      )}
      {openParticipantsDialog && (
        <ViewParticipants
          open={openParticipantsDialog}
          handleClose={handleCloseParticipantsDialog}
          selected={contentCategorySelection.selected[0]}
        />
      )}
      {openDeleteDialog && (
        <DeleteDialog
          open={openDeleteDialog}
          handleClose={handleCloseDeleteDialog}
          handleDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 2,
          pb: 8,
        }}
      >
        <Container maxWidth={false}>
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" spacing={4}>
              <Stack spacing={1}>
                <Typography variant="h4">Campaigns</Typography>
              </Stack>
              <div>
                <Button
                  onClick={handleClickOpenCreateDialog}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  sx={{
                    color: "neutral.100",
                  }}
                >
                  Add
                </Button>
              </div>
            </Stack>
            <CustomSearch
              popoverItems={filterItems}
              handleSearch={handleSearch}
            />
            <CustomTable
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
              headCells={campaignHeadCells}
              popoverItems={contentPopoverItems}
              isLoading={isLoading}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Campaigns;
