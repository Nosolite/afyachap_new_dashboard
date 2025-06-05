import React from 'react';
import { Avatar, Box, Button, Chip, CircularProgress, Drawer, IconButton, SvgIcon, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { CustomPopOver } from '../../components/custom-popover';
import { usePopover } from '../../hooks/use-popover';
import { webGetRequest, postRequest } from '../../services/api-service';
import { getPaymentOrderStatusUrl, updateOrderPaymentStatusUrl, updateOrderStatusUrl } from '../../seed/url';
import { CustomAlert } from '../../components/custom-alert';

export const ViewOrderSideNav = (props) => {
    const { open, onClose } = props;
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSubmitting, setSubmitting] = React.useState(false);
    const orderStatusPopOver = usePopover();
    const paymentStatusPopOver = usePopover();
    const orderSideNav = useSelector((state) => state.ViewPaymentSideNavReducer);
    const [orderPaymentDetails, setOrderPaymentDetails] = React.useState({});
    const [openAlert, setOpenAlert] = React.useState(false)
    const [severity, setSeverity] = React.useState("")
    const [severityMessage, setSeverityMessage] = React.useState("")
    const orderStatusPopoverItems = [
        {
            id: 'processing',
            label: 'PROCESSING',
            onClick: () => {
                updateOrderStatus("PROCESSING");
            },
        },
        {
            id: 'delivered',
            label: 'DELIVERED',
            onClick: () => {
                updateOrderStatus("DELIVERED");
            },
        },
        {
            id: 'cancelled',
            label: 'CANCELLED',
            onClick: () => {
                updateOrderStatus("CANCELLED");
            },
        },
    ]
    const paymentStatusPopoverItems = [
        {
            id: 'completed',
            label: 'COMPLETED',
            onClick: () => {
                updateOrderPaymentStatus();
            },
        },
    ]

    const updateOrderStatus = (status) => {
        if (!isSubmitting) {
            postRequest(
                updateOrderStatusUrl,
                {
                    id: orderSideNav?.orderSideNavContent?.id,
                    status: status,
                },
                (data) => {
                    let newOrderSideNavContent = orderSideNav.orderSideNavContent
                    newOrderSideNavContent.order_status = status
                    dispatch({
                        type: "TOOGLE_PAYMENT_SIDENAV",
                        payload: {
                            ...orderSideNav,
                            openViewOrderSideNav: true,
                            orderSideNavContent: newOrderSideNavContent
                        },
                    });
                    setSeverityMessage(data.message)
                    setSeverity("success")
                    handleClickAlert()
                    setSubmitting(false)
                },
                (error) => {
                    if (error?.response?.data?.message) {
                        setSeverityMessage(error.response.data.message[0])
                        setSeverity("error")
                        handleClickAlert()
                    }
                    setSubmitting(false)
                },
            )
        }
    }

    const updateOrderPaymentStatus = () => {
        if (!isSubmitting) {
            postRequest(
                updateOrderPaymentStatusUrl,
                {
                    id: orderSideNav?.orderSideNavContent?.id,
                },
                (data) => {
                    let newOrderSideNavContent = orderSideNav.orderSideNavContent
                    newOrderSideNavContent.payment_status = "COMPLETED"
                    dispatch({
                        type: "TOOGLE_PAYMENT_SIDENAV",
                        payload: {
                            ...orderSideNav,
                            openViewOrderSideNav: true,
                            orderSideNavContent: newOrderSideNavContent
                        },
                    });
                    setSeverityMessage(data.message)
                    setSeverity("success")
                    handleClickAlert()
                    setSubmitting(false)
                },
                (error) => {
                    if (error?.response?.data?.message) {
                        setSeverityMessage(error.response.data.message[0])
                        setSeverity("error")
                        handleClickAlert()
                    }
                    setSubmitting(false)
                },
            )
        }
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

    React.useEffect(() => {
        if (orderSideNav?.orderSideNavContent?.payment_method === "ONLINE") {
            setIsLoading(true);
            webGetRequest(
                `${getPaymentOrderStatusUrl}${orderSideNav?.orderSideNavContent?.order_id}`,
                (data) => {
                    setOrderPaymentDetails(data);
                    setIsLoading(false);
                },
                (error) => {
                    setIsLoading(false);
                }
            );
        }
    }, [orderSideNav])

    return (
        <Drawer
            anchor='right'
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    backgroundColor: 'neutral.100',
                    width: 300
                }
            }}
        >
            {openAlert &&
                <CustomAlert
                    openAlert={openAlert}
                    handleCloseAlert={handleCloseAlert}
                    severity={severity}
                    severityMessage={severityMessage}
                />
            }
            {isLoading &&
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: "center",
                    height: "100%"
                }}>
                    <CircularProgress
                        sx={{
                            mx: 'auto',
                        }}
                    />
                </Box>
            }
            {!isLoading &&
                <Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            p: 2,
                            borderBottom: "2px solid grey",
                        }}
                    >
                        <Typography variant='h6'>Order Summary</Typography>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => {
                                onClose()
                            }}
                            aria-label="close"
                        >
                            <SvgIcon fontSize='small'>
                                <XMarkIcon />
                            </SvgIcon>
                        </IconButton>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            alignContent: "center",
                            flexDirection: "column"
                        }}
                    >
                        <Avatar
                            sx={{
                                cursor: 'pointer',
                                height: 70,
                                width: 70,
                                my: 2
                            }}
                            alt="User Profile"
                            src={orderSideNav?.orderSideNavContent?.profile_image}
                        />
                        <Typography variant='body1'>
                            {orderSideNav?.orderSideNavContent?.full_name}
                        </Typography>
                    </Box>
                    <Table
                        sx={{
                            '& th, & td': {
                                borderBottom: 'none',
                            },
                        }}
                    >
                        <TableBody>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>ORDER ID:</TableCell>
                                <TableCell>
                                    {orderSideNav?.orderSideNavContent?.order_id}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Phone Number:</TableCell>
                                <TableCell>
                                    {orderSideNav?.orderSideNavContent?.phone_number}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Location:</TableCell>
                                <TableCell>
                                    {orderSideNav?.orderSideNavContent?.region}, {orderSideNav?.orderSideNavContent?.district}, {orderSideNav?.orderSideNavContent?.street}.
                                </TableCell>
                            </TableRow>
                            {orderSideNav?.orderSideNavContent?.products?.map((item, index) => {
                                return (
                                    <TableRow key={index}>
                                        <TableCell sx={{ fontWeight: "bold" }}>{item.product_name} ({item.product_quantity})</TableCell>
                                        <TableCell>{item.product_amount}</TableCell>
                                    </TableRow>
                                )
                            })}
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Total Cost:</TableCell>
                                <TableCell>
                                    {orderSideNav?.orderSideNavContent?.product_amount}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Shipping Cost:</TableCell>
                                <TableCell>
                                    {orderSideNav?.orderSideNavContent?.shipping_cost}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Payment Method:</TableCell>
                                <TableCell>
                                    {orderSideNav?.orderSideNavContent?.payment_method}
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Order Status:</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={(event) => {
                                            orderSideNav?.orderSideNavContent?.order_status !== "DELIVERED" &&
                                                orderStatusPopOver.handleOpen(event)
                                        }}
                                    >
                                        <Chip
                                            color={orderSideNav?.orderSideNavContent?.order_status === "DELIVERED" ? 'success' : 'warning'}
                                            label={orderSideNav?.orderSideNavContent?.order_status}
                                            sx={{
                                                width: 110,
                                            }}
                                        />
                                    </Button>
                                    <CustomPopOver
                                        id={orderStatusPopOver.id}
                                        anchorEl={orderStatusPopOver.anchorRef}
                                        open={orderStatusPopOver.open}
                                        onClose={orderStatusPopOver.handleClose}
                                        popoverItems={orderStatusPopoverItems}
                                    />
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold" }}>Payment Status:</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={(event) => {
                                            (
                                                (orderSideNav?.orderSideNavContent?.payment_method === "DELIVERY" &&
                                                    orderSideNav?.orderSideNavContent?.payment_status === "PENDING"
                                                ) ||
                                                (orderSideNav?.orderSideNavContent?.payment_method === "ONLINE" &&
                                                    orderSideNav?.orderSideNavContent?.payment_status === "PENDING" &&
                                                    orderPaymentDetails?.data[0]?.payment_status === "COMPLETED"
                                                )
                                            ) &&
                                                paymentStatusPopOver.handleOpen(event)
                                        }}
                                    >
                                        <Chip
                                            color={orderSideNav?.orderSideNavContent?.payment_status === "COMPLETED" ? 'success' : 'warning'}
                                            label={orderSideNav?.orderSideNavContent?.payment_status}
                                            sx={{
                                                width: 110,
                                            }}
                                        />
                                    </Button>
                                    <CustomPopOver
                                        id={paymentStatusPopOver.id}
                                        anchorEl={paymentStatusPopOver.anchorRef}
                                        open={paymentStatusPopOver.open}
                                        onClose={paymentStatusPopOver.handleClose}
                                        popoverItems={paymentStatusPopoverItems}
                                    />
                                </TableCell>
                            </TableRow>
                            {orderSideNav?.orderSideNavContent?.payment_method === "ONLINE" &&
                                orderPaymentDetails?.data &&
                                <TableRow>
                                    <TableCell sx={{ fontWeight: "bold" }}>Selcom Status:</TableCell>
                                    <TableCell>
                                        <Button>
                                            <Chip
                                                color={orderPaymentDetails?.data[0]?.payment_status === "COMPLETED" ? 'success' : 'warning'}
                                                label={orderPaymentDetails?.data[0]?.payment_status}
                                                sx={{
                                                    width: 110,
                                                }}
                                            />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </Box>
            }
        </Drawer >
    );

};

ViewOrderSideNav.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool
};