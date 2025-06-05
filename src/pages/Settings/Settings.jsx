import React from 'react'
import { Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Container, Divider, Grid, MenuItem, Stack, TextField, Typography } from '@mui/material'
import { getAllMobileConfigurationUrl, getContentSettingsUrl, updateContentSettingUrl } from '../../seed/url';
import { authGetRequest, postRequest } from '../../services/api-service';
import { Form, Formik } from 'formik'
import * as Yup from "yup"
import { mobileConfigurationFields } from '../../seed/form-fields';
import { settingsDefaultData } from '../../utils/constant';
import { IOSSwitch } from '../../components/IOSSwitch';

const schema = Yup.object().shape(
  mobileConfigurationFields.reduce((obj, field) => {
    if (field.type === 'email') {
      obj[field.name] = Yup.string().email(`${field.label} should be email`)
        .required(`${field.label} is required`)
    } else {
      obj[field.name] = Yup.string().min(1, `${field.label} minimum is one`)
        .required(`${field.label} is required`)
    }
    return obj
  }, {})
)

function Settings() {
  const [serverError, setServerError] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSwitchLoading, setSwitchIsLoading] = React.useState(false)
  const [mobileConfiguration, setMobileConfiguration] = React.useState(settingsDefaultData);
  const [sendNotification, setSendNotification] = React.useState(false)

  const fetchMobileConfiguration = React.useCallback(
    () => {
      setIsLoading(true)
      authGetRequest(
        getAllMobileConfigurationUrl,
        (data) => {
          setMobileConfiguration(
            {
              ...data,
              show_card: data.show_card ? "YES" : "NO",
              show_categories: data.show_categories ? "YES" : "NO",
              show_specialization: data.show_specialization ? "YES" : "NO",
              force_update: data.force_update ? "YES" : "NO",
              default_swahili_language: data.default_swahili_language ? "YES" : "NO",
              disable_doctor_registration: data.disable_doctor_registration ? "YES" : "NO",
              android_force_update: data.android_force_update ? "YES" : "NO",
              ios_force_update: data.ios_force_update ? "YES" : "NO",
              disable_promo_code: data.disable_promo_code ? "YES" : "NO",
            }
          )
          setIsLoading(false)
        },
        (error) => {
          setServerError(error)
          setMobileConfiguration(settingsDefaultData)
          setIsLoading(false)
        },
      )
    },
    [setIsLoading]
  )

  const fetchContentSettings = React.useCallback(
    () => {
      setSwitchIsLoading(true)
      authGetRequest(
        getContentSettingsUrl,
        (data) => {
          const settings = data.filter(item => item.ID === 38)
          settings.length === 1 && setSendNotification(settings[0].VALUE === 1 ? true : false)
          setSwitchIsLoading(false)
        },
        (error) => {
          setServerError(error)
          setSendNotification(false)
          setSwitchIsLoading(false)
        },
      )
    },
    [setSwitchIsLoading]
  )

  const updateSettingstatus = (id) => {
    if (!isSwitchLoading) {
      postRequest(
        updateContentSettingUrl,
        {
          id: id,
          value: sendNotification ? -1 : 1,
        },
        (data) => {
          fetchContentSettings()
          setSwitchIsLoading(false)
        },
        (error) => {
          error?.response?.data?.message && setServerError(error.response.data.message[0])
          setSwitchIsLoading(false)
        },
      )
    }
  }

  React.useEffect(() => {
    fetchMobileConfiguration()
  }, [fetchMobileConfiguration])

  React.useEffect(() => {
    fetchContentSettings()
  }, [fetchContentSettings])

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        pt: 2,
        pb: 8
      }}
    >
      <Container maxWidth={false}>
        <Stack spacing={1}>
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={4}
          >
            <Stack spacing={1}>
              <Typography variant="h4">
                Settings
              </Typography>
            </Stack>
          </Stack>
          <Formik
            enableReinitialize
            initialValues={mobileConfiguration}
            validationSchema={schema}
            onSubmit={(values, helpers) => {
              // console.log("onSubmit", JSON.stringify(values, null, 2))
              postRequest(
                "url",
                values,
                (data) => {
                  helpers.setSubmitting(false)
                },
                (error) => {
                  if (error?.response?.data?.message) {
                    setServerError(error.response.data.message[0])
                  } else {
                    helpers.setErrors(error.response.data)
                  }
                  helpers.setSubmitting(false)
                },
              )
            }}
          >
            {({ isSubmitting, values, touched, errors, handleChange, handleBlur, setFieldValue, setValues }) => (
              <Form
                noValidate
                autoComplete="off"
              >
                <Card
                  elevation={1}
                >
                  <CardHeader
                    title="Mobile Application Configurations"
                  />
                  <Divider
                    sx={{
                      borderColor: 'neutral.200',
                    }}
                  />
                  <CardContent>
                    {isLoading &&
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: "center",
                      }}>
                        <CircularProgress
                          sx={{
                            mx: 'auto',
                          }}
                        />
                      </Box>
                    }
                    {!isLoading &&
                      <Grid container spacing={3}>
                        {mobileConfigurationFields.map((field, index) => {

                          return (
                            <Grid key={index} item sm={12} xs={12} lg={4}>
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
                                  }}
                                  fullWidth
                                >
                                  {field.items.map((item, index) => (
                                    <MenuItem
                                      key={index}
                                      value={item.value}
                                    >
                                      {item.value}
                                    </MenuItem>
                                  ))}
                                </TextField> :
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
                            </Grid>
                          )
                        })}
                      </Grid>
                    }
                    <Typography
                      color="error"
                      sx={{
                        mt: 2,
                      }}
                    >
                      {serverError}
                    </Typography>
                    {!isLoading &&
                      <>
                        <Typography variant='button' sx={{ mr: 2 }}>
                          Send Notification On Publish
                        </Typography>
                        {isSwitchLoading ?
                          <CircularProgress
                            size={26}
                          /> :
                          <IOSSwitch
                            checked={sendNotification}
                            onChange={() => updateSettingstatus(38)}
                          />
                        }
                      </>
                    }
                  </CardContent>
                  <Divider
                    sx={{
                      borderColor: 'neutral.200',
                    }}
                  />
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      variant='contained'
                    >
                      {isSubmitting ?
                        "Loading..." :
                        `Update`
                      }
                    </Button>
                  </CardActions>
                </Card>
              </Form>
            )}
          </Formik>
        </Stack>
      </Container>
    </Box>
  )
}

export default Settings