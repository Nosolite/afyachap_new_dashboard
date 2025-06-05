import React from 'react'
import { Box, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from '../../hooks/use-selection';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { consultationHeadCells } from '../../seed/table-headers';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import ArrowsRightLeftIcon from '@heroicons/react/24/outline/ArrowsRightLeftIcon';
import { filterItems } from '../../utils/constant';
import ViewConsultation from './ViewConsultation';
import { getAllChatSessionsUrl } from '../../seed/url';
import { postRequest } from '../../services/api-service';

const useContentsIds = (contents) => {
  return React.useMemo(
    () => {
      return contents.map((customer) => customer.id);
    },
    [contents]
  );
};

function Consultation() {
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [contents, setContents] = React.useState({
    page: 1,
    total_results: 0,
    total_pages: 0,
    results: []
  });
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)
  const contentsIds = useContentsIds(contents.results);
  const contentsSelection = useSelection(contentsIds);
  const [openViewDialog, setOpenViewDialog] = React.useState(false);
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
        getAllChatSessionsUrl,
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

  const handleClickOpenViewDialog = () => {
    setOpenViewDialog(true)
  }

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false)
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
      id: 'transfer',
      label: 'Transfer',
      icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><ArrowsRightLeftIcon /></SvgIcon>,
      onClick: () => {
        if (contentsSelection?.selected[0]?.id) {
          handleClickOpenViewDialog()
        }
      },
    },
  ]

  return (
    <>
      {openViewDialog &&
        <ViewConsultation
          open={openViewDialog}
          handleClose={handleCloseViewDialog}
          selected={contentsSelection.selected[0]}
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
                  Consultations
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
              count={contents.total_results}
              items={contents.results}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectOne={contentsSelection.handleSelectOne}
              page={contents.page >= 1 ? contents.page - 1 : contents.page}
              rowsPerPage={rowsPerPage}
              selected={contentsSelection.selected}
              headCells={consultationHeadCells}
              popoverItems={contentPopoverItems}
              isLoading={isLoading}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Consultation