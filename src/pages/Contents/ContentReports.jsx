import React from 'react'
import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Container, Divider, Stack, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import { postRequest } from '../../services/api-service';
import { getContentsStatisticsUrl } from '../../seed/url';
import { capitalizeFirstLetter, formatNumber } from '../../utils/constant';
import dayjs from 'dayjs';

function ContentReports() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [contentsStatistics, setContentsStatistics] = React.useState({});
  const [rows, setRows] = React.useState([]);

  const getStatistics = React.useCallback(
    () => {
      postRequest(
        getContentsStatisticsUrl,
        {
          "from": dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
          "to": dayjs().format('YYYY-MM-DD HH:mm:ss.SSS'),
        },
        (data) => {
          setContentsStatistics(data)
          setIsLoading(false)
        },
        (error) => {
          setIsLoading(false)
        }
      )
    },
    []
  )

  React.useEffect(() => {
    getStatistics()
  }, [getStatistics])

  React.useEffect(() => {
    const { id, doc_profile_image, is_valid_email, is_valid_number, is_online, total_patient, average_rating, ...restData } = contentsStatistics;
    setRows(Object.entries(restData))
  }, [contentsStatistics])

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
                Report
              </Typography>
            </Stack>
          </Stack>
          <Card
            elevation={1}
          >
            <CardHeader
              subheader="All time"
              title="Report based on contents"
              action={
                <Button variant="contained" sx={{ color: "neutral.100" }}>
                  Print Report
                </Button>
              }
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
                <Table
                  sx={{
                    '& th, & td': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  <TableBody>
                    {rows.map(([key, value]) => (
                      <TableRow key={key}>
                        <TableCell>{capitalizeFirstLetter(key)}</TableCell>
                        <TableCell align='right'>
                          <Typography fontWeight={"bold"}>
                            {formatNumber(value)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              }
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  )
}

export default ContentReports