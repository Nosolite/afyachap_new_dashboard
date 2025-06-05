import React from 'react'
import { Avatar, Box, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, SvgIcon, Typography } from '@mui/material'
import BanknotesIcon from '@heroicons/react/24/outline/BanknotesIcon';
import { formatDate } from '../../utils/date-formatter';
import { postRequest } from '../../services/api-service';
import { getAuthorCheckoutsUrl } from '../../seed/url';
import { formatMoney } from '../../utils/constant';

function AuthorCheckouts({ selected, isLoading, setIsLoading }) {
    const [checkouts, setCheckouts] = React.useState([])

    const fetchCheckouts = React.useCallback(
        () => {
            setIsLoading(true)
            postRequest(
                getAuthorCheckoutsUrl,
                {
                    user_id: selected.user_id,
                    is_doctor: selected.is_doctor,
                    query: "WITHDRAW"
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
                                primary={formatMoney(item.amount)}
                                secondary={formatDate(item.created_at)}
                            />
                        </ListItem>
                    ))}
                </List>
            }
        </>
    )
}

export default AuthorCheckouts