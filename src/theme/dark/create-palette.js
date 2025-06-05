import { alpha } from '@mui/material/styles';
import { error, green, info, neutral, success, warning } from './colors';

export function createPalette() {
  return {
    action: {
      active: neutral[500],
      disabled: alpha(neutral[900], 0.38),
      disabledBackground: alpha(neutral[900], 0.12),
      focus: alpha(neutral[900], 0.16),
      hover: alpha(neutral[900], 0.04),
      selected: alpha(neutral[900], 0.12)
    },
    background: {
      default: '#1F1F1F',
      paper: '#1F1F1F'
    },
    divider: '#F2F4F7',
    error,
    info,
    mode: 'dark',
    neutral,
    primary: green,
    success,
    text: {
      primary: neutral[900],
      secondary: neutral[500],
      disabled: alpha(neutral[900], 0.38)
    },
    warning
  };
}
