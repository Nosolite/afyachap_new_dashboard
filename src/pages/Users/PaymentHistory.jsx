import React from 'react'
import { Avatar, Box, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, SvgIcon, Typography } from '@mui/material'
import BanknotesIcon from '@heroicons/react/24/outline/BanknotesIcon';
import { formatDate } from '../../utils/date-formatter';
import { postRequest } from '../../services/api-service';
import { getDoctorCheckoutsUrl } from '../../seed/url';

function PaymentHistory({ selected, isLoading, setIsLoading }) {
    const [paymentHistory, setPaymentHistory] = React.useState([])

    const fetchCheckouts = React.useCallback(
        () => {
            setIsLoading(true)
            postRequest(
                getDoctorCheckoutsUrl,
                {
                    user_id: selected.id,
                },
                (data) => {
                    setPaymentHistory(data.data)
                    setIsLoading(false)
                },
                (error) => {
                    setIsLoading(false)
                }
            )
        },
        [selected, setIsLoading]
    )

    React.useEffect(() => {
        fetchCheckouts()
    }, [fetchCheckouts])

    return (
        <>
            {isLoading &&
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: "center",
                    height: "100%"
                }}>
                    <CircularProgress
                        sx={{
                            mx: 'auto',
                        }}
                    />
                </Box>
            }
            {!isLoading && paymentHistory.length === 0 &&
                <Typography>
                    No payment history
                </Typography>
            }
            {!isLoading &&
                <List
                    disablePadding
                    sx={{ width: '100%', maxWidth: "100%", bgcolor: 'transparent', mb: 8 }}
                >
                    {paymentHistory.map((item, index) => (
                        <ListItem
                            key={index}
                            alignItems="flex-start"
                            secondaryAction={
                                <Typography variant='h6'>
                                    {item.amount}
                                </Typography>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <SvgIcon fontSize='small'>
                                        <BanknotesIcon />
                                    </SvgIcon>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={item.subscriptionType}
                                secondary={formatDate(item.created_at)}
                            />
                        </ListItem>
                    ))}
                </List>
            }
        </>
    )
}

export default PaymentHistory