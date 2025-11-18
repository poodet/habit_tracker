import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle unauthorized - redirect to login
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// API functions
export const authApi = {
    login: (data: { email: string; password: string }) =>
        api.post('/auth/login', data),
    register: (data: { email: string; password: string; firstName?: string; lastName?: string }) =>
        api.post('/auth/register', data),
};

export const objectDefinitionsApi = {
    getAll: () => api.get('/object-definitions'),
    getById: (id: string) => api.get(`/object-definitions/${id}`),
    create: (data: any) => api.post('/object-definitions', data),
    update: (id: string, data: any) => api.patch(`/object-definitions/${id}`, data),
    delete: (id: string) => api.delete(`/object-definitions/${id}`),
};

export const calendarEventsApi = {
    getAll: (params?: { startDate?: string; endDate?: string }) =>
        api.get('/calendar-events', { params }),
    getById: (id: string) => api.get(`/calendar-events/${id}`),
    create: (data: any) => api.post('/calendar-events', data),
    update: (id: string, data: any) => api.patch(`/calendar-events/${id}`, data),
    delete: (id: string) => api.delete(`/calendar-events/${id}`),
};

export default api;
