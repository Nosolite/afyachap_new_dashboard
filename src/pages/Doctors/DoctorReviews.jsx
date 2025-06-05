import React from 'react'
import { Avatar, Box, CircularProgress, IconButton, List, ListItem, ListItemAvatar, ListItemText, Rating, SvgIcon, Typography } from '@mui/material'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import { formatDate } from '../../utils/date-formatter';
import { postRequest } from '../../services/api-service';
import { deleteDoctorRatingReviewsUrl, getDoctorReviewsUrl } from '../../seed/url';

function DoctorReviews({ selected, isLoading, setIsLoading, setSeverityMessage, setSeverity, setIsDeleting, handleClickAlert }) {
    const [reviews, setReviews] = React.useState([])

    const fetchReviews = React.useCallback(
        () => {
            setIsLoading(true)
            postRequest(
                getDoctorReviewsUrl,
                {
                    user_id: selected.id,
                },
                (data) => {
                    setReviews(data.data)
                    setIsLoading(false)
                },
                (error) => {
                    setIsLoading(false)
                }
            )
        },
        [selected, setIsLoading]
    )

    const handleDelete = async (id) => {
        postRequest(
            deleteDoctorRatingReviewsUrl,
            {
                review_id: id,
            },
            (data) => {
                fetchReviews()
                setSeverityMessage(data.message)
                setSeverity("success")
                setIsDeleting(false)
                handleClickAlert()
            },
            (error) => {
                if (error?.response?.data?.message) {
                    setSeverityMessage(error.response.data.message[0])
                    setSeverity("error")
                    handleClickAlert()
                }
                setIsDeleting(false)
            },
        )
    }

    React.useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

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
            {!isLoading && reviews.length === 0 &&
                <Typography>
                    No reviews
                </Typography>
            }
            {!isLoading &&
                <List disablePadding sx={{ width: '100%', maxWidth: "100%", bgcolor: 'transparent' }}>
                    {reviews.map((item, index) => (
                        <ListItem
                            key={index}
                            alignItems="flex-start"
                            secondaryAction={
                                <IconButton
                                    onClick={() => handleDelete(item.id)}
                                    edge="end"
                                    aria-label="delete"
                                >
                                    <SvgIcon fontSize='small' sx={{ color: "text.primary" }}>
                                        <TrashIcon />
                                    </SvgIcon>
                                </IconButton>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar alt="Profile" src={item.patient_photo_url} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={item.patient_name}
                                secondary={
                                    <Box>
                                        <Box sx={{ display: "flex", }}>
                                            <Rating name="read-only" value={item.value} readOnly precision={0.5} />
                                            <Typography sx={{ ml: 2, }}>{formatDate(item.created_at)}</Typography>
                                        </Box>
                                        <Typography>
                                            {item.review}
                                        </Typography>
                                    </Box>
                                }
                            />
                        </ListItem>
                    ))}
                </List>
            }
        </>
    )
}

export default DoctorReviews