import React from 'react'
import { Box, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Slide, SvgIcon, Typography, useMediaQuery, } from '@mui/material'
import { alpha } from '@mui/material/styles';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { Scrollbar } from '../../components/scrollbar';
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import { compareFirebaseDaysEqual, convertTimestampTo24HourFormat, formatTimestampDateOrDay } from '../../utils/convert-timestamp';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

function ViewChat({ open, handleClose, selected }) {
    const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
    const audioRef = React.useRef(null);
    const [chats, setChats] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchMessages = async () => {
            setIsLoading(true)
            const collectionRef = collection(db, "dating_users_chats_list", selected.chat_id, "messages")
            const querySnapshot = await getDocs(collectionRef);
            const chatsData = []
            querySnapshot.forEach((doc) => {
                chatsData.push({ ...doc.data() })
            });
            setChats(chatsData)
            setIsLoading(false)
        }

        selected.chat_id && fetchMessages()
    }, [selected])

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            aria-describedby="form-dialog"
            fullWidth={true}
            maxWidth={"lg"}
        >
            <DialogActions>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={() => {
                        handleClose()
                    }}
                    aria-label="close"
                >
                    <SvgIcon fontSize='small'>
                        <XMarkIcon />
                    </SvgIcon>
                </IconButton>
            </DialogActions>
            <DialogTitle>
                {`Chat between ${selected.male_name} and ${selected.female_name}`}
            </DialogTitle>
            <DialogContent>
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
                <Scrollbar
                    sx={{
                        width: "100%",
                        height: '100%',
                        px: 2,
                        '& .simplebar-content': {
                            height: '100%'
                        },
                        '& .simplebar-scrollbar:before': {
                            background: 'neutral.400'
                        }
                    }}
                >
                    {chats
                        .sort((a, b) => {
                            return a.created_at.toMillis() - b.created_at.toMillis();
                        })
                        .map((item, index) => (
                            <React.Fragment key={index}>
                                {item.message_type === "text" &&
                                    <>
                                        {(index === 0 ||
                                            (index > 0 && compareFirebaseDaysEqual(chats[index - 1].created_at, item.created_at))
                                        ) &&
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    alignContent: "center",
                                                    flexDirection: "column",
                                                    my: 2,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        backgroundColor: "neutral.400",
                                                        px: 1,
                                                        borderRadius: "8px",
                                                    }}
                                                >
                                                    <Typography color={"black"}>
                                                        {formatTimestampDateOrDay(item.created_at)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        }
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: 'center',
                                                mb: 2,
                                                ...(item.message_type_banner && {
                                                    justifyContent: "center",
                                                }),
                                                ...(!item.sender.is_from_male && !item.message_type_banner && {
                                                    flexDirection: "row-reverse",
                                                }),
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    maxWidth: lgUp ? "55%" : "90%",
                                                    backgroundColor: item.message_type_banner ?
                                                        "#f7edd0" :
                                                        item.sender.is_from_male ?
                                                            "neutral.100" :
                                                            "primary.light",
                                                    borderRadius: 1,
                                                    ...((!item.sender.is_from_male || item.message_type_banner) && {
                                                        color: "black",
                                                    }),
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        backgroundColor: item.sender.is_from_male ?
                                                            "neutral.100" : "primary.light",
                                                        borderLeft: "3px solid green",
                                                        borderRadius: 1,
                                                        px: 1,
                                                    }}
                                                >
                                                    <Typography variant='button'>{item.replied_message_sender}</Typography>
                                                    <Typography variant='body2'>{item.replied_message}</Typography>
                                                </Box>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "row",
                                                        justifyContent: 'space-between',
                                                        pt: 1,
                                                        backgroundColor: (theme) => alpha(theme.palette.background.default, 0.3)
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{ pl: 1 }}
                                                    >
                                                        {item.text}
                                                    </Typography>
                                                    <Typography
                                                        sx={{
                                                            px: 2,
                                                            pt: 2
                                                        }}
                                                    >
                                                        {convertTimestampTo24HourFormat(item.created_at)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </>
                                }
                                {item.message_type === "image" &&
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: 'center',
                                            mb: 2,
                                            ...(item.message_type_banner && {
                                                justifyContent: "center",
                                            }),
                                            ...(!item.sender.is_from_male && !item.message_type_banner && {
                                                flexDirection: "row-reverse",
                                            }),
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                maxWidth: lgUp ? "55%" : "90%",
                                                backgroundColor: item.sender.is_from_male ?
                                                    "neutral.100" : "primary.light",
                                            }}
                                        >
                                            <img
                                                width="100%"
                                                src={item.message_url}
                                                alt={"Patient"}
                                                loading="lazy"
                                                style={{ borderRadius: "26px" }}
                                            />
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: 'space-between',
                                                    mt: 1,
                                                    backgroundColor: (theme) => alpha(theme.palette.background.default, 0.3)
                                                }}
                                            >
                                                <Typography
                                                    sx={{ pl: 1 }}
                                                >
                                                    {item.text}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        px: 2,
                                                        pt: 2
                                                    }}
                                                >
                                                    {convertTimestampTo24HourFormat(item.created_at)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                }
                                {item.message_type === "audio" &&
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: 'center',
                                            mb: 2,
                                            ...(item.message_type_banner && {
                                                justifyContent: "center",
                                            }),
                                            ...(!item.sender.is_from_male && !item.message_type_banner && {
                                                flexDirection: "row-reverse",
                                            }),
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                maxWidth: lgUp ? "55%" : "90%",
                                                backgroundColor: item.sender.is_from_male ?
                                                    "neutral.100" : "primary.light",
                                                color: "black",
                                            }}
                                        >
                                            <audio
                                                ref={audioRef}
                                                src={item.message_url}
                                                controls
                                            />
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: 'space-between',
                                                    mt: 1,
                                                    backgroundColor: (theme) => alpha(theme.palette.background.default, 0.3)
                                                }}
                                            >
                                                <Typography
                                                    sx={{ pl: 1 }}
                                                >
                                                    {item.text}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        px: 2,
                                                        pt: 2
                                                    }}
                                                >
                                                    {convertTimestampTo24HourFormat(item.created_at)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                }
                            </React.Fragment>
                        ))}
                </Scrollbar>
            </DialogContent>
        </Dialog>
    )
}

export default ViewChat