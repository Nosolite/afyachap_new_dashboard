import React, { useMemo, useState } from "react";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { useDoctors } from "../hooks/useDoctors";
import { doctorFee, doctorInitials, doctorName, doctorPhoto, packageTypeOf } from "../utils";

const fmtTzs = (n) =>
  "TZS " + Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });

const TYPE_META = {
  subscription: { label: "Subscription", color: "primary" },
  consultation: { label: "Consultation", color: "info" },
  shop: { label: "Shop", color: "default" },
  ai: { label: "AI", color: "secondary" },
};

/**
 * Assign-a-package form. The package itself declares what it grants (content days
 * and/or AI days), so there is no hardcoded branch — the assign applies whatever
 * the package contains. Only consultation needs an extra doctor selection.
 */
export function PackageForm({ packages, onConfirm, onBack, confirming }) {
  const { business_services = [], sub_services = [] } = packages;
  const [packageId, setPackageId] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const { query: doctorQuery, setQuery: setDoctorQuery, doctors, loading: doctorsLoading } =
    useDoctors();

  const grouped = useMemo(() => {
    const byCategory = new Map();
    business_services.forEach((b) => byCategory.set(b.id, { name: b.name, items: [] }));
    sub_services.forEach((s) => {
      const cat = byCategory.get(s.afyachap_service_id) || byCategory.get(s.service_id);
      if (cat) cat.items.push(s);
      else {
        const fb = byCategory.get("__other") || { name: "Other", items: [] };
        fb.items.push(s);
        byCategory.set("__other", fb);
      }
    });
    return [...byCategory.values()].filter((c) => c.items.length > 0);
  }, [business_services, sub_services]);

  const selected = sub_services.find((s) => String(s.id) === String(packageId));
  const type = packageTypeOf(selected, business_services);
  const isConsultation = type === "consultation";
  const isShop = type === "shop";
  const contentDays = Number(selected?.active_days ?? 0);

  const onPackageChange = (id) => {
    setPackageId(id);
    setSelectedDoctor(null);
    setDoctorQuery("");
  };

  const submit = () => {
    if (isConsultation) {
      onConfirm({
        kind: "consultation",
        package_id: Number(packageId),
        doctor_id: Number(selectedDoctor?.id),
        amount: doctorFee(selectedDoctor),
        notes,
      });
    } else {
      onConfirm({ kind: "subscription", package_id: Number(packageId), notes });
    }
  };

  const canSubmit = !!packageId && !isShop && (isConsultation ? !!selectedDoctor : true);

  const grantSummary = () => {
    if (!selected) return "Select a package";
    if (isShop) return `${selected.name} · shop product`;
    if (isConsultation) {
      return selectedDoctor
        ? `${selected.name} · session with ${doctorName(selectedDoctor)}`
        : `${selected.name} · select a doctor`;
    }
    const parts = [];
    if (contentDays > 0) parts.push(`${contentDays} days ${type === "ai" ? "AI" : "content"}`);
    return `${selected.name} · ${parts.join(" + ") || "no duration configured"}`;
  };

  const grantPrice = () => {
    if (!selected || isShop) return "";
    if (isConsultation) return selectedDoctor ? fmtTzs(doctorFee(selectedDoctor)) : "—";
    return fmtTzs(selected.amount);
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Typography variant="h6">Assign a package</Typography>
          {selected && TYPE_META[type] && (
            <Chip size="small" label={TYPE_META[type].label} color={TYPE_META[type].color} />
          )}
        </Box>

        <TextField
          select
          label="Package"
          value={packageId}
          onChange={(e) => onPackageChange(e.target.value)}
          fullWidth
        >
          {grouped.map((cat) => [
            <MenuItem key={cat.name} disabled>
              {cat.name}
            </MenuItem>,
            ...cat.items.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            )),
          ])}
        </TextField>

        {isConsultation && (
          <Box mt={2}>
            <Autocomplete
              options={doctors}
              value={selectedDoctor}
              inputValue={doctorQuery}
              onInputChange={(_, v) => setDoctorQuery(v)}
              onChange={(_, d) => {
                setSelectedDoctor(d);
                setDoctorQuery(d ? doctorName(d) : "");
              }}
              getOptionLabel={(d) => (typeof d === "string" ? d : doctorName(d))}
              isOptionEqualToValue={(a, b) => a.id === b.id}
              filterOptions={(x) => x}
              loading={doctorsLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Doctor"
                  placeholder="Search doctors…"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {doctorsLoading ? <CircularProgress size={18} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              renderOption={(props, d) => (
                <li {...props}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.5 }}>
                    <Avatar
                      src={doctorPhoto(d)}
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: "primary.light",
                        color: "primary.main",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {doctorInitials(d)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>
                        {doctorName(d)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {fmtTzs(doctorFee(d))}
                      </Typography>
                    </Box>
                  </Box>
                </li>
              )}
            />
          </Box>
        )}

        {isShop && (
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary">
              Shop products aren't assigned here.
            </Typography>
          </Box>
        )}

        <Box mt={2}>
          <TextField
            label="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            minRows={2}
            inputProps={{ maxLength: 500 }}
            fullWidth
          />
        </Box>

        <Box mt={2} px={2} py={1.5} bgcolor="action.hover" borderRadius={1}>
          <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={1}>
            <Typography variant="body2" fontWeight={500}>
              {grantSummary()}
            </Typography>
            <Typography variant="body2" fontWeight={700} color="primary.main">
              {grantPrice()}
            </Typography>
          </Box>
        </Box>

        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          <Button onClick={onBack}>Back</Button>
          <Button variant="contained" onClick={submit} disabled={!canSubmit || confirming}>
            {confirming ? "Assigning…" : "Confirm assign"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}
