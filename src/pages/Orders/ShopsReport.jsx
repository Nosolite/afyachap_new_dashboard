import React from 'react'
import { Box, Container, Stack } from '@mui/material'
import { PageHeader } from '../../components/page-header'

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
            <PageHeader title="Report" />
          </Stack>
        </Container>
      </Box>
    </>
  )
}

export default ShopsReport