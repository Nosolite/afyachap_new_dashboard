import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export const AuthGuard = (props) => {
  const { children } = props;
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('authenticated') === 'true'
  const token = localStorage.getItem('token')
  const ignore = useRef(false);
  const [checked, setChecked] = useState(false);

  useEffect(
    () => {
      if (ignore.current) {
        return;
      }

      ignore.current = true;

      if (token == null) {
        navigate(`/login`);
      } else if (!isAuthenticated) {
        navigate(`/login`);
      } else {
        setChecked(true);
      }
    },
    [isAuthenticated, token, navigate]
  );

  if (!checked) {
    return null;
  }

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node
};
