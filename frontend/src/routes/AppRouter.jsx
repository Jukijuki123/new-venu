import { Route, Routes } from "react-router-dom";
import Landing from "../pages/LandingPage";
import Login from "../pages/Login";
import Register from "../pages/Register";
import SchoolHome from "../pages/school/SchoolHome";
import UmkmHome from "../pages/umkm/UmkmHome";
import ProtectedRoute from "./ProtectedRoute";
import AiMatchSchool from "../pages/AiMatchSchool";
import AiMatchUmkm from "../pages/AiMatchUmkm";
import SchoolAiMatchIntro from "../pages/school/AiMatchIntro";
import UmkmAiMatchIntro from "../pages/umkm/AiMatchIntro";
import EventSaya from "../pages/school/EventSaya";
import SchoolApplications from "../pages/school/SchoolApplications";
import TenantManagement from "../pages/school/TenantManagement";
import EventAnalytics from "../pages/school/EventAnalytics";
import SchoolAnalyticsOverview from "../pages/school/SchoolAnalyticsOverview";
import SchoolProfile from "../pages/school/SchoolProfile";
import UmkmProfile from "../pages/umkm/UmkmProfile";
import JelajahEvent from "../pages/umkm/JelajahEvent";
import LamaranSaya from "../pages/umkm/LamaranSaya";
import UmkmDetail from "../pages/school/UmkmDetail";
import EventDetail from "../pages/umkm/EventDetail";

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* School */}
      <Route element={<ProtectedRoute allowedRole="school" />}>
        <Route path="/school" element={<SchoolHome />} />
        <Route path="/school/events" element={<EventSaya />} />
        <Route path="/school/umkm/:slug" element={<UmkmDetail />} />
        <Route path="/school/ai-match" element={<SchoolAiMatchIntro />} />
        <Route path="/school/ai-match/hasil" element={<AiMatchSchool />} />
        <Route path="/school/applications" element={<SchoolApplications />} />
        <Route path="/school/events/:eventId/tenants" element={<TenantManagement />} />
        <Route path="/school/events/:eventId/analytics" element={<EventAnalytics />} />
        <Route path="/school/profile" element={<SchoolProfile />} />
      </Route>

      {/* UMKM */}
      <Route element={<ProtectedRoute allowedRole="umkm" />}>
        <Route path="/umkm" element={<UmkmHome />} />
        <Route path="/umkm/events" element={<JelajahEvent />} />
        <Route path="/umkm/events/:slug" element={<EventDetail />} />
        <Route path="/umkm/applications" element={<LamaranSaya />} />
        <Route path="/umkm/ai-match" element={<UmkmAiMatchIntro />} />
        <Route path="/umkm/ai-match/hasil" element={<AiMatchUmkm />} />
        <Route path="/umkm/profile" element={<UmkmProfile />} />
      </Route>
    </Routes>
  );
}
