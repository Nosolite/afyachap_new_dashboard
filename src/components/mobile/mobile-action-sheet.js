import PropTypes from 'prop-types';
import {
  Box,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
} from '@mui/material';
import CheckIcon from '@heroicons/react/24/outline/CheckIcon';
import { MobileBottomSheet } from './mobile-bottom-sheet';

export const MobileActionSheet = ({
  open,
  onClose,
  title,
  items = [],
  selectedLabel,
  showCancel = true,
}) => {
  return (
    <MobileBottomSheet open={open} onClose={onClose} title={title}>
      <List disablePadding sx={{ px: 1 }}>
        {items.map((item, index) => {
          const isSelected = selectedLabel !== undefined && item.label === selectedLabel;
          return (
            <ListItemButton
              key={item.id ?? index}
              disabled={item.disabled}
              onClick={(event) => {
                item.onClick?.(event);
                onClose();
              }}
              sx={{
                borderRadius: 2,
                minHeight: 52,
                ...(isSelected && { bgcolor: 'action.selected' }),
              }}
            >
              {item.icon && (
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
              )}
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  variant: 'body1',
                  fontWeight: isSelected ? 600 : 500,
                }}
              />
              {isSelected && (
                <SvgIcon fontSize="small" color="primary">
                  <CheckIcon />
                </SvgIcon>
              )}
            </ListItemButton>
          );
        })}
      </List>
      {showCancel && (
        <Box sx={{ px: 2, pt: 1 }}>
          <Button
            fullWidth
            size="large"
            variant="outlined"
            color="inherit"
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>
      )}
    </MobileBottomSheet>
  );
};

MobileActionSheet.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  items: PropTypes.array,
  selectedLabel: PropTypes.node,
  showCancel: PropTypes.bool,
};
