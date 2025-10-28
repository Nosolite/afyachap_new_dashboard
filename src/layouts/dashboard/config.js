import ChartBarIcon from "@heroicons/react/24/outline/ChartBarIcon";
import CogIcon from "@heroicons/react/24/outline/CogIcon";
import CreditCardIcon from "@heroicons/react/24/outline/CreditCardIcon";
import ClipboardDocumentListIcon from "@heroicons/react/24/outline/ClipboardDocumentListIcon";
import BookmarkSquareIcon from "@heroicons/react/24/outline/BookmarkSquareIcon";
import UsersIcon from "@heroicons/react/24/outline/UsersIcon";
import UserGroupIcon from "@heroicons/react/24/outline/UserGroupIcon";
import ShoppingCartIcon from "@heroicons/react/24/outline/ShoppingCartIcon";
import HeartIcon from "@heroicons/react/24/outline/HeartIcon";
import { SvgIcon } from "@mui/material";

export const items = [
  {
    title: "Home",
    path: "/",
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    ),
    roles: ["admin", "secretary"],
  },
  {
    title: "Contents",
    path: "/contents/contents",
    icon: (
      <SvgIcon fontSize="small">
        <BookmarkSquareIcon />
      </SvgIcon>
    ),
    children: [
      {
        title: "Contents",
        path: "/contents/contents",
        roles: ["admin", "content creator"],
      },
      {
        title: "Categories",
        path: "/contents/categories",
        roles: ["admin"],
      },
      {
        title: "Authors",
        path: "/contents/authors",
        roles: ["admin"],
      },
      {
        title: "Report",
        path: "/contents/reports",
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Doctors",
    path: "/doctors/doctors",
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    ),
    children: [
      {
        title: "Doctors",
        path: "/doctors/doctors",
        roles: ["admin"],
      },
      {
        title: "Doctor applications",
        path: "/doctors/applications",
        roles: ["admin"],
      },
      {
        title: "Specializations",
        path: "/doctors/specializations",
        roles: ["admin"],
      },
      {
        title: "Report",
        path: "/doctors/reports",
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Users",
    path: "/users/users",
    icon: (
      <SvgIcon fontSize="small">
        <UserGroupIcon />
      </SvgIcon>
    ),
    children: [
      {
        title: "Users",
        path: "/users/users",
        roles: ["admin"],
      },
      {
        title: "Content Subscribers",
        path: "/users/content-subscribers",
        roles: ["admin"],
      },
      {
        title: "Ads Tracking",
        path: "/ads/tracking",
        roles: ["admin"],
      },
      {
        title: "Vendors",
        path: "/users/vendors",
        roles: ["admin"],
      },
      {
        title: "Drivers",
        path: "/users/drivers",
        roles: ["admin"],
      },
      {
        title: "Secretaries",
        path: "/users/secretaries",
        roles: ["admin"],
      },
      {
        title: "Administrators",
        path: "/users/administrators",
        roles: ["admin"],
      },
      {
        title: "Report",
        path: "/users/reports",
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Medical",
    path: "/medical/consultations",
    icon: (
      <SvgIcon fontSize="small">
        <ClipboardDocumentListIcon />
      </SvgIcon>
    ),
    children: [
      {
        title: "Consultations",
        path: "/medical/consultations",
        roles: ["admin"],
      },
      {
        title: "Appeals",
        path: "/medical/chat-sessions-appeals",
        roles: ["admin"],
      },
      {
        title: "Lab investigations",
        path: "/medical/lab-investigations",
        roles: ["admin"],
      },
      {
        title: "Medicine prescription",
        path: "/medical/medicine-prescription",
        roles: ["admin"],
      },
      {
        title: "Medical reports",
        path: "/medical/medical-reports",
        roles: ["admin"],
      },
      {
        title: "Diseases",
        path: "/medical/diseases",
        roles: ["admin"],
      },
      {
        title: "Medical tests",
        path: "/medical/medical-tests",
        roles: ["admin"],
      },
      {
        title: "Medicines",
        path: "/medical/medicines",
        roles: ["admin"],
      },
      {
        title: "Medicine frequency",
        path: "/medical/medicine-frequency",
        roles: ["admin"],
      },
      {
        title: "Medical routes",
        path: "/medical/medical-routes",
        roles: ["admin"],
      },
      {
        title: "Period cycle",
        path: "/medical/period-cycle",
        roles: ["admin"],
      },
      {
        title: "Report",
        path: "/medical/reports",
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Shops",
    path: "/shops/orders",
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingCartIcon />
      </SvgIcon>
    ),
    children: [
      {
        title: "Orders",
        path: "/shops/orders",
        roles: ["admin"],
      },
      {
        title: "Products",
        path: "/shops/products",
        roles: ["admin"],
      },
      {
        title: "Categories",
        path: "/shops/product-categories",
        roles: ["admin"],
      },
      {
        title: "Categories Banners",
        path: "/shops/products-categories-banners",
        roles: ["admin"],
      },
      {
        title: "Contents Banners",
        path: "/shops/products-contents-banners",
        roles: ["admin"],
      },
      {
        title: "Regions",
        path: "/shops/regions",
        roles: ["admin"],
      },
      {
        title: "Report",
        path: "/shops/reports",
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Dating",
    path: "/dating/tribes",
    icon: (
      <SvgIcon fontSize="small">
        <HeartIcon />
      </SvgIcon>
    ),
    children: [
      {
        title: "Tribes",
        path: "/dating/tribes",
        roles: ["admin"],
      },
      {
        title: "Interests",
        path: "/dating/interests",
        roles: ["admin"],
      },
      {
        title: "Users",
        path: "/dating/users",
        roles: ["admin"],
      },
      {
        title: "Chats",
        path: "/dating/users/chats",
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Payments",
    path: "/payments/subscriptions",
    icon: (
      <SvgIcon fontSize="small">
        <CreditCardIcon />
      </SvgIcon>
    ),
    children: [
      {
        title: "Payments",
        path: "/payments/subscriptions",
        roles: ["admin", "secretary"],
      },
      {
        title: "Expires Tomorrow",
        path: "/payments/accounts-expires-tomorrow",
        roles: ["admin", "secretary"],
      },
      {
        title: "Subscription types",
        path: "/payments/subscriptions-types",
        roles: ["admin"],
      },
      {
        title: "Campaigns",
        path: "/payments/campaigns",
        roles: ["admin"],
      },
      {
        title: "Analytics",
        path: "/payments/analytics",
        roles: ["admin"],
      },
      {
        title: "Summary",
        path: "/payments/reports",
        roles: ["admin"],
      },
    ],
  },
  {
    title: "Manual Subs",
    path: "/payments/manual-subscriptions",
    icon: (
      <SvgIcon fontSize="small">
        <CreditCardIcon />
      </SvgIcon>
    ),
    children: [
      {
        title: "Assignment",
        path: "/payments/manual-subscriptions/assignment",
        roles: ["admin", "secretary"],
      },
      {
        title: "All Assignments",
        path: "/payments/manual-subscriptions/all-assignments",
        roles: ["admin", "secretary"],
      },
      {
        title: "Analytics",
        path: "/payments/manual-subscriptions/analytics",
        roles: ["admin", "secretary"],
      },
    ],
  },
  {
    title: "Settings",
    path: "/settings/general",
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    ),
    children: [
      {
        title: "General",
        path: "/settings/general",
        roles: ["admin"],
      },
      {
        title: "Services",
        path: "/settings/services",
        roles: ["admin"],
      },
      {
        title: "Order Status",
        path: "/settings/order-status",
        roles: ["admin"],
      },
    ],
  },
];
