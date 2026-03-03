import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

export const getMyInquiries = (customerId: string) =>
  api.get('/inquiries/my', { params: { customer: customerId } });

export const createInquiry = (payload: {
  customer: string;
  customerName: string;
  subject: string;
  message: string;
  assignedTo?: string | null;
}) => api.post('/inquiries', payload);

export const updateInquiry = (id: string, payload: { customer: string; subject: string; message: string }) =>
  api.patch(`/inquiries/${id}`, payload);
