import React from 'react'
import { Box, Button, MenuItem, TextField, Typography, } from '@mui/material';
import { doctorInformationFields } from '../../seed/form-fields';
import { Form, Formik } from 'formik';
import * as Yup from "yup"
import { useDispatch, useSelector } from 'react-redux';
import { postRequest } from '../../services/api-service';
import { createDoctorUrl, updateDoctorOnCreationUrl } from '../../seed/url';
import { DatePicker } from '@mui/x-date-pickers';

function DoctorCreationForm(props) {
    const {
        steps,
        activeStep,
        handleBack,
        handleNext,
        handleSkip,
        isStepOptional,
    } = props;
    const doctorInformation = useSelector((state) => state.DoctorInformationReducer)
    const dispatch = useDispatch()
    const [error, setError] = React.useState("")

    const schema = Yup.object().shape(
        doctorInformationFields.reduce((obj, field) => {
            obj[field.name] = Yup.string().min(1, `${field.label} must be at least 1 characters`)
                .required(`${field.label} is required`)
            return obj
        }, {})
    )

    return (
        <>
            <Formik
                initialValues={doctorInformation}
                validationSchema={schema}
                onSubmit={(values, helpers) => {
                    // console.log("onSubmit", JSON.stringify(values, null, 2))
                    postRequest(
                        values.doctor_id > 0 ? updateDoctorOnCreationUrl : createDoctorUrl,
                        { ...values, date_of_birth: values.date_of_birth.format("DD/MM/YYYY") },
                        (data) => {
                            dispatch({
                                type: "DOCTOR_INFO",
                                payload: values.doctor_id > 0 ? values : { ...values, doctor_id: data.id },
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
                    )
                }}
            >
                {({ isSubmitting, values, touched, errors, handleChange, handleBlur, setFieldValue }) => (
                    <Form
                        noValidate
                        autoComplete="off"
                    >
                        {doctorInformationFields.map((field, index) => {
                            const selectItems = field.items ?
                                field.items : []

                            return (
                                <React.Fragment key={index}>
                                    {field.type === "select" ?
                                        <TextField
                                            id={field.name}
                                            select
                                            margin='normal'
                                            label={field.label}
                                            value={values[field.name]}
                                            onChange={(event) => {
                                                setFieldValue(field.name, event.target.value)
                                            }}
                                            fullWidth
                                        >
                                            {selectItems.map((item, index) => (
                                                <MenuItem
                                                    key={index}
                                                    value={item.value}
                                                >
                                                    {item.value}
                                                </MenuItem>
                                            ))
                                            }
                                        </TextField> :
                                        field.type === "date" ?
                                            <DatePicker
                                                label={field.label}
                                                value={values[field.name]}
                                                onChange={(newValue) => {
                                                    setFieldValue(field.name, newValue)
                                                }}
                                                slotProps={{
                                                    textField: {
                                                        margin: "normal",
                                                        error: Boolean(errors[field.name] && touched[field.name]),
                                                        helperText: touched[field.name] && errors[field.name],
                                                        onBlur: handleBlur,
                                                        fullWidth: true
                                                    }
                                                }}
                                            /> :
                                            <TextField
                                                id={field.name}
                                                required={field.require}
                                                name={field.name}
                                                type={field.type}
                                                label={field.label}
                                                margin="normal"
                                                fullWidth
                                                value={values[field.name]}
                                                error={Boolean(errors[field.name] && touched[field.name])}
                                                helperText={touched[field.name] && errors[field.name]}
                                                onBlur={handleBlur}
                                                onChange={handleChange}
                                            />
                                    }
                                </React.Fragment>
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
                    </Form>
                )}
            </Formik>
        </>
    )
}

export default DoctorCreationForm