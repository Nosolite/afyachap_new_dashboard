import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import {
  createPackageCategoryUrl,
  deletePackageCategoryUrl,
  getAllPackageCategoriesUrl,
  updatePackageCategoryUrl,
} from "../../seed/url";
import {
  webDeleteRequest,
  webGetRequest,
  webPostRequest,
  webPutRequest,
} from "../../services/api-service";
import { CustomAlert } from "../../components/custom-alert";
import ViewSubscriptionType from "./ViewSubscriptionType";

const TYPE_META = {
  subscription: { label: "Subscription", color: "primary" },
  consultation: { label: "Consultation", color: "info" },
  shop: { label: "Shop", color: "default" },
  ai: { label: "AI", color: "secondary" },
};

const get = (url) => new Promise((res, rej) => webGetRequest(url, res, rej));
const post = (url, body) => new Promise((res, rej) => webPostRequest(url, body, res, rej));
const put = (url, body) => new Promise((res, rej) => webPutRequest(url, body, res, rej));
const del = (url) => new Promise((res, rej) => webDeleteRequest(url, res, rej));

export default function SubscriptionTypes() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null);
  const [form, setForm] = useState(null); // { category } | null
  const [deleting, setDeleting] = useState(null);
  const [alert, setAlert] = useState({ open: false, severity: "success", message: "" });

  const notify = (severity, message) => setAlert({ open: true, severity, message });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await get(getAllPackageCategoriesUrl);
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      setCategories([]);
      notify("error", "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (values) => {
    try {
      if (values.id) await put(updatePackageCategoryUrl + values.id, values);
      else await post(createPackageCategoryUrl, values);
      notify("success", values.id ? "Category updated" : "Category created");
      setForm(null);
      load();
    } catch (e) {
      notify("error", e?.response?.data?.message || "Save failed");
    }
  };

  const handleDelete = async () => {
    try {
      await del(deletePackageCategoryUrl + deleting.id);
      notify("success", "Category deleted");
      setDeleting(null);
      load();
    } catch (e) {
      notify("error", e?.response?.data?.message || "Delete failed");
    }
  };

  const toggleCategory = async (c) => {
    const next = String(c.status || "ACTIVE").toUpperCase() === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await put(updatePackageCategoryUrl + c.id, {
        name: c.name,
        description: c.description,
        package_type: c.package_type,
        status: next,
      });
      notify("success", `${c.name} marked ${next === "ACTIVE" ? "used" : "not used"}`);
      load();
    } catch (e) {
      notify("error", e?.response?.data?.message || "Update failed");
    }
  };

  return (
    <Container maxWidth={false}>
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="flex-end" gap={2} flexWrap="wrap">
        <Box>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700, letterSpacing: ".08em", lineHeight: 1 }}>
            Payments · Packages
          </Typography>
          <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
            Package categories
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 560 }}>
            Manage subscription, consultation, and shop categories and their packages.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<PlusIcon width={18} />} onClick={() => setForm({ category: null })}>
          Add category
        </Button>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Used</TableCell>
                <TableCell>Packages</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={4}><Skeleton /></TableCell>
                  </TableRow>
                ))}
              {!loading &&
                categories.map((c) => {
                  const meta = TYPE_META[c.package_type] || TYPE_META.subscription;
                  return (
                    <TableRow key={c.id} hover>
                      <TableCell>
                        <Typography fontWeight={600}>{c.name}</Typography>
                        <Typography variant="body2" color="text.secondary">{c.description || "—"}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={meta.label} color={meta.color} />
                      </TableCell>
                      <TableCell>
                        <Switch
                          size="small"
                          checked={String(c.status || "ACTIVE").toUpperCase() === "ACTIVE"}
                          onChange={() => toggleCategory(c)}
                        />
                      </TableCell>
                      <TableCell>{c.sub_services?.length ?? 0}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" title="View packages" onClick={() => setViewing(c)}><EyeIcon width={18} /></IconButton>
                        <IconButton size="small" title="Edit" onClick={() => setForm({ category: c })}><PencilIcon width={18} /></IconButton>
                        <IconButton size="small" title="Delete" color="error" onClick={() => setDeleting(c)}><TrashIcon width={18} /></IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {!loading && !categories.length && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">No categories yet. Add one to get started.</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {viewing && (
        <ViewSubscriptionType
          open={!!viewing}
          handleClose={() => setViewing(null)}
          selected={viewing}
          onChanged={load}
        />
      )}

      {form && <CategoryDialog initial={form.category} onClose={() => setForm(null)} onSave={handleSave} />}

      <Dialog open={!!deleting} onClose={() => setDeleting(null)}>
        <DialogTitle>Delete category?</DialogTitle>
        <DialogContent>
          <Typography>
            This deletes <b>{deleting?.name}</b> and all of its packages. This cannot be undone.
          </Typography>
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
    </Container>
  );
}

const typeFromName = (n) => {
  const v = (n || "").toLowerCase();
  if (/consult|daktari|doctor|chat|session/.test(v)) return "consultation";
  if (/shop|store|mall|chapmall|product|bidhaa/.test(v)) return "shop";
  if (/ai|artificial|intelligence|smart/.test(v)) return "ai";
  return "subscription";
};

function CategoryDialog({ initial, onClose, onSave }) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");

  const derivedType = initial?.package_type || typeFromName(name);

  const submit = () => {
    if (!name.trim()) return;
    onSave({
      id: initial?.id,
      name: name.trim(),
      description,
      package_type: derivedType,
      status: initial?.status || "ACTIVE",
    });
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{initial ? "Edit category" : "Add category"}</DialogTitle>
      <DialogContent>
        <Box display="grid" gap={2} mt={1}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} fullWidth autoFocus />
          <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline minRows={2} />
          <Typography variant="body2" color="text.secondary">
            Type: <b>{TYPE_META[derivedType]?.label || derivedType}</b>
          </Typography>
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
