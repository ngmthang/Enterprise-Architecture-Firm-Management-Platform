import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/shared/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import HomePage from './pages/public/HomePage';
import ConsultationPage from './pages/public/ConsultationPage';
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';

function ComingSoon({ title }) {
  return (
    <div style={{ padding: '3rem', color: 'var(--text-primary)' }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem' }}>{title}</h2>
      <p style={{ color: 'var(--text-muted)' }}>This section is ready to be built. API is connected.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="/contact" element={<ConsultationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={
          <ProtectedRoute><AdminLayout /></ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ComingSoon title="Projects" />} />
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
