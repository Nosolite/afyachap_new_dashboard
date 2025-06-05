import React from 'react'
import { Avatar, Dialog, DialogActions, DialogContent, IconButton, ImageList, ImageListItem, List, ListItem, ListItemAvatar, ListItemText, Slide, SvgIcon, Tab, Table, TableBody, TableCell, TableRow, Tabs, Typography, } from '@mui/material'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { Scrollbar } from '../../components/scrollbar';
import { getInitials } from '../../utils/get-initials';
import { postRequest } from '../../services/api-service';
import { deleteCommentUrl } from '../../seed/url';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

function ViewContent({ open, handleClose, selected, setIsDeleting, setSeverityMessage, setSeverity, handleClickAlert, onSelectOne }) {
    const [currentTab, setCurrentTab] = React.useState(0)

    const handleTabChange = React.useCallback(
        (event, value) => {
            setCurrentTab(value)
        },
        []
    )

    const handleDelete = async (id) => {
        postRequest(
            deleteCommentUrl,
            {
                comment_id: id,
            },
            (data) => {
                onSelectOne({ ...selected, comments: selected.comments.filter(item => item.id !== id) })
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

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            aria-describedby="form-dialog"
            fullWidth={true}
            maxWidth={"md"}
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
            <DialogContent>
                <Tabs
                    onChange={handleTabChange}
                    value={currentTab}
                    sx={{ mt: -4, ml: 3, mb: 3 }}
                    variant='scrollable'
                    scrollButtons="auto"
                >
                    <Tab
                        label="Content Information"
                        value={0}
                    />
                    <Tab
                        label="Images & Videos"
                        value={1}
                    />
                    <Tab
                        label="Audio"
                        value={2}
                    />
                    <Tab
                        label="Comments"
                        value={3}
                    />
                </Tabs>
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
                    {currentTab === 0 &&
                        <Table
                            sx={{
                                '& th, & td': {
                                    borderBottom: 'none',
                                },
                            }}
                        >
                            <TableBody>
                                <TableRow>
                                    <TableCell>Author</TableCell>
                                    <TableCell>{selected.author_name}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Title</TableCell>
                                    <TableCell>{selected.title}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total View</TableCell>
                                    <TableCell>{selected.total_view}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total Likes</TableCell>
                                    <TableCell>{selected.total_likes}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total Saved</TableCell>
                                    <TableCell>{selected.total_saved}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total Shares</TableCell>
                                    <TableCell>{selected.total_shares}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Short Description</TableCell>
                                    <TableCell>{selected.short_description}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Created At</TableCell>
                                    <TableCell>{selected.created_at}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Modified At</TableCell>
                                    <TableCell>{selected.updated_at}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Description</TableCell>
                                    <TableCell>
                                        <Typography
                                            component="div"
                                            dangerouslySetInnerHTML={{ __html: selected.description }}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    }
                    {currentTab === 1 &&
                        <>
                            {selected.content_files.length === 0 &&
                                <Typography>
                                    No content media
                                </Typography>
                            }
                            {selected.content_files.length >= 1 &&
                                <ImageList sx={{ width: "100%", height: "100%" }} cols={2} gap={8}>
                                    {selected.content_files.map((item, index) => (
                                        <ImageListItem key={index}>
                                            {item.file_type === "VIDEO" ?
                                                <video
                                                    width="100%"
                                                    controls
                                                    src={`${item.video_url}`}
                                                /> :
                                                <img
                                                    src={`${item.file_url}?w=161&fit=crop&auto=format`}
                                                    alt={item.title}
                                                    loading="lazy"
                                                />
                                            }
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            }
                        </>
                    }
                    {currentTab === 2 &&
                        <>
                            {selected.audio_url !== "" ?
                                <audio controls>
                                    <source
                                        src={selected.audio_url}
                                        type={"audio/mpeg"}
                                    />
                                    Your browser does not support the audio element.
                                </audio> :
                                <Typography>
                                    No audio
                                </Typography>
                            }
                        </>
                    }
                    {currentTab === 3 &&
                        <>
                            {selected.comments.length === 0 &&
                                <Typography
                                    sx={{
                                        mt: 2
                                    }}
                                >
                                    No comments
                                </Typography>
                            }
                            <List disablePadding sx={{ width: '100%', maxWidth: "100%", bgcolor: 'transparent' }}>
                                {selected.comments.map((item, index) => (
                                    <ListItem
                                        key={index}
                                        alignItems="flex-start"
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <SvgIcon fontSize='small' sx={{ color: "text.primary" }}>
                                                    <TrashIcon />
                                                </SvgIcon>
                                            </IconButton>
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                alt={getInitials(`${item.first_name} ${item.second_name}`)}
                                                src={item.user_image}
                                            />
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${item.first_name} ${item.second_name}`}
                                            secondary={item.comment}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </>
                    }
                </Scrollbar>
            </DialogContent>
        </Dialog>
    )
}

export default ViewContent