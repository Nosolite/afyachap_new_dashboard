import React from 'react'
import { Table, TableBody, TableCell, TableRow } from '@mui/material'
import { capitalizeFirstLetter } from '../../utils/constant'

function AuthorInformation({ selected }) {
    const [rows, setRows] = React.useState([]);
    React.useEffect(() => {
        const { id, image_url, thumbnail_url, image_storage, user_id, ...restData } = selected;
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

export default AuthorInformation