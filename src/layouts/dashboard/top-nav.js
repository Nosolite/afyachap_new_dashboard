import React from 'react';
import PropTypes from 'prop-types';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  SvgIcon,
  useMediaQuery
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { AccountPopover } from './account-popover';
import { usePopover } from '../../hooks/use-popover';
import { items } from './config';
import { useLocation } from 'react-router-dom';
import { MIN_SIDE_NAV_WIDTH, SIDE_NAV_WIDTH } from '../../utils/constant';
import { usersUrl } from '../../seed/url';
import { useAuth } from '../../hooks/use-auth';

const TOP_NAV_HEIGHT = 64;

export const TopNav = (props) => {
  const auth = useAuth();
  const { onNavOpen } = props;
  const router = useLocation();
  const { pathname } = router;
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const popOver = usePopover();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    const searchIndex = items.findIndex((item) => {
      return item.children ?
        item.children.some(item1 => item1.path === pathname) :
        item.path === pathname;
    });

    searchIndex >= 0 && setCurrentIndex(searchIndex);
  }, [pathname]);

  return (
    <>
      <Box
        component="header"
        sx={{
          backdropFilter: 'blur(6px)',
          backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
          position: 'sticky',
          left: {
            lg: `${items[currentIndex]?.children ? SIDE_NAV_WIDTH : MIN_SIDE_NAV_WIDTH}px`
          },
          top: 0,
          width: {
            lg: `calc(100% - ${items[currentIndex]?.children ? SIDE_NAV_WIDTH : MIN_SIDE_NAV_WIDTH}px)`
          },
          zIndex: (theme) => theme.zIndex.appBar
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            minHeight: TOP_NAV_HEIGHT,
            px: 2
          }}
        >
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            {!lgUp && (
              <IconButton onClick={onNavOpen}>
                <SvgIcon fontSize="small">
                  <Bars3Icon />
                </SvgIcon>
              </IconButton>
            )}
          </Stack>
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
          >
            <Avatar
              onClick={(event) => {
                popOver.handleOpen(event)
              }}
              sx={{
                cursor: 'pointer',
                height: 40,
                width: 40
              }}
              src={`${usersUrl}${auth?.user?.profile}`}
            />
          </Stack>
        </Stack>
      </Box>
      {popOver.open &&
        <AccountPopover
          id={popOver.id}
          anchorEl={popOver.anchorRef}
          open={popOver.open}
          onClose={popOver.handleClose}
        />
      }
    </>
  );
};

TopNav.propTypes = {
  onNavOpen: PropTypes.func
};
