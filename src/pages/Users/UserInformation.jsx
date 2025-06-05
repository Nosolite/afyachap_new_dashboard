import React from 'react'
import { Table, TableBody, TableCell, TableRow } from '@mui/material'
import { capitalizeFirstLetter } from '../../utils/constant'

function UserInformation({ selected }) {
    const [rows, setRows] = React.useState([]);
    React.useEffect(() => {
        const { id, profileImage, imageStorage, ...restData } = selected;
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

export default UserInformation