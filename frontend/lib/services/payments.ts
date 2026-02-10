import api from '../api';
import type { Payment, PaymentFormData, ApiResponse } from '@/types';

export async function getPayments(): Promise<Payment[]> {
    const response = await api.get<ApiResponse<Payment[]>>('/api/payments');
    return response.data.data;
}

export async function getPaymentById(id: string): Promise<Payment> {
    const response = await api.get<ApiResponse<Payment>>(`/api/payments/${id}`);
    return response.data.data;
}

export async function createSalaryPayment(data: any): Promise<any> {
    const response = await api.post('/api/payments/salary', data);
    return response.data.data;
}

export async function createPayment(data: PaymentFormData): Promise<Payment> {
    const response = await api.post<ApiResponse<Payment>>('/api/payments', data);
    return response.data.data;
}

export async function getPaymentAnalytics() {
    const response = await api.get<ApiResponse<{
        totalReceivedMonth: number;
    }>>('/api/payments/analytics');
    return response.data.data;
}
