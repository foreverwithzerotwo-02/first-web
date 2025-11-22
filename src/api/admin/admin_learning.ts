import apiClient from '../a_setting'

// 获取全部课程分类
export const getAlllCourseCategorys = async () => {
    try {
        const response = await apiClient.get('/learning/admin/get_course_category_list/');
        return response;
    }
    catch (error) {
        console.error('Error fetching course_category:', error);
        throw error;
    }
}

// 根据课程分类id获取对应全部课程
export const getAlllCourseByCagegory = async (data: { id: number | string }) => {
    try {
        const response = await apiClient.post('/learning/admin/get_courses_by_category/', data);
        return response;
    }
    catch (error) {
        console.error('Error fetching course by category:', error);
        throw error;
    }
}

// 新增课程分类
export const addCourseCategory = async (data: { name: string, description: string }) => {
    try {
        const response = await apiClient.post('/learning/admin/add_course_category/', data);
        return response;
    }
    catch (error) {
        console.error('Error add category:', error);
        throw error;
    }
}

// 修改课程分类
export const updateCourseCategory = async (data: { id: number, name: string, description: string }) => {
    try {
        const response = await apiClient.post('/learning/admin/update_course_category_value/', data);
        return response;
    }
    catch (error) {
        console.error('Error update category:', error);
        throw error;
    }
}

// 修改课程分类排序
export const updateCourseCategoryOrder = async (data: { orders: { "id": number, "order": number }[] }) => {
    try {
        const response = await apiClient.post('/learning/admin/update_course_category_order/', data);
        return response;
    }
    catch (error) {
        console.error('Error update order category:', error);
        throw error;
    }
}

// 删除课程分类
export const deleteCourseCategory = async (id: number) => {
    try {
        const response = await apiClient.delete('/learning/admin/delete_course_category_value/' + id + '/');
        return response;
    }
    catch (error) {
        console.error('Error delete category:', error);
        throw error;
    }
}

// 获取全部课程信息
export const getAllCourses = async () => {
    try {
        const response = await apiClient.get('/learning/admin/get_course_list/');
        return response;
    }
    catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
}

// 新增课程信息
export const addCourse = async (courseData: any) => {
    try {
        const response = await apiClient.post('/learning/admin/add_course_value/', courseData);
        return response;
    }
    catch (error) {
        console.error('Error adding course:', error);
        throw error;
    }
}

// 修改课程信息
export const updateCourse = async (courseData: any) => {
    try {
        const response = await apiClient.post('/learning/admin/update_course_value/', courseData);
        return response;
    }
    catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
}

// 修改课程排序
export const updateCourseOrder = async (data: { orders: { "id": number, "order": number }[] }) => {
    try {
        const response = await apiClient.post('/learning/admin/update_course_order/', data);
        return response;
    }
    catch (error) {
        console.error('Error updating course order:', error);
        throw error;
    }
}

// 删除课程信息
export const deleteCourse = async (courseId: number) => {
    try {
        const response = await apiClient.delete('/learning/admin/delete_course_value/' + courseId + '/')
        return response;
    }
    catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
}

// 新增章节数据
export const addChapter = async (chapterData: any) => {
    try {
        const response = await apiClient.post('/learning/admin/add_chapter/', chapterData);
        return response;
    }
    catch (error) {
        console.error('Error adding chapter:', error);
        throw error;
    }
}

// 获取全部章节数据
export const getAllChapter = async (course_id: number | string) => {
    try {
        const response = await apiClient.get('/learning/admin/get_chapter_list/' + course_id + '/')
        return response
    }
    catch (error) {
        console.error('Error getting all chapters:', error);
        throw error;
    }
}

// 根据课程id 获取全部章节数据
export const getAllChapterByCourse = async (data: { id: string }) => {
    try {
        const response = await apiClient.post('/learning/admin/get_chapters_by_course/', data)
        return response
    }
    catch (error) {
        console.error('Error getting all chapters:', error);
        throw error;
    }
}

// 删除章节数据
export const deleteChapter = async (ids: Array<number>) => {
    try {
        const response = await apiClient.post('/learning/admin/delete_chapter/', { ids })
        return response
    }
    catch (error) {
        console.error('Error delete chapter:', error);
        throw error;
    }
}

// 更新章节数据
export const updateChapter = async (data: object) => {
    try {
        const response = await apiClient.post('/learning/admin/update_chapter/', data)
        return response
    }
    catch (error) {
        console.error('Error update chapter:', error);
        throw error;
    }
}

// 更新章节排序
export const updateChapterOrder = async (data: { orders: { "id": number, "order": number }[] }) => {
    try {
        const response = await apiClient.post('/learning/admin/update_chapter_order/', data)
        return response
    }
    catch (error) {
        console.error('Error update chapter order:', error);
        throw error;
    }
}

// 上传章节中的图片
export const uploadChapterImage = async (formData: FormData) => {
    try {
        const response = await apiClient.post('/learning/admin/upload_chapter_image/', formData)
        return response
    }
    catch (error) {
        console.error('Error upload chapter image:', error);
        throw error;
    }
}
