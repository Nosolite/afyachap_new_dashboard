import * as React from 'react'
import { Snackbar } from "@mui/material"
import MuiAlert from '@mui/material/Alert'

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export const CustomAlert = ({ openAlert, handleCloseAlert, severity, severityMessage }) => {
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