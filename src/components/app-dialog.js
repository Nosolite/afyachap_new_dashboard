import * as React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogActions, IconButton, Slide, SvgIcon } from '@mui/material';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { useIsMobile } from '../hooks/use-is-mobile';
import { MobileScreenHeader } from './mobile/mobile-screen-header';

const SlideUp = React.forwardRef(function SlideUp(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const AppDialog = ({
  fullScreen,
  TransitionComponent,
  disableMobileContentGutters = false,
  sx,
  PaperProps,
  children,
  ...other
}) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <Dialog
        fullScreen={fullScreen}
        TransitionComponent={TransitionComponent}
        sx={sx}
        PaperProps={PaperProps}
        {...other}
      >
        {children}
      </Dialog>
    );
  }

  return (
    <Dialog
      {...other}
      fullScreen
      TransitionComponent={SlideUp}
      PaperProps={{
        ...PaperProps,
        sx: { backgroundImage: 'none', ...PaperProps?.sx },
      }}
      sx={{
        '& .MuiDialogContent-root': disableMobileContentGutters ?
          { px: 0, pt: 0 } :
          { px: 2, pt: 2 },
        ...sx,
      }}
    >
      {children}
    </Dialog>
  );
};

AppDialog.propTypes = {
  fullScreen: PropTypes.bool,
  TransitionComponent: PropTypes.elementType,
  disableMobileContentGutters: PropTypes.bool,
  sx: PropTypes.object,
  PaperProps: PropTypes.object,
  children: PropTypes.node,
};

export const DialogCloseBar = ({ onClose, title, subtitle, disabled = false, iconSize = 'small', trailing }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobileScreenHeader
        title={title}
        subtitle={subtitle}
        onClose={onClose}
        closeDisabled={disabled}
        trailing={trailing}
      />
    );
  }

  return (
    <DialogActions>
      {trailing}
      <IconButton
        edge="start"
        color="inherit"
        aria-label="close"
        disabled={disabled}
        onClick={() => onClose()}
      >
        <SvgIcon fontSize={iconSize}>
          <XMarkIcon />
        </SvgIcon>
      </IconButton>
    </DialogActions>
  );
};

DialogCloseBar.propTypes = {
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  disabled: PropTypes.bool,
  iconSize: PropTypes.string,
  trailing: PropTypes.node,
};
