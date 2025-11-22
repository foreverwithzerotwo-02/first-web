import apiClient from './a_setting'

// 获取资讯
export const getNewsList = async (data?: {
    limit?: number | string,
    page?: number | string,
    pagesize?: number | string,
}) => {
    try {
        const response = await apiClient.get('/news/',{
            params: data
        });
        return response;
    }
    catch (error) {
        console.error('Error fetching news:', error);
        throw error;
    }
}