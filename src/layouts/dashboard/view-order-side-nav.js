import React from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Drawer,
  IconButton,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { CustomPopOver } from "../../components/custom-popover";
import { usePopover } from "../../hooks/use-popover";
import { webGetRequest, postRequest } from "../../services/api-service";
import {
  getPaymentOrderStatusUrl,
  updateOrderPaymentStatusUrl,
  updateOrderStatusUrl,
  getUserTransactionDetailsUrl,
} from "../../seed/url";
import { CustomAlert } from "../../components/custom-alert";

export const ViewOrderSideNav = (props) => {
  const { open, onClose } = props;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitting, setSubmitting] = React.useState(false);
  const orderStatusPopOver = usePopover();
  const paymentStatusPopOver = usePopover();
  const orderSideNav = useSelector((state) => state.ViewPaymentSideNavReducer);
  const [orderPaymentDetails, setOrderPaymentDetails] = React.useState({});
  const lastFetchedOrderIdRef = React.useRef(null);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [severity, setSeverity] = React.useState("");
  const [severityMessage, setSeverityMessage] = React.useState("");
  const orderStatusPopoverItems = [
    {
      id: "processing",
      label: "PROCESSING",
      onClick: () => {
        updateOrderStatus("PROCESSING");
      },
    },
    {
      id: "delivered",
      label: "DELIVERED",
      onClick: () => {
        updateOrderStatus("DELIVERED");
      },
    },
    {
      id: "cancelled",
      label: "CANCELLED",
      onClick: () => {
        updateOrderStatus("CANCELLED");
      },
    },
  ];
  const paymentStatusPopoverItems = [
    {
      id: "completed",
      label: "COMPLETED",
      onClick: () => {
        updateOrderPaymentStatus();
      },
    },
  ];

  const updateOrderStatus = (status) => {
    if (!isSubmitting) {
      postRequest(
        updateOrderStatusUrl,
        {
          id: orderSideNav?.orderSideNavContent?.id,
          status: status,
        },
        (data) => {
          let newOrderSideNavContent = orderSideNav.orderSideNavContent;
          newOrderSideNavContent.order_status = status;
          dispatch({
            type: "TOOGLE_PAYMENT_SIDENAV",
            payload: {
              ...orderSideNav,
              openViewOrderSideNav: true,
              orderSideNavContent: newOrderSideNavContent,
            },
          });
          setSeverityMessage(data.message);
          setSeverity("success");
          handleClickAlert();
          setSubmitting(false);
        },
        (error) => {
          if (error?.response?.data?.message) {
            setSeverityMessage(error.response.data.message[0]);
            setSeverity("error");
            handleClickAlert();
          }
          setSubmitting(false);
        }
      );
    }
  };

  const updateOrderPaymentStatus = () => {
    if (!isSubmitting) {
      postRequest(
        updateOrderPaymentStatusUrl,
        {
          id: orderSideNav?.orderSideNavContent?.id,
        },
        (data) => {
          let newOrderSideNavContent = orderSideNav.orderSideNavContent;
          newOrderSideNavContent.payment_status = "COMPLETED";
          dispatch({
            type: "TOOGLE_PAYMENT_SIDENAV",
            payload: {
              ...orderSideNav,
              openViewOrderSideNav: true,
              orderSideNavContent: newOrderSideNavContent,
            },
          });
          setSeverityMessage(data.message);
          setSeverity("success");
          handleClickAlert();
          setSubmitting(false);
        },
        (error) => {
          if (error?.response?.data?.message) {
            setSeverityMessage(error.response.data.message[0]);
            setSeverity("error");
            handleClickAlert();
          }
          setSubmitting(false);
        }
      );
    }
  };

  const handleClickAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenAlert(false);
  };

  React.useEffect(() => {
    const orderId = orderSideNav?.orderSideNavContent?.order_id;
    const paymentMethod = orderSideNav?.orderSideNavContent?.payment_method;

    if (paymentMethod === "ONLINE" && orderId) {
      // Prevent re-fetch loop for the same order id
      if (
        lastFetchedOrderIdRef.current === orderId &&
        orderPaymentDetails?.afyachap_data
      ) {
        return;
      }
      lastFetchedOrderIdRef.current = orderId;
      setIsLoading(true);
      webGetRequest(
        `${getUserTransactionDetailsUrl}${orderId}`,
        (response) => {
          const data = response?.data || response;
          setOrderPaymentDetails(data || {});
          setIsLoading(false);
        },
        (error) => {
          console.error("Error fetching transaction details:", error);
          setOrderPaymentDetails({});
          setIsLoading(false);
        }
      );
    }
  }, [
    orderSideNav?.orderSideNavContent?.order_id,
    orderSideNav?.orderSideNavContent?.payment_method,
  ]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "neutral.100",
          width: 300,
        },
      }}
    >
      {openAlert && (
        <CustomAlert
          openAlert={openAlert}
          handleCloseAlert={handleCloseAlert}
          severity={severity}
          severityMessage={severityMessage}
        />
      )}
      {isLoading && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <CircularProgress
            sx={{
              mx: "auto",
            }}
          />
        </Box>
      )}
      {!isLoading && (
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
            <Typography variant="h6">Order Summary</Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                onClose();
              }}
              aria-label="close"
            >
              <SvgIcon fontSize="small">
                <XMarkIcon />
              </SvgIcon>
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              alignContent: "center",
              flexDirection: "column",
            }}
          >
            <Avatar
              sx={{
                cursor: "pointer",
                height: 70,
                width: 70,
                my: 2,
              }}
              alt="User Profile"
              src={orderSideNav?.orderSideNavContent?.profile_image}
            />
            <Typography variant="body1">
              {orderSideNav?.orderSideNavContent?.full_name}
            </Typography>
          </Box>
          <Table
            sx={{
              "& th, & td": {
                borderBottom: "none",
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
                  {orderSideNav?.orderSideNavContent?.region},{" "}
                  {orderSideNav?.orderSideNavContent?.district},{" "}
                  {orderSideNav?.orderSideNavContent?.street}.
                </TableCell>
              </TableRow>
              {orderSideNav?.orderSideNavContent?.products?.map(
                (item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell sx={{ fontWeight: "bold" }}>
                        {item.product_name} ({item.product_quantity})
                      </TableCell>
                      <TableCell>{item.product_amount}</TableCell>
                    </TableRow>
                  );
                }
              )}
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Total Cost:</TableCell>
                <TableCell>
                  {orderSideNav?.orderSideNavContent?.product_amount}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Shipping Cost:
                </TableCell>
                <TableCell>
                  {orderSideNav?.orderSideNavContent?.shipping_cost}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Payment Method:
                </TableCell>
                <TableCell>
                  {orderSideNav?.orderSideNavContent?.payment_method}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Order Status:</TableCell>
                <TableCell>
                  <Button
                    onClick={(event) => {
                      orderSideNav?.orderSideNavContent?.order_status !==
                        "DELIVERED" && orderStatusPopOver.handleOpen(event);
                    }}
                  >
                    <Chip
                      color={
                        orderSideNav?.orderSideNavContent?.order_status ===
                        "DELIVERED"
                          ? "success"
                          : "warning"
                      }
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
                <TableCell sx={{ fontWeight: "bold" }}>
                  Payment Status:
                </TableCell>
                <TableCell>
                  <Button
                    onClick={(event) => {
                      ((orderSideNav?.orderSideNavContent?.payment_method ===
                        "DELIVERY" &&
                        orderSideNav?.orderSideNavContent?.payment_status ===
                          "PENDING") ||
                        (orderSideNav?.orderSideNavContent?.payment_method ===
                          "ONLINE" &&
                          orderSideNav?.orderSideNavContent?.payment_status ===
                            "PENDING" &&
                          orderPaymentDetails?.selcom_data?.data?.[0]
                            ?.payment_status === "COMPLETED")) &&
                        paymentStatusPopOver.handleOpen(event);
                    }}
                  >
                    <Chip
                      color={
                        orderSideNav?.orderSideNavContent?.payment_status ===
                        "COMPLETED"
                          ? "success"
                          : "warning"
                      }
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
                orderPaymentDetails?.selcom_data && (
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Selcom Status:
                    </TableCell>
                    <TableCell>
                      <Button>
                        <Chip
                          color={
                            orderPaymentDetails?.selcom_data?.data?.[0]
                              ?.payment_status === "COMPLETED"
                              ? "success"
                              : "warning"
                          }
                          label={
                            orderPaymentDetails?.selcom_data?.data?.[0]
                              ?.payment_status ||
                            orderPaymentDetails?.selcom_data?.result
                          }
                          sx={{
                            width: 110,
                          }}
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                )}

              {/* Afyachap Transaction Details */}
              {orderPaymentDetails?.afyachap_data && (
                <>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Service Type:
                    </TableCell>
                    <TableCell>
                      {orderPaymentDetails?.afyachap_data?.service_name}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Package Type:
                    </TableCell>
                    <TableCell>
                      {orderPaymentDetails?.afyachap_data?.package_type}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Amount:</TableCell>
                    <TableCell>
                      {orderPaymentDetails?.afyachap_data?.amount} TZS
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Payment No:
                    </TableCell>
                    <TableCell>
                      {orderPaymentDetails?.afyachap_data?.payment_no}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Transaction Date:
                    </TableCell>
                    <TableCell>
                      {orderPaymentDetails?.afyachap_data?.date}
                    </TableCell>
                  </TableRow>
                </>
              )}

              {/* Selcom Payment Details */}
              {orderPaymentDetails?.selcom_data && (
                <>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Selcom Reference:
                    </TableCell>
                    <TableCell>
                      {orderPaymentDetails?.selcom_data?.reference}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Selcom Result:
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={
                          orderPaymentDetails?.selcom_data?.resultcode === "000"
                            ? "success"
                            : "error"
                        }
                        label={orderPaymentDetails?.selcom_data?.result}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Selcom Message:
                    </TableCell>
                    <TableCell>
                      {orderPaymentDetails?.selcom_data?.message}
                    </TableCell>
                  </TableRow>
                </>
              )}

              {/* User Details */}
              {orderPaymentDetails?.user_details && (
                <>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>User ID:</TableCell>
                    <TableCell>
                      {orderPaymentDetails?.user_details?.id}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Full Name:
                    </TableCell>
                    <TableCell>
                      {orderPaymentDetails?.user_details?.firstName}{" "}
                      {orderPaymentDetails?.user_details?.secondName}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Phone:</TableCell>
                    <TableCell>
                      {orderPaymentDetails?.user_details?.phoneNumber}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Email:</TableCell>
                    <TableCell>
                      {orderPaymentDetails?.user_details?.email}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>Gender:</TableCell>
                    <TableCell>
                      {orderPaymentDetails?.user_details?.gender}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Date of Birth:
                    </TableCell>
                    <TableCell>
                      {orderPaymentDetails?.user_details?.dateOfBirth}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      User Status:
                    </TableCell>
                    <TableCell>
                      <Chip
                        color={
                          orderPaymentDetails?.user_details?.status === "ACTIVE"
                            ? "success"
                            : "warning"
                        }
                        label={orderPaymentDetails?.user_details?.status}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </Box>
      )}
    </Drawer>
  );
};

ViewOrderSideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
