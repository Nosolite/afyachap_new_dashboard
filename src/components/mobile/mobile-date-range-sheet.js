import PropTypes from 'prop-types';
import { Box, Button, Stack } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
import { MobileBottomSheet } from './mobile-bottom-sheet';

export const MobileDateRangeSheet = ({ open, onClose, from, to, onChange }) => {
  return (
    <MobileBottomSheet open={open} onClose={onClose} title="Date range">
      <Box sx={{ px: 2.5 }}>
        <Stack spacing={2}>
          <MobileDateTimePicker
            label="From"
            value={from}
            onChange={(newValue) => onChange(newValue, 'from')}
            slotProps={{ textField: { fullWidth: true } }}
          />
          <MobileDateTimePicker
            label="To"
            value={to}
            onChange={(newValue) => onChange(newValue, 'to')}
            slotProps={{ textField: { fullWidth: true } }}
          />
          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={onClose}
            sx={{ color: 'common.white' }}
          >
            Done
          </Button>
        </Stack>
      </Box>
    </MobileBottomSheet>
  );
};

MobileDateRangeSheet.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  from: PropTypes.object,
  to: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};
