import apiClient from '../a_setting'

// 更新用户角色
export const updateUserRole = async (data: { user_id: number, role: string }) => {
    try {
        const response = await apiClient.post('/users/admin/update_user_role/', data);
        return response;
    }
    catch (error) {
        console.error('Error updating user role:', error);
        throw error;
    }
}

// 获取用户角色列表（可选，如果需要从后端获取角色列表）
export const getUserRoles = async () => {
    try {
        const response = await apiClient.get('/users/admin/get_user_roles/');
        return response;
    }
    catch (error) {
        console.error('Error fetching user roles:', error);
        throw error;
    }
}










