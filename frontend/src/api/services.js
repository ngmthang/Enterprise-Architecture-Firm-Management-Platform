import apiClient from './client';

// Auth
export const authAPI = {
  login: (email, password) => apiClient.post('/api/v1/auth/login', { email, password }),
  me: () => apiClient.get('/api/v1/auth/me'),
};

// Company Profile
export const companyAPI = {
  get: () => apiClient.get('/api/v1/company-profile'),
  create: (data) => apiClient.post('/api/v1/company-profile', data),
  update: (data) => apiClient.put('/api/v1/company-profile', data),
};

// Services
export const servicesAPI = {
  getAll: () => apiClient.get('/api/v1/service-offerings'),
  getBySlug: (slug) => apiClient.get(`/api/v1/service-offerings/${slug}`),
  create: (data) => apiClient.post('/api/v1/service-offerings', data),
  update: (id, data) => apiClient.put(`/api/v1/service-offerings/${id}`, data),
  delete: (id) => apiClient.delete(`/api/v1/service-offerings/${id}`),
};

// Portfolio
export const portfolioAPI = {
  getAll: () => apiClient.get('/api/v1/portfolio-projects'),
  getBySlug: (slug) => apiClient.get(`/api/v1/portfolio-projects/${slug}`),
  create: (data) => apiClient.post('/api/v1/portfolio-projects', data),
  update: (id, data) => apiClient.put(`/api/v1/portfolio-projects/${id}`, data),
  delete: (id) => apiClient.delete(`/api/v1/portfolio-projects/${id}`),
};

// Projects
export const projectsAPI = {
  getAll: () => apiClient.get('/api/projects'),
  getPublic: () => apiClient.get('/api/projects/public'),
  getById: (id) => apiClient.get(`/api/projects/${id}`),
  create: (data) => apiClient.post('/api/projects', data),
  update: (id, data) => apiClient.put(`/api/projects/${id}`, data),
  updateStatus: (id, data) => apiClient.patch(`/api/projects/${id}/status`, data),
  delete: (id) => apiClient.delete(`/api/projects/${id}`),
};

// Project Documents
export const documentsAPI = {
  getAll: () => apiClient.get('/api/v1/project-documents'),
  getById: (id) => apiClient.get(`/api/v1/project-documents/${id}`),
  getByProject: (projectId) => apiClient.get(`/api/v1/project-documents/project/${projectId}`),
  create: (data) => apiClient.post('/api/v1/project-documents', data),
  update: (id, data) => apiClient.put(`/api/v1/project-documents/${id}`, data),
  delete: (id) => apiClient.delete(`/api/v1/project-documents/${id}`),
};

// Team Members
export const teamAPI = {
  getAll: () => apiClient.get('/api/v1/team-members'),
  getById: (id) => apiClient.get(`/api/v1/team-members/${id}`),
  create: (data) => apiClient.post('/api/v1/team-members', data),
  update: (id, data) => apiClient.put(`/api/v1/team-members/${id}`, data),
  delete: (id) => apiClient.delete(`/api/v1/team-members/${id}`),
};

// Quotations
export const quotationsAPI = {
  getAll: () => apiClient.get('/api/quotations'),
  getById: (id) => apiClient.get(`/api/quotations/${id}`),
  create: (data) => apiClient.post('/api/quotations', data),
  update: (id, data) => apiClient.put(`/api/quotations/${id}`, data),
  updateStatus: (id, data) => apiClient.patch(`/api/quotations/${id}/status`, data),
  delete: (id) => apiClient.delete(`/api/quotations/${id}`),
};

// Contracts
export const contractsAPI = {
  getAll: () => apiClient.get('/api/contracts'),
  getById: (id) => apiClient.get(`/api/contracts/${id}`),
  create: (data) => apiClient.post('/api/contracts', data),
  update: (id, data) => apiClient.put(`/api/contracts/${id}`, data),
  updateStatus: (id, data) => apiClient.patch(`/api/contracts/${id}/status`, data),
  delete: (id) => apiClient.delete(`/api/contracts/${id}`),
};

// Invoices
export const invoicesAPI = {
  getAll: () => apiClient.get('/api/invoices'),
  getById: (id) => apiClient.get(`/api/invoices/${id}`),
  create: (data) => apiClient.post('/api/invoices', data),
  update: (id, data) => apiClient.put(`/api/invoices/${id}`, data),
  updateStatus: (id, data) => apiClient.patch(`/api/invoices/${id}/status`, data),
  delete: (id) => apiClient.delete(`/api/invoices/${id}`),
};

// Payments
export const paymentsAPI = {
  getAll: () => apiClient.get('/api/v1/payments'),
  getById: (id) => apiClient.get(`/api/v1/payments/${id}`),
  create: (data) => apiClient.post('/api/v1/payments', data),
  update: (id, data) => apiClient.put(`/api/v1/payments/${id}`, data),
  updateStatus: (id, data) => apiClient.patch(`/api/v1/payments/${id}/status`, data),
  delete: (id) => apiClient.delete(`/api/v1/payments/${id}`),
};

// Consultations
export const consultationsAPI = {
  getAll: () => apiClient.get('/api/v1/consultations'),
  getById: (id) => apiClient.get(`/api/v1/consultations/${id}`),
  create: (data) => apiClient.post('/api/v1/consultations', data),
  updateStatus: (id, data) => apiClient.patch(`/api/v1/consultations/${id}/status`, data),
  delete: (id) => apiClient.delete(`/api/v1/consultations/${id}`),
};

// Contact Inquiries
export const contactAPI = {
  getAll: () => apiClient.get('/api/v1/contact-inquiries'),
  getById: (id) => apiClient.get(`/api/v1/contact-inquiries/${id}`),
  create: (data) => apiClient.post('/api/v1/contact-inquiries', data),
  updateStatus: (id, data) => apiClient.patch(`/api/v1/contact-inquiries/${id}/status`, data),
  delete: (id) => apiClient.delete(`/api/v1/contact-inquiries/${id}`),
};

// Expenses
export const expensesAPI = {
  getAll: () => apiClient.get('/api/v1/expenses'),
  getById: (id) => apiClient.get(`/api/v1/expenses/${id}`),
  create: (data) => apiClient.post('/api/v1/expenses', data),
  update: (id, data) => apiClient.put(`/api/v1/expenses/${id}`, data),
  delete: (id) => apiClient.delete(`/api/v1/expenses/${id}`),
};

// Reports
export const reportsAPI = {
  getAll: () => apiClient.get('/api/v1/reports'),
  getById: (id) => apiClient.get(`/api/v1/reports/${id}`),
  create: (data) => apiClient.post('/api/v1/reports', data),
  update: (id, data) => apiClient.put(`/api/v1/reports/${id}`, data),
  delete: (id) => apiClient.delete(`/api/v1/reports/${id}`),
};

// Notifications
export const notificationsAPI = {
  getAll: () => apiClient.get('/api/v1/notifications'),
  getByUser: (userId) => apiClient.get(`/api/v1/notifications/user/${userId}`),
  getUnread: (userId) => apiClient.get(`/api/v1/notifications/user/${userId}/unread`),
  create: (data) => apiClient.post('/api/v1/notifications', data),
  markRead: (id, data) => apiClient.patch(`/api/v1/notifications/${id}/read`, data),
  markAllRead: (userId) => apiClient.patch(`/api/v1/notifications/user/${userId}/read-all`),
  delete: (id) => apiClient.delete(`/api/v1/notifications/${id}`),
};

// Users
export const usersAPI = {
  getAll: () => apiClient.get('/api/v1/users'),
  getById: (id) => apiClient.get(`/api/v1/users/${id}`),
  create: (data) => apiClient.post('/api/v1/users', data),
  update: (id, data) => apiClient.put(`/api/v1/users/${id}`, data),
  delete: (id) => apiClient.delete(`/api/v1/users/${id}`),
  enable: (id) => apiClient.patch(`/api/v1/users/${id}/enable`),
  disable: (id) => apiClient.patch(`/api/v1/users/${id}/disable`),
};