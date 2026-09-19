import React from 'react'
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery,
} from '@mui/material'
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon'
import { Scrollbar } from '../../components/scrollbar'
import { authPostRequest } from '../../services/api-service'
import { healthAIAdminUserMessagesUrl } from '../../seed/url'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

function ViewUserThread({ open, handleClose, selected }) {
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'))
  const [messages, setMessages] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    if (!selected?.user_id) {
      return
    }

    setIsLoading(true)
    authPostRequest(
      healthAIAdminUserMessagesUrl,
      {
        user_id: selected.user_id,
        sort: 'id asc',
        limit: 100,
        page: 1,
      },
      (data) => {
        setMessages(Array.isArray(data?.results) ? data.results : [])
        setIsLoading(false)
      },
      () => {
        setMessages([])
        setIsLoading(false)
      }
    )
  }, [selected])

  const titleName =
    selected?.full_name?.trim() ||
    selected?.username ||
    `User #${selected?.user_id || ''}`

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      aria-describedby="health-ai-thread-dialog"
      fullWidth
      maxWidth="md"
      fullScreen={!lgUp}
    >
      <DialogActions>
        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
          <SvgIcon fontSize="small">
            <XMarkIcon />
          </SvgIcon>
        </IconButton>
      </DialogActions>
      <DialogTitle>{`Health AI thread · ${titleName}`}</DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 240,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Scrollbar
            sx={{
              width: '100%',
              maxHeight: lgUp ? 520 : '70vh',
              px: 1,
            }}
          >
            <Stack spacing={1.5} sx={{ py: 1 }}>
              {messages.length === 0 && (
                <Typography color="text.secondary">No messages found for this user.</Typography>
              )}
              {messages.map((item) => {
                const isUser = item.role === 'USER'
                return (
                  <Box
                    key={item.id}
                    sx={{
                      display: 'flex',
                      justifyContent: isUser ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        maxWidth: '80%',
                        px: 2,
                        py: 1.25,
                        borderRadius: 2,
                        bgcolor: isUser ? 'primary.main' : 'neutral.100',
                        color: isUser ? 'neutral.100' : 'text.primary',
                      }}
                    >
                      <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 0.5 }}>
                        {isUser ? 'User' : 'Assistant'}
                        {item.provider ? ` · ${item.provider}` : ''}
                        {item.model ? ` / ${item.model}` : ''}
                      </Typography>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {item.content}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.75 }}>
                        {item.created_at}
                      </Typography>
                    </Box>
                  </Box>
                )
              })}
            </Stack>
          </Scrollbar>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ViewUserThread
