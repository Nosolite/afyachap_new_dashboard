import PropTypes from 'prop-types';
import { Box, Drawer, SwipeableDrawer } from '@mui/material';
import { useIsMobile } from '../hooks/use-is-mobile';
import { SAFE_AREA_BOTTOM } from './mobile/constants';

const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

export const ResponsiveDetailDrawer = ({ open, onClose, children, zIndex, width = 300 }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <SwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={() => { }}
        disableSwipeToOpen
        disableBackdropTransition={!iOS}
        disableDiscovery={iOS}
        sx={zIndex ? { zIndex } : undefined}
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.100',
            backgroundImage: 'none',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '92vh',
            pb: `calc(${SAFE_AREA_BOTTOM} + 12px)`,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
          <Box sx={{ width: 40, height: 4, borderRadius: 2, bgcolor: 'divider' }} />
        </Box>
        {children}
      </SwipeableDrawer>
    );
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={zIndex ? { zIndex } : undefined}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.100',
          width,
        },
      }}
    >
      {children}
    </Drawer>
  );
};

ResponsiveDetailDrawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
  zIndex: PropTypes.number,
  width: PropTypes.number,
};
