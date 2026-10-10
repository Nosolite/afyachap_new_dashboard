import PropTypes from 'prop-types';
import { Fab, SvgIcon } from '@mui/material';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { ABOVE_BOTTOM_NAV, ABOVE_SCREEN_EDGE } from './constants';

export const MobileFab = ({ label = 'Add', icon, onClick, inDialog = false }) => {
  return (
    <Fab
      variant="extended"
      color="primary"
      onClick={onClick}
      sx={{
        position: 'fixed',
        right: 16,
        bottom: inDialog ? ABOVE_SCREEN_EDGE : ABOVE_BOTTOM_NAV,
        zIndex: (theme) => theme.zIndex.speedDial,
        color: 'common.white',
        textTransform: 'none',
        fontWeight: 600,
        boxShadow: 6,
      }}
    >
      <SvgIcon fontSize="small" sx={{ mr: 1 }}>
        {icon || <PlusIcon />}
      </SvgIcon>
      {label}
    </Fab>
  );
};

MobileFab.propTypes = {
  label: PropTypes.node,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  inDialog: PropTypes.bool,
};
