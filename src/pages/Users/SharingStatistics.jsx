import React from 'react'
import { Box, CircularProgress, Table, TableBody, TableCell, TableRow } from '@mui/material'
import { capitalizeFirstLetter } from '../../utils/constant'
import { authPostRequest } from '../../services/api-service';
import { getUserWalletUrl } from '../../seed/url';

function SharingStatistics({ selected, isLoading, setIsLoading }) {
    const [sharingStatistics, setSharingStatistics] = React.useState({});
    const [rows, setRows] = React.useState([]);

    const fetchReviews = React.useCallback(
        () => {
            setIsLoading(true)
            authPostRequest(
                getUserWalletUrl,
                {
                    user_id: selected.id,
                },
                (data) => {
                    setSharingStatistics(data.data)
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
        const { id, doc_profile_image, is_valid_email, is_valid_number, is_online, total_patient, average_rating, ...restData } = sharingStatistics;
        setRows(Object.entries(restData))
    }, [sharingStatistics])

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
                                <TableCell>{value}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            }
        </>
    )
}

export default SharingStatistics