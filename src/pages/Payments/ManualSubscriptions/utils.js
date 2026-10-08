import { doctorsUrl, usersUrl } from "../../../seed/url";

/** Full name from whichever field the users service populated. */
export const displayName = (u) => {
  if (!u) return "";
  const first = u.firstName || u.first_name || u.fname || "";
  const last = u.secondName || u.last_name || u.lname || u.surname || "";
  const full = `${first} ${last}`.trim();
  return full || u.userName || u.username || u.name || "Unnamed";
};

/** Two-letter initials for the avatar fallback. */
export const initials = (u) => {
  const first = u?.firstName || u?.first_name || u?.userName || u?.username || u?.name || "";
  const last = u?.secondName || u?.last_name || u?.surname || "";
  return `${String(first).charAt(0)}${String(last).charAt(0)}`.toUpperCase();
};

/**
 * Resolve the user's profile photo, if one exists. Handles full URLs, data URIs,
 * and paths relative to the users service.
 */
export const userPhoto = (u) => {
  if (!u) return null;
  const candidates = [
    u.profileImage,
    u.profile_image,
    u.profilePhoto,
    u.profile_photo,
    u.doc_profile_image,
    u.avatar,
    u.photo,
    u.image,
    u.image_url,
  ];
  for (const c of candidates) {
    if (!c) continue;
    const s = String(c).trim();
    if (/^https?:\/\//i.test(s) || /^data:/i.test(s)) return s;
    return s.startsWith("/") ? `${usersUrl}${s}` : `${usersUrl}/${s}`;
  }
  return null;
};

/** Best available phone value. */
export const phoneOf = (u) => u?.phoneNumber || u?.phone || u?.phone_number || u?.mobile || "";

/** Format a Tanzanian number as +255 7XX XXX XXX when recognisable. */
export const formatPhone = (p) => {
  if (!p) return "";
  const s = String(p).trim();
  const digits = s.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("255")) {
    return `+255 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  if (digits.length === 10 && digits.startsWith("0")) {
    return `+255 ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 9) {
    return `+255 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  return s;
};

/** Doctor's display name. */
export const doctorName = (d) => {
  if (!d) return "";
  const full = `${d.first_name || d.firstName || ""} ${d.last_name || d.lastName || ""}`.trim();
  return d.name || d.doctor_name || full || d.username || "Doctor";
};

/** Doctor's profile photo, resolving paths against the doctors service. */
export const doctorPhoto = (d) => {
  if (!d) return null;
  const c = d.doc_profile_image || d.profile_image || d.profileImage || d.image || d.avatar;
  if (!c) return null;
  const s = String(c).trim();
  if (/^https?:\/\//i.test(s) || /^data:/i.test(s)) return s;
  return s.startsWith("/") ? `${doctorsUrl}${s}` : `${doctorsUrl}/${s}`;
};

/** Doctor's consultation/session fee (the real price for a consultation). */
export const doctorFee = (d) => {
  const v = d?.session_fee ?? d?.consultation_fee ?? d?.fee ?? 0;
  return Number(v || 0);
};

/** Two-letter initials for the doctor avatar fallback. */
export const doctorInitials = (d) => {
  const parts = doctorName(d).split(" ").filter(Boolean);
  return `${parts[0]?.charAt(0) || "D"}${parts[1]?.charAt(0) || ""}`.toUpperCase();
};

/**
 * Classify a package by its parent business-service name.
 * Returns "consultation" | "shop" | "subscription" | null.
 */
export const packageTypeOf = (subService, businessServices) => {
  if (!subService) return null;
  const biz = businessServices?.find(
    (b) => String(b.id) === String(subService.afyachap_service_id || subService.service_id)
  );
  if (biz?.package_type) return biz.package_type; // authoritative column
  const name = (biz?.name || "").toLowerCase();
  if (/consult|daktari|doctor|chat|session/.test(name)) return "consultation";
  if (/shop|store|mall|chapmall|product|bidhaa/.test(name)) return "shop";
  if (/ai|artificial|intelligence|smart/.test(name)) return "ai";
  return "subscription";
};

export const isConsultationPackage = (subService, businessServices) =>
  packageTypeOf(subService, businessServices) === "consultation";
