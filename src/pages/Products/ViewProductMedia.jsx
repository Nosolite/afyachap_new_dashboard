import React from 'react'
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Fab, IconButton, ImageList, ImageListItem, ImageListItemBar, Slide, SvgIcon, Typography } from '@mui/material'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import { postRequest } from '../../services/api-service'
import { addProductImageUrl, deleteProductImageUrl, getProductUrl } from '../../seed/url'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

function ViewProductMedia({
    open,
    handleClose,
    selected
}) {
    const [productImages, setProductImages] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true)
    const [isSubmitting, setSubmitting] = React.useState(false)
    const [error, setError] = React.useState("")

    const readUploadFile = (e) => {
        e.preventDefault();
        if (e.target.files) {
            uploadProductImage(e)
        }
    }

    const fetchProductImages = React.useCallback((e) => {
        setIsLoading(true)
        postRequest(
            getProductUrl,
            { id: selected.id, },
            (data) => {
                setError("")
                setProductImages(data.product_files)
                setIsLoading(false)
            },
            (error) => {
                setProductImages([])
                error?.response?.data?.message && setError(error.response.data.message[0])
                setIsLoading(false)
            }
        )
    }, [selected])

    const uploadProductImage = (e) => {
        setIsLoading(true)
        postRequest(
            addProductImageUrl,
            {
                product_id: selected.id,
                image: e.target.files[0]
            },
            (data) => {
                fetchProductImages()
                setSubmitting(false)
            },
            (error) => {
                error?.response?.data?.message && setError(error.response.data.message[0])
                setSubmitting(false)
            },
            true,
        )
    }

    const deleteProductImage = (id) => {
        postRequest(
            deleteProductImageUrl,
            { id: id, },
            (data) => {
                fetchProductImages()
                setSubmitting(false)
            },
            (error) => {
                error?.response?.data?.message && setError(error.response.data.message[0])
                setSubmitting(false)
            },
        )
    }

    React.useEffect(() => {
        fetchProductImages()
    }, [fetchProductImages])

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            aria-describedby="form-dialog"
            fullWidth={true}
            maxWidth={"xl"}
        >
            <DialogActions>
                <IconButton
                    edge="start"
                    color="inherit"
                    aria-label="close"
                    disabled={isSubmitting}
                    onClick={() => {
                        handleClose()
                    }}
                >
                    <SvgIcon fontSize='small'>
                        <XMarkIcon />
                    </SvgIcon>
                </IconButton>
            </DialogActions>
            <DialogTitle>Product Media</DialogTitle>
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
                {productImages && !isLoading &&
                    <>
                        <ImageList sx={{ width: "100%", height: "100%" }} cols={3} gap={8}>
                            {productImages.map((item, index) => (
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
                                        title={selected.product_name}
                                        actionIcon={
                                            <IconButton
                                                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                aria-label={`info about ${selected.product_name}`}
                                                onClick={() => { deleteProductImage(item.id) }}
                                                disabled={isSubmitting}
                                            >
                                                <SvgIcon fontSize='small'>
                                                    <TrashIcon />
                                                </SvgIcon>
                                            </IconButton>
                                        }
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                        {productImages.length < 5 &&
                            <Box display="flex" justifyContent="flex-end">
                                <Fab color="primary" aria-label="add" component="label">
                                    <input
                                        hidden
                                        type="file"
                                        onChange={readUploadFile}
                                    />
                                    <SvgIcon fontSize="small">
                                        <PlusIcon />
                                    </SvgIcon>
                                </Fab>
                            </Box>
                        }
                    </>
                }
                <Typography
                    color="error"
                    sx={{
                        mt: 2,
                    }}
                >
                    {error}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ViewProductMedia