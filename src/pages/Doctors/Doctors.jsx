import React from 'react'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from '../../hooks/use-selection';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { doctorApplicationsHeadCells } from '../../seed/table-headers';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { DeleteDialog } from '../../components/delete-dialog';
import { UPDATE, filterItems } from '../../utils/constant';
import CreateDoctor from './CreateDoctor';
import ViewDoctor from './ViewDoctor';
import { postRequest } from '../../services/api-service';
import { deleteDoctorUrl, enableDisableDoctorUrl, getAllDoctorUrl, updateDoctorOnCreationUrl } from '../../seed/url';
import { FormDialog } from '../../components/form-dialog';
import { doctorInformationFields } from '../../seed/form-fields';
import { CustomAlert } from '../../components/custom-alert';
import { useDispatch } from 'react-redux';
import { doctorInfoInitalState } from '../../store/reducers/doctor-information';
import { doctorattachmentsInitalState } from '../../store/reducers/doctor-attachments';
import dayjs from 'dayjs';
import { convertDateFormat } from '../../utils/date-formatter';

const useDoctorsIds = (doctors) => {
  return React.useMemo(
    () => {
      return doctors.map((customer) => customer.id);
    },
    [doctors]
  );
};

function Doctors() {
  const dispatch = useDispatch()
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [doctors, setDoctors] = React.useState({
    page: 1,
    total_results: 0,
    total_pages: 0,
    results: []
  });
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)
  const doctorsIds = useDoctorsIds(doctors.results);
  const doctorSelection = useSelection(doctorsIds);
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
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
        getAllDoctorUrl,
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
          setDoctors(newData)
          setIsLoading(false)
        },
        (error) => {
          setDoctors({
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
  )

  const enableDisableDoctor = (data) => {
    if (!isSubmitting) {
      doctorSelection.handleSelectOne(data)
      postRequest(
        enableDisableDoctorUrl,
        {
          user_id: data.id,
          status: data.status === "ACTIVE" ? "DISABLED" : "ACTIVE",
        },
        (data) => {
          fetcher(doctors.page)
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
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleDelete = async () => {
    postRequest(
      deleteDoctorUrl,
      {
        doctor_id: doctorSelection.selected[0].id,
      },
      (data) => {
        fetcher(doctors.page)
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

  const handleClickOpenCreateDialog = () => {
    setOpenCreateDialog(true)
  }

  const handleCloseCreateDialog = () => {
    dispatch({
      type: "DOCTOR_INFO",
      payload: doctorInfoInitalState,
    })
    dispatch({
      type: "DOCTOR_ATTACHMENTS",
      payload: doctorattachmentsInitalState,
    })
    fetcher(1)
    setOpenCreateDialog(false)
  }

  const handleClickOpenEditDialog = () => {
    setOpenEditDialog(true)
  }

  const handleCloseEditDialog = () => {
    fetcher(doctors.page)
    setOpenEditDialog(false)
  }

  const handleClickOpenViewDialog = () => {
    setOpenViewDialog(true)
  }

  const handleCloseViewDialog = () => {
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
        if (doctorSelection.selected[0].id) {
          handleClickOpenViewDialog()
        }
      },
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><PencilIcon /></SvgIcon>,
      onClick: () => {
        if (doctorSelection.selected[0].id) {
          handleClickOpenEditDialog()
        }
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><TrashIcon /></SvgIcon>,
      onClick: () => {
        if (doctorSelection.selected[0].id) {
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
        <CreateDoctor
          open={openCreateDialog}
          handleClose={handleCloseCreateDialog}
        />
      }
      {openEditDialog &&
        <FormDialog
          open={openEditDialog}
          handleClose={handleCloseEditDialog}
          dialogTitle={"Doctor"}
          action={UPDATE}
          fields={doctorInformationFields}
          values={[{
            ...doctorSelection.selected[0],
            phone_number: doctorSelection.selected[0].phone_no,
            doctor_id: doctorSelection.selected[0].id,
            date_of_birth: dayjs(convertDateFormat(doctorSelection.selected[0].date_of_birth)),
          }]}
          url={updateDoctorOnCreationUrl}
        />
      }
      {openViewDialog &&
        <ViewDoctor
          open={openViewDialog}
          handleClose={handleCloseViewDialog}
          selected={doctorSelection.selected[0]}
          setIsDeleting={setIsDeleting}
          setSeverityMessage={setSeverityMessage}
          setSeverity={setSeverity}
          handleClickAlert={handleClickAlert}
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
                  Doctors
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
              count={doctors.total_results}
              items={doctors.results}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectOne={doctorSelection.handleSelectOne}
              page={doctors.page >= 0 ? doctors.page - 1 : doctors.page}
              rowsPerPage={rowsPerPage}
              selected={doctorSelection.selected}
              headCells={doctorApplicationsHeadCells}
              popoverItems={contentPopoverItems}
              isLoading={isLoading}
              switchFunction={enableDisableDoctor}
              isSubmitting={isSubmitting}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Doctors