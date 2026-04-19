import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/shared/ProtectedRoute';
import RoleRoute from './components/shared/RoleRoute';
import AdminLayout from './components/admin/AdminLayout';
import ArchitectLayout from './components/architect/ArchitectLayout';
import ClientLayout from './components/client/ClientLayout';
import HomePage from './pages/public/HomePage';
import ConsultationPage from './pages/public/ConsultationPage';
import LoginPage from './pages/admin/LoginPage';
import ProjectsPage from './pages/admin/ProjectsPage';
import UnauthorizedPage from './pages/shared/UnauthorizedPage';
import DashboardPage from './pages/admin/DashboardPage';
import ArchitectDashboard from './pages/architect/ArchitectDashboard';
import ClientDashboard from './pages/client/ClientDashboard';

function ComingSoon({ title }) {
  return (
      <div style={{ padding: '3rem', color: 'var(--text-primary)' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem' }}>{title}</h2>
        <p style={{ color: 'var(--text-muted)' }}>This section is ready to be built. API is connected.</p>
      </div>
  );
}

const ADMIN_ROLES = ['SUPER_ADMIN', 'ADMIN'];
const ARCHITECT_ROLES = ['ARCHITECT', 'PROJECT_MANAGER', 'STAFF'];
const CLIENT_ROLES = ['CLIENT'];

export default function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/contact" element={<ConsultationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route path="/admin" element={
            <RoleRoute allowedRoles={ADMIN_ROLES}><AdminLayout /></RoleRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="quotations" element={<ComingSoon title="Quotations" />} />
            <Route path="contracts" element={<ComingSoon title="Contracts" />} />
            <Route path="invoices" element={<ComingSoon title="Invoices" />} />
            <Route path="payments" element={<ComingSoon title="Payments" />} />
            <Route path="expenses" element={<ComingSoon title="Expenses" />} />
            <Route path="consultations" element={<ComingSoon title="Consultations" />} />
            <Route path="contacts" element={<ComingSoon title="Contact Inquiries" />} />
            <Route path="team" element={<ComingSoon title="Team Members" />} />
            <Route path="portfolio" element={<ComingSoon title="Portfolio Projects" />} />
            <Route path="services" element={<ComingSoon title="Service Offerings" />} />
            <Route path="company" element={<ComingSoon title="Company Profile" />} />
            <Route path="reports" element={<ComingSoon title="Reports" />} />
            <Route path="notifications" element={<ComingSoon title="Notifications" />} />
          </Route>

          <Route path="/architect" element={
            <RoleRoute allowedRoles={ARCHITECT_ROLES}><ArchitectLayout /></RoleRoute>
          }>
            <Route index element={<ArchitectDashboard />} />
            <Route path="projects" element={<ComingSoon title="My Projects" />} />
            <Route path="documents" element={<ComingSoon title="Documents" />} />
            <Route path="team" element={<ComingSoon title="Team Members" />} />
            <Route path="expenses" element={<ComingSoon title="Expenses" />} />
          </Route>

          <Route path="/client" element={
            <RoleRoute allowedRoles={CLIENT_ROLES}><ClientLayout /></RoleRoute>
          }>
            <Route index element={<ClientDashboard />} />
            <Route path="projects" element={<ComingSoon title="My Projects" />} />
            <Route path="quotations" element={<ComingSoon title="My Quotations" />} />
            <Route path="contracts" element={<ComingSoon title="My Contracts" />} />
            <Route path="invoices" element={<ComingSoon title="My Invoices" />} />
            <Route path="consultations" element={<ComingSoon title="My Consultations" />} />
            <Route path="notifications" element={<ComingSoon title="Notifications" />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
  );
}