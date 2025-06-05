import React from 'react'
import { Avatar, Box, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, SvgIcon, Typography } from '@mui/material'
import BanknotesIcon from '@heroicons/react/24/outline/BanknotesIcon';
import { formatDate } from '../../utils/date-formatter';
import { authPostRequest } from '../../services/api-service';
import { getUserWalletTransactionsUrl } from '../../seed/url';

function BonusHistory({ selected, isLoading, setIsLoading }) {
    const [bonus, setBonus] = React.useState({
        page: 1,
        total_results: 0,
        total_pages: 0,
        results: []
    })

    const fetchBonus = React.useCallback(
        () => {
            setIsLoading(true)
            authPostRequest(
                getUserWalletTransactionsUrl,
                {
                    user_id: selected.id,
                    query: "AFFILIATE",
                    page: bonus?.page + 1,
                    limit: 15,
                },
                (data) => {
                    setBonus(data)
                    setIsLoading(false)
                },
                (error) => {
                    setIsLoading(false)
                }
            )
        },
        [selected, setIsLoading, bonus]
    )

    const handleScroll = React.useCallback(() => {
        // Check if the user has scrolled to the bottom of the page
        if (
            window.innerHeight + document.documentElement.scrollTop + 100 >=
            document.documentElement.offsetHeight
        ) {
            // Call the API when the user reaches the bottom
            if (!isLoading && bonus.total_pages > bonus.page) {
                setIsLoading(true);
                fetchBonus(bonus.page + 1);
            }
        }
    }, [fetchBonus, bonus, isLoading, setIsLoading])

    React.useEffect(() => {
        // Add an event listener for the scroll event
        window.addEventListener('scroll', handleScroll);

        // Cleanup the event listener when the component is unmounted
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]); // Run effect once on mount

    React.useEffect(() => {
        fetchBonus(1)
    }, [fetchBonus])

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
            {!isLoading && bonus?.results?.length === 0 &&
                <Typography>
                    No bonus
                </Typography>
            }
            {!isLoading &&
                <List
                    disablePadding
                    sx={{ width: '100%', maxWidth: "100%", bgcolor: 'transparent', mb: 8 }}
                >
                    {bonus?.results?.map((item, index) => (
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
                                primary={`${item.amount}(${item.reference})`}
                                secondary={formatDate(item.created_at)}
                            />
                        </ListItem>
                    ))}
                </List>
            }
        </>
    )
}

export default BonusHistory