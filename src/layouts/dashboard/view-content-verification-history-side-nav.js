import React from 'react';
import { Box, Divider, Drawer, IconButton, List, ListItem, ListItemText, SvgIcon, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { useSelector } from 'react-redux';

export const ViewContentVerificationHistorySideNav = (props) => {
    const { open, onClose } = props;
    const orderSideNav = useSelector((state) => state.ViewPaymentSideNavReducer);

    return (
        <Drawer
            anchor='right'
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    backgroundColor: 'neutral.100',
                    width: 300
                }
            }}
            sx={{ zIndex: 1300 }}
        >
            <Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 2,
                        borderBottom: "2px solid #DFE2E6",
                    }}
                >
                    <Typography variant='h6'>Verification History</Typography>
                    <IconButton
                        edge="start"
                        color="inherit"
                        onClick={() => {
                            onClose()
                        }}
                        aria-label="close"
                    >
                        <SvgIcon fontSize='small'>
                            <XMarkIcon />
                        </SvgIcon>
                    </IconButton>
                </Box>
                {orderSideNav?.contentVerificationHistory?.verification_history.length === 0 &&
                    <Typography align='center' mt={5}>No history</Typography>
                }
                <List sx={{ width: '100%' }}>
                    {orderSideNav?.contentVerificationHistory?.verification_history &&
                        orderSideNav?.contentVerificationHistory?.verification_history?.map((item, index) => {
                            return (
                                <React.Fragment key={index}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={item.approval}
                                            secondary={
                                                <React.Fragment>
                                                    <Typography
                                                        sx={{ display: 'inline' }}
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        Moderator
                                                    </Typography>
                                                    {` - ${item.reason}`}<br />
                                                    {item.created_at}
                                                </React.Fragment>
                                            }
                                        />
                                    </ListItem>
                                    <Divider variant="inset" component="li" />
                                </React.Fragment>
                            )
                        })}
                </List>
            </Box>
        </Drawer >
    );

};

ViewContentVerificationHistorySideNav.propTypes = {
    onClose: PropTypes.func,
    open: PropTypes.bool
};