//LIVE SERVER BASE URLs
export const webUrl = "https://afyachap.com";
export const contentsUrl = "https://www.content.afyachap.com";
export const doctorsUrl = "https://www.doctors.afyachap.com";
export const shopUrl = "https://www.chapmall.com";
export const usersUrl = "https://www.users.afyachap.com";

//TEST SERVER BASE URLs
// export const contentsUrl = "https://www.testserver.content.afyachap.com"
// export const doctorsUrl = "https://www.testserver.doctors.afyachap.com"
export const usersTestServerUrl = "https://www.testserver.users.afyachap.com";

//LOCAL SERVER BASE URLs
// export const contentsUrl = "http://192.168.1.172:8004"
// export const doctorsUrl = "http://192.168.1.172:8001"
// export const usersUrl = "http://192.168.1.172:8003"

//CONTENT MANAGEMENT URLs
export const getContentSettingsUrl = `${contentsUrl}/api/v1/view/setting/options`;
export const updateContentSettingUrl = `${contentsUrl}/api/v1/change/setting/option`;
export const getContentsStatisticsUrl = `${contentsUrl}/api/v1/contents/statistics`;
export const publishUnpublishContentUrl = `${contentsUrl}/api/v1/published/unpublish/content`;
export const pinUnpinContentUrl = `${contentsUrl}/api/v1/pin/unpin/content`;
export const scheduleContentNotificationUrl = `${contentsUrl}/api/v1/schedule/content/notification`;
export const searchContentByPaginationUrl = `${contentsUrl}/api/v1/search/contents/by/pagination`;
export const createContentUrl = `${contentsUrl}/api/v1/add/content/v2`;
export const addContentCoverImageUrl = `${contentsUrl}/api/v1/add/content/cover/image`;
export const addContentAudioUrl = `${contentsUrl}/api/v1/add/update/content/audio`;
export const getAllContentUrl = `${contentsUrl}/api/v1/get/all/contents/by/pagination/web`;
export const getAllContentCoversUrl = `${contentsUrl}/api/v1/view/content/cover/image/of/specific/content`;
export const updateContentUrl = `${contentsUrl}/api/v1/update/content`;
export const verifyContentUrl = `${contentsUrl}/api/v1/add/content/verification`;
export const deleteContentUrl = `${contentsUrl}/api/v1/delete/content`;
export const deleteCommentUrl = `${contentsUrl}/api/v1/delete/comment`;
export const deleteContentCoverImageUrl = `${contentsUrl}/api/v1/delete/content/cover/image`;

/*Author CRUD URLs*/
export const createAuthorUrl = `${contentsUrl}/api/v1/add/author`;
export const getAllAuthorByPaginationUrl = `${contentsUrl}/api/v1/view/all/authors/by/pagination`;
export const getAllAuthorUrl = `${contentsUrl}/api/v1/view/all/authors`;
export const updateAuthorUrl = `${contentsUrl}/api/v1/update/author`;
export const updateAuthorImageUrl = `${contentsUrl}/api/v1/update/author/image`;
export const getAuthorCheckoutsUrl = `${contentsUrl}/api/v1/get/author/wallet/transactions`;
export const getAuthorPerformanceUrl = `${contentsUrl}/api/v1/get/author/wallet`;
export const deleteAuthorUrl = `${contentsUrl}/api/v1/delete/author`;

/*Category CRUD URLs*/
export const createCategoryUrl = `${contentsUrl}/api/v1/add/category`;
export const getAllCategoriesByPaginationUrl = `${contentsUrl}/api/v1/get/all/categories/by/pagination`;
export const getAllCategoriesUrl = `${contentsUrl}/api/v1/get/all/categories`;
export const updateCategoryUrl = `${contentsUrl}/api/v1/update/category/by/Id`;
export const deleteCategoryUrl = `${contentsUrl}/api/v1/delete/category/by/Id`;

/*Sub Category CRUD URLs*/
export const createSubCategoryUrl = `${contentsUrl}/api/v1/add/sub/category`;
export const getAllSubCategoriesByPaginationUrl = `${contentsUrl}/api/v1/get/sub/categories/by/categoryid/pagination`;
export const getAllSubCategoriesUrl = `${contentsUrl}/api/v1/get/sub/categories/by/categoryid`;
export const updateSubCategoryUrl = `${contentsUrl}/api/v1/update/sub/category/by/Id`;
export const deleteSubCategoryUrl = `${contentsUrl}/api/v1/delete/sub/category/by/Id`;

//DOCTOR MANAGEMENT URLs

/*Doctor CRUD URLs*/
export const getDoctorsStatisticsUrl = `${doctorsUrl}/api/v1/doctors/statistics`;
export const getTotalDoctorsUrl = `${doctorsUrl}/api/v1/total/users`;
export const enableDisableDoctorUrl = `${doctorsUrl}/api/v1/enable/disable/doctor`;
export const createDoctorUrl = `${doctorsUrl}/api/v1/create/doctor`;
export const addDoctorAttachmentsUrl = `${doctorsUrl}/api/add/doctor/attachments`;
export const assignDoctorSpecializationUrl = `${doctorsUrl}/api/v1/assign/doctor/specialization`;
export const verifyDoctorUrl = `${doctorsUrl}/api/v1/verify/doctor`;
export const getAllDoctorApplicationsUrl = `${doctorsUrl}/api/v1/get/all/doctor/applications/by/pagination`;
export const getAllDoctorBasedOnSpecializationUrl = `${doctorsUrl}/api/v1/get/all/doctor/based/on/specialization`;
export const getAllDoctorUrl = `${doctorsUrl}/api/v1/get/all/doctor/by/pagination`;
export const getDoctorAttachmentsUrl = `${doctorsUrl}/api/v1/get/doctor/attachments`;
export const getDoctorReviewsUrl = `${doctorsUrl}/api/v1/get/doctor/rating/reviews`;
export const getDoctorCheckoutsUrl = `${doctorsUrl}/api/v1/get/doctor/checkouts`;
export const updateDoctorOnCreationUrl = `${doctorsUrl}/api/v1/update/doctor/on/creation`;
export const updateDoctorAttachmentsUrl = `${doctorsUrl}/api/v1/add/doctor/attachments`;
export const createUpdateDoctorRoleUrl = `${doctorsUrl}/api/v1/create/update/user/role`;
export const deleteDoctorUrl = `${doctorsUrl}/api/v1/delete/doctor/application`;
export const deleteDoctorRatingReviewsUrl = `${doctorsUrl}/api/v1/delete/rating/review`;

/*Specialization CRUD URLs*/
export const searchSpecializationUrl = `${doctorsUrl}/api/v1/search/specialization`;
export const createSpecializationUrl = `${doctorsUrl}/api/v1/create/specialization`;
export const getAllSpecializationUrl = `${doctorsUrl}/api/v1/get/specializations/by/pagination`;
export const updateSpecializationUrl = `${doctorsUrl}/api/v1/update/specialization`;
export const deleteSpecializationUrl = `${doctorsUrl}/api/v1/delete/specialization`;

//USER MANAGEMENT URLs
export const getUserUrl = `${usersUrl}/api/get/user`;
export const getUsersFromIDsUrl = `${usersUrl}/api/get/users/from/given/ids`;
export const loginByPhoneNumberUrl = `${usersUrl}/api/login/user/web/by/phonenumber`;
export const loginByEmailUrl = `${usersUrl}/api/login/user/web/by/email`;
export const verifyPhoneUrl = `${usersUrl}/api/verify/phone`;
export const getTopDoctorsUrl = `${usersUrl}/api/v1/get/top/doctors`;
export const getAllMobileConfigurationUrl = `${usersUrl}/api/v1/get/all/mobile/configurations`;
export const getTotalUsersUrl = `${usersUrl}/api/v1/total/users`;
export const getTotalMaleUsersUrl = `${usersUrl}/api/v1/total/male/users`;
export const getTotalFemaleUsersUrl = `${usersUrl}/api/v1/total/female/users`;
export const getTotalAndroidUsersUrl = `${usersUrl}/api/v1/total/android/users`;
export const getTotalIOSUsersUrl = `${usersUrl}/api/v1/total/ios/users`;
export const getTotalTodayUsersUrl = `${usersUrl}/api/v1/total/today/users`;
export const getUsersStatisticsUrl = `${usersUrl}/api/v1/users/statistics`;
export const getTotalUsersSixMonthSummaryUrl = `${usersUrl}/api/v1/get/total/users/six/months/summary`;
export const getTotalChatsSixMonthSummaryUrl = `${usersUrl}/api/v1/get/total/chat/sessions/six/months/summary`;
export const getAllUsersUrl = `${usersUrl}/api/all/user/by/pagination`;
export const getAllVendorsUrl = `${usersUrl}/api/all/vendors/by/pagination`;
export const getAllSecretariesUrl = `${usersUrl}/api/all/secretaries/by/pagination`;
export const getAllAdministratorsUrl = `${usersUrl}/api/all/administrators/by/pagination`;
export const getUserWalletUrl = `${usersUrl}/api/get/user/wallet`;
export const getUserWalletTransactionsUrl = `${usersUrl}/api/get/user/wallet/transactions`;
export const assignUserRoleUrl = `${usersUrl}/api/create/user/role`;
export const removeUserRoleUrl = `${usersUrl}/api/remove/user/role`;
export const getAllChatSessionsUrl = `${usersUrl}/api/v1/get/chat/sessions/by/pagination`;
export const getAllChatSessionsAppealsUrl = `${usersUrl}/api/v1/get/chat/session/appeals/by/pagination`;
export const getAllMedicalDoctorReportsUrl = `${usersUrl}/api/v1/get/all/medical/doctor/report/by/pagination`;
export const getAllPeriodEventsUrl = `${usersUrl}/api/v1/get/all/period/event/by/pagination`;
export const getDoctorPerformanceUrl = `${usersUrl}/api/v1/get/doctor/performance`;
export const resolveChatSessionAppealUrl = `${usersUrl}/api/v1/resolve/chat/sessions/appeal`;
export const enableDisableUserUrl = `${usersUrl}/api/enable/disable/user`;
export const deleteAccountUrl = `${usersUrl}/api/delete/account`;

/*Disease CRUD URLs*/
export const createDiseaseUrl = `${usersUrl}/api/v1/add/disease`;
export const getAllDiseasesUrl = `${usersUrl}/api/v1/get/all/disease/by/pagination`;
export const getDiseasesStatisticsUrl = `${usersUrl}/api/v1/get/diseases/statistics`;
export const updateDiseaseUrl = `${usersUrl}/api/v1/update/disease`;
export const deleteDiseaseUrl = `${usersUrl}/api/v1/delete/disease`;

/*Medical Test CRUD URLs*/
export const createTestUrl = `${usersUrl}/api/v1/add/test`;
export const getAllLabInvestigationsUrl = `${usersUrl}/api/v1/get/all/medical/tests/by/pagination`;
export const getAllMedicalTestsUrl = `${usersUrl}/api/v1/get/all/test/by/pagination`;
export const getMedicalTestsStatisticsUrl = `${usersUrl}/api/v1/get/medical/tests/statistics`;
export const updateTestUrl = `${usersUrl}/api/v1/update/test`;
export const deleteTestUrl = `${usersUrl}/api/v1/delete/test`;

/*medicine CRUD URLs*/
export const createMedicineUrl = `${usersUrl}/api/v1/add/drug`;
export const getAllMedicinePrescriptionsUrl = `${usersUrl}/api/v1/get/all/medicine/prescription/by/pagination`;
export const getAllMedicinesUrl = `${usersUrl}/api/v1/get/all/drug/by/pagination`;
export const getMedicinePrescriptionsStatisticsUrl = `${usersUrl}/api/v1/get/medical/prescription/statistics`;
export const updateMedicineUrl = `${usersUrl}/api/v1/update/drug`;
export const deleteMedicineUrl = `${usersUrl}/api/v1/delete/drug`;

/*Medical Schedules CRUD URLs*/
export const createScheduleUrl = `${usersUrl}/api/v1/add/schedule`;
export const getAllMedicalSchedulesUrl = `${usersUrl}/api/v1/get/all/schedule/by/pagination`;
export const updateScheduleUrl = `${usersUrl}/api/v1/update/schedule`;
export const deleteScheduleUrl = `${usersUrl}/api/v1/delete/schedule`;

/*Medical Routes CRUD URLs*/
export const createRouteUrl = `${usersUrl}/api/v1/add/route`;
export const getAllMedicalRoutesUrl = `${usersUrl}/api/v1/get/all/route/by/pagination`;
export const updateRouteUrl = `${usersUrl}/api/v1/update/route`;
export const deleteRouteUrl = `${usersUrl}/api/v1/delete/route`;

/*Products Categories URLs */
export const createProductsCategoryUrl = `${usersUrl}/api/v1/create/products/category`;
export const getAllProductsCategoriesUrl = `${usersUrl}/api/v1/get/all/products/categories`;
export const getAllProductsCategoriesByPaginationUrl = `${usersUrl}/api/v1/get/all/products/categories/by/pagination`;
export const updateProductsCategoryUrl = `${usersUrl}/api/v1/update/product/category`;
export const deleteProductsCategoryUrl = `${usersUrl}/api/v1/delete/product/category`;

/*Products Sub Categories URLs */
export const createProductsSubCategoryUrl = `${usersUrl}/api/v1/create/products/subcategory`;
export const getAllProductsSubCategoriesUrl = `${usersUrl}/api/v1/get/all/products/subcategories`;
export const getAllProductsSubCategoriesByPaginationUrl = `${usersUrl}/api/v1/get/all/products/subcategories/by/pagination`;
export const updateProductsSubCategoryUrl = `${usersUrl}/api/v1/update/product/subcategory`;
export const deleteProductsSubCategoryUrl = `${usersUrl}/api/v1/delete/product/subcategory`;

/*Products URLs */
export const createProductUrl = `${usersUrl}/api/v1/create/product`;
export const addProductImageUrl = `${usersUrl}/api/v1/add/product/image`;
export const addProductYouTubeVideoUrl = `${usersUrl}/api/v1/add/product/youtube/video`;
export const getProductUrl = `${usersUrl}/api/v1/get/product`;
export const getAllProductsUrl = `${usersUrl}/api/v1/get/products/by/pagination`;
export const updateProductUrl = `${usersUrl}/api/v1/update/product`;
export const updateProductAvailabilityUrl = `${usersUrl}/api/v1/update/product/availability`;
export const deleteProductImageUrl = `${usersUrl}/api/v1/delete/product/image`;
export const deleteProductUrl = `${usersUrl}/api/v1/delete/product`;
export const scheduleProductNotificationUrl = `${usersUrl}/api/v1/schedule/product/notification`;

/*Products Ratings URLs */
export const addProductsRatingUrl = `${usersUrl}/api/v1/add/products/rating`;
export const getAllProductsRatingsByPaginationUrl = `${usersUrl}/api/v1/get/all/products/ratings/by/pagination`;
export const updateProductsRatingUrl = `${usersUrl}/api/v1/update/product/rating`;
export const deleteProductsRatingUrl = `${usersUrl}/api/v1/delete/product/rating`;

/*Products Sections URLs */
export const createProductsSectionUrl = `${usersUrl}/api/v1/create/products/section`;
export const getAllProductsSectionsByPaginationUrl = `${usersUrl}/api/v1/get/all/products/sections/by/pagination`;
export const updateProductsSectionUrl = `${usersUrl}/api/v1/update/product/section`;
export const deleteProductsSectionUrl = `${usersUrl}/api/v1/delete/product/section`;

/*Products Banners URLs */
export const createProductsBannerUrl = `${usersUrl}/api/v1/create/products/banner`;
export const getAllProductsBannersByPaginationUrl = `${usersUrl}/api/v1/get/all/products/banners/by/pagination`;
export const updateProductsBannerUrl = `${usersUrl}/api/v1/update/product/banner`;
export const deleteProductsBannerUrl = `${usersUrl}/api/v1/delete/product/banner`;

/*Products Categories Banners URLs */
export const createProductsCategoriesBannerUrl = `${usersUrl}/api/v1/create/products/category/banner`;
export const getAllProductsCategoriesBannersByPaginationUrl = `${usersUrl}/api/v1/get/all/products/categories/banners/by/pagination`;
export const updateProductsCategoriesBannerUrl = `${usersUrl}/api/v1/update/product/category/banner`;
export const deleteProductsCategoriesBannerUrl = `${usersUrl}/api/v1/delete/product/category/banner`;

/*Regions URLs */
export const addRegionUrl = `${usersUrl}/api/v1/add/region`;
export const getAllRegionsUrl = `${usersUrl}/api/v1/get/all/regions`;
export const getAllRegionssByPaginationUrl = `${usersUrl}/api/v1/get/all/regions/by/pagination`;
export const updateRegionUrl = `${usersUrl}/api/v1/update/region`;
export const deleteRegionUrl = `${usersUrl}/api/v1/delete/region`;

/*Districts URLs */
export const addDistrictUrl = `${usersUrl}/api/v1/add/district`;
export const getAllDistrictsUrl = `${usersUrl}/api/v1/get/all/districts`;
export const getAllDistrictsByPaginationUrl = `${usersUrl}/api/v1/get/all/districts/by/pagination`;
export const updateDistrictUrl = `${usersUrl}/api/v1/update/district`;
export const deleteDistrictUrl = `${usersUrl}/api/v1/delete/district`;

/*Wards URLs */
export const addWardUrl = `${usersUrl}/api/v1/add/ward`;
export const getAllWardsUrl = `${usersUrl}/api/v1/get/all/wards`;
export const getAllWardsByPaginationUrl = `${usersUrl}/api/v1/get/all/wards/by/pagination`;
export const updateWardUrl = `${usersUrl}/api/v1/update/ward`;
export const deleteWardUrl = `${usersUrl}/api/v1/delete/ward`;

/*Products Orders URLs */
export const getAllOrdersByPaginationUrl = `${usersUrl}/api/v1/get/all/orders/by/pagination`;
export const updateOrderStatusUrl = `${usersUrl}/api/v1/update/order/status`;
export const updateOrderPaymentStatusUrl = `${usersUrl}/api/v1/update/order/payment/status`;
export const getPaymentOrderStatusUrl = `${webUrl}/api/v1/get/payment/order/status/`;
export const getProductsOrdersTopRegionsUrl = `${usersUrl}/api/v1/get/products/orders/top/regions`;

/*Services Provided URLs */
export const createServiceProvidedUrl = `${usersUrl}/api/v1/create/service/provided`;
export const getAllServicesProvidedUrl = `${usersUrl}/api/v1/get/all/services/provided`;
export const getAllservicesProvidedByPaginationUrl = `${usersUrl}/api/v1/get/all/services/provided/by/pagination`;
export const updateServiceProvidedUrl = `${usersUrl}/api/v1/update/service/provided`;
export const deleteServiceProvidedUrl = `${usersUrl}/api/v1/delete/service/provided`;

/*Products Contents Banners URLs */
export const createProductsContentsBannerUrl = `${usersUrl}/api/v1/create/products/content/banner`;
export const getAllProductsContentsBannersByPaginationUrl = `${usersUrl}/api/v1/get/all/products/contents/banners/by/pagination`;
export const updateProductsContentsBannerUrl = `${usersUrl}/api/v1/update/product/content/banner`;
export const deleteProductsContentsBannerUrl = `${usersUrl}/api/v1/delete/product/content/banner`;

/*Products Orders Satus URLs */
export const getProductsOrderStatusByPaginationUrl = `${usersUrl}/api/v1/get/products/order/status/by/pagination`;
export const updateProductsOrderStatusUrl = `${usersUrl}/api/v1/update/products/order/status`;

/*Payments */
export const getAllPaymentsTransactionsUrl = `${webUrl}/api/v1/payment/getAllTransacton`;
export const getAllPackageCategoriesUrl = `${webUrl}/api/v1/package/GetAllbusinessCategory`;
export const getAllPackagesUrl = `${webUrl}/api/v1/package/GetAllSubPackage`;
export const getAllPackagesByCategoryUrl = `${webUrl}/api/v1/package/GetPackageByBusinessCategoryId/`;
export const updatePackagesUrl = `${webUrl}/api/v1/package/update/`;
export const getTotalFreePremiumAccountsUrl = `${webUrl}/api/v1/user-account-type-distribution`;
export const getMonthlyRevenueUrl = `${webUrl}/api/v1/monthly-revenue`;
export const getAllExpireTomorrowAccountsUrl = `${webUrl}/api/v1/get/all/expire-tommorow-user-account-list-details`;
export const getAllUsersRenewtsUrl = `${webUrl}/api/v1/users/renewed-details`;
export const getTransactionDetailsUrl = `${webUrl}/api/v1/get/user/transaction/details/`;
export const updateTransactionUrl = `${webUrl}/api/v1/get/synch/payment/`;
export const revenueSummaryUrl = `${webUrl}/api/v1/get/getRevenueSummary?`;

/*Admin Subscription Management (Manual Assign) */
export const adminSubscriptionBaseUrl = `${webUrl}/api/v1/admin/subscription`;
export const adminSubscriptionSearchUsersUrl = `${adminSubscriptionBaseUrl}/search-users`;
export const adminSubscriptionUserDetailsUrl = `${adminSubscriptionBaseUrl}/user/`; // append {userId}/details
export const adminSubscriptionPackagesUrl = `${adminSubscriptionBaseUrl}/packages`;
export const adminSubscriptionAssignUrl = `${adminSubscriptionBaseUrl}/assign`;
export const adminSubscriptionUserHistoryUrl = `${adminSubscriptionBaseUrl}/user/`; // append {userId}/history
export const adminSubscriptionCancelUrl = `${adminSubscriptionBaseUrl}/cancel`;
export const adminSubscriptionProceedWithSelectedUserUrl = `${adminSubscriptionBaseUrl}/proceed-with-selected-user`;
export const adminSubscriptionAdminAssignedUrl = `${adminSubscriptionBaseUrl}/admin-assigned-subscriptions`;
export const adminSubscriptionRevenueUrl = `${adminSubscriptionBaseUrl}/admin-subscription-revenue`;
export const getUserTransactionDetailsUrl = `${webUrl}/api/v1/get/user/transaction/details/`;

/*Campaigns */
export const campaignUrl = `${webUrl}/api/v1/campaigns`;
export const campaignPackageUrl = `${webUrl}/api/v1/challenge-packages`;
export const getCampaignPackagesUrl = `${webUrl}/api/v1/campaigns/single-details`;
export const getCampaignWinnersUrl = `${webUrl}/api/v1/winners/campaign/`;

/*Tribes */
export const createTribeUrl = `${usersUrl}/api/add/tribe`;
export const getAllTribesUrl = `${usersUrl}/api/get/all/tribes`;
export const getAllTribesByPaginationUrl = `${usersUrl}/api/get/all/tribes/by/pagination`;
export const updateTribeUrl = `${usersUrl}/api/update/tribe`;
export const deleteTribeUrl = `${usersUrl}/api/delete/tribe`;

/*Interests */
export const createInterestUrl = `${usersUrl}/api/add/interest`;
export const getAllInterestsUrl = `${usersUrl}/api/get/all/interests`;
export const getAllInterestsByPaginationUrl = `${usersUrl}/api/get/all/interests/by/pagination`;
export const updateInterestUrl = `${usersUrl}/api/update/interest`;
export const deleteInterestUrl = `${usersUrl}/api/delete/interest`;

/*Dating */
export const getAllRegisteredDatingUsersByPaginationUrl = `${usersUrl}/api/get/all/registered/dating/user/by/pagination`;
export const enableDiasbleDatingUserUrl = `${usersUrl}/api/enable/disable/registered/dating/user`;
export const getAllRegisteredDatingUsersChatsByPaginationUrl = `${usersUrl}/api/get/all/registered/dating/users/chats/by/pagination`;
export const verifyDatingUserImageUrl = `${usersUrl}/api/verify/registered/dating/user/image`;
export const getRegisteredDatingUserByIdUrl = `${usersUrl}/api/get/registered/dating/user/by/id`;

/*Content Subscribers */
export const getAllContentSubscribersByPaginationUrl = `${usersTestServerUrl}/api/v1/get/content/subscribers/by/pagination`;
export const getAllAdsTrackingByPaginationUrl = `${usersUrl}/api/v1/get/all/ads/tracking/by/pagination`;
