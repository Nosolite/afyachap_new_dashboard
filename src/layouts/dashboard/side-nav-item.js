import PropTypes from 'prop-types';
import { Box, ButtonBase } from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';
import { items } from './config';

export const SideNavItem = (props) => {
  const {
    disabled,
    icon,
    path,
    title,
    children,
    index,
    currentIndex,
    persistIndex,
    setCurrentIndex,
    setOpacity
  } = props;
  const router = useLocation();
  const { pathname } = router;
  const active = path ? (pathname === path || (children && children.some(item => item.path === pathname))) : false;

  return (
    <NavLink
      end to={path}
      onMouseEnter={() => {
        if (!items[persistIndex].children || items[index].children) {
          setCurrentIndex(index)
        } else {
          setCurrentIndex(persistIndex)
        }
        if ((items[index].children && index !== currentIndex) || (!items[index].children && persistIndex !== currentIndex)) {
          setOpacity(false);
          setTimeout(() => {
            setOpacity(true);
          }, 200);
        }
      }}
    >
      <ButtonBase
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          flexDirection: 'column',
          textAlign: 'center',
          width: '100%',
        }}
      >
        {icon && (
          <Box
            sx={{
              width: "100%",
              py: 1,
              borderRadius: "26px",
              ...(active && {
                backgroundColor: 'primary.main'
              }),
              '&:hover': {
                backgroundColor: active ? 'primary.main' : 'primary.lightest'
              }
            }}
          >
            <Box
              component="span"
              sx={{
                alignItems: 'center',
                color: 'text.primary',
                display: 'inline-flex',
                justifyContent: 'center',
                ...(active && {
                  color: 'neutral.100',
                }),
              }}
            >
              {icon}
            </Box>
          </Box>
        )}
        <Box
          component="span"
          sx={{
            alignItems: 'center',
            color: 'text.primary',
            flexGrow: 1,
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: 12,
            fontWeight: 600,
            lineHeight: '24px',
            whiteSpace: 'nowrap',
            ...(disabled && {
              color: 'neutral.500'
            }),
            '&:hover': {
              color: 'text.primary',
            }
          }}
        >
          {title}
        </Box>
      </ButtonBase>
    </NavLink>
  );
};

SideNavItem.propTypes = {
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired,
  index: PropTypes.number,
  currentIndex: PropTypes.number,
  persistIndex: PropTypes.number,
  setCurrentIndex: PropTypes.func.isRequired,
  setOpacity: PropTypes.func.isRequired,
};
