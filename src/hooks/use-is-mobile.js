import { useMediaQuery } from '@mui/material';

// Below `md` (900px) the dashboard switches to its mobile-app components.
// `noSsr` reads the media query on the first render so pages never flash the desktop UI first.
export const useIsMobile = () =>
  useMediaQuery((theme) => theme.breakpoints.down('md'), { noSsr: true });
