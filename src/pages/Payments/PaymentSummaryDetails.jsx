import React from "react";
import { Box, Typography } from "@mui/material";
import { CustomTable } from "../../components/custom-table";
import { paymentsReportHeadCells } from "../../seed/table-headers";

const PaymentSummaryDetails = ({
  data = [],
  isLoading,
  searchTerm,
  onSearch,
}) => {
  console.log("Data:", data); // Debug log

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ fontWeight: "bold", marginBottom: "16px" }}
      >
        Payment Summary Details
      </Typography>
      <CustomTable
        count={data.length}
        items={data.filter((item) =>
          Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        )}
        headCells={paymentsReportHeadCells}
        isLoading={isLoading}
        onSearchTermChange={onSearch}
      />
    </Box>
  );
};

export default PaymentSummaryDetails;
