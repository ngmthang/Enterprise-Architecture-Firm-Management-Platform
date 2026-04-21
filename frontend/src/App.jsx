import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/shared/ProtectedRoute';
import RoleRoute from './components/shared/RoleRoute';
import AdminLayout from './components/admin/AdminLayout';
import ArchitectLayout from './components/architect/ArchitectLayout';
import ClientLayout from './components/client/ClientLayout';
import HomePage from './pages/public/HomePage';
import PublicPortfolioPage from './pages/public/PublicPortfolioPage';
import PublicServicesPage from './pages/public/PublicServicesPage';
import ContactPage from './pages/public/ContactPage';
import ConsultationPage from './pages/public/ConsultationPage';
import LoginPage from './pages/admin/LoginPage';
import ProjectsPage from './pages/admin/ProjectsPage';
import ConsultationsPage from './pages/admin/ConsultationsPage';
import ContactInquiriesPage from './pages/admin/ContactInquiriesPage';
import TeamMembersPage from './pages/admin/TeamMembersPage';
import InvoicesPage from './pages/admin/InvoicesPage';
import QuotationsPage from './pages/admin/QuotationsPage';
import ContractsPage from './pages/admin/ContractsPage';
import PaymentsPage from './pages/admin/PaymentsPage';
import ExpensesPage from './pages/admin/ExpensesPage';
import ReportsPage from './pages/admin/ReportsPage';
import PortfolioPage from './pages/admin/PortfolioPage';
import ServicesPage from './pages/admin/ServicesPage';
import CompanyProfilePage from './pages/admin/CompanyProfilePage';
import NotificationsPage from './pages/admin/NotificationsPage';
import DashboardPage from './pages/admin/DashboardPage';
import UsersPage from './pages/admin/UsersPage';
import UnauthorizedPage from './pages/shared/UnauthorizedPage';
import ArchitectDashboard from './pages/architect/ArchitectDashboard';
import ArchitectProjectsPage from './pages/architect/ArchitectProjectsPage';
import ArchitectDocumentsPage from './pages/architect/ArchitectDocumentsPage';
import ArchitectTeamPage from './pages/architect/ArchitectTeamPage';
import ArchitectExpensesPage from './pages/architect/ArchitectExpensesPage';
import ArchitectNotificationsPage from './pages/architect/ArchitectNotificationsPage';
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProjectsPage from './pages/client/ClientProjectsPage';
import ClientQuotationsPage from './pages/client/ClientQuotationsPage';
import ClientContractsPage from './pages/client/ClientContractsPage';
import ClientInvoicesPage from './pages/client/ClientInvoicesPage';
import ClientConsultationsPage from './pages/client/ClientConsultationsPage';
import ClientNotificationsPage from './pages/client/ClientNotificationsPage';

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];
const ARCHITECT_ROLES = ['ARCHITECT', 'PROJECT_MANAGER', 'STAFF'];
const CLIENT_ROLES = ['CLIENT'];

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/portfolio" element={<PublicPortfolioPage />} />
          <Route path="/services" element={<PublicServicesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Admin */}
          <Route path="/admin" element={
            <RoleRoute allowedRoles={ADMIN_ROLES}><AdminLayout /></RoleRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="quotations" element={<QuotationsPage />} />
            <Route path="contracts" element={<ContractsPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="consultations" element={<ConsultationsPage />} />
            <Route path="contacts" element={<ContactInquiriesPage />} />
            <Route path="team" element={<TeamMembersPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="company" element={<CompanyProfilePage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>

          {/* Architect */}
          <Route path="/architect" element={
            <RoleRoute allowedRoles={ARCHITECT_ROLES}><ArchitectLayout /></RoleRoute>
          }>
            <Route index element={<ArchitectDashboard />} />
            <Route path="projects" element={<ArchitectProjectsPage />} />
            <Route path="documents" element={<ArchitectDocumentsPage />} />
            <Route path="team" element={<ArchitectTeamPage />} />
            <Route path="expenses" element={<ArchitectExpensesPage />} />
            <Route path="notifications" element={<ArchitectNotificationsPage />} />
          </Route>

          {/* Client */}
          <Route path="/client" element={
            <RoleRoute allowedRoles={CLIENT_ROLES}><ClientLayout /></RoleRoute>
          }>
            <Route index element={<ClientDashboard />} />
            <Route path="projects" element={<ClientProjectsPage />} />
            <Route path="quotations" element={<ClientQuotationsPage />} />
            <Route path="contracts" element={<ClientContractsPage />} />
            <Route path="invoices" element={<ClientInvoicesPage />} />
            <Route path="consultations" element={<ClientConsultationsPage />} />
            <Route path="notifications" element={<ClientNotificationsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
  );
}