import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Chip,
  InputAdornment,
  OutlinedInput,
  Stack,
  SvgIcon,
} from '@mui/material';
import MagnifyingGlassIcon from '@heroicons/react/24/outline/MagnifyingGlassIcon';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import CalendarDaysIcon from '@heroicons/react/24/outline/CalendarDaysIcon';
import { MobileActionSheet } from './mobile-action-sheet';
import { MobileDateRangeSheet } from './mobile-date-range-sheet';

const FilterChip = ({ label, icon, onClick, disabled, active }) => (
  <Chip
    label={label}
    icon={icon}
    onClick={onClick}
    disabled={disabled}
    variant={active ? 'filled' : 'outlined'}
    color={active ? 'primary' : 'default'}
    onDelete={onClick}
    deleteIcon={(
      <SvgIcon fontSize="small">
        <ChevronDownIcon />
      </SvgIcon>
    )}
    sx={{
      flexShrink: 0,
      height: 36,
      borderRadius: 18,
      fontWeight: 600,
      maxWidth: 220,
      ...(active && { color: 'common.white', '& .MuiChip-deleteIcon': { color: 'common.white' } }),
    }}
  />
);

export const MobileSearchBar = ({
  onSearchChange,
  filterGroups = [],
  body,
  handleBodyChange,
}) => {
  const [openFilterKey, setOpenFilterKey] = React.useState(null);
  const [dateSheetOpen, setDateSheetOpen] = React.useState(false);
  const openFilter = filterGroups.find((filter, index) => (filter.key || index) === openFilterKey);
  const hasDateRange = Boolean(body && handleBodyChange);
  const hasFilters = hasDateRange || filterGroups.length > 0;

  return (
    <Box>
      <OutlinedInput
        defaultValue=""
        fullWidth
        placeholder="Search"
        type="search"
        inputProps={{ enterKeyHint: 'search' }}
        startAdornment={(
          <InputAdornment position="start">
            <SvgIcon color="action" fontSize="small">
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        )}
        sx={{
          borderRadius: 50,
          bgcolor: 'background.paper',
          height: 48,
        }}
        onChange={onSearchChange}
      />
      {hasFilters && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            mt: 1.5,
            mx: -2,
            px: 2,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {hasDateRange && (
            <FilterChip
              active
              label={`${body.from.format('MMM D')} – ${body.to.format('MMM D, YYYY')}`}
              icon={(
                <SvgIcon fontSize="small">
                  <CalendarDaysIcon />
                </SvgIcon>
              )}
              onClick={() => setDateSheetOpen(true)}
            />
          )}
          {filterGroups.map((filter, index) => (
            filter.items && filter.selectedValue ? (
              <FilterChip
                key={filter.key || index}
                label={filter.selectedValue}
                disabled={filter.disabled}
                active={!/^all\b/i.test(`${filter.selectedValue}`)}
                onClick={() => setOpenFilterKey(filter.key || index)}
              />
            ) : null
          ))}
        </Stack>
      )}
      {openFilter && (
        <MobileActionSheet
          open={Boolean(openFilter)}
          onClose={() => setOpenFilterKey(null)}
          title="Filter"
          items={openFilter.items}
          selectedLabel={openFilter.selectedValue}
        />
      )}
      {hasDateRange && (
        <MobileDateRangeSheet
          open={dateSheetOpen}
          onClose={() => setDateSheetOpen(false)}
          from={body.from}
          to={body.to}
          onChange={handleBodyChange}
        />
      )}
    </Box>
  );
};

MobileSearchBar.propTypes = {
  onSearchChange: PropTypes.func,
  filterGroups: PropTypes.array,
  body: PropTypes.object,
  handleBodyChange: PropTypes.func,
};
