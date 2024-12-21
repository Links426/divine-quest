import { createContext, useContext, useState, useEffect } from 'react'
import { userAPI } from '../services/api'
import { message } from 'antd'

interface UserInfo {
    username: string
    email: string
    phone: string
    avatar?: string
}

interface UserContextType {
    userInfo: UserInfo | null
    isLoading: boolean
    isLoggedIn: boolean
    updateUserInfo: () => Promise<void>
    logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const updateUserInfo = async () => {
        try {
            const data = await userAPI.getUserInfo({})
            setUserInfo(data)
        } catch (error) {
            console.error('Failed to fetch user info:', error)
            if (error instanceof Error && error.message === 'Unauthorized') {
                setUserInfo(null)
            } else {
                message.error('获取用户信息失败')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        setUserInfo(null)
        // 可以添加其他登出逻辑，如清除 cookie 等
    }

    useEffect(() => {
        updateUserInfo()
    }, [])

    return (
        <UserContext.Provider
            value={{
                userInfo,
                isLoading,
                isLoggedIn: !!userInfo,
                updateUserInfo,
                logout
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
} 