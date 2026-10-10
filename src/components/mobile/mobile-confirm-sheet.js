import PropTypes from 'prop-types';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { MobileBottomSheet } from './mobile-bottom-sheet';

export const MobileConfirmSheet = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  destructive = false,
}) => {
  return (
    <MobileBottomSheet
      open={open}
      onClose={isLoading ? () => { } : onClose}
      title={title}
    >
      <Box sx={{ px: 2.5 }}>
        {message && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {message}
          </Typography>
        )}
        <Stack spacing={1.5}>
          <Button
            fullWidth
            size="large"
            variant="contained"
            color={destructive ? 'error' : 'primary'}
            onClick={onConfirm}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{ color: 'common.white' }}
          >
            {confirmLabel}
          </Button>
          <Button
            fullWidth
            size="large"
            variant="outlined"
            color="inherit"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
        </Stack>
      </Box>
    </MobileBottomSheet>
  );
};

MobileConfirmSheet.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.node,
  message: PropTypes.node,
  confirmLabel: PropTypes.node,
  cancelLabel: PropTypes.node,
  isLoading: PropTypes.bool,
  destructive: PropTypes.bool,
};
