import PropTypes from "prop-types";
import {
  Box,
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { Scrollbar } from "./scrollbar";
import { EnhancedTableHead } from "./enhanced-table-head";
import { usePopover } from "../hooks/use-popover";
import { CustomPopOver } from "./custom-popover";
import { renderCellContent } from "./table-cell-content";
import { useIsMobile } from "../hooks/use-is-mobile";
import { MobileDataList } from "./mobile/mobile-data-list";

const DesktopTable = (props) => {
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
    submittingId,
    pinUnpinFunction,
    isPinning,
  } = props;
  const popOver = usePopover();

  const handleActionClick = (event, row) => {
    popOver.handleOpen(event);
    onSelectOne?.(row);
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
      <Card elevation={1} sx={{ position: "relative" }}>
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
                {items.map((row, index) => {
                  const isSelected = selected.includes(row.id);
                  const cellContext = {
                    isSwitchLoading: Boolean(isSubmitting) && selected[0]?.id === row.id,
                    isPinLoading: Boolean(isPinning) && selected[0]?.id === row.id,
                    isEnabledLoading: Boolean(isSubmitting) && submittingId === row.id,
                    isSubmitting,
                    onSwitch: switchFunction,
                    onPin: pinUnpinFunction,
                    onActionClick: handleActionClick,
                  };

                  return (
                    <TableRow hover key={index} selected={isSelected}>
                      {headCells.map((column, cellIndex) => (
                        <TableCell key={cellIndex}>
                          {renderCellContent(column, row, cellContext)}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        {isLoading && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              display: "flex",
              alignItems: items.length ? "flex-start" : "center",
              justifyContent: "center",
              bgcolor: "rgba(255, 255, 255, 0.65)",
              pt: items.length ? 10 : 0,
            }}
          >
            <CircularProgress sx={{ my: 3 }} />
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

export const CustomTable = (props) => {
  const isMobile = useIsMobile();

  return isMobile ? <MobileDataList {...props} /> : <DesktopTable {...props} />;
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
