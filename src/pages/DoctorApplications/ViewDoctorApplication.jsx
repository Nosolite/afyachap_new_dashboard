import React from 'react'
import { Autocomplete, Avatar, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, IconButton, ImageList, ImageListItem, ImageListItemBar, List, ListItem, ListItemAvatar, ListItemText, Slide, SvgIcon, Tab, Table, TableBody, TableCell, TableRow, Tabs, TextField, Typography, } from '@mui/material'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import { Scrollbar } from '../../components/scrollbar';
import { capitalizeFirstLetter, openPdfInNewTab } from '../../utils/constant';
import { postRequest } from '../../services/api-service';
import { assignDoctorSpecializationUrl, getDoctorAttachmentsUrl, searchSpecializationUrl, verifyDoctorUrl } from '../../seed/url';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

function ViewDoctorApplication({ open, handleClose, selected }) {
    const [rows, setRows] = React.useState([]);
    const [attachments, setAttachments] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [currentTab, setCurrentTab] = React.useState(0)
    const [options, setOptions] = React.useState([])
    const [value, setValue] = React.useState("")
    const [isSubmitting, setSubmitting] = React.useState("")
    const [error, setError] = React.useState("")
    const [specializationId, setSpecializationId] = React.useState(0)

    const handleTabChange = React.useCallback(
        (event, value) => {
            setCurrentTab(value)
        },
        []
    )

    const assignSpecialization = () => {
        postRequest(
            assignDoctorSpecializationUrl,
            {
                specialization_id: specializationId,
                user_id: selected.id
            },
            (data) => {
                verifyDoctor()
                setSubmitting(false)
            },
            (error) => {
                error?.response?.data?.message && setError(error.response.data.message[0])
                setSubmitting(false)
            },
        )
    }

    const verifyDoctor = () => {
        postRequest(
            verifyDoctorUrl,
            {
                user_id: selected.id,
                status: "YES"
            },
            (data) => {
                handleClose()
            },
            (error) => {
                error?.response?.data?.message && setError(error.response.data.message[0])
            },
        )
    }

    const fetcher = React.useCallback(
        () => {
            setIsLoading(true)
            postRequest(
                getDoctorAttachmentsUrl,
                {
                    user_id: selected.id,
                },
                (data) => {
                    setAttachments(data.data)
                    setIsLoading(false)
                },
                (error) => {
                    setIsLoading(false)
                },
            )
        },
        [selected]
    );

    React.useEffect(() => {
        const { id, doc_profile_image, is_valid_email, is_valid_number, is_online, total_patient, average_rating, ...restData } = selected;
        setRows(Object.entries(restData))
    }, [selected])

    React.useEffect(() => {
        fetcher()
    }, [fetcher])

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
                        label="Doctor Information"
                        value={0}
                    />
                    <Tab
                        label="Doctor Attachments"
                        value={1}
                    />
                    <Tab
                        label="Assign specialization and verify"
                        value={2}
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
                                {rows.map(([key, value]) => (
                                    <TableRow key={key}>
                                        <TableCell>{capitalizeFirstLetter(key)}</TableCell>
                                        <TableCell>{value}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    }
                    {currentTab === 1 &&
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
                            {!isLoading && attachments.length === 0 &&
                                <Typography>
                                    No attachments
                                </Typography>
                            }
                            {!isLoading &&
                                <ImageList sx={{ width: "100%", height: "100%" }} cols={2} gap={8}>
                                    {attachments.map((item) => (
                                        <ImageListItem key={item.DOCUMENT_PATH}>
                                            <iframe
                                                src={`${item.DOCUMENT_PATH}`}
                                                title={item.FILE_TYPE}
                                                loading="lazy"
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                            <ImageListItemBar
                                                title={item.FILE_TYPE}
                                                actionIcon={
                                                    <IconButton
                                                        sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                                                        aria-label={`info about ${item.FILE_TYPE}`}
                                                        onClick={() => openPdfInNewTab(item.DOCUMENT_PATH)}
                                                    >
                                                        <SvgIcon fontSize='small'>
                                                            <EyeIcon />
                                                        </SvgIcon>
                                                    </IconButton>
                                                }
                                            />
                                        </ImageListItem>
                                    ))}
                                </ImageList>
                            }
                        </>
                    }
                    {currentTab === 2 &&
                        <>
                            <Autocomplete
                                options={options}
                                getOptionLabel={(option) =>
                                    option.title.toString()
                                }
                                filterOptions={(x) => x}
                                noOptionsText={isLoading ? "Loading..." : "No items"}
                                includeInputInList
                                filterSelectedOptions
                                onChange={(event, value) => {
                                    if (value) {
                                        setSpecializationId(value.id)
                                    }
                                }}
                                renderOption={(props, option) => {

                                    return (
                                        <li {...props}>
                                            <List sx={{ width: "100%" }}>
                                                <ListItem>
                                                    <ListItemAvatar>
                                                        <Avatar src={option.url} />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={option.title}
                                                    />
                                                </ListItem>
                                            </List>
                                        </li>
                                    )
                                }}
                                onInputChange={() => setOptions([])}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={`Search specialization`}
                                        color='secondary'
                                        fullWidth
                                        margin='normal'
                                        value={value}
                                        onChange={(event) => {
                                            setValue(event.target.value)
                                            postRequest(
                                                searchSpecializationUrl,
                                                { query: event.target.value },
                                                (data) => {
                                                    setOptions(data.data)
                                                    setIsLoading(false)
                                                },
                                                (error) => {
                                                    error?.response?.data?.message && setError(error.response.data.message[0])
                                                    setIsLoading(false)
                                                }
                                            )
                                        }}
                                        onFocus={(event) => {
                                            setValue(event.target.value)
                                            postRequest(
                                                searchSpecializationUrl,
                                                { query: event.target.value },
                                                (data) => {
                                                    setOptions(data.data)
                                                    setIsLoading(false)
                                                },
                                                (error) => {
                                                    error?.response?.data?.message && setError(error.response.data.message[0])
                                                    setIsLoading(false)
                                                }
                                            )
                                        }}
                                    />
                                )}
                            />
                            <Typography
                                color="error"
                                sx={{
                                    mt: 2,
                                }}
                            >
                                {error}
                            </Typography>
                            <Button
                                disabled={isSubmitting}
                                variant='contained'
                                sx={{
                                    mt: 3,
                                    color: "neutral.100",
                                }}
                                onClick={() => {
                                    specializationId > 0 && assignSpecialization()
                                }}
                            >
                                {isSubmitting ?
                                    "Loading..." :
                                    "Assign specialization and verify"
                                }
                            </Button>
                        </>
                    }
                </Scrollbar>
            </DialogContent>
        </Dialog>
    )
}

export default ViewDoctorApplication