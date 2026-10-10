import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const useThemeMode = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.SettingsReducer);
  const isDark = !(settings.theme === 'light' || settings.theme === '');

  const toggleTheme = useCallback(() => {
    const newThemeMode = isDark ? 'light' : 'dark';
    dispatch({
      type: "CHANGE_THEME",
      payload: { ...settings, theme: newThemeMode },
    });
    localStorage.setItem("theme", newThemeMode);
  }, [dispatch, isDark, settings]);

  return { isDark, toggleTheme };
};
