import PropTypes from 'prop-types';
import { Box, Typography, } from '@mui/material';

// TODO: Change subtitle text

export const AuthLayout = (props) => {
  const { children } = props;

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '90vh',
        mx: 3,
      }}
    >
      <Box
        component='img'
        sx={{
          width: 80,
        }}
        alt="Logo"
        src={"/assets/images/logo.png"}
      />
      <Typography variant='h4'>AfyaChap</Typography>
      {children}
    </Box>
  );
};

AuthLayout.prototypes = {
  children: PropTypes.node
};