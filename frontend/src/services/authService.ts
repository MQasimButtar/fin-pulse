import api from '@/lib/api';
import { UserCreate, UserResponse, Token, LoginForm } from '@/types/auth';

export const authService = {
  async register(data: UserCreate): Promise<UserResponse> {
    const response = await api.post('/register', data);
    return response.data;
  },

  async login(data: LoginForm): Promise<Token> {
    const formData = new FormData();
    formData.append('username', data.email);
    formData.append('password', data.password);
    
    const response = await api.post('/token', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    
    return response.data;
  },

  async getMe(): Promise<UserResponse> {
    const response = await api.get('/users/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
  }
};
