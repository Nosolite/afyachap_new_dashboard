import React from 'react'
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from '../../hooks/use-selection';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { productCategoriesBannersHeadCells } from '../../seed/table-headers';
import { CREATE, UPDATE, filterItems } from '../../utils/constant';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { DeleteDialog } from '../../components/delete-dialog';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import { FormDialog } from '../../components/form-dialog';
import { productCategoriesBannersFields } from '../../seed/form-fields';
import { createProductsCategoriesBannerUrl, deleteProductsCategoriesBannerUrl, getAllProductsCategoriesUrl, getAllProductsCategoriesBannersByPaginationUrl, updateProductsCategoriesBannerUrl } from '../../seed/url';
import { getRequest, postRequest } from '../../services/api-service';
import { CustomAlert } from '../../components/custom-alert';

const useProductsSectionsIds = (banners) => {
    return React.useMemo(
        () => {
            return banners.map((customer) => customer.id);
        },
        [banners]
    );
};

function ProductCategoriesBanners() {
    const [action, setAction] = React.useState(CREATE)
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [productsCategories, setProductsCategories] = React.useState([]);
    const [formFields, setFormFields] = React.useState(productCategoriesBannersFields);
    const [productsSections, setProductsSections] = React.useState({
        page: 1,
        total_results: 0,
        total_pages: 0,
        results: []
    });
    const [searchTerm, setSearchTerm] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(true)
    const [isDeleting, setIsDeleting] = React.useState(false)
    const productsSectionsIds = useProductsSectionsIds(productsSections.results);
    const productsCategoriesBannersSelection = useSelection(productsSectionsIds);
    const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false)
    const [severity, setSeverity] = React.useState("")
    const [severityMessage, setSeverityMessage] = React.useState("")
    const values = [
        {
            id: action === UPDATE ? productsCategoriesBannersSelection.selected[0].id : 0,
            product_category_id: action === UPDATE ? productsCategoriesBannersSelection.selected[0].product_category_id : 0,
            image: action === UPDATE ? productsCategoriesBannersSelection.selected[0].product_image : null
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
                getAllProductsCategoriesBannersByPaginationUrl,
                {
                    "query": searchTerm,
                    "sort": orderBy + " " + order,
                    "limit": rowsPerPage,
                    "page": page
                },
                (data) => {
                    setProductsSections(data)
                    setIsLoading(false)
                },
                (error) => {
                    setProductsSections({
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

    React.useEffect(() => {
        getRequest(
            getAllProductsCategoriesUrl,
            (data) => {
                setProductsCategories(data);
            },
            (error) => { }
        )
    }, [])

    React.useEffect(() => {
        if (productsCategories.length > 0) {
            const newProductsCategories = productsCategories.map((category) => {
                const newItem = {};
                ["label", "value"].forEach((item) => {
                    if (item === "label") {
                        newItem[item] = category.product_category_name;
                    }
                    if (item === "value") {
                        newItem[item] = category.id;
                    }
                });
                return newItem;
            });
            let newFormFields = formFields;
            newFormFields[0].items = [{ value: 0, label: "No Category" }, ...newProductsCategories];
            setFormFields(newFormFields);
        }
    }, [productsCategories, formFields])

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
        action === UPDATE ? fetcher(productsSections.page) : fetcher(1)
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
            deleteProductsCategoriesBannerUrl,
            {
                id: productsCategoriesBannersSelection.selected[0].id,
            },
            (data) => {
                fetcher(productsSections.page)
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

    const productPopoverItems = [
        {
            id: 'edit',
            label: 'Edit',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><PencilIcon /></SvgIcon>,
            onClick: () => {
                if (productsCategoriesBannersSelection?.selected[0]?.id) {
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
                if (productsCategoriesBannersSelection?.selected[0]?.id) {
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
                    dialogTitle={"Product Category Banner"}
                    action={action}
                    fields={productCategoriesBannersFields}
                    values={values}
                    url={action === CREATE ? createProductsCategoriesBannerUrl : updateProductsCategoriesBannerUrl}
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
                                    Products Categories Banners
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
                            count={productsSections.total_results}
                            items={productsSections.results}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onSelectOne={productsCategoriesBannersSelection.handleSelectOne}
                            page={productsSections.page >= 1 ? productsSections.page - 1 : productsSections.page}
                            rowsPerPage={rowsPerPage}
                            selected={productsCategoriesBannersSelection.selected}
                            headCells={productCategoriesBannersHeadCells}
                            popoverItems={productPopoverItems}
                            isLoading={isLoading}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    )
}

export default ProductCategoriesBanners