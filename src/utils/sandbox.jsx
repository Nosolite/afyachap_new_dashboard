import React from 'react'
import { Box, Button, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from '../../hooks/use-selection';
import { applyPagination } from '../../utils/apply-pagination';
import { CustomTable } from '../../components/custom-table';
import { CustomSearch } from '../../components/custom-search';
import { ordersHeadCells } from '../../seed/table-headers';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import { filterItems, orderStatus } from '../../utils/constant';
import { ordersData } from '../../seed/data';
import { useDispatch, useSelector } from 'react-redux';
import { Scrollbar } from '../../components/scrollbar';

const useOrders = (page, rowsPerPage) => {
    return React.useMemo(
        () => {
            return applyPagination(ordersData, page, rowsPerPage);
        },
        [page, rowsPerPage]
    );
};

const useOrdersIds = (orders) => {
    return React.useMemo(
        () => {
            return orders.map((customer) => customer.id);
        },
        [orders]
    );
};

function Orders() {
    const dispatch = useDispatch();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const orders = useOrders(page, rowsPerPage);
    const ordersIds = useOrdersIds(orders);
    const ordersSelection = useSelection(ordersIds);
    const [active, setActive] = React.useState(0);
    const orderSideNav = useSelector((state) => state.ViewPaymentSideNavReducer);

    const handlePageChange = React.useCallback(
        (event, value) => {
            setPage(value);
        },
        []
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
                dispatch({
                    type: "TOOGLE_PAYMENT_SIDENAV",
                    payload: {
                        ...orderSideNav,
                        openViewOrderSideNav: true,
                        orderSideNavContent: ordersSelection.selected[0]
                    },
                });
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
                                                    backgroundColor: active === index ? 'primary.main' : 'neutral.300)'
                                                },
                                                ...(active === index && {
                                                    backgroundColor: "primary.main",
                                                    color: "neutral.100",
                                                }),
                                            }}
                                            onClick={() => setActive(index)}
                                        >
                                            {item.label}
                                        </Button>
                                    );
                                })}
                            </Box>
                        </Scrollbar>
                        <CustomSearch
                            popoverItems={filterItems}
                        />
                        <CustomTable
                            count={ordersData.length}
                            items={orders}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                            onSelectOne={ordersSelection.handleSelectOne}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            selected={ordersSelection.selected}
                            headCells={ordersHeadCells}
                            popoverItems={orderPopoverItems}
                        />
                    </Stack>
                </Container>
            </Box>
        </>
    )
}

export default Orders