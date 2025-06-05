import { Box, CircularProgress } from '@mui/material'
import React from 'react'

function Loader() {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                width: "100%",
                height: "100vh",
            }}
        >
            <CircularProgress
                sx={{
                    mx: 'auto',
                    my: 'auto',
                    color: "green"
                }}
            />
        </Box>
    )
}

export default Loader