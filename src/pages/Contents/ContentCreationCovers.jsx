import React from 'react'
import { Box, Button, CircularProgress, Fab, IconButton, ImageList, ImageListItem, ImageListItemBar, SvgIcon, Typography } from '@mui/material'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { postRequest } from '../../services/api-service';
import { addContentCoverImageUrl, contentsUrl, deleteContentCoverImageUrl, getAllContentCoversUrl } from '../../seed/url';
import { useSelector } from 'react-redux';

function ContentCreationCovers(props) {
    const {
        steps,
        activeStep,
        handleBack,
        handleNext,
        handleSkip,
        isStepOptional,
    } = props;
    const contentInformation = useSelector((state) => state.ContentInformationReducer)
    const [contentCovers, setContentCovers] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true)
    const [isSubmitting, setSubmitting] = React.useState(false)
    const [error, setError] = React.useState("")

    const readUploadFile = (e) => {
        e.preventDefault();
        if (e.target.files) {
            uploadContentCover(e)
        }
    }

    const fetchContentCovers = React.useCallback((e) => {
        setIsLoading(true)
        postRequest(
            getAllContentCoversUrl,
            { content_id: contentInformation.id, },
            (data) => {
                setContentCovers(data)
                setError("")
                setIsLoading(false)
            },
            (error) => {
                setContentCovers([])
                error?.response?.data?.message && setError(error.response.data.message[0])
                setIsLoading(false)
            }
        )
    }, [contentInformation]
    )

    const uploadContentCover = (e) => {
        setIsLoading(true)
        postRequest(
            addContentCoverImageUrl,
            {
                content_id: contentInformation.id,
                image: e.target.files[0],
                added_by: 1,
            },
            (data) => {
                fetchContentCovers()
                setSubmitting(false)
            },
            (error) => {
                error?.response?.data?.message && setError(error.response.data.message[0])
                setSubmitting(false)
                setIsLoading(false)
            },
            true,
        )
    }

    const deleteContentCover = (id) => {
        postRequest(
            deleteContentCoverImageUrl,
            { id: id, },
            (data) => {
                fetchContentCovers()
                setSubmitting(false)
            },
            (error) => {
                error?.response?.data?.message && setError(error.response.data.message[0])
                setSubmitting(false)
            },
        )
    }

    React.useEffect(() => {
        fetchContentCovers()
    }, [fetchContentCovers])

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
            {contentCovers && !isLoading &&
                <>
                    <ImageList sx={{ width: "100%", height: "100%" }} cols={3} gap={8}>
                        {contentCovers.map((item, index) => (
                            <ImageListItem key={index}>
                                {item.FILE_TYPE === "VIDEO" ?
                                    <video
                                        width="100%"
                                        controls
                                        src={`${item.VIDEO_URL}`}
                                    /> :
                                    <img
                                        src={`${contentsUrl}${item.IMAGE_URL}?w=161&fit=crop&auto=format`}
                                        alt={item.CONTENT_TITLE}
                                        loading="lazy"
                                    />
                                }
                                <ImageListItemBar
                                    title={item.CONTENT_TITLE}
                                    actionIcon={
                                        <IconButton
                                            sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                            aria-label={`info about ${item.CONTENT_TITLE}`}
                                            onClick={() => { deleteContentCover(item.ID) }}
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
                    {contentCovers.length < 60 &&
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
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                >
                    Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                {isStepOptional(activeStep) && (
                    <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                        Skip
                    </Button>
                )}

                <Button
                    onClick={() => {
                        contentCovers.length >= 1 && handleNext()
                    }}
                >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </Box>
        </>
    )
}

export default ContentCreationCovers