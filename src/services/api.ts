import axios from 'axios';
import { message } from 'antd';

// 创建 axios 实例
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api', // 设置你的 API 基础URL
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加token等认证信息
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 统一错误处理
    const errorMessage = error.response?.data?.message || '请求失败，请稍后重试';
    message.error(errorMessage);
    return Promise.reject(error);
  }
);

// 修改类型定义
interface AnalysisParams {
  birth_date: string
  birth_time: string
  birth_place: string
  gender: string
  blood_type?: string
  extra_info?: string
  is_lunar?: boolean
  is_leap_month?: boolean
}

interface AnalysisResponse {
  code: number
  message: string
  data: {
    destiny_analysis: string
    fortune_prediction: string
    suggestions: string
  }
}

// API 接口定义
export const destinyAPI = {
  // 修改命理分析接口
  analyze: async (data: AnalysisParams): Promise<AnalysisResponse> => {
    return api.post('/api/destiny_analyze', data);
  },

  // 关联分析接口
  analyzeCorrelation: async (data: any) => {
    return api.post('/destiny/correlation', data);
  }
};

export default api; 