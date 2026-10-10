import PropTypes from 'prop-types';
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { MOBILE_TOP_BAR_HEIGHT, SAFE_AREA_TOP } from '../../../components/mobile/constants';

export const MobileTopBar = ({ title, sectionTitle, tabs = [], activePath, avatarSrc, onAvatarClick }) => {
  const navigate = useNavigate();

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        pt: SAFE_AREA_TOP,
        backdropFilter: 'blur(12px)',
        backgroundColor: (theme) => alpha(theme.palette.background.default, 0.88),
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ height: MOBILE_TOP_BAR_HEIGHT, px: 2 }}
      >
        <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
          {sectionTitle && sectionTitle !== title && (
            <Typography
              variant="caption"
              color="text.secondary"
              noWrap
              sx={{ display: 'block', lineHeight: 1.2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}
            >
              {sectionTitle}
            </Typography>
          )}
          <Typography variant="h6" noWrap sx={{ lineHeight: 1.25 }}>
            {title}
          </Typography>
        </Box>
        <Avatar
          src={avatarSrc}
          onClick={onAvatarClick}
          sx={{ width: 36, height: 36, cursor: 'pointer' }}
        />
      </Stack>
      {tabs.length > 1 && (
        <Stack
          direction="row"
          spacing={1}
          sx={{
            px: 2,
            pb: 1.25,
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {tabs.map((tab) => {
            const selected = tab.path === activePath;
            return (
              <Chip
                key={tab.path}
                label={tab.title}
                clickable
                color={selected ? 'primary' : 'default'}
                variant={selected ? 'filled' : 'outlined'}
                onClick={() => !selected && navigate(tab.path)}
                sx={{
                  flexShrink: 0,
                  fontWeight: 600,
                  ...(selected && { color: 'common.white' }),
                }}
              />
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

MobileTopBar.propTypes = {
  title: PropTypes.string,
  sectionTitle: PropTypes.string,
  tabs: PropTypes.array,
  activePath: PropTypes.string,
  avatarSrc: PropTypes.string,
  onAvatarClick: PropTypes.func,
};
