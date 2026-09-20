import React from 'react'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { Form, Formik } from 'formik'
import * as Yup from 'yup'
import { authPostRequest } from '../../services/api-service'
import {
  healthAIAvailableModelsUrl,
  healthAIAdminStatsUrl,
  healthAIGetSettingsUrl,
  healthAIUpdateSettingsUrl,
} from '../../seed/url'
import { CustomAlert } from '../../components/custom-alert'
import { IOSSwitch } from '../../components/IOSSwitch'

const schema = Yup.object().shape({
  provider: Yup.string().required('Provider is required'),
  model: Yup.string().required('Model is required'),
  daily_message_limit: Yup.number()
    .min(1, 'Minimum is 1')
    .required('Daily message limit is required'),
  max_context_messages: Yup.number()
    .min(2, 'Minimum is 2')
    .max(50, 'Maximum is 50')
    .required('Max context messages is required'),
  daily_image_limit: Yup.number()
    .min(0, 'Minimum is 0')
    .required('Daily image limit is required'),
  daily_audio_limit: Yup.number()
    .min(0, 'Minimum is 0')
    .required('Daily audio limit is required'),
  system_prompt: Yup.string().required('System prompt is required'),
})

const emptySettings = {
  enabled: true,
  provider: 'anthropic',
  model: '',
  daily_message_limit: 10,
  max_context_messages: 20,
  images_enabled: true,
  audio_enabled: true,
  daily_image_limit: 5,
  daily_audio_limit: 5,
  system_prompt: '',
}

const emptyStats = {
  total_messages: 0,
  total_user_messages: 0,
  total_assistant_messages: 0,
  total_users: 0,
  blocked_users: 0,
  messages_today: 0,
  images_today: 0,
  audio_today: 0,
  total_prompt_tokens: 0,
  total_completion_tokens: 0,
}

function StatCard({ label, value, loading }) {
  return (
    <Card elevation={1}>
      <CardContent>
        <Typography variant="caption">{label}</Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
            <CircularProgress size={18} />
          </Box>
        ) : (
          <Typography variant="h6">{value ?? 0}</Typography>
        )}
      </CardContent>
    </Card>
  )
}

function HealthAISettings() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [isStatsLoading, setIsStatsLoading] = React.useState(true)
  const [settings, setSettings] = React.useState(emptySettings)
  const [stats, setStats] = React.useState(emptyStats)
  const [availableModels, setAvailableModels] = React.useState([])
  const [openAlert, setOpenAlert] = React.useState(false)
  const [severity, setSeverity] = React.useState('success')
  const [severityMessage, setSeverityMessage] = React.useState('')

  const showAlert = (nextSeverity, message) => {
    setSeverity(nextSeverity)
    setSeverityMessage(message)
    setOpenAlert(true)
  }

  const fetchSettings = React.useCallback(() => {
    setIsLoading(true)
    authPostRequest(
      healthAIGetSettingsUrl,
      {},
      (data) => {
        setSettings({
          enabled: Boolean(data.enabled),
          provider: data.provider || 'anthropic',
          model: data.model || '',
          daily_message_limit: data.daily_message_limit || 10,
          max_context_messages: data.max_context_messages || 20,
          images_enabled: data.images_enabled !== false,
          audio_enabled: data.audio_enabled !== false,
          daily_image_limit: data.daily_image_limit ?? 5,
          daily_audio_limit: data.daily_audio_limit ?? 5,
          system_prompt: data.system_prompt || '',
        })
        setIsLoading(false)
      },
      (error) => {
        showAlert(
          'error',
          error?.response?.data?.message?.[0] || 'Failed to load Health AI settings'
        )
        setSettings(emptySettings)
        setIsLoading(false)
      }
    )
  }, [])

  const fetchAvailableModels = React.useCallback(() => {
    authPostRequest(
      healthAIAvailableModelsUrl,
      {},
      (data) => {
        setAvailableModels(Array.isArray(data?.models) ? data.models : [])
      },
      () => {
        setAvailableModels([])
      }
    )
  }, [])

  const fetchStats = React.useCallback(() => {
    setIsStatsLoading(true)
    authPostRequest(
      healthAIAdminStatsUrl,
      {},
      (data) => {
        setStats({ ...emptyStats, ...data })
        setIsStatsLoading(false)
      },
      () => {
        setStats(emptyStats)
        setIsStatsLoading(false)
      }
    )
  }, [])

  React.useEffect(() => {
    fetchSettings()
    fetchAvailableModels()
    fetchStats()
  }, [fetchSettings, fetchAvailableModels, fetchStats])

  const modelsForProvider = (provider) =>
    availableModels.filter((item) => item.provider === provider)

  return (
    <>
      {openAlert && (
        <CustomAlert
          openAlert={openAlert}
          handleCloseAlert={() => setOpenAlert(false)}
          severity={severity}
          severityMessage={severityMessage}
        />
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 2,
          pb: 8,
        }}
      >
        <Container maxWidth={false}>
          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography variant="h4">Health AI Settings</Typography>
              <Typography variant="body2" color="text.secondary">
                Switch provider/model, control free daily limits, and review usage.
              </Typography>
            </Stack>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Total Messages" value={stats.total_messages} loading={isStatsLoading} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Messages Today" value={stats.messages_today} loading={isStatsLoading} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Unique Users" value={stats.total_users} loading={isStatsLoading} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Blocked Users" value={stats.blocked_users} loading={isStatsLoading} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label="User Messages" value={stats.total_user_messages} loading={isStatsLoading} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Assistant Messages" value={stats.total_assistant_messages} loading={isStatsLoading} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Images Today" value={stats.images_today} loading={isStatsLoading} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Audio Today" value={stats.audio_today} loading={isStatsLoading} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Prompt Tokens" value={stats.total_prompt_tokens} loading={isStatsLoading} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard label="Completion Tokens" value={stats.total_completion_tokens} loading={isStatsLoading} />
              </Grid>
            </Grid>

            <Formik
              enableReinitialize
              initialValues={settings}
              validationSchema={schema}
              onSubmit={(values, helpers) => {
                authPostRequest(
                  healthAIUpdateSettingsUrl,
                  {
                    enabled: Boolean(values.enabled),
                    provider: values.provider,
                    model: values.model,
                    daily_message_limit: Number(values.daily_message_limit),
                    max_context_messages: Number(values.max_context_messages),
                    images_enabled: Boolean(values.images_enabled),
                    audio_enabled: Boolean(values.audio_enabled),
                    daily_image_limit: Number(values.daily_image_limit),
                    daily_audio_limit: Number(values.daily_audio_limit),
                    system_prompt: values.system_prompt,
                  },
                  (data) => {
                    setSettings({
                      enabled: Boolean(data.enabled),
                      provider: data.provider,
                      model: data.model,
                      daily_message_limit: data.daily_message_limit,
                      max_context_messages: data.max_context_messages,
                      images_enabled: data.images_enabled !== false,
                      audio_enabled: data.audio_enabled !== false,
                      daily_image_limit: data.daily_image_limit ?? 5,
                      daily_audio_limit: data.daily_audio_limit ?? 5,
                      system_prompt: data.system_prompt,
                    })
                    showAlert('success', 'Health AI settings updated successfully')
                    fetchStats()
                    helpers.setSubmitting(false)
                  },
                  (error) => {
                    showAlert(
                      'error',
                      error?.response?.data?.message?.[0] || 'Failed to update Health AI settings'
                    )
                    helpers.setSubmitting(false)
                  }
                )
              }}
            >
              {({
                isSubmitting,
                values,
                touched,
                errors,
                handleChange,
                handleBlur,
                setFieldValue,
              }) => (
                <Form noValidate autoComplete="off">
                  <Card elevation={1}>
                    <CardHeader title="Model & Limits" />
                    <Divider sx={{ borderColor: 'neutral.200' }} />
                    <CardContent>
                      {isLoading ? (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            py: 4,
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      ) : (
                        <Grid container spacing={3}>
                          <Grid item xs={12}>
                            <FormControlLabel
                              control={
                                <IOSSwitch
                                  checked={Boolean(values.enabled)}
                                  onChange={(event) =>
                                    setFieldValue('enabled', event.target.checked)
                                  }
                                />
                              }
                              label={values.enabled ? 'Health AI Enabled' : 'Health AI Disabled'}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <TextField
                              select
                              fullWidth
                              margin="normal"
                              label="Provider"
                              name="provider"
                              value={values.provider}
                              onChange={(event) => {
                                const nextProvider = event.target.value
                                setFieldValue('provider', nextProvider)
                                const nextModels = modelsForProvider(nextProvider)
                                if (
                                  nextModels.length > 0 &&
                                  !nextModels.some((item) => item.model === values.model)
                                ) {
                                  setFieldValue('model', nextModels[0].model)
                                }
                              }}
                              onBlur={handleBlur}
                              error={Boolean(errors.provider && touched.provider)}
                              helperText={touched.provider && errors.provider}
                            >
                              <MenuItem value="anthropic">Anthropic</MenuItem>
                              <MenuItem value="openai">OpenAI</MenuItem>
                            </TextField>
                          </Grid>
                          <Grid item xs={12} md={8}>
                            <TextField
                              select
                              fullWidth
                              margin="normal"
                              label="Model"
                              name="model"
                              value={values.model}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(errors.model && touched.model)}
                              helperText={
                                (touched.model && errors.model) ||
                                modelsForProvider(values.provider).find(
                                  (item) => item.model === values.model
                                )?.description ||
                                ''
                              }
                            >
                              {modelsForProvider(values.provider).map((item) => (
                                <MenuItem key={item.model} value={item.model}>
                                  {item.label} ({item.model})
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              margin="normal"
                              type="number"
                              label="Daily Free Message Limit"
                              name="daily_message_limit"
                              value={values.daily_message_limit}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(
                                errors.daily_message_limit && touched.daily_message_limit
                              )}
                              helperText={
                                touched.daily_message_limit && errors.daily_message_limit
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              margin="normal"
                              type="number"
                              label="Max Context Messages"
                              name="max_context_messages"
                              value={values.max_context_messages}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(
                                errors.max_context_messages && touched.max_context_messages
                              )}
                              helperText={
                                (touched.max_context_messages && errors.max_context_messages) ||
                                'How many recent messages are sent to the model as context'
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FormControlLabel
                              control={
                                <IOSSwitch
                                  checked={Boolean(values.images_enabled)}
                                  onChange={(event) =>
                                    setFieldValue('images_enabled', event.target.checked)
                                  }
                                />
                              }
                              label={values.images_enabled ? 'Images Enabled' : 'Images Disabled'}
                            />
                            <TextField
                              fullWidth
                              margin="normal"
                              type="number"
                              label="Daily Free Image Limit"
                              name="daily_image_limit"
                              value={values.daily_image_limit}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(errors.daily_image_limit && touched.daily_image_limit)}
                              helperText={
                                (touched.daily_image_limit && errors.daily_image_limit) ||
                                'Set 0 to block image uploads even if enabled'
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <FormControlLabel
                              control={
                                <IOSSwitch
                                  checked={Boolean(values.audio_enabled)}
                                  onChange={(event) =>
                                    setFieldValue('audio_enabled', event.target.checked)
                                  }
                                />
                              }
                              label={values.audio_enabled ? 'Audio Enabled' : 'Audio Disabled'}
                            />
                            <TextField
                              fullWidth
                              margin="normal"
                              type="number"
                              label="Daily Free Audio Limit"
                              name="daily_audio_limit"
                              value={values.daily_audio_limit}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(errors.daily_audio_limit && touched.daily_audio_limit)}
                              helperText={
                                (touched.daily_audio_limit && errors.daily_audio_limit) ||
                                'Voice notes use OpenAI Whisper for transcription'
                              }
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              fullWidth
                              multiline
                              minRows={10}
                              margin="normal"
                              label="System Prompt"
                              name="system_prompt"
                              value={values.system_prompt}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              error={Boolean(errors.system_prompt && touched.system_prompt)}
                              helperText={
                                (touched.system_prompt && errors.system_prompt) ||
                                'Includes auto language detection and health-safety instructions'
                              }
                            />
                          </Grid>
                        </Grid>
                      )}
                    </CardContent>
                    <Divider sx={{ borderColor: 'neutral.200' }} />
                    <CardActions sx={{ justifyContent: 'flex-end', px: 3, py: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading || isSubmitting}
                        sx={{ color: 'neutral.100' }}
                      >
                        {isSubmitting ? <CircularProgress size={20} /> : 'Save Settings'}
                      </Button>
                    </CardActions>
                  </Card>
                </Form>
              )}
            </Formik>
          </Stack>
        </Container>
      </Box>
    </>
  )
}

export default HealthAISettings
