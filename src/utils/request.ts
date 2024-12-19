import { message } from 'antd'

interface RequestOptions extends RequestInit {
  params?: Record<string, any>
  isStream?: boolean  // 添加标识是否为流请求
}

class Request {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || ''
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, isStream, ...customOptions } = options
    const url = new URL(this.baseURL + endpoint)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }

    try {
      const response = await fetch(url.toString(), {
        ...customOptions,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...customOptions.headers,
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // 如果是流请求，直接返回 response
      if (isStream) {
        return response as unknown as T
      }

      const data = await response.json()
      return data
    } catch (error) {
      message.error('请求失败，请重试')
      throw error
    }
  }

  public async post<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // 添加专门处理流请求的方法
  public async postStream(endpoint: string, data?: any): Promise<Response> {
    return this.request<Response>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      isStream: true,
    })
  }
}

export const request = new Request(process.env.NEXT_PUBLIC_API_URL || '') 