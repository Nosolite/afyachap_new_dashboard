import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { getUserUrl, loginByEmailUrl, loginByPhoneNumberUrl, verifyPhoneUrl } from '../seed/url';
import { authGetRequest, authPostRequest, postRequest } from '../services/api-service';
import { googleLogout } from '@react-oauth/google';

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    let isAuthenticated = false;

    try {
      isAuthenticated = localStorage.getItem('authenticated') === 'true';
      isAuthenticated = localStorage.getItem('token') !== null;
    } catch (err) {
      console.error(err);
    }

    if (isAuthenticated) {
      authGetRequest(
        getUserUrl,
        (data) => {
          if (data.error) {
            signOut()
            window.location.href = "/login";
            return;
          }
          dispatch({
            type: HANDLERS.INITIALIZE,
            payload: data
          });
        },
        () => {
          signOut()
          window.location.href = "/login";
        }
      )
    } else {
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(
    () => {
      initialize();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const signInByPhoneNumber = async (phone_no, setIsLoading, setDisplay) => {
    setIsLoading(true)
    postRequest(
      loginByPhoneNumberUrl,
      {
        phone_no: "255" + phone_no,
        app_id: "vfjhcdfdfh13"
      },
      (data) => {
        localStorage.setItem('token', data.token);
        setDisplay("OTP")
        setIsLoading(false)
      },
      (error) => {
        setIsLoading(false)
      },
    )
  };

  const validatePhone = async (phone_no, otp, setIsLoading, navigate) => {
    setIsLoading(true)
    authPostRequest(
      verifyPhoneUrl,
      {
        phone_number: "255" + phone_no,
        otp: otp
      },
      (data) => {
        localStorage.setItem('authenticated', 'true');
        authGetRequest(
          getUserUrl,
          (userData) => {
            if (userData.error) {
              return;
            }
            dispatch({
              type: HANDLERS.SIGN_IN,
              payload: userData
            });
            navigate("/")
          },
          () => {
            signOut()
            navigate("/login")
          }
        )
      },
      (error) => {
        setIsLoading(false)
      },
    )
  };

  const signInByEmail = async (email, navigate) => {
    postRequest(
      loginByEmailUrl,
      {
        email: email
      },
      (data) => {
        localStorage.setItem('token', data.token);
        localStorage.setItem('authenticated', 'true');
        authGetRequest(
          getUserUrl,
          (userData) => {
            if (userData.error) {
              googleLogout()
              return;
            }
            dispatch({
              type: HANDLERS.SIGN_IN,
              payload: userData
            });
            navigate("/")
          },
          () => {
            signOut()
            navigate("/login")
          }
        )
      },
      (error) => {
        googleLogout()
      },
    )
  };

  const signUp = async (email, name, password) => {
    throw new Error('Sign up is not implemented');
  };

  const signOut = () => {
    dispatch({
      type: HANDLERS.SIGN_OUT
    });
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signInByPhoneNumber,
        validatePhone,
        signInByEmail,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
