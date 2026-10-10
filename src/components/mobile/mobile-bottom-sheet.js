import PropTypes from 'prop-types';
import { Box, SwipeableDrawer, Typography } from '@mui/material';
import { SAFE_AREA_BOTTOM } from './constants';

const iOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

export const MobileBottomSheet = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  fullHeight = false,
  zIndex,
  contentSx,
}) => {
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
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          maxHeight: '92vh',
          height: fullHeight ? '92vh' : 'auto',
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: 'none',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1, pb: 0.5 }}>
        <Box
          sx={{
            width: 40,
            height: 4,
            borderRadius: 2,
            bgcolor: 'divider',
          }}
        />
      </Box>
      {(title || subtitle) && (
        <Box sx={{ px: 2.5, pt: 1, pb: 1.5 }}>
          {title && (
            <Typography variant="h6">
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      )}
      <Box
        sx={{
          flex: '1 1 auto',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          pb: `calc(${SAFE_AREA_BOTTOM} + 12px)`,
          ...contentSx,
        }}
      >
        {children}
      </Box>
    </SwipeableDrawer>
  );
};

MobileBottomSheet.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  children: PropTypes.node,
  fullHeight: PropTypes.bool,
  zIndex: PropTypes.number,
  contentSx: PropTypes.object,
};
