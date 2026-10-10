import {
  Card,
  CardContent,
  ListItemIcon,
  MenuItem,
  MenuList,
  Popover,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useIsMobile } from "../hooks/use-is-mobile";
import { MobileActionSheet } from "./mobile/mobile-action-sheet";
import { MobileDateRangeSheet } from "./mobile/mobile-date-range-sheet";

const DesktopPopOver = (props) => {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const {
    anchorEl,
    onClose,
    open,
    id,
    popoverItems,
    from,
    to,
    handleBodyChange,
  } = props;

  return (
    <Popover
      id={id}
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{
        horizontal: "left",
        vertical: "bottom",
      }}
      slotProps={{
        sx: {
          maxWidth: popoverItems ? "250px" : lgUp ? "400px" : "100vw",
        },
      }}
    >
      {popoverItems && (
        <MenuList
          disablePadding
          sx={{
            "& > *": {
              padding: "12px 16px",
            },
          }}
        >
          {popoverItems.map((item, index) => (
            <MenuItem
              key={index}
              onClick={(event) => {
                if (item.onClick) {
                  item.onClick(event);
                }
                onClose();
              }}
            >
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              <Typography variant="inherit" noWrap>
                {item.label}
              </Typography>
            </MenuItem>
          ))}
        </MenuList>
      )}
      {from && (
        <Card>
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <DateTimePicker
              label={"From"}
              sx={{ mr: 1 }}
              value={from}
              onChange={(newValue) => {
                handleBodyChange(newValue, "from");
              }}
            />
            <DateTimePicker
              label={"To"}
              value={to}
              onChange={(newValue) => {
                handleBodyChange(newValue, "to");
              }}
            />
          </CardContent>
        </Card>
      )}
    </Popover>
  );
};

export const CustomPopOver = (props) => {
  const isMobile = useIsMobile();
  const { open, onClose, popoverItems, from, to, handleBodyChange, title, selectedLabel } = props;

  if (!isMobile) {
    return <DesktopPopOver {...props} />;
  }

  if (popoverItems) {
    return (
      <MobileActionSheet
        open={open}
        onClose={onClose}
        title={title}
        items={popoverItems}
        selectedLabel={selectedLabel}
      />
    );
  }

  if (from) {
    return (
      <MobileDateRangeSheet
        open={open}
        onClose={onClose}
        from={from}
        to={to}
        onChange={handleBodyChange}
      />
    );
  }

  return null;
};
