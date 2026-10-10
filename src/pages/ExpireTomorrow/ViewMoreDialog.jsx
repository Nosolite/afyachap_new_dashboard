import React from "react";
import {
  DialogContent,
  Slide,
  Tab,
  Tabs,
} from "@mui/material";
import { AppDialog, DialogCloseBar } from "../../components/app-dialog";
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
    <AppDialog
      open={open}
      TransitionComponent={Transition}
      aria-describedby="form-dialog"
      fullWidth={true}
      maxWidth={"lg"}
    >
      <DialogCloseBar
        onClose={handleClose}
        iconSize="small"
        title="Subscriber Details"
      />
      <DialogContent>
        <UserSubscriberDetails userId={selected} />
      </DialogContent>
    </AppDialog>
  );
}

export default ViewMoreDialog;
