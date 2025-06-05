import React from 'react'
import { Avatar, Box, Card, CardContent, CardHeader, CircularProgress, Container, Grid, List, ListItem, ListItemAvatar, ListItemText, Stack, SvgIcon, Typography } from '@mui/material'
import BanknotesIcon from '@heroicons/react/24/outline/BanknotesIcon';
import LockOpenIcon from '@heroicons/react/24/outline/LockOpenIcon';
import LockClosedIcon from '@heroicons/react/24/outline/LockClosedIcon';
import { CustomChart } from '../../components/custom-chart';
import { getMonthlyRevenueUrl, getProductsOrdersTopRegionsUrl, getTopDoctorsUrl, getTotalAndroidUsersUrl, getTotalChatsSixMonthSummaryUrl, getTotalDoctorsUrl, getTotalFemaleUsersUrl, getTotalFreePremiumAccountsUrl, getTotalIOSUsersUrl, getTotalMaleUsersUrl, getTotalTodayUsersUrl, getTotalUsersSixMonthSummaryUrl, getTotalUsersUrl } from '../../seed/url';
import { getRequest, webGetRequest } from '../../services/api-service';
import { formatMoney, formatNumber } from '../../utils/constant';
import { numberToMonth } from '../../utils/date-formatter';
import { CalendarIcon } from '@mui/x-date-pickers';

function Home() {
  const [isTotalUserSummaryLoading, setIsTotalUserSummaryLoading] = React.useState(true)
  const [isTotalChatsSummaryLoading, setIsTotalChatsSummaryLoading] = React.useState(true)
  const [isTotalUsersLoading, setIsTotalUsersLoading] = React.useState(true)
  const [isTotalMaleUsersLoading, setIsTotalMaleUsersLoading] = React.useState(true)
  const [isTotalFemaleUsersLoading, setIsTotalFemaleUsersLoading] = React.useState(true)
  const [isTotalAndroidUsersLoading, setIsTotalAndroidUsersLoading] = React.useState(true)
  const [isTotalIOSUsersLoading, setIsTotalIOSUsersLoading] = React.useState(true)
  const [isTotalTodayUsersLoading, setIsTotalTodayUsersLoading] = React.useState(true)
  const [isTotalDoctorsLoading, setIsTotalDoctorsLoading] = React.useState(true)
  const [isTopDoctorsLoading, setIsTopDoctorsLoading] = React.useState(true)
  const [isLoadingTopRegions, setIsLoadingTopRegions] = React.useState(true)
  const [isLoadingTotalFreePremiumAccounts, setIsLoadingTotalFreePremiumAccounts] = React.useState(true)
  const [isLoadingMonthlyRevenue, setIsLoadingMonthlyRevenue] = React.useState(true)
  const [totalUserSummary, setTotalUserSummary] = React.useState([])
  const [totalChatsSummary, setTotalChatsSummary] = React.useState([])
  const [totalUsers, setTotalUsers] = React.useState({})
  const [totalMaleUsers, setTotalMaleUsers] = React.useState({})
  const [totalFemaleUsers, setTotalFemaleUsers] = React.useState({})
  const [totalAndroidUsers, setTotalAndrodUsers] = React.useState({})
  const [totalIOSUsers, setTotalIOSUsers] = React.useState({})
  const [totalTodayUsers, setTotalTodayUsers] = React.useState({})
  const [totalDoctors, setTotalDoctors] = React.useState({})
  const [totalFreePremiumAccounts, setTotalFreePremiumAccounts] = React.useState([])
  const [topDoctors, setTopDoctors] = React.useState([])
  const [topRegions, setTopRegions] = React.useState([])
  const [monthlyRevenue, setMonthlyRevenue] = React.useState([])
  const [monthlyRevenueSelectedFilterValue, setMonthlyRevenueSelectedFilterValue] = React.useState(0)
  const [monthlyRevenuePopOverItems, setMonthlyRevenuePopOverItems] = React.useState([])

  const fetchTotalUsers = React.useCallback(
    () => {
      getRequest(
        getTotalUsersUrl,
        (data) => {
          setTotalUsers(data);
          setIsTotalUsersLoading(false)
        },
        (error) => {
          setIsTotalUsersLoading(false)
        }
      )
    },
    [setIsTotalUsersLoading]
  )

  const fetchTotalMaleUsers = React.useCallback(
    () => {
      getRequest(
        getTotalMaleUsersUrl,
        (data) => {
          setTotalMaleUsers(data);
          setIsTotalMaleUsersLoading(false)
        },
        (error) => {
          setIsTotalMaleUsersLoading(false)
        }
      )
    },
    [setIsTotalMaleUsersLoading]
  )

  const fetchTotalFemaleUsers = React.useCallback(
    () => {
      getRequest(
        getTotalFemaleUsersUrl,
        (data) => {
          setTotalFemaleUsers(data);
          setIsTotalFemaleUsersLoading(false)
        },
        (error) => {
          setIsTotalFemaleUsersLoading(false)
        }
      )
    },
    [setIsTotalFemaleUsersLoading]
  )

  const fetchTotalAndroidUsers = React.useCallback(
    () => {
      getRequest(
        getTotalAndroidUsersUrl,
        (data) => {
          setTotalAndrodUsers(data);
          setIsTotalAndroidUsersLoading(false)
        },
        (error) => {
          setIsTotalAndroidUsersLoading(false)
        }
      )
    },
    [setIsTotalAndroidUsersLoading]
  )

  const fetchTotalIOSUsers = React.useCallback(
    () => {
      getRequest(
        getTotalIOSUsersUrl,
        (data) => {
          setTotalIOSUsers(data);
          setIsTotalIOSUsersLoading(false)
        },
        (error) => {
          setIsTotalIOSUsersLoading(false)
        }
      )
    },
    [setIsTotalIOSUsersLoading]
  )

  const fetchTotalTodayUsers = React.useCallback(
    () => {
      getRequest(
        getTotalTodayUsersUrl,
        (data) => {
          setTotalTodayUsers(data);
          setIsTotalTodayUsersLoading(false)
        },
        (error) => {
          setIsTotalTodayUsersLoading(false)
        }
      )
    },
    [setIsTotalTodayUsersLoading]
  )

  const fetchTotalDoctors = React.useCallback(
    () => {
      getRequest(
        getTotalDoctorsUrl,
        (data) => {
          setTotalDoctors(data);
          setIsTotalDoctorsLoading(false)
        },
        (error) => {
          setIsTotalDoctorsLoading(false)
        }
      )
    },
    [setIsTotalDoctorsLoading]
  )

  const fetchTotalUserSummary = React.useCallback(
    () => {
      getRequest(
        getTotalUsersSixMonthSummaryUrl,
        (data) => {
          setTotalUserSummary(data);
          setIsTotalUserSummaryLoading(false)
        },
        (error) => {
          setIsTotalUserSummaryLoading(false)
        }
      )
    },
    [setIsTotalUserSummaryLoading]
  )

  const fetchTotalChatSummary = React.useCallback(
    () => {
      getRequest(
        getTotalChatsSixMonthSummaryUrl,
        (data) => {
          setTotalChatsSummary(data);
          setIsTotalChatsSummaryLoading(false)
        },
        (error) => {
          setIsTotalChatsSummaryLoading(false)
        }
      )
    },
    [setIsTotalChatsSummaryLoading]
  )

  const fetchTotalFreePremiumAccounts = React.useCallback(
    () => {
      webGetRequest(
        getTotalFreePremiumAccountsUrl,
        (data) => {
          setTotalFreePremiumAccounts(data.user_account_type_distribution);
          setIsLoadingTotalFreePremiumAccounts(false)
        },
        (error) => {
          setIsLoadingTotalFreePremiumAccounts(false)
        }
      )
    },
    [setIsLoadingTotalFreePremiumAccounts]
  )

  const fetchTopDoctors = React.useCallback(
    () => {
      getRequest(
        getTopDoctorsUrl,
        (data) => {
          setTopDoctors(data);
          setIsTopDoctorsLoading(false)
        },
        (error) => {
          setIsTopDoctorsLoading(false)
        }
      )
    },
    [setIsTopDoctorsLoading]
  )

  const getProductsOrdersTopRegions = React.useCallback(
    () => {
      getRequest(
        getProductsOrdersTopRegionsUrl,
        (data) => {
          setTopRegions(data);
          setIsLoadingTopRegions(false);
        },
        (error) => {
          setIsLoadingTopRegions(false);
        },
      )
    }, [])

  const fetchMonthlyRevenue = React.useCallback(
    () => {
      webGetRequest(
        getMonthlyRevenueUrl,
        (data) => {
          setMonthlyRevenue(data.monthly_revenue);
          const dataLength = data.monthly_revenue.length;
          if (dataLength > 1) {
            setMonthlyRevenueSelectedFilterValue(data.monthly_revenue[dataLength - 1].year);
          }
          const result = [];
          const yearMap = {};
          data.monthly_revenue.forEach(item => {
            const year = item.year;
            if (!yearMap[year]) {
              yearMap[year] = true;
              result.push({
                id: year,
                label: year,
                icon: <SvgIcon fontSize="small" sx={{ color: "text.primary" }}><CalendarIcon /></SvgIcon>,
                onClick: () => setMonthlyRevenueSelectedFilterValue(year)
              });
            }
          });
          setMonthlyRevenuePopOverItems(result)
          setIsLoadingMonthlyRevenue(false)
        },
        (error) => {
          setIsLoadingMonthlyRevenue(false)
        }
      )
    },
    [setIsLoadingMonthlyRevenue]
  )

  React.useEffect(() => {
    fetchTotalUsers()
    fetchTotalMaleUsers()
    fetchTotalFemaleUsers()
    fetchTotalAndroidUsers()
    fetchTotalUserSummary()
    fetchTotalChatSummary()
    fetchTotalIOSUsers()
    fetchTotalTodayUsers()
    fetchTotalDoctors()
    fetchTopDoctors()
    getProductsOrdersTopRegions()
    fetchTotalFreePremiumAccounts()
    fetchMonthlyRevenue()
  }, [fetchTotalUserSummary, fetchTotalChatSummary, fetchTotalUsers, fetchTotalMaleUsers, fetchTotalFemaleUsers, fetchTotalAndroidUsers, fetchTotalIOSUsers, fetchTotalTodayUsers, fetchTotalDoctors, fetchTopDoctors, getProductsOrdersTopRegions, fetchTotalFreePremiumAccounts, fetchMonthlyRevenue])

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
        <Stack
          direction="row"
          justifyContent="space-between"
          spacing={4}
          sx={{ mb: 2 }}
        >
          <Stack spacing={1}>
            <Typography variant="h4">
              Overview
            </Typography>
          </Stack>
        </Stack>
        <Grid container spacing={3}>
          <Grid item sm={12} xs={12} md={9} lg={9}>
            <Grid container spacing={3}>
              <Grid item sm={12} xs={12} md={12} lg={12}>
                <Card
                  elevation={1}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignContent: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap"
                    }}
                  >
                    <Box>
                      <Typography variant='caption'>Total Users</Typography>
                      {isTotalUsersLoading &&
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: "center",
                        }}>
                          <CircularProgress
                            size={10}
                            sx={{
                              mx: 'auto',
                              mt: 2,
                            }}
                          />
                        </Box>
                      }
                      {!isTotalUsersLoading && <Typography variant='h6'>{formatNumber(totalUsers?.COUNT || 0)}</Typography>}
                    </Box>
                    <Box>
                      <Typography variant='caption'>Male Users</Typography>
                      {isTotalMaleUsersLoading &&
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: "center",
                        }}>
                          <CircularProgress
                            size={10}
                            sx={{
                              mx: 'auto',
                              mt: 2,
                            }}
                          />
                        </Box>
                      }
                      {!isTotalMaleUsersLoading && <Typography variant='h6'>{formatNumber(totalMaleUsers?.COUNT || 0)}</Typography>}
                    </Box>
                    <Box>
                      <Typography variant='caption'>Female Users</Typography>
                      {isTotalFemaleUsersLoading &&
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: "center",
                        }}>
                          <CircularProgress
                            size={10}
                            sx={{
                              mx: 'auto',
                              mt: 2,
                            }}
                          />
                        </Box>
                      }
                      {!isTotalFemaleUsersLoading && <Typography variant='h6'>{formatNumber(totalFemaleUsers?.COUNT || 0)}</Typography>}
                    </Box>
                    <Box>
                      <Typography variant='caption'>Android Users</Typography>
                      {isTotalAndroidUsersLoading &&
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: "center",
                        }}>
                          <CircularProgress
                            size={10}
                            sx={{
                              mx: 'auto',
                              mt: 2,
                            }}
                          />
                        </Box>
                      }
                      {!isTotalAndroidUsersLoading && <Typography variant='h6'>{formatNumber(totalAndroidUsers?.COUNT || 0)}</Typography>}
                    </Box>
                    <Box>
                      <Typography variant='caption'>IPhone Users</Typography>
                      {isTotalIOSUsersLoading &&
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: "center",
                        }}>
                          <CircularProgress
                            size={10}
                            sx={{
                              mx: 'auto',
                              mt: 2,
                            }}
                          />
                        </Box>
                      }
                      {!isTotalIOSUsersLoading && <Typography variant='h6'>{formatNumber(totalIOSUsers?.COUNT || 0)}</Typography>}
                    </Box>
                    <Box>
                      <Typography variant='caption'>New Users Today</Typography>
                      {isTotalTodayUsersLoading &&
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: "center",
                        }}>
                          <CircularProgress
                            size={10}
                            sx={{
                              mx: 'auto',
                              mt: 2,
                            }}
                          />
                        </Box>
                      }
                      {!isTotalTodayUsersLoading && <Typography variant='h6'>{formatNumber(totalTodayUsers?.COUNT || 0)}</Typography>}
                    </Box>
                    <Box>
                      <Typography variant='caption'>Doctors</Typography>
                      {isTotalDoctorsLoading &&
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: "center",
                        }}>
                          <CircularProgress
                            size={10}
                            sx={{
                              mx: 'auto',
                              mt: 2,
                            }}
                          />
                        </Box>
                      }
                      {!isTotalDoctorsLoading && <Typography variant='h6'>{formatNumber(totalDoctors?.COUNT || 0)}</Typography>}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item sm={6} xs={12} md={4} lg={4}>
                <Card
                  elevation={1}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      alignContent: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <Avatar
                      sx={{
                        backgroundColor: 'transparent',
                        height: 120,
                        width: 120,
                        border: `1px solid grey`
                      }}
                    >
                      <SvgIcon fontSize="large" sx={{ color: "text.secondary", fontSize: 70 }}>
                        <BanknotesIcon />
                      </SvgIcon>
                    </Avatar>
                    <Typography>Total Revenue</Typography>
                    <Typography variant='h5'>{formatMoney(112100000)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item sm={6} xs={12} md={4} lg={4}>
                <Card
                  elevation={1}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      alignContent: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <Avatar
                      sx={{
                        backgroundColor: 'transparent',
                        height: 120,
                        width: 120,
                        border: `1px solid grey`
                      }}
                    >
                      <SvgIcon fontSize="large" sx={{ color: "text.secondary", fontSize: 70 }}>
                        <LockOpenIcon />
                      </SvgIcon>
                    </Avatar>
                    <Typography>Premium Accounts</Typography>
                    {isLoadingTotalFreePremiumAccounts &&
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: "center",
                      }}>
                        <CircularProgress
                          size={10}
                          sx={{
                            mx: 'auto',
                            mt: 2,
                          }}
                        />
                      </Box>
                    }
                    {!isLoadingTotalFreePremiumAccounts && <Typography variant='h5'>{formatNumber(totalFreePremiumAccounts?.[1]?.total || 0) || 0}</Typography>}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item sm={6} xs={12} md={4} lg={4}>
                <Card
                  elevation={1}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      alignContent: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <Avatar
                      sx={{
                        backgroundColor: 'transparent',
                        height: 120,
                        width: 120,
                        border: `1px solid grey`
                      }}
                    >
                      <SvgIcon fontSize="large" sx={{ color: "text.secondary", fontSize: 70 }}>
                        <LockClosedIcon />
                      </SvgIcon>
                    </Avatar>
                    <Typography>Free Accounts</Typography>
                    {isLoadingTotalFreePremiumAccounts &&
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: "center",
                      }}>
                        <CircularProgress
                          size={10}
                          sx={{
                            mx: 'auto',
                            mt: 2,
                          }}
                        />
                      </Box>
                    }
                    {!isLoadingTotalFreePremiumAccounts && <Typography variant='h5'>{formatNumber(totalFreePremiumAccounts?.[0]?.total || 0) || 0}</Typography>}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item sm={6} xs={12} md={3} lg={3}>
            <Card
              elevation={1}
            >
              <CardHeader
                title="Top doctors"
              />
              <CardContent
                sx={{
                  mt: -6,
                }}
              >
                <List
                  sx={{ width: '100%', maxWidth: "100%", bgcolor: 'transparent' }}
                >
                  {isTopDoctorsLoading &&
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: "center",
                      height: "295px"
                    }}>
                      <CircularProgress
                        sx={{
                          mx: 'auto',
                        }}
                      />
                    </Box>
                  }
                  {!isTopDoctorsLoading && topDoctors.map((item, index) => (
                    <ListItem
                      key={index}
                      alignItems="flex-start"
                      disablePadding
                    >
                      <ListItemAvatar>
                        <Avatar variant='rounded' alt="Doctor Profile" src={item.doctor_profile_image_url} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={item.doctor_name}
                        secondary={`${item.total_patient} Patients`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
          <Grid item sm={12} xs={12} md={12} lg={6}>
            <CustomChart
              chartTitle={"Users Registered Six Months Summary"}
              chartSubTitle={"Users"}
              labels={totalUserSummary.map(label => label.MONTH)}
              values={totalUserSummary.map(value => value.COUNT)}
              isLoading={isTotalUserSummaryLoading}
            />
          </Grid>
          <Grid item sm={12} xs={12} md={12} lg={6}>
            <CustomChart
              chartTitle={"Chat Sessions Six Months Summary"}
              chartSubTitle={"Chat Sessions"}
              labels={totalChatsSummary.map(label => label.MONTH)}
              values={totalChatsSummary.map(value => value.COUNT)}
              isLoading={isTotalChatsSummaryLoading}
            />
          </Grid>
          <Grid item sm={12} xs={12} md={12} lg={12} xl={6}>
            <CustomChart
              chartTitle={"Top Region Orders"}
              chartSubTitle={"Product Orders"}
              labels={topRegions.map(label => label.region)}
              values={topRegions.map(value => value.total_orders)}
              isLoading={isLoadingTopRegions}
            />
          </Grid>
          <Grid item sm={12} xs={12} md={12} lg={12} xl={6}>
            <CustomChart
              chartTitle={"Monthly Revenue"}
              chartSubTitle={"Revenue"}
              labels={monthlyRevenue.filter(item => item.year === monthlyRevenueSelectedFilterValue).map(label => numberToMonth(label.month))}
              values={monthlyRevenue.filter(item => item.year === monthlyRevenueSelectedFilterValue).map(value => value.total)}
              isLoading={isLoadingMonthlyRevenue}
              selectedFilterValue={monthlyRevenueSelectedFilterValue}
              popoverItems={monthlyRevenuePopOverItems}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Home