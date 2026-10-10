import PropTypes from 'prop-types';
import { Box, IconButton, Stack, SvgIcon, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { MOBILE_TOP_BAR_HEIGHT, SAFE_AREA_TOP } from './constants';

export const MobileScreenHeader = ({
  title,
  subtitle,
  onClose,
  closeDisabled = false,
  closeIcon,
  trailing,
}) => {
  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 2,
        pt: SAFE_AREA_TOP,
        backdropFilter: 'blur(8px)',
        backgroundColor: (theme) => alpha(theme.palette.background.paper, 0.92),
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ minHeight: MOBILE_TOP_BAR_HEIGHT, px: 1 }}
      >
        {onClose && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            disabled={closeDisabled}
          >
            <SvgIcon fontSize="small">
              {closeIcon || <XMarkIcon />}
            </SvgIcon>
          </IconButton>
        )}
        <Box sx={{ flex: '1 1 auto', minWidth: 0, pl: onClose ? 0 : 1 }}>
          <Typography variant="subtitle1" fontWeight={700} noWrap>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary" noWrap component="div">
              {subtitle}
            </Typography>
          )}
        </Box>
        {trailing}
      </Stack>
    </Box>
  );
};

MobileScreenHeader.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  onClose: PropTypes.func,
  closeDisabled: PropTypes.bool,
  closeIcon: PropTypes.node,
  trailing: PropTypes.node,
};
