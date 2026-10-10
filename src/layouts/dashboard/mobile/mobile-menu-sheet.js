import PropTypes from 'prop-types';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MobileBottomSheet } from '../../../components/mobile/mobile-bottom-sheet';

export const MobileMenuSheet = ({ open, onClose, navItems, activePath }) => {
  const navigate = useNavigate();

  const goTo = (path) => {
    onClose();
    if (path !== activePath) {
      navigate(path);
    }
  };

  return (
    <MobileBottomSheet open={open} onClose={onClose} title="Menu" fullHeight>
      {navItems.map((item) => {
        const entries = item.children?.length ? item.children : [{ title: item.title, path: item.path }];
        return (
          <Box key={item.title} sx={{ px: 1.5, pb: 1 }}>
            <List
              disablePadding
              subheader={(
                <ListSubheader
                  disableSticky
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 1,
                    lineHeight: '36px',
                    bgcolor: 'transparent',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    fontSize: 12,
                  }}
                >
                  {item.icon}
                  {item.title}
                </ListSubheader>
              )}
            >
              {entries.map((entry) => {
                const selected = entry.path === activePath;
                return (
                  <ListItemButton
                    key={entry.path}
                    selected={selected}
                    onClick={() => goTo(entry.path)}
                    sx={{ borderRadius: 2, minHeight: 48 }}
                  >
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <Box
                        sx={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          bgcolor: selected ? 'primary.main' : 'divider',
                        }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={entry.title}
                      primaryTypographyProps={{ fontWeight: selected ? 700 : 500 }}
                    />
                  </ListItemButton>
                );
              })}
            </List>
          </Box>
        );
      })}
    </MobileBottomSheet>
  );
};

MobileMenuSheet.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  navItems: PropTypes.array.isRequired,
  activePath: PropTypes.string,
};
