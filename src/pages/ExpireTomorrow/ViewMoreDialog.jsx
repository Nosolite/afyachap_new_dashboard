import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Slide,
  SvgIcon,
  Tab,
  Tabs,
} from "@mui/material";
import XMarkIcon from "@heroicons/react/24/outline/XMarkIcon";
import { Scrollbar } from "../../components/scrollbar";
import UserSubscriberDetails from "../Payments/UserSubscriberDetails";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function ViewMoreDialog({ open, handleClose, selected }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState(0);

  const handleTabChange = React.useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  // Log the selected user ID
  console.log("Selected User ID:", selected);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      aria-describedby="form-dialog"
      fullWidth={true}
      maxWidth={"lg"}
    >
      <DialogActions>
        <IconButton
          edge="start"
          color="inherit"
          onClick={() => {
            handleClose();
          }}
          aria-label="close"
        >
          <SvgIcon fontSize="small">
            <XMarkIcon />
          </SvgIcon>
        </IconButton>
      </DialogActions>
      <DialogContent>
        <UserSubscriberDetails userId={selected} />
      </DialogContent>
    </Dialog>
  );
}

export default ViewMoreDialog;
