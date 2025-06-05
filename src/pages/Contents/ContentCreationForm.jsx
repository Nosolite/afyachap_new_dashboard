import React from 'react'
import { Autocomplete, Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, MenuItem, TextField, Typography } from '@mui/material';
import { contentFields } from '../../seed/form-fields';
import { Form, Formik } from 'formik';
import * as Yup from "yup"
import { campaignUrl, createContentUrl, getAllAuthorUrl, getAllCategoriesByPaginationUrl, getAllSubCategoriesUrl, getProductUrl, updateContentUrl } from '../../seed/url';
import { authPostRequest, getRequest, postRequest, webGetRequest } from '../../services/api-service';
import { useDispatch, useSelector } from 'react-redux';
import CustomEditor from '../../components/custom-editor';

function ContentCreationForm(props) {
    const {
        steps,
        activeStep,
        handleBack,
        handleNext,
        handleSkip,
        isStepOptional,
    } = props;
    const noProduct = { id: 0, product_name: "No Product", product_files: [""] };
    const contentInformation = useSelector((state) => state.ContentInformationReducer)
    const dispatch = useDispatch()
    const [options, setOptions] = React.useState([]);
    const [value, setValue] = React.useState(options[0]);
    const [inputValue, setInputValue] = React.useState('');
    const [authors, setAuthors] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [subCategories, setSubCategories] = React.useState([]);
    const [campaigns, setCampaigns] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState("")
    const schema = Yup.object().shape(
        contentFields.reduce((obj, field) => {
            if (field.notRequired) {
                obj[field.name] = Yup.string().min(1, `${field.label} minimum is one`)
                    .required(`${field.label} is required`).optional()
            } else {
                obj[field.name] = Yup.string().min(1, `${field.label} minimum is one`)
                    .required(`${field.label} is required`)
            }
            return obj
        }, {})
    )

    React.useEffect(() => {
        getRequest(
            getAllAuthorUrl,
            (data) => {
                setAuthors(data);
            },
            (error) => {
                setIsLoading(false)
            }
        )
    }, [])

    React.useEffect(() => {
        postRequest(
            getAllCategoriesByPaginationUrl,
            {
                "sort": "id desc",
                "limit": 100,
                "page": 1
            },
            (data) => {
                setCategories(data.results)
                setIsLoading(false)
            },
            (error) => { },
        )
    }, [])

    React.useEffect(() => {
        webGetRequest(
            campaignUrl,
            (data) => {
                setCampaigns(data)
                setIsLoading(false)
            },
            (error) => {
                error?.response?.data?.message && setError(error.response.data.message[0])
                setIsLoading(false)
            }
        )
    }, [])

    React.useEffect(() => {
        fetchSubcategories(contentInformation.category_id)
    }, [contentInformation])

    React.useEffect(() => {
        postRequest(
            getProductUrl,
            { id: contentInformation.product_id, },
            (data) => {
                if (contentInformation.product_id !== 0) {
                    setInputValue(data.product_name)
                    authPostRequest(
                        contentFields[9].searchUrl,
                        { ...contentFields[9].searchBody, query: "" },
                        (data) => {
                            setOptions([...data.results, { id: 0, product_name: "No Product", product_files: [""] }])
                            setIsLoading(false)
                        },
                        (error) => {
                            error?.response?.data?.message && setError(error.response.data.message[0])
                            setIsLoading(false)
                        }
                    )
                }
            },
            (error) => { }
        )
    }, [contentInformation])

    const fetchSubcategories = (categoryId) => {
        postRequest(
            getAllSubCategoriesUrl,
            { category_id: categoryId },
            (data) => {
                setSubCategories(data)
                setIsLoading(false)
            },
            (error) => {
                error?.response?.data?.message && setError(error.response.data.message[0])
                setIsLoading(false)
            }
        )
    }

    return (
        <>
            <Formik
                initialValues={contentInformation}
                validationSchema={schema}
                onSubmit={(values, helpers) => {
                    // console.log("onSubmit", JSON.stringify(values, null, 2))
                    postRequest(
                        values.id > 0 ? updateContentUrl : createContentUrl,
                        {
                            ...values,
                            description: values.description.replace(/<p><br><\/p>/g, '<p>&nbsp;</p>'),
                        },
                        (data) => {
                            dispatch({
                                type: "CONTENT_INFO",
                                payload: values.id > 0 ? values : { ...values, id: data.id },
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
                        {contentFields.map((field, index) => {
                            const selectItems = field.items ?
                                field.items :
                                field.name === "author_id" ?
                                    authors :
                                    field.name === "category_id" ?
                                        categories :
                                        field.name === "campaign_id" ?
                                            campaigns :
                                            subCategories

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
                                                field.name === "category_id" && fetchSubcategories(event.target.value)
                                                if (field.name === "author_id") {
                                                    const selectedAuthor = authors.find(authorSelected => authorSelected.user_id === event.target.value);
                                                    if (selectedAuthor !== undefined) {
                                                        setFieldValue("is_doctor", selectedAuthor.is_doctor)
                                                    }
                                                }
                                            }}
                                            fullWidth
                                        >
                                            {selectItems.map((item, index) => (
                                                <MenuItem
                                                    key={index}
                                                    value={
                                                        field.items ?
                                                            item.value :
                                                            field.name === "author_id" ?
                                                                item.user_id :
                                                                item.id
                                                    }
                                                >
                                                    {
                                                        isLoading ?
                                                            "Loading..." :
                                                            field.items ?
                                                                item.label :
                                                                field.name === "author_id" ?
                                                                    item.name :
                                                                    field.name === "category_id" ?
                                                                        item.category_name :
                                                                        field.name === "campaign_id" ?
                                                                            item.title :
                                                                            item.name
                                                    }
                                                </MenuItem>
                                            ))
                                            }
                                        </TextField> :
                                        field.type === "ck" ?
                                            <Box sx={{ mb: 6, mt: 1 }}>
                                                <Typography>Body</Typography>
                                                <CustomEditor
                                                    value={values[field.name]}
                                                    onChange={(value) => {
                                                        setFieldValue(field.name, value)
                                                    }}
                                                />
                                            </Box> :
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
                                                    value={value}
                                                    inputValue={inputValue}
                                                    onChange={(event, value) => {
                                                        if (value) {
                                                            setValue(value.product_name)
                                                            setInputValue(value.product_name)
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
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label={field.label}
                                                            color='secondary'
                                                            fullWidth
                                                            margin='normal'
                                                            value={inputValue}
                                                            onChange={(event) => {
                                                                setInputValue(event.target.value)
                                                                authPostRequest(
                                                                    field.searchUrl,
                                                                    { ...field.searchBody, query: event.target.value },
                                                                    (data) => {
                                                                        setOptions([...data.results, noProduct])
                                                                        setIsLoading(false)
                                                                    },
                                                                    (error) => {
                                                                        error?.response?.data?.message && setError(error.response.data.message[0])
                                                                        setIsLoading(false)
                                                                    }
                                                                )
                                                            }}
                                                            onFocus={(event) => {
                                                                if (contentInformation.product_id === 0) {
                                                                    setInputValue(event.target.value)
                                                                    authPostRequest(
                                                                        field.searchUrl,
                                                                        { ...field.searchBody, query: event.target.value },
                                                                        (data) => {
                                                                            setOptions([...data.results, noProduct])
                                                                            setIsLoading(false)
                                                                        },
                                                                        (error) => {
                                                                            error?.response?.data?.message && setError(error.response.data.message[0])
                                                                            setIsLoading(false)
                                                                        }
                                                                    )
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                /> :
                                                <TextField
                                                    multiline
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

export default ContentCreationForm