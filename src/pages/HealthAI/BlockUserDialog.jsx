import React from 'react'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { authPostRequest } from '../../services/api-service'
import { healthAIBlockUserUrl } from '../../seed/url'

function BlockUserDialog({ open, handleClose, selected, onBlocked, onError }) {
  const [reason, setReason] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  React.useEffect(() => {
    if (open) {
      setReason('')
      setIsSubmitting(false)
    }
  }, [open])

  const handleBlock = () => {
    if (!selected?.user_id || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    authPostRequest(
      healthAIBlockUserUrl,
      {
        user_id: selected.user_id,
        reason: reason.trim(),
      },
      (data) => {
        setIsSubmitting(false)
        onBlocked?.(data?.message || 'User blocked from health AI chat successfully!')
        handleClose()
      },
      (error) => {
        setIsSubmitting(false)
        onError?.(
          error?.response?.data?.message?.[0] || 'Failed to block user from health AI chat'
        )
      }
    )
  }

  const titleName =
    selected?.full_name?.trim() ||
    selected?.username ||
    `User #${selected?.user_id || ''}`

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{`Block ${titleName}`}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          margin="normal"
          label="Reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          helperText="Optional. Shown on the blocked users list."
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleBlock}
          disabled={isSubmitting}
          sx={{ color: 'neutral.100' }}
        >
          {isSubmitting ? <CircularProgress size={20} /> : 'Block User'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BlockUserDialog
