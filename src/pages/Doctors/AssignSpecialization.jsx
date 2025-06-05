import React from 'react'
import { Autocomplete, Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from '@mui/material';
import { postRequest } from '../../services/api-service';
import { assignDoctorSpecializationUrl, searchSpecializationUrl, verifyDoctorUrl } from '../../seed/url';
import { useSelector } from 'react-redux';

function AssignSpecialization(props) {
    const {
        steps,
        activeStep,
        handleBack,
        handleNext,
        handleSkip,
        isStepOptional,
    } = props;
    const [isLoading, setIsLoading] = React.useState(false)
    const [options, setOptions] = React.useState([])
    const [value, setValue] = React.useState("")
    const [isSubmitting, setSubmitting] = React.useState("")
    const [error, setError] = React.useState("")
    const [specializationId, setSpecializationId] = React.useState(0)
    const doctorInformation = useSelector((state) => state.DoctorInformationReducer)

    const assignSpecialization = (handleNext) => {
        postRequest(
            assignDoctorSpecializationUrl,
            {
                specialization_id: specializationId,
                user_id: doctorInformation.doctor_id
            },
            (data) => {
                verifyDoctor(handleNext)
                setSubmitting(false)
            },
            (error) => {
                error?.response?.data?.message && setError(error.response.data.message[0])
                setSubmitting(false)
            },
        )
    }

    const verifyDoctor = (handleNext) => {
        postRequest(
            verifyDoctorUrl,
            {
                user_id: doctorInformation.doctor_id,
                status: "YES"
            },
            (data) => {
                handleNext()
            },
            (error) => {
                error?.response?.data?.message && setError(error.response.data.message[0])
                setSubmitting(false)
            },
        )
    }

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
            }}
        >
            <Box
                sx={{
                    width: '100%',
                }}
            >
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
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
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
                    disabled={isSubmitting}
                    onClick={() => {
                        specializationId > 0 && assignSpecialization(handleNext)
                    }}
                >
                    {isSubmitting ?
                        "Loading..." :
                        activeStep === steps.length - 1 ?
                            'Finish' :
                            'Next'
                    }
                </Button>
            </Box>
        </Box>
    )
}

export default AssignSpecialization