import { userAPI } from './../services/api';
import { message } from 'antd'

interface RequestOptions extends RequestInit {
    params?: Record<string, any>
}

class Request {
    private baseURL: string

    constructor(baseURL: string) {
        this.baseURL = baseURL || process.env.NEXT_PUBLIC_API_URL || ''
    }



    private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { params, ...customOptions } = options
        const url = new URL(this.baseURL + endpoint)

        // 添加查询参数
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, String(value))
            })
        }

        try {
            const headers = {}
            const response = await fetch(url.toString(), {
                ...customOptions,
                headers: {
                    ...headers,
                    ...customOptions.headers,
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data
        } catch (error) {
            message.error('请求失败，请重试')
            throw error
        }
    }

    public async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET', params })
    }

    public async post<T>(endpoint: string, data?: any, options: RequestOptions = {}): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    public async put<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        })
    }

    public async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' })
    }
}

export const request = new Request(process.env.NEXT_PUBLIC_API_URL || '') 