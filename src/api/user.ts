import apiClient from './a_setting'

interface ListUsersData {
  page?: number;
  page_size?: number;
  search?: string;
}

interface CreatedRoleData {
  name: string;
  permissions: string[]
}

interface RegisterData {
  username: string;
  password: string;
  password2: string;
  email: string
  nickname?: string;
  bio?: string;
}

interface RegisterResponse {
  message?: string;
  user_id?: number;
  errors?: Record<string, string[]>;
}

interface LoginData {
  username: string;
  password: string;
}

interface LoginResponse {
  refresh?: string,
  access?: string
}

// 分页获取全部用户或搜索用户列表
export const list_users = async (data: ListUsersData) => {
  try {
    const response = await apiClient.get('/users/list_users/', {
      params: data
    });
    return response;
  }
  catch (error) {
    console.error('Error get list_users:', error);
    throw error;
  }
}

// 获取全部或搜索用户角色列表
export const list_roles = async (keyword?: string) => {
  try {
    const response = await apiClient.get('/users/roles/', {
      params: keyword ? { keyword } : {}
    });
    return response;
  }
  catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
}

// 新增角色
export const created_role = async (data: CreatedRoleData) => {
  try {
    const response = await apiClient.post(`/users/roles/create/`, data);
    return response;
  }
  catch (error) {
    console.error('Error created_role:', error);
    throw error;
  }
}

// 编辑角色信息
export const update_role = async (role_id: number | string, data: CreatedRoleData) => {
  try {
    const response = await apiClient.put(`/users/roles/${role_id}/edit/`, data);
    return response;
  } catch (error) {
    console.error('Error update_role:', error);
    throw error;
  }
};

// 删除角色信息
export const delete_role = async (role_id: number | string) => {
  try {
    const response = await apiClient.delete(`/users/roles/${role_id}/delete/`);
    return response;
  } catch (error) {
    console.error('Error delete_role:', error);
    throw error;
  }
};

// 获取全部或搜索权限信息
export const get_all_permissions = async (params?: { search?: string }) => {
  try {
    const response = await apiClient.get('/users/permissions/', {
      params
    });
    return response;
  }
  catch (error) {
    console.error('Error get permissions:', error);
    throw error;
  }
}

// 新增权限
export const create_permission = async (data: { name: string; code: string }) => {
  try {
    const res = await apiClient.post("/users/permissions/create/", data);
    return res.data;
  } catch (e) {
    console.error("Error create_permission:", e);
    throw e;
  }
}

// 编辑权限信息
export const update_permission = async (id: number | string, data: { name: string; code: string }) => {
  try {
    const res = await apiClient.put(`/users/permissions/${id}/edit/`, data);
    return res.data;
  } catch (e) {
    console.error("Error update_permission:", e);
    throw e;
  }
};

// 删除权限信息
export const delete_permission = async (id: number | string) => {
  try {
    const res = await apiClient.delete(`/users/permissions/${id}/delete/`);
    return res.data;
  } catch (e) {
    console.error("Error delete_permission:", e);
    throw e;
  }
};

// 更新用户角色信息
export const update_roles = async (user_id: number, role_ids: number[]) => {
  try {
    const response = await apiClient.post(`/users/${user_id}/update_roles/`, {
      role_ids
    });
    return response;
  }
  catch (error) {
    console.error('Error update_roles:', error);
    throw error;
  }
}

// 注册用户
export const register = async (data: RegisterData) => {
  try {
    const response = await apiClient.post('/users/register/', data);
    return response as RegisterResponse;
  }
  catch (error) {
    console.error('Error register:', error);
    throw error;
  }
}

// 登录
export const login = async (data: LoginData) => {
  try {
    const response = await apiClient.post('/users/login/', data);
    return response as LoginResponse;
  }
  catch (error) {
    console.error('Error login:', error);
    throw error;
  }
}

// 修改密码
export const changePassword = async (data: {
  old_password: string,
  new_password: string
}) => {
  try {
    const response = await apiClient.post('/users/change_password_view/', data);
    return response;
  }
  catch (error) {
    console.error('Error change password:', error);
    throw error;
  }
}

// 获取用户信息
export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar: string | null; // avatar 可能为空
  bio: string;
  points: number;
  is_teacher: boolean;
  created_at: string; // ISO 字符串
  updated_at: string; // ISO 字符串
}
export const getUserInfo = async (): Promise<UserInfo> => {
  try {
    const response = await apiClient.get('/users/get_user_info/');
    return response as unknown as UserInfo; // 先 unknown 再断言 UserInfo
  } catch (error) {
    console.error('Error get user info:', error);
    throw error;
  }
};

// 修改密码
export const updateAvatar = async (formData: FormData) => {
  try {
    const response = await apiClient.patch('/users/update_avatar/', formData);
    return response;
  }
  catch (error) {
    console.error('Error update avatar:', error);
    throw error;
  }
}

// 更新用户信息
export const updateUserInfo = async (data: {
  username?: string,
  nickname?: string,
  bio?: string | null,
}) => {
  try {
    const response = await apiClient.post('/users/update_user_info/', data);
    return response;
  } catch (error) {
    console.error('Error update user info:', error);
    throw error;
  }
};