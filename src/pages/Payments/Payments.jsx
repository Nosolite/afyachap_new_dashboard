import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useSelection } from "../../hooks/use-selection";
import { CustomTable } from "../../components/custom-table";
import { CustomSearch } from "../../components/custom-search";
import { paymentsHeadCells } from "../../seed/table-headers";
import EyeIcon from "@heroicons/react/24/outline/EyeIcon";
import { formatMoney, packageTypes, paymentStatus } from "../../utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { webGetRequest } from "../../services/api-service";
import { getAllPaymentsTransactionsUrl } from "../../seed/url";
import CalendarIcon from "@heroicons/react/24/outline/CalendarIcon";
import { usePopover } from "../../hooks/use-popover";
import { CustomPopOver } from "../../components/custom-popover";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
import ChevronRightIcon from "@heroicons/react/24/outline/ChevronRightIcon";
import CircleStackIcon from "@heroicons/react/24/outline/CircleStackIcon";
import dayjs from "dayjs";
import CurrencyDollarIcon from "@heroicons/react/24/outline/CurrencyDollarIcon";

const useContentsIds = (contents) => {
  return React.useMemo(() => {
    return contents.map((customer) => customer.id);
  }, [contents]);
};

function Payments() {
  const dispatch = useDispatch();
  const popOver = usePopover();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [contents, setContents] = React.useState({
    data: [],
    pagination: {
      current_page: 1,
      per_page: 0,
      total: 0,
      last_page: 0,
    },
  });
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const contentsIds = useContentsIds(contents.data);
  const contentsSelection = useSelection(contentsIds);
  const [activePackage, setActivePackage] = React.useState({
    label: "All",
    value: 0,
  });
  const [paymentStatusFilter, setPaymentStatusFilter] = React.useState({
    label: "All",
    value: "",
  });
  const [timeFilterValue, setTimeFilterValue] = React.useState({
    label: "Today",
    value: "today",
  });
  const [body, setBody] = React.useState({
    from: dayjs().startOf("day"),
    to: dayjs().add(1, "day"),
  });

  //handling change for date froma and to
  const handleBodyChange = (newValue, key) => {
    setBody({ ...body, [key]: newValue });
  };

  const paymentSideNav = useSelector(
    (state) => state.ViewPaymentSideNavReducer
  );
  const [popoverItems, setPopoverItems] = React.useState([]);

  const fetcher = React.useCallback(
    (page) => {
      setIsLoading(true);
      const fromDate = body.from.format("YYYY-MM-DD");
      const toDate = body.to.format("YYYY-MM-DD");

      webGetRequest(
        `${getAllPaymentsTransactionsUrl}?date_filter=${timeFilterValue.value}&date_from=${fromDate}&date_to=${toDate}&page=${page}&per_page=${rowsPerPage}&sub_service_id=${activePackage.value}&payment_status=${paymentStatusFilter.value}&search_key=${searchTerm}`,
        (data) => {
          setContents(data);
          setIsLoading(false);
        },
        (error) => {
          setContents({
            data: [],
            pagination: {
              current_page: 1,
              per_page: 0,
              total: 0,
              last_page: 0,
            },
          });
          setIsLoading(false);
        }
      );
    },
    [
      timeFilterValue.value,
      rowsPerPage,
      activePackage.value,
      paymentStatusFilter.value,
      searchTerm,
      body.from,
      body.to,
    ]
  );

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  React.useEffect(() => {
    fetcher(1);
  }, [fetcher]);

  const handlePageChange = React.useCallback(
    (event, value) => {
      fetcher(value + 1);
    },
    [fetcher]
  );

  const handleRowsPerPageChange = React.useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const paymentPopoverItems = [
    {
      id: "view",
      label: "View",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "text.primary" }}>
          <EyeIcon />
        </SvgIcon>
      ),
      onClick: () => {
        if (contentsSelection?.selected[0]?.id) {
          dispatch({
            type: "TOOGLE_PAYMENT_SIDENAV",
            payload: {
              ...paymentSideNav,
              openViewPaymentSideNav: true,
              paymentSideNavContent: contentsSelection.selected[0],
            },
          });
        }
      },
    },
  ];

  const timeFilterPopoverItems = [
    {
      id: "today",
      label: "Today",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "primary.main" }}>
          <CalendarIcon />
        </SvgIcon>
      ),
      onClick: () => {
        setTimeFilterValue({ label: "Today", value: "today" });
      },
    },
    {
      id: "yesterday",
      label: "yesterday",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "primary.main" }}>
          <CalendarIcon />
        </SvgIcon>
      ),
      onClick: () => {
        setTimeFilterValue({ label: "Yesterday", value: "yesterday" });
      },
    },
    {
      id: "1_week",
      label: "Last 7 Days",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "primary.main" }}>
          <CalendarIcon />
        </SvgIcon>
      ),
      onClick: () => {
        setTimeFilterValue({ label: "Last 7 Days", value: "1_week" });
      },
    },
    {
      id: "1_month",
      label: "Last Month",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "primary.main" }}>
          <CalendarIcon />
        </SvgIcon>
      ),
      onClick: () => {
        setTimeFilterValue({ label: "Last Month", value: "1_month" });
      },
    },
    {
      id: "6_months",
      label: "Last 6 Months",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "primary.main" }}>
          <CalendarIcon />
        </SvgIcon>
      ),
      onClick: () => {
        setTimeFilterValue({ label: "Last 6 Months", value: "6_months" });
      },
    },
    {
      id: "1_year",
      label: "Last 12 Months",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "primary.main" }}>
          <CalendarIcon />
        </SvgIcon>
      ),
      onClick: (event) => {
        setTimeFilterValue({ label: "Last 12 Months", value: "1_year" });
      },
    },
    {
      id: "custom",
      label: "Custom Date",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "primary.main" }}>
          <CalendarIcon />
        </SvgIcon>
      ),
      onClick: (event) => {
        setTimeFilterValue({
          label:
            "from" +
            body.from.format("YYYY-MM-DD") +
            ",To" +
            body.from.format("YYYY-MM-DD"),
          value: "custom",
        });
        popOver.handleOpen(event);
      },
    },
    {
      id: "ALL_DATE",
      label: "ALL",
      icon: (
        <SvgIcon fontSize="small" sx={{ color: "primary.main" }}>
          <CalendarIcon />
        </SvgIcon>
      ),
      onClick: () => {
        setTimeFilterValue({ label: "All", value: "all" });
      },
    },
  ];

  return (
    <>
      {popOver.open && (
        <CustomPopOver
          id={popOver.id}
          anchorEl={popOver.anchorRef}
          open={popOver.open}
          onClose={popOver.handleClose}
          popoverItems={popoverItems}
          showDates={true}
          from={body.from}
          to={body.to}
          handleBodyChange={handleBodyChange}
          anchorOrigin={{
            vertical: "bottom", // Align the top of the popover with the bottom of the anchor
            horizontal: "left", // Align the right side of the popover with the right side of the anchor
          }}
          transformOrigin={{
            vertical: "top", // Align the bottom of the popover with the top of the anchor
            horizontal: "left", // Align the left side of the popover with the left side of the anchor
          }}
        />
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 2,
          pb: 8,
        }}
      >
        <Container maxWidth={false}>
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
              alignItems="center"
            >
              <Stack spacing={1}>
                <Typography variant="h4">Payments</Typography>
              </Stack>
            </Stack>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Typography
                color="primary"
                variant="caption"
                sx={{ fontSize: 18 }}
              >
                Filter by Package Type
              </Typography>
              <SvgIcon fontSize="small">
                <ChevronRightIcon />
              </SvgIcon>
              <Button
                variant="outlined"
                startIcon={
                  <SvgIcon fontSize="small">
                    <CircleStackIcon />
                  </SvgIcon>
                }
                endIcon={
                  <SvgIcon fontSize="small">
                    <ChevronDownIcon />
                  </SvgIcon>
                }
                onClick={(event) => {
                  setPopoverItems(
                    packageTypes.map((item) => {
                      return {
                        id: item.value,
                        label: item.label,
                        icon: (
                          <SvgIcon
                            fontSize="small"
                            sx={{ color: "primary.main" }}
                          >
                            <CircleStackIcon />
                          </SvgIcon>
                        ),
                        onClick: () => {
                          setActivePackage({
                            label: item.label,
                            value: item.value,
                          });
                        },
                      };
                    })
                  );
                  popOver.handleOpen(event);
                }}
                sx={{ width: 200, justifyContent: "space-between" }}
              >
                {activePackage.label}
              </Button>
              <Typography
                color="primary"
                variant="caption"
                sx={{ fontSize: 18 }}
              >
                Filter by Status
              </Typography>

              <SvgIcon fontSize="small">
                <ChevronRightIcon />
              </SvgIcon>
              <Box sx={{ flex: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={
                    <SvgIcon fontSize="small">
                      <CurrencyDollarIcon />
                    </SvgIcon>
                  }
                  endIcon={
                    <SvgIcon fontSize="small">
                      <ChevronDownIcon />
                    </SvgIcon>
                  }
                  onClick={(event) => {
                    setPopoverItems(
                      paymentStatus.map((item) => {
                        return {
                          id: item.value,
                          label: item.label,
                          icon: (
                            <SvgIcon
                              fontSize="small"
                              sx={{ color: "primary.main" }}
                            >
                              <CurrencyDollarIcon />
                            </SvgIcon>
                          ),
                          onClick: () => {
                            if (item.value != "custom") {
                              setPaymentStatusFilter({
                                label: item.label,
                                value: item.value,
                              });
                            }
                          },
                        };
                      })
                    );
                    popOver.handleOpen(event);
                  }}
                  sx={{ width: 160, justifyContent: "space-between" }}
                >
                  {paymentStatusFilter.label}
                </Button>
              </Box>
              {isLoading && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress
                    size={28}
                    sx={{
                      mx: "auto",
                    }}
                  />
                </Box>
              )}
              {!isLoading && (
                <Typography color="primary" variant="h4">
                  {formatMoney(contents?.totalAmount || 0)}
                </Typography>
              )}
            </Box>

            <CustomSearch
              selectedFilterValue={timeFilterValue.label}
              popoverItems={timeFilterPopoverItems}
              handleSearch={handleSearch}
            />

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
              <CustomTable
                count={contents.pagination.total}
                items={contents.data}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                onSelectOne={contentsSelection.handleSelectOne}
                page={
                  contents.pagination.current_page >= 1
                    ? contents.pagination.current_page - 1
                    : contents.pagination.current_page
                }
                rowsPerPage={rowsPerPage}
                selected={contentsSelection.selected}
                headCells={paymentsHeadCells}
                isLoading={isLoading}
                popoverItems={paymentPopoverItems}
              />
            )}
          </Stack>
        </Container>
      </Box>
    </>
  );
}

export default Payments;
