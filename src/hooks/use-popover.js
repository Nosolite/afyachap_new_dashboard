import { useCallback, useState } from "react";

export function usePopover() {
  const [anchorRef, setAnchorRef] = useState(null);
  const open = Boolean(anchorRef);
  const id = open ? "popover-id" : undefined;

  const handleOpen = useCallback((event) => {
    if (event && event.currentTarget) {
      setAnchorRef(event.currentTarget);
    } else {
      console.error("Missing or invalid event in handleOpen");
    }
  }, []);

  const handleClose = useCallback(() => {
    setAnchorRef(null);
  }, []);

  const handleToggle = useCallback(
    (event) => {
      if (anchorRef) {
        handleClose();
      } else {
        handleOpen(event);
      }
    },
    [anchorRef, handleClose, handleOpen]
  );

  return {
    anchorRef,
    handleClose,
    handleOpen,
    handleToggle,
    open,
    id,
  };
}
