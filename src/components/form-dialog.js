import * as React from 'react'
import { Autocomplete, Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, MenuItem, OutlinedInput, Slide, SvgIcon, TextField, Typography, } from '@mui/material'
import { Form, Formik } from 'formik'
import * as Yup from "yup"
import PaperClipIcon from '@heroicons/react/24/outline/PaperClipIcon';
import { authPostRequest, webPostRequest } from '../services/api-service';
import { DatePicker, DateTimePicker } from '@mui/x-date-pickers';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { useDispatch, useSelector } from 'react-redux';
import { MuiColorInput } from 'mui-color-input';
import { CREATE } from '../utils/constant';
import CustomEditor from './custom-editor';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export const FormDialog = ({
    open,
    handleClose,
    dialogTitle,
    action,
    fields,
    values,
    url,
    isWebServerRequest = false,
}) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const [value, setValue] = React.useState("");
    const [error, setError] = React.useState("");
    const formInfo = useSelector((state) => state.FormInformationReducer);
    const schema = Yup.object().shape(
        fields.reduce((obj, field) => {
            if (field.type === 'email') {
                if (field.notRequired) {
                    obj[field.name] = Yup.string().email(`${field.label} should be email`)
                        .required(`${field.label} is required`).optional()
                } else {
                    obj[field.name] = Yup.string().email(`${field.label} should be email`)
                        .required(`${field.label} is required`)
                }
            } else {
                if (field.notRequired) {
                    obj[field.name] = Yup.string().min(1, `${field.label} minimum is one`)
                        .required(`${field.label} is required`).optional()
                } else {
                    obj[field.name] = Yup.string().min(1, `${field.label} minimum is one`)
                        .required(`${field.label} is required`)
                }
            }
            return obj
        }, {})
    )
    const [serverError, setServerError] = React.useState("")

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            aria-describedby="form-dialog"
            fullWidth={true}
            maxWidth={"md"}
        >
            <Formik
                initialValues={{ ...values[0] }}
                validationSchema={schema}
                onSubmit={(values, helpers) => {
                    // console.log("onSubmit", JSON.stringify(values, null, 2))
                    helpers.setSubmitting(true);
                    let body = values
                    for (let i = 0; i < fields.length; i++) {
                        // body = { ...body, [fields[i].name]: values[fields[i].name].replace(/<p><br><\/p>/g, '<p>&nbsp;</p>') }
                        if (fields[i].type === "date") {
                            body = { ...body, [fields[i].name]: values[fields[i].name].format("DD/MM/YYYY") }
                        } else if (fields[i].type === "dateTime") {
                            body = { ...body, [fields[i].name]: values[fields[i].name].format('YYYY-MM-DD HH:mm:ss.SSS') }
                        } else if (fields[i].type === "number") {
                            body = { ...body, [fields[i].name]: parseFloat(values[fields[i].name]) }
                        }
                    }
                    isWebServerRequest ?
                        webPostRequest(
                            url,
                            action === CREATE ? body : { ...body, _method: "PUT" },
                            (data) => {
                                helpers.resetForm()
                                helpers.setSubmitting(false)
                                handleClose()
                            },
                            (error) => {
                                if (error?.response?.data?.error) {
                                    setServerError(error.response.data.error)
                                } else {
                                    helpers.setErrors(error.response.data)
                                }
                                helpers.setSubmitting(false)
                            },
                            fields.some(item => item.type === "file") ? true : false
                        ) :
                        authPostRequest(
                            url,
                            body,
                            (data) => {
                                helpers.resetForm()
                                helpers.setSubmitting(false)
                                handleClose()
                            },
                            (error) => {
                                if (error?.response?.data?.message) {
                                    setServerError(error.response.data.message[0])
                                } else {
                                    helpers.setErrors(error.response.data)
                                }
                                helpers.setSubmitting(false)
                            },
                            fields.some(item => item.type === "file") ? true : false
                        )
                }}
            >
                {({ isSubmitting, values, touched, errors, handleChange, handleBlur, setFieldValue, setValues }) => (
                    <Form
                        noValidate
                        autoComplete="off"
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
                        <DialogTitle>{`${action} ${dialogTitle}`}</DialogTitle>
                        <DialogContent>
                            {fields.map((field, index) => {

                                return (
                                    <React.Fragment key={index}>
                                        {field.type === "select" ?
                                            <TextField
                                                id={field.name}
                                                select
                                                margin='normal'
                                                label={field.label}
                                                value={values[field.name]}
                                                error={Boolean(errors[field.name] && touched[field.name])}
                                                helperText={touched[field.name] && errors[field.name]}
                                                onBlur={handleBlur}
                                                onChange={(event) => {
                                                    setFieldValue(field.name, event.target.value)
                                                    dispatch({
                                                        type: "FORM_INFO",
                                                        payload: {
                                                            ...formInfo,
                                                            [field.name]: event.target.value
                                                        },
                                                    })
                                                }}
                                                fullWidth
                                            >
                                                {field.items.map((item, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        value={item.value}
                                                    >
                                                        {item?.label ? item?.label : item.value}
                                                    </MenuItem>
                                                ))}
                                            </TextField> :
                                            field.type === "file" ?
                                                <OutlinedInput
                                                    id={field.name}
                                                    placeholder={(values[field.name]?.name) || (values[field.name] !== null) ? "" : field.label}
                                                    readOnly
                                                    type="text"
                                                    margin="none"
                                                    fullWidth
                                                    error={Boolean(errors[field.name] && touched[field.name])}
                                                    startAdornment={(
                                                        <InputAdornment position="start">
                                                            {(values[field.name]?.name || values[field.name] !== null) &&
                                                                <Chip
                                                                    label={values[field.name]?.name ? values[field.name]?.name : "Image"}
                                                                    onDelete={() => {
                                                                        setValues({ ...values, [field.name]: null })
                                                                    }}
                                                                />
                                                            }
                                                        </InputAdornment>
                                                    )}
                                                    endAdornment={
                                                        <InputAdornment position="end">
                                                            {(values[field.name]?.name) || (values[field.name] !== null) ?
                                                                values[field.name]?.type === "audio/mpeg" ?
                                                                    <audio controls>
                                                                        <source
                                                                            src={values[field.name]?.name ? URL.createObjectURL(values[field.name]) : values[field.name]}
                                                                            type={values[field.name]?.type}
                                                                        />
                                                                        Your browser does not support the audio element.
                                                                    </audio> :
                                                                    <Avatar
                                                                        variant='rounded'
                                                                        alt={values[field.name]?.name}
                                                                        src={values[field.name]?.name ? URL.createObjectURL(values[field.name]) : values[field.name]}
                                                                    /> :
                                                                <IconButton
                                                                    aria-label="upload picture"
                                                                    component="label"
                                                                >
                                                                    <input
                                                                        hidden
                                                                        // accept="image/*"
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
                                                /> :
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
                                                    field.type === "dateTime" ?
                                                        <DateTimePicker
                                                            disablePast
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
                                                        field.type === "search" ?
                                                            <Autocomplete
                                                                options={options}
                                                                getOptionLabel={(option) =>
                                                                    `${option[field.searchLabel].toString()}`
                                                                }
                                                                filterOptions={(x) => x}
                                                                noOptionsText={isLoading ? "Loading..." : "No items"}
                                                                includeInputInList
                                                                filterSelectedOptions
                                                                onChange={(event, value) => {
                                                                    if (value) {
                                                                        setFieldValue(field.name, value.id)
                                                                    }
                                                                }}
                                                                renderOption={(props, option) => {

                                                                    return (
                                                                        <li {...props}>
                                                                            <List sx={{ width: "100%" }}>
                                                                                <ListItem>
                                                                                    {field.searchImage &&
                                                                                        <ListItemAvatar>
                                                                                            <Avatar src={option[field.searchImage][0][field.searchImageFirstItem] || option[field.searchImage]} />
                                                                                        </ListItemAvatar>
                                                                                    }
                                                                                    <ListItemText
                                                                                        primary={`${option[field.searchLabel]}`}
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
                                                                        label={field.label}
                                                                        color='secondary'
                                                                        fullWidth
                                                                        margin='normal'
                                                                        value={value}
                                                                        onChange={(event) => {
                                                                            setValue(event.target.value)
                                                                            authPostRequest(
                                                                                field.searchUrl,
                                                                                { ...field.searchBody, query: event.target.value },
                                                                                (data) => {
                                                                                    setOptions(data.results)
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
                                                                            authPostRequest(
                                                                                field.searchUrl,
                                                                                { ...field.searchBody, query: event.target.value },
                                                                                (data) => {
                                                                                    setOptions(data.results)
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
                                                            /> :
                                                            field.type === "color" ?
                                                                <MuiColorInput
                                                                    id={field.name}
                                                                    required
                                                                    name={field.name}
                                                                    label={field.label}
                                                                    margin="normal"
                                                                    format="hex"
                                                                    fallbackValue="#ffffff"
                                                                    fullWidth
                                                                    value={values[field.name]}
                                                                    error={Boolean(errors[field.name] && touched[field.name])}
                                                                    helperText={touched[field.name] && errors[field.name]}
                                                                    onBlur={handleBlur}
                                                                    onChange={(newValue) => {
                                                                        setFieldValue(field.name, newValue)
                                                                    }}
                                                                /> :
                                                                field.type === "ck" ?
                                                                    <Box sx={{ mb: 10, mt: 2 }}>
                                                                        <Typography>{field.label}</Typography>
                                                                        <CustomEditor
                                                                            value={values[field.name]}
                                                                            onChange={(value) => {
                                                                                setFieldValue(field.name, value)
                                                                            }}
                                                                        />
                                                                    </Box> :
                                                                    <TextField
                                                                        id={field.name}
                                                                        multiline
                                                                        required
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
                                {serverError}
                                {error}
                            </Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={handleClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ?
                                    "Loading..." :
                                    `${action}`
                                }
                            </Button>
                        </DialogActions>
                    </Form>
                )}
            </Formik>
        </Dialog>
    )
}