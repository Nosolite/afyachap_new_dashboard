import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import {
  CheckCircleIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { UserSearch } from "./components/UserSearch";
import { UserProfileCard } from "./components/UserProfileCard";
import { CurrentSubscriptionCard } from "./components/CurrentSubscriptionCard";
import { PackageForm } from "./components/PackageForm";
import { SubscriptionHistoryTable } from "./components/SubscriptionHistoryTable";
import { useUserSearch } from "./hooks/useUserSearch";
import { usePackages } from "./hooks/usePackages";
import { useSubscriptionDetail } from "./hooks/useSubscriptionDetail";
import { useAssignSubscription } from "./hooks/useAssignSubscription";
import { useAssignConsultation } from "./hooks/useAssignConsultation";
import { useCancelSubscription } from "./hooks/useCancelSubscription";
import { CustomAlert } from "../../../components/custom-alert";

const STEPS = [
  {
    n: 1,
    icon: MagnifyingGlassIcon,
    step: "Find",
    title: "Find the user",
    desc: "Search by phone, email, or user ID.",
  },
  {
    n: 2,
    icon: UserCircleIcon,
    step: "Review",
    title: "Review the account",
    desc: "Check their current plan, status, and history.",
  },
  {
    n: 3,
    icon: CheckCircleIcon,
    step: "Act",
    title: "Assign or cancel",
    desc: "Grant a package or revoke premium access.",
  },
];

export default function Assignment() {
  const search = useUserSearch();
  const { packages } = usePackages();
  const [selectedUser, setSelectedUser] = useState(null);
  const { details, history, pagination, page, setPage, loading, reload } =
    useSubscriptionDetail(selectedUser?.id);
  const { assign, loading: assigning } = useAssignSubscription();
  const { assignConsultation, loading: assigningConsultation } = useAssignConsultation();
  const { cancel, loading: cancelling } = useCancelSubscription();

  const [showForm, setShowForm] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [alert, setAlert] = useState({ open: false, severity: "success", message: "" });

  const notify = (severity, message) => setAlert({ open: true, severity, message });

  const handleSelect = (u) => {
    setSelectedUser(u);
    setShowForm(false);
    search.clear();
  };

  const handleAssign = async (payload) => {
    try {
      if (payload.kind === "consultation") {
        await assignConsultation({
          user_id: selectedUser.id,
          package_id: payload.package_id,
          doctor_id: payload.doctor_id,
          amount: payload.amount,
          notes: payload.notes,
        });
      } else {
        await assign({
          user_id: selectedUser.id,
          package_type: "sub_service",
          package_id: payload.package_id,
          notes: payload.notes,
        });
      }
      notify(
        "success",
        payload.kind === "consultation" ? "Consultation assigned" : "Subscription assigned"
      );
      setShowForm(false);
      reload();
    } catch (e) {
      notify("error", e?.response?.data?.message || e?.message || "Assign failed");
    }
  };

  const handleCancel = async () => {
    setConfirmOpen(false);
    try {
      await cancel({ user_id: selectedUser.id, reason: "Admin initiated cancellation" });
      notify("success", "Subscription cancelled");
      reload();
    } catch (e) {
      notify("error", e?.response?.data?.message || e?.message || "Cancel failed");
    }
  };

  return (
    <Container maxWidth={false}>
      <Box mb={3}>
        <Typography
          variant="overline"
          color="primary"
          sx={{ fontWeight: 700, letterSpacing: ".08em", lineHeight: 1 }}
        >
          Payments · Manual subscription
        </Typography>
        <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
          Manual subscription
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 640 }}>
          Assign or revoke a user&apos;s premium access by hand — for offline payments, promos, and
          support corrections.
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <UserSearch {...search} onSelect={handleSelect} />
      </Paper>

      {selectedUser ? (
        <Box display="grid" gap={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <UserProfileCard
                user={selectedUser}
                account={details?.current_account}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <CurrentSubscriptionCard
                account={details?.current_account}
                subscription={details?.current_subscription}
                packages={packages}
                onAssign={() => setShowForm(true)}
                onCancel={() => setConfirmOpen(true)}
              />
            </Grid>
          </Grid>

          {showForm && (
            <PackageForm
              packages={packages}
              confirming={assigning || assigningConsultation}
              onConfirm={handleAssign}
              onBack={() => setShowForm(false)}
            />
          )}

          <SubscriptionHistoryTable
            history={history}
            packages={packages}
            pagination={pagination}
            page={page}
            setPage={setPage}
            loading={loading}
          />
        </Box>
      ) : (
        <Paper
          variant="outlined"
          sx={{ p: { xs: 3, sm: 5 }, textAlign: "center", mt: 2 }}
        >
          <Box
            sx={{
              display: "inline-flex",
              p: 2.5,
              borderRadius: "50%",
              bgcolor: "primary.light",
              color: "primary.main",
              mb: 2,
            }}
          >
            <MagnifyingGlassIcon width={40} height={40} />
          </Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Find a user to get started
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, mx: "auto", mb: 4 }}>
            Search by phone, email, or user ID above, then review the account and assign or cancel a
            subscription.
          </Typography>
          <Grid container spacing={2} sx={{ maxWidth: 780, mx: "auto" }}>
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <Grid item xs={12} sm={4} key={s.title}>
                  <Paper
                    variant="outlined"
                    sx={{ p: 2.5, height: "100%", textAlign: "left" }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: "primary.main", fontSize: 13, fontWeight: 700 }}>
                        {s.n}
                      </Avatar>
                      <Box sx={{ color: "text.secondary", display: "flex" }}>
                        <Icon width={20} height={20} />
                      </Box>
                    </Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {s.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {s.desc}
                    </Typography>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Paper>
      )}

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Cancel subscription?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This revokes this user&apos;s premium access immediately. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Keep subscription</Button>
          <Button color="error" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? "Cancelling…" : "Cancel subscription"}
          </Button>
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
