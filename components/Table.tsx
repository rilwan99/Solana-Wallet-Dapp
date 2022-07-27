import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(
    name: string,
    calories: number,
    fat: number,
    carbs: number,
    protein: number,
) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function BasicTable() {
    return (
        <TableContainer component={Paper} sx={{ maxWidth: 1000, backgroundColor: "rgb(182, 195, 224)", marginTop: 2, marginBottom: 5 }}>
            <Table sx={{ minWidth: 650, maxWidth: 1000 }} aria-label="simple table">
                <TableHead >
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold", fontSize: "large" }}>Asset Name</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "large" }}>Symbol</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "large" }}>Balance</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "large" }}>Price (USD)</TableCell>
                        <TableCell align="center" sx={{ fontWeight: "bold", fontSize: "large" }}>Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {row.name}
                            </TableCell>
                            <TableCell align="center">{row.calories}</TableCell>
                            <TableCell align="center">{row.fat}</TableCell>
                            <TableCell align="center">{row.carbs}</TableCell>
                            <TableCell align="center">{row.protein}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}