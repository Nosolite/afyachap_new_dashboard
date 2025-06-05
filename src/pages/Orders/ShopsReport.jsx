import React from 'react'
import { Box, Container, Stack, Typography } from '@mui/material'

function ShopsReport() {
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 2,
          pb: 8
        }}
      >
        <Container maxWidth={false}>
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Report
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </>
  )
}

export default ShopsReport