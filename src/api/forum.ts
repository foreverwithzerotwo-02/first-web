import apiClient from './a_setting'

// 获取论坛帖子
export const getPosts = async (params?: { category?: number; page?: number; page_size?: number }) => {
    try {
        const response = await apiClient.get('/forum/posts/', { params });
        return response;
    }
    catch (error) {
        console.error('Error get posts:', error);
        throw error;
    }
}

// 获取对应用户论坛帖子
export const getUserPosts = async (data?: {
    page?: number | string
    page_size?: number | string
    limit?: number | string
}) => {
    try {
        const response = await apiClient.get('/forum/posts/user/', {
            params: data
        });
        return response;
    }
    catch (error) {
        console.error('Error get user posts:', error);
        throw error;
    }
}

// 获取单帖详情
export const getPostDetail = async (id: number | string) => {
    try {
        const response = await apiClient.get(`/forum/posts/${id}/`);
        return response;
    }
    catch (error) {
        console.error('Error get post detail:', error);
        throw error;
    }
}

// 创建论坛帖子
export const createPost = async (data: {
    title: string,
    content: string,
    category: string
}) => {
    try {
        const response = await apiClient.post('/forum/posts/create/', data);
        return response;
    }
    catch (error) {
        console.error('Error create post:', error);
        throw error;
    }
}

// 获取帖子草稿
export const getPostDrafts = async () => {
    try {
        const response = await apiClient.get('/forum/posts/drafts/');
        return response;
    }
    catch (error) {
        console.error('Error get post drafts:', error);
        throw error;
    }
}

// 删除帖子
export const deletePost = async (id: number | string) => {
    try {
        const response = await apiClient.delete(`/forum/posts/delete/${id}/`);
        return response;
    }
    catch (error) {
        console.error('Error delete post:', error);
        throw error;
    }
}

// 上传帖子插图
export const uploadPostImage = async (id: number | string, formData: FormData) => {
    try {
        const response = await apiClient.post(`/forum/posts/${id}/upload_image/`, formData);
        return response;
    }
    catch (error) {
        console.error('Error upload post image:', error);
        throw error;
    }
}

// 修改帖子
export const updatePost = async (id: number | string, data: {
    title?: string;
    content?: string;
    category?: number | string;
    is_draft?: boolean;
}) => {
    try {
        const response = await apiClient.put(`/forum/posts/${id}/update/`, data);
        return response;
    }
    catch (error) {
        console.error('Error update post:', error);
        throw error;
    }
}

// 点赞/取消点赞
export const toggleLikePost = async (id: number | string) => {
    try {
        const response = await apiClient.post(`/forum/posts/${id}/like/`);
        return response;
    }
    catch (error) {
        console.error('Error like post:', error);
        throw error;
    }
}

// 点赞/取消收藏
export const toggleFavoritePost = async (id: number | string) => {
    try {
        const response = await apiClient.post(`/forum/posts/${id}/favorite/`);
        return response;
    }
    catch (error) {
        console.error('Error favorite post:', error);
        throw error;
    }
}

// 创建评论
export const createComment = async (id: number | string, content: string, parentId?: number) => {
    try {
        const response = await apiClient.post(`/forum/posts/${id}/comments/create/`, {
            content,
            parent: parentId || null,
        });
        return response;
    }
    catch (error) {
        console.error('Error create comment:', error);
        throw error;
    }
}

// 获取评论
export const getComments = async (id: number | string) => {
    try {
        const response = await apiClient.get(`/forum/posts/${id}/comments/`);
        return response;
    }
    catch (error) {
        console.error('Error get comments:', error);
        throw error;
    }
}

// 删除评论
export const deleteComment = async (id: number | string) => {
    try {
        const response = await apiClient.delete(`/forum/comments/${id}/delete/`);
        return response;
    }
    catch (error) {
        console.error('Error delete comment:', error);
        throw error;
    }
}
