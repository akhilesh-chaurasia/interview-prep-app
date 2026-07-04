import api from './client';

export const getDashboardStats = async () => {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
};

export const getAllUsers = async (page = 1, limit = 10) => {
    const response = await api.get('/api/admin/users', {
        params: { page, limit }
    });
    return response.data;
};

export const updateUserRole = async (userId, role) => {
    const response = await api.patch(`/api/admin/users/${userId}/role`, { role });
    return response.data;
};

export const deleteUser = async (userId) => {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response.data;
};
