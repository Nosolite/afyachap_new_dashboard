import React from 'react'
import { Box, Container, Stack, SvgIcon, Typography } from '@mui/material'
import EyeIcon from '@heroicons/react/24/outline/EyeIcon'
import NoSymbolIcon from '@heroicons/react/24/outline/NoSymbolIcon'
import { useSelection } from '../../hooks/use-selection'
import { CustomTable } from '../../components/custom-table'
import { CustomSearch } from '../../components/custom-search'
import { healthAIMessagesHeadCells } from '../../seed/table-headers'
import { filterItems } from '../../utils/constant'
import { authPostRequest } from '../../services/api-service'
import { healthAIAdminMessagesUrl } from '../../seed/url'
import { CustomAlert } from '../../components/custom-alert'
import ViewUserThread from './ViewUserThread'
import BlockUserDialog from './BlockUserDialog'

const useContentsIds = (contents) => {
  return React.useMemo(() => contents.map((item) => item.id), [contents])
}

const truncate = (value, max = 80) => {
  const text = String(value || '')
  if (text.length <= max) {
    return text
  }
  return `${text.slice(0, max)}...`
}

function HealthAIMessages() {
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [contents, setContents] = React.useState({
    page: 1,
    total_results: 0,
    total_pages: 0,
    results: [],
  })
  const [searchTerm, setSearchTerm] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(true)
  const contentsIds = useContentsIds(contents.results)
  const contentsSelection = useSelection(contentsIds)
  const [openViewDialog, setOpenViewDialog] = React.useState(false)
  const [openBlockDialog, setOpenBlockDialog] = React.useState(false)
  const [openAlert, setOpenAlert] = React.useState(false)
  const [severity, setSeverity] = React.useState('success')
  const [severityMessage, setSeverityMessage] = React.useState('')
  const [order, setOrder] = React.useState('desc')
  const [orderBy, setOrderBy] = React.useState('t1.id')

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const fetcher = React.useCallback(
    (page) => {
      setIsLoading(true)
      authPostRequest(
        healthAIAdminMessagesUrl,
        {
          query: searchTerm,
          sort: `${orderBy} ${order}`,
          limit: rowsPerPage,
          page,
        },
        (data) => {
          const results = Array.isArray(data?.results)
            ? data.results.map((item) => ({
                ...item,
                content_preview: truncate(item.content),
              }))
            : []
          setContents({
            ...data,
            results,
          })
          setIsLoading(false)
        },
        () => {
          setContents({
            page: 1,
            total_results: 0,
            total_pages: 0,
            results: [],
          })
          setIsLoading(false)
        }
      )
    },
    [rowsPerPage, searchTerm, orderBy, order]
  )

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
  )

  const handleRowsPerPageChange = React.useCallback((event) => {
    setRowsPerPage(event.target.value)
  }, [])

  const showAlert = (nextSeverity, message) => {
    setSeverity(nextSeverity)
    setSeverityMessage(message)
    setOpenAlert(true)
  }

  const contentPopoverItems = [
    {
      id: 'view',
      label: 'View thread',
      icon: (
        <SvgIcon fontSize="small" sx={{ color: 'text.primary' }}>
          <EyeIcon />
        </SvgIcon>
      ),
      onClick: () => {
        if (contentsSelection?.selected[0]?.user_id) {
          setOpenViewDialog(true)
        }
      },
    },
    {
      id: 'block',
      label: 'Block user',
      icon: (
        <SvgIcon fontSize="small" sx={{ color: 'text.primary' }}>
          <NoSymbolIcon />
        </SvgIcon>
      ),
      onClick: () => {
        if (contentsSelection?.selected[0]?.user_id) {
          setOpenBlockDialog(true)
        }
      },
    },
  ]

  return (
    <>
      {openAlert && (
        <CustomAlert
          openAlert={openAlert}
          handleCloseAlert={() => setOpenAlert(false)}
          severity={severity}
          severityMessage={severityMessage}
        />
      )}
      {openViewDialog && (
        <ViewUserThread
          open={openViewDialog}
          handleClose={() => setOpenViewDialog(false)}
          selected={contentsSelection.selected[0]}
        />
      )}
      {openBlockDialog && (
        <BlockUserDialog
          open={openBlockDialog}
          handleClose={() => setOpenBlockDialog(false)}
          selected={contentsSelection.selected[0]}
          onBlocked={(message) => showAlert('success', message)}
          onError={(message) => showAlert('error', message)}
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
            <Stack spacing={1}>
              <Typography variant="h4">Health AI Messages</Typography>
              <Typography variant="body2" color="text.secondary">
                Single continuous thread per user. Open a thread or block a user from AI chat.
              </Typography>
            </Stack>
            <CustomSearch popoverItems={filterItems} handleSearch={handleSearch} />
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
              headCells={healthAIMessagesHeadCells}
              popoverItems={contentPopoverItems}
              isLoading={isLoading}
            />
          </Stack>
        </Container>
      </Box>
    </>
  )
}

export default HealthAIMessages
