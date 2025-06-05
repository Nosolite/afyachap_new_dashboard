import React from 'react'
import { Box, CircularProgress, Table, TableBody, TableCell, TableRow } from '@mui/material'
import { capitalizeFirstLetter, formatMoney } from '../../utils/constant'
import { postRequest } from '../../services/api-service';
import { getAuthorPerformanceUrl } from '../../seed/url';

function AuthorPerformance({ selected, isLoading, setIsLoading }) {
    const [doctorPerformance, setDoctorPerformance] = React.useState({});
    const [rows, setRows] = React.useState([]);

    const fetchReviews = React.useCallback(
        () => {
            setIsLoading(true)
            postRequest(
                getAuthorPerformanceUrl,
                {
                    user_id: selected.user_id,
                    is_doctor: selected.is_doctor
                },
                (data) => {
                    setDoctorPerformance(data.data)
                    setIsLoading(false)
                },
                (error) => {
                    setIsLoading(false)
                }
            )
        },
        [selected, setIsLoading]
    )

    React.useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

    React.useEffect(() => {
        const { id, doc_profile_image, is_valid_email, is_valid_number, is_online, total_patient, average_rating, ...restData } = doctorPerformance;
        setRows(Object.entries(restData))
    }, [doctorPerformance])

    return (
        <>
            {isLoading &&
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: "center",
                    height: "100%"
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
                                <TableCell>
                                    {key === "total_amount" || key === "current_balance" || key === "session_fee" ?
                                        formatMoney(value) :
                                        value
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            }
        </>
    )
}

export default AuthorPerformance