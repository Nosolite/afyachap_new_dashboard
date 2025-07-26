import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Card,
  Chip,
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
import { Scrollbar } from "../../components/scrollbar";
import { EnhancedTableHead } from "../../components/enhanced-table-head";
import EllipsisVerticalIcon from "@heroicons/react/24/solid/EllipsisVerticalIcon";
import { usePopover } from "../../hooks/use-popover";
import { CustomPopOver } from "../../components/custom-popover";
import { formatMoney } from "../../utils/constant";
import { formatDate } from "../../utils/date-formatter";

export const UsersRenewCustomTable = ({
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
}) => {
  const popOver = usePopover();

  const renderCell = (row, column, index) => {
    switch (column.id) {
      case "Name":
        return (
          <TableCell key={index}>
            <Stack alignItems="center" direction="row" spacing={2}>
              <Avatar
                variant="rounded"
                src={row.profileImage || "default-profile.png"}
                alt={`${row.firstName} ${row.lastName}`}
                sx={{ width: 30, height: 30 }}
              />
              <Typography variant="body1">{`${row.firstName} ${row.secondName}`}</Typography>
            </Stack>
          </TableCell>
        );

      case "status":
        const statusValue = row[column.id] || row.status;

        // Only render the Chip if statusValue is defined
        if (!statusValue) {
          return <TableCell key={index}>N/A</TableCell>; // You can replace 'N/A' with any fallback value you'd prefer
        }

        const chipStyle = {
          backgroundColor: ["ACTIVE", "AVAILABLE"].includes(statusValue)
            ? "rgb(209 250 229)"
            : "rgb(254 243 199)",
          color: ["ACTIVE", "AVAILABLE"].includes(statusValue)
            ? "rgb(5 150 105)"
            : "rgb(217 119 6)",
        };

        return (
          <TableCell key={index}>
            <Chip label={statusValue} sx={{ width: 110, ...chipStyle }} />
          </TableCell>
        );

      case "actions":
        return (
          <TableCell key={index}>
            <IconButton
              onClick={(event) => {
                popOver.handleOpen(event);
                onSelectOne(row);
              }}
            >
              <SvgIcon fontSize="small" sx={{ color: "text.primary" }}>
                <EllipsisVerticalIcon />
              </SvgIcon>
            </IconButton>
          </TableCell>
        );

      case "amount":
      case "session_fee":
        return (
          <TableCell key={index}>
            <Typography sx={{ color: "rgb(5 150 105)" }}>
              {formatMoney(row[column.id])}
            </Typography>
          </TableCell>
        );

      case "order_id":
        return (
          <TableCell key={index}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                variant="square"
                sx={{ mr: 2, height: 20, width: 20 }}
                src="https://afyachap.com/images/images/icon-01.svg"
              />
              <Typography sx={{ color: "rgb(14 165 233)" }}>
                #{row.order_id}
              </Typography>
            </Box>
          </TableCell>
        );

      default:
        return (
          <TableCell key={column.id}>
            {column.id === "campaign_description" ? (
              <div dangerouslySetInnerHTML={{ __html: row.description }} />
            ) : column.id === "start_time" || column.id === "end_time" ? (
              formatDate(row[column.id])
            ) : column.id === "added_at" ? (
              formatDate(row.created_at)
            ) : (
              row[column.id]
            )}
          </TableCell>
        );
    }
  };

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
            <Table>
              <EnhancedTableHead
                headCells={headCells}
                order={order}
                orderBy={orderBy}
                onRequestSort={onRequestSort}
              />
              <TableBody>
                {items.map((row, rowIndex) => (
                  <TableRow
                    hover
                    key={rowIndex}
                    selected={selected.includes(row.id)}
                  >
                    {headCells.map((column, columnIndex) =>
                      renderCell(row, column, columnIndex)
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <TablePagination
          component="div"
          count={count}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </Card>
    </>
  );
};

UsersRenewCustomTable.propTypes = {
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  count: PropTypes.number.isRequired,
  items: PropTypes.array.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onRowsPerPageChange: PropTypes.func.isRequired,
  onSelectOne: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  selected: PropTypes.array.isRequired,
  headCells: PropTypes.array.isRequired,
  popoverItems: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
