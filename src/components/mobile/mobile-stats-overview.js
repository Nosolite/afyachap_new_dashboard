import PropTypes from 'prop-types';
import { Box, Card, Chip, Skeleton, Stack, SvgIcon, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

const StatTile = ({ label, value, icon, color = 'primary', isLoading }) => (
  <Card elevation={1} sx={{ p: 1.5, height: '100%' }}>
    <Stack spacing={1.25}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: `${color}.main`,
          bgcolor: (theme) => alpha(theme.palette[color].main, 0.12),
        }}
      >
        <SvgIcon fontSize="small">{icon}</SvgIcon>
      </Box>
      <Box sx={{ minWidth: 0 }}>
        {isLoading ?
          <Skeleton variant="text" width="70%" sx={{ fontSize: '1.25rem' }} /> :
          <Typography variant="h6" noWrap>
            {value}
          </Typography>
        }
        <Typography variant="caption" color="text.secondary" noWrap component="div">
          {label}
        </Typography>
      </Box>
    </Stack>
  </Card>
);

export const MobileStatsOverview = ({ hero, stats }) => {
  return (
    <Stack spacing={1.5}>
      {hero && (
        <Card
          elevation={2}
          sx={{
            p: 2.5,
            color: 'common.white',
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 180%)`,
          }}
        >
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" sx={{ opacity: 0.85, fontWeight: 600 }}>
                {hero.label}
              </Typography>
              {hero.isLoading ?
                <Skeleton
                  variant="text"
                  width={140}
                  sx={{ fontSize: '2rem', bgcolor: 'rgba(255,255,255,0.25)' }}
                /> :
                <Typography variant="h4" sx={{ mt: 0.5 }} noWrap>
                  {hero.value}
                </Typography>
              }
            </Box>
            {hero.icon && (
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(255,255,255,0.18)',
                }}
              >
                <SvgIcon>{hero.icon}</SvgIcon>
              </Box>
            )}
          </Stack>
          {hero.badge && !hero.badge.isLoading && (
            <Chip
              size="small"
              label={hero.badge.label}
              sx={{
                mt: 1.5,
                color: 'common.white',
                fontWeight: 600,
                bgcolor: 'rgba(255,255,255,0.2)',
              }}
            />
          )}
        </Card>
      )}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 1.5,
        }}
      >
        {stats.map((stat) => (
          <StatTile key={stat.label} {...stat} />
        ))}
      </Box>
    </Stack>
  );
};

MobileStatsOverview.propTypes = {
  hero: PropTypes.shape({
    label: PropTypes.node,
    value: PropTypes.node,
    icon: PropTypes.node,
    isLoading: PropTypes.bool,
    badge: PropTypes.shape({
      label: PropTypes.node,
      isLoading: PropTypes.bool,
    }),
  }),
  stats: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.node,
    icon: PropTypes.node,
    color: PropTypes.oneOf(['primary', 'info', 'success', 'warning', 'error']),
    isLoading: PropTypes.bool,
  })).isRequired,
};
