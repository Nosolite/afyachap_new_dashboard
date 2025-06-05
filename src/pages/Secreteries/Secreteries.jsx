import React from 'react'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from '../../hooks/use-selection';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { usersHeadCells } from '../../seed/table-headers';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { DeleteDialog } from '../../components/delete-dialog';
import { filterItems } from '../../utils/constant';
import { authPostRequest } from '../../services/api-service';
import { assignUserRoleUrl, deleteAccountUrl, enableDisableUserUrl, getAllSecretariesUrl, removeUserRoleUrl } from '../../seed/url';
import ViewUser from '../Users/ViewUser';
import { CustomAlert } from '../../components/custom-alert';
import AssignRole from './AssignRole';
import { ConfirmationDialog } from '../../components/confirmation-dialog';

const useContentsIds = (contents) => {
  return React.useMemo(
    () => {
      return contents.map((customer) => customer.id);
    },
    [contents]
  );
};

function Secreteries() {
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [contents, setContents] = React.useState({
    page: 1,
    total_results: 0,
    total_pages: 0,
    results: []
  });
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [isSubmitting, setSubmitting] = React.useState(false)
  const contentsIds = useContentsIds(contents.results);
  const diseaseSelection = useSelection(contentsIds);
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [openRemoveRoleDialog, setOpenRemoveRoleDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false)
  const [severity, setSeverity] = React.useState("")
  const [severityMessage, setSeverityMessage] = React.useState("")
  const [userId, setUserId] = React.useState(0)
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('id');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const fetcher = React.useCallback(
    (page) => {
      authPostRequest(
        getAllSecretariesUrl,
        {
          "query": searchTerm,
          "sort": orderBy + " " + order,
          "limit": rowsPerPage,
          "page": page
        },
        (data) => {
          setContents(data)
          setIsLoading(false)
        },
        (error) => {
          setContents({
            page: 1,
            total_results: 0,
            total_pages: 0,
            results: [],
          })
          setIsLoading(false)
        },
      )
    },
    [rowsPerPage, searchTerm, orderBy, order]
  );

  const enableDisableUser = (data) => {
    if (!isSubmitting) {
      setSubmitting(true);
      diseaseSelection.handleSelectOne(data);
      authPostRequest(
        enableDisableUserUrl,
        {
          user_id: data.id,
          status: data.status === "ACTIVE" ? "DISABLED" : "ACTIVE",
        },
        (data) => {
          fetcher(contents.page);
          setSubmitting(false);
        },
        (error) => {
          if (error?.response?.data?.message) {
            setSeverityMessage(error.response.data.message[0]);
            setSeverity("error");
            handleClickAlert();
          }
          setSubmitting(false);
        }
      );
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  React.useEffect(() => {
    fetcher(1)
  }, [fetcher])

  const handlePageChange = React.useCallback(
    (event, value) => {
      fetcher(value + 1)
    },
    [fetcher]
  );

  const handleRowsPerPageChange = React.useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  const handleClickOpenCreateDialog = () => {
    setOpenCreateDialog(true)
  }

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false)
  }

  const handleClickOpenViewDialog = () => {
    setOpenViewDialog(true)
  }

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false)
  }

  const handleClickOpenRemoveRoleDialog = () => {
    setOpenRemoveRoleDialog(true)
  }

  const handleCloseRemoveRoleDialog = () => {
    setOpenRemoveRoleDialog(false)
  }

  const handleClickOpenDeleteDialog = () => {
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  const handleClickAlert = () => {
    setOpenAlert(true)
  }

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setOpenAlert(false)
  }

  const handleDelete = async () => {
    authPostRequest(
      deleteAccountUrl,
      {
        user_id: diseaseSelection.selected[0].id,
      },
      (data) => {
        fetcher(contents.page)
        setSeverityMessage(data.message)
        setSeverity("success")
        handleClickAlert()
        setIsDeleting(false)
        handleCloseDeleteDialog()
      },
      (error) => {
        if (error?.response?.data?.message) {
          setSeverityMessage(error.response.data.message[0])
          setSeverity("error")
          handleClickAlert()
        }
        setIsDeleting(false)
      },
    )
  }

  const handleAssignRole = () => {
    authPostRequest(
      assignUserRoleUrl,
      {
        user_id: userId,
        role: "secretary",
      },
      (data) => {
        fetcher(contents.page)
        setSeverityMessage(data.message)
        setSeverity("success")
        handleClickAlert()
        setSubmitting(false)
        handleCloseCreateDialog()
      },
      (error) => {
        if (error?.response?.data?.message) {
          setSeverityMessage(error.response.data.message[0])
          setSeverity("error")
          handleClickAlert()
        }
        setSubmitting(false)
      },
    )
  }

  const handleRemoveRole = async () => {
    authPostRequest(
      removeUserRoleUrl,
      {
        user_id: diseaseSelection.selected[0].id,
      },
      (data) => {
        fetcher(contents.page)
        setSeverityMessage(data.message)
        setSeverity("success")
        handleClickAlert()
        setSubmitting(false)
        handleCloseRemoveRoleDialog()
      },
      (error) => {
        if (error?.response?.data?.message) {
          setSeverityMessage(error.response.data.message[0])
          setSeverity("error")
          handleClickAlert()
        }
        setSubmitting(false)
      },
    )
  }

  const contentPopoverItems = [
    {
      id: 'view',
      label: 'View',
      icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><EyeIcon /></SvgIcon>,
      onClick: () => {
        if (diseaseSelection?.selected[0]?.id) {
          handleClickOpenViewDialog()
        }
      },
    },
    {
      id: 'remove role',
      label: 'Remove Role',
      icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><PencilIcon /></SvgIcon>,
      onClick: () => {
        if (diseaseSelection?.selected[0]?.id) {
          handleClickOpenRemoveRoleDialog()
        }
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><TrashIcon /></SvgIcon>,
      onClick: () => {
        if (diseaseSelection?.selected[0]?.id) {
          handleClickOpenDeleteDialog()
        }
      },
    },
  ]

  return (
    <>
      {openAlert &&
        <CustomAlert
          openAlert={openAlert}
          handleCloseAlert={handleCloseAlert}
          severity={severity}
          severityMessage={severityMessage}
        />
      }
      {openCreateDialog &&
        <AssignRole
          open={openCreateDialog}
          handleClose={handleCloseCreateDialog}
          isSubmitting={isSubmitting}
          handleAssignRole={handleAssignRole}
          userId={userId}
          setUserId={setUserId}
        />
      }
      {openViewDialog &&
        <ViewUser
          open={openViewDialog}
          handleClose={handleCloseViewDialog}
          selected={diseaseSelection.selected[0]}
        />
      }
      {openRemoveRoleDialog &&
        <ConfirmationDialog
          open={openRemoveRoleDialog}
          handleClose={handleCloseRemoveRoleDialog}
          handleSubmit={handleRemoveRole}
          isSubmitting={isSubmitting}
          title={"Remove Role"}
          content={"Are you sure you want to remove secretary role to this user?"}
        />
      }
      {openDeleteDialog &&
        <DeleteDialog
          open={openDeleteDialog}
          handleClose={handleCloseDeleteDialog}
          handleDelete={handleDelete}
          isDeleting={isDeleting}
        />
      }
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 2,
          pb: 8
        }}
      >
        <Container maxWidth={false}>
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Secreteries
                </Typography>
              </Stack>
              <div>
                <Button
                  onClick={handleClickOpenCreateDialog}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon />
                    </SvgIcon>
                  )}
                  variant="contained"
                  sx={{
                    color: "neutral.100"
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
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              count={contents.total_results}
              items={contents.results}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectOne={diseaseSelection.handleSelectOne}
              page={contents.page >= 1 ? contents.page - 1 : contents.page}
              rowsPerPage={rowsPerPage}
              selected={diseaseSelection.selected}
              headCells={usersHeadCells}
              popoverItems={contentPopoverItems}
              isLoading={isLoading}
              switchFunction={enableDisableUser}
              isSubmitting={isSubmitting}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Secreteries