import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/use-auth';
import { usersUrl } from '../../../seed/url';
import { getVisibleNavItems, findActiveNav } from '../nav-utils';
import { MobileTopBar } from './mobile-top-bar';
import { MobileBottomNav } from './mobile-bottom-nav';
import { MobileMenuSheet } from './mobile-menu-sheet';
import { MobileAccountSheet } from './mobile-account-sheet';
import { MOBILE_BOTTOM_NAV_HEIGHT, SAFE_AREA_BOTTOM } from '../../../components/mobile/constants';

export const MobileAppShell = ({ children }) => {
  const auth = useAuth();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [accountOpen, setAccountOpen] = React.useState(false);
  const role = auth?.user?.role;

  const navItems = React.useMemo(() => getVisibleNavItems(role), [role]);
  const { section, child } = React.useMemo(() => findActiveNav(navItems, pathname), [navItems, pathname]);
  const avatarSrc = auth?.user?.profile ? `${usersUrl}${auth.user.profile}` : undefined;

  React.useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <MobileTopBar
        title={child?.title ?? section?.title ?? ''}
        sectionTitle={section?.title}
        tabs={section?.children ?? []}
        activePath={child?.path ?? pathname}
        avatarSrc={avatarSrc}
        onAvatarClick={() => setAccountOpen(true)}
      />
      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          width: '100%',
          pb: `calc(${MOBILE_BOTTOM_NAV_HEIGHT}px + ${SAFE_AREA_BOTTOM})`,
        }}
      >
        {children}
      </Box>
      <MobileBottomNav
        navItems={navItems}
        activeSection={section}
        onMenuOpen={() => setMenuOpen(true)}
      />
      <MobileMenuSheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        navItems={navItems}
        activePath={child?.path ?? pathname}
      />
      <MobileAccountSheet
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        avatarSrc={avatarSrc}
      />
    </Box>
  );
};

MobileAppShell.propTypes = {
  children: PropTypes.node,
};
