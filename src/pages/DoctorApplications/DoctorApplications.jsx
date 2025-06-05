import React from 'react'
import { Box, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from '../../hooks/use-selection';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { doctorApplicationsHeadCells } from '../../seed/table-headers';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { DeleteDialog } from '../../components/delete-dialog';
import { UPDATE, filterItems } from '../../utils/constant';
import ViewDoctorApplication from './ViewDoctorApplication';
import { postRequest } from '../../services/api-service';
import { deleteDoctorUrl, enableDisableDoctorUrl, getAllDoctorApplicationsUrl, updateDoctorOnCreationUrl } from '../../seed/url';
import { FormDialog } from '../../components/form-dialog';
import dayjs from 'dayjs';
import { doctorInformationFields } from '../../seed/form-fields';
import { CustomAlert } from '../../components/custom-alert';
import { convertDateFormat } from '../../utils/date-formatter';

const useDoctorsApplicationsIds = (doctorsApplications) => {
  return React.useMemo(
    () => {
      return doctorsApplications.map((customer) => customer.id);
    },
    [doctorsApplications]
  );
};

function DoctorApplications() {
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [doctorsApplications, setDoctorsApplications] = React.useState({
    page: 1,
    total_results: 0,
    total_pages: 0,
    results: []
  });
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)
  const doctorsApplicationsIds = useDoctorsApplicationsIds(doctorsApplications.results);
  const contentsSelection = useSelection(doctorsApplicationsIds);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [openAlert, setOpenAlert] = React.useState(false)
  const [severity, setSeverity] = React.useState("")
  const [severityMessage, setSeverityMessage] = React.useState("")
  const [isSubmitting, setSubmitting] = React.useState(false)
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('id');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const fetcher = React.useCallback(
    (page) => {
      postRequest(
        getAllDoctorApplicationsUrl,
        {
          "query": searchTerm,
          "sort": orderBy + " " + order,
          "limit": rowsPerPage,
          "page": page
        },
        (data) => {
          let newData = data
          newData.results = newData.results.map(item => {
            delete item.is_verified

            return item
          })
          setDoctorsApplications(newData)
          setIsLoading(false)
        },
        (error) => {
          setDoctorsApplications({
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

  const enableDisableDoctor = (data) => {
    !isSubmitting &&
      postRequest(
        enableDisableDoctorUrl,
        {
          user_id: data.id,
          status: data.status === "ACTIVE" ? "DISABLED" : "ACTIVE",
        },
        (data) => {
          fetcher(doctorsApplications.page)
          setSubmitting(false)
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleDelete = async () => {
    postRequest(
      deleteDoctorUrl,
      {
        doctor_id: contentsSelection.selected[0].id,
      },
      (data) => {
        fetcher(doctorsApplications.page)
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

  const handleClickOpenEditDialog = () => {
    setOpenEditDialog(true)
  }

  const handleCloseEditDialog = () => {
    fetcher(doctorsApplications.page)
    setOpenEditDialog(false)
  }

  const handleClickOpenViewDialog = () => {
    setOpenViewDialog(true)
  }

  const handleCloseViewDialog = () => {
    fetcher(1)
    setOpenViewDialog(false)
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

  const contentPopoverItems = [
    {
      id: 'view',
      label: 'View',
      icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><EyeIcon /></SvgIcon>,
      onClick: () => {
        if (contentsSelection?.selected[0]?.id) {
          handleClickOpenViewDialog()
        }
      },
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><PencilIcon /></SvgIcon>,
      onClick: () => {
        if (contentsSelection?.selected[0]?.id) {
          handleClickOpenEditDialog()
        }
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><TrashIcon /></SvgIcon>,
      onClick: () => {
        if (contentsSelection?.selected[0]?.id) {
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
      {openEditDialog &&
        <FormDialog
          open={openEditDialog}
          handleClose={handleCloseEditDialog}
          dialogTitle={"Doctor Application"}
          action={UPDATE}
          fields={doctorInformationFields}
          values={[{
            ...contentsSelection.selected[0],
            phone_number: contentsSelection.selected[0].phone_no,
            doctor_id: contentsSelection.selected[0].id,
            date_of_birth: dayjs(convertDateFormat(contentsSelection.selected[0].date_of_birth)),
          }]}
          url={updateDoctorOnCreationUrl}
        />
      }
      {openViewDialog &&
        <ViewDoctorApplication
          open={openViewDialog}
          handleClose={handleCloseViewDialog}
          selected={contentsSelection.selected[0]}
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
                  Doctors Applications
                </Typography>
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
              count={doctorsApplications.total_results}
              items={doctorsApplications.results}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectOne={contentsSelection.handleSelectOne}
              page={doctorsApplications.page >= 1 ? doctorsApplications.page - 1 : doctorsApplications.page}
              rowsPerPage={rowsPerPage}
              selected={contentsSelection.selected}
              headCells={doctorApplicationsHeadCells}
              popoverItems={contentPopoverItems}
              isLoading={isLoading}
              switchFunction={enableDisableDoctor}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default DoctorApplications