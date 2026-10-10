import PropTypes from 'prop-types';
import { Box, Button, Stack, SvgIcon, Typography } from '@mui/material';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useIsMobile } from '../hooks/use-is-mobile';
import { MobileFab } from './mobile/mobile-fab';

export const PageHeader = ({
  title,
  subtitle,
  action,
  children,
  inDialog = false,
  showTitleOnMobile = false,
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    const showTitle = showTitleOnMobile && title;
    return (
      <>
        {(showTitle || subtitle || children) && (
          <Stack spacing={1}>
            {showTitle && (
              <Typography variant="h5">
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
            {children}
          </Stack>
        )}
        {action && !action.hidden && (
          <MobileFab
            label={action.label || 'Add'}
            icon={action.icon}
            onClick={action.onClick}
            inDialog={inDialog}
          />
        )}
      </>
    );
  }

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      flexWrap="wrap"
      gap={2}
    >
      <Stack spacing={1}>
        <Typography variant="h4">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Stack>
      {(children || (action && !action.hidden)) && (
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          {children}
          {action && !action.hidden && (
            <Box>
              <Button
                onClick={action.onClick}
                disabled={action.disabled}
                startIcon={(
                  <SvgIcon fontSize="small">
                    {action.icon || <PlusIcon />}
                  </SvgIcon>
                )}
                variant="contained"
                sx={{
                  color: 'neutral.100',
                }}
              >
                {action.label || 'Add'}
              </Button>
            </Box>
          )}
        </Stack>
      )}
    </Stack>
  );
};

PageHeader.propTypes = {
  title: PropTypes.node,
  subtitle: PropTypes.node,
  action: PropTypes.shape({
    label: PropTypes.node,
    icon: PropTypes.node,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    hidden: PropTypes.bool,
  }),
  children: PropTypes.node,
  inDialog: PropTypes.bool,
  showTitleOnMobile: PropTypes.bool,
};
