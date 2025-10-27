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
import { useSelector } from "react-redux";
import { webGetRequest } from "../../services/api-service";
import { getTransactionDetailsUrl, updateTransactionUrl } from "../../seed/url";
import { formatMoney } from "../../utils/constant";
import { CustomAlert } from "../../components/custom-alert";

export const ViewPaymentSideNav = (props) => {
  const { open, onClose } = props;
  const paymentSideNav = useSelector(
    (state) => state.ViewPaymentSideNavReducer
  );
  const [paymentDetails, setPaymentDetails] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);
  const [openAlert, setOpenAlert] = React.useState(false);
  const [severity, setSeverity] = React.useState("");
  const [severityMessage, setSeverityMessage] = React.useState("");

  const fetcher = React.useCallback(() => {
    setIsLoading(true);
    webGetRequest(
      `${getTransactionDetailsUrl}${paymentSideNav?.paymentSideNavContent?.order_id}`,
      (data) => {
        // API returns { success, data: {...} } – normalize to inner data
        setPaymentDetails(data?.data || data);
        setIsLoading(false);
      },
      (error) => {
        setPaymentDetails({});
        setIsLoading(false);
      }
    );
  }, [paymentSideNav?.paymentSideNavContent?.order_id]);

  const updateUsertransaction = () => {
    setIsLoading(true);
    webGetRequest(
      `${updateTransactionUrl}${paymentSideNav?.paymentSideNavContent?.order_id}`,
      (data) => {
        fetcher();
        if (data.error) {
          setSeverityMessage(data.data.message);
          setSeverity("error");
          handleClickAlert();
        }
      },
      (error) => {
        fetcher();
      }
    );
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
    fetcher();
  }, [fetcher]);

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
          }}
        >
          <CircularProgress
            sx={{
              mx: "auto",
              my: 3,
            }}
          />
        </Box>
      )}
      {!isLoading && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              mb: 2,
              borderBottom: "2px solid #DFE2E6",
            }}
          >
            <Typography variant="h6">
              {paymentDetails?.afyachap_data?.service_name ||
                "App Subscription"}
            </Typography>
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
              gap: 1,
              mb: 1,
            }}
          >
            <Avatar
              sx={{
                cursor: "pointer",
                height: 70,
                width: 70,
              }}
              alt="User Profile"
              src={paymentDetails?.user_details?.profileImage}
            />
            <Typography variant="h3" color="primary">
              {formatMoney(Number(paymentDetails?.afyachap_data?.amount || 0))}
            </Typography>
            <Typography variant="h6">
              {paymentDetails?.user_details?.firstName}{" "}
              {paymentDetails?.user_details?.secondName}
            </Typography>

            <Chip
              color={
                paymentDetails?.afyachap_data?.payment_status === "COMPLETED"
                  ? "success"
                  : "warning"
              }
              label={paymentDetails?.afyachap_data?.payment_status}
              sx={{
                width: 110,
              }}
            />
          </Box>
          <Table
            sx={{
              "& th, & td": {
                borderBottom: "none",
              },
              mb: 1,
            }}
          >
            <TableBody>
              <TableRow>
                <TableCell>Order ID:</TableCell>
                <TableCell>{paymentDetails?.afyachap_data?.order_id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>User ID:</TableCell>
                <TableCell>{paymentDetails?.user_details?.id}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Service:</TableCell>
                <TableCell>
                  {paymentDetails?.afyachap_data?.service_name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Package Type:</TableCell>
                <TableCell>
                  {paymentDetails?.afyachap_data?.package_type}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Payment No:</TableCell>
                <TableCell>
                  {paymentDetails?.afyachap_data?.payment_no}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Afyachap Date:</TableCell>
                <TableCell>{paymentDetails?.afyachap_data?.date}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Channel:</TableCell>
                <TableCell>
                  {paymentDetails?.selcom_data?.data?.[0]?.channel}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Reference:</TableCell>
                <TableCell>{paymentDetails?.selcom_data?.reference}</TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Selcom Status:</TableCell>
                <TableCell>
                  <Chip
                    color={
                      (
                        paymentDetails?.selcom_data?.data?.[0]
                          ?.payment_status || ""
                      ).toUpperCase() === "COMPLETED"
                        ? "success"
                        : "warning"
                    }
                    label={
                      paymentDetails?.selcom_data?.data?.[0]?.payment_status ||
                      paymentDetails?.selcom_data?.result
                    }
                    size="small"
                    sx={{ width: 140 }}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Selcom Amount:</TableCell>
                <TableCell>
                  {formatMoney(
                    Number(paymentDetails?.selcom_data?.data?.[0]?.amount || 0)
                  )}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Trans ID:</TableCell>
                <TableCell>
                  {paymentDetails?.selcom_data?.data?.[0]?.transid}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>MSISDN:</TableCell>
                <TableCell>
                  {paymentDetails?.selcom_data?.data?.[0]?.msisdn}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Creation Date:</TableCell>
                <TableCell>
                  {paymentDetails?.selcom_data?.data?.[0]?.creation_date}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {paymentDetails?.afyachap_data?.payment_status === "PENDING" && (
            <Button
              onClick={updateUsertransaction}
              sx={{ mx: 2 }}
              variant="contained"
            >
              Update
            </Button>
          )}
        </>
      )}
    </Drawer>
  );
};

ViewPaymentSideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
