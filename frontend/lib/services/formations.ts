import api from '../api';

export interface Formation {
    id: string;
    name: string;
    duration: string;
    price: number;
    description?: string;
}

export const formationsService = {
    getAll: async () => {
        const response = await api.get<Formation[]>('/api/formations');
        return response.data;
    },

    create: async (data: Omit<Formation, 'id'>) => {
        const response = await api.post<Formation>('/api/formations', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Formation>) => {
        const response = await api.put<Formation>(`/api/formations/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        await api.delete(`/api/formations/${id}`);
    },

    getAnalytics: async () => {
        const response = await api.get<{
            totalFormations: number;
            totalInscriptions: number;
            totalRevenue: number;
            monthlyRevenue: number;
            recentInscriptions: any[];
        }>('/api/formations/analytics');
        return response.data;
    },
};
