import axios from 'axios';
import { useUserStore } from '@/stores/user';

// 基础URL
const API_BASE_URL = 'http://localhost:8000';

// 创建axios实例
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 设置超时时间为10秒
});

// 请求拦截器：每次请求自动带上 access token
apiClient.interceptors.request.use(
    (config) => {
        const authStore = useUserStore();
        if (authStore.access) {
            config.headers.Authorization = `Bearer ${authStore.access}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response.data,
    async (error) => {
        const authStore = useUserStore();
        const originalRequest = error.config;

        // 如果有响应，并且状态码是 401
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
                    refresh: authStore.refresh,
                });

                const newAccess = res.data.access;
                authStore.setTokens(newAccess, authStore.refresh);

                originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                return apiClient(originalRequest);
            } catch (err) {
                authStore.logout();
                return Promise.reject(err);
            }
        }

        // **处理无响应情况或者服务器错误**
        if (!error.response) {
            // 可能是网络错误或者后端没返回数据
            console.error('No response from server, logging out.');
            authStore.logout();
        }

        return Promise.reject(error);
    }
);


export default apiClient;
