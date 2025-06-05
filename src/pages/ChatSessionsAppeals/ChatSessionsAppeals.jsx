import React from 'react'
import { Box, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from '../../hooks/use-selection';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { chatSessionsAppealsHeadCells } from '../../seed/table-headers';
import ChatBubbleBottomCenterTextIcon from '@heroicons/react/24/outline/ChatBubbleBottomCenterTextIcon';
import { filterItems } from '../../utils/constant';
import { getAllChatSessionsAppealsUrl, resolveChatSessionAppealUrl } from '../../seed/url';
import { postRequest } from '../../services/api-service';
import { FormDialog } from '../../components/form-dialog';
import { resolveChatsessionAppealFields } from '../../seed/form-fields';

const useContentsIds = (contents) => {
    return React.useMemo(
        () => {
            return contents.map((customer) => customer.id);
        },
        [contents]
    );
};

function ChatSessionsAppeals() {
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
    const [openResolveDialog, setOpenResolveDialog] = React.useState(false);
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
                getAllChatSessionsAppealsUrl,
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

    const handleClickOpenResolveDialog = () => {
        setOpenResolveDialog(true)
    }

    const handleCloseResolveDialog = () => {
        setOpenResolveDialog(false)
    }

    const contentPopoverItems = [
        {
            id: 'resolve',
            label: 'Resolve',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><ChatBubbleBottomCenterTextIcon /></SvgIcon>,
            onClick: () => {
                if (contentsSelection?.selected[0]?.ID) {
                    handleClickOpenResolveDialog()
                }
            },
        },
    ]

    return (
        <>
            {openResolveDialog &&
                <FormDialog
                    open={openResolveDialog}
                    handleClose={handleCloseResolveDialog}
                    dialogTitle={"Appeal"}
                    action={"Resolve"}
                    fields={resolveChatsessionAppealFields}
                    values={[{
                        chat_session_appeal_id: contentsSelection.selected[0].ID,
                        comment: "",
                        resume_chat: "",
                    }]}
                    url={resolveChatSessionAppealUrl}
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
                                    Chat Sessions Appeals
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
                            headCells={chatSessionsAppealsHeadCells}
                            popoverItems={contentPopoverItems}
                            isLoading={isLoading}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
}

export default ChatSessionsAppeals