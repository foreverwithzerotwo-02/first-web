import apiClient from './a_setting'

// 获取指定课程
export const fetchCoursesByIds = async (ids: number[]) => {
    try {
        const query = ids.join(",")   // 比如 [1,2,3] -> "1,2,3"
        const response = await apiClient.get('/learning/courses/', {
            params: { ids: query }
        });
        return response;
    }
    catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
}

// 获取最受欢迎课程
export const getAllPopularCourse = async (limit: number = 5) => {
    try {
        const response = await apiClient.get('/learning/courses/popular/', {
            params: { limit }
        });
        return response;
    }
    catch (error) {
        console.error('Error fetching popular chapters:', error);
        throw error;
    }
}

// 获取全部收藏课程信息
export const getAllFavoriteCourse = async () => {
    try {
        const response = await apiClient.get('/learning/courses/favorite/');
        return response;
    }
    catch (error) {
        console.error('Error fetching chapters:', error);
        throw error;
    }
}

// 收藏课程
export const favoriteCourse = async (course_id: number | string) => {
    try {
        const response = await apiClient.post('/learning/courses/' + course_id + '/favorite/', {});
        return response;
    }
    catch (error) {
        console.error('Error fetching chapters:', error);
        throw error;
    }
}

// 取消收藏课程
export const cancelFavoriteCourse = async (course_id: number | string) => {
    try {
        const response = await apiClient.delete('/learning/courses/' + course_id + '/favorite/');
        return response;
    }
    catch (error) {
        console.error('Error fetching chapters:', error);
        throw error;
    }
}

// 根据课程id 获取对应全部已发布章节
// id：课程id
export const getPublishedChapterByCourse = async (course_id: number | string) => {
    try {
        const response = await apiClient.get('/learning/get_published_chapters/' + course_id + '/');
        return response;
    }
    catch (error) {
        console.error('Error fetching chapters:', error);
        throw error;
    }
}

// 给课程评分
interface RateCourseResponse {
    message: string;       // 提示信息
    course_id: number;     // 课程 ID
    rating: number;        // 平均评分（1 位小数）
    rating_count: number;  // 评分人数
}
export const rateCourse = async (course_id: number | string, score: number) => {
    try {
        const response = await apiClient.post('/learning/courses/' + course_id + '/rate/', { score });
        return response as unknown as RateCourseResponse;
    }
    catch (error) {
        console.error('Error rate course:', error);
        throw error;
    }
}

// 记录用户浏览课程
export const recordCourseView = async (course_id: number | string) => {
    try {
        const response = await apiClient.post('/learning/courses/' + course_id + '/view/', {});
        return response;
    }
    catch (error) {
        console.error('Error record course view:', error);
        throw error;
    }
}

// 获取用户课程浏览记录
export const getUserCourseHistory = async (limit = 20) => {
    try {
        const response = await apiClient.get('/learning/users/view-history/', {
            params: { limit },
        });
        return response;
    }
    catch (error) {
        console.error('Error get course history:', error);
        throw error;
    }
}

// 删除单条浏览记录
export const deleteCourseViewHistory = async (historyId: number) => {
    try {
        const response = await apiClient.delete(`/learning/course/history/${historyId}/`);
        return response;
    }
    catch (error) {
        console.error('Error delete course history:', error);
        throw error;
    }
}

// 清空浏览记录
export const clearCourseViewHistory = async () => {
    try {
        const response = await apiClient.delete(`/learning/course/history/clear/`);
        return response;
    }
    catch (error) {
        console.error('Error clear course history:', error);
        throw error;
    }
}