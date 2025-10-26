import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home/Home";
import Contents from "../pages/Contents/Contents";
import Doctors from "../pages/Doctors/Doctors";
import Layout from "../layouts/dashboard/Layout";
import ContentCategories from "../pages/ContentCategories/ContentCategories";
import Authors from "../pages/Authors/Authors";
import ContentReports from "../pages/Contents/ContentReports";
import DoctorApplications from "../pages/DoctorApplications/DoctorApplications";
import Specializations from "../pages/Specializations/Specializations";
import DoctorReports from "../pages/Doctors/DoctorReports";
import Users from "../pages/Users";
import Secreteries from "../pages/Secreteries/Secreteries";
import Administrators from "../pages/Administrators/Administrators";
import UserReports from "../pages/Users/UserReports";
import Settings from "../pages/Settings/Settings";
import Payments from "../pages/Payments/Payments";
import PaymentReports from "../pages/Payments/PaymentReports";
import Consultation from "../pages/Consultations";
import ConsultationReports from "../pages/Consultations/ConsultationReports";
import LabInvestigations from "../pages/LabInvestigations";
import MedicinePrescription from "../pages/MedicinePrescription";
import MedicalReports from "../pages/MedicalReports/MedicalReports";
import Diseases from "../pages/Diseases";
import MedicalTests from "../pages/MedicalTests/MedicalTests";
import Medicines from "../pages/Medicines/Medicines";
import MedicalSchedules from "../pages/MedicalSchedules";
import MedicalRoutes from "../pages/MedicalRoutes";
import PeriodCycle from "../pages/PeriodCycle/PeriodCycle";
import SubscriptionTypes from "../pages/SubscriptionTypes";
import Login from "../pages/Login/Login";
import { AuthLayout } from "../layouts/auth/auth-layout";
import ChatSessionsAppeals from "../pages/ChatSessionsAppeals/ChatSessionsAppeals";
import Orders from "../pages/Orders/Orders";
import ShopsReport from "../pages/Orders/ShopsReport";
import Products from "../pages/Products/Products";
import ProductCategories from "../pages/ProductCategories/ProductCategories";
import Vendors from "../pages/Vendors/Vendors";
import Drivers from "../pages/Drivers/Drivers";
import ProductCategoriesBanners from "../pages/ProductCategoriesBanners";
import Regions from "../pages/Regions/Regions";
import ServicesProvided from "../pages/ServicesProvided/ServicesProvided";
import ProductContentsBanners from "../pages/ProductContentsBanners/ProductContentsBanners";
import OrderStatus from "../pages/OrderStatus/OrderStatus";
import Tribes from "../pages/Tribes/Tribes";
import Interests from "../pages/Interests/Interests";
import DatingUsers from "../pages/DatingUsers/DatingUsers";
import DatingUsersChats from "../pages/DatingUsersChats/DatingUsersChats";
import ContentSubscribers from "../pages/ContentSubscribers/ContentSubscribers";
import Campaigns from "../pages/Campaigns/Campaigns";
import ExpireTomorrow from "../pages/ExpireTomorrow/ExpireTomorrow";
import PaymentAnalytics from "../pages/Payments/PaymentAnalytics";
import AdsTracking from "../pages/AdsTracking/AdsTracking";
import ManualSubscriptions from "../pages/Payments/ManualSubscriptions";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
    errorElement: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: "contents/contents",
    element: (
      <Layout>
        <Contents />
      </Layout>
    ),
  },
  {
    path: "contents/categories",
    element: (
      <Layout>
        <ContentCategories />
      </Layout>
    ),
  },
  {
    path: "contents/authors",
    element: (
      <Layout>
        <Authors />
      </Layout>
    ),
  },
  {
    path: "contents/reports",
    element: (
      <Layout>
        <ContentReports />
      </Layout>
    ),
  },
  {
    path: "doctors/doctors",
    element: (
      <Layout>
        <Doctors />
      </Layout>
    ),
  },
  {
    path: "doctors/applications",
    element: (
      <Layout>
        <DoctorApplications />
      </Layout>
    ),
  },
  {
    path: "doctors/specializations",
    element: (
      <Layout>
        <Specializations />
      </Layout>
    ),
  },
  {
    path: "doctors/reports",
    element: (
      <Layout>
        <DoctorReports />
      </Layout>
    ),
  },
  {
    path: "users/users",
    element: (
      <Layout>
        <Users />
      </Layout>
    ),
  },
  {
    path: "users/content-subscribers",
    element: (
      <Layout>
        <ContentSubscribers />
      </Layout>
    ),
  },
  {
    path: "ads/tracking",
    element: (
      <Layout>
        <AdsTracking />
      </Layout>
    ),
  },
  {
    path: "users/vendors",
    element: (
      <Layout>
        <Vendors />
      </Layout>
    ),
  },
  {
    path: "users/drivers",
    element: (
      <Layout>
        <Drivers />
      </Layout>
    ),
  },
  {
    path: "users/secretaries",
    element: (
      <Layout>
        <Secreteries />
      </Layout>
    ),
  },
  {
    path: "users/administrators",
    element: (
      <Layout>
        <Administrators />
      </Layout>
    ),
  },
  {
    path: "users/reports",
    element: (
      <Layout>
        <UserReports />
      </Layout>
    ),
  },
  {
    path: "medical/consultations",
    element: (
      <Layout>
        <Consultation />
      </Layout>
    ),
  },
  {
    path: "medical/chat-sessions-appeals",
    element: (
      <Layout>
        <ChatSessionsAppeals />
      </Layout>
    ),
  },
  {
    path: "medical/lab-investigations",
    element: (
      <Layout>
        <LabInvestigations />
      </Layout>
    ),
  },
  {
    path: "medical/medicine-prescription",
    element: (
      <Layout>
        <MedicinePrescription />
      </Layout>
    ),
  },
  {
    path: "medical/medical-reports",
    element: (
      <Layout>
        <MedicalReports />
      </Layout>
    ),
  },
  {
    path: "medical/diseases",
    element: (
      <Layout>
        <Diseases />
      </Layout>
    ),
  },
  {
    path: "medical/medical-tests",
    element: (
      <Layout>
        <MedicalTests />
      </Layout>
    ),
  },
  {
    path: "medical/medicines",
    element: (
      <Layout>
        <Medicines />
      </Layout>
    ),
  },
  {
    path: "medical/medicine-frequency",
    element: (
      <Layout>
        <MedicalSchedules />
      </Layout>
    ),
  },
  {
    path: "medical/medical-routes",
    element: (
      <Layout>
        <MedicalRoutes />
      </Layout>
    ),
  },
  {
    path: "medical/period-cycle",
    element: (
      <Layout>
        <PeriodCycle />
      </Layout>
    ),
  },
  {
    path: "medical/reports",
    element: (
      <Layout>
        <ConsultationReports />
      </Layout>
    ),
  },
  {
    path: "shops/orders",
    element: (
      <Layout>
        <Orders />
      </Layout>
    ),
  },
  {
    path: "shops/products",
    element: (
      <Layout>
        <Products />
      </Layout>
    ),
  },
  {
    path: "shops/product-categories",
    element: (
      <Layout>
        <ProductCategories />
      </Layout>
    ),
  },
  {
    path: "shops/products-categories-banners",
    element: (
      <Layout>
        <ProductCategoriesBanners />
      </Layout>
    ),
  },
  {
    path: "shops/products-contents-banners",
    element: (
      <Layout>
        <ProductContentsBanners />
      </Layout>
    ),
  },
  {
    path: "shops/regions",
    element: (
      <Layout>
        <Regions />
      </Layout>
    ),
  },
  {
    path: "shops/reports",
    element: (
      <Layout>
        <ShopsReport />
      </Layout>
    ),
  },
  {
    path: "dating/tribes",
    element: (
      <Layout>
        <Tribes />
      </Layout>
    ),
  },
  {
    path: "dating/interests",
    element: (
      <Layout>
        <Interests />
      </Layout>
    ),
  },
  {
    path: "dating/users",
    element: (
      <Layout>
        <DatingUsers />
      </Layout>
    ),
  },
  {
    path: "dating/users/chats",
    element: (
      <Layout>
        <DatingUsersChats />
      </Layout>
    ),
  },
  {
    path: "payments/subscriptions",
    element: (
      <Layout>
        <Payments />
      </Layout>
    ),
  },
  {
    path: "payments/manual-subscriptions",
    element: (
      <Layout>
        <ManualSubscriptions />
      </Layout>
    ),
  },
  {
    path: "payments/accounts-expires-tomorrow",
    element: (
      <Layout>
        <ExpireTomorrow />
      </Layout>
    ),
  },
  {
    path: "payments/subscriptions-types",
    element: (
      <Layout>
        <SubscriptionTypes />
      </Layout>
    ),
  },
  {
    path: "payments/campaigns",
    element: (
      <Layout>
        <Campaigns />
      </Layout>
    ),
  },
  {
    path: "payments/analytics",
    element: (
      <Layout>
        <PaymentAnalytics />
      </Layout>
    ),
  },
  {
    path: "payments/reports",
    element: (
      <Layout>
        <PaymentReports />
      </Layout>
    ),
  },
  {
    path: "settings/general",
    element: (
      <Layout>
        <Settings />
      </Layout>
    ),
  },
  {
    path: "settings/services",
    element: (
      <Layout>
        <ServicesProvided />
      </Layout>
    ),
  },
  {
    path: "settings/order-status",
    element: (
      <Layout>
        <OrderStatus />
      </Layout>
    ),
  },
  {
    path: "login",
    element: (
      <AuthLayout>
        <Login />
      </AuthLayout>
    ),
  },
]);
