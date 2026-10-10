import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Card,
  Chip,
  Collapse,
  Divider,
  IconButton,
  LinearProgress,
  Skeleton,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import EllipsisVerticalIcon from "@heroicons/react/24/solid/EllipsisVerticalIcon";
import ChevronLeftIcon from "@heroicons/react/24/outline/ChevronLeftIcon";
import ChevronRightIcon from "@heroicons/react/24/outline/ChevronRightIcon";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";
import InboxIcon from "@heroicons/react/24/outline/InboxIcon";
import {
  ApprovalIcon,
  MEDIA_COLUMNS,
  STATUS_COLUMNS,
  TOGGLE_COLUMNS,
  renderCellContent,
} from "../table-cell-content";
import { MobileActionSheet } from "./mobile-action-sheet";

const VISIBLE_DETAIL_COUNT = 4;
const ROWS_PER_PAGE_OPTIONS = [5, 10, 25, 50, 100];

const TOGGLE_FALLBACK_LABELS = {
  switch: "Active",
  pinned: "Pinned",
  is_enabled: "Enabled",
};

const isEmptyValue = (value) =>
  value === undefined || value === null || value === "";

// Splits a table's columns into the roles a mobile card needs: a leading image,
// a title line, a subtitle line, status badges, toggles and the remaining details.
const getCardLayout = (headCells) => {
  const media = headCells.find((cell) => MEDIA_COLUMNS.includes(cell.id));
  const toggles = headCells.filter((cell) => TOGGLE_COLUMNS.includes(cell.id));
  const badges = headCells.filter((cell) => STATUS_COLUMNS.includes(cell.id));
  const hasActions = headCells.some((cell) => cell.id === "actions");
  const idCell = headCells.find((cell) => cell.id === "id" || cell.id === "order_id");

  const textCells = headCells.filter(
    (cell) =>
      cell !== idCell &&
      cell.id !== "actions" &&
      !MEDIA_COLUMNS.includes(cell.id) &&
      !TOGGLE_COLUMNS.includes(cell.id) &&
      !STATUS_COLUMNS.includes(cell.id)
  );

  const [title, subtitle, ...details] = textCells;

  return { media, toggles, badges, hasActions, idCell, title, subtitle, details };
};

const DetailRow = ({ column, row }) => {
  const value = renderCellContent(column, row);

  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        variant="caption"
        color="text.secondary"
        component="div"
        noWrap
        sx={{ textTransform: "uppercase", letterSpacing: 0.4, fontSize: 10.5 }}
      >
        {column.label || column.id}
      </Typography>
      <Typography
        variant="body2"
        component="div"
        sx={{ wordBreak: "break-word", fontWeight: 500 }}
      >
        {isEmptyValue(value) ? "—" : value}
      </Typography>
    </Box>
  );
};

const StatusBadge = ({ column, row }) => {
  if (column.id === "approval") {
    const value = row.approval || "PENDING";
    return (
      <Chip
        size="small"
        variant="outlined"
        icon={<ApprovalIcon value={row.approval} />}
        label={value}
        sx={{ fontWeight: 600 }}
      />
    );
  }

  return (
    <Box sx={{ "& .MuiChip-root": { width: "auto", height: 26, fontSize: 12, fontWeight: 600 } }}>
      {renderCellContent(column, row)}
    </Box>
  );
};

const MobileRowCard = ({
  row,
  layout,
  cellContext,
  onOpenActions,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const { media, toggles, badges, hasActions, idCell, title, subtitle, details } = layout;
  const visibleDetails = details.slice(0, VISIBLE_DETAIL_COUNT);
  const hiddenDetails = details.slice(VISIBLE_DETAIL_COUNT);
  const titleValue = title ? renderCellContent(title, row) : null;
  const subtitleValue = subtitle ? renderCellContent(subtitle, row) : null;
  const idValue = idCell ? row[idCell.id] : null;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: 1,
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="flex-start"
        onClick={hasActions ? () => onOpenActions(row) : undefined}
        sx={{
          p: 2,
          pb: 1.5,
          cursor: hasActions ? "pointer" : "default",
          "&:active": hasActions ? { bgcolor: "action.hover" } : undefined,
        }}
      >
        {media && (
          <Box sx={{ flexShrink: 0, "& .MuiAvatar-root": { width: 48, height: 48, borderRadius: 2.5 } }}>
            {renderCellContent(media, row)}
          </Box>
        )}
        <Box sx={{ flex: "1 1 auto", minWidth: 0 }}>
          {!isEmptyValue(idValue) && (
            <Typography variant="caption" color="text.secondary" component="div">
              #{idValue}
            </Typography>
          )}
          <Typography
            variant="subtitle1"
            component="div"
            sx={{
              fontWeight: 700,
              lineHeight: 1.3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              wordBreak: "break-word",
            }}
          >
            {isEmptyValue(titleValue) ? (title?.label || "Untitled") : titleValue}
          </Typography>
          {!isEmptyValue(subtitleValue) && (
            <Typography
              variant="body2"
              color="text.secondary"
              component="div"
              sx={{
                mt: 0.25,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                wordBreak: "break-word",
              }}
            >
              {subtitleValue}
            </Typography>
          )}
        </Box>
        {hasActions && (
          <IconButton
            size="small"
            aria-label="actions"
            onClick={(event) => {
              event.stopPropagation();
              onOpenActions(row);
            }}
            sx={{ mt: -0.5, mr: -1 }}
          >
            <SvgIcon fontSize="small">
              <EllipsisVerticalIcon />
            </SvgIcon>
          </IconButton>
        )}
      </Stack>

      {badges.length > 0 && (
        <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ px: 2, pb: 1.5 }}>
          {badges.map((column) => (
            <StatusBadge key={column.id} column={column} row={row} />
          ))}
        </Stack>
      )}

      {visibleDetails.length > 0 && (
        <Box sx={{ px: 2, pb: 1.5 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 2, rowGap: 1.25 }}>
            {visibleDetails.map((column) => (
              <DetailRow key={column.id} column={column} row={row} />
            ))}
          </Box>
          {hiddenDetails.length > 0 && (
            <>
              <Collapse in={expanded} unmountOnExit>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", columnGap: 2, rowGap: 1.25, mt: 1.25 }}>
                  {hiddenDetails.map((column) => (
                    <DetailRow key={column.id} column={column} row={row} />
                  ))}
                </Box>
              </Collapse>
              <Button
                size="small"
                onClick={() => setExpanded((value) => !value)}
                endIcon={
                  <SvgIcon
                    fontSize="small"
                    sx={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                  >
                    <ChevronDownIcon />
                  </SvgIcon>
                }
                sx={{ mt: 1, px: 0, minWidth: 0 }}
              >
                {expanded ? "Show less" : `Show ${hiddenDetails.length} more`}
              </Button>
            </>
          )}
        </Box>
      )}

      {toggles.length > 0 && (
        <>
          <Divider />
          <Stack divider={<Divider flexItem />}>
            {toggles.map((column) => (
              <Stack
                key={column.id}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ px: 2, py: 1, minHeight: 52 }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {column.label || TOGGLE_FALLBACK_LABELS[column.id]}
                </Typography>
                {renderCellContent(column, row, cellContext)}
              </Stack>
            ))}
          </Stack>
        </>
      )}
    </Card>
  );
};

const LoadingCards = () => (
  <Stack spacing={1.5}>
    {[0, 1, 2].map((key) => (
      <Card key={key} elevation={0} sx={{ borderRadius: 4, border: 1, borderColor: "divider", p: 2 }}>
        <Stack direction="row" spacing={1.5}>
          <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: 2.5 }} />
          <Box sx={{ flex: 1 }}>
            <Skeleton width="70%" height={24} />
            <Skeleton width="45%" />
          </Box>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
          <Skeleton width="40%" />
          <Skeleton width="40%" />
        </Stack>
      </Card>
    ))}
  </Stack>
);

const EmptyState = () => (
  <Stack alignItems="center" spacing={1} sx={{ py: 6, color: "text.secondary" }}>
    <SvgIcon sx={{ fontSize: 44, opacity: 0.6 }}>
      <InboxIcon />
    </SvgIcon>
    <Typography variant="subtitle1" color="text.secondary">
      No items
    </Typography>
  </Stack>
);

const MobilePager = ({ count, page, rowsPerPage, onPageChange, onRowsPerPageChange }) => {
  const [rowsSheetOpen, setRowsSheetOpen] = React.useState(false);

  if (!count) {
    return null;
  }

  const from = page * rowsPerPage + 1;
  const to = Math.min(count, (page + 1) * rowsPerPage);
  const hasPrevious = page > 0;
  const hasNext = (page + 1) * rowsPerPage < count;

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pt: 1, px: 0.5 }}
      >
        <Box>
          <Typography variant="body2" fontWeight={600}>
            {`${from}–${to} of ${count}`}
          </Typography>
          {onRowsPerPageChange && (
            <Button
              size="small"
              onClick={() => setRowsSheetOpen(true)}
              sx={{ px: 0, minWidth: 0 }}
            >
              {`${rowsPerPage} per page`}
            </Button>
          )}
        </Box>
        <Stack direction="row" spacing={1}>
          <IconButton
            aria-label="previous page"
            disabled={!hasPrevious}
            onClick={(event) => onPageChange(event, page - 1)}
            sx={{ border: 1, borderColor: "divider", width: 44, height: 44 }}
          >
            <SvgIcon fontSize="small">
              <ChevronLeftIcon />
            </SvgIcon>
          </IconButton>
          <IconButton
            aria-label="next page"
            disabled={!hasNext}
            onClick={(event) => onPageChange(event, page + 1)}
            sx={{ border: 1, borderColor: "divider", width: 44, height: 44 }}
          >
            <SvgIcon fontSize="small">
              <ChevronRightIcon />
            </SvgIcon>
          </IconButton>
        </Stack>
      </Stack>
      {onRowsPerPageChange && (
        <MobileActionSheet
          open={rowsSheetOpen}
          onClose={() => setRowsSheetOpen(false)}
          title="Items per page"
          selectedLabel={`${rowsPerPage}`}
          items={ROWS_PER_PAGE_OPTIONS.map((option) => ({
            id: option,
            label: `${option}`,
            onClick: () => onRowsPerPageChange({ target: { value: option } }),
          }))}
        />
      )}
    </>
  );
};

export const MobileDataList = (props) => {
  const {
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
  const [actionsOpen, setActionsOpen] = React.useState(false);
  const layout = React.useMemo(() => getCardLayout(headCells), [headCells]);

  const handleOpenActions = (row) => {
    onSelectOne?.(row);
    setActionsOpen(true);
  };

  return (
    <Box sx={{ position: "relative" }}>
      {isLoading && items.length > 0 && (
        <LinearProgress
          sx={{ position: "absolute", top: -8, left: 0, right: 0, borderRadius: 1, height: 3 }}
        />
      )}
      {isLoading && items.length === 0 ? (
        <LoadingCards />
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <Stack
          spacing={1.5}
          sx={{ opacity: isLoading ? 0.6 : 1, transition: "opacity 0.2s" }}
        >
          {items.map((row, index) => (
            <MobileRowCard
              key={`${row.id ?? ""}-${index}`}
              row={row}
              layout={layout}
              onOpenActions={handleOpenActions}
              cellContext={{
                isSwitchLoading: Boolean(isSubmitting) && selected[0]?.id === row.id,
                isPinLoading: Boolean(isPinning) && selected[0]?.id === row.id,
                isEnabledLoading: Boolean(isSubmitting) && submittingId === row.id,
                isSubmitting,
                onSwitch: switchFunction,
                onPin: pinUnpinFunction,
              }}
            />
          ))}
        </Stack>
      )}
      <MobilePager
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
      {popoverItems && (
        <MobileActionSheet
          open={actionsOpen}
          onClose={() => setActionsOpen(false)}
          title="Actions"
          items={popoverItems}
        />
      )}
    </Box>
  );
};

MobileDataList.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array,
  headCells: PropTypes.array.isRequired,
  popoverItems: PropTypes.array,
  isLoading: PropTypes.bool,
};
