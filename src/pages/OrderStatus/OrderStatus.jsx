import React from 'react'
import { Box, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from '../../hooks/use-selection';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { productOrderStatusHeadCells } from '../../seed/table-headers';
import { CREATE, UPDATE, filterItems } from '../../utils/constant';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import { FormDialog } from '../../components/form-dialog';
import { productsOrderStatusFormFields } from '../../seed/form-fields';
import { getProductsOrderStatusByPaginationUrl, updateProductsOrderStatusUrl } from '../../seed/url';
import { postRequest } from '../../services/api-service';

const useProductsCategoriesIds = (specializations) => {
    return React.useMemo(
        () => {
            return specializations.map((customer) => customer.id);
        },
        [specializations]
    );
};

function OrderStatus() {
    const [action, setAction] = React.useState(CREATE)
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [productsCategories, setProductsCategories] = React.useState({
        page: 1,
        total_results: 0,
        total_pages: 0,
        results: []
    });
    const [searchTerm, setSearchTerm] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(true)
    const productsCategoriesIds = useProductsCategoriesIds(productsCategories.results);
    const productCategoriesSelection = useSelection(productsCategoriesIds);
    const [openCreateDialog, setOpenCreateDialog] = React.useState(false);
    const values = [
        {
            id: action === UPDATE ? productCategoriesSelection.selected[0].id : 0,
            name: action === UPDATE ? productCategoriesSelection.selected[0].name : "",
            description: action === UPDATE ? productCategoriesSelection.selected[0].description : "",
            image: action === UPDATE ? productCategoriesSelection.selected[0].image : null
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
                getProductsOrderStatusByPaginationUrl,
                {
                    "query": searchTerm,
                    "sort": orderBy + " " + order,
                    "limit": rowsPerPage,
                    "page": page
                },
                (data) => {
                    setProductsCategories(data)
                    setIsLoading(false)
                },
                (error) => {
                    setProductsCategories({
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
        action === UPDATE ? fetcher(productsCategories.page) : fetcher(1)
        setOpenCreateDialog(false)
        setAction(CREATE)
    }

    const productPopoverItems = [
        {
            id: 'edit',
            label: 'Edit',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><PencilIcon /></SvgIcon>,
            onClick: () => {
                if (productCategoriesSelection?.selected[0]?.id) {
                    setAction(UPDATE)
                    handleClickOpenCreateDialog()
                }
            },
        },
    ]

    return (
        <>
            {openCreateDialog &&
                <FormDialog
                    open={openCreateDialog}
                    handleClose={handleCloseCreateDialog}
                    dialogTitle={"Product Category"}
                    action={action}
                    fields={productsOrderStatusFormFields}
                    values={values}
                    url={updateProductsOrderStatusUrl}
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
                                    Order Status
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
                            count={productsCategories.total_results}
                            items={productsCategories.results}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onSelectOne={productCategoriesSelection.handleSelectOne}
                            page={productsCategories.page >= 1 ? productsCategories.page - 1 : productsCategories.page}
                            rowsPerPage={rowsPerPage}
                            selected={productCategoriesSelection.selected}
                            headCells={productOrderStatusHeadCells}
                            popoverItems={productPopoverItems}
                            isLoading={isLoading}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    )
}

export default OrderStatus