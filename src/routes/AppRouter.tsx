import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "../pages/HomePage";
import CalendarPage from "../pages/CalendarPage/CalendarPage";
import ChatRoomPage from "../pages/ChatRoomPage";
import CustomersPage from "../pages/CustomersPage";
import DashboardPage from "../pages/DashboardPage";
import HelpCenterPage from "../pages/HelpCenterPage";
import InboxPage from "../pages/InboxPage";
import InvoicesPage from "../pages/InvoicesPage";
import ProductsPage from "../pages/ProductsPage";
import SettingsPage from "../pages/SettingsPage";
import Layout from "../components/Layout/Layout";

const AppRouter = () => (
  <Router>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/calendar" replace />} />

        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/inbox" element={<InboxPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/chat-room" element={<ChatRoomPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/help" element={<HelpCenterPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRouter;
