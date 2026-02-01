import api from '../api';

export const groupsService = {
    getAll: async (type?: string) => {
        const params = type ? { type } : {};
        const response = await api.get('/api/groups', { params });
        return response.data.data;
    },

    getById: async (id: string) => {
        const response = await api.get(`/api/groups/${id}`);
        return response.data.data;
    },

    create: async (data: any) => {
        const response = await api.post('/api/groups', data);
        return response.data.data;
    },

    update: async (id: string, data: any) => {
        const response = await api.put(`/api/groups/${id}`, data);
        return response.data.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/api/groups/${id}`);
        return response.data.data;
    }
};
