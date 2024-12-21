import { message } from 'antd'

interface RequestOptions extends RequestInit {
  params?: Record<string, any>
  isStream?: boolean
  retries?: number
}

class Request {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || ''
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, isStream, retries = 3, ...customOptions } = options
    const url = new URL(this.baseURL + endpoint)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value))
      })
    }

    let lastError: Error | null = null
    
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url.toString(), {
          ...customOptions,
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            ...customOptions.headers,
          },
        })

        if (response.status === 401 || response.status === 403) {
          throw new Error('Unauthorized')
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        if (isStream) {
          return response as unknown as T
        }

        const data = await response.json()
        return data
      } catch (error) {
        lastError = error as Error
        console.error(`Request attempt ${i + 1} failed:`, error)
        
        if (i === retries - 1) {
          throw error
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
      }
    }

    throw lastError
  }

  public async post<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  public async postStream(endpoint: string, data?: any): Promise<Response> {
    return this.request<Response>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      isStream: true,
    })
  }
}

export const request = new Request(process.env.NEXT_PUBLIC_API_URL || '') 