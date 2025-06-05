import React from 'react'
import { Box, Button, Chip, IconButton, InputAdornment, OutlinedInput, SvgIcon, Typography, } from '@mui/material';
import PaperClipIcon from '@heroicons/react/24/outline/PaperClipIcon';
import { doctorCertificatesFields } from '../../seed/form-fields';
import { Form, Formik } from 'formik';
import * as Yup from "yup"
import { useDispatch, useSelector } from 'react-redux';
import { authPostRequest } from '../../services/api-service';
import { addDoctorAttachmentsUrl } from '../../seed/url';
import { UPDATE } from '../../utils/constant';

function DoctorCertifications(props) {
    const {
        steps,
        activeStep,
        handleBack,
        handleNext,
        handleSkip,
        isStepOptional,
    } = props;
    const doctorAttachments = useSelector((state) => state.DoctorAttachmentsReducer)
    const doctorInformation = useSelector((state) => state.DoctorInformationReducer)
    const dispatch = useDispatch()
    const [error, setError] = React.useState("")

    const schema = Yup.object().shape(
        doctorCertificatesFields.reduce((obj, field) => {
            obj[field.name] = Yup.string().min(3, `${field.label} must be at least 3 characters`)
                .required(`${field.label} is required`)
            return obj
        }, {})
    )

    return (
        <>
            <Formik
                initialValues={doctorAttachments}
                validationSchema={schema}
                onSubmit={(values, helpers) => {
                    values.action === UPDATE ?
                        handleNext() :
                        authPostRequest(
                            addDoctorAttachmentsUrl,
                            { ...values, user_id: doctorInformation.doctor_id },
                            (data) => {
                                dispatch({
                                    type: "DOCTOR_ATTACHMENTS",
                                    payload: { ...values, action: UPDATE },
                                })
                                handleNext()
                                helpers.setSubmitting(false)
                            },
                            (error) => {
                                if (error?.response?.data?.message) {
                                    setError(error.response.data.message[0])
                                } else {
                                    helpers.setErrors(error.response.data)
                                }
                                helpers.setSubmitting(false)
                            },
                            true,
                        )
                }}
            >
                {({ isSubmitting, values, touched, errors, setValues }) => (
                    <Form
                        noValidate
                        autoComplete="off"
                    >
                        <Box
                            sx={{
                                height: '60vh',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Box>
                                {doctorCertificatesFields.map((field, index) => {

                                    return (
                                        <OutlinedInput
                                            key={index}
                                            id={field.name}
                                            placeholder={values[field.name] == null ? field.label : ""}
                                            readOnly
                                            required
                                            type="text"
                                            margin="none"
                                            fullWidth
                                            error={Boolean(errors[field.name] && touched[field.name])}
                                            startAdornment={(
                                                <InputAdornment position="start">
                                                    {values[field.name]?.name &&
                                                        <Chip
                                                            label={values[field.name]?.name}
                                                            onDelete={() => {
                                                                setValues({ ...values, [field.name]: null })
                                                            }}
                                                        />
                                                    }
                                                </InputAdornment>
                                            )}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    {values[field.name] == null &&
                                                        <IconButton
                                                            aria-label="upload picture"
                                                            component="label"
                                                        >
                                                            <input
                                                                hidden
                                                                accept={field.type === "image" ? "image/*" : "application/pdf"}
                                                                type="file"
                                                                onChange={(e) => {
                                                                    e.preventDefault();
                                                                    if (e.target.files) {
                                                                        setValues({ ...values, [field.name]: e.target.files[0] })
                                                                    }
                                                                }}
                                                            />
                                                            <SvgIcon fontSize='small'>
                                                                <PaperClipIcon />
                                                            </SvgIcon>
                                                        </IconButton>
                                                    }
                                                </InputAdornment>
                                            }
                                            sx={{ mt: 2 }}
                                        />
                                    )
                                })}
                                <Typography
                                    color="error"
                                    sx={{
                                        mt: 2,
                                    }}
                                >
                                    {error}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}
                            >
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
                                    type="submit"
                                    disabled={isSubmitting}
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
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default DoctorCertifications