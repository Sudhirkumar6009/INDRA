import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const AI_ENGINE_URL = process.env.NEXT_PUBLIC_AI_ENGINE_URL || 'http://localhost:8001';

export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const aiClient = axios.create({
  baseURL: `${AI_ENGINE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  register: (name: string, email: string, password: string) =>
    apiClient.post('/auth/register', { name, email, password }),
  me: () => apiClient.get('/auth/me'),
};

export const climateAPI = {
  getDashboard: () => apiClient.get('/dashboard'),
  getClimateData: (params: Record<string, unknown>) =>
    apiClient.get('/climate/data', { params }),
  getHistorical: (region: string, startDate: string, endDate: string) =>
    apiClient.get('/climate/historical', { params: { region, startDate, endDate } }),
  getMonthlyData: (year: number, month: number, variable?: string) =>
    apiClient.get(`/climate/monthly/${year}/${month}`, { params: { variable } }),
  getTimeline: (year: number) =>
    apiClient.get(`/climate/timeline/${year}`),
  searchRegion: (query: string) =>
    apiClient.get('/climate/search', { params: { q: query } }),
};

export const predictionAPI = {
  predict: (data: { region: string; state: string; district: string; date: string }) =>
    aiClient.post('/predict', data),
  getPredictions: (region: string) =>
    apiClient.get('/predictions', { params: { region } }),
};

export const simulationAPI = {
  runSimulation: (data: { region: string; tempChange: number; rainfallChange?: number }) =>
    aiClient.post('/simulate', data),
  getSimulations: (region: string) =>
    apiClient.get('/simulations', { params: { region } }),
};

export const analyticsAPI = {
  getAnalytics: () => apiClient.get('/analytics'),
  getRiskScore: (district: string) =>
    apiClient.get(`/analytics/risk/${district}`),
  getInsights: (region: string) =>
    aiClient.get('/insights', { params: { region } }),
};

export const alertsAPI = {
  getAlerts: (region?: string) =>
    apiClient.get('/alerts', { params: { region } }),
  markRead: (alertId: string) =>
    apiClient.patch(`/alerts/${alertId}/read`),
};

export const datasetsAPI = {
  getDatasets: () => apiClient.get('/datasets'),
  getDataset: (id: string) => apiClient.get(`/datasets/${id}`),
};

export const reportsAPI = {
  generate: (params: Record<string, unknown>) =>
    apiClient.post('/reports/generate', params),
  download: (reportId: string) =>
    apiClient.get(`/reports/${reportId}/download`, { responseType: 'blob' }),
};
