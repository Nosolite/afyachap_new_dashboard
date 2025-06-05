import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";
import {
  Box,
  Button,
  Card,
  InputAdornment,
  OutlinedInput,
  SvgIcon,
} from "@mui/material";
import { CustomPopOver } from "./custom-popover";
import { usePopover } from "../hooks/use-popover";
import AdjustmentsHorizontalIcon from "@heroicons/react/24/outline/AdjustmentsHorizontalIcon";
import ChevronDownIcon from "@heroicons/react/24/outline/ChevronDownIcon";

export const CustomSearch = ({
  body,
  handleBodyChange,
  handleSearch,
  selectedFilterValue,
  popoverItems,
}) => {
  const popOver = usePopover();

  return (
    <>
      {popOver.open && body && (
        <CustomPopOver
          id={popOver.id}
          anchorEl={popOver.anchorRef}
          open={popOver.open}
          onClose={popOver.handleClose}
          showDates={true}
          from={body.from}
          to={body.to}
          handleBodyChange={handleBodyChange}
        />
      )}
      {popOver.open && popoverItems && selectedFilterValue && (
        <CustomPopOver
          id={popOver.id}
          anchorEl={popOver.anchorRef}
          open={popOver.open}
          onClose={popOver.handleClose}
          popoverItems={popoverItems}
        />
      )}
      <Card
        elevation={1}
        sx={{
          p: 2,
          alignItems: "center",
          display: "flex",
          alignContent: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <OutlinedInput
          defaultValue=""
          fullWidth
          placeholder="Search"
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon color="action" fontSize="small">
                <MagnifyingGlassIcon />
              </SvgIcon>
            </InputAdornment>
          }
          sx={{ maxWidth: 500, borderRadius: 50 }}
          onChange={(event) => handleSearch && handleSearch(event)}
        />
        <Box
          boxShadow={1}
          sx={{
            alignItems: "center",
            display: "flex",
            alignContent: "center",
          }}
        >
          {body && handleBodyChange && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Button
                sx={{
                  color: "grey",
                }}
                variant="outlined"
                startIcon={
                  <SvgIcon sx={{ mr: 1 }} fontSize="small">
                    <AdjustmentsHorizontalIcon />
                  </SvgIcon>
                }
                endIcon={
                  <SvgIcon fontSize="small">
                    <ChevronDownIcon />
                  </SvgIcon>
                }
                onClick={(event) => {
                  popOver.handleOpen(event);
                }}
              >
                {`${body.from.format("MMMM D, YYYY HH:mm:ss")} - `}
                {`${body.to.format("MMMM D, YYYY HH:mm:ss")}`}
              </Button>
            </Box>
          )}
          {popoverItems && selectedFilterValue && (
            <Button
              variant="outlined"
              startIcon={
                <SvgIcon fontSize="small">
                  <AdjustmentsHorizontalIcon />
                </SvgIcon>
              }
              endIcon={
                <SvgIcon fontSize="small">
                  <ChevronDownIcon />
                </SvgIcon>
              }
              onClick={(event) => {
                popOver.handleOpen(event);
              }}
            >
              {selectedFilterValue}
            </Button>
          )}
        </Box>
      </Card>
    </>
  );
};
