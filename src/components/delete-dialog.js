import * as React from 'react'
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, } from '@mui/material'
import { useIsMobile } from '../hooks/use-is-mobile'
import { MobileConfirmSheet } from './mobile/mobile-confirm-sheet'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export const DeleteDialog = ({
    open,
    handleClose,
    handleDelete,
    isDeleting,
}) => {
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <MobileConfirmSheet
                open={open}
                onClose={handleClose}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                destructive
                title="Delete item?"
                message="Are you sure you want to delete this item? This action cannot be undone."
                confirmLabel="Delete"
            />
        )
    }

    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            onClose={handleClose}
            aria-describedby="confirmation-alert-dialog"
        >
            {isDeleting &&
                <Box
                    sx={{ p: 2 }}
                >
                    <CircularProgress
                        sx={{
                            mx: 'auto',
                        }}
                    />
                </Box>
            }
            {!isDeleting &&
                <>
                    <DialogTitle>
                        Delete Alert
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText
                            id="confirmation-alert-dialog"
                            color="text.primary"
                        >
                            Are you sure you want to delete this item?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={handleClose}
                        >
                            Discard
                        </Button>
                        <Button
                            onClick={handleDelete}
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </>
            }
        </Dialog>
    )
}