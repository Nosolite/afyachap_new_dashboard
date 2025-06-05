import React from 'react'
import { Box, Container, Stack, SvgIcon, Tab, Tabs, Typography } from '@mui/material';
import { useSelection } from '../../hooks/use-selection';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { authorsHeadCells } from '../../seed/table-headers';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import UserIcon from '@heroicons/react/24/outline/UserIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { DeleteDialog } from '../../components/delete-dialog';
import { CREATE, UPDATE, authorsStatus, filterItems } from '../../utils/constant';
import { FormDialog } from '../../components/form-dialog';
import { authorFields, authorProfileFields } from '../../seed/form-fields';
import { authPostRequest, postRequest } from '../../services/api-service';
import { assignUserRoleUrl, createAuthorUrl, createUpdateDoctorRoleUrl, deleteAuthorUrl, getAllAuthorByPaginationUrl, getUsersFromIDsUrl, updateAuthorImageUrl, updateAuthorUrl } from '../../seed/url';
import { CustomAlert } from '../../components/custom-alert';
import ViewAuthor from './ViewAuthor';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';

const useSpecializationsIds = (specializations) => {
  return React.useMemo(
    () => {
      return specializations.map((customer) => customer.id);
    },
    [specializations]
  );
};

function Authors() {
  const [action, setAction] = React.useState(CREATE)
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [specializations, setSpecializations] = React.useState({
    page: 1,
    total_results: 0,
    total_pages: 0,
    results: []
  });
  const [searchTerm, setSearchTerm] = React.useState("")
  const [formFields, setFormFields] = React.useState(authorFields)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const specializationsIds = useSpecializationsIds(specializations.results);
  const authorSelection = useSelection(specializationsIds);
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [openUploadProfileDialog, setOpenUploadProfileDialog] = React.useState(false);
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openAlert, setOpenAlert] = React.useState(false)
  const [severity, setSeverity] = React.useState("")
  const [severityMessage, setSeverityMessage] = React.useState("")
  const [isSubmitting, setSubmitting] = React.useState(false)
  const [currentTab, setCurrentTab] = React.useState(0)
  const values = [
    {
      id: action === UPDATE ? authorSelection.selected[0].id : 0,
      name: action === UPDATE ? authorSelection.selected[0].name : "",
      title: action === UPDATE ? authorSelection.selected[0].title : "",
      type: action === UPDATE ? authorSelection.selected[0].type : "",
      is_doctor: action === UPDATE ? authorSelection.selected[0].is_doctor : "",
      user_id: action === UPDATE ? authorSelection.selected[0].user_id : 1,
      is_verified: action === UPDATE ? authorSelection.selected[0].is_verified : "",
      amount_per_view_premium_content: action === UPDATE ? authorSelection.selected[0].amount_per_view_premium_content : "",
      amount_per_view_free_content: action === UPDATE ? authorSelection.selected[0].amount_per_view_free_content : "",
      image: null,
    }
  ]
  const authorProfileValues = [
    {
      user_id: authorSelection?.selected?.[0]?.user_id || "",
      is_doctor: authorSelection?.selected?.[0]?.is_doctor || "",
      image: null,
    }
  ];
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
        getAllAuthorByPaginationUrl,
        {
          query: searchTerm,
          is_verified: authorsStatus[currentTab].is_verified,
          sort: orderBy + " " + order,
          limit: rowsPerPage,
          page: page
        },
        (data) => {
          postRequest(
            getUsersFromIDsUrl,
            {
              users: data.results.filter(item => item.is_doctor === "NO").map((item) => {
                return { user_id: item.user_id };
              }),
            },
            (userData) => {
              setSpecializations({
                ...data,
                results: data.results.map((item) => {
                  const userDetails = userData.data.find(
                    (user) => user.id === item.user_id
                  );
                  if (userDetails === undefined) return item;
                  return { ...item, phoneNumber: userDetails.phoneNumber, email: userDetails.email };
                }),
              });
              setIsLoading(false);
            },
            (errorUserData) => {
              setSpecializations(data)
              setIsLoading(false)
            },
          )
        },
        (error) => {
          setSpecializations({
            page: 1,
            total_results: 0,
            total_pages: 0,
            results: [],
          })
          setIsLoading(false)
        },
      )
    },
    [searchTerm, currentTab, orderBy, order, rowsPerPage]
  );

  const verifyUnverifyAuthor = (data) => {
    if (!isSubmitting) {
      authorSelection.handleSelectOne(data)
      authPostRequest(
        data.is_doctor === "YES" ? createUpdateDoctorRoleUrl : assignUserRoleUrl,
        {
          user_id: data.user_id,
          role: "author",
          status: data.is_verified === "YES" ? false : true,
        },
        () => {
          postRequest(
            updateAuthorUrl,
            {
              id: data.id,
              name: data.name,
              title: data.title,
              type: data.type,
              is_doctor: data.is_doctor,
              user_id: data.user_id,
              is_verified: data.is_verified === "YES" ? "NO" : "YES",
              amount_per_view_premium_content: data.amount_per_view_premium_content,
              amount_per_view_free_content: data.amount_per_view_free_content,
            },
            (data) => {
              fetcher(specializations.page)
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
        },
        (error) => {
          if (error?.response?.data?.message) {
            setSeverityMessage(error.response.data.message[0])
            setSeverity("error")
            handleClickAlert()
          }
          setSubmitting(false)
        }
      )
    }
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  React.useEffect(() => {
    const newAuthorFields = authorFields.slice(0, authorFields.length - 1)
    action === UPDATE ? setFormFields(newAuthorFields) : setFormFields(authorFields)
  }, [action])

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
    action === UPDATE ? fetcher(specializations.page) : fetcher(1)
    setOpenCreateDialog(false)
    setAction(CREATE)
  }

  const handleClickOpenUploadProfileDialog = () => {
    setOpenUploadProfileDialog(true)
  }

  const handleCloseUploadProfileDialog = () => {
    setOpenUploadProfileDialog(false)
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

  const handleDelete = async () => {
    postRequest(
      deleteAuthorUrl,
      {
        id: authorSelection.selected[0].id,
      },
      (data) => {
        fetcher(specializations.page)
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

  const handleTabChange = React.useCallback(
    (event, value) => {
      setCurrentTab(value)
    },
    []
  )

  const contentPopoverItems = [
    {
      id: 'view',
      label: 'View',
      icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><EyeIcon /></SvgIcon>,
      onClick: () => {
        if (authorSelection.selected[0].id) {
          handleClickOpenViewDialog()
        }
      },
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><PencilIcon /></SvgIcon>,
      onClick: () => {
        if (authorSelection?.selected[0]?.id) {
          setAction(UPDATE)
          handleClickOpenCreateDialog()
        }
      },
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><UserIcon /></SvgIcon>,
      onClick: () => {
        if (authorSelection?.selected[0]?.id) {
          handleClickOpenUploadProfileDialog()
        }
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><TrashIcon /></SvgIcon>,
      onClick: () => {
        if (authorSelection?.selected[0]?.id) {
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
        <FormDialog
          open={openCreateDialog}
          handleClose={handleCloseCreateDialog}
          dialogTitle={"Author"}
          action={action}
          fields={formFields}
          values={values}
          url={action === CREATE ? createAuthorUrl : updateAuthorUrl}
        />
      }
      {openUploadProfileDialog &&
        <FormDialog
          open={openUploadProfileDialog}
          handleClose={handleCloseUploadProfileDialog}
          dialogTitle={"Author Image"}
          action={UPDATE}
          fields={authorProfileFields}
          values={authorProfileValues}
          url={updateAuthorImageUrl}
        />
      }
      {openViewDialog &&
        <ViewAuthor
          open={openViewDialog}
          handleClose={handleCloseViewDialog}
          selected={authorSelection.selected[0]}
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
              flexWrap="wrap"
              spacing={4}
            >
              <Typography variant="h4">
                Authors
              </Typography>
            </Stack>
            <Tabs
              onChange={handleTabChange}
              value={currentTab}
              variant='scrollable'
              scrollButtons="auto"
            >
              {authorsStatus.map((item, index) => {

                return (
                  <Tab
                    key={item.label}
                    label={item.label}
                    value={index}
                  />
                );
              })}
            </Tabs>
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
              onSelectOne={authorSelection.handleSelectOne}
              page={specializations.page >= 1 ? specializations.page - 1 : specializations.page}
              rowsPerPage={rowsPerPage}
              selected={authorSelection.selected}
              headCells={authorsHeadCells}
              popoverItems={contentPopoverItems}
              isLoading={isLoading}
              switchFunction={verifyUnverifyAuthor}
              isSubmitting={isSubmitting}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Authors