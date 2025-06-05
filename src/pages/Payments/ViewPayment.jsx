import { Box, Drawer } from "@mui/material";
import * as React from "react";

export default function ViewPayment({ open, toggleDrawer }) {
  const list = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    ></Box>
  );

  return (
    <Drawer anchor={"right"} open={open} onClose={toggleDrawer(false)}>
      {list()}
    </Drawer>
  );
}
