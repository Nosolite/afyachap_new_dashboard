import PropTypes from 'prop-types';
import { BottomNavigation, BottomNavigationAction, Paper, SvgIcon } from '@mui/material';
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon';
import { useNavigate } from 'react-router-dom';
import { MOBILE_BOTTOM_NAV_HEIGHT, SAFE_AREA_BOTTOM } from '../../../components/mobile/constants';

const MAX_TABS = 4;
const MENU_VALUE = 'menu';

export const MobileBottomNav = ({ navItems, activeSection, onMenuOpen }) => {
  const navigate = useNavigate();
  const showMenu = navItems.length > MAX_TABS;
  const tabs = showMenu ? navItems.slice(0, MAX_TABS) : navItems;
  const activeTab = tabs.find((item) => item.title === activeSection?.title);
  const value = activeTab ? activeTab.title : (showMenu ? MENU_VALUE : false);

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        pb: SAFE_AREA_BOTTOM,
        borderTop: 1,
        borderColor: 'divider',
        borderRadius: 0,
        backgroundImage: 'none',
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_, newValue) => {
          if (newValue === MENU_VALUE) {
            onMenuOpen();
            return;
          }
          const target = tabs.find((item) => item.title === newValue);
          if (target) {
            navigate(target.entryPath);
          }
        }}
        sx={{
          height: MOBILE_BOTTOM_NAV_HEIGHT,
          bgcolor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 0,
            px: 0.5,
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: 11,
            fontWeight: 600,
            mt: 0.5,
            whiteSpace: 'nowrap',
            '&.Mui-selected': { fontSize: 11 },
          },
        }}
      >
        {tabs.map((item) => (
          <BottomNavigationAction
            key={item.title}
            label={item.title}
            value={item.title}
            icon={item.icon}
          />
        ))}
        {showMenu && (
          <BottomNavigationAction
            label="Menu"
            value={MENU_VALUE}
            icon={(
              <SvgIcon fontSize="small">
                <Squares2X2Icon />
              </SvgIcon>
            )}
          />
        )}
      </BottomNavigation>
    </Paper>
  );
};

MobileBottomNav.propTypes = {
  navItems: PropTypes.array.isRequired,
  activeSection: PropTypes.object,
  onMenuOpen: PropTypes.func.isRequired,
};
