import React from 'react'
import { Table, TableBody, TableCell, TableRow } from '@mui/material'
import { capitalizeFirstLetter } from '../../utils/constant'

function DoctorInformation({ selected }) {
    const [rows, setRows] = React.useState([]);
    React.useEffect(() => {
        const { id, doc_profile_image, is_valid_email, is_valid_number, is_online, total_patient, average_rating, ...restData } = selected;
        setRows(Object.entries(restData))
    }, [selected])

    return (
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
    )
}

export default DoctorInformation