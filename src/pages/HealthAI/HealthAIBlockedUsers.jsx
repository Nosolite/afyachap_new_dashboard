import React from 'react'
import { Box, Container, Stack, SvgIcon, Typography } from '@mui/material'
import CheckCircleIcon from '@heroicons/react/24/outline/CheckCircleIcon'
import { useSelection } from '../../hooks/use-selection'
import { CustomTable } from '../../components/custom-table'
import { CustomSearch } from '../../components/custom-search'
import { healthAIBlockedUsersHeadCells } from '../../seed/table-headers'
import { filterItems } from '../../utils/constant'
import { authPostRequest } from '../../services/api-service'
import { healthAIBlockedUsersUrl, healthAIUnblockUserUrl } from '../../seed/url'
import { CustomAlert } from '../../components/custom-alert'

const useContentsIds = (contents) => {
  return React.useMemo(() => contents.map((item) => item.id), [contents])
}

function HealthAIBlockedUsers() {
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [contents, setContents] = React.useState({
    page: 1,
    total_results: 0,
    total_pages: 0,
    results: [],
  })
  const [searchTerm, setSearchTerm] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const contentsIds = useContentsIds(contents.results)
  const contentsSelection = useSelection(contentsIds)
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
        healthAIBlockedUsersUrl,
        {
          query: searchTerm,
          sort: `${orderBy} ${order}`,
          limit: rowsPerPage,
          page,
        },
        (data) => {
          setContents(data)
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

  const handleUnblock = () => {
    const selected = contentsSelection.selected[0]
    if (!selected?.user_id || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    authPostRequest(
      healthAIUnblockUserUrl,
      {
        user_id: selected.user_id,
      },
      (data) => {
        showAlert('success', data?.message || 'User unblocked successfully!')
        fetcher(contents.page)
        setIsSubmitting(false)
      },
      (error) => {
        showAlert(
          'error',
          error?.response?.data?.message?.[0] || 'Failed to unblock user'
        )
        setIsSubmitting(false)
      }
    )
  }

  const contentPopoverItems = [
    {
      id: 'unblock',
      label: 'Unblock user',
      icon: (
        <SvgIcon fontSize="small" sx={{ color: 'text.primary' }}>
          <CheckCircleIcon />
        </SvgIcon>
      ),
      onClick: () => {
        if (contentsSelection?.selected[0]?.user_id) {
          handleUnblock()
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
              <Typography variant="h4">Health AI Blocked Users</Typography>
              <Typography variant="body2" color="text.secondary">
                Users blocked from the Health AI chat feature.
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
              headCells={healthAIBlockedUsersHeadCells}
              popoverItems={contentPopoverItems}
              isLoading={isLoading}
              isSubmitting={isSubmitting}
            />
          </Stack>
        </Container>
      </Box>
    </>
  )
}

export default HealthAIBlockedUsers
