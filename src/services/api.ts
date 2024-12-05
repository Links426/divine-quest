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
    body: ReadableStream<Uint8Array>
    destiny_analysis: string
    fortune_prediction: string
    suggestions: string
  }
}

// 关联性分析请求参数接口
export interface CorrelationAnalysisParams {
  event_list: [
    {
      description: string
    },
    {
      description: string
    },
  ]
  analyze_options: {
    time_range: 'MONTH1' | 'MONTH3' | 'MONTH6' | 'YEAR1'
    use_constellation: boolean
    use_zodia: boolean
    analyze_depth: 'SIMPLE' | 'NORMAL' | 'DEEP'
  }
  extra_info?: string
}

// 添加起名请求参数接口
interface NamingParams {
  last_name: string
  gender: '男' | '女'
  extra_info?: string
}

// API 接口定义
export const destinyAPI = {
  // 修改命理分析接口，使用 fetch
  analyze: async (data: AnalysisParams): Promise<Response> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/destiny_analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Analysis failed')
    }

    return response
  },

  // 修改关联分析接口
  analyzeCorrelation: async (data: CorrelationAnalysisParams): Promise<Response> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/correlation_analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_list: data.event_list,
        analyze_options: {
          time_range: data.analyze_options.time_range,
          use_constellation: data.analyze_options.use_constellation,
          use_zodia: data.analyze_options.use_zodia,
          analyze_depth: data.analyze_options.analyze_depth
        },
        extra_info: data.extra_info
      }),
    })

    if (!response.ok) {
      throw new Error('Correlation analysis failed')
    }

    return response
  },

  // 添加智能起名接口
  analyzeName: async (data: NamingParams): Promise<Response> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/name_oracle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error('Name analysis failed')
    }

    return response
  }
}

export default api; 