import PropTypes from 'prop-types';
import { Box, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { SAFE_AREA_BOTTOM } from './constants';

export const MobileStickyFooter = ({ children }) => {
  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 0,
        zIndex: 2,
        px: 2,
        pt: 1.5,
        pb: `calc(${SAFE_AREA_BOTTOM} + 12px)`,
        borderTop: 1,
        borderColor: 'divider',
        backdropFilter: 'blur(8px)',
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.95),
      }}
    >
      <Stack direction="row" spacing={1.5}>
        {children}
      </Stack>
    </Box>
  );
};

MobileStickyFooter.propTypes = {
  children: PropTypes.node,
};
