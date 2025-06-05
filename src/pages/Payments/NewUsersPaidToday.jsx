import React from "react";
import { Box, Typography } from "@mui/material";
import { CustomTable } from "../../components/custom-table";
import { newUsersPaidHeadCells } from "../../seed/table-headers";

const NewUsersPaidToday = ({ data, isLoading, searchTerm, onSearch }) => {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", marginBottom: "16px" }}
      >
        New Users Paid Today
      </Typography>
      <CustomTable
        count={data.length}
        items={data.filter((item) =>
          Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        )}
        headCells={newUsersPaidHeadCells}
        isLoading={isLoading}
        onSearchTermChange={onSearch}
      />
    </Box>
  );
};

export default NewUsersPaidToday;
