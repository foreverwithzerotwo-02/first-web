import apiClient from '../a_setting'

// 新增论坛分类
export const addForumCategory = async (data: {
    name: string,
    description: string
}) => {
    try {
        const response = await apiClient.post('/forum/admin/categories/create/', data);
        return response;
    }
    catch (error) {
        console.error('Error create forum category:', error);
        throw error;
    }
}

// 获取论坛分类
export const getForumCategories = async () => {
    try {
        const response = await apiClient.get('/forum/admin/categories/');
        return response;
    }
    catch (error) {
        console.error('Error get forum category:', error);
        throw error;
    }
}

// 修改论坛分类
export const updateForumCategories = async (id: number, data: {
    name: string,
    description: string
}) => {
    try {
        const response = await apiClient.put(`/forum/admin/categories/${id}/update/`, data);
        return response;
    }
    catch (error) {
        console.error('Error update forum category:', error);
        throw error;
    }
}

// 删除论坛分类
export const deleteForumCategories = async (id: number) => {
    try {
        const response = await apiClient.delete(`/forum/admin/categories/${id}/delete/`);
        return response;
    }
    catch (error) {
        console.error('Error delete forum category:', error);
        throw error;
    }
}