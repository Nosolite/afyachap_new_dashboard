import * as React from 'react';
import PropTypes from 'prop-types';
import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { ABOVE_BOTTOM_NAV } from './constants';

export const MobileToast = ({ open, onClose, severity, message }) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      sx={{ bottom: `${ABOVE_BOTTOM_NAV} !important`, left: 16, right: 16 }}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={onClose}
        severity={severity}
        sx={{ width: '100%', borderRadius: 3, alignItems: 'center' }}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

MobileToast.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  severity: PropTypes.string,
  message: PropTypes.node,
};
