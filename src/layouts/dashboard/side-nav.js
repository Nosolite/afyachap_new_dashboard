import React from 'react';
import PropTypes from 'prop-types';
import MoonIcon from '@heroicons/react/24/outline/MoonIcon';
import SunIcon from '@heroicons/react/24/outline/SunIcon';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  Stack,
  SvgIcon,
  useMediaQuery
} from '@mui/material';
import { Scrollbar } from '../../components/scrollbar';
import { items } from './config';
import { SideNavItem } from './side-nav-item';
import { useDispatch, useSelector } from 'react-redux';
import { SubSideNavItem } from './sub-side-nav-item';
import { useLocation } from 'react-router-dom';
import { MIN_SIDE_NAV_WIDTH, SIDE_NAV_WIDTH, SUB_SIDE_NAV_WIDTH } from '../../utils/constant';
import { useAuth } from '../../hooks/use-auth';

export const SideNav = (props) => {
  const auth = useAuth();
  const { open, onClose } = props;
  const dispatch = useDispatch();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const settings = useSelector((state) => state.SettingsReducer);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [persistIndex, setPersistIndex] = React.useState(0);
  const [opacity, setOpacity] = React.useState(true);
  const router = useLocation();
  const { pathname } = router;

  const toggleTheme = () => {
    const newThemeMode = settings.theme === 'light' || settings.theme === '' ? 'dark' : 'light';
    dispatch({
      type: "CHANGE_THEME",
      payload: { ...settings, theme: newThemeMode },
    });
    localStorage.setItem("theme", newThemeMode);
  };

  React.useEffect(() => {
    const searchIndex = items.findIndex((item) => {
      return item.children ?
        item.children.some(item1 => item1.path === pathname) :
        item.path === pathname;
    });

    searchIndex >= 0 && setCurrentIndex(searchIndex);
    searchIndex >= 0 && setPersistIndex(searchIndex);
  }, [pathname]);

  const content = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
      }}
    >
      <Scrollbar
        sx={{
          width: MIN_SIDE_NAV_WIDTH,
          height: '100%',
          '& .simplebar-content': {
            height: '100%'
          },
          '& .simplebar-scrollbar:before': {
            background: 'neutral.400'
          }
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}
        >
          <Box
            component="nav"
            sx={{
              flexGrow: 1,
              py: 2
            }}
          >
            <Stack
              component="ul"
              spacing={0.5}
              sx={{
                listStyle: 'none',
                m: 0
              }}
            >
              {items.map((item, index) => {

                if (item?.roles?.includes(auth?.user?.role) || item?.children?.some(item => item?.roles?.includes(auth?.user?.role))) {
                  return (
                    <SideNavItem
                      disabled={item.disabled}
                      icon={item.icon}
                      key={index}
                      path={item.path}
                      title={item.title}
                      children={item.children}
                      setCurrentIndex={setCurrentIndex}
                      index={index}
                      currentIndex={currentIndex}
                      persistIndex={persistIndex}
                      setOpacity={setOpacity}
                    />
                  );
                } else {
                  return null;
                }
              })}
            </Stack>
          </Box>
          <Box
            sx={{
              pb: 2
            }}
          >
            <Avatar
              sx={{
                backgroundColor: 'transparent',
                height: 56,
                width: 56,
                border: `1px solid grey`
              }}
            >
              <IconButton
                onClick={toggleTheme}
              >
                <SvgIcon fontSize="large" sx={{ color: "text.secondary" }}>
                  {settings.theme === 'light' || settings.theme === '' ? <MoonIcon /> : <SunIcon />}
                </SvgIcon>
              </IconButton>
            </Avatar>
          </Box>
        </Box>
      </Scrollbar>
      {items[currentIndex]?.children &&
        <>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              borderColor: 'neutral.200',
            }}
          />
          <Scrollbar
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: "center",
              width: SUB_SIDE_NAV_WIDTH,
              pt: 2,
              height: '100%',
              '& .simplebar-content': {
                height: '100%'
              },
              '& .simplebar-scrollbar:before': {
                background: 'neutral.400'
              }
            }}
          >
            <List
              disablePadding
              component="nav"
              aria-labelledby="nested-list-subheader"
              sx={{
                mx: "auto",
                width: 180,
                maxWidth: 180,
                transition: 'opacity 0.01s linear',
                opacity: opacity ? 1 : 0,
              }}
            >
              {items[currentIndex].children.map((item, index) => {

                if (item?.roles?.includes(auth?.user?.role)) {
                  return (
                    <SubSideNavItem
                      external={item.external}
                      key={index}
                      path={item.path}
                      title={item.title}
                    />
                  );
                } else {
                  return null
                }
              })}
            </List>
          </Scrollbar>
        </>
      }
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.100',
            color: 'common.white',
            width: items[currentIndex]?.children ? SIDE_NAV_WIDTH : MIN_SIDE_NAV_WIDTH,
            transition: 'width 0.5s',
            overflow: 'hidden',
            borderColor: 'background.paper',
            ...(items[currentIndex].children && {
              borderTopRightRadius: '26px',
              borderBottomRightRadius: '26px',
            }),
          }
        }}
        variant="permanent"
        onMouseLeave={() => setCurrentIndex(persistIndex)}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.100',
          color: 'common.white',
          width: items[currentIndex]?.children ? SIDE_NAV_WIDTH : MIN_SIDE_NAV_WIDTH,
          transition: 'width 0.5s',
          overflow: 'hidden',
          borderColor: 'background.paper',
          ...(items[currentIndex].children && {
            borderTopRightRadius: '26px',
            borderBottomRightRadius: '26px',
          }),
        }
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};
