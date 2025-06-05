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

export const CustomPopOver = (props) => {
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
                // Pass the event object to the onClick handler
                if (item.onClick) {
                  item.onClick(event);
                }
                onClose(); // Close the popover after the click
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
