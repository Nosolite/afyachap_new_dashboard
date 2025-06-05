import React from 'react'
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ImageList, ImageListItem, ImageListItemBar, Slide, SvgIcon } from '@mui/material'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import CheckBadgeIcon from '@heroicons/react/24/outline/CheckBadgeIcon'
import { FormDialog } from '../../components/form-dialog'
import { approveDatingUserImageFormFields } from '../../seed/form-fields'
import { getRegisteredDatingUserByIdUrl, verifyDatingUserImageUrl } from '../../seed/url'
import { authPostRequest } from '../../services/api-service'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

function ViewUserPhotos({
    open,
    handleClose,
    selected,
}) {
    const [userImages, setUserImages] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true)
    const [openApproveDialog, setOpenApproveDialog] = React.useState(false);
    const [selectedImage, setSelectedImage] = React.useState({});

    const fetchUserImages = React.useCallback((e) => {
        setIsLoading(true)
        authPostRequest(
            getRegisteredDatingUserByIdUrl,
            { user_id: selected.id, },
            (data) => {
                setUserImages(data.images)
                setIsLoading(false)
            },
            (error) => {
                setUserImages([])
                setIsLoading(false)
            }
        )
    }, [selected])

    React.useEffect(() => {
        fetchUserImages()
    }, [fetchUserImages])

    const handleClickOpenApproveDatingUserImageDialog = (imageData) => {
        setSelectedImage(imageData)
        setOpenApproveDialog(true)
    }

    const handleCloseApproveDatingUserImageDialog = () => {
        fetchUserImages()
        setOpenApproveDialog(false)
    }

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            aria-describedby="form-dialog"
            fullScreen
        >
            {openApproveDialog &&
                <FormDialog
                    open={openApproveDialog}
                    handleClose={handleCloseApproveDatingUserImageDialog}
                    dialogTitle={"Dating Image"}
                    action={"Authorize"}
                    fields={approveDatingUserImageFormFields}
                    values={[{
                        user_id: selected.id,
                        image_id: selectedImage.id,
                        status: selectedImage.image_verified,
                        disabled_reason: selectedImage.rejection_reason,
                    }]}
                    url={verifyDatingUserImageUrl}
                />
            }
            <DialogActions>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="close"
                    onClick={() => {
                        handleClose()
                    }}
                >
                    <SvgIcon fontSize='large'>
                        <XMarkIcon />
                    </SvgIcon>
                </IconButton>
            </DialogActions>
            <DialogTitle>Photos</DialogTitle>
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
                {!isLoading &&
                    <ImageList sx={{ width: "100%", height: "100%" }} cols={3} gap={8}>
                        {userImages.map((item, index) => (
                            <ImageListItem key={index}>
                                {item.file_type === "VIDEO" ?
                                    <video
                                        width="100%"
                                        controls
                                        src={`${item.video_url}`}
                                    /> :
                                    item.file_type === "YOUTUBE" ?
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`${item.video_url}`}
                                            title={selected.product_name}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowfullscreen
                                            style={{
                                                borderRadius: "8px",
                                                overflow: "hidden",
                                            }}
                                        /> :
                                        <img
                                            src={`${item.image_url}?w=161&fit=crop&auto=format`}
                                            alt={selected.product_name}
                                            loading="lazy"
                                        />
                                }
                                <ImageListItemBar
                                    title={`Verified: ${item.image_verified}`}
                                    subtitle={item.rejection_reason}
                                    actionIcon={
                                        <Button
                                            startIcon={
                                                <SvgIcon fontSize="small"><CheckBadgeIcon /></SvgIcon>
                                            }
                                            variant='contained'
                                            sx={{ m: 1 }}
                                            onClick={() => {
                                                handleClickOpenApproveDatingUserImageDialog(item)
                                            }}
                                        >
                                            Verify
                                        </Button>
                                    }
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                }
            </DialogContent>
        </Dialog>
    )
}

export default ViewUserPhotos