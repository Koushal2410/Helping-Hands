import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;

// Payment helpers
export const createOrder = (data) => api.post('/payments/create-order', data);
export const verifyPayment = (data) => api.post('/payments/verify', data);
export const getStats = () => api.get('/payments/donations-stats');

// Volunteer
export const registerVolunteer = (data) => api.post('/volunteers/register', data);

// Donations
export const recordDonation = (data) => api.post('/donations/record', data);
export const getDonationHistory = () => api.get('/donations/history');

// Contact
export const sendContact = (data) => api.post('/contact/send', data);
