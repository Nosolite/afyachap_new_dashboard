export const MOBILE_TOP_BAR_HEIGHT = 56;
export const MOBILE_BOTTOM_NAV_HEIGHT = 64;
export const SAFE_AREA_BOTTOM = 'env(safe-area-inset-bottom, 0px)';
export const SAFE_AREA_TOP = 'env(safe-area-inset-top, 0px)';

// Space floating UI (FABs, toasts) must keep above the bottom navigation bar.
export const ABOVE_BOTTOM_NAV = `calc(${MOBILE_BOTTOM_NAV_HEIGHT}px + ${SAFE_AREA_BOTTOM} + 16px)`;
export const ABOVE_SCREEN_EDGE = `calc(${SAFE_AREA_BOTTOM} + 16px)`;
