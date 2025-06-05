import React from 'react'
import { Box, Button, Container, Dialog, DialogActions, DialogContent, IconButton, Stack, SvgIcon, Typography } from '@mui/material'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useSelection } from '../../hooks/use-selection';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { productBannersHeadCells } from '../../seed/table-headers';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { DeleteDialog } from '../../components/delete-dialog';
import { CREATE, UPDATE, filterItems } from '../../utils/constant';
import { FormDialog } from '../../components/form-dialog';
import { productBannersFields } from '../../seed/form-fields';
import { postRequest } from '../../services/api-service';
import { createProductsBannerUrl, deleteProductsBannerUrl, getAllProductsBannersByPaginationUrl, updateProductsBannerUrl } from '../../seed/url';
import { CustomAlert } from '../../components/custom-alert';

const useSpecializationsIds = (specializations) => {
    return React.useMemo(
        () => {
            return specializations.map((customer) => customer.id);
        },
        [specializations]
    );
};

function ViewProductCategoriesBanners({ open, handleClose, selected }) {
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
    const productCategoryBannerSelection = useSelection(specializationsIds);
    const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false)
    const [severity, setSeverity] = React.useState("")
    const [severityMessage, setSeverityMessage] = React.useState("")
    const values = [
        {
            id: action === UPDATE ? productCategoryBannerSelection.selected[0].id : 0,
            product_id: action === UPDATE ? productCategoryBannerSelection.selected[0].product_id : 0,
            product_category_id: selected.id,
            image: action === UPDATE ? productCategoryBannerSelection.selected[0].product_image : null
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
                getAllProductsBannersByPaginationUrl,
                {
                    "query": searchTerm,
                    "product_category_id": selected.id,
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
            deleteProductsBannerUrl,
            {
                id: productCategoryBannerSelection.selected[0].id,
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
                            dialogTitle={"Banner"}
                            action={action}
                            fields={productBannersFields}
                            values={values}
                            url={action === CREATE ? createProductsBannerUrl : updateProductsBannerUrl}
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
                                            Banners Of {selected.product_category_name}
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
                                    onSelectOne={productCategoryBannerSelection.handleSelectOne}
                                    page={specializations.page >= 1 ? specializations.page - 1 : specializations.page}
                                    rowsPerPage={rowsPerPage}
                                    selected={productCategoryBannerSelection.selected}
                                    headCells={productBannersHeadCells}
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

export default ViewProductCategoriesBanners