import { getAllProductsUrl, getAllVendorsUrl } from "./url"

export const contentFields = [
    { name: "title", type: "text", label: "Title", notRequired: true },
    { name: "short_description", type: "text", label: "Short description", notRequired: true },
    { name: "description", type: "ck", label: "Body", notRequired: true },
    { name: "content_link", type: "text", label: "Content Link", notRequired: true },
    { name: "content_link_text", type: "text", label: "Content Link Text", notRequired: true },
    {
        name: "is_in_free_package",
        type: "select",
        label: "Package type",
        items: [
            { value: 'NO', label: "PREMIUM", },
            { value: 'YES', label: "FREE", },
        ],
    },
    { name: "author_id", type: "select", label: "Author" },
    { name: "category_id", type: "select", label: "Category" },
    { name: "sub_category_id", type: "select", label: "Sub category" },
    {
        name: "product_id",
        type: "search",
        label: "Product Name",
        searchLabel: "product_name",
        searchImage: "product_files",
        searchImageFirstItem: "image_url",
        searchUrl: getAllProductsUrl,
        searchBody: {
            "status": "AVAILABLE",
            "sort": "id desc",
            "limit": 10,
            "page": 1
        },
        notRequired: true
    },
    { name: "campaign_id", type: "select", label: "Campaign", notRequired: true },
    {
        name: "last_visible_cover_image",
        type: "select",
        label: "Last Visible Cover Image",
        items: [
            { value: 2, label: 2 },
            { value: 3, label: 3 },
            { value: 4, label: 4 },
            { value: 5, label: 5 },
            { value: 6, label: 6 },
            { value: 7, label: 7 },
            { value: 8, label: 8 },
            { value: 9, label: 9 },
        ],

    },
    {
        name: "platform",
        type: "select",
        label: "Platform",
        items: [
            { value: 'APP', label: "APP", },
            { value: 'PORTAL', label: "PORTAL", },
            { value: 'MIN_WEB_APP', label: "MIN WEB APP", },
            { value: 'ALL', label: "ALL", },
        ],
    },
]

export const contentAudioFields = [
    { name: "audio", type: "file", label: "Audio", },
]

export const scheduleNotificationsFields = [
    { name: "notification_time", type: "dateTime", label: "Time" },
    { name: "notification_repeat", type: "number", label: "Notification Repeat", },
    { name: "notification_interval", type: "number", label: "Notification Interval", },
]

export const approveContentFields = [
    {
        name: "approval",
        type: "select",
        label: "Status",
        items: [
            { value: 'APPROVED', label: "APPROVE", },
            { value: 'REJECTED', label: "REJECT", },
        ],
    },
    { name: "reason", type: "text", label: "Reason", },
]

export const subscriptionTypeFields = [
    { name: "name", type: "text", label: "Subscription Name" },
    { name: "amount", type: "number", label: "Amount" },
    { name: "active_days", type: "text", label: "Acive Days" },
    { name: "eng_package_description", type: "text", label: "English Package Description" },
    {
        name: "status",
        type: "select",
        label: "Package Status",
        items: [
            { value: 'ACTIVE', label: "ACTIVE", },
            { value: 'INACTIVE', label: "INACTIVE", },
        ],
    },
]

export const diseasesFields = [
    { name: "code", type: "text", label: "Disease Code" },
    { name: "name", type: "text", label: "Disease Name" },
]

export const medicalTestsFields = [
    { name: "code", type: "text", label: "Disease Code" },
    { name: "name", type: "text", label: "Disease Name" },
    { name: "category", type: "text", label: "Category" },
]

export const medicinesFields = [
    { name: "item", type: "text", label: "Medicine Name" },
    { name: "unit", type: "text", label: "Medicine Unit" },
]

export const medicalSchedulesFields = [
    { name: "name", type: "text", label: "Medical Schedule Name" },
]

export const medicalRoutesFields = [
    { name: "name", type: "text", label: "Medical Route Name" },
]

export const userFields = [
    { name: "user_id", type: "text", label: "Search User" },
]

export const doctorInformationFields = [
    { name: "first_name", type: "text", label: "First Name" },
    { name: "last_name", type: "text", label: "Last Name" },
    {
        name: "gender",
        type: "select",
        label: "Gender",
        items: [
            { value: 'MALE', },
            { value: 'FEMALE', },
        ],
    },
    { name: "date_of_birth", type: "date", label: "Date Of Birth" },
    { name: "phone_number", type: "text", label: "Phone Number" },
    { name: "email", type: "text", label: "Email" },
    { name: "current_hospital", type: "text", label: "Current Hospital" },
    { name: "session_fee", type: "number", label: "Session Fee" },
    { name: "session_fee_percent", type: "number", label: "Session Fee Percent" },
    { name: "experience", type: "number", label: "Experience" },
    { name: "bio", type: "text", label: "Bio" },
]

export const doctorCertificatesFields = [
    { name: "first_degree_certificate", type: "pdf", label: "First Degree Certificate" },
    { name: "mct", type: "pdf", label: "MCT" },
    { name: "cv", type: "pdf", label: "CV" },
    { name: "identity_card", type: "pdf", label: "Identity Card" },
    { name: "signature", type: "image", label: "Doctor Signature" },
]

export const authorFields = [
    { name: "name", type: "text", label: "Author Name" },
    { name: "title", type: "text", label: "Title" },
    {
        name: "type",
        type: "select",
        label: "Type",
        items: [
            { value: 'PRIVATE', },
            { value: 'ORGANIZATION', },
        ],
    },
    {
        name: "is_doctor",
        type: "select",
        label: "Is Doctor",
        items: [
            { value: 'YES', },
            { value: 'NO', },
        ],
    },
    { name: "amount_per_view_premium_content", type: "number", label: "Amount Per View Premium Content" },
    { name: "amount_per_view_free_content", type: "number", label: "Amount Per View Free Content" },
    { name: "image", type: "file", label: "Author Image" },
]

export const authorProfileFields = [
    { name: "image", type: "file", label: "Author Image" },
];

export const specializationFields = [
    { name: "title", type: "text", label: "Specialization Title" },
    { name: "description", type: "text", label: "Specialization Description" },
    { name: "color", type: "color", label: "Specialization Color" },
    { name: "icon", type: "file", label: "Specialization Icon" },
]

export const contentCategoriesFields = [
    { name: "name", type: "text", label: "Category Name" },
    { name: "color", type: "color", label: "Category Color" },
    { name: "image", type: "file", label: "Category Icon", notRequired: true },
]

export const subCategoriesFields = [
    { name: "name", type: "text", label: "Sub Category Name" },
    { name: "color", type: "color", label: "Sub Category Color" },
    { name: "image", type: "file", label: "Sub Category Icon" },
]

export const resolveChatsessionAppealFields = [
    { name: "comment", type: "text", label: "Comment" },
    {
        name: "resume_chat",
        type: "select",
        label: "Resume Chat",
        items: [
            { value: 'YES', },
            { value: 'NO', },
        ],
    },
]

export const mobileConfigurationFields = [
    { name: "version_code", type: "number", label: "Version Code" },
    { name: "motto", type: "text", label: "Moto" },
    { name: "support_phone", type: "text", label: "Support phone" },
    {
        name: "show_card",
        type: "select",
        label: "Show card",
        items: [
            { value: 'YES', },
            { value: 'NO', },
        ],
    },
    {
        name: "show_categories",
        type: "select",
        label: "Show categories",
        items: [
            { value: 'YES', },
            { value: 'NO', },
        ],
    },
    {
        name: "show_specialization",
        type: "select",
        label: "Show specialization",
        items: [
            { value: 'YES', },
            { value: 'NO', },
        ],
    },
    { name: "total_view", type: "number", label: "Total view" },
    { name: "total_likes", type: "number", label: "Total likes" },
    {
        name: "force_update",
        type: "select",
        label: "Force Update",
        items: [
            { value: 'YES', },
            { value: 'NO', },
        ],
    },
    {
        name: "default_swahili_language",
        type: "select",
        label: "Default Swahili Language",
        items: [
            { value: 'YES', },
            { value: 'NO', },
        ],
    },
    { name: "shares_promotion_word", type: "text", label: "Shares Promotion Word" },
    {
        name: "disable_doctor_registration",
        type: "select",
        label: "Disable Doctor Registration",
        items: [
            { value: 'YES', },
            { value: 'NO', },
        ],
    },
    { name: "default_payment_subscription_id", type: "number", label: "Default Payment Subscription ID" },
    { name: "android_version_code", type: "number", label: "Android Version Code" },
    { name: "ios_version_code", type: "number", label: "IOS Version Code" },
    {
        name: "android_force_update",
        type: "select",
        label: "Android Force Update",
        items: [
            { value: 'YES', },
            { value: 'NO', },
        ],
    },
    {
        name: "ios_force_update",
        type: "select",
        label: "IOS Force Update",
        items: [
            { value: 'YES', },
            { value: 'NO', },
        ],
    },
    {
        name: "disable_promo_code",
        type: "select",
        label: "Disable Promo Code",
        items: [
            { value: 'YES', },
            { value: 'NO', },
        ],
    },
]

export const productsFormFields = [
    { name: "product_name", type: "text", label: "Product Name" },
    { name: "short_description", type: "text", label: "Short description" },
    { name: "product_description", type: "text", label: "Product Description" },
    { name: "description_in_html_form", type: "ck", label: "Description in HTML Form" },
    {
        name: "product_rating",
        type: "select",
        label: "Product Rating",
        items: [
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
            { value: 5, label: "5" }
        ],
    },
    { name: "product_category_id", type: "select", label: "Product Category", items: [] },
    { name: "product_sub_category_id", type: "select", label: "Product Sub Category", items: [] },
    {
        name: "product_vendor_id",
        type: "search",
        label: "Vendor Name",
        searchLabel: "firstName",
        searchImage: "profileImage",
        searchUrl: getAllVendorsUrl,
        searchBody: {
            "sort": "id desc",
            "limit": 10,
            "page": 1
        }
    },
    { name: "product_quantity", type: "number", label: "Quantity", notRequired: true },
    { name: "product_purchase_amount", type: "number", label: "Purchase Price" },
    { name: "product_amount", type: "number", label: "Selling Price" },
    { name: "product_promotion_amount", type: "number", label: "Promotion Selling Price" },
    { name: "product_shipping_cost_in_dar", type: "number", label: "Shipping Cost In Dar" },
    { name: "product_shipping_cost_in_other_regions", type: "number", label: "Shipping Cost In Other Regions" },
    {
        name: "multiply_shipping_cost",
        type: "select",
        label: "Multiply Shipping Cost",
        items: [
            { value: 'NO', label: "NO", },
            { value: 'YES', label: "YES", },
        ],
    },
    {
        name: "free_delivery_in_dar",
        type: "select",
        label: "Free Delivery In Dar",
        items: [
            { value: 'NO', label: "NO", },
            { value: 'YES', label: "YES", },
        ],
    },
    {
        name: "free_delivery_in_other_regions",
        type: "select",
        label: "Free Delivery In Other Regions",
        items: [
            { value: 'NO', label: "NO", },
            { value: 'YES', label: "YES", },
        ],
    },
    {
        name: "platform",
        type: "select",
        label: "Platform",
        items: [
            { value: 'APP', label: "APP", },
            { value: 'PORTAL', label: "PORTAL", },
            { value: 'ALL', label: "ALL", },
        ],
    },
]

export const productYoutubeVideoFields = [
    { name: "image_path", type: "text", label: "Product Youtube URL" },
    { name: "thumbunail_url", type: "text", label: "Thumbnail URL" },
    { name: "aspect_ratios", type: "text", label: "Aspect Ratio" },
]

export const productCategoriesFields = [
    { name: "product_category_name", type: "text", label: "Product Category Name" },
    { name: "product_category_color", type: "color", label: "Product Category Color" },
    { name: "image", type: "file", label: "Product Category Icon", notRequired: true },
]

export const productSubCategoriesFields = [
    { name: "product_sub_category_name", type: "text", label: "Product Sub Category Name" },
    { name: "image", type: "file", label: "Product Category Icon" },
]

export const productRatingsFields = [
    { name: "user_name", type: "text", label: "User Name" },
    {
        name: "value",
        type: "select",
        label: "Product Value",
        items: [
            { value: 1, label: "1" },
            { value: 2, label: "2" },
            { value: 3, label: "3" },
            { value: 4, label: "4" },
            { value: 5, label: "5" }
        ],
    },
    { name: "review", type: "text", label: "Product Review" },
]

export const productSectionsFields = [
    { name: "heading", type: "text", label: "Heading" },
    {
        name: "product_sub_category_id",
        type: "select",
        label: "Product Sub Category",
        items: [
            { value: 0, label: "No Sub Category" }
        ]
    },
    {
        name: "sort",
        type: "select",
        label: "Sort",
        notRequired: true,
        items: [
            { value: "id desc", label: "Product ID Descending" },
            { value: "id asc", label: "Product ID Ascending" },
            { value: "updated_at desc", label: "Product Updated At Descending" },
            { value: "updated_at asc", label: "Product Updated At Ascending" },
            { value: "product_rating desc", label: "Product Rating Descending" },
            { value: "product_rating asc", label: "Product Rating Ascending" },
            { value: "product_quantity desc", label: "Product Quantity Descending" },
            { value: "product_quantity asc", label: "Product Quantity Ascending" },
            { value: "product_purchase_amount desc", label: "Product Purchase Price Descending" },
            { value: "product_purchase_amount asc", label: "Product Purchase Price Ascending" },
            { value: "product_amount desc", label: "Product Selling Price Descending" },
            { value: "product_amount asc", label: "Product Selling Price Ascending" },
            { value: "product_promotion_amount desc", label: "Product Promotion Price Descending" },
            { value: "product_promotion_amount asc", label: "Product Promotion Price Ascending" },
            { value: "product_shipping_cost_in_dar desc", label: "Product Shipping Cost In Dar Descending" },
            { value: "product_shipping_cost_in_dar asc", label: "Product Shipping Cost In Dar Ascending" },
            { value: "product_shipping_cost_in_other_regions desc", label: "Product Maximum Shipping Cost Descending" },
            { value: "product_shipping_cost_in_other_regions asc", label: "Product Maximum Shipping Cost Ascending" },
        ],
    },
]

export const productBannersFields = [
    {
        name: "product_id",
        type: "search",
        label: "Product Name",
        searchLabel: "product_name",
        searchImage: "product_files",
        searchImageFirstItem: "image_url",
        searchUrl: getAllProductsUrl,
        searchBody: {
            "status": "AVAILABLE",
            "sort": "id desc",
            "limit": 10,
            "page": 1
        }
    },
    { name: "image", type: "file", label: "Product Banner Image" },
]

export const productCategoriesBannersFields = [
    { name: "product_category_id", type: "select", label: "Product Category", items: [] },
    { name: "image", type: "file", label: "Product Banner Image" },
]

export const regionsFields = [
    { name: "region_name", type: "text", label: "Region Name" },
]

export const districtsFields = [
    { name: "district_name", type: "text", label: "District Name" },
]

export const wardsFields = [
    { name: "ward_name", type: "text", label: "Ward Name" },
    { name: "shipping_cost", type: "number", label: "Shipping Cost" }
]

export const servicesProvidedFormFields = [
    { name: "service_name", type: "text", label: "Service Name" },
    {
        name: "service_type",
        type: "select",
        label: "Service Type",
        items: [
            { value: "CONTENTS", label: "CONTENTS" },
            { value: "SHOP", label: "SHOP" },
            { value: "PERIOD TRACKER", label: "PERIOD TRACKER" },
            { value: "TALK TO DOCTOR", label: "TALK TO DOCTOR" },
            { value: "DAKA BONASI", label: "DAKA BONASI" },
            { value: "DATING", label: "DATING" }
        ],
    },
    { name: "service_color", type: "color", label: "Service Color" },
    { name: "image", type: "file", label: "Service Icon", notRequired: true },
]

export const productsOrderStatusFormFields = [
    { name: "name", type: "text", label: "Status Name" },
    { name: "description", type: "text", label: "Status Description" },
    { name: "image", type: "file", label: "Status Icon", notRequired: true },
]

export const tibesFormFields = [
    { name: "tribe_name", type: "text", label: "Tribe Name" },
]

export const interestsFormFields = [
    { name: "interest_name", type: "text", label: "Interest Name" },
]

export const approveDatingUserFormFields = [
    {
        name: "status",
        type: "select",
        label: "Status",
        items: [
            { value: "ACTIVE", label: "APPROVE" },
            { value: "DISABLED", label: "DISABLE" },
        ],
    },
    { name: "disabled_reason", type: "text", label: "Reason", notRequired: true }
]

export const approveDatingUserImageFormFields = [
    {
        name: "status",
        type: "select",
        label: "Verify Image",
        items: [
            { value: "YES", label: "YES" },
            { value: "NO", label: "NO" },
        ],
    },
    { name: "disabled_reason", type: "text", label: "Reason", notRequired: true }
]

export const campaignFields = [
    { name: "title", type: "text", label: "Campaign Title" },
    { name: "description", type: "ck", label: "Campaign Description" },
    { name: "image", type: "file", label: "Campaign Image" },
    { name: "start_time", type: "dateTime", label: "Start Time" },
    { name: "end_time", type: "dateTime", label: "End Time" },
]

export const campaignPackageFields = [
    { name: "name", type: "text", label: "Package Name" },
    { name: "amount", type: "number", label: "Package Amount" },
    { name: "active_days", type: "number", label: "Active Days" },
    {
        name: "status",
        type: "select",
        label: "Package Status",
        items: [
            { value: 'ACTIVE', label: "ACTIVE", },
            { value: 'INACTIVE', label: "INACTIVE", },
        ],
    },
]