import React from 'react'
import { Avatar, Box, CircularProgress, DialogContent, DialogTitle, List, ListItem, ListItemAvatar, ListItemText, Slide, Typography } from '@mui/material'
import { AppDialog, DialogCloseBar } from '../../components/app-dialog';
import { Scrollbar } from '../../components/scrollbar';
import { postRequest } from '../../services/api-service';
import { getAllDoctorBasedOnSpecializationUrl } from '../../seed/url';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

function ViewSpecialization({ open, handleClose, selected }) {
    const [doctors, setDoctors] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true)

    const fetcher = React.useCallback(
        () => {
            postRequest(
                getAllDoctorBasedOnSpecializationUrl,
                {
                    "specialization_id": selected.id,
                },
                (data) => {
                    setDoctors(data.data)
                    setIsLoading(false)
                },
                (error) => {
                    setIsLoading(false)
                }
            )
        },
        [selected]
    );

    React.useEffect(() => {
        fetcher()
    }, [fetcher])

    return (
        <AppDialog
            open={open}
            TransitionComponent={Transition}
            aria-describedby="form-dialog"
            fullWidth={true}
            maxWidth={"md"}
        >
            <DialogCloseBar
                onClose={handleClose}
                iconSize="small"
                title={selected.title}
            />
            <DialogTitle sx={{ display: { xs: 'none', md: 'block' } }}>
                {selected.title}
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
                {!isLoading &&
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
                        <List sx={{ width: '100%', maxWidth: "100%", bgcolor: 'transparent', mb: 6 }}>
                            {doctors.map((item, index) => (
                                <ListItem
                                    key={index}
                                    alignItems="flex-start"
                                    secondaryAction={
                                        <Typography variant='button'>
                                            TZS {item.session_fee}
                                        </Typography>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar variant='rounded' alt="Profile Image" src={item.doc_profile_image} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={`${item.first_name} ${item.last_name}`}
                                        secondary={item.current_hospital}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Scrollbar>
                }
            </DialogContent>
        </AppDialog>
    )
}

export default ViewSpecialization