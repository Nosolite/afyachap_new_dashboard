import React from "react";
import { Box, Typography } from "@mui/material";
import { CustomTable } from "../../components/custom-table";
import { pastUsersPaidHeadCells } from "../../seed/table-headers";

const PastUsersPaidToday = ({ data, isLoading, searchTerm, onSearch }) => {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", marginBottom: "16px" }}
      >
        Past Users Paid Today
      </Typography>
      <CustomTable
        count={data.length}
        items={data.filter((item) =>
          Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        )}
        headCells={pastUsersPaidHeadCells}
        isLoading={isLoading}
        onSearchTermChange={onSearch}
      />
    </Box>
  );
};

export default PastUsersPaidToday;
