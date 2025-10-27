import React from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  SvgIcon,
  TextField,
  Typography,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  AlertTitle,
  Fade,
  Tabs,
  Tab,
  TableContainer,
  InputAdornment,
  Skeleton,
  CircularProgress,
  TablePagination,
} from "@mui/material";
import UserIcon from "@heroicons/react/24/outline/UserIcon";
import ArrowPathIcon from "@heroicons/react/24/outline/ArrowPathIcon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";
import CheckIcon from "@heroicons/react/24/outline/CheckIcon";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import ExclamationTriangleIcon from "@heroicons/react/24/outline/ExclamationTriangleIcon";
import XCircleIcon from "@heroicons/react/24/outline/XCircleIcon";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";
import { CustomSearch } from "../../components/custom-search";
import {
  adminSubscriptionAssignUrl,
  adminSubscriptionCancelUrl,
  adminSubscriptionUserDetailsUrl,
  adminSubscriptionUserHistoryUrl,
  adminSubscriptionProceedWithSelectedUserUrl,
  adminSubscriptionPackagesUrl,
  adminSubscriptionAdminAssignedUrl,
  adminSubscriptionRevenueUrl,
  getAllUsersUrl,
  getUserTransactionDetailsUrl,
} from "../../seed/url";
import { CustomAlert } from "../../components/custom-alert";
import { formatMoney } from "../../utils/constant";
import {
  webGetRequest,
  webPostRequest,
  authPostRequest,
} from "../../services/api-service";
import { useLocation, useNavigate } from "react-router-dom";

function ManualSubscriptions() {
  const location = useLocation();
  const navigate = useNavigate();
  // Core state
  const [users, setUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [userDetails, setUserDetails] = React.useState(null);
  const [history, setHistory] = React.useState([]);
  const [packages, setPackages] = React.useState({
    business_services: [],
    sub_services: [],
  });
  const [packageId, setPackageId] = React.useState(null);
  const [notes, setNotes] = React.useState("");

  // Loading states
  const [loadingAssign, setLoadingAssign] = React.useState(false);
  const [loadingCancel, setLoadingCancel] = React.useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = React.useState(false);
  const [loadingUsers, setLoadingUsers] = React.useState(false);
  const [loadingPackages, setLoadingPackages] = React.useState(false);
  const [loadingHistory, setLoadingHistory] = React.useState(false);

  // Alert system
  const [openAlert, setOpenAlert] = React.useState(false);
  const [severity, setSeverity] = React.useState("success");
  const [severityMessage, setSeverityMessage] = React.useState("");

  // Dialog states
  const [selectionDialog, setSelectionDialog] = React.useState({
    open: false,
    options: [],
    searchedPhone: "",
  });
  const [confirmDialog, setConfirmDialog] = React.useState({
    open: false,
    title: "",
    message: "",
    action: null,
    type: "info",
  });

  // Search and UI state
  const [userQuery, setUserQuery] = React.useState("");
  const [userOptions, setUserOptions] = React.useState([]);
  const [userSearchPage, setUserSearchPage] = React.useState(1);
  const [userSearchTotalPages, setUserSearchTotalPages] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState(0);
  const [adminSubscriptions, setAdminSubscriptions] = React.useState([]);
  const [revenueData, setRevenueData] = React.useState(null);
  const USER_SEARCH_LIMIT = 10;

  // History pagination state
  const [historyPage, setHistoryPage] = React.useState(1);
  const [historyLimit, setHistoryLimit] = React.useState(10);
  const [historyPagination, setHistoryPagination] = React.useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
    from: 0,
    to: 0,
  });

  const fetchUsers = React.useCallback((query, page = 1) => {
    setLoadingUsers(true);
    authPostRequest(
      getAllUsersUrl,
      {
        query: query,
        from: "",
        to: "",
        sort: "id desc",
        limit: USER_SEARCH_LIMIT,
        page: page,
      },
      (data) => {
        const incoming = Array.isArray(data?.results) ? data.results : [];
        setUserSearchPage(Number(data?.page || page));
        setUserSearchTotalPages(Number(data?.total_pages || 1));
        setUserOptions((prev) => {
          if (page === 1) return incoming;
          const existingIds = new Set(prev.map((u) => u.id));
          const merged = [...prev];
          incoming.forEach((u) => {
            if (!existingIds.has(u.id)) merged.push(u);
          });
          return merged;
        });
        setLoadingUsers(false);
      },
      () => {
        if (page === 1) {
          setUserOptions([]);
        }
        setLoadingUsers(false);
      }
    );
  }, []);

  React.useEffect(() => {
    let isActive = true;
    const trimmed = (userQuery || "").trim();
    const timeout = setTimeout(() => {
      if (!isActive) return;
      if (trimmed.length >= 1) {
        setUserSearchPage(1);
        setUserOptions([]);
        fetchUsers(trimmed, 1);
      } else {
        setUserOptions([]);
        setUserSearchPage(1);
        setUserSearchTotalPages(1);
      }
    }, 350);

    return () => {
      isActive = false;
      clearTimeout(timeout);
    };
  }, [userQuery, fetchUsers]);

  // Enhanced alert system
  const showAlert = (type, message, title = "") => {
    setSeverity(type);
    setSeverityMessage(message);
    setOpenAlert(true);
  };

  const handleClickAlert = () => setOpenAlert(true);
  const handleCloseAlert = (_, reason) => {
    if (reason === "clickaway") return;
    setOpenAlert(false);
  };

  // Confirmation dialog
  const showConfirmDialog = (title, message, action, type = "info") => {
    setConfirmDialog({
      open: true,
      title,
      message,
      action,
      type,
    });
  };

  const handleConfirmAction = () => {
    if (confirmDialog.action) {
      confirmDialog.action();
    }
    setConfirmDialog({
      open: false,
      title: "",
      message: "",
      action: null,
      type: "info",
    });
  };

  // Utility functions
  const getInitials = (firstName, secondName, userName) => {
    const first = firstName || userName || "U";
    const second = secondName || "";
    return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "expired":
        return "error";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isSubscriptionActive = (subscription) => {
    if (!subscription?.subscription_end_at) return false;
    return new Date(subscription.subscription_end_at) > new Date();
  };

  const getSubscriptionStatusInfo = (account, subscription) => {
    if (!account)
      return {
        type: "Unknown",
        status: "Unknown",
        color: "default",
        isExpired: false,
      };

    const now = new Date();
    const validUntil = new Date(account.valid_to);
    const isExpired = validUntil < now;

    let type, status, color;

    if (account.user_account_type === "PREMIUM") {
      type = "Premium Subscription";
      color = isExpired ? "error" : "success";
      status = isExpired ? "Expired" : "Active";
    } else if (account.user_account_type === "FREE") {
      type = "Free Account";
      color = "info";
      status = "Active";
    } else if (account.user_account_type === "TRIAL") {
      type = "Trial Account";
      color = "warning";
      status = isExpired ? "Expired" : "Active";
    } else {
      type = `${account.user_account_type} Account`;
      color = "default";
      status = account.status || "Unknown";
    }

    return { type, status, color, isExpired, validUntil: account.valid_to };
  };

  const getPackageNameFromServiceId = (serviceId) => {
    if (!serviceId || !packages) return `Service ID: ${serviceId}`;

    const businessService = packages.business_services?.find(
      (s) => s.id === serviceId
    );
    const subService = packages.sub_services?.find((s) => s.id === serviceId);

    if (businessService) return businessService.name;
    if (subService) return subService.name;
    return `Service ID: ${serviceId}`;
  };

  const getUserTransactionDetails = React.useCallback((orderId) => {
    // Validate order ID before making request
    if (
      !orderId ||
      orderId === "undefined" ||
      orderId === "null" ||
      orderId === ""
    ) {
      console.error("Invalid order ID:", orderId);
      return Promise.reject(new Error("Invalid order ID provided"));
    }

    // Make the API call
    return new Promise((resolve, reject) => {
      webGetRequest(
        `${getUserTransactionDetailsUrl}${orderId}`,
        (response) => {
          resolve(response);
        },
        (error) => {
          console.error("Error fetching transaction details:", error);
          reject(error);
        }
      );
    });
  }, []);

  const fetchAdminAssignedSubscriptions = React.useCallback(
    (page = 1, limit = 20, userId = null) => {
      setLoadingHistory(true);
      let url = `${adminSubscriptionAdminAssignedUrl}?page=${page}&limit=${limit}`;
      if (userId) url += `&user_id=${userId}`;

      webGetRequest(
        url,
        (response) => {
          if (response.success) {
            setAdminSubscriptions(response.data || []);
          } else {
            showAlert(
              "error",
              response.message || "Failed to load admin subscriptions",
              "Error"
            );
          }
          setLoadingHistory(false);
        },
        () => {
          setLoadingHistory(false);
          showAlert("error", "Failed to load admin subscriptions", "Error");
        }
      );
    },
    []
  );

  const fetchRevenueAnalytics = React.useCallback(
    (startDate = null, endDate = null, userId = null) => {
      setLoadingHistory(true);
      let url = `${adminSubscriptionRevenueUrl}?`;
      const params = new URLSearchParams();

      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);
      if (userId) params.append("user_id", userId);

      url += params.toString();

      webGetRequest(
        url,
        (response) => {
          if (response.success) {
            setRevenueData(response.data);
          } else {
            showAlert(
              "error",
              response.message || "Failed to load revenue data",
              "Error"
            );
          }
          setLoadingHistory(false);
        },
        () => {
          setLoadingHistory(false);
          showAlert("error", "Failed to load revenue data", "Error");
        }
      );
    },
    []
  );

  const getPackageDuration = (pkg) => {
    // Try common keys; backend may supply any of these
    const v =
      pkg?.active_days ??
      pkg?.duration_days ??
      pkg?.days ??
      pkg?.duration ??
      pkg?.validity ??
      pkg?.period;
    if (v === undefined || v === null || v === "") return null;
    return v;
  };

  const proceedWithSelectedUser = (userId, phoneNumber) => {
    webPostRequest(
      adminSubscriptionProceedWithSelectedUserUrl,
      {
        user_id: userId,
        phone_number: phoneNumber,
      },
      (res) => {
        if (res?.success && res?.data) {
          const userPayload = res.data.user || res.data;
          setUsers([userPayload]);
          setSelectedUser(userPayload);
          setSelectionDialog({ open: false, options: [], searchedPhone: "" });
        } else {
          setSeverity("error");
          setSeverityMessage(
            res?.message || "Failed to proceed with selection"
          );
          handleClickAlert();
        }
      },
      () => {
        setSeverity("error");
        setSeverityMessage("Failed to proceed with selection");
        handleClickAlert();
      }
    );
  };

  const fetchPackages = React.useCallback(() => {
    setLoadingPackages(true);
    webGetRequest(
      adminSubscriptionPackagesUrl,
      (response) => {
        if (response.success) {
          // Filter only ACTIVE packages
          const activeBusinessServices =
            response.business_services?.filter(
              (p) => `${p.status}`.toUpperCase() === "ACTIVE"
            ) || [];
          const activeSubServices =
            response.sub_services?.filter(
              (p) => `${p.status}`.toUpperCase() === "ACTIVE"
            ) || [];

          setPackages({
            business_services: activeBusinessServices,
            sub_services: activeSubServices,
          });
        } else {
          showAlert(
            "warning",
            response.message || "No packages available",
            "Package Loading"
          );
        }
        setLoadingPackages(false);
      },
      (error) => {
        console.error("Failed to fetch packages:", error);
        showAlert(
          "error",
          "Failed to load packages. Please try again.",
          "Package Loading Error"
        );
        setLoadingPackages(false);
      }
    );
  }, []);

  const fetchDetailsAndHistory = React.useCallback(
    (userId) => {
      if (!userId) return;
      setIsLoadingDetails(true);
      setLoadingHistory(true);

      // Fetch user details
      webGetRequest(
        `${adminSubscriptionUserDetailsUrl}${userId}/details`,
        (res) => {
          setUserDetails(res || null);
          setIsLoadingDetails(false);
        },
        (error) => {
          console.error("Failed to fetch user details:", error);
          setUserDetails(null);
          setIsLoadingDetails(false);
          showAlert(
            "error",
            "Failed to load user details",
            "Data Loading Error"
          );
        }
      );

      // Fetch subscription history
      const histUrl = `${adminSubscriptionUserHistoryUrl}${userId}/history?page=${historyPage}&limit=${historyLimit}`;
      webGetRequest(
        histUrl,
        (res) => {
          const list =
            res?.subscription_history || res?.data || res?.results || [];
          setHistory(Array.isArray(list) ? list : []);
          const p = res?.pagination || {};
          setHistoryPagination({
            current_page: Number(p.current_page || historyPage),
            last_page: Number(p.last_page || 1),
            per_page: Number(p.per_page || historyLimit),
            total: Number(p.total || (Array.isArray(list) ? list.length : 0)),
            from: Number(p.from || 0),
            to: Number(p.to || 0),
          });
          setLoadingHistory(false);
        },
        (error) => {
          console.error("Failed to fetch subscription history:", error);
          setHistory([]);
          setHistoryPagination({
            current_page: 1,
            last_page: 1,
            per_page: historyLimit,
            total: 0,
            from: 0,
            to: 0,
          });
          setLoadingHistory(false);
          showAlert(
            "error",
            "Failed to load subscription history",
            "History Loading Error"
          );
        }
      );
    },
    [historyPage, historyLimit]
  );

  React.useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Sync active tab with path
  React.useEffect(() => {
    const path = location.pathname || "";
    if (path.endsWith("/assignment")) {
      setActiveTab(1);
    } else if (path.endsWith("/analytics")) {
      setActiveTab(3);
    } else {
      setActiveTab(0);
    }
  }, [location.pathname]);

  React.useEffect(() => {
    if (selectedUser?.id) {
      fetchDetailsAndHistory(selectedUser.id);
    }
  }, [selectedUser, fetchDetailsAndHistory]);

  // Refetch history when pagination changes
  React.useEffect(() => {
    if (selectedUser?.id) {
      fetchDetailsAndHistory(selectedUser.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyPage, historyLimit]);

  const assignSubscription = () => {
    if (!selectedUser?.id || !packageId) {
      showAlert(
        "error",
        "Please select a user and package",
        "Validation Error"
      );
      return;
    }

    // Find package in both business_services and sub_services
    const selectedPackage =
      packages.business_services.find((p) => p.id === packageId) ||
      packages.sub_services.find((p) => p.id === packageId);

    const confirmMessage = `Are you sure you want to assign "${
      selectedPackage?.name
    }" subscription to ${selectedUser.firstName || selectedUser.userName}?`;

    showConfirmDialog(
      "Confirm Subscription Assignment",
      confirmMessage,
      () => performAssignSubscription(),
      "warning"
    );
  };

  const performAssignSubscription = () => {
    setLoadingAssign(true);

    // Determine package type based on which array contains the package
    const isBusinessService = packages.business_services.some(
      (p) => p.id === packageId
    );
    const packageType = isBusinessService ? "business_service" : "sub_service";

    webPostRequest(
      adminSubscriptionAssignUrl,
      {
        user_id: selectedUser.id,
        package_type: packageType,
        package_id: packageId,
        subscription_days:
          getPackageDuration(
            packageOptions.find((p) => p.id === packageId) || {}
          ) || 30,
        notes,
      },
      (res) => {
        setLoadingAssign(false);
        if (res?.error || res?.success === false) {
          showAlert(
            "error",
            res?.message || "Assignment failed",
            "Assignment Error"
          );
          return;
        }
        showAlert(
          "success",
          res?.message || "Subscription assigned successfully",
          "Success"
        );
        // Reset form
        setPackageId(null);
        setNotes("");
        fetchDetailsAndHistory(selectedUser.id);
      },
      (error) => {
        console.error("Assignment failed:", error);
        setLoadingAssign(false);
        showAlert(
          "error",
          "Assignment failed. Please try again.",
          "Assignment Error"
        );
      }
    );
  };

  const cancelSubscription = () => {
    if (!selectedUser?.id) {
      showAlert("error", "Please select a user first", "Validation Error");
      return;
    }

    const currentSub = userDetails?.current_subscription;
    if (!currentSub) {
      showAlert(
        "warning",
        "No active subscription found to cancel",
        "No Active Subscription"
      );
      return;
    }

    showConfirmDialog(
      "Confirm Subscription Cancellation",
      `Are you sure you want to cancel the active subscription for ${
        selectedUser.firstName || selectedUser.userName
      }? This action cannot be undone.`,
      () => performCancelSubscription(),
      "error"
    );
  };
  const performCancelSubscription = () => {
    setLoadingCancel(true);
    webPostRequest(
      adminSubscriptionCancelUrl,
      {
        user_id: selectedUser.id,
        reason: notes || "Admin initiated cancellation",
      },
      (res) => {
        setLoadingCancel(false);
        if (res?.error || res?.success === false) {
          showAlert(
            "error",
            res?.message || "Cancellation failed",
            "Cancellation Error"
          );
          return;
        }
        showAlert(
          "success",
          res?.message || "Subscription cancelled successfully",
          "Success"
        );
        fetchDetailsAndHistory(selectedUser.id);
      },
      (error) => {
        console.error("Cancellation failed:", error);
        setLoadingCancel(false);
        showAlert(
          "error",
          "Cancellation failed. Please try again.",
          "Cancellation Error"
        );
      }
    );
  };

  const currentAccount =
    userDetails?.user_account || userDetails?.current_account;
  const currentSub = userDetails?.current_subscription;

  const packageOptions = React.useMemo(() => {
    const businessServices = Array.isArray(packages?.business_services)
      ? packages.business_services.map((pkg) => ({
          ...pkg,
          type: "Business Service",
          category: "Main Services",
        }))
      : [];

    const subServices = Array.isArray(packages?.sub_services)
      ? packages.sub_services.map((pkg) => ({
          ...pkg,
          type: "Sub Service",
          category: "App Subscriptions",
        }))
      : [];

    return [...businessServices, ...subServices];
  }, [packages?.business_services, packages?.sub_services]);
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, pt: 2, pb: 8, bgcolor: "grey.50", minHeight: "100vh" }}
    >
      {openAlert && (
        <CustomAlert
          openAlert={openAlert}
          handleCloseAlert={handleCloseAlert}
          severity={severity}
          severityMessage={severityMessage}
        />
      )}

      <Container maxWidth={false} sx={{ px: { xs: 2, sm: 3 } }}>
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: "white" }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            spacing={2}
          >
            <Stack spacing={1}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, color: "text.primary" }}
              >
                Manual Subscriptions
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ maxWidth: 600 }}
              >
                Assign and manage subscriptions for users who paid via
                non-integrated channels. Search users, view their subscription
                history, and assign new packages seamlessly.
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Refresh all data">
                <IconButton
                  onClick={() => {
                    fetchPackages();
                    if (selectedUser?.id) {
                      fetchDetailsAndHistory(selectedUser.id);
                    }
                  }}
                  sx={{
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  <SvgIcon>
                    <ArrowPathIcon />
                  </SvgIcon>
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Paper>

        {/* User Search Section */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            bgcolor: "white",
          }}
        >
          <Stack spacing={3}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Find User
            </Typography>

            <Box
              sx={{
                maxWidth: 720,
                mx: "auto",
                width: "100%",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px !important",
                  bgcolor: "grey.50",
                  width: "100% !important",
                  maxWidth: "720px !important",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    bgcolor: "grey.100",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
                },
                "& .MuiCard-root": {
                  maxWidth: "none !important",
                  width: "100% !important",
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "transparent",
                  borderWidth: "1px",
                },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: "primary.main",
                    borderWidth: "2px",
                    boxShadow: "0 0 0 3px rgba(25, 118, 210, 0.1)",
                  },
                "& .MuiOutlinedInput-input": {
                  py: 1.5,
                  fontSize: "1rem",
                },
              }}
            >
              <CustomSearch
                handleSearch={(e) => setUserQuery(e.target.value)}
              />

              {(loadingUsers ||
                (userOptions.length > 0 && userQuery) ||
                (userQuery && !loadingUsers)) && (
                <Paper sx={{ mt: 1, borderRadius: 2, overflow: "hidden" }}>
                  {userOptions.length === 0 && !loadingUsers ? (
                    <Box
                      sx={{
                        p: 2,
                        textAlign: "center",
                        color: "text.secondary",
                      }}
                    >
                      {userQuery?.trim()?.length
                        ? "No users found"
                        : "Type to search users"}
                    </Box>
                  ) : (
                    <Box
                      sx={{ maxHeight: 360, overflow: "auto" }}
                      onScroll={(e) => {
                        const node = e.currentTarget;
                        const nearBottom =
                          node.scrollTop + node.clientHeight >=
                          node.scrollHeight - 16;
                        if (
                          nearBottom &&
                          !loadingUsers &&
                          userSearchPage < userSearchTotalPages
                        ) {
                          fetchUsers(
                            (userQuery || "").trim(),
                            userSearchPage + 1
                          );
                        }
                      }}
                    >
                      {userOptions.map((u) => (
                        <Box
                          key={u.id}
                          sx={{
                            p: 1.5,
                            px: 2,
                            cursor: "pointer",
                            "&:hover": { bgcolor: "grey.50" },
                          }}
                          onClick={() => {
                            setUsers([u]);
                            setSelectedUser(u);
                            setUserQuery(""); // Clear search to close dropdown
                          }}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: "primary.main",
                              }}
                            >
                              {getInitials(
                                u.firstName,
                                u.secondName,
                                u.userName
                              )}
                            </Avatar>
                            <Stack sx={{ flexGrow: 1 }}>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500 }}
                              >
                                {u.firstName || u.userName || "Unnamed"}{" "}
                                {u.secondName || ""}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                ID: {u.id} • Phone: {u.phoneNumber || "N/A"}
                              </Typography>
                            </Stack>
                          </Stack>
                        </Box>
                      ))}
                      {loadingUsers && (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            py: 2,
                          }}
                        >
                          <CircularProgress size={16} />
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ ml: 1 }}
                          >
                            Loading...
                          </Typography>
                        </Box>
                      )}
                      {!loadingUsers &&
                        userSearchPage >= userSearchTotalPages &&
                        userOptions.length > 0 && (
                          <Box
                            sx={{
                              p: 1.5,
                              textAlign: "center",
                              color: "text.disabled",
                            }}
                          >
                            No more results
                          </Box>
                        )}
                    </Box>
                  )}
                </Paper>
              )}
            </Box>

            {users?.length > 0 && (
              <Fade in={users.length > 0}>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 2, fontWeight: 600, color: "text.secondary" }}
                  >
                    Selected User
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {users.map((u) => (
                      <Chip
                        key={u.id}
                        icon={
                          <Avatar
                            sx={{
                              width: 20,
                              height: 20,
                              bgcolor: "primary.main",
                            }}
                          >
                            {getInitials(u.firstName, u.secondName, u.userName)}
                          </Avatar>
                        }
                        label={`${u.firstName || u.userName || "Unnamed"} ${
                          u.secondName || ""
                        } (${u.phoneNumber || "-"})`}
                        onClick={() => setSelectedUser(u)}
                        color={
                          selectedUser?.id === u.id ? "primary" : "default"
                        }
                        variant={
                          selectedUser?.id === u.id ? "filled" : "outlined"
                        }
                        sx={{
                          mb: 1,
                          "& .MuiChip-label": { fontWeight: 500 },
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Fade>
            )}
          </Stack>
        </Paper>

        {/* Main Content with Tabs */}
        {selectedUser && (
          <Paper
            elevation={0}
            sx={{ borderRadius: 2, bgcolor: "white", overflow: "hidden" }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, newValue) => {
                setActiveTab(newValue);
                if (newValue === 1) {
                  navigate("/payments/manual-subscriptions/assignment");
                } else if (newValue === 3) {
                  navigate("/payments/manual-subscriptions/analytics");
                } else {
                  navigate("/payments/manual-subscriptions");
                }
              }}
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                px: 3,
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontWeight: 500,
                  minHeight: 60,
                },
              }}
            >
              <Tab
                label="User Overview"
                icon={
                  <SvgIcon>
                    <UserIcon />
                  </SvgIcon>
                }
                iconPosition="start"
              />
              <Tab
                label="Assign Subscription"
                icon={
                  <SvgIcon>
                    <PlusIcon />
                  </SvgIcon>
                }
                iconPosition="start"
              />
              <Tab
                label="Subscription History"
                icon={
                  <SvgIcon>
                    <CircleStackIcon />
                  </SvgIcon>
                }
                iconPosition="start"
              />
              <Tab
                label="Admin Analytics"
                icon={
                  <SvgIcon>
                    <CurrencyDollarIcon />
                  </SvgIcon>
                }
                iconPosition="start"
              />
            </Tabs>

            {/* Tab Panel 1: User Overview */}
            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                {isLoadingDetails ? (
                  <Stack spacing={2}>
                    <Skeleton
                      variant="rectangular"
                      height={200}
                      sx={{ borderRadius: 2 }}
                    />
                    <Skeleton
                      variant="rectangular"
                      height={150}
                      sx={{ borderRadius: 2 }}
                    />
                  </Stack>
                ) : (
                  <Grid container spacing={3}>
                    {/* User Profile Card */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: "100%", bgcolor: "grey.50" }}>
                        <CardContent sx={{ textAlign: "center", py: 3 }}>
                          <Avatar
                            sx={{
                              width: 80,
                              height: 80,
                              bgcolor: "primary.main",
                              mx: "auto",
                              mb: 2,
                              fontSize: "1.5rem",
                            }}
                          >
                            {getInitials(
                              userDetails?.user?.firstName ||
                                selectedUser?.firstName,
                              userDetails?.user?.secondName ||
                                selectedUser?.secondName,
                              userDetails?.user?.userName ||
                                selectedUser?.userName
                            )}
                          </Avatar>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 1 }}
                          >
                            {`${
                              userDetails?.user?.firstName ||
                              selectedUser?.firstName ||
                              ""
                            } ${
                              userDetails?.user?.secondName ||
                              selectedUser?.secondName ||
                              ""
                            } ${
                              userDetails?.user?.userName &&
                              !userDetails?.user?.secondName
                                ? userDetails?.user?.userName
                                : !selectedUser?.secondName
                                ? selectedUser?.userName || ""
                                : ""
                            }`}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                          >
                            User ID: {selectedUser?.id}
                          </Typography>
                          <Stack spacing={1}>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                              }}
                            >
                              <SvgIcon fontSize="small" color="action">
                                <UserIcon />
                              </SvgIcon>
                              <Typography variant="body2">
                                {userDetails?.user?.phoneNumber ||
                                  selectedUser?.phoneNumber}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 1,
                              }}
                            >
                              <SvgIcon fontSize="small" color="action">
                                <UserIcon />
                              </SvgIcon>
                              <Typography variant="body2">
                                {userDetails?.user?.email ||
                                  selectedUser?.email ||
                                  "No email"}
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Account Status Card */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: "100%" }}>
                        <CardContent>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{ mb: 2 }}
                          >
                            <SvgIcon color="primary">
                              <CircleStackIcon />
                            </SvgIcon>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              Account Status
                            </Typography>
                          </Stack>
                          {currentAccount ? (
                            <Stack spacing={2}>
                              {(() => {
                                const statusInfo = getSubscriptionStatusInfo(
                                  currentAccount,
                                  currentSub
                                );
                                return (
                                  <>
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 0.5 }}
                                      >
                                        Account Type
                                      </Typography>
                                      <Chip
                                        label={statusInfo.type}
                                        color={statusInfo.color}
                                        variant="outlined"
                                        size="small"
                                      />
                                    </Box>
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 0.5 }}
                                      >
                                        Status
                                      </Typography>
                                      <Chip
                                        label={statusInfo.status}
                                        color={statusInfo.color}
                                        size="small"
                                      />
                                    </Box>
                                    <Box>
                                      <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ mb: 0.5 }}
                                      >
                                        Valid Until
                                      </Typography>
                                      <Typography
                                        component="div"
                                        variant="body2"
                                        sx={{
                                          fontWeight: 500,
                                          color: statusInfo.isExpired
                                            ? "error.main"
                                            : "text.primary",
                                        }}
                                      >
                                        {formatDate(currentAccount.valid_to)}
                                        {statusInfo.isExpired && (
                                          <Chip
                                            label="Expired"
                                            color="error"
                                            size="small"
                                            sx={{ ml: 1 }}
                                          />
                                        )}
                                      </Typography>
                                    </Box>
                                  </>
                                );
                              })()}
                            </Stack>
                          ) : (
                            <Alert severity="info" sx={{ mt: 1 }}>
                              <AlertTitle>No Account Information</AlertTitle>
                              This user doesn't have account details available.
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Current Subscription Card */}
                    <Grid item xs={12} md={4}>
                      <Card sx={{ height: "100%" }}>
                        <CardContent>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            sx={{ mb: 2 }}
                          >
                            <SvgIcon color="primary">
                              <CalendarIcon />
                            </SvgIcon>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                              Current Subscription
                            </Typography>
                          </Stack>
                          {currentSub ? (
                            <Stack spacing={2}>
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 0.5 }}
                                >
                                  Package
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {getPackageNameFromServiceId(
                                    currentSub.service_id
                                  )}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 0.5 }}
                                >
                                  Order ID
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 500,
                                    fontFamily: "monospace",
                                  }}
                                >
                                  {currentSub.order_id}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 0.5 }}
                                >
                                  Status
                                </Typography>
                                <Chip
                                  label={
                                    isSubscriptionActive(currentSub)
                                      ? "Active"
                                      : "Expired"
                                  }
                                  color={
                                    isSubscriptionActive(currentSub)
                                      ? "success"
                                      : "error"
                                  }
                                  size="small"
                                />
                              </Box>
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 0.5 }}
                                >
                                  Valid Period
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 500 }}
                                >
                                  {formatDate(currentSub.subscription_start_at)}{" "}
                                  - {formatDate(currentSub.subscription_end_at)}
                                </Typography>
                              </Box>
                            </Stack>
                          ) : (
                            <Alert severity="warning" sx={{ mt: 1 }}>
                              <AlertTitle>No Active Subscription</AlertTitle>
                              This user doesn't have an active subscription.
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </Box>
            )}

            {/* Tab Panel 2: Assign Subscription */}
            {activeTab === 1 && (
              <Box sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <SvgIcon color="primary" sx={{ fontSize: 28 }}>
                      <PlusIcon />
                    </SvgIcon>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Assign New Subscription
                    </Typography>
                  </Stack>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Stack spacing={3}>
                        <Autocomplete
                          size="large"
                          loading={loadingPackages}
                          options={packageOptions.map((p) => ({
                            label: `${p.name} - ${formatMoney(p.amount)}`,
                            value: p.id,
                            raw: p,
                            category: p.category,
                            type: p.type,
                          }))}
                          value={
                            packageOptions
                              .map((p) => ({
                                label: `${p.name} - ${formatMoney(p.amount)}`,
                                value: p.id,
                                raw: p,
                              }))
                              .find((v) => v.value === packageId) || null
                          }
                          onChange={(_, v) => setPackageId(v?.value || null)}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Package"
                              placeholder="Choose a subscription package..."
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SvgIcon color="action">
                                      <CurrencyDollarIcon />
                                    </SvgIcon>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                          renderOption={(props, option) => {
                            const { key, ...otherProps } = props;
                            return (
                              <Box
                                component="li"
                                key={key}
                                {...otherProps}
                                sx={{ py: 1.5 }}
                              >
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  justifyContent="space-between"
                                  sx={{ width: "100%" }}
                                >
                                  <Stack>
                                    <Typography
                                      variant="body1"
                                      sx={{ fontWeight: 500 }}
                                    >
                                      {option.raw.name}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      {option.category} - {option.type}
                                    </Typography>
                                    {getPackageDuration(option.raw) && (
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        Duration:{" "}
                                        {getPackageDuration(option.raw)} days
                                      </Typography>
                                    )}
                                  </Stack>
                                  <Typography
                                    variant="h6"
                                    color="primary"
                                    sx={{ fontWeight: 600 }}
                                  >
                                    {formatMoney(option.raw.amount)}
                                  </Typography>
                                </Stack>
                              </Box>
                            );
                          }}
                        />

                        <TextField
                          size="large"
                          label="Notes (Optional)"
                          placeholder="Add any additional notes for this subscription..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          inputProps={{ maxLength: 500 }}
                          multiline
                          rows={3}
                          fullWidth
                        />
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <Card sx={{ bgcolor: "grey.50", height: "fit-content" }}>
                        <CardContent>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, mb: 2 }}
                          >
                            Assignment Summary
                          </Typography>
                          <Stack spacing={2}>
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                User
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500 }}
                              >
                                {selectedUser?.firstName ||
                                  selectedUser?.userName ||
                                  "Unknown"}
                              </Typography>
                            </Box>
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Package
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500 }}
                              >
                                {packageOptions.find((p) => p.id === packageId)
                                  ?.name || "Not selected"}
                              </Typography>
                            </Box>
                            {packageOptions.find((p) => p.id === packageId) &&
                              getPackageDuration(
                                packageOptions.find((p) => p.id === packageId)
                              ) && (
                                <Box>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    Duration
                                  </Typography>
                                  <Typography
                                    variant="body1"
                                    sx={{ fontWeight: 500 }}
                                  >
                                    {getPackageDuration(
                                      packageOptions.find(
                                        (p) => p.id === packageId
                                      )
                                    )}{" "}
                                    days
                                  </Typography>
                                </Box>
                              )}
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Type
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500 }}
                              >
                                App Subscription
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={
                        <SvgIcon>
                          <CheckIcon />
                        </SvgIcon>
                      }
                      onClick={assignSubscription}
                      disabled={loadingAssign || !selectedUser || !packageId}
                      sx={{
                        minWidth: 200,
                        py: 1.5,
                        borderRadius: 2,
                      }}
                    >
                      {loadingAssign ? "Assigning..." : "Assign Subscription"}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="large"
                      startIcon={
                        <SvgIcon>
                          <XMarkIcon />
                        </SvgIcon>
                      }
                      onClick={cancelSubscription}
                      disabled={loadingCancel || !selectedUser || !currentSub}
                      sx={{
                        minWidth: 200,
                        py: 1.5,
                        borderRadius: 2,
                      }}
                    >
                      {loadingCancel ? "Cancelling..." : "Cancel Active"}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            )}

            {/* Tab Panel 3: Subscription History */}
            {activeTab === 2 && (
              <Box sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <SvgIcon color="primary" sx={{ fontSize: 28 }}>
                        <CircleStackIcon />
                      </SvgIcon>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Subscription History
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Refresh history">
                        <IconButton
                          onClick={() =>
                            selectedUser &&
                            fetchDetailsAndHistory(selectedUser.id)
                          }
                          disabled={loadingHistory}
                        >
                          <SvgIcon>
                            <ArrowPathIcon />
                          </SvgIcon>
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  {loadingHistory ? (
                    <Stack spacing={1}>
                      {[1, 2, 3].map((i) => (
                        <Skeleton
                          key={i}
                          variant="rectangular"
                          height={60}
                          sx={{ borderRadius: 1 }}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <TableContainer
                      component={Paper}
                      elevation={0}
                      sx={{
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow sx={{ bgcolor: "grey.50" }}>
                            <TableCell sx={{ fontWeight: 600 }}>
                              Order ID
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              Service ID
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              Start Date
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              End Date
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              Status
                            </TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>
                              Created
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {history?.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={6}
                                sx={{ textAlign: "center", py: 4 }}
                              >
                                <Stack alignItems="center" spacing={2}>
                                  <SvgIcon
                                    sx={{
                                      fontSize: 48,
                                      color: "text.disabled",
                                    }}
                                  >
                                    <CircleStackIcon />
                                  </SvgIcon>
                                  <Typography
                                    variant="body1"
                                    color="text.secondary"
                                  >
                                    No subscription history found
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    color="text.disabled"
                                  >
                                    This user hasn't had any subscriptions yet
                                  </Typography>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ) : (
                            history?.map((h) => (
                              <TableRow key={h.id} hover>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontFamily: "monospace",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {h.order_id}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {h.service_id}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {formatDate(h.subscription_start_at)}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {formatDate(h.subscription_end_at)}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Chip
                                    label={
                                      isSubscriptionActive(h)
                                        ? "Active"
                                        : "Expired"
                                    }
                                    color={
                                      isSubscriptionActive(h)
                                        ? "success"
                                        : "default"
                                    }
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {formatDate(h.created_at)}
                                  </Typography>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                  {/* Pagination Controls */}
                  {!loadingHistory && (
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <TablePagination
                        component="div"
                        count={historyPagination.total}
                        page={Math.max(
                          0,
                          (historyPagination.current_page || 1) - 1
                        )}
                        onPageChange={(_, newPage) =>
                          setHistoryPage(newPage + 1)
                        }
                        rowsPerPage={historyLimit}
                        onRowsPerPageChange={(e) => {
                          const newLimit = parseInt(e.target.value, 10) || 10;
                          setHistoryLimit(newLimit);
                          setHistoryPage(1);
                        }}
                        rowsPerPageOptions={[10, 20, 50, 100]}
                      />
                    </Box>
                  )}
                </Stack>
              </Box>
            )}

            {/* Tab Panel 4: Admin Analytics */}
            {activeTab === 3 && (
              <Box sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {/* Header with Load Data Button */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                      Admin Analytics Dashboard
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="outlined"
                        startIcon={
                          <SvgIcon>
                            <CircleStackIcon />
                          </SvgIcon>
                        }
                        onClick={() => fetchAdminAssignedSubscriptions()}
                        disabled={loadingHistory}
                      >
                        Load Subscriptions
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={
                          <SvgIcon>
                            <CurrencyDollarIcon />
                          </SvgIcon>
                        }
                        onClick={() => fetchRevenueAnalytics()}
                        disabled={loadingHistory}
                      >
                        Load Revenue Data
                      </Button>
                    </Stack>
                  </Box>

                  {/* Revenue Summary Cards */}
                  {revenueData && (
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ textAlign: "center", p: 2 }}>
                          <Typography
                            variant="h4"
                            color="primary"
                            sx={{ fontWeight: 600 }}
                          >
                            {formatMoney(
                              revenueData.summary?.total_revenue || 0
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Revenue
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ textAlign: "center", p: 2 }}>
                          <Typography
                            variant="h4"
                            color="success.main"
                            sx={{ fontWeight: 600 }}
                          >
                            {revenueData.summary?.total_subscriptions || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Total Subscriptions
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ textAlign: "center", p: 2 }}>
                          <Typography
                            variant="h4"
                            color="info.main"
                            sx={{ fontWeight: 600 }}
                          >
                            {revenueData.summary?.unique_users || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Unique Users
                          </Typography>
                        </Card>
                      </Grid>
                      <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ textAlign: "center", p: 2 }}>
                          <Typography
                            variant="h4"
                            color="warning.main"
                            sx={{ fontWeight: 600 }}
                          >
                            {formatMoney(
                              revenueData.summary?.average_subscription_value ||
                                0
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Average Value
                          </Typography>
                        </Card>
                      </Grid>
                    </Grid>
                  )}

                  {/* Revenue by Package Table */}
                  {revenueData?.revenue_by_package &&
                    revenueData.revenue_by_package.length > 0 && (
                      <Card>
                        <CardContent>
                          <Typography
                            variant="h6"
                            sx={{ mb: 2, fontWeight: 600 }}
                          >
                            Revenue by Package
                          </Typography>
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Package Name</TableCell>
                                  <TableCell align="right">Revenue</TableCell>
                                  <TableCell align="right">
                                    Subscriptions
                                  </TableCell>
                                  <TableCell align="right">Users</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {revenueData.revenue_by_package.map(
                                  (pkg, index) => (
                                    <TableRow key={index}>
                                      <TableCell>
                                        <Typography
                                          variant="body2"
                                          sx={{ fontWeight: 500 }}
                                        >
                                          {pkg.package_name}
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="right">
                                        <Typography
                                          variant="body2"
                                          color="primary"
                                          sx={{ fontWeight: 500 }}
                                        >
                                          {formatMoney(pkg.total_amount)}
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="right">
                                        <Chip
                                          label={pkg.subscription_count}
                                          color="success"
                                          size="small"
                                        />
                                      </TableCell>
                                      <TableCell align="right">
                                        <Chip
                                          label={pkg.unique_users}
                                          color="info"
                                          size="small"
                                        />
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </CardContent>
                      </Card>
                    )}

                  {/* Monthly Breakdown Table */}
                  {revenueData?.monthly_breakdown &&
                    revenueData.monthly_breakdown.length > 0 && (
                      <Card>
                        <CardContent>
                          <Typography
                            variant="h6"
                            sx={{ mb: 2, fontWeight: 600 }}
                          >
                            Monthly Breakdown
                          </Typography>
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>Month</TableCell>
                                  <TableCell align="right">Revenue</TableCell>
                                  <TableCell align="right">
                                    Subscriptions
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {revenueData.monthly_breakdown.map(
                                  (month, index) => (
                                    <TableRow key={index}>
                                      <TableCell>
                                        <Typography
                                          variant="body2"
                                          sx={{ fontWeight: 500 }}
                                        >
                                          {month.month}
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="right">
                                        <Typography
                                          variant="body2"
                                          color="primary"
                                          sx={{ fontWeight: 500 }}
                                        >
                                          {formatMoney(month.total_amount)}
                                        </Typography>
                                      </TableCell>
                                      <TableCell align="right">
                                        <Chip
                                          label={month.subscription_count}
                                          color="success"
                                          size="small"
                                        />
                                      </TableCell>
                                    </TableRow>
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </CardContent>
                      </Card>
                    )}

                  {/* Admin Assigned Subscriptions List */}
                  {adminSubscriptions && adminSubscriptions.length > 0 && (
                    <Card>
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ mb: 2, fontWeight: 600 }}
                        >
                          Admin-Assigned Subscriptions (
                          {adminSubscriptions.length})
                        </Typography>
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>User</TableCell>
                                <TableCell>Package</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Assigned Date</TableCell>
                                <TableCell>Valid Until</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {adminSubscriptions.map((sub, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={1}
                                    >
                                      <Avatar
                                        sx={{
                                          width: 32,
                                          height: 32,
                                          fontSize: "0.875rem",
                                        }}
                                      >
                                        {getInitials(
                                          sub.user_details?.firstName,
                                          sub.user_details?.secondName,
                                          sub.user_details?.userName
                                        )}
                                      </Avatar>
                                      <Box>
                                        <Typography
                                          variant="body2"
                                          sx={{ fontWeight: 500 }}
                                        >
                                          {sub.user_details?.firstName}{" "}
                                          {sub.user_details?.userName}
                                        </Typography>
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          ID: {sub.user_id}
                                        </Typography>
                                      </Box>
                                    </Stack>
                                  </TableCell>
                                  <TableCell>
                                    <Typography
                                      variant="body2"
                                      sx={{ fontWeight: 500 }}
                                    >
                                      {sub.package_name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="right">
                                    <Typography
                                      variant="body2"
                                      color="primary"
                                      sx={{ fontWeight: 500 }}
                                    >
                                      {formatMoney(sub.amount)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={
                                        sub.is_active ? "Active" : "Expired"
                                      }
                                      color={
                                        sub.is_active ? "success" : "error"
                                      }
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {formatDate(sub.assigned_at)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {formatDate(
                                        sub.current_subscription
                                          ?.subscription_end_at
                                      )}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  )}

                  {/* Loading State */}
                  {loadingHistory && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 4 }}
                    >
                      <CircularProgress />
                    </Box>
                  )}

                  {/* Empty State */}
                  {!revenueData &&
                    !adminSubscriptions?.length &&
                    !loadingHistory && (
                      <Card sx={{ textAlign: "center", py: 6 }}>
                        <CardContent>
                          <SvgIcon
                            sx={{
                              fontSize: 64,
                              color: "text.secondary",
                              mb: 2,
                            }}
                          >
                            <CurrencyDollarIcon />
                          </SvgIcon>
                          <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            No Analytics Data
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 3 }}
                          >
                            Click the buttons above to load admin subscription
                            and revenue data
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                          >
                            <Button
                              variant="outlined"
                              startIcon={
                                <SvgIcon>
                                  <CircleStackIcon />
                                </SvgIcon>
                              }
                              onClick={() => fetchAdminAssignedSubscriptions()}
                            >
                              Load Subscriptions
                            </Button>
                            <Button
                              variant="contained"
                              startIcon={
                                <SvgIcon>
                                  <CurrencyDollarIcon />
                                </SvgIcon>
                              }
                              onClick={() => fetchRevenueAnalytics()}
                            >
                              Load Revenue Data
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    )}
                </Stack>
              </Box>
            )}
          </Paper>
        )}

        {/* Empty State */}
        {!selectedUser && (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 2,
              bgcolor: "white",
            }}
          >
            <Stack alignItems="center" spacing={3}>
              <SvgIcon sx={{ fontSize: 80, color: "text.disabled" }}>
                <UserIcon />
              </SvgIcon>
              <Stack spacing={1}>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  No User Selected
                </Typography>
                <Typography variant="body1" color="text.disabled">
                  Search and select a user above to view their details and
                  manage subscriptions
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        )}
      </Container>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() =>
          setConfirmDialog({
            open: false,
            title: "",
            message: "",
            action: null,
            type: "info",
          })
        }
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <SvgIcon
              color={confirmDialog.type === "error" ? "error" : "warning"}
            >
              {confirmDialog.type === "error" ? (
                <XCircleIcon />
              ) : (
                <ExclamationTriangleIcon />
              )}
            </SvgIcon>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {confirmDialog.title}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() =>
              setConfirmDialog({
                open: false,
                title: "",
                message: "",
                action: null,
                type: "info",
              })
            }
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            color={confirmDialog.type === "error" ? "error" : "primary"}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {/* User Selection Dialog */}
      <Dialog
        open={selectionDialog.open}
        onClose={() =>
          setSelectionDialog({ open: false, options: [], searchedPhone: "" })
        }
        fullWidth
        maxWidth="md"
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <SvgIcon color="warning">
              <ExclamationTriangleIcon />
            </SvgIcon>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Data Inconsistency Detected
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <AlertTitle>Multiple Users Found</AlertTitle>
            Multiple users found for phone:{" "}
            <strong>{selectionDialog.searchedPhone}</strong>. Please select the
            correct user to proceed.
          </Alert>
          <List sx={{ bgcolor: "grey.50", borderRadius: 2, p: 1 }}>
            {selectionDialog.options.map((opt) => (
              <ListItem
                key={opt.user_id}
                button
                onClick={() =>
                  proceedWithSelectedUser(
                    opt.user_id,
                    selectionDialog.searchedPhone
                  )
                }
                sx={{
                  borderRadius: 1,
                  mb: 1,
                  "&:hover": { bgcolor: "primary.50" },
                }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ width: "100%" }}
                >
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {getInitials(
                      opt.user_details.firstName,
                      opt.user_details.secondName,
                      opt.user_details.userName
                    )}
                  </Avatar>
                  <Stack sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {opt.user_details.firstName || ""}{" "}
                      {opt.user_details.userName || ""} (ID: {opt.user_id})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Phone: {opt.user_phone} • Transactions:{" "}
                      {opt.transaction_count}
                      {opt.phone_matches === false && (
                        <Chip
                          label="Phone mismatch"
                          color="warning"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Typography>
                  </Stack>
                  <SvgIcon color="action">
                    <ArrowPathIcon />
                  </SvgIcon>
                </Stack>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={() =>
              setSelectionDialog({
                open: false,
                options: [],
                searchedPhone: "",
              })
            }
            variant="outlined"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ManualSubscriptions;
