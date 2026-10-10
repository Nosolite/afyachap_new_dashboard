import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Skeleton,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { AppDialog, DialogCloseBar } from "../../components/app-dialog";
import {
  createSubPackageUrl,
  deleteSubPackageUrl,
  getAllPackagesByCategoryUrl,
  updatePackagesUrl,
} from "../../seed/url";
import {
  webDeleteRequest,
  webGetRequest,
  webPostRequest,
  webPutRequest,
} from "../../services/api-service";
import { CustomAlert } from "../../components/custom-alert";

const TYPE_META = {
  subscription: { label: "Subscription", color: "primary" },
  consultation: { label: "Consultation", color: "info" },
  shop: { label: "Shop", color: "default" },
  ai: { label: "AI", color: "secondary" },
};

const fmtTzs = (n) => "TZS " + Number(n || 0).toLocaleString("en-US", { maximumFractionDigits: 0 });
const get = (url) => new Promise((res, rej) => webGetRequest(url, res, rej));
const post = (url, body) => new Promise((res, rej) => webPostRequest(url, body, res, rej));
const put = (url, body) => new Promise((res, rej) => webPutRequest(url, body, res, rej));
const del = (url) => new Promise((res, rej) => webDeleteRequest(url, res, rej));

export default function ViewSubscriptionType({ open, handleClose, selected, onChanged }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null); // { pkg } | null
  const [deleting, setDeleting] = useState(null);
  const [alert, setAlert] = useState({ open: false, severity: "success", message: "" });

  const notify = (severity, message) => setAlert({ open: true, severity, message });

  const load = useCallback(async () => {
    if (!selected?.id) return;
    setLoading(true);
    try {
      const data = await get(getAllPackagesByCategoryUrl + selected.id);
      setPackages(Array.isArray(data) ? data : []);
    } catch {
      setPackages([]);
      notify("error", "Failed to load packages");
    } finally {
      setLoading(false);
    }
  }, [selected?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (values) => {
    try {
      if (values.id) await put(updatePackagesUrl + values.id, values);
      else await post(createSubPackageUrl, { ...values, afyachap_service_id: selected.id });
      notify("success", values.id ? "Package updated" : "Package created");
      setForm(null);
      load();
      onChanged?.();
    } catch (e) {
      notify("error", e?.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async () => {
    try {
      await del(deleteSubPackageUrl + deleting.id);
      notify("success", "Package deleted");
      setDeleting(null);
      load();
      onChanged?.();
    } catch (e) {
      notify("error", e?.response?.data?.message || "Delete failed");
    }
  };

  const togglePackage = async (p) => {
    const next = String(p.STATUS || p.status || "ACTIVE").toUpperCase() === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await put(updatePackagesUrl + p.id, {
        name: p.name,
        amount: p.amount,
        active_days: p.active_days,
        status: next,
      });
      notify("success", `${p.name} marked ${next === "ACTIVE" ? "used" : "not used"}`);
      load();
      onChanged?.();
    } catch (e) {
      notify("error", e?.response?.data?.message || "Update failed");
    }
  };

  const meta = TYPE_META[selected?.package_type] || TYPE_META.subscription;

  return (
    <AppDialog open={open} onClose={handleClose} fullScreen>
      <DialogCloseBar onClose={handleClose} iconSize="medium" title={selected?.name} />
      <DialogContent>
        <Box mb={3} display="flex" justifyContent="space-between" alignItems="center" gap={2} flexWrap="wrap">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Typography variant="h5" fontWeight={700}>{selected?.name}</Typography>
            <Chip size="small" label={meta.label} color={meta.color} />
          </Box>
          <Button variant="contained" startIcon={<PlusIcon width={18} />} onClick={() => setForm({ pkg: null })}>
            Add package
          </Button>
        </Box>

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Package</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Used</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading &&
                  Array.from({ length: 4 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5}><Skeleton /></TableCell>
                    </TableRow>
                  ))}
                {!loading &&
                  packages.map((p) => (
                    <TableRow key={p.id} hover>
                      <TableCell fontWeight={600}>{p.name}</TableCell>
                      <TableCell align="right" sx={{ fontVariantNumeric: "tabular-nums" }}>{fmtTzs(p.amount)}</TableCell>
                      <TableCell>{p.active_days > 0 ? `${p.active_days}d` : "—"}</TableCell>
                      <TableCell>
                        <Switch
                          size="small"
                          checked={String(p.STATUS || p.status || "ACTIVE").toUpperCase() === "ACTIVE"}
                          onChange={() => togglePackage(p)}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" title="Edit" onClick={() => setForm({ pkg: p })}><PencilIcon width={18} /></IconButton>
                        <IconButton size="small" title="Delete" color="error" onClick={() => setDeleting(p)}><TrashIcon width={18} /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                {!loading && !packages.length && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">No packages in this category yet.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </DialogContent>

      {form && <PackageDialog initial={form.pkg} onClose={() => setForm(null)} onSave={handleSave} />}

      <Dialog open={!!deleting} onClose={() => setDeleting(null)}>
        <DialogTitle>Delete package?</DialogTitle>
        <DialogContent>
          <Typography>This deletes <b>{deleting?.name}</b>. This cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleting(null)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>

      <CustomAlert
        openAlert={alert.open}
        severity={alert.severity}
        severityMessage={alert.message}
        handleCloseAlert={() => setAlert((a) => ({ ...a, open: false }))}
      />
    </AppDialog>
  );
}

function PackageDialog({ initial, onClose, onSave }) {
  const [name, setName] = useState(initial?.name || "");
  const [amount, setAmount] = useState(initial?.amount ?? "");
  const [days, setDays] = useState(initial?.active_days ?? "");
  const [status, setStatus] = useState(String(initial?.STATUS || initial?.status || "ACTIVE").toUpperCase());

  const submit = () => {
    if (!name.trim()) return;
    onSave({
      id: initial?.id,
      name: name.trim(),
      amount: Number(amount || 0),
      active_days: Number(days || 0),
      status,
    });
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{initial ? "Edit package" : "Add package"}</DialogTitle>
      <DialogContent>
        <Box display="grid" gap={2} mt={1}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth autoFocus />
          <TextField label="Amount (TZS)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} inputProps={{ min: 0 }} fullWidth />
          <TextField label="Duration (days)" type="number" value={days} onChange={(e) => setDays(e.target.value)} inputProps={{ min: 0 }} fullWidth />
          <TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} fullWidth>
            <MenuItem value="ACTIVE">Active</MenuItem>
            <MenuItem value="INACTIVE">Inactive</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={!name.trim()}>
          {initial ? "Save" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
