import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import EllipsisVerticalIcon from "@heroicons/react/24/solid/EllipsisVerticalIcon";
import CheckCircleIcon from "@heroicons/react/24/solid/CheckCircleIcon";
import MinusCircleIcon from "@heroicons/react/24/solid/MinusCircleIcon";
import XCircleIcon from "@heroicons/react/24/solid/XCircleIcon";
import { IOSSwitch } from "./IOSSwitch";
import { convertTime } from "../utils/convert-timestamp";
import { formatMoney } from "../utils/constant";
import { formatDate } from "../utils/date-formatter";

export const MEDIA_COLUMNS = [
  "icon",
  "product_image",
  "image",
  "profile_image",
  "product_category_color",
  "service_color",
  "banner_url",
];

export const TOGGLE_COLUMNS = ["switch", "pinned", "is_enabled"];

export const STATUS_COLUMNS = [
  "payment_status",
  "order_status",
  "product_status",
  "status",
  "is_package_free",
  "approval",
];

export const MONEY_COLUMNS = [
  "amount",
  "session_fee",
  "product_amount",
  "product_promotion_amount",
  "product_shipping_cost_in_dar",
  "product_shipping_cost_in_other_regions",
];

export const getApprovalColor = (value) =>
  value === "APPROVED" ? "primary.main" : value === "REJECTED" ? "error.main" : "info.main";

export const ApprovalIcon = ({ value }) => (
  <SvgIcon fontSize="small" sx={{ color: getApprovalColor(value) }}>
    {value === "APPROVED" ? (
      <CheckCircleIcon />
    ) : value === "REJECTED" ? (
      <XCircleIcon />
    ) : (
      <MinusCircleIcon />
    )}
  </SvgIcon>
);

export const isSwitchChecked = (row) =>
  row.is_published === "YES" ||
  row.is_verified === "YES" ||
  row.status === "ACTIVE" ||
  row.status === "AVAILABLE";

const isPositiveStatus = (row, columnId) =>
  row.status === "COMPLETED" ||
  row.status === "ACTIVE" ||
  row.status === "success" ||
  (row.payment_status === "COMPLETED" && columnId === "payment_status") ||
  (row.order_status === "DELIVERED" && columnId === "order_status") ||
  row.status === "AVAILABLE";

export const getStatusLabel = (row, columnId) =>
  row.order_status && columnId === "order_status"
    ? row.order_status
    : row.payment_status && columnId === "payment_status"
    ? row.payment_status
    : row.status;

const parseList = (value) => {
  try {
    return JSON.parse(value) || [];
  } catch (error) {
    return [];
  }
};

// Renders the value of one column for one row. Shared by the desktop table and the
// mobile card list so both always display data the same way.
export const renderCellContent = (column, row, {
  isSwitchLoading = false,
  isPinLoading = false,
  isEnabledLoading = false,
  isSubmitting = false,
  onSwitch,
  onPin,
  onActionClick,
} = {}) => {
  switch (column.id) {
    case "userName":
      return (
        <Stack alignItems="center" direction="row" spacing={2}>
          <Typography variant="subtitle2">
            {row.first_name && `${row.first_name} ${row.last_name}`}
            {row.firstName && `${row.firstName} ${row.secondName}`}
          </Typography>
        </Stack>
      );
    case "icon":
    case "product_image":
    case "image":
      return (
        <Avatar
          variant="rounded"
          alt="Preview Picture"
          src={row.icon_url || row.image_url || row.product_image || row.icon || row.image}
        />
      );
    case "profile_image":
      return (
        <Avatar
          variant="rounded"
          alt="Profile Picture"
          src={row.doc_profile_image || row.profileImage || row.icon}
        />
      );
    case "medical_test_names":
      return parseList(row.medical_test_names).map((test, index) => (
        <Typography key={index}>
          ▶ {test.test_name}({test.test_code})
        </Typography>
      ));
    case "medicine_prescription":
      return parseList(row.medicine_prescription).map((test, index) => (
        <Typography key={index}>
          ▶ {test.name}({test.unit})
        </Typography>
      ));
    case "final_diagnosis":
      return parseList(row.final_diagnosis).map((test, index) => (
        <Typography key={index}>
          ▶ {test.name}({test.code})
        </Typography>
      ));
    case "interests":
      if (row.interests === "") {
        return row.interests;
      }
      return parseList(row.interests).map((interest, index) => (
        <Typography key={index}>
          ▶ {interest.interest_name}
        </Typography>
      ));
    case "switch":
      return isSwitchLoading ? (
        <CircularProgress size={26} />
      ) : (
        <IOSSwitch
          checked={isSwitchChecked(row)}
          onChange={() => onSwitch?.(row)}
        />
      );
    case "pinned":
      return isPinLoading ? (
        <CircularProgress size={26} />
      ) : (
        <IOSSwitch
          checked={row.pinned}
          onChange={() => onPin?.(row)}
        />
      );
    case "is_enabled":
      return isEnabledLoading ? (
        <CircularProgress size={26} />
      ) : (
        <IOSSwitch
          checked={Boolean(row.is_enabled)}
          disabled={Boolean(isSubmitting)}
          onChange={() => onSwitch?.(row)}
        />
      );
    case "payment_status":
    case "order_status":
    case "product_status":
    case "status": {
      const positive = isPositiveStatus(row, column.id);
      return (
        <Chip
          style={{
            backgroundColor: positive ? "rgb(209 250 229)" : "rgb(254 243 199)",
            color: positive ? "rgb(5 150 105)" : "rgb(217 119 6)",
          }}
          label={getStatusLabel(row, column.id)}
          sx={{ width: 110, color: "black" }}
        />
      );
    }
    case "is_package_free":
      return (
        <Chip
          label={row.is_package_free === "NO" ? "PREMIUM" : "FREE"}
          sx={{
            width: 110,
            backgroundColor: row.is_package_free === "NO" ? "rgb(209 250 229)" : "rgb(254 243 199)",
            color: row.is_package_free === "NO" ? "rgb(5 150 105)" : "rgb(217 119 6)",
          }}
        />
      );
    case "product_category_color":
    case "service_color":
      return (
        <Avatar
          variant="rounded"
          sx={{ bgcolor: row?.product_category_color || row?.service_color || row?.color }}
          src={row.icon_url || row?.image_url || row?.icon}
        />
      );
    case "banner_url":
      return row.banner_url ? (
        <Avatar variant="rounded" src={row.banner_url} sx={{ width: 96, height: 40 }} />
      ) : (
        "-"
      );
    case "location":
      return (
        <>
          {row.region},<br />
          {row.district},<br />
          {row.street}.
        </>
      );
    case "approval":
      return <ApprovalIcon value={row[column.id]} />;
    case "actions":
      return (
        <IconButton onClick={(event) => onActionClick?.(event, row)}>
          <SvgIcon fontSize="small" sx={{ color: "text.primary" }}>
            <EllipsisVerticalIcon />
          </SvgIcon>
        </IconButton>
      );
    case "order_id":
      return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            variant="square"
            sx={{ mr: 2, height: 20, width: 20 }}
            src="https://afyachap.com/images/images/icon-01.svg"
          />
          <Typography sx={{ color: "rgb(14 165 233)" }}>
            #{row.order_id}
          </Typography>
        </Box>
      );
    case "campaign_description":
      return <div dangerouslySetInnerHTML={{ __html: row.description }} />;
    case "start_time":
    case "end_time":
      return formatDate(row[column.id]);
    case "added_at":
      return formatDate(row.created_at);
    case "notification_interval":
      return convertTime(row[column.id]);
    default:
      if (MONEY_COLUMNS.includes(column.id)) {
        return (
          <Typography sx={{ color: "rgb(5 150 105)" }}>
            {formatMoney(row[column.id])}
          </Typography>
        );
      }
      return row[column.id];
  }
};
