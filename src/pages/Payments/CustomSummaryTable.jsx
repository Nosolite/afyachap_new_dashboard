import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Typography,
} from "@mui/material";

const formatNumber = (num) => num; // Replace with your actual formatting function
const formatMoney = (num) => num; // Replace with your actual formatting function

const CustomSummaryTable = ({
  data,
  headCells,
  isLoading,
  rowsPerPage,
  page,
  count,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const isTotalRow = (index) => index === data.length - 1;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {headCells.map((headCell) => (
              <TableCell key={headCell.id}>{headCell.label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={headCells.length} align="center">
                <Typography>Loading...</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => {
              const isTotal = isTotalRow(index);
              return (
                <TableRow
                  key={index}
                  sx={{
                    ...(isTotal && {
                      fontWeight: "bold",
                      fontSize: "18px", // Large font size for total row
                    }),
                  }}
                >
                  {headCells.map((cell) => (
                    <TableCell
                      key={cell.id}
                      sx={{
                        ...(isTotal && {
                          fontWeight: "bold",
                          fontSize: "18px", // Large font size for total cells
                        }),
                      }}
                    >
                      {cell.id === "total_paid"
                        ? formatMoney(row[cell.id])
                        : row[cell.id]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </TableContainer>
  );
};

export default CustomSummaryTable;
