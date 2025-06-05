import React from 'react'
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from '../../hooks/use-selection';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { ordersHeadCells } from '../../seed/table-headers';
import { filterItems, orderStatus } from '../../utils/constant';
import { postRequest } from '../../services/api-service';
import { getAllOrdersByPaginationUrl } from '../../seed/url';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import { useDispatch, useSelector } from 'react-redux';
import { Scrollbar } from '../../components/scrollbar';
import dayjs from 'dayjs';

const useProductsOrdersIds = (specializations) => {
    return React.useMemo(
        () => {
            return specializations.map((customer) => customer.id);
        },
        [specializations]
    );
};

function Orders() {
    const dispatch = useDispatch();
    const [currentTab, setCurrentTab] = React.useState(0);
    const orderSideNav = useSelector((state) => state.ViewPaymentSideNavReducer);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [productsOrders, setProductsOrders] = React.useState({
        page: 1,
        total_results: 0,
        total_pages: 0,
        results: []
    });
    const [searchTerm, setSearchTerm] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(true)
    const productsIds = useProductsOrdersIds(productsOrders.results);
    const productsOrdersSelection = useSelection(productsIds);
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
                getAllOrdersByPaginationUrl,
                {
                    "query": searchTerm,
                    "status": currentTab === 0 ?
                        "" :
                        currentTab === 1 ?
                            "ONLINE" :
                            currentTab === 2 ?
                                "DELIVERY" :
                                currentTab === 3 ?
                                    "RECEIVED" :
                                    currentTab === 4 ?
                                        "PROCESSING" :
                                        currentTab === 5 ?
                                            "DELIVERED" :
                                            "CANCELLED",
                    "from": dayjs('1970-01-01T00:00:00Z').format('YYYY-MM-DD HH:mm:ss.SSS'),
                    "to": dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss.SSS'),
                    "sort": orderBy + " " + order,
                    "limit": rowsPerPage,
                    "page": page
                },
                (data) => {
                    setProductsOrders(data)
                    setIsLoading(false)
                },
                (error) => {
                    setProductsOrders({
                        page: 1,
                        total_results: 0,
                        total_pages: 0,
                        results: [],
                    })
                    setIsLoading(false)
                },
            )
        },
        [rowsPerPage, searchTerm, currentTab, orderBy, order]
    );

    const handleSearch = (event) => {
        setSearchTerm(event.target.value)
    }

    React.useEffect(() => {
        fetcher(1)
    }, [fetcher])

    React.useEffect(() => {
        if (orderSideNav?.orderSideNavContent?.order_status) {
            if (orderSideNav?.orderSideNavContent?.order_status !== productsOrdersSelection?.selected[0]?.order_status ||
                orderSideNav?.orderSideNavContent?.payment_status !== productsOrdersSelection?.selected[0]?.payment_status) {
                fetcher(productsOrders.page)
                productsOrdersSelection.handleSelectOne(orderSideNav?.orderSideNavContent)
            }
        }
    }, [fetcher, orderSideNav, productsOrders, productsOrdersSelection])

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

    const orderPopoverItems = [
        {
            id: 'view',
            label: 'View',
            icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><EyeIcon /></SvgIcon>,
            onClick: () => {
                if (productsOrdersSelection?.selected[0]?.id) {
                    dispatch({
                        type: "TOOGLE_PAYMENT_SIDENAV",
                        payload: {
                            ...orderSideNav,
                            openViewOrderSideNav: true,
                            orderSideNavContent: productsOrdersSelection.selected[0]
                        },
                    });
                }
            },
        },
    ]

    return (
        <>
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
                                    Orders
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
                                {orderStatus.map((item, index) => {

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
                            count={productsOrders.total_results}
                            items={productsOrders.results}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onSelectOne={productsOrdersSelection.handleSelectOne}
                            page={productsOrders.page >= 1 ? productsOrders.page - 1 : productsOrders.page}
                            rowsPerPage={rowsPerPage}
                            selected={productsOrdersSelection.selected}
                            headCells={ordersHeadCells}
                            popoverItems={orderPopoverItems}
                            isLoading={isLoading}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    )
}

export default Orders