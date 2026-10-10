import * as React from 'react'
import { Snackbar } from "@mui/material"
import MuiAlert from '@mui/material/Alert'
import { useIsMobile } from '../hooks/use-is-mobile'
import { MobileToast } from './mobile/mobile-toast'

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export const CustomAlert = ({ openAlert, handleCloseAlert, severity, severityMessage }) => {
    const isMobile = useIsMobile()

    if (isMobile) {
        return (
            <MobileToast
                open={openAlert}
                onClose={handleCloseAlert}
                severity={severity}
                message={severityMessage}
            />
        )
    }

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={openAlert}
            autoHideDuration={6000}
            onClose={handleCloseAlert}
        >
            <Alert
                onClose={handleCloseAlert}
                severity={severity}
                sx={{
                    width: '100%'
                }}
            >
                {severityMessage}
            </Alert>
        </Snackbar>
    )
}
