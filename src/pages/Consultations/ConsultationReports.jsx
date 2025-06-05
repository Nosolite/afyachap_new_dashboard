import React from 'react'
import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Container, Divider, Grid, Stack, SvgIcon, Tab, Table, TableBody, TableCell, TableRow, Tabs, Typography } from '@mui/material'
import CalendarIcon from '@heroicons/react/24/outline/CalendarIcon'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'
import dayjs from 'dayjs'
import { usePopover } from '../../hooks/use-popover'
import { CustomPopOver } from '../../components/custom-popover'
import { CustomChart } from '../../components/custom-chart'
import { postRequest } from '../../services/api-service'
import { getDiseasesStatisticsUrl, getMedicalTestsStatisticsUrl, getMedicinePrescriptionsStatisticsUrl } from '../../seed/url'
import { formatNumber } from '../../utils/constant'

function ConsultationReports() {
  const [currentTab, setCurrentTab] = React.useState("Lab Investigations")
  const popOver = usePopover();
  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [body, setBody] = React.useState({
    "from": dayjs().startOf('day'),
    "to": dayjs(),
  });

  const handleTabChange = React.useCallback(
    (event, value) => {
      setCurrentTab(value)
    },
    []
  )

  const handleBodyChange = (newValue, key) => {
    setBody({ ...body, [key]: newValue, })
  }

  const fetcher = React.useCallback(
    () => {
      postRequest(
        currentTab === "Lab Investigations" ?
          getMedicalTestsStatisticsUrl :
          currentTab === "Diseases" ?
            getDiseasesStatisticsUrl :
            getMedicinePrescriptionsStatisticsUrl,
        {
          "from": body.from.format('YYYY-MM-DD HH:mm:ss.SSS'),
          "to": body.to.format('YYYY-MM-DD HH:mm:ss.SSS'),
        },
        (data) => {
          setData(data.data)
          setIsLoading(false)
        },
        (error) => {
          setData([])
          setIsLoading(false)
        },
      )
    },
    [body, currentTab]
  );

  React.useEffect(() => {
    fetcher()
  }, [fetcher])

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        pt: 2,
        pb: 8
      }}
    >
      {popOver.open &&
        <CustomPopOver
          id={popOver.id}
          anchorEl={popOver.anchorRef}
          open={popOver.open}
          onClose={popOver.handleClose}
          showDates={true}
          from={body.from}
          to={body.to}
          handleBodyChange={handleBodyChange}
        />
      }
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Tabs
              onChange={handleTabChange}
              value={currentTab}
              variant='scrollable'
              scrollButtons="auto"
            >
              <Tab
                label="Lab Investigations"
                value="Lab Investigations"
              />
              <Tab
                label="Diseases"
                value="Diseases"
              />
              <Tab
                label="Medicines"
                value="Medicines"
              />
            </Tabs>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Button
                sx={{
                  color: "grey"
                }}
                variant='text'
                startIcon={
                  <SvgIcon sx={{ mr: 1 }} fontSize='small'>
                    <CalendarIcon />
                  </SvgIcon>
                }
                endIcon={
                  <SvgIcon fontSize='small'>
                    <ChevronDownIcon />
                  </SvgIcon>
                }
                onClick={(event) => {
                  popOver.handleOpen(event)
                }}
              >
                {`${body.from.format('MMMM D, YYYY HH:mm:ss')} - `}
                {`${body.to.format('MMMM D, YYYY HH:mm:ss')}`}
              </Button>
            </Box>
          </Box>
          <Card
            elevation={1}
          >
            <CardHeader
              title={`Report Based On ${currentTab}`}
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
              {!isLoading && data.length === 0 &&
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: "center",
                }}>
                  <Typography>No data</Typography>
                </Box>
              }
              {!isLoading && data.length >= 1 &&
                <Grid container>
                  <Grid item xs={12} sm={12} md={12}>
                    <CustomChart
                      chartSubTitle={currentTab}
                      labels={data.map(label => label.name)}
                      values={data.map(value => value.count)}
                      isLoading={false}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12}>
                    <Table
                      sx={{
                        '& th, & td': {
                          borderBottom: 'none',
                        },
                      }}
                    >
                      <TableBody>
                        {data.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {item.name}
                            </TableCell>
                            {/* <TableCell>1 - 20 Yrs</TableCell> */}
                            <TableCell>{formatNumber(item.count)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Grid>
                </Grid>
              }
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  )
}

export default ConsultationReports