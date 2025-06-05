import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AuthConsumer, AuthProvider } from './contexts/auth-context';
import { lightTheme } from './theme/light';
import { createEmotionCache } from './utils/create-emotion-cache';
import 'simplebar-react/dist/simplebar.min.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { darkTheme } from './theme/dark';
import { useSelector } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Loader from './components/Loader';

const clientSideEmotionCache = createEmotionCache();

const SplashScreen = () => <Loader />;

function App() {
  const settings = useSelector((state) => state.SettingsReducer);
  const light = lightTheme();
  const dark = darkTheme();

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <CacheProvider value={clientSideEmotionCache}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AuthProvider>
            <AuthConsumer>
              {(auth) => auth.isLoading ?
                <SplashScreen /> :
                <ThemeProvider theme={settings.theme === 'light' || settings.theme === '' ? light : dark}>
                  <CssBaseline />
                  <RouterProvider router={router} />
                </ThemeProvider>
              }
            </AuthConsumer>
          </AuthProvider>
        </LocalizationProvider>
      </CacheProvider>
    </GoogleOAuthProvider >
  );
}

export default App;
