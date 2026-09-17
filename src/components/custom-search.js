import React from "react";
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

const SEARCH_DEBOUNCE_MS = 2000;

const FilterButton = ({ selectedValue, items, disabled = false }) => {
  const popOver = usePopover();

  return (
    <>
      {popOver.open && items && selectedValue && (
        <CustomPopOver
          id={popOver.id}
          anchorEl={popOver.anchorRef}
          open={popOver.open}
          onClose={popOver.handleClose}
          popoverItems={items}
        />
      )}
      {items && selectedValue && (
        <Button
          variant="outlined"
          disabled={disabled}
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
          {selectedValue}
        </Button>
      )}
    </>
  );
};

export const CustomSearch = ({
  body,
  handleBodyChange,
  handleSearch,
  selectedFilterValue,
  popoverItems,
  filters,
}) => {
  const datePopOver = usePopover();
  const debounceTimeoutRef = React.useRef(null);

  const filterGroups = React.useMemo(() => {
    if (filters?.length) {
      return filters;
    }
    if (popoverItems && selectedFilterValue) {
      return [{ selectedValue: selectedFilterValue, items: popoverItems }];
    }
    return [];
  }, [filters, popoverItems, selectedFilterValue]);

  React.useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchChange = (event) => {
    if (!handleSearch) {
      return;
    }

    const value = event.target.value;

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      handleSearch({ target: { value } });
    }, SEARCH_DEBOUNCE_MS);
  };

  return (
    <>
      {datePopOver.open && body && (
        <CustomPopOver
          id={datePopOver.id}
          anchorEl={datePopOver.anchorRef}
          open={datePopOver.open}
          onClose={datePopOver.handleClose}
          showDates={true}
          from={body.from}
          to={body.to}
          handleBodyChange={handleBodyChange}
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
          onChange={handleSearchChange}
        />
        <Box
          boxShadow={1}
          sx={{
            alignItems: "center",
            display: "flex",
            alignContent: "center",
            flexWrap: "wrap",
            gap: 1,
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
                  datePopOver.handleOpen(event);
                }}
              >
                {`${body.from.format("MMMM D, YYYY HH:mm:ss")} - `}
                {`${body.to.format("MMMM D, YYYY HH:mm:ss")}`}
              </Button>
            </Box>
          )}
          {filterGroups.map((filter, index) => (
            <FilterButton
              key={filter.key || index}
              selectedValue={filter.selectedValue}
              items={filter.items}
              disabled={filter.disabled}
            />
          ))}
        </Box>
      </Card>
    </>
  );
};
