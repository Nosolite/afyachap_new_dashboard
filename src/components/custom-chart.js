import React from 'react'
import { Line } from 'react-chartjs-2'
import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Divider, SvgIcon, useTheme } from '@mui/material'
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
} from 'chart.js'
import { usePopover } from '../hooks/use-popover'
import { CustomPopOver } from './custom-popover'
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon'
import CalendarIcon from '@heroicons/react/24/outline/CalendarIcon'

ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip
)

export const CustomChart = ({ chartTitle, chartSubTitle, labels, values, isLoading, selectedFilterValue, popoverItems }) => {
    const theme = useTheme()
    const popOver = usePopover();

    const options = {
        animation: false,
        cornerRadius: 20,
        layout: { padding: 0 },
        legend: { display: false },
        maintainAspectRatio: false,
        responsive: true,
        xAxes: [
            {
                ticks: {
                    fontColor: theme.palette.text.primary,
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                }
            }
        ],
        yAxes: [
            {
                ticks: {
                    fontColor: theme.palette.text.primary,
                    beginAtZero: true,
                    min: 0
                },
                gridLines: {
                    borderDash: [2],
                    borderDashOffset: [2],
                    color: theme.palette.divider,
                    drawBorder: false,
                    zeroLineBorderDash: [2],
                    zeroLineBorderDashOffset: [2],
                    zeroLineColor: theme.palette.divider
                }
            }
        ],
        tooltips: {
            backgroundColor: theme.palette.background.paper,
            bodyFontColor: theme.palette.text.primary,
            borderColor: theme.palette.divider,
            borderWidth: 1,
            enabled: true,
            footerFontColor: theme.palette.text.primary,
            intersect: false,
            mode: 'index',
            titleFontColor: theme.palette.text.primary
        }
    }

    return (
        <>
            {popOver.open &&
                <CustomPopOver
                    id={popOver.id}
                    anchorEl={popOver.anchorRef}
                    open={popOver.open}
                    onClose={popOver.handleClose}
                    popoverItems={popoverItems}
                />
            }
            <Card
                elevation={1}
            >
                {chartTitle &&
                    <>
                        <CardHeader
                            title={chartTitle}
                            action={
                                <>
                                    {popoverItems && selectedFilterValue &&
                                        <Button
                                            variant='outlined'
                                            startIcon={
                                                <SvgIcon fontSize='small'>
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
                                            {selectedFilterValue}
                                        </Button>
                                    }
                                </>
                            }
                        />
                        <Divider
                            sx={{
                                borderColor: 'neutral.200',
                            }}
                        />
                    </>
                }
                <CardContent>
                    {isLoading &&
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: "center",
                            height: 400,
                        }}>
                            <CircularProgress
                                sx={{
                                    mx: 'auto',
                                }}
                            />
                        </Box>
                    }
                    {!isLoading &&
                        <Box
                            sx={{
                                height: 400,
                                position: 'relative'
                            }}
                        >
                            <Line
                                data={{
                                    datasets: [
                                        {
                                            backgroundColor: '#0b6d36',
                                            borderColor: theme.palette.text.primary,
                                            borderWidth: 1,
                                            barPercentage: 0.5,
                                            barThickness: 12,
                                            borderRadius: 4,
                                            categoryPercentage: 0.5,
                                            data: values,
                                            label: chartSubTitle,
                                            maxBarThickness: 10
                                        },
                                    ],
                                    labels: labels,
                                }}
                                options={options}
                            />
                        </Box>
                    }
                </CardContent>
            </Card>
        </>
    );
}
