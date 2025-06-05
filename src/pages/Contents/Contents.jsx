import React from 'react'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Tab, Tabs, Typography } from '@mui/material';
import { useSelection } from '../../hooks/use-selection';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { contentHeadCells } from '../../seed/table-headers';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import BellAlertIcon from '@heroicons/react/24/outline/BellAlertIcon';
import SpeakerWaveIcon from '@heroicons/react/24/outline/SpeakerWaveIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import UserIcon from '@heroicons/react/24/outline/UserIcon';
import ViewColumnsIcon from '@heroicons/react/24/outline/ViewColumnsIcon';
import { DeleteDialog } from '../../components/delete-dialog';
import ViewContent from './ViewContent';
import CreateContent from './CreateContent';
import { CREATE, UPDATE, contentsTypes } from '../../utils/constant';
import { addContentAudioUrl, deleteContentUrl, getAllAuthorUrl, getAllContentUrl, pinUnpinContentUrl, publishUnpublishContentUrl, scheduleContentNotificationUrl, verifyContentUrl } from '../../seed/url';
import { getRequest, postRequest } from '../../services/api-service';
import { CustomAlert } from '../../components/custom-alert';
import { useDispatch, useSelector } from 'react-redux';
import { contentInfoInitialState } from '../../store/reducers/content-information';
import { FormDialog } from '../../components/form-dialog';
import { approveContentFields, contentAudioFields, scheduleNotificationsFields } from '../../seed/form-fields';
import dayjs from 'dayjs';
import CheckBadgeIcon from '@heroicons/react/24/outline/CheckBadgeIcon';
import { useAuth } from '../../hooks/use-auth';

const useContentsIds = (contents) => {
  return React.useMemo(
    () => {
      return contents.map((customer) => customer.id);
    },
    [contents]
  );
};

function Contents() {
  const auth = useAuth();
  const dispatch = useDispatch()
  const [action, setAction] = React.useState(CREATE)
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [contents, setContents] = React.useState({
    page: 1,
    total_results: 0,
    total_pages: 0,
    results: []
  });
  const [authors, setAuthors] = React.useState([]);
  const [selectedAuthor, setSelectedAuthor] = React.useState({ label: "All authors", value: 0 });
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)
  const contentsIds = useContentsIds(contents.results);
  const contentsSelection = useSelection(contentsIds);
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
  const [openContentAudioDialog, setOpenContentAudioDialog] = React.useState(false);
  const [openScheduleNotificationDialog, setOpenScheduleNotificationDialog] = React.useState(false);
  const [openApproveContentDialog, setOpenApproveContentDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [openAlert, setOpenAlert] = React.useState(false)
  const [severity, setSeverity] = React.useState("")
  const [severityMessage, setSeverityMessage] = React.useState("")
  const [isSubmitting, setSubmitting] = React.useState(false)
  const [isPinning, setPinning] = React.useState(false)
  const [currentTab, setCurrentTab] = React.useState(0)
  const verificationHistorySideNav = useSelector((state) => state.ViewPaymentSideNavReducer);
  const contentAudioValues = [
    {
      content_id: contentsSelection?.selected[0]?.id,
      audio: null
    }
  ]
  const values = [
    {
      content_id: contentsSelection?.selected[0]?.id,
      notification_time: dayjs(),
      notification_repeat: 0,
      notification_interval: 0
    }
  ]
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
        getAllContentUrl,
        {
          query: searchTerm,
          published: contentsTypes[currentTab].published,
          free: contentsTypes[currentTab].free,
          pinned: contentsTypes[currentTab].pinned,
          platform: contentsTypes[currentTab].platform,
          approval: contentsTypes[currentTab].approval,
          author_id: selectedAuthor.value,
          sort: orderBy + " " + order,
          limit: rowsPerPage,
          page: page
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
    [searchTerm, currentTab, selectedAuthor.value, orderBy, order, rowsPerPage]
  );

  const publishUnpublishContent = (data) => {
    if (!isSubmitting) {
      contentsSelection.handleSelectOne(data)
      postRequest(
        publishUnpublishContentUrl,
        {
          content_id: data.id,
          publish: data.is_published === "YES" ? "NO" : "YES",
        },
        (data) => {
          fetcher(contents.page)
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

  const pinUnpinContent = (data) => {
    if (!isPinning) {
      contentsSelection.handleSelectOne(data)
      postRequest(
        pinUnpinContentUrl,
        {
          content_id: data.id,
        },
        (data) => {
          fetcher(contents.page)
          setPinning(false)
        },
        (error) => {
          if (error?.response?.data?.message) {
            setSeverityMessage(error.response.data.message[0])
            setSeverity("error")
            handleClickAlert()
          }
          setPinning(false)
        },
      )
    }
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleDelete = async () => {
    postRequest(
      deleteContentUrl,
      {
        content_id: contentsSelection.selected[0].id,
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

  React.useEffect(() => {
    fetcher(1)
  }, [fetcher])

  React.useEffect(() => {
    getRequest(
      getAllAuthorUrl,
      (data) => {
        const newData = data.map(item => {
          return {
            id: item.id,
            user_id: item.user_id,
            label: item.name,
            is_doctor: item.is_doctor,
            icon: <SvgIcon fontSize="small" sx={{ color: "primary.main" }}><UserIcon /></SvgIcon>,
            onClick: () => { setSelectedAuthor({ label: item.name, value: item.id }) }
          };
        });
        setAuthors([
          {
            id: 0,
            user_id: 0,
            label: "All authors",
            is_doctor: "",
            icon: <SvgIcon fontSize="small" sx={{ color: "primary.main" }}><UserIcon /></SvgIcon>,
            onClick: () => { setSelectedAuthor({ label: "All authors", value: 0 }) }
          },
          ...newData
        ]);
      },
      (error) => { }
    )
  }, [])

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
    setAction(CREATE)
    dispatch({
      type: "CONTENT_INFO",
      payload: contentInfoInitialState,
    })
    setOpenCreateDialog(false)
  }

  const handleClickOpenViewDialog = () => {
    setOpenViewDialog(true)
  }

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false)
  }

  const handleClickOpenContentAudioDialog = () => {
    setOpenContentAudioDialog(true)
  }

  const handleCloseContentAudioDialog = () => {
    setOpenContentAudioDialog(false)
  }

  const handleClickOpenScheduleNotificationDialog = () => {
    setOpenScheduleNotificationDialog(true)
  }

  const handleCloseScheduleNotificationDialog = () => {
    fetcher(contents.page)
    setOpenScheduleNotificationDialog(false)
  }

  const handleClickOpenApproveContentDialog = () => {
    setOpenApproveContentDialog(true)
  }

  const handleCloseApproveContentDialog = () => {
    fetcher(contents.page)
    setOpenApproveContentDialog(false)
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
        if (contentsSelection?.selected[0]?.id) {
          handleClickOpenViewDialog()
        }
      },
    },
    {
      id: 'audio',
      label: 'Audio',
      icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><SpeakerWaveIcon /></SvgIcon>,
      onClick: () => {
        if (contentsSelection?.selected[0]?.id) {
          handleClickOpenContentAudioDialog()
        }
      },
    },
    {
      id: 'schedule',
      label: 'Notification',
      icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><BellAlertIcon /></SvgIcon>,
      onClick: () => {
        if (contentsSelection?.selected[0]?.id) {
          handleClickOpenScheduleNotificationDialog()
        }
      },
    },
    {
      id: 'approve',
      label: 'Approve',
      icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><CheckBadgeIcon /></SvgIcon>,
      onClick: () => {
        if (contentsSelection?.selected[0]?.id) {
          handleClickOpenApproveContentDialog()
        }
      },
    },
    {
      id: "verification_history",
      label: "Verification History",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "text.primary" }}>
          <ViewColumnsIcon />
        </SvgIcon>
      ),
      onClick: () => {
        dispatch({
          type: "TOOGLE_PAYMENT_SIDENAV",
          payload: {
            ...verificationHistorySideNav,
            openViewContentVerificationHistorySideNav: true,
            contentVerificationHistory: contentsSelection.selected[0],
          },
        });
      },
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><PencilIcon /></SvgIcon>,
      onClick: () => {
        if (contentsSelection?.selected[0]?.id) {
          setAction(UPDATE)
          const author = authors.find(authorSelected => authorSelected.id === contentsSelection.selected[0].author_id);
          if (author !== undefined) {
            dispatch({
              type: "CONTENT_INFO",
              payload: {
                id: contentsSelection.selected[0].id,
                title: contentsSelection.selected[0].title,
                short_description: contentsSelection.selected[0].short_description,
                description: contentsSelection.selected[0].description,
                content_link: contentsSelection.selected[0].content_link,
                content_link_text: contentsSelection.selected[0].content_link_text,
                is_in_free_package: contentsSelection.selected[0].is_package_free,
                is_published: contentsSelection.selected[0].is_published,
                author_id: author.user_id,
                category_id: contentsSelection.selected[0].category_id,
                sub_category_id: contentsSelection.selected[0].sub_category_id,
                product_id: contentsSelection.selected[0].product_id,
                campaign_id: contentsSelection.selected[0].campaign_id,
                last_visible_cover_image: contentsSelection.selected[0].last_visible_cover_image,
                platform: contentsSelection.selected[0].platform,
                is_doctor: author.is_doctor,
              },
            })
          }
          handleClickOpenCreateDialog()
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
      {openCreateDialog &&
        <CreateContent
          open={openCreateDialog}
          handleClose={handleCloseCreateDialog}
          selected={contentsSelection.selected[0]}
          action={action}
          fetcher={fetcher}
          contents={contents}
        />
      }
      {openViewDialog &&
        <ViewContent
          open={openViewDialog}
          handleClose={handleCloseViewDialog}
          selected={contentsSelection.selected[0]}
          setIsDeleting={setIsDeleting}
          setSeverityMessage={setSeverityMessage}
          setSeverity={setSeverity}
          handleClickAlert={handleClickAlert}
          onSelectOne={contentsSelection.handleSelectOne}
        />
      }
      {openContentAudioDialog &&
        <FormDialog
          open={openContentAudioDialog}
          handleClose={handleCloseContentAudioDialog}
          dialogTitle={"Content Audio"}
          action={CREATE}
          fields={contentAudioFields}
          values={contentAudioValues}
          url={addContentAudioUrl}
        />
      }
      {openScheduleNotificationDialog &&
        <FormDialog
          open={openScheduleNotificationDialog}
          handleClose={handleCloseScheduleNotificationDialog}
          dialogTitle={"Notifications Schedule"}
          action={CREATE}
          fields={scheduleNotificationsFields}
          values={values}
          url={scheduleContentNotificationUrl}
        />
      }
      {openApproveContentDialog &&
        <FormDialog
          open={openApproveContentDialog}
          handleClose={handleCloseApproveContentDialog}
          dialogTitle={"Content"}
          action={"Approve"}
          fields={approveContentFields}
          values={[{
            content_id: contentsSelection?.selected[0]?.id,
            user_id: auth?.user?.id,
            approval: contentsSelection?.selected[0]?.approval,
            reason: "",
          }]}
          url={verifyContentUrl}
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
                Contents
              </Typography>
              <Box>
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
              </Box>
            </Stack>
            <Tabs
              onChange={handleTabChange}
              value={currentTab}
              variant='scrollable'
              scrollButtons="auto"
            >
              {contentsTypes.map((item, index) => {

                return (
                  <Tab
                    key={index}
                    label={item.label}
                    value={index}
                  />
                );
              })}
            </Tabs>
            <CustomSearch
              selectedFilterValue={selectedAuthor.label}
              popoverItems={authors}
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
              onSelectOne={contentsSelection.handleSelectOne}
              page={contents.page >= 1 ? contents.page - 1 : contents.page}
              rowsPerPage={rowsPerPage}
              selected={contentsSelection.selected}
              headCells={contentHeadCells}
              popoverItems={contentPopoverItems}
              isLoading={isLoading}
              switchFunction={publishUnpublishContent}
              isSubmitting={isSubmitting}
              pinUnpinFunction={pinUnpinContent}
              isPinning={isPinning}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Contents