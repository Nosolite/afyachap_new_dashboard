import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "./scrollbar";
import { EnhancedTableHead } from "./enhanced-table-head";
import EllipsisVerticalIcon from "@heroicons/react/24/solid/EllipsisVerticalIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import MinusCircleIcon from "@heroicons/react/24/solid/MinusCircleIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import { usePopover } from "../hooks/use-popover";
import { CustomPopOver } from "./custom-popover";
import { IOSSwitch } from "./IOSSwitch";
import { convertTime } from "../utils/convert-timestamp";
import { formatMoney } from "../utils/constant";
import { formatDate } from "../utils/date-formatter";

export const CustomTable = (props) => {
  const {
    order,
    orderBy,
    onRequestSort,
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = [],
    headCells,
    popoverItems,
    isLoading,
    switchFunction,
    isSubmitting,
    pinUnpinFunction,
    isPinning,
  } = props;
  const popOver = usePopover();

  return (
    <>
      {popOver.open && (
        <CustomPopOver
          id={popOver.id}
          anchorEl={popOver.anchorRef}
          open={popOver.open}
          onClose={popOver.handleClose}
          popoverItems={popoverItems}
        />
      )}
      <Card elevation={1}>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table
              sx={
                {
                  // '& th, & td': {
                  //   borderBottom: 'none',
                  // },
                }
              }
            >
              <EnhancedTableHead
                headCells={headCells}
                order={order}
                orderBy={orderBy}
                onRequestSort={onRequestSort}
              />
              <TableBody>
                {items.map((row, index) => {
                  const isSelected = selected.includes(row.id);

                  return (
                    <TableRow hover key={index} selected={isSelected}>
                      {headCells.map((column, index) => {
                        if (column.id === "userName") {
                          return (
                            <TableCell key={index}>
                              <Stack
                                alignItems="center"
                                direction="row"
                                spacing={2}
                              >
                                <Typography variant="subtitle2">
                                  {row.first_name &&
                                    `${row.first_name} ${row.last_name}`}
                                  {row.firstName &&
                                    `${row.firstName} ${row.secondName}`}
                                </Typography>
                              </Stack>
                            </TableCell>
                          );
                        } else if (
                          column.id === "icon" ||
                          column.id === "product_image" ||
                          column.id === "image"
                        ) {
                          return (
                            <TableCell key={index}>
                              <Avatar
                                variant="rounded"
                                alt="Preview Picture"
                                src={
                                  row.icon_url ||
                                  row.image_url ||
                                  row.product_image ||
                                  row.icon ||
                                  row.image
                                }
                              />
                            </TableCell>
                          );
                        } else if (column.id === "profile_image") {
                          return (
                            <TableCell key={index}>
                              <Avatar
                                variant="rounded"
                                alt="Profile Picture"
                                src={
                                  row.doc_profile_image ||
                                  row.profileImage ||
                                  row.icon
                                }
                              />
                            </TableCell>
                          );
                        } else if (column.id === "medical_test_names") {
                          const jsonString = row.medical_test_names;
                          const testObject = JSON.parse(jsonString);
                          return (
                            <TableCell key={index}>
                              {testObject.map((test, index) => {
                                return (
                                  <Typography key={index}>
                                    ▶ {test.test_name}({test.test_code})
                                  </Typography>
                                );
                              })}
                            </TableCell>
                          );
                        } else if (column.id === "medicine_prescription") {
                          const jsonString = row.medicine_prescription;
                          const testObject = JSON.parse(jsonString);
                          return (
                            <TableCell key={index}>
                              {testObject.map((test, index) => {
                                return (
                                  <Typography key={index}>
                                    ▶ {test.name}({test.unit})
                                  </Typography>
                                );
                              })}
                            </TableCell>
                          );
                        } else if (column.id === "final_diagnosis") {
                          const jsonString = row.final_diagnosis;
                          const testObject = JSON.parse(jsonString);
                          return (
                            <TableCell key={index}>
                              {testObject.map((test, index) => {
                                return (
                                  <Typography key={index}>
                                    ▶ {test.name}({test.code})
                                  </Typography>
                                );
                              })}
                            </TableCell>
                          );
                        } else if (column.id === "interests") {
                          if (row.interests === "") {
                            return (
                              <TableCell key={column.id}>
                                {row[column.id]}
                              </TableCell>
                            );
                          }
                          const jsonString = row.interests;
                          const interestsObject = JSON.parse(jsonString);
                          return (
                            <TableCell key={index}>
                              {interestsObject.map((interest, index) => {
                                return (
                                  <Typography key={index}>
                                    ▶ {interest.interest_name}
                                  </Typography>
                                );
                              })}
                            </TableCell>
                          );
                        } else if (column.id === "switch") {
                          return (
                            <TableCell key={index}>
                              {isSubmitting && selected[0]?.id === row.id ? (
                                <CircularProgress size={26} />
                              ) : (
                                <IOSSwitch
                                  checked={
                                    row.is_published === "YES" ||
                                    row.is_verified === "YES" ||
                                    row.status === "ACTIVE" ||
                                    row.status === "AVAILABLE"
                                      ? true
                                      : false
                                  }
                                  onChange={() => switchFunction(row)}
                                />
                              )}
                            </TableCell>
                          );
                        } else if (column.id === "pinned") {
                          return (
                            <TableCell key={index}>
                              {isPinning && selected[0]?.id === row.id ? (
                                <CircularProgress size={26} />
                              ) : (
                                <IOSSwitch
                                  checked={row.pinned}
                                  onChange={() => pinUnpinFunction(row)}
                                />
                              )}
                            </TableCell>
                          );
                        } else if (
                          column.id === "payment_status" ||
                          column.id === "order_status" ||
                          column.id === "product_status" ||
                          column.id === "status"
                        ) {
                          return (
                            <TableCell key={index}>
                              <Chip
                                style={{
                                  backgroundColor:
                                    row.status === "COMPLETED" ||
                                    row.status === "ACTIVE" ||
                                    row.status === "success" ||
                                    (row.payment_status === "COMPLETED" &&
                                      column.id === "payment_status") ||
                                    (row.order_status === "DELIVERED" &&
                                      column.id === "order_status") ||
                                    row.status === "AVAILABLE"
                                      ? "rgb(209 250 229)"
                                      : "rgb(254 243 199)",
                                  color:
                                    row.status === "COMPLETED" ||
                                    row.status === "ACTIVE" ||
                                    row.status === "success" ||
                                    (row.payment_status === "COMPLETED" &&
                                      column.id === "payment_status") ||
                                    (row.order_status === "DELIVERED" &&
                                      column.id === "order_status") ||
                                    row.status === "AVAILABLE"
                                      ? "rgb(5 150 105)"
                                      : "rgb(217 119 6)",
                                }}
                                label={
                                  row.order_status &&
                                  column.id === "order_status"
                                    ? row.order_status
                                    : row.payment_status &&
                                      column.id === "payment_status"
                                    ? row.payment_status
                                    : row.status
                                }
                                sx={{
                                  width: 110,
                                  color: "black",
                                }}
                              />
                            </TableCell>
                          );
                        } else if (column.id === "is_package_free") {
                          return (
                            <TableCell key={index}>
                              <Chip
                                label={
                                  row.is_package_free === "NO"
                                    ? "PREMIUM"
                                    : "FREE"
                                }
                                sx={{
                                  width: 110,
                                  backgroundColor:
                                    row.is_package_free === "NO"
                                      ? "rgb(209 250 229)"
                                      : "rgb(254 243 199)",
                                  color:
                                    row.is_package_free === "NO"
                                      ? "rgb(5 150 105)"
                                      : "rgb(217 119 6)",
                                }}
                              />
                            </TableCell>
                          );
                        } else if (
                          column.id === "product_category_color" ||
                          column.id === "service_color"
                        ) {
                          return (
                            <TableCell key={index}>
                              <Avatar
                                variant="rounded"
                                sx={{
                                  bgcolor:
                                    row?.product_category_color ||
                                    row?.service_color ||
                                    row?.color,
                                }}
                                src={
                                  row.icon_url || row?.image_url || row?.icon
                                }
                              />
                            </TableCell>
                          );
                        } else if (column.id === "location") {
                          return (
                            <TableCell key={index}>
                              {row.region},<br />
                              {row.district},<br />
                              {row.street}.
                            </TableCell>
                          );
                        } else if (column.id === "approval") {
                          return (
                            <TableCell key={index}>
                              <SvgIcon
                                fontSize="small"
                                sx={{
                                  color:
                                    row[column.id] === "APPROVED"
                                      ? "primary.main"
                                      : row[column.id] === "REJECTED"
                                      ? "error.main"
                                      : "info.main",
                                }}
                              >
                                {row[column.id] === "APPROVED" ? (
                                  <CheckCircleIcon />
                                ) : row[column.id] === "REJECTED" ? (
                                  <XCircleIcon />
                                ) : (
                                  <MinusCircleIcon />
                                )}
                              </SvgIcon>
                            </TableCell>
                          );
                        } else if (column.id === "actions") {
                          return (
                            <TableCell key={index}>
                              <IconButton
                                onClick={(event) => {
                                  popOver.handleOpen(event);
                                  onSelectOne(row);
                                }}
                              >
                                <SvgIcon
                                  fontSize="small"
                                  sx={{ color: "text.primary" }}
                                >
                                  <EllipsisVerticalIcon />
                                </SvgIcon>
                              </IconButton>
                            </TableCell>
                          );
                        } else if (
                          column.id === "amount" ||
                          column.id === "session_fee" ||
                          column.id === "product_amount" ||
                          column.id === "product_promotion_amount" ||
                          column.id === "product_shipping_cost_in_dar" ||
                          column.id === "product_shipping_cost_in_other_regions"
                        ) {
                          return (
                            <TableCell key={index}>
                              <Typography
                                sx={{
                                  color: "rgb(5 150 105)",
                                }}
                              >
                                {formatMoney(row[column.id])}
                              </Typography>
                            </TableCell>
                          );
                        } else if (column.id === "order_id") {
                          return (
                            <TableCell key={index}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Avatar
                                  variant="square"
                                  sx={{ mr: 2, height: 20, width: 20 }}
                                  src="https://afyachap.com/images/images/icon-01.svg"
                                />
                                <Typography
                                  sx={{
                                    color: "rgb(14 165 233)",
                                  }}
                                >
                                  #{row.order_id}
                                </Typography>
                              </Box>
                            </TableCell>
                          );
                        } else {
                          return (
                            <TableCell key={column.id}>
                              {column.id === "campaign_description" ? (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: row.description,
                                  }}
                                />
                              ) : column.id === "start_time" ||
                                column.id === "end_time" ? (
                                formatDate(row[column.id])
                              ) : column.id === "added_at" ? (
                                formatDate(row.created_at)
                              ) : column.id === "notification_interval" ? (
                                convertTime(row[column.id])
                              ) : (
                                row[column.id]
                              )}
                            </TableCell>
                          );
                        }
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        {items.length === 0 && isLoading && (
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
        {items.length === 0 && !isLoading && (
          <Typography
            sx={{ my: 3 }}
            align="center"
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            No items
          </Typography>
        )}
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      </Card>
    </>
  );
};

CustomTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
  headCells: PropTypes.array.isRequired,
};
