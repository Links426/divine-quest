import { request } from '../utils/request'

// API 接口定义
interface LoginParams {
  username?: string
  email?: string
  phone?: string
  password: string
}

interface QuickLoginParams {
  input: string
  code: string
  tag: number
}

interface RegisterParams {
  Account: string
  Phone?: string
  Email: string
  Password: string
}

interface VerifyCodeParams {
  input: string
  tag: number
}

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

export interface CorrelationAnalysisParams {
  event_list: [
    { description: string },
    { description: string }
  ]
  analyze_options: {
    time_range: 'MONTH1' | 'MONTH3' | 'MONTH6' | 'YEAR1'
    use_constellation: boolean
    use_zodia: boolean
    analyze_depth: 'SIMPLE' | 'NORMAL' | 'DEEP'
  }
  extra_info?: string
}

interface NamingParams {
  last_name: string
  gender: '男' | '女'
  extra_info?: string
}

// 命理相关的 API 分组
export const destinyAPI = {
  // 命理分析
  analyze: (data: AnalysisParams) => {
    return request.post('/api/destiny_analyze', data)
  },

  // 关联分析
  analyzeCorrelation: (data: CorrelationAnalysisParams) => {
    return request.post('/api/correlation_analyze', data)
  },

  // 智能起名
  analyzeName: (data: NamingParams) => {
    return request.post('/api/name_oracle', data)
  },
}

// 移除之前的 userAPI 中的分析相关接口
export const userAPI = {
  login: (data: LoginParams) => {
    return request.post('/usr/api/login', data)
  },

  quickLogin: (data: QuickLoginParams) => {
    return request.post('/usr/api/quick_login', data)
  },

  register: (data: RegisterParams) => {
    return request.post('/usr/api/register', data)
  },

  sendVerifyCode: (data: VerifyCodeParams) => {
    return request.post('/validator/api/send_verify_code', data)
  },
  getWebId: (data: any) => {
    return request.post('/sys/api/create_info', data)
  }
}

export const systemAPI = {
  createWebInfo: () => {
    return request.post('/sys/api/create_info')
  },
}

// ... 其他 API 分组