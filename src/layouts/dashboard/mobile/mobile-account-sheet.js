import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Chip,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  SvgIcon,
  Switch,
  Typography,
} from '@mui/material';
import MoonIcon from '@heroicons/react/24/outline/MoonIcon';
import ArrowRightOnRectangleIcon from '@heroicons/react/24/outline/ArrowRightOnRectangleIcon';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import { MobileBottomSheet } from '../../../components/mobile/mobile-bottom-sheet';
import { useAuth } from '../../../hooks/use-auth';
import { useThemeMode } from '../../../hooks/use-theme-mode';

export const MobileAccountSheet = ({ open, onClose, avatarSrc }) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useThemeMode();

  const handleSignOut = () => {
    onClose();
    auth.signOut();
    googleLogout();
    navigate('/login');
  };

  return (
    <MobileBottomSheet open={open} onClose={onClose}>
      <Stack alignItems="center" spacing={1} sx={{ px: 2.5, pt: 1, pb: 2 }}>
        <Avatar src={avatarSrc} sx={{ width: 72, height: 72 }} />
        <Typography variant="h6" textAlign="center">
          {auth?.user?.name}
        </Typography>
        {auth?.user?.role && (
          <Chip
            size="small"
            label={auth.user.role}
            sx={{ textTransform: 'capitalize', fontWeight: 600 }}
          />
        )}
      </Stack>
      <Box sx={{ px: 1.5 }}>
        <List disablePadding>
          <ListItemButton onClick={toggleTheme} sx={{ borderRadius: 2, minHeight: 52 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <SvgIcon fontSize="small">
                <MoonIcon />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText primary="Dark mode" />
            <Switch edge="end" checked={isDark} tabIndex={-1} inputProps={{ 'aria-label': 'Dark mode' }} />
          </ListItemButton>
          <ListItemButton onClick={handleSignOut} sx={{ borderRadius: 2, minHeight: 52, color: 'error.main' }}>
            <ListItemIcon sx={{ minWidth: 40, color: 'error.main' }}>
              <SvgIcon fontSize="small">
                <ArrowRightOnRectangleIcon />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText primary="Sign out" primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
        </List>
      </Box>
    </MobileBottomSheet>
  );
};

MobileAccountSheet.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  avatarSrc: PropTypes.string,
};
