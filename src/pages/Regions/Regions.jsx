import React from 'react'
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from '../../hooks/use-selection';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { regionsHeadCells } from '../../seed/table-headers';
import MapPinIcon from '@heroicons/react/24/outline/MapPinIcon';
import { CREATE, UPDATE, filterItems } from '../../utils/constant';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { DeleteDialog } from '../../components/delete-dialog';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import { FormDialog } from '../../components/form-dialog';
import { regionsFields } from '../../seed/form-fields';
import { postRequest } from '../../services/api-service';
import { addRegionUrl, deleteRegionUrl, getAllRegionssByPaginationUrl, updateRegionUrl } from '../../seed/url';
import { CustomAlert } from '../../components/custom-alert';
import ViewRegion from './ViewRegion';

const useProductsIds = (specializations) => {
    return React.useMemo(
        () => {
            return specializations.map((customer) => customer.id);
        },
        [specializations]
    );
};

function Regions() {
    const [action, setAction] = React.useState(CREATE)
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [products, setProducts] = React.useState({
        page: 1,
        total_results: 0,
        total_pages: 0,
        results: []
    });
    const [searchTerm, setSearchTerm] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(true)
    const [isDeleting, setIsDeleting] = React.useState(false)
    const productsIds = useProductsIds(products.results);
    const regionsSelection = useSelection(productsIds);
    const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
    const [openViewDistrictsDialog, setOpenViewDistrictsDialog] = React.useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false)
    const [severity, setSeverity] = React.useState("")
    const [severityMessage, setSeverityMessage] = React.useState("")
    const values = [
        {
            id: action === UPDATE ? regionsSelection.selected[0].id : 0,
            region_name: action === UPDATE ? regionsSelection.selected[0].region_name : ""
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
                getAllRegionssByPaginationUrl,
                {
                    "query": searchTerm,
                    "sort": orderBy + " " + order,
                    "limit": rowsPerPage,
                    "page": page
                },
                (data) => {
                    setProducts(data)
                    setIsLoading(false)
                },
                (error) => {
                    setProducts({
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

    const handleClickOpenCreateDialog = () => {
        setOpenCreateDialog(true)
    }

    const handleCloseCreateDialog = () => {
        action === UPDATE ? fetcher(products.page) : fetcher(1)
        setOpenCreateDialog(false)
        setAction(CREATE)
    }

    const handleClickOpenViewProductRatingsDialog = () => {
        setOpenViewDistrictsDialog(true)
    }

    const handleCloseViewProductRatingsDialog = () => {
        setOpenViewDistrictsDialog(false)
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
            deleteRegionUrl,
            {
                id: regionsSelection.selected[0].id,
            },
            (data) => {
                fetcher(products.page)
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

    const productsPopoverItems = [
        {
            id: 'districts',
            label: 'Districts',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><MapPinIcon /></SvgIcon>,
            onClick: () => {
                if (regionsSelection?.selected[0]?.id) {
                    handleClickOpenViewProductRatingsDialog()
                }
            },
        },
        {
            id: 'edit',
            label: 'Edit',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><PencilIcon /></SvgIcon>,
            onClick: () => {
                if (regionsSelection?.selected[0]?.id) {
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
                if (regionsSelection?.selected[0]?.id) {
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
                    dialogTitle={"Region"}
                    action={action}
                    fields={regionsFields}
                    values={values}
                    url={action === CREATE ? addRegionUrl : updateRegionUrl}
                />
            }
            {openViewDistrictsDialog &&
                <ViewRegion
                    open={openViewDistrictsDialog}
                    handleClose={handleCloseViewProductRatingsDialog}
                    selected={regionsSelection.selected[0]}
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
                            spacing={4}
                        >
                            <Stack spacing={1}>
                                <Typography variant="h4">
                                    Regions
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
                            count={products.total_results}
                            items={products.results}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onSelectOne={regionsSelection.handleSelectOne}
                            page={products.page >= 1 ? products.page - 1 : products.page}
                            rowsPerPage={rowsPerPage}
                            selected={regionsSelection.selected}
                            headCells={regionsHeadCells}
                            popoverItems={productsPopoverItems}
                            isLoading={isLoading}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    )
}

export default Regions