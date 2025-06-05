import React from 'react'
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from '../../hooks/use-selection';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { datingUsersHeadCells } from '../../seed/table-headers';
import { datingUserStatusStatus, filterItems } from '../../utils/constant';
import { authPostRequest } from '../../services/api-service';
import { enableDiasbleDatingUserUrl, getAllRegisteredDatingUsersByPaginationUrl } from '../../seed/url';
import CameraIcon from '@heroicons/react/24/outline/CameraIcon';
import CheckBadgeIcon from '@heroicons/react/24/outline/CheckBadgeIcon';
import ViewUserPhotos from './ViewUserPhotos';
import { approveDatingUserFormFields } from '../../seed/form-fields';
import { FormDialog } from '../../components/form-dialog';
import { Scrollbar } from '../../components/scrollbar';

const useDatingUserIds = (datingUsers) => {
    return React.useMemo(
        () => {
            return datingUsers.map((customer) => customer.id);
        },
        [datingUsers]
    );
};

function DatingUsers() {
    const [currentTab, setCurrentTab] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [datingUsers, setDatingUsers] = React.useState({
        page: 1,
        total_results: 0,
        total_pages: 0,
        results: []
    });
    const [searchTerm, setSearchTerm] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(true)
    const datingUsersIds = useDatingUserIds(datingUsers.results);
    const datingUsersSelection = useSelection(datingUsersIds);
    const [openViewDatingUserImagesDialog, setOpenViewDatingUserImagesDialog] = React.useState(false);
    const [openApproveDialog, setOpenApproveDialog] = React.useState(false);
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
                getAllRegisteredDatingUsersByPaginationUrl,
                {
                    query: searchTerm,
                    status: currentTab === 0 ? "" : currentTab === 1 ? "ACTIVE" : currentTab === 2 ? "PENDING" : currentTab === 3 ? "DISABLED" : "IMAGE NOT VERIFIED",
                    platform: "WEB",
                    sort: orderBy + " " + order,
                    limit: rowsPerPage,
                    page: page
                },
                (data) => {
                    setDatingUsers(data)
                    setIsLoading(false)
                },
                (error) => {
                    setDatingUsers({
                        page: 1,
                        total_results: 0,
                        total_pages: 0,
                        results: [],
                    })
                    setIsLoading(false)
                },
            )
        },
        [rowsPerPage, searchTerm, orderBy, order, currentTab]
    );

    const handleSearch = (event) => {
        setSearchTerm(event.target.value)
    }

    const handleClickOpenViewProductMediaDialog = () => {
        setOpenViewDatingUserImagesDialog(true)
    }

    const handleCloseViewProductMediaDialog = () => {
        setOpenViewDatingUserImagesDialog(false)
    }

    const handleClickOpenApproveDatingUserDialog = () => {
        setOpenApproveDialog(true)
    }

    const handleCloseApproveDatingUserDialog = () => {
        fetcher(datingUsers.page)
        setOpenApproveDialog(false)
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

    const userPopoverItems = [
        {
            id: 'media',
            label: 'Media',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><CameraIcon /></SvgIcon>,
            onClick: () => {
                if (datingUsersSelection?.selected?.[0]?.id) {
                    handleClickOpenViewProductMediaDialog()
                }
            },
        },
        {
            id: 'authorize',
            label: 'Authorize',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><CheckBadgeIcon /></SvgIcon>,
            onClick: () => {
                if (datingUsersSelection?.selected[0]?.id) {
                    handleClickOpenApproveDatingUserDialog()
                }
            },
        },
    ];

    return (
        <>
            {openViewDatingUserImagesDialog &&
                <ViewUserPhotos
                    open={openViewDatingUserImagesDialog}
                    handleClose={handleCloseViewProductMediaDialog}
                    selected={datingUsersSelection.selected[0]}
                />
            }
            {openApproveDialog &&
                <FormDialog
                    open={openApproveDialog}
                    handleClose={handleCloseApproveDatingUserDialog}
                    dialogTitle={"Dating User"}
                    action={"Authorize"}
                    fields={approveDatingUserFormFields}
                    values={[{
                        user_id: datingUsersSelection?.selected[0]?.id,
                        status: datingUsersSelection?.selected[0]?.status,
                        disabled_reason: "",
                    }]}
                    url={enableDiasbleDatingUserUrl}
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
                                    Dating Users
                                </Typography>
                            </Stack>
                        </Stack>
                        <Scrollbar
                            sx={{
                                position: 'sticky',
                                top: 64,
                                zIndex: (theme) => theme.zIndex.appBar
                            }}
                        >
                            <Box
                                component="header"
                                sx={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    alignContent: "center",
                                    justifyContent: "space-between",
                                    backgroundColor: "neutral.100",
                                    borderRadius: "70px",
                                    height: 75,
                                    minWidth: 1000,
                                    transition: 'all 0.3 ease-in-out',
                                }}
                            >
                                {datingUserStatusStatus.map((item, index) => {

                                    return (
                                        <Button
                                            key={index}
                                            sx={{
                                                borderRadius: "70px",
                                                width: '100%',
                                                height: '100%',
                                                color: 'text.primary',
                                                '&:hover': {
                                                    backgroundColor: currentTab === index ? 'primary.main' : 'neutral.300)'
                                                },
                                                ...(currentTab === index && {
                                                    backgroundColor: "primary.main",
                                                    color: "neutral.100",
                                                }),
                                            }}
                                            onClick={() => setCurrentTab(index)}
                                        >
                                            {item.label}
                                        </Button>
                                    );
                                })}
                            </Box>
                        </Scrollbar>
                        <CustomSearch
                            popoverItems={filterItems}
                            handleSearch={handleSearch}
                        />
                        <CustomTable
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            count={datingUsers.total_results}
                            items={datingUsers.results}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onSelectOne={datingUsersSelection.handleSelectOne}
                            page={datingUsers.page >= 1 ? datingUsers.page - 1 : datingUsers.page}
                            rowsPerPage={rowsPerPage}
                            selected={datingUsersSelection.selected}
                            headCells={datingUsersHeadCells}
                            popoverItems={userPopoverItems}
                            isLoading={isLoading}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    );
}

export default DatingUsers