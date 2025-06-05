export const headers = {
    'afya-sign-auth': `${process.env.REACT_APP_KEY}`,
}
export const contentTypeJson = {
    'Content-Type': `application/json`,
}
export const contentTypeFormData = {
    'Content-Type': `multipart/form-data`,
}
export const isMp3Url = (url) => {
    const mp3Pattern = /\.mp3$/i;
    return mp3Pattern.test(url);
}
export const capitalizeFirstLetter = (str) => {
    return str
        .replace(/_/g, ' ')
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
export function formatMoney(amount, currency = 'TZS') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount).replace(/\.00$/, '');
}
export function formatNumber(number) {
    return (number || 0)?.toLocaleString() || 0;
}
export const openPdfInNewTab = (url) => {
    window.open(url, '_blank');
};
export const MIN_SIDE_NAV_WIDTH = 85;
export const SUB_SIDE_NAV_WIDTH = 195;
export const SIDE_NAV_WIDTH = 280;
export const CREATE = "Create";
export const UPDATE = "Update";
export const filterItems = [
    {
        label: "Today",
        value: "Today"
    },
    {
        label: "Yesterday",
        value: "Yesterday"
    },
    {
        label: "Last 7 days",
        value: "Last 7 days"
    },
    {
        label: "This month",
        value: "This month"
    },
    {
        label: "All time",
        value: "All time"
    },
]
export const packageTypes = [
    {
        label: "All",
        value: 0
    },
    {
        label: "Monthly",
        value: 1
    },
    {
        label: "Three Months",
        value: 2
    },
    {
        label: "Six Months",
        value: 3
    },
    {
        label: "Annual",
        value: 4
    },
    {
        label: "Consultations",
        value: 6
    },
    {
        label: "AfyaChap Shop",
        value: 12
    },
]
export const paymentStatus = [
    {
        label: "All",
        value: ""
    },
    {
        label: "Pending",
        value: "PENDING"
    },
    {
        label: "Completed",
        value: "COMPLETED"
    }
]
export const orderStatus = [
    {
        label: "All",
    },
    {
        label: "Pay Online",
    },
    {
        label: "Pay On Delivery",
    },
    {
        label: "Received",
    },
    {
        label: "Processing",
    },
    {
        label: "Delivered",
    },
    {
        label: "Cancelled",
    }
]
export const authorsStatus = [
    {
        label: "All",
        is_verified: ""
    },
    {
        label: "Verified",
        is_verified: "YES"
    },
    {
        label: "Not Verified",
        is_verified: "NO"
    }
];
export const contentsTypes = [
    {
        label: "All",
        published: "",
        free: "",
        pinned: "",
        platform: "APP",
        approval: ""
    },
    {
        label: "Approved Unpublished",
        published: "NO",
        free: "",
        pinned: "",
        platform: "APP",
        approval: "APPROVED"
    },
    {
        label: "Need Approval",
        published: "",
        free: "",
        pinned: "",
        platform: "APP",
        approval: "PENDING"
    },
    {
        label: "Approved",
        published: "",
        free: "",
        pinned: "",
        platform: "APP",
        approval: "APPROVED"
    },
    {
        label: "Rejected",
        published: "",
        free: "",
        pinned: "",
        platform: "APP",
        approval: "REJECTED"
    },
    {
        label: "Published Premium",
        published: "YES",
        free: "NO",
        pinned: "",
        platform: "APP",
        approval: ""
    },
    {
        label: "Unpublished Premium",
        published: "NO",
        free: "NO",
        pinned: "",
        platform: "APP",
        approval: ""
    },
    {
        label: "Published Free",
        published: "YES",
        free: "YES",
        pinned: "",
        platform: "APP",
        approval: ""
    },
    {
        label: "Unpublished Free",
        published: "NO",
        free: "YES",
        pinned: "",
        platform: "APP",
        approval: ""
    },
    {
        label: "Pinned",
        published: "",
        free: "",
        pinned: "PINNED",
        platform: "APP",
        approval: ""
    },
    {
        label: "Scheduled for Notifications",
        published: "YES",
        free: "",
        pinned: "SCHEDULED",
        platform: "APP",
        approval: ""
    },
    {
        label: "Portal",
        published: "",
        free: "",
        pinned: "",
        platform: "PORTAL",
        approval: ""
    },
    {
        label: "Min Web App",
        published: "",
        free: "",
        pinned: "",
        platform: "MIN_WEB_APP",
        approval: ""
    },
]
export const productStatus = [
    {
        label: "All",
    },
    {
        label: "Available",
    },
    {
        label: "Unavailable",
    },
    {
        label: "Products For App",
    },
    {
        label: "Products For Portal",
    },
    {
        label: "Scheduled Notifications",
    }
]
export const datingUserStatusStatus = [
    {
        label: "All",
    },
    {
        label: "Active",
    },
    {
        label: "Pending",
    },
    {
        label: "Disabled",
    },
    {
        label: "Pending Image Verification",
    },
]
export const settingsDefaultData = {
    "id": 0,
    "version_code": 0,
    "motto": "Daktari kiganjani mwako",
    "support_phone": "+255758784385",
    "error": "NO",
    "show_card": "NO",
    "show_categories": "NO",
    "show_specialization": "NO",
    "total_view": 11690,
    "total_likes": 489,
    "force_update": "NO",
    "default_swahili_language": "NO",
    "shares_promotion_word": "Daka Bonasi",
    "disable_doctor_registration": "NO",
    "default_payment_subscription_id": 0,
    "android_version_code": 0,
    "ios_version_code": 0,
    "android_force_update": "NO",
    "ios_force_update": "NO",
    "disable_promo_code": "NO"
}