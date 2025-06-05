import React from 'react'
import { Box, Button, Container, Dialog, DialogActions, DialogContent, IconButton, Stack, SvgIcon, Typography } from '@mui/material'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useSelection } from '../../hooks/use-selection';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { wardsHeadCells } from '../../seed/table-headers';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { DeleteDialog } from '../../components/delete-dialog';
import { CREATE, UPDATE, filterItems } from '../../utils/constant';
import { FormDialog } from '../../components/form-dialog';
import { wardsFields } from '../../seed/form-fields';
import { postRequest } from '../../services/api-service';
import { addWardUrl, deleteWardUrl, getAllWardsByPaginationUrl, updateWardUrl } from '../../seed/url';
import { CustomAlert } from '../../components/custom-alert';

const useSpecializationsIds = (specializations) => {
    return React.useMemo(
        () => {
            return specializations.map((customer) => customer.id);
        },
        [specializations]
    );
};

function ViewDistrict({ open, handleClose, selected }) {
    const [action, setAction] = React.useState(CREATE)
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [specializations, setSpecializations] = React.useState({
        page: 1,
        total_results: 0,
        total_pages: 0,
        results: []
    });
    const [searchTerm, setSearchTerm] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(true)
    const [isDeleting, setIsDeleting] = React.useState(false)
    const specializationsIds = useSpecializationsIds(specializations.results);
    const productsRatingsSelection = useSelection(specializationsIds);
    const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false)
    const [severity, setSeverity] = React.useState("")
    const [severityMessage, setSeverityMessage] = React.useState("")
    const values = [
        {
            id: action === UPDATE ? productsRatingsSelection.selected[0].id : 0,
            district_id: selected.id,
            ward_name: action === UPDATE ? productsRatingsSelection.selected[0].ward_name : "",
            shipping_cost: action === UPDATE ? productsRatingsSelection.selected[0].shipping_cost : ""
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
                getAllWardsByPaginationUrl,
                {
                    "query": searchTerm,
                    "region_id": selected.id,
                    "sort": orderBy + " " + order,
                    "limit": rowsPerPage,
                    "page": page
                },
                (data) => {
                    setSpecializations(data)
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
        [rowsPerPage, searchTerm, selected, orderBy, order]
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
        postRequest(
            deleteWardUrl,
            {
                id: productsRatingsSelection.selected[0].id,
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

    const contentPopoverItems = [
        {
            id: 'edit',
            label: 'Edit',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><PencilIcon /></SvgIcon>,
            onClick: () => {
                if (productsRatingsSelection?.selected[0]?.id) {
                    setAction(UPDATE)
                    handleClickOpenCreateDialog()
                }
            },
        },
        {
            id: 'delete',
            label: 'Delete',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><TrashIcon /></SvgIcon>,
            onClick: () => {
                if (productsRatingsSelection?.selected[0]?.id) {
                    handleClickOpenDeleteDialog()
                }
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
                            dialogTitle={"Ward"}
                            action={action}
                            fields={wardsFields}
                            values={values}
                            url={action === CREATE ? addWardUrl : updateWardUrl}
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
                                            Wards Of {selected.district_name}
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
                                    onSelectOne={productsRatingsSelection.handleSelectOne}
                                    page={specializations.page >= 1 ? specializations.page - 1 : specializations.page}
                                    rowsPerPage={rowsPerPage}
                                    selected={productsRatingsSelection.selected}
                                    headCells={wardsHeadCells}
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

export default ViewDistrict