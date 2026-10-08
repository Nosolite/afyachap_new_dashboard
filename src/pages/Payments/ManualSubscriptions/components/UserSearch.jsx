import React from "react";
import {
  Autocomplete,
  Avatar,
  Box,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { displayName, formatPhone, initials, phoneOf, userPhoto } from "../utils";

/**
 * Debounced user search with rich result rows (photo, name, phone).
 */
export function UserSearch({ query, setQuery, options, loading, error, onSelect }) {
  return (
    <Autocomplete
      freeSolo
      options={options}
      value={null}
      inputValue={query}
      onInputChange={(_, v) => setQuery(v)}
      onChange={(_, u) => {
        if (u && typeof u === "object") onSelect(u);
      }}
      getOptionLabel={(u) => (typeof u === "string" ? u : displayName(u))}
      filterOptions={(x) => x}
      isOptionEqualToValue={(a, b) => a.id === b.id}
      loading={loading}
      noOptionsText={error ? "Search failed — check your connection" : "No users found"}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Find user"
          placeholder="Phone, email or user ID"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(props, u) => {
        const photo = userPhoto(u);
        return (
          <li {...props}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.5 }}>
              <Avatar
                src={photo}
                alt={displayName(u)}
                sx={{
                  width: 38,
                  height: 38,
                  bgcolor: "primary.light",
                  color: "primary.main",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                {initials(u)}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {displayName(u)}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {formatPhone(phoneOf(u)) || "—"}
                </Typography>
              </Box>
            </Box>
          </li>
        );
      }}
    />
  );
}
