import React from 'react'
import { Box, Button, Container, Dialog, DialogActions, DialogContent, IconButton, Stack, SvgIcon, Typography } from '@mui/material'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useSelection } from '../../hooks/use-selection';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { campaignPackageHeadCells } from '../../seed/table-headers';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { DeleteDialog } from '../../components/delete-dialog';
import { CREATE, UPDATE, filterItems } from '../../utils/constant';
import { FormDialog } from '../../components/form-dialog';
import { campaignPackageFields } from '../../seed/form-fields';
import { webDeleteRequest, webGetRequest } from '../../services/api-service';
import { campaignPackageUrl, getCampaignPackagesUrl } from '../../seed/url';
import { CustomAlert } from '../../components/custom-alert';

const useSpecializationsIds = (specializations) => {
    return React.useMemo(
        () => {
            return specializations.map((customer) => customer.id);
        },
        [specializations]
    );
};

function ViewCampaign({ open, handleClose, selected }) {
    const [action, setAction] = React.useState(CREATE)
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [specializations, setSpecializations] = React.useState({
        page: 1,
        total_results: 0,
        total_pages: 0,
        results: []
    });
    const [, setSearchTerm] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(true)
    const [isDeleting, setIsDeleting] = React.useState(false)
    const specializationsIds = useSpecializationsIds(specializations.results);
    const contentCategorySelection = useSelection(specializationsIds);
    const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false)
    const [severity, setSeverity] = React.useState("")
    const [severityMessage, setSeverityMessage] = React.useState("")
    const values = [
        {
            afyachap_service_id: 1,
            campaign_id: selected.id,
            name: action === UPDATE ? contentCategorySelection.selected[0].name : "",
            amount: action === UPDATE ? contentCategorySelection.selected[0].amount : 0,
            active_days: action === UPDATE ? contentCategorySelection.selected[0].active_days : 0,
            status: action === UPDATE ? contentCategorySelection.selected[0].status : 0,
            apple_pay_product_id: "com.example.premium"
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
            webGetRequest(
                getCampaignPackagesUrl + "/" + selected.id,
                (data) => {
                    setSpecializations({
                        page: 1,
                        total_results: data.campaign.challenge_packages.length,
                        total_pages: 1,
                        results: data.campaign.challenge_packages,
                    })
                    setIsLoading(false)
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
        [selected]
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

    const handleClickOpenCreateDialog = () => {
        setOpenCreateDialog(true)
    }

    const handleCloseCreateDialog = () => {
        action === UPDATE ? fetcher(specializations.page) : fetcher(1)
        setOpenCreateDialog(false)
        setAction(CREATE)
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
        webDeleteRequest(
            campaignPackageUrl + "/" + contentCategorySelection.selected[0].id,
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

    const contentPopoverItems = [
        {
            id: 'edit',
            label: 'Edit',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><PencilIcon /></SvgIcon>,
            onClick: () => {
                setAction(UPDATE)
                handleClickOpenCreateDialog()
            },
        },
        {
            id: 'delete',
            label: 'Delete',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><TrashIcon /></SvgIcon>,
            onClick: () => {
                handleClickOpenDeleteDialog()
            },
        },
    ]

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            fullScreen
            PaperProps={{
                style: {
                    boxShadow: "none"
                },
            }}
        >
            <DialogActions>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="close"
                    onClick={() => {
                        handleClose()
                    }}
                >
                    <SvgIcon fontSize='large'>
                        <XMarkIcon />
                    </SvgIcon>
                </IconButton>
            </DialogActions>
            <DialogContent>
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
                            dialogTitle={"Campaign Package"}
                            action={action}
                            fields={campaignPackageFields}
                            values={values}
                            url={action === CREATE ? campaignPackageUrl :
                                campaignPackageUrl + "/" + contentCategorySelection.selected[0].id
                            }
                            isWebServerRequest={true}
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
                        <Container maxWidth="xl">
                            <Stack spacing={2}>
                                <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={4}
                                >
                                    <Stack spacing={1}>
                                        <Typography variant="h4">
                                            {selected.title}
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
                                    count={specializations.total_results}
                                    items={specializations.results}
                                    onPageChange={handlePageChange}
                                    onRowsPerPageChange={handleRowsPerPageChange}
                                    onSelectOne={contentCategorySelection.handleSelectOne}
                                    page={specializations.page >= 1 ? specializations.page - 1 : specializations.page}
                                    rowsPerPage={rowsPerPage}
                                    selected={contentCategorySelection.selected}
                                    headCells={campaignPackageHeadCells}
                                    popoverItems={contentPopoverItems}
                                    isLoading={isLoading}
                                />
                            </Stack>
                        </Container>
                    </Box>
                </>
            </DialogContent>
        </Dialog>
    )
}

export default ViewCampaign