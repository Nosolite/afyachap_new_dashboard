import React from 'react'
import { Avatar, Box, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, SvgIcon, Typography } from '@mui/material'
import BanknotesIcon from '@heroicons/react/24/outline/BanknotesIcon';
import { formatDate } from '../../utils/date-formatter';
import { authPostRequest } from '../../services/api-service';
import { getUserWalletTransactionsUrl } from '../../seed/url';

function CheckoutHistory({ selected, isLoading, setIsLoading }) {
    const [checkouts, setCheckouts] = React.useState([])

    const fetchCheckouts = React.useCallback(
        () => {
            setIsLoading(true)
            authPostRequest(
                getUserWalletTransactionsUrl,
                {
                    user_id: selected.id,
                    query: "WITHDRAW",
                    limit: 15,
                },
                (data) => {
                    setCheckouts(data.results)
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
            {!isLoading && checkouts.length === 0 &&
                <Typography>
                    No checkouts
                </Typography>
            }
            {!isLoading &&
                <List
                    disablePadding
                    sx={{ width: '100%', maxWidth: "100%", bgcolor: 'transparent', mb: 8 }}
                >
                    {checkouts.map((item, index) => (
                        <ListItem
                            key={index}
                            alignItems="flex-start"
                        >
                            <ListItemAvatar>
                                <Avatar>
                                    <SvgIcon fontSize='small'>
                                        <BanknotesIcon />
                                    </SvgIcon>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={`${item.amount} to ${item.phone_number}`}
                                secondary={formatDate(item.created_at)}
                            />
                        </ListItem>
                    ))}
                </List>
            }
        </>
    )
}

export default CheckoutHistory